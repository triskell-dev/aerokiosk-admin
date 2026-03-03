/**
 * AeroKiosk — Club Admin — app.js
 *
 * Logique de l'interface web admin pour gérer les slides club.
 * Détection automatique : API locale (WiFi) ou Supabase (distant).
 * HTML/CSS/JS pur, pas de framework.
 */

// ── SUPABASE CONFIG ──
const SUPABASE_URL = 'https://yfucrljbqdoiuqmgvrjx.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_85vUBMn6NPS6loJefBuZ8A_v7I_TakV';
const STORAGE_BUCKET = 'club-slides';

function supabaseHeaders(extra) {
  return {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
    ...extra
  };
}

// ── API CLIENT ──
class ApiClient {
  constructor() {
    this.mode = this._detectMode(); // 'local' or 'supabase'
    this.token = sessionStorage.getItem('clubAdminToken') || null;
    this.licenseKey = sessionStorage.getItem('clubAdminLicenseKey') || null;
    this.clubName = '';
    this.station = '';
  }

  _detectMode() {
    const host = window.location.hostname;
    const isLocal = host === 'localhost'
      || host === '127.0.0.1'
      || /^192\.168\./.test(host)
      || /^10\./.test(host)
      || /^172\.(1[6-9]|2\d|3[01])\./.test(host);
    return isLocal ? 'local' : 'supabase';
  }

  // ── LOGIN ──

  async login(licenseKey, password) {
    if (this.mode === 'local') {
      return this._loginLocal(licenseKey, password);
    } else {
      return this._loginSupabase(licenseKey, password);
    }
  }

  async _loginLocal(licenseKey, password) {
    const resp = await fetch(window.location.origin + '/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ licenseKey, password })
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || 'login_failed');
    this.token = data.token;
    this.licenseKey = licenseKey;
    this.clubName = data.clubName || '';
    this.station = data.station || '';
    sessionStorage.setItem('clubAdminToken', this.token);
    sessionStorage.setItem('clubAdminLicenseKey', licenseKey);
    return data;
  }

  async _loginSupabase(licenseKey, password) {
    // Vérifier licence + mot de passe via RPC Supabase
    const resp = await fetch(SUPABASE_URL + '/rest/v1/rpc/verify_club_admin', {
      method: 'POST',
      headers: supabaseHeaders(),
      body: JSON.stringify({ p_key: licenseKey, p_password: password })
    });

    if (!resp.ok) throw new Error('server_error');
    const result = await resp.json();
    if (!result.authenticated) throw new Error(result.error || 'login_failed');

    this.licenseKey = licenseKey;
    sessionStorage.setItem('clubAdminLicenseKey', licenseKey);

    // Récupérer les infos du club depuis la table licenses
    try {
      const infoResp = await fetch(
        SUPABASE_URL + '/rest/v1/licenses?key=eq.' + encodeURIComponent(licenseKey) + '&select=icao',
        { headers: supabaseHeaders() }
      );
      if (infoResp.ok) {
        const rows = await infoResp.json();
        if (rows.length > 0) {
          this.station = rows[0].icao || '';
        }
      }
    } catch (e) {
      // Pas grave si on ne récupère pas les infos
    }

    return { valid: true, station: this.station };
  }

  // ── LOGOUT ──

  logout() {
    this.token = null;
    this.licenseKey = null;
    this.clubName = '';
    this.station = '';
    sessionStorage.removeItem('clubAdminToken');
    sessionStorage.removeItem('clubAdminLicenseKey');
  }

  // ── GET SLIDES ──

  async getSlides() {
    if (this.mode === 'local') {
      return this._getSlidesLocal();
    } else {
      return this._getSlidesSupabase();
    }
  }

  async _getSlidesLocal() {
    const resp = await this._fetchLocal('/api/slides');
    return resp.json();
  }

  async _getSlidesSupabase() {
    const now = new Date().toISOString();
    const resp = await fetch(
      SUPABASE_URL + '/rest/v1/club_slides?license_key=eq.' + encodeURIComponent(this.licenseKey)
        + '&order=sort_order.asc,created_at.asc',
      { headers: supabaseHeaders() }
    );
    if (!resp.ok) throw new Error('Erreur chargement slides');
    const slides = await resp.json();
    // Filtrer les expirés
    return slides.filter(s => !s.expires_at || s.expires_at > now);
  }

