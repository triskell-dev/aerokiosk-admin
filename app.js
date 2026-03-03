/**
 * AeroKiosk — Club Admin — app.js
 *
 * Logique de l'interface web admin pour gérer les slides club.
 * Détection automatique : API locale (WiFi) ou Supabase (distant).
 * HTML/CSS/JS pur, pas de framework.
 * i18n : FR / DE / IT / ES / EN (fallback)
 */

// ── i18n ──

const TRANSLATIONS = {
  fr: {
    'pageTitle': 'AeroKiosk — Gestion affichage',
    'login.subtitle': 'Gestion de l\'affichage club',
    'login.licenseKey': 'Clé de licence',
    'login.licensePlaceholder': 'AERO-XXXX-XXXX-XXXX',
    'login.password': 'Mot de passe admin',
    'login.passwordPlaceholder': 'Mot de passe',
    'login.submit': 'Connexion',
    'login.forgotPassword': 'Mot de passe oublié ?',
    'login.errorInvalidLicense': 'Clé de licence invalide',
    'login.errorInvalidPassword': 'Mot de passe incorrect',
    'login.errorServer': 'Erreur serveur — vérifiez votre connexion',
    'login.errorGeneric': 'Erreur de connexion',
    'reset.subtitle': 'Réinitialisation du mot de passe',
    'reset.instructions': 'Entrez votre clé de licence pour supprimer le mot de passe admin. Vous pourrez ensuite en définir un nouveau dans les paramètres du kiosque.',
    'reset.button': 'Réinitialiser',
    'reset.back': '\u2190 Retour à la connexion',
    'reset.errorEmpty': 'Entrez votre clé de licence.',
    'reset.errorInvalidKey': 'Clé de licence incorrecte.',
    'reset.errorServer': 'Erreur serveur — vérifiez votre connexion.',
    'reset.success': 'Mot de passe supprimé. Vous pouvez maintenant vous connecter sans mot de passe, puis en définir un nouveau dans les paramètres du kiosque.',
    'dashboard.logout': 'Déconnexion',
    'dashboard.modeLocal': 'WiFi local',
    'dashboard.modeCloud': 'Cloud',
    'slides.addSlide': 'Slide',
    'slides.addFlashInfo': 'Flash info',
    'slides.addFlashUrgent': 'Flash urgent',
    'slides.emptyText': 'Aucun contenu pour le moment.<br>Ajoutez un slide, un flash info ou un flash urgent.',
    'slides.noTitle': 'Sans titre',
    'slides.expires': 'Expire',
    'slides.deleteConfirm': 'Supprimer ce contenu ?',
    'slides.deleteTitle': 'Supprimer',
    'modal.addSlide': 'Ajouter un slide',
    'modal.addFlashInfo': 'Ajouter un flash info',
    'modal.addFlashUrgent': 'Ajouter un flash urgent',
    'modal.addFallback': 'Ajouter',
    'modal.labelField': 'Nom / Titre',
    'modal.labelPlaceholder': 'ex : Photo du club',
    'modal.formatField': 'Format',
    'modal.formatText': 'Texte',
    'modal.formatImage': 'Image',
    'modal.contentField': 'Contenu',
    'modal.contentPlaceholder': 'Votre message...',
    'modal.imageLabel': 'Image (JPG, PNG, SVG)',
    'modal.imageUpload': 'Cliquez ou glissez une image',
    'modal.duration': 'Durée (secondes)',
    'modal.expires': 'Expiration (optionnel)',
    'modal.cancel': 'Annuler',
    'modal.publish': 'Publier',
    'modal.errorCreate': 'Erreur lors de la création',
    'error.loadSlides': 'Erreur chargement slides',
    'error.createSlide': 'Erreur création slide',
    'error.updateSlide': 'Erreur mise à jour',
    'error.sessionExpired': 'Session expirée'
  },

  de: {
    'pageTitle': 'AeroKiosk — Anzeigeverwaltung',
    'login.subtitle': 'Club-Anzeige verwalten',
    'login.licenseKey': 'Lizenzschlüssel',
    'login.licensePlaceholder': 'AERO-XXXX-XXXX-XXXX',
    'login.password': 'Admin-Passwort',
    'login.passwordPlaceholder': 'Passwort',
    'login.submit': 'Anmelden',
    'login.forgotPassword': 'Passwort vergessen?',
    'login.errorInvalidLicense': 'Ungültiger Lizenzschlüssel',
    'login.errorInvalidPassword': 'Falsches Passwort',
    'login.errorServer': 'Serverfehler — überprüfen Sie Ihre Verbindung',
    'login.errorGeneric': 'Anmeldefehler',
    'reset.subtitle': 'Passwort zurücksetzen',
    'reset.instructions': 'Geben Sie Ihren Lizenzschlüssel ein, um das Admin-Passwort zu löschen. Sie können anschließend ein neues in den Kiosk-Einstellungen festlegen.',
    'reset.button': 'Zurücksetzen',
    'reset.back': '\u2190 Zurück zur Anmeldung',
    'reset.errorEmpty': 'Geben Sie Ihren Lizenzschlüssel ein.',
    'reset.errorInvalidKey': 'Ungültiger Lizenzschlüssel.',
    'reset.errorServer': 'Serverfehler — überprüfen Sie Ihre Verbindung.',
    'reset.success': 'Passwort gelöscht. Sie können sich jetzt ohne Passwort anmelden und ein neues in den Kiosk-Einstellungen festlegen.',
    'dashboard.logout': 'Abmelden',
    'dashboard.modeLocal': 'Lokales WLAN',
    'dashboard.modeCloud': 'Cloud',
    'slides.addSlide': 'Folie',
    'slides.addFlashInfo': 'Info-Meldung',
    'slides.addFlashUrgent': 'Dringende Meldung',
    'slides.emptyText': 'Noch keine Inhalte.<br>Fügen Sie eine Folie, eine Info- oder dringende Meldung hinzu.',
    'slides.noTitle': 'Ohne Titel',
    'slides.expires': 'Läuft ab',
    'slides.deleteConfirm': 'Diesen Inhalt löschen?',
    'slides.deleteTitle': 'Löschen',
    'modal.addSlide': 'Folie hinzufügen',
    'modal.addFlashInfo': 'Info-Meldung hinzufügen',
    'modal.addFlashUrgent': 'Dringende Meldung hinzufügen',
    'modal.addFallback': 'Hinzufügen',
    'modal.labelField': 'Name / Titel',
    'modal.labelPlaceholder': 'z.B.: Clubfoto',
    'modal.formatField': 'Format',
    'modal.formatText': 'Text',
    'modal.formatImage': 'Bild',
    'modal.contentField': 'Inhalt',
    'modal.contentPlaceholder': 'Ihre Nachricht...',
    'modal.imageLabel': 'Bild (JPG, PNG, SVG)',
    'modal.imageUpload': 'Klicken oder Bild hierher ziehen',
    'modal.duration': 'Dauer (Sekunden)',
    'modal.expires': 'Ablauf (optional)',
    'modal.cancel': 'Abbrechen',
    'modal.publish': 'Veröffentlichen',
    'modal.errorCreate': 'Fehler beim Erstellen',
    'error.loadSlides': 'Fehler beim Laden der Folien',
    'error.createSlide': 'Fehler beim Erstellen der Folie',
    'error.updateSlide': 'Fehler beim Aktualisieren',
    'error.sessionExpired': 'Sitzung abgelaufen'
  },

  it: {
    'pageTitle': 'AeroKiosk — Gestione display',
    'login.subtitle': 'Gestione display del club',
    'login.licenseKey': 'Chiave di licenza',
    'login.licensePlaceholder': 'AERO-XXXX-XXXX-XXXX',
    'login.password': 'Password admin',
    'login.passwordPlaceholder': 'Password',
    'login.submit': 'Accedi',
    'login.forgotPassword': 'Password dimenticata?',
    'login.errorInvalidLicense': 'Chiave di licenza non valida',
    'login.errorInvalidPassword': 'Password errata',
    'login.errorServer': 'Errore del server — verifica la connessione',
    'login.errorGeneric': 'Errore di connessione',
    'reset.subtitle': 'Reimpostazione della password',
    'reset.instructions': 'Inserisci la chiave di licenza per eliminare la password admin. Potrai poi impostarne una nuova nelle impostazioni del chiosco.',
    'reset.button': 'Reimposta',
    'reset.back': '\u2190 Torna al login',
    'reset.errorEmpty': 'Inserisci la chiave di licenza.',
    'reset.errorInvalidKey': 'Chiave di licenza errata.',
    'reset.errorServer': 'Errore del server — verifica la connessione.',
    'reset.success': 'Password eliminata. Ora puoi accedere senza password e impostarne una nuova nelle impostazioni del chiosco.',
    'dashboard.logout': 'Disconnetti',
    'dashboard.modeLocal': 'WiFi locale',
    'dashboard.modeCloud': 'Cloud',
    'slides.addSlide': 'Slide',
    'slides.addFlashInfo': 'Flash info',
    'slides.addFlashUrgent': 'Flash urgente',
    'slides.emptyText': 'Nessun contenuto al momento.<br>Aggiungi uno slide, un flash info o un flash urgente.',
    'slides.noTitle': 'Senza titolo',
    'slides.expires': 'Scade',
    'slides.deleteConfirm': 'Eliminare questo contenuto?',
    'slides.deleteTitle': 'Elimina',
    'modal.addSlide': 'Aggiungi uno slide',
    'modal.addFlashInfo': 'Aggiungi un flash info',
    'modal.addFlashUrgent': 'Aggiungi un flash urgente',
    'modal.addFallback': 'Aggiungi',
    'modal.labelField': 'Nome / Titolo',
    'modal.labelPlaceholder': 'es: Foto del club',
    'modal.formatField': 'Formato',
    'modal.formatText': 'Testo',
    'modal.formatImage': 'Immagine',
    'modal.contentField': 'Contenuto',
    'modal.contentPlaceholder': 'Il tuo messaggio...',
    'modal.imageLabel': 'Immagine (JPG, PNG, SVG)',
    'modal.imageUpload': 'Clicca o trascina un\'immagine',
    'modal.duration': 'Durata (secondi)',
    'modal.expires': 'Scadenza (opzionale)',
    'modal.cancel': 'Annulla',
    'modal.publish': 'Pubblica',
    'modal.errorCreate': 'Errore durante la creazione',
    'error.loadSlides': 'Errore caricamento slide',
    'error.createSlide': 'Errore creazione slide',
    'error.updateSlide': 'Errore aggiornamento',
    'error.sessionExpired': 'Sessione scaduta'
  },

  es: {
    'pageTitle': 'AeroKiosk — Gestión de pantalla',
    'login.subtitle': 'Gestión de la pantalla del club',
    'login.licenseKey': 'Clave de licencia',
    'login.licensePlaceholder': 'AERO-XXXX-XXXX-XXXX',
    'login.password': 'Contraseña admin',
    'login.passwordPlaceholder': 'Contraseña',
    'login.submit': 'Iniciar sesión',
    'login.forgotPassword': '¿Contraseña olvidada?',
    'login.errorInvalidLicense': 'Clave de licencia inválida',
    'login.errorInvalidPassword': 'Contraseña incorrecta',
    'login.errorServer': 'Error del servidor — verifique su conexión',
    'login.errorGeneric': 'Error de conexión',
    'reset.subtitle': 'Restablecimiento de contraseña',
    'reset.instructions': 'Introduzca su clave de licencia para eliminar la contraseña de admin. Luego podrá definir una nueva en la configuración del quiosco.',
    'reset.button': 'Restablecer',
    'reset.back': '\u2190 Volver al inicio de sesión',
    'reset.errorEmpty': 'Introduzca su clave de licencia.',
    'reset.errorInvalidKey': 'Clave de licencia incorrecta.',
    'reset.errorServer': 'Error del servidor — verifique su conexión.',
    'reset.success': 'Contraseña eliminada. Ahora puede iniciar sesión sin contraseña y definir una nueva en la configuración del quiosco.',
    'dashboard.logout': 'Cerrar sesión',
    'dashboard.modeLocal': 'WiFi local',
    'dashboard.modeCloud': 'Cloud',
    'slides.addSlide': 'Diapositiva',
    'slides.addFlashInfo': 'Flash info',
    'slides.addFlashUrgent': 'Flash urgente',
    'slides.emptyText': 'Sin contenido por el momento.<br>Añada una diapositiva, un flash info o un flash urgente.',
    'slides.noTitle': 'Sin título',
    'slides.expires': 'Expira',
    'slides.deleteConfirm': '¿Eliminar este contenido?',
    'slides.deleteTitle': 'Eliminar',
    'modal.addSlide': 'Añadir una diapositiva',
    'modal.addFlashInfo': 'Añadir un flash info',
    'modal.addFlashUrgent': 'Añadir un flash urgente',
    'modal.addFallback': 'Añadir',
    'modal.labelField': 'Nombre / Título',
    'modal.labelPlaceholder': 'ej: Foto del club',
    'modal.formatField': 'Formato',
    'modal.formatText': 'Texto',
    'modal.formatImage': 'Imagen',
    'modal.contentField': 'Contenido',
    'modal.contentPlaceholder': 'Su mensaje...',
    'modal.imageLabel': 'Imagen (JPG, PNG, SVG)',
    'modal.imageUpload': 'Haga clic o arrastre una imagen',
    'modal.duration': 'Duración (segundos)',
    'modal.expires': 'Expiración (opcional)',
    'modal.cancel': 'Cancelar',
    'modal.publish': 'Publicar',
    'modal.errorCreate': 'Error al crear',
    'error.loadSlides': 'Error al cargar diapositivas',
    'error.createSlide': 'Error al crear diapositiva',
    'error.updateSlide': 'Error al actualizar',
    'error.sessionExpired': 'Sesión expirada'
  },

  en: {
    'pageTitle': 'AeroKiosk — Display management',
    'login.subtitle': 'Club display management',
    'login.licenseKey': 'License key',
    'login.licensePlaceholder': 'AERO-XXXX-XXXX-XXXX',
    'login.password': 'Admin password',
    'login.passwordPlaceholder': 'Password',
    'login.submit': 'Sign in',
    'login.forgotPassword': 'Forgot password?',
    'login.errorInvalidLicense': 'Invalid license key',
    'login.errorInvalidPassword': 'Incorrect password',
    'login.errorServer': 'Server error — check your connection',
    'login.errorGeneric': 'Connection error',
    'reset.subtitle': 'Password reset',
    'reset.instructions': 'Enter your license key to remove the admin password. You can then set a new one in the kiosk settings.',
    'reset.button': 'Reset',
    'reset.back': '\u2190 Back to login',
    'reset.errorEmpty': 'Enter your license key.',
    'reset.errorInvalidKey': 'Incorrect license key.',
    'reset.errorServer': 'Server error — check your connection.',
    'reset.success': 'Password removed. You can now sign in without a password, then set a new one in the kiosk settings.',
    'dashboard.logout': 'Sign out',
    'dashboard.modeLocal': 'Local WiFi',
    'dashboard.modeCloud': 'Cloud',
    'slides.addSlide': 'Slide',
    'slides.addFlashInfo': 'Flash info',
    'slides.addFlashUrgent': 'Urgent flash',
    'slides.emptyText': 'No content yet.<br>Add a slide, a flash info or an urgent flash.',
    'slides.noTitle': 'Untitled',
    'slides.expires': 'Expires',
    'slides.deleteConfirm': 'Delete this content?',
    'slides.deleteTitle': 'Delete',
    'modal.addSlide': 'Add a slide',
    'modal.addFlashInfo': 'Add a flash info',
    'modal.addFlashUrgent': 'Add an urgent flash',
    'modal.addFallback': 'Add',
    'modal.labelField': 'Name / Title',
    'modal.labelPlaceholder': 'e.g.: Club photo',
    'modal.formatField': 'Format',
    'modal.formatText': 'Text',
    'modal.formatImage': 'Image',
    'modal.contentField': 'Content',
    'modal.contentPlaceholder': 'Your message...',
    'modal.imageLabel': 'Image (JPG, PNG, SVG)',
    'modal.imageUpload': 'Click or drag an image',
    'modal.duration': 'Duration (seconds)',
    'modal.expires': 'Expiration (optional)',
    'modal.cancel': 'Cancel',
    'modal.publish': 'Publish',
    'modal.errorCreate': 'Error creating content',
    'error.loadSlides': 'Error loading slides',
    'error.createSlide': 'Error creating slide',
    'error.updateSlide': 'Error updating',
    'error.sessionExpired': 'Session expired'
  }
};