  // ── CREATE SLIDE ──

  async createSlide(data) {
    if (this.mode === 'local') {
      return this._createSlideLocal(data);
    } else {
      return this._createSlideSupabase(data);
    }
  }

  async _createSlideLocal(data) {
    const resp = await this._fetchLocal('/api/slides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return resp.json();
  }

  async _createSlideSupabase(data) {
    const resp = await fetch(SUPABASE_URL + '/rest/v1/club_slides', {
      method: 'POST',
      headers: supabaseHeaders({ 'Prefer': 'return=representation' }),
      body: JSON.stringify({
        license_key: this.licenseKey,
        mode: data.mode || 'slide',
        format: data.format || 'text',
        content: data.content || '',
        image_path: data.image_path || null,
        label: data.label || '',
        author: data.author || '',
        duration: data.duration || 15,
        enabled: true,
        expires_at: data.expires_at || null,
        sort_order: data.sort_order || 0
      })
    });
    if (!resp.ok) throw new Error('Erreur création slide');
    const rows = await resp.json();
    return rows[0] || null;
  }

  // ── UPDATE SLIDE ──

  async updateSlide(id, data) {
    if (this.mode === 'local') {
      return this._updateSlideLocal(id, data);
    } else {
      return this._updateSlideSupabase(id, data);
    }
  }

  async _updateSlideLocal(id, data) {
    const resp = await this._fetchLocal('/api/slides/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return resp.json();
  }

  async _updateSlideSupabase(id, data) {
    const resp = await fetch(
      SUPABASE_URL + '/rest/v1/club_slides?id=eq.' + encodeURIComponent(id),
      {
        method: 'PATCH',
        headers: supabaseHeaders({ 'Prefer': 'return=representation' }),
        body: JSON.stringify(data)
      }
    );
    if (!resp.ok) throw new Error('Erreur mise à jour');
    const rows = await resp.json();
    return rows[0] || null;
  }

  // ── DELETE SLIDE ──

  async deleteSlide(id) {
    if (this.mode === 'local') {
      return this._deleteSlideLocal(id);
    } else {
      return this._deleteSlideSupabase(id);
    }
  }

  async _deleteSlideLocal(id) {
    const resp = await this._fetchLocal('/api/slides/' + id, { method: 'DELETE' });
    return resp.json();
  }

  async _deleteSlideSupabase(id) {
    // Récupérer le slide pour supprimer l'image du storage si besoin
    const getResp = await fetch(
      SUPABASE_URL + '/rest/v1/club_slides?id=eq.' + encodeURIComponent(id) + '&select=image_path',
      { headers: supabaseHeaders() }
    );
    if (getResp.ok) {
      const rows = await getResp.json();
      if (rows.length > 0 && rows[0].image_path) {
        // Supprimer l'image du storage
        await fetch(
          SUPABASE_URL + '/storage/v1/object/' + STORAGE_BUCKET + '/' + rows[0].image_path,
          { method: 'DELETE', headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + SUPABASE_ANON_KEY } }
        );
      }
    }

    const resp = await fetch(
      SUPABASE_URL + '/rest/v1/club_slides?id=eq.' + encodeURIComponent(id),
      { method: 'DELETE', headers: supabaseHeaders() }
    );
    return { success: resp.ok };
  }

  // ── UPLOAD IMAGE ──

  async uploadImage(file) {
    if (this.mode === 'local') {
      return this._uploadLocal(file);
    } else {
      return this._uploadSupabase(file);
    }
  }

  async _uploadLocal(file) {
    const formData = new FormData();
    formData.append('image', file);
    const resp = await this._fetchLocal('/api/upload', {
      method: 'POST',
      body: formData
    });
    return resp.json(); // { filename }
  }

  async _uploadSupabase(file) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = this.licenseKey + '/' + Date.now() + '-' + safeName;
    const resp = await fetch(
      SUPABASE_URL + '/storage/v1/object/' + STORAGE_BUCKET + '/' + storagePath,
      {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
          'Content-Type': file.type,
          'x-upsert': 'true'
        },
        body: file
      }
    );
    if (!resp.ok) throw new Error('Upload failed');
    return { image_path: storagePath };
  }

  // ── GET CONFIG (local only) ──

  async getConfig() {
    if (this.mode === 'local') {
      const resp = await this._fetchLocal('/api/config');
      return resp.json();
    } else {
      // En mode distant, on retourne les infos stockées
      return { station: this.station, clubName: this.clubName };
    }
  }

  // ── IMAGE URL HELPER ──

  getImageUrl(slide) {
    if (this.mode === 'local') {
      const file = slide.image_file || slide.local_image_file;
      return file ? '/uploads/' + file : '';
    } else {
      return slide.image_path
        ? SUPABASE_URL + '/storage/v1/object/public/' + STORAGE_BUCKET + '/' + slide.image_path
        : '';
    }
  }

  // ── LOCAL FETCH HELPER ──

  async _fetchLocal(url, options = {}) {
    const headers = { ...options.headers };
    if (this.token) headers['X-Session-Token'] = this.token;
    const resp = await fetch(window.location.origin + url, { ...options, headers });
    if (resp.status === 401) {
      this.logout();
      showLogin();
      throw new Error('Session expirée');
    }
    return resp;
  }
}

const api = new ApiClient();

// ── DOM REFERENCES ──
const loginScreen = document.getElementById('loginScreen');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const loginBtn = document.getElementById('loginBtn');
const clubNameEl = document.getElementById('clubName');
const stationBadge = document.getElementById('stationBadge');
const logoutBtn = document.getElementById('logoutBtn');
const slidesList = document.getElementById('slidesList');
const modalOverlay = document.getElementById('modalOverlay');
const addForm = document.getElementById('addForm');

// ── STATE ──
let slides = [];
let pendingFile = null;

// ── LOGIN ──
function showLogin() {
  loginScreen.style.display = 'flex';
  dashboard.classList.remove('visible');
}

function showDashboard() {
  loginScreen.style.display = 'none';
  dashboard.classList.add('visible');
  clubNameEl.textContent = api.clubName || 'AEROKIOSK';
  stationBadge.textContent = api.station || '';

  // Afficher un badge mode
  const modeIndicator = document.getElementById('modeIndicator');
  if (modeIndicator) {
    modeIndicator.textContent = api.mode === 'local' ? 'WiFi local' : 'Cloud';
    modeIndicator.className = 'mode-badge mode-' + api.mode;
  }

  refreshSlides();
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.textContent = '';
  loginBtn.disabled = true;
  const key = document.getElementById('licenseKey').value.trim();
  const pwd = document.getElementById('password').value;
  try {
    await api.login(key, pwd);
    showDashboard();
  } catch (err) {
    if (err.message === 'invalid_license') {
      loginError.textContent = 'Clé de licence invalide';
    } else if (err.message === 'invalid_password') {
      loginError.textContent = 'Mot de passe incorrect';
    } else if (err.message === 'server_error') {
      loginError.textContent = 'Erreur serveur — vérifiez votre connexion';
    } else {
      loginError.textContent = 'Erreur de connexion';
    }
  }
  loginBtn.disabled = false;
});

logoutBtn.addEventListener('click', () => {
  api.logout();
  showLogin();
});

// ── MOT DE PASSE OUBLIÉ ──
document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('resetView').style.display = '';
  document.getElementById('resetError').textContent = '';
  document.getElementById('resetSuccess').style.display = 'none';
  document.getElementById('resetLicenseKey').value = document.getElementById('licenseKey').value || '';
  document.getElementById('resetLicenseKey').focus();
});

document.getElementById('resetBackLink').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('resetView').style.display = 'none';
  document.getElementById('loginForm').style.display = '';
});