const SUPPORTED_LANGS = ['fr', 'de', 'it', 'es', 'en'];
const DATE_LOCALES = { fr: 'fr-FR', de: 'de-DE', it: 'it-IT', es: 'es-ES', en: 'en-GB' };

/** Detect browser language → supported lang, fallback 'en' */
function detectLang() {
  const nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
  const short = nav.split('-')[0];
  return SUPPORTED_LANGS.includes(short) ? short : 'en';
}

const LANG = detectLang();

/** Translate a key. Fallback: English → key name. */
function t(key) {
  return (TRANSLATIONS[LANG] && TRANSLATIONS[LANG][key])
    || (TRANSLATIONS.en && TRANSLATIONS.en[key])
    || key;
}

/** Apply translations to all elements with data-i18n attributes */
function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (key) el.innerHTML = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) el.placeholder = t(key);
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (key) el.title = t(key);
  });
  // Page title
  document.title = t('pageTitle');
  // HTML lang
  document.documentElement.lang = LANG;
}

// Apply i18n as soon as DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyI18n);
} else {
  applyI18n();
}

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
    if (!resp.ok) throw new Error(t('error.loadSlides'));
    const slides = await resp.json();
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
    if (!resp.ok) throw new Error(t('error.createSlide'));
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
    if (!resp.ok) throw new Error(t('error.updateSlide'));
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
    const getResp = await fetch(
      SUPABASE_URL + '/rest/v1/club_slides?id=eq.' + encodeURIComponent(id) + '&select=image_path',
      { headers: supabaseHeaders() }
    );
    if (getResp.ok) {
      const rows = await getResp.json();
      if (rows.length > 0 && rows[0].image_path) {
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
      throw new Error(t('error.sessionExpired'));
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

  const modeIndicator = document.getElementById('modeIndicator');
  if (modeIndicator) {
    modeIndicator.textContent = api.mode === 'local' ? t('dashboard.modeLocal') : t('dashboard.modeCloud');
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
      loginError.textContent = t('login.errorInvalidLicense');
    } else if (err.message === 'invalid_password') {
      loginError.textContent = t('login.errorInvalidPassword');
    } else if (err.message === 'server_error') {
      loginError.textContent = t('login.errorServer');
    } else {
      loginError.textContent = t('login.errorGeneric');
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
  if (!key) { errorEl.textContent = t('reset.errorEmpty'); return; }

  resetBtn.disabled = true;

  try {
    if (api.mode === 'local') {
      const resp = await fetch(window.location.origin + '/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseKey: key })
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) throw new Error('invalid_key');
    } else {
      const checkResp = await fetch(
        SUPABASE_URL + '/rest/v1/licenses?key=eq.' + encodeURIComponent(key) + '&select=key',
        { headers: supabaseHeaders() }
      );
      if (!checkResp.ok) throw new Error('server_error');
      const rows = await checkResp.json();
      if (rows.length === 0) throw new Error('invalid_key');

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

    successEl.textContent = t('reset.success');
    successEl.style.display = '';
    errorEl.textContent = '';
  } catch (err) {
    if (err.message === 'invalid_key') {
      errorEl.textContent = t('reset.errorInvalidKey');
    } else {
      errorEl.textContent = t('reset.errorServer');
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
      + '<div class="icon">\ud83d\udccb</div>'
      + '<p>' + t('slides.emptyText') + '</p>'
      + '</div>';
    return;
  }

  const dateLocale = DATE_LOCALES[LANG] || 'en-GB';

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
      meta += ' \u00b7 ' + t('slides.expires') + ' ' + exp.toLocaleDateString(dateLocale);
    }
    if (s.source === 'remote') meta += ' \u00b7 Cloud';

    return '<div class="slide-card' + disabledClass + '" data-id="' + s.id + '">'
      + '<div class="slide-preview">' + preview + '</div>'
      + '<div class="slide-info">'
      + '  <div class="slide-info-top">'
      + '    <span class="slide-label">' + escapeHtml(s.label || t('slides.noTitle')) + '</span>'
      + '    <span class="badge ' + badgeClass + '">' + badgeText + '</span>'
      + '  </div>'
      + '  <div class="slide-meta">' + meta + '</div>'
      + '</div>'
      + '<div class="slide-actions">'
      + '  <label class="toggle-switch"><input type="checkbox" ' + checked + ' onchange="toggleSlide(\'' + s.id + '\', this.checked)"><span class="toggle-track"></span><span class="toggle-knob"></span></label>'
      + '  <button class="btn-delete" onclick="deleteSlide(\'' + s.id + '\')" title="' + t('slides.deleteTitle') + '">\u2715</button>'
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
  if (!confirm(t('slides.deleteConfirm'))) return;
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

  const titles = {
    'slide': t('modal.addSlide'),
    'flash-info': t('modal.addFlashInfo'),
    'flash-urgent': t('modal.addFlashUrgent')
  };
  document.getElementById('modalTitle').textContent = titles[mode] || t('modal.addFallback');
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
    alert(t('modal.errorCreate'));
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
(async function init() {
  if (api.mode === 'local' && api.token) {
    try {
      const cfg = await api.getConfig();
      api.clubName = cfg.clubName || '';
      api.station = cfg.station || '';
      showDashboard();
    } catch (e) {
      showLogin();
    }
  } else if (api.mode === 'supabase' && api.licenseKey) {
    try {
      await api.getSlides();
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