document.getElementById('resetBtn').addEventListener('click', async () => {
  const resetBtn = document.getElementById('resetBtn');
  const errorEl = document.getElementById('resetError');
  const successEl = document.getElementById('resetSuccess');
  errorEl.textContent = '';
  successEl.style.display = 'none';

  const key = document.getElementById('resetLicenseKey').value.trim();
  if (!key) { errorEl.textContent = 'Entrez votre clé de licence.'; return; }

  resetBtn.disabled = true;

  try {
    if (api.mode === 'local') {
      // Mode local : appeler l'API du serveur kiosque
      const resp = await fetch(window.location.origin + '/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseKey: key })
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) throw new Error('invalid_key');
    } else {
      // Mode Supabase : vérifier que la clé existe, puis effacer le hash
      const checkResp = await fetch(
        SUPABASE_URL + '/rest/v1/licenses?key=eq.' + encodeURIComponent(key) + '&select=key',
        { headers: supabaseHeaders() }
      );
      if (!checkResp.ok) throw new Error('server_error');
      const rows = await checkResp.json();
      if (rows.length === 0) throw new Error('invalid_key');

      // Effacer le mot de passe admin dans Supabase
      const updateResp = await fetch(
        SUPABASE_URL + '/rest/v1/licenses?key=eq.' + encodeURIComponent(key),
        {
          method: 'PATCH',
          headers: supabaseHeaders(),
          body: JSON.stringify({ admin_password_hash: null })
        }
      );
      if (!updateResp.ok) throw new Error('server_error');
    }

    // Succès
    successEl.textContent = 'Mot de passe supprimé. Vous pouvez maintenant vous connecter sans mot de passe, puis en définir un nouveau dans les paramètres du kiosque.';
    successEl.style.display = '';
    errorEl.textContent = '';
  } catch (err) {
    if (err.message === 'invalid_key') {
      errorEl.textContent = 'Clé de licence incorrecte.';
    } else {
      errorEl.textContent = 'Erreur serveur — vérifiez votre connexion.';
    }
  }

  resetBtn.disabled = false;
});

// ── SLIDES LIST ──
async function refreshSlides() {
  try {
    slides = await api.getSlides();
    renderSlides();
  } catch (e) {
    console.error('Error loading slides:', e);
  }
}

function renderSlides() {
  if (slides.length === 0) {
    slidesList.innerHTML = '<div class="empty-state">'
      + '<div class="icon">📋</div>'
      + '<p>Aucun contenu pour le moment.<br>Ajoutez un slide, un flash info ou un flash urgent.</p>'
      + '</div>';
    return;
  }

  slidesList.innerHTML = slides.map(s => {
    const badgeClass = s.mode === 'flash-urgent' ? 'badge-flash-urgent'
      : s.mode === 'flash-info' ? 'badge-flash-info' : 'badge-slide';
    const badgeText = s.mode === 'flash-urgent' ? 'URGENT'
      : s.mode === 'flash-info' ? 'INFO' : 'SLIDE';
    const checked = s.enabled !== false ? 'checked' : '';
    const disabledClass = s.enabled === false ? ' disabled' : '';

    let preview = '';
    if (s.format === 'image' && (s.image_file || s.local_image_file || s.image_path)) {
      const imgUrl = api.getImageUrl(s);
      preview = imgUrl ? '<img src="' + escapeHtml(imgUrl) + '" alt="">' : '';
    } else {
      preview = '<div class="slide-preview-text">' + escapeHtml(s.content || '') + '</div>';
    }

    let meta = s.duration + 's';
    if (s.expires_at) {
      const exp = new Date(s.expires_at);
      meta += ' · Expire ' + exp.toLocaleDateString('fr-FR');
    }
    if (s.source === 'remote') meta += ' · Cloud';

    return '<div class="slide-card' + disabledClass + '" data-id="' + s.id + '">'
      + '<div class="slide-preview">' + preview + '</div>'
      + '<div class="slide-info">'
      + '  <div class="slide-info-top">'
      + '    <span class="slide-label">' + escapeHtml(s.label || 'Sans titre') + '</span>'
      + '    <span class="badge ' + badgeClass + '">' + badgeText + '</span>'
      + '  </div>'
      + '  <div class="slide-meta">' + meta + '</div>'
      + '</div>'
      + '<div class="slide-actions">'
      + '  <label class="toggle-switch"><input type="checkbox" ' + checked + ' onchange="toggleSlide(\'' + s.id + '\', this.checked)"><span class="toggle-track"></span><span class="toggle-knob"></span></label>'
      + '  <button class="btn-delete" onclick="deleteSlide(\'' + s.id + '\')" title="Supprimer">✕</button>'
      + '</div>'
      + '</div>';
  }).join('');
}

// ── TOGGLE / DELETE ──
async function toggleSlide(id, enabled) {
  try {
    await api.updateSlide(id, { enabled });
    await refreshSlides();
  } catch (e) {
    console.error('Toggle error:', e);
  }
}

async function deleteSlide(id) {
  if (!confirm('Supprimer ce contenu ?')) return;
  try {
    await api.deleteSlide(id);
    await refreshSlides();
  } catch (e) {
    console.error('Delete error:', e);
  }
}

// ── MODAL ADD ──
function openModal(mode) {
  document.getElementById('addMode').value = mode || 'slide';
  document.getElementById('addFormat').value = 'text';
  document.getElementById('addLabel').value = '';
  document.getElementById('addContent').value = '';
  document.getElementById('addDuration').value = '15';
  document.getElementById('addExpires').value = '';
  document.getElementById('filePreview').innerHTML = '';
  pendingFile = null;
  updateFormatUI();
  modalOverlay.classList.add('visible');

  // Mettre à jour le titre du modal
  const titles = {
    'slide': 'Ajouter un slide',
    'flash-info': 'Ajouter un flash info',
    'flash-urgent': 'Ajouter un flash urgent'
  };
  document.getElementById('modalTitle').textContent = titles[mode] || 'Ajouter';
}

function closeModal() {
  modalOverlay.classList.remove('visible');
  pendingFile = null;
}

function updateFormatUI() {
  const format = document.getElementById('addFormat').value;
  document.getElementById('textGroup').style.display = format === 'text' ? 'block' : 'none';
  document.getElementById('imageGroup').style.display = format === 'image' ? 'block' : 'none';
}

document.getElementById('addFormat').addEventListener('change', updateFormatUI);

// File upload preview
document.getElementById('addFile').addEventListener('change', function() {
  const file = this.files[0];
  if (!file) return;
  pendingFile = file;
  const preview = document.getElementById('filePreview');
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.innerHTML = '<img src="' + e.target.result + '" alt="preview">';
    };
    reader.readAsDataURL(file);
  } else {
    preview.innerHTML = '<span style="color:var(--text-dim)">' + escapeHtml(file.name) + '</span>';
  }
});

addForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = addForm.querySelector('.btn-submit');
  submitBtn.disabled = true;

  const mode = document.getElementById('addMode').value;
  const format = document.getElementById('addFormat').value;
  const label = document.getElementById('addLabel').value.trim();
  const content = document.getElementById('addContent').value;
  const duration = parseInt(document.getElementById('addDuration').value) || 15;
  const expiresVal = document.getElementById('addExpires').value;
  const expires_at = expiresVal ? new Date(expiresVal).toISOString() : null;

  try {
    let image_file = null;
    let image_path = null;

    // Upload image si format = image
    if (format === 'image' && pendingFile) {
      const uploadResult = await api.uploadImage(pendingFile);
      if (api.mode === 'local') {
        image_file = uploadResult.filename;
      } else {
        image_path = uploadResult.image_path;
      }
    }

    await api.createSlide({
      mode,
      format,
      label: label || (mode === 'flash-urgent' ? 'URGENT' : mode === 'flash-info' ? 'INFO' : 'Slide'),
      content: format === 'text' ? content : '',
      image_file,
      image_path,
      duration,
      expires_at
    });

    closeModal();
    await refreshSlides();
  } catch (err) {
    console.error('Create error:', err);
    alert('Erreur lors de la création');
  }
  submitBtn.disabled = false;
});

// Close modal on overlay click
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// ── UTILS ──
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ── AUTO-INIT ──
// Si une session existe, tenter de la restaurer
(async function init() {
  if (api.mode === 'local' && api.token) {
    // Mode local : vérifier que le token est encore valide
    try {
      const cfg = await api.getConfig();
      api.clubName = cfg.clubName || '';
      api.station = cfg.station || '';
      showDashboard();
    } catch (e) {
      showLogin();
    }
  } else if (api.mode === 'supabase' && api.licenseKey) {
    // Mode Supabase : vérifier que la licence est valide
    try {
      await api.getSlides(); // si ça marche, on est connecté
      // Récupérer les infos station
      const infoResp = await fetch(
        SUPABASE_URL + '/rest/v1/licenses?key=eq.' + encodeURIComponent(api.licenseKey) + '&select=icao',
        { headers: supabaseHeaders() }
      );
      if (infoResp.ok) {
        const rows = await infoResp.json();
        if (rows.length > 0) api.station = rows[0].icao || '';
      }
      showDashboard();
    } catch (e) {
      showLogin();
    }
  }
})();
