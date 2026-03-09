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
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
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
    'error.sessionExpired': 'Session expirée',
    // ── Navigation ──
    'nav.content': 'Contenu',
    'nav.config': 'Configuration',
    // ── Config general ──
    'cfg.loading': 'Chargement...',
    'cfg.saving': 'Enregistrement...',
    'cfg.saveSuccess': 'Configuration enregistrée',
    'cfg.saveError': 'Erreur lors de l\'enregistrement',
    'cfg.loadError': 'Erreur de chargement',
    'cfg.noConfig': 'Aucune configuration trouvée',
    'cfg.cancel': 'Annuler',
    'cfg.save': 'Enregistrer',
    // ── Config tabs ──
    'cfg.tabAerodrome': 'Aérodrome',
    'cfg.tabThresholds': 'Seuils',
    'cfg.tabUnits': 'Unités',
    'cfg.tabMaps': 'Carte',
    'cfg.tabTraffic': 'Trafic',
    'cfg.tabSections': 'Sections',
    'cfg.tabAppearance': 'Apparence',
    'cfg.tabClubDisplay': 'Contenu club',
    'cfg.tabSystem': 'Système',
    'cfg.system.languageTitle': 'Langue',
    'cfg.system.passwordTitle': 'Mot de passe admin',
    'cfg.system.currentPassword': 'Mot de passe actuel',
    'cfg.system.newPassword': 'Nouveau mot de passe',
    'cfg.system.confirmPassword': 'Confirmer',
    'cfg.system.savePassword': 'Enregistrer le mot de passe',
    'cfg.system.removePassword': 'Supprimer le mot de passe',
    'cfg.system.passwordStatusSet': 'Un mot de passe admin est défini.',
    'cfg.system.passwordStatusNone': 'Aucun mot de passe admin défini.',
    'cfg.system.passwordOldIncorrect': 'Mot de passe actuel incorrect.',
    'cfg.system.passwordNewRequired': 'Entrez un nouveau mot de passe.',
    'cfg.system.passwordMismatch': 'Les mots de passe ne correspondent pas.',
    'cfg.system.roomsTitle': 'Planification',
    // ── Aérodrome ──
    'cfg.station.icaoLabel': 'Code OACI ou nom',
    'cfg.station.searchPlaceholder': 'Rechercher un aérodrome...',
    'cfg.station.displayName': 'Nom affiché',
    'cfg.station.latitude': 'Latitude',
    'cfg.station.longitude': 'Longitude',
    'cfg.station.fir': 'FIR',
    'cfg.station.firName': 'Nom FIR',
    'cfg.station.firPlaceholder': 'ex: LFRR',
    'cfg.station.firNamePlaceholder': 'ex: FIR Brest',
    'cfg.station.sigmetRegion': 'Région SIGMET',
    'cfg.station.regionEur': 'Europe',
    'cfg.station.regionNam': 'Amérique du Nord',
    'cfg.station.regionIntl': 'International',
    'cfg.station.noResult': 'Aucun résultat',
    'cfg.station.searchUnavailableCloud': 'La recherche n\'est disponible qu\'en mode WiFi local. Saisissez les informations manuellement.',
    'cfg.runways.title': 'Pistes',
    'cfg.runways.name': 'Nom',
    'cfg.runways.heading': 'Cap (°)',
    'cfg.runways.add': '+ Ajouter',
    'cfg.runways.noRunway': 'Aucune piste configurée',
    'cfg.runways.namePlaceholder': 'ex: 09',
    'cfg.runways.headingPlaceholder': '090',
    // ── Seuils ──
    'cfg.thresholds.profile': 'Profil',
    'cfg.thresholds.standard': 'Standard',
    'cfg.thresholds.custom': 'Personnalisé',
    'cfg.thresholds.vfr': 'VFR',
    'cfg.thresholds.vfrSpecial': 'VFR Spécial',
    'cfg.thresholds.greenThreshold': 'Seuil vert (conditions optimales)',
    'cfg.thresholds.minVisibility': 'Visibilité min (m)',
    'cfg.thresholds.minCeiling': 'Plafond min (ft)',
    'cfg.thresholds.runwayWind': 'Vent piste',
    'cfg.thresholds.crossDanger': 'Travers danger (kt)',
    'cfg.thresholds.crossWarning': 'Travers alerte (kt)',
    'cfg.thresholds.tailDanger': 'Arrière danger (kt)',
    'cfg.thresholds.tailWarning': 'Arrière alerte (kt)',
    'cfg.thresholds.fogTitle': 'Brouillard (écart T°/Rosée)',
    'cfg.thresholds.fogDanger': 'Danger (°C)',
    'cfg.thresholds.fogWarning': 'Alerte (°C)',
    'cfg.thresholds.fogWatch': 'Vigilance (°C)',
    'cfg.thresholds.metarAge': 'Âge METAR',
    'cfg.thresholds.metarDanger': 'Danger (min)',
    'cfg.thresholds.metarWarning': 'Alerte (min)',
    'cfg.thresholds.sunsetAlert': 'Alerte nuit aéronautique',
    'cfg.thresholds.sunsetOrange': 'Alerte orange (min)',
    'cfg.thresholds.sunsetRed': 'Alerte rouge (min)',
    'cfg.thresholds.category': 'Catégorie',
    'cfg.thresholds.visibility': 'Visibilité',
    'cfg.thresholds.ceiling': 'Plafond',
    // ── Unités ──
    'cfg.units.title': 'Unités d\'affichage',
    'cfg.units.pressure': 'Pression',
    'cfg.units.visibility': 'Visibilité',
    'cfg.units.temperature': 'Température',
    'cfg.units.wind': 'Vent',
    'cfg.units.metric': 'Métrique (m/km)',
    'cfg.units.statuteMiles': 'Statute Miles (SM)',
    'cfg.units.knots': 'Nœuds (kt)',
    'cfg.units.kmh': 'km/h',
    // ── Carte ──
    'cfg.maps.basemap': 'Fond de carte',
    'cfg.maps.basemapDark': 'Sombre minimal',
    'cfg.maps.basemapDarkDetail': 'Sombre détaillé',
    'cfg.maps.basemapVoyager': 'Clair (routes et villes)',
    'cfg.maps.basemapOsm': 'Standard OpenStreetMap',
    'cfg.maps.basemapAuto': 'Fond auto jour/nuit',
    'cfg.maps.basemapDay': 'Fond de jour',
    'cfg.maps.basemapNight': 'Fond de nuit',
    'cfg.maps.basemapBrightness': 'Luminosité fond de carte',
    'cfg.maps.weatherIntensityDark': 'Intensité couches météo (fond sombre)',
    'cfg.maps.weatherIntensityLight': 'Intensité couches météo (fond clair)',
    'cfg.maps.airportsOnMap': 'Terrains sur la carte',
    'cfg.maps.airportsNone': 'Masqués',
    'cfg.maps.airportsIcao': 'Aéroports uniquement',
    'cfg.maps.airportsUlm': 'Bases ULM uniquement',
    'cfg.maps.airportsAll': 'Aéroports + Bases ULM',
    'cfg.maps.zoom': 'Zoom',
    'cfg.maps.offsetNS': 'Décalage N/S',
    'cfg.maps.offsetEW': 'Décalage E/O',
    'cfg.maps.layerDuration': 'Durée par couche (s)',
    'cfg.maps.enabledLayers': 'Couches activées',
    // ── Trafic ──
    'cfg.traffic.title': 'Trafic aérien',
    'cfg.traffic.enabled': 'Afficher le trafic aérien en temps réel',
    'cfg.traffic.detail': 'Niveau de détail',
    'cfg.traffic.icon': 'Icône seule',
    'cfg.traffic.callsign': 'Icône + indicatif',
    'cfg.traffic.full': 'Icône + indicatif + altitude',
    'cfg.traffic.refresh': 'Rafraîchissement (s)',
    'cfg.traffic.radius': 'Rayon (NM)',
    'cfg.traffic.alt': 'Altitude max (ft)',
    'cfg.traffic.altUnlimited': '(0 = illimité)',
    'cfg.traffic.watchlist': 'Mes avions (indicatifs, virgules)',
    'cfg.traffic.watchMode': 'Mode d\'affichage',
    'cfg.traffic.watchHighlight': 'Mes avions surlignés',
    'cfg.traffic.watchOnly': 'Mes avions uniquement',
    'cfg.traffic.flarmTitle': 'Trafic FLARM',
    'cfg.traffic.flarmEnabled': 'Afficher le trafic FLARM',
    'cfg.traffic.flarmRadius': 'Rayon FLARM (km)',
    'cfg.traffic.flarmHint': 'Les aéronefs FLARM apparaissent en triangles verts. Les filtres altitude et watchlist s\'appliquent aussi au FLARM.',
    'cfg.traffic.fr24Title': 'FlightRadar24',
    'cfg.traffic.fr24Enabled': 'Activer FlightRadar24',
    'cfg.traffic.fr24ApiKey': 'Clé API',
    'cfg.traffic.fr24ApiKeyPlaceholder': 'Coller votre clé API FR24...',
    'cfg.traffic.fr24Link': 'Obtenir une clé API',
    'cfg.traffic.fr24Hint': 'Les avions FR24 apparaissent en rose. Inclut les avions Mode S (MLAT). Abonnement FR24 API requis (9$/mois).',
    // ── Sections ──
    'cfg.sections.sunTimes': 'Éphémérides',
    'cfg.sections.conditions': 'Conditions actuelles',
    'cfg.sections.fogAlert': 'Alerte brouillard',
    'cfg.sections.runwayComponents': 'Composantes de vent',
    'cfg.sections.preferredRunway': 'Piste préférentielle',
    'cfg.sections.metar': 'METAR',
    'cfg.sections.taf': 'TAF',
    'cfg.sections.tafBar': 'Barre visuelle TAF',
    'cfg.sections.sigmet': 'SIGMET',
    'cfg.sections.flightCategory': 'Catégorie de vol',
    'cfg.sections.sunsetWarning': 'Alerte coucher de soleil',
    'cfg.sections.ramadan': 'Horaires Ramadan (Imsak / Iftar)',
    'cfg.sections.activityProfile': "Profil d'activité",
    'cfg.sections.profileStandard': 'Standard (aérodrome)',
    'cfg.sections.profileGlider': 'Planeur',
    'cfg.sections.profileAeromodel': 'Aéromodélisme',
    'cfg.sections.profileCustom': 'Personnalisé',
    'cfg.sections.tafDisplay': 'Affichage TAF',
    'cfg.sections.tafRaw': 'Brut uniquement',
    'cfg.sections.tafDecoded': 'Décodé uniquement',
    'cfg.sections.tafBoth': 'Brut + Décodé',
    'cfg.sections.tafBarOnly': 'Barre visuelle seule',
    'cfg.sections.sidebarPosition': 'Position du panneau météo',
    'cfg.sections.sidebarRight': 'À droite',
    'cfg.sections.sidebarLeft': 'À gauche',
    // ── Apparence ──
    'cfg.appearance.themeSection': 'Thème',
    'cfg.appearance.mode': 'Mode',
    'cfg.appearance.auto': 'Auto (jour/nuit)',
    'cfg.appearance.fixed': 'Thème fixe',
    'cfg.appearance.dayTheme': 'Thème jour',
    'cfg.appearance.nightTheme': 'Thème nuit',
    'cfg.appearance.themeLabel': 'Thème',
    'cfg.appearance.brandingSection': 'Identité visuelle',
    'cfg.appearance.displayTitle': 'Titre affiché',
    'cfg.appearance.displayTitlePlaceholder': 'ex: IROISE',
    'cfg.appearance.clubName': 'Nom du club',
    'cfg.appearance.clubNamePlaceholder': 'ex: Aéroclub Iroise',
    'cfg.appearance.logoDay': 'Logo jour',
    'cfg.appearance.logoNight': 'Logo nuit',
    'cfg.appearance.chooseLogo': 'Choisir...',
    // ── Écrans ──
    'cfg.screens.title': 'Écrans',
    'cfg.screens.hint': 'Choisissez le mode d\'affichage pour chaque écran détecté.',
    'cfg.screens.add': 'Ajouter un écran',
    'cfg.screens.screen': 'Écran',
    'cfg.screens.viewFull': 'Complet (carte + météo)',
    'cfg.screens.viewMap': 'Carte seule',
    'cfg.screens.viewWeather': 'Météo seule (sidebar)',
    'cfg.screens.viewFleet': 'Flotte',
    'cfg.screens.viewClub': 'Contenu club',
    'cfg.screens.viewPlanning': 'Planning (avions + salles)',
    'cfg.screens.viewBriefing': 'Salles de briefing',
    // ── Contenu club ──
    'cfg.clubDisplay.title': 'Affichage club',
    'cfg.clubDisplay.enabled': 'Activer l\'affichage club',
    'cfg.clubDisplay.enabledHint': 'Afficher du contenu personnalisé sur le kiosque en rotation avec la météo.',
    'cfg.clubDisplay.serverEnabled': 'Serveur local',
    'cfg.clubDisplay.serverHint': 'Accéder à l\'admin depuis le WiFi, sans internet.',
    'cfg.clubDisplay.serverPort': 'Port',
    'cfg.clubDisplay.placement': 'Mode de rotation',
    'cfg.clubDisplay.placementAfter': 'Slides club après la météo',
    'cfg.clubDisplay.placementInterleaved': 'Intercalé avec la météo',
    'cfg.clubDisplay.placementOnly': 'Contenu club uniquement',
    'cfg.clubDisplay.defaultDuration': 'Durée par défaut (s)',
    // ── Flotte ──
    'nav.fleet': 'Flotte',
    'nav.rooms': 'Planification',
    'cfg.rooms.screenThemeTitle': '\u00c9cran salle (tablette)',
    'cfg.rooms.screenThemeHint': 'Th\u00e8me de la page salle affich\u00e9e sur tablette.',
    'cfg.rooms.themeDark': 'Sombre',
    'cfg.rooms.themeLight': 'Clair',
    'rooms.add': 'Ajouter une salle',
    'rooms.edit': 'Modifier la salle',
    'rooms.empty': 'Aucune salle configuree.',
    'rooms.name': 'Nom',
    'rooms.namePlaceholder': 'ex: Salle A',
    'rooms.type': 'Type',
    'rooms.typeBriefing': 'Briefing',
    'rooms.typeSimulateur': 'Simulateur',
    'rooms.typeCours': 'Cours',
    'rooms.typeAutre': 'Autre',
    'rooms.capacity': 'Capacite',
    'rooms.certifications': 'Certifications',
    'rooms.certMCC': 'MCC',
    'rooms.certQT': 'QT',
    'rooms.simType': 'Type de simulateur',
    'rooms.simVPT': 'VPT',
    'rooms.simFNPT1': 'FNPT-I',
    'rooms.simFNPT2': 'FNPT-II',
    'rooms.simFTD': 'FTD',
    'rooms.simFFS': 'FFS',
    'rooms.hasBriefingArea': 'Brief integre',
    'rooms.hasBriefingAreaHint': 'La salle dispose d\'un espace briefing integre',
    'rooms.autoBookBriefForSim': 'Brief auto pour simu',
    'rooms.autoBookBriefForSimHint': 'Reserver automatiquement une salle de brief pour les seances simulateur sans brief integre',
    'rooms.places': 'places',
    'rooms.confirmDelete': 'Supprimer cette salle ?',
    'rooms.tabManage': 'Gestion',
    'rooms.tabPlanning': 'Planning',
    'rooms.today': "Aujourd'hui",
    'rooms.planningEmpty': 'Aucune salle configuree. Ajoutez des salles dans l\'onglet Gestion.',
    'rooms.filterAllTypes': 'Tous les types',
    'rooms.filterAllSources': 'Toutes les sources',
    'rooms.sourceAdmin': 'Admin',
    'rooms.sourceTablet': 'Tablette',
    'rooms.sourceApi': 'API',
    'booking.add': 'Ajouter une reservation',
    'booking.edit': 'Modifier la reservation',
    'booking.room': 'Salle',
    'booking.start': 'Debut',
    'booking.end': 'Fin',
    'booking.title': 'Titre',
    'booking.titlePlaceholder': 'Briefing, Cours nav...',
    'booking.bookedBy': 'Reserve par',
    'booking.byPlaceholder': 'Nom',
    'booking.delete': 'Supprimer',
    'booking.confirmDelete': 'Supprimer cette reservation ?',
    'booking.defaultTitle': 'Reservation',
    'booking.errorRequired': 'Salle, debut et fin sont obligatoires.',
    'booking.errorEndBeforeStart': 'L\'heure de fin doit etre apres le debut.',
    'booking.errorOverlap': 'Ce creneau chevauche une reservation existante.',
    'booking.errorSave': 'Erreur lors de l\'enregistrement.',
    'rooms.tabFlights': 'Vols',
    'flights.add': 'Ajouter un vol',
    'flights.edit': 'Modifier le vol',
    'flights.empty': 'Aucun vol ce jour.',
    'flights.aircraft': 'Immatriculation',
    'flights.start': 'Debut',
    'flights.end': 'Fin',
    'flights.pilot': 'Pilote',
    'flights.instructor': 'Instructeur',
    'flights.type': 'Type de vol',
    'flights.confirmDelete': 'Supprimer ce vol ?',
    'flights.errorRequired': 'Immatriculation, horaires et pilote requis.',
    'flights.errorTime': 'L\'heure de fin doit etre apres le debut.',
    'flights.errorSave': 'Erreur lors de l\'enregistrement.',
    'fleet.add': 'Ajouter un aéronef',
    'fleet.empty': 'Aucun aéronef configuré.',
    'fleet.registration': 'Immatriculation',
    'fleet.regPlaceholder': 'F-GXYZ',
    'fleet.type': 'Type d\'aéronef',
    'fleet.typePlaceholder': 'Cessna 172S',
    'fleet.hours': 'Heures totales',
    'fleet.status': 'Statut',
    'fleet.melItems': 'Items MEL',
    'fleet.melAdd': 'Ajouter une MEL',
    'fleet.melCode': 'Code ATA',
    'fleet.melDesc': 'Description',
    'fleet.melCategory': 'Cat.',
    'fleet.melExpiry': 'Expiration',
    'fleet.nogoReason': 'Motif d\'indisponibilité',
    'fleet.maintReason': 'Motif de maintenance',
    'fleet.save': 'Enregistrer',
    'fleet.editTitle': 'Modifier l\'aéronef',
    'fleet.confirmDelete': 'Supprimer cet aéronef ?',
    'fleet.deleteTitle': 'Supprimer',
    'error.loadFleet': 'Erreur chargement flotte',
    'error.saveFleet': 'Erreur sauvegarde flotte'
  },

  de: {
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
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
    'error.sessionExpired': 'Sitzung abgelaufen',
    'nav.content': 'Inhalt',
    'nav.config': 'Konfiguration',
    'cfg.loading': 'Laden...',
    'cfg.saving': 'Speichern...',
    'cfg.saveSuccess': 'Konfiguration gespeichert',
    'cfg.saveError': 'Fehler beim Speichern',
    'cfg.loadError': 'Fehler beim Laden',
    'cfg.noConfig': 'Keine Konfiguration gefunden',
    'cfg.cancel': 'Abbrechen',
    'cfg.save': 'Speichern',
    'cfg.tabAerodrome': 'Flugplatz',
    'cfg.tabThresholds': 'Schwellenwerte',
    'cfg.tabUnits': 'Einheiten',
    'cfg.tabMaps': 'Karte',
    'cfg.tabTraffic': 'Verkehr',
    'cfg.tabSections': 'Bereiche',
    'cfg.tabAppearance': 'Aussehen',
    'cfg.tabClubDisplay': 'Club-Inhalte',
    'cfg.tabSystem': 'System',
    'cfg.system.languageTitle': 'Sprache',
    'cfg.system.passwordTitle': 'Admin-Passwort',
    'cfg.system.currentPassword': 'Aktuelles Passwort',
    'cfg.system.newPassword': 'Neues Passwort',
    'cfg.system.confirmPassword': 'Bestätigen',
    'cfg.system.savePassword': 'Passwort speichern',
    'cfg.system.removePassword': 'Passwort entfernen',
    'cfg.system.passwordStatusSet': 'Ein Admin-Passwort ist gesetzt.',
    'cfg.system.passwordStatusNone': 'Kein Admin-Passwort gesetzt.',
    'cfg.system.passwordOldIncorrect': 'Aktuelles Passwort falsch.',
    'cfg.system.passwordNewRequired': 'Bitte neues Passwort eingeben.',
    'cfg.system.passwordMismatch': 'Passwörter stimmen nicht überein.',
    'cfg.system.roomsTitle': 'Planung',
    'cfg.station.icaoLabel': 'ICAO-Code oder Name',
    'cfg.station.searchPlaceholder': 'Flugplatz suchen...',
    'cfg.station.displayName': 'Anzeigename',
    'cfg.station.latitude': 'Breitengrad',
    'cfg.station.longitude': 'Längengrad',
    'cfg.station.fir': 'FIR',
    'cfg.station.firName': 'FIR-Name',
    'cfg.station.firPlaceholder': 'z.B.: LFRR',
    'cfg.station.firNamePlaceholder': 'z.B.: FIR Brest',
    'cfg.station.sigmetRegion': 'SIGMET-Region',
    'cfg.station.regionEur': 'Europa',
    'cfg.station.regionNam': 'Nordamerika',
    'cfg.station.regionIntl': 'International',
    'cfg.station.noResult': 'Keine Ergebnisse',
    'cfg.station.searchUnavailableCloud': 'Suche nur im lokalen WLAN verfügbar. Geben Sie die Daten manuell ein.',
    'cfg.runways.title': 'Pisten',
    'cfg.runways.name': 'Name',
    'cfg.runways.heading': 'Kurs (°)',
    'cfg.runways.add': '+ Hinzufügen',
    'cfg.runways.noRunway': 'Keine Pisten konfiguriert',
    'cfg.runways.namePlaceholder': 'z.B.: 09',
    'cfg.runways.headingPlaceholder': '090',
    'cfg.thresholds.profile': 'Profil',
    'cfg.thresholds.standard': 'Standard',
    'cfg.thresholds.custom': 'Benutzerdefiniert',
    'cfg.thresholds.vfr': 'VFR',
    'cfg.thresholds.vfrSpecial': 'VFR Spezial',
    'cfg.thresholds.greenThreshold': 'Grüner Schwellenwert (optimale Bedingungen)',
    'cfg.thresholds.minVisibility': 'Min. Sicht (m)',
    'cfg.thresholds.minCeiling': 'Min. Untergrenze (ft)',
    'cfg.thresholds.runwayWind': 'Pistenwind',
    'cfg.thresholds.crossDanger': 'Seitenwind Gefahr (kt)',
    'cfg.thresholds.crossWarning': 'Seitenwind Warnung (kt)',
    'cfg.thresholds.tailDanger': 'Rückenwind Gefahr (kt)',
    'cfg.thresholds.tailWarning': 'Rückenwind Warnung (kt)',
    'cfg.thresholds.fogTitle': 'Nebel (Abw. Temp/Taupunkt)',
    'cfg.thresholds.fogDanger': 'Gefahr (°C)',
    'cfg.thresholds.fogWarning': 'Warnung (°C)',
    'cfg.thresholds.fogWatch': 'Wachsamkeit (°C)',
    'cfg.thresholds.metarAge': 'METAR-Alter',
    'cfg.thresholds.metarDanger': 'Gefahr (min)',
    'cfg.thresholds.metarWarning': 'Warnung (min)',
    'cfg.thresholds.sunsetAlert': 'Nachtflugwarnung',
    'cfg.thresholds.sunsetOrange': 'Orange Warnung (min)',
    'cfg.thresholds.sunsetRed': 'Rote Warnung (min)',
    'cfg.thresholds.category': 'Kategorie',
    'cfg.thresholds.visibility': 'Sicht',
    'cfg.thresholds.ceiling': 'Wolkenuntergrenze',
    // ── Einheiten ──
    'cfg.units.title': 'Anzeigeeinheiten',
    'cfg.units.pressure': 'Druck',
    'cfg.units.visibility': 'Sicht',
    'cfg.units.temperature': 'Temperatur',
    'cfg.units.wind': 'Wind',
    'cfg.units.metric': 'Metrisch (m/km)',
    'cfg.units.statuteMiles': 'Statute Miles (SM)',
    'cfg.units.knots': 'Knoten (kt)',
    'cfg.units.kmh': 'km/h',
    'cfg.maps.basemap': 'Grundkarte',
    'cfg.maps.basemapDark': 'Dunkel minimal',
    'cfg.maps.basemapDarkDetail': 'Dunkel detailliert',
    'cfg.maps.basemapVoyager': 'Hell (Straßen und Städte)',
    'cfg.maps.basemapOsm': 'Standard OpenStreetMap',
    'cfg.maps.basemapAuto': 'Auto Tag/Nacht',
    'cfg.maps.basemapDay': 'Tagkarte',
    'cfg.maps.basemapNight': 'Nachtkarte',
    'cfg.maps.basemapBrightness': 'Kartenhelligkeit',
    'cfg.maps.weatherIntensityDark': 'Wetterlagen-Intensität (dunkle Karte)',
    'cfg.maps.weatherIntensityLight': 'Wetterlagen-Intensität (helle Karte)',
    'cfg.maps.airportsOnMap': 'Flugplätze auf der Karte',
    'cfg.maps.airportsNone': 'Ausgeblendet',
    'cfg.maps.airportsIcao': 'Nur Flughäfen',
    'cfg.maps.airportsUlm': 'Nur UL-Plätze',
    'cfg.maps.airportsAll': 'Flughäfen + UL-Plätze',
    'cfg.maps.zoom': 'Zoom',
    'cfg.maps.offsetNS': 'Versatz N/S',
    'cfg.maps.offsetEW': 'Versatz O/W',
    'cfg.maps.layerDuration': 'Dauer pro Ebene (s)',
    'cfg.maps.enabledLayers': 'Aktive Ebenen',
    'cfg.traffic.title': 'Flugverkehr',
    'cfg.traffic.enabled': 'Flugverkehr in Echtzeit anzeigen',
    'cfg.traffic.detail': 'Detailstufe',
    'cfg.traffic.icon': 'Nur Symbol',
    'cfg.traffic.callsign': 'Symbol + Rufzeichen',
    'cfg.traffic.full': 'Symbol + Rufzeichen + Höhe',
    'cfg.traffic.refresh': 'Aktualisierung (s)',
    'cfg.traffic.radius': 'Radius (NM)',
    'cfg.traffic.alt': 'Max. Höhe (ft)',
    'cfg.traffic.altUnlimited': '(0 = unbegrenzt)',
    'cfg.traffic.watchlist': 'Meine Flugzeuge (Rufzeichen, Kommas)',
    'cfg.traffic.watchMode': 'Anzeigemodus',
    'cfg.traffic.watchHighlight': 'Meine Flugzeuge hervorgehoben',
    'cfg.traffic.watchOnly': 'Nur meine Flugzeuge',
    'cfg.traffic.flarmTitle': 'FLARM-Verkehr',
    'cfg.traffic.flarmEnabled': 'FLARM-Verkehr anzeigen',
    'cfg.traffic.flarmRadius': 'FLARM-Radius (km)',
    'cfg.traffic.flarmHint': 'FLARM-Luftfahrzeuge erscheinen als grüne Dreiecke. Höhenfilter und Watchlist gelten auch für FLARM.',
    'cfg.traffic.fr24Title': 'FlightRadar24',
    'cfg.traffic.fr24Enabled': 'FlightRadar24 aktivieren',
    'cfg.traffic.fr24ApiKey': 'API-Schlüssel',
    'cfg.traffic.fr24ApiKeyPlaceholder': 'FR24-API-Schlüssel einfügen...',
    'cfg.traffic.fr24Link': 'API-Schlüssel erhalten',
    'cfg.traffic.fr24Hint': 'FR24-Flugzeuge erscheinen rosa. Enthält Mode-S (MLAT). FR24-API-Abo erforderlich (9$/Monat).',
    'cfg.sections.sunTimes': 'Sonnenzeiten',
    'cfg.sections.conditions': 'Aktuelle Bedingungen',
    'cfg.sections.fogAlert': 'Nebelwarnung',
    'cfg.sections.runwayComponents': 'Windkomponenten',
    'cfg.sections.preferredRunway': 'Bevorzugte Piste',
    'cfg.sections.metar': 'METAR',
    'cfg.sections.taf': 'TAF',
    'cfg.sections.tafBar': 'Visuelle TAF-Leiste',
    'cfg.sections.sigmet': 'SIGMET',
    'cfg.sections.flightCategory': 'Flugkategorie',
    'cfg.sections.sunsetWarning': 'Sonnenuntergangswarnung',
    'cfg.sections.ramadan': 'Ramadan-Zeiten (Imsak / Iftar)',
    'cfg.sections.activityProfile': 'Aktivitätsprofil',
    'cfg.sections.profileStandard': 'Standard (Flugplatz)',
    'cfg.sections.profileGlider': 'Segelflug',
    'cfg.sections.profileAeromodel': 'Modellflug',
    'cfg.sections.profileCustom': 'Benutzerdefiniert',
    'cfg.sections.tafDisplay': 'TAF-Anzeige',
    'cfg.sections.tafRaw': 'Nur Rohtext',
    'cfg.sections.tafDecoded': 'Nur dekodiert',
    'cfg.sections.tafBoth': 'Roh + Dekodiert',
    'cfg.sections.tafBarOnly': 'Nur Balkenansicht',
    'cfg.sections.sidebarPosition': 'Position Wetterpanel',
    'cfg.sections.sidebarRight': 'Rechts',
    'cfg.sections.sidebarLeft': 'Links',
    'cfg.appearance.themeSection': 'Thema',
    'cfg.appearance.mode': 'Modus',
    'cfg.appearance.auto': 'Auto (Tag/Nacht)',
    'cfg.appearance.fixed': 'Festes Thema',
    'cfg.appearance.dayTheme': 'Tagesthema',
    'cfg.appearance.nightTheme': 'Nachtthema',
    'cfg.appearance.themeLabel': 'Thema',
    'cfg.appearance.brandingSection': 'Markenidentität',
    'cfg.appearance.displayTitle': 'Angezeigter Titel',
    'cfg.appearance.displayTitlePlaceholder': 'z.B.: IROISE',
    'cfg.appearance.clubName': 'Vereinsname',
    'cfg.appearance.clubNamePlaceholder': 'z.B.: Aeroclub Iroise',
    'cfg.appearance.logoDay': 'Logo Tag',
    'cfg.appearance.logoNight': 'Logo Nacht',
    'cfg.appearance.chooseLogo': 'Auswählen...',
    'cfg.screens.title': 'Bildschirme',
    'cfg.screens.hint': 'Wählen Sie den Anzeigemodus für jeden erkannten Bildschirm.',
    'cfg.screens.add': 'Bildschirm hinzufügen',
    'cfg.screens.screen': 'Bildschirm',
    'cfg.screens.viewFull': 'Vollständig (Karte + Wetter)',
    'cfg.screens.viewMap': 'Nur Karte',
    'cfg.screens.viewWeather': 'Nur Wetter (Sidebar)',
    'cfg.screens.viewFleet': 'Flotte',
    'cfg.screens.viewClub': 'Club-Inhalte',
    'cfg.screens.viewPlanning': 'Planung (Flugzeuge + Räume)',
    'cfg.screens.viewBriefing': 'Briefing-Räume',
    'cfg.clubDisplay.title': 'Club-Anzeige',
    'cfg.clubDisplay.enabled': 'Club-Anzeige aktivieren',
    'cfg.clubDisplay.enabledHint': 'Eigene Inhalte im Wechsel mit Wetter auf dem Kiosk anzeigen.',
    'cfg.clubDisplay.serverEnabled': 'Lokaler Server',
    'cfg.clubDisplay.serverHint': 'Admin-Zugriff über WLAN, ohne Internet.',
    'cfg.clubDisplay.serverPort': 'Port',
    'cfg.clubDisplay.placement': 'Rotationsmodus',
    'cfg.clubDisplay.placementAfter': 'Club-Folien nach Wetter',
    'cfg.clubDisplay.placementInterleaved': 'Abwechselnd mit Wetter',
    'cfg.clubDisplay.placementOnly': 'Nur Club-Inhalte',
    'cfg.clubDisplay.defaultDuration': 'Standarddauer (s)',
    'nav.fleet': 'Flotte',
    'nav.rooms': 'Planung',
    'cfg.rooms.screenThemeTitle': 'Raumbildschirm (Tablet)',
    'cfg.rooms.screenThemeHint': 'Farbschema der Raumseite auf dem Tablet.',
    'cfg.rooms.themeDark': 'Dunkel',
    'cfg.rooms.themeLight': 'Hell',
    'rooms.add': 'Raum hinzufügen',
    'rooms.edit': 'Raum bearbeiten',
    'rooms.empty': 'Keine Räume konfiguriert.',
    'rooms.name': 'Name',
    'rooms.namePlaceholder': 'z.B.: Raum A',
    'rooms.type': 'Typ',
    'rooms.typeBriefing': 'Briefing',
    'rooms.typeSimulateur': 'Simulator',
    'rooms.typeCours': 'Unterricht',
    'rooms.typeAutre': 'Sonstige',
    'rooms.capacity': 'Kapazität',
    'rooms.certifications': 'Zertifizierungen',
    'rooms.certMCC': 'MCC',
    'rooms.certQT': 'QT',
    'rooms.simType': 'Simulatortyp',
    'rooms.hasBriefingArea': 'Integrierter Briefing-Bereich',
    'rooms.autoBookBriefForSim': 'Auto-Briefing für Simulator',
    'rooms.places': 'Plätze',
    'rooms.confirmDelete': 'Diesen Raum löschen?',
    'rooms.tabManage': 'Verwaltung',
    'rooms.tabPlanning': 'Planung',
    'rooms.today': 'Heute',
    'rooms.planningEmpty': 'Keine Räume konfiguriert. Fügen Sie Räume im Tab Verwaltung hinzu.',
    'rooms.filterAllTypes': 'Alle Typen',
    'rooms.filterAllSources': 'Alle Quellen',
    'rooms.sourceAdmin': 'Admin',
    'rooms.sourceTablet': 'Tablet',
    'rooms.sourceApi': 'API',
    'booking.add': 'Reservierung hinzufügen',
    'booking.edit': 'Reservierung bearbeiten',
    'booking.room': 'Raum',
    'booking.start': 'Beginn',
    'booking.end': 'Ende',
    'booking.title': 'Titel',
    'booking.titlePlaceholder': 'Briefing, Navigation...',
    'booking.bookedBy': 'Reserviert von',
    'booking.byPlaceholder': 'Name',
    'booking.delete': 'Löschen',
    'booking.confirmDelete': 'Diese Reservierung löschen?',
    'booking.defaultTitle': 'Reservierung',
    'booking.errorRequired': 'Raum, Beginn und Ende sind Pflichtfelder.',
    'booking.errorEndBeforeStart': 'Die Endzeit muss nach der Startzeit liegen.',
    'booking.errorOverlap': 'Dieser Zeitraum überschneidet sich mit einer bestehenden Reservierung.',
    'booking.errorSave': 'Fehler beim Speichern.',
    'rooms.tabFlights': 'Flüge',
    'flights.add': 'Flug hinzufügen',
    'flights.edit': 'Flug bearbeiten',
    'flights.empty': 'Keine Flüge an diesem Tag.',
    'flights.aircraft': 'Kennzeichen',
    'flights.start': 'Beginn',
    'flights.end': 'Ende',
    'flights.pilot': 'Pilot',
    'flights.instructor': 'Fluglehrer',
    'flights.type': 'Flugart',
    'flights.confirmDelete': 'Diesen Flug löschen?',
    'flights.errorRequired': 'Kennzeichen, Zeiten und Pilot sind erforderlich.',
    'flights.errorTime': 'Die Endzeit muss nach der Startzeit liegen.',
    'flights.errorSave': 'Fehler beim Speichern.',
    'fleet.add': 'Luftfahrzeug hinzufügen',
    'fleet.empty': 'Keine Luftfahrzeuge konfiguriert.',
    'fleet.registration': 'Kennzeichen',
    'fleet.regPlaceholder': 'D-EABC',
    'fleet.type': 'Flugzeugtyp',
    'fleet.typePlaceholder': 'Cessna 172S',
    'fleet.hours': 'Gesamtstunden',
    'fleet.status': 'Status',
    'fleet.melItems': 'MEL-Einträge',
    'fleet.melAdd': 'MEL hinzufügen',
    'fleet.melCode': 'ATA-Code',
    'fleet.melDesc': 'Beschreibung',
    'fleet.melCategory': 'Kat.',
    'fleet.melExpiry': 'Ablaufdatum',
    'fleet.nogoReason': 'Grund der Nichtverfügbarkeit',
    'fleet.maintReason': 'Wartungsgrund',
    'fleet.save': 'Speichern',
    'fleet.editTitle': 'Luftfahrzeug bearbeiten',
    'fleet.confirmDelete': 'Dieses Luftfahrzeug löschen?',
    'fleet.deleteTitle': 'Löschen',
    'error.loadFleet': 'Fehler beim Laden der Flotte',
    'error.saveFleet': 'Fehler beim Speichern der Flotte'
  },

  it: {
    'common.save': 'Salva',
    'common.cancel': 'Annulla',
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
    'error.sessionExpired': 'Sessione scaduta',
    'nav.content': 'Contenuto',
    'nav.config': 'Configurazione',
    'cfg.loading': 'Caricamento...',
    'cfg.saving': 'Salvataggio...',
    'cfg.saveSuccess': 'Configurazione salvata',
    'cfg.saveError': 'Errore durante il salvataggio',
    'cfg.loadError': 'Errore di caricamento',
    'cfg.noConfig': 'Nessuna configurazione trovata',
    'cfg.cancel': 'Annulla',
    'cfg.save': 'Salva',
    'cfg.tabAerodrome': 'Aeroporto',
    'cfg.tabThresholds': 'Soglie',
    'cfg.tabUnits': 'Unità',
    'cfg.tabMaps': 'Mappa',
    'cfg.tabTraffic': 'Traffico',
    'cfg.tabSections': 'Sezioni',
    'cfg.tabAppearance': 'Aspetto',
    'cfg.tabClubDisplay': 'Contenuto club',
    'cfg.tabSystem': 'Sistema',
    'cfg.system.languageTitle': 'Lingua',
    'cfg.system.passwordTitle': 'Password admin',
    'cfg.system.currentPassword': 'Password attuale',
    'cfg.system.newPassword': 'Nuova password',
    'cfg.system.confirmPassword': 'Conferma',
    'cfg.system.savePassword': 'Salva password',
    'cfg.system.removePassword': 'Rimuovi password',
    'cfg.system.passwordStatusSet': 'Una password admin è impostata.',
    'cfg.system.passwordStatusNone': 'Nessuna password admin impostata.',
    'cfg.system.passwordOldIncorrect': 'Password attuale errata.',
    'cfg.system.passwordNewRequired': 'Inserire una nuova password.',
    'cfg.system.passwordMismatch': 'Le password non corrispondono.',
    'cfg.system.roomsTitle': 'Pianificazione',
    'cfg.station.icaoLabel': 'Codice ICAO o nome',
    'cfg.station.searchPlaceholder': 'Cerca un aeroporto...',
    'cfg.station.displayName': 'Nome visualizzato',
    'cfg.station.latitude': 'Latitudine',
    'cfg.station.longitude': 'Longitudine',
    'cfg.station.fir': 'FIR',
    'cfg.station.firName': 'Nome FIR',
    'cfg.station.firPlaceholder': 'es: LFRR',
    'cfg.station.firNamePlaceholder': 'es: FIR Brest',
    'cfg.station.sigmetRegion': 'Regione SIGMET',
    'cfg.station.regionEur': 'Europa',
    'cfg.station.regionNam': 'Nord America',
    'cfg.station.regionIntl': 'Internazionale',
    'cfg.station.noResult': 'Nessun risultato',
    'cfg.station.searchUnavailableCloud': 'La ricerca è disponibile solo in modalità WiFi locale. Inserisci i dati manualmente.',
    'cfg.runways.title': 'Piste',
    'cfg.runways.name': 'Nome',
    'cfg.runways.heading': 'Prua (°)',
    'cfg.runways.add': '+ Aggiungi',
    'cfg.runways.noRunway': 'Nessuna pista configurata',
    'cfg.runways.namePlaceholder': 'es: 09',
    'cfg.runways.headingPlaceholder': '090',
    'cfg.thresholds.profile': 'Profilo',
    'cfg.thresholds.standard': 'Standard',
    'cfg.thresholds.custom': 'Personalizzato',
    'cfg.thresholds.vfr': 'VFR',
    'cfg.thresholds.vfrSpecial': 'VFR Speciale',
    'cfg.thresholds.greenThreshold': 'Soglia verde (condizioni ottimali)',
    'cfg.thresholds.minVisibility': 'Visibilità min (m)',
    'cfg.thresholds.minCeiling': 'Soffitto min (ft)',
    'cfg.thresholds.runwayWind': 'Vento in pista',
    'cfg.thresholds.crossDanger': 'Traverso pericolo (kt)',
    'cfg.thresholds.crossWarning': 'Traverso allarme (kt)',
    'cfg.thresholds.tailDanger': 'Coda pericolo (kt)',
    'cfg.thresholds.tailWarning': 'Coda allarme (kt)',
    'cfg.thresholds.fogTitle': 'Nebbia (diff. Temp/Rugiada)',
    'cfg.thresholds.fogDanger': 'Pericolo (°C)',
    'cfg.thresholds.fogWarning': 'Allarme (°C)',
    'cfg.thresholds.fogWatch': 'Vigilanza (°C)',
    'cfg.thresholds.metarAge': 'Età METAR',
    'cfg.thresholds.metarDanger': 'Pericolo (min)',
    'cfg.thresholds.metarWarning': 'Allarme (min)',
    'cfg.thresholds.sunsetAlert': 'Allarme notte aeronautica',
    'cfg.thresholds.sunsetOrange': 'Allarme arancione (min)',
    'cfg.thresholds.sunsetRed': 'Allarme rosso (min)',
    'cfg.thresholds.category': 'Categoria',
    'cfg.thresholds.visibility': 'Visibilità',
    'cfg.thresholds.ceiling': 'Ceiling',
    // ── Unità ──
    'cfg.units.title': 'Unità di visualizzazione',
    'cfg.units.pressure': 'Pressione',
    'cfg.units.visibility': 'Visibilità',
    'cfg.units.temperature': 'Temperatura',
    'cfg.units.wind': 'Vento',
    'cfg.units.metric': 'Metrico (m/km)',
    'cfg.units.statuteMiles': 'Statute Miles (SM)',
    'cfg.units.knots': 'Nodi (kt)',
    'cfg.units.kmh': 'km/h',
    'cfg.maps.basemap': 'Mappa base',
    'cfg.maps.basemapDark': 'Scuro minimale',
    'cfg.maps.basemapDarkDetail': 'Scuro dettagliato',
    'cfg.maps.basemapVoyager': 'Chiaro (strade e città)',
    'cfg.maps.basemapOsm': 'Standard OpenStreetMap',
    'cfg.maps.basemapAuto': 'Auto giorno/notte',
    'cfg.maps.basemapDay': 'Mappa diurna',
    'cfg.maps.basemapNight': 'Mappa notturna',
    'cfg.maps.basemapBrightness': 'Luminosità mappa di base',
    'cfg.maps.weatherIntensityDark': 'Intensità strati meteo (sfondo scuro)',
    'cfg.maps.weatherIntensityLight': 'Intensità strati meteo (sfondo chiaro)',
    'cfg.maps.airportsOnMap': 'Aeroporti sulla mappa',
    'cfg.maps.airportsNone': 'Nascosti',
    'cfg.maps.airportsIcao': 'Solo aeroporti',
    'cfg.maps.airportsUlm': 'Solo basi ULM',
    'cfg.maps.airportsAll': 'Aeroporti + Basi ULM',
    'cfg.maps.zoom': 'Zoom',
    'cfg.maps.offsetNS': 'Spostamento N/S',
    'cfg.maps.offsetEW': 'Spostamento E/O',
    'cfg.maps.layerDuration': 'Durata per livello (s)',
    'cfg.maps.enabledLayers': 'Livelli attivi',
    'cfg.traffic.title': 'Traffico aereo',
    'cfg.traffic.enabled': 'Mostra traffico aereo in tempo reale',
    'cfg.traffic.detail': 'Livello di dettaglio',
    'cfg.traffic.icon': 'Solo icona',
    'cfg.traffic.callsign': 'Icona + nominativo',
    'cfg.traffic.full': 'Icona + nominativo + quota',
    'cfg.traffic.refresh': 'Aggiornamento (s)',
    'cfg.traffic.radius': 'Raggio (NM)',
    'cfg.traffic.alt': 'Quota max (ft)',
    'cfg.traffic.altUnlimited': '(0 = illimitato)',
    'cfg.traffic.watchlist': 'I miei aerei (nominativi, virgole)',
    'cfg.traffic.watchMode': 'Modalità di visualizzazione',
    'cfg.traffic.watchHighlight': 'I miei aerei evidenziati',
    'cfg.traffic.watchOnly': 'Solo i miei aerei',
    'cfg.traffic.flarmTitle': 'Traffico FLARM',
    'cfg.traffic.flarmEnabled': 'Mostra traffico FLARM',
    'cfg.traffic.flarmRadius': 'Raggio FLARM (km)',
    'cfg.traffic.flarmHint': 'Gli aeromobili FLARM appaiono come triangoli verdi. Filtri quota e watchlist si applicano anche al FLARM.',
    'cfg.traffic.fr24Title': 'FlightRadar24',
    'cfg.traffic.fr24Enabled': 'Attiva FlightRadar24',
    'cfg.traffic.fr24ApiKey': 'Chiave API',
    'cfg.traffic.fr24ApiKeyPlaceholder': 'Incolla la tua chiave API FR24...',
    'cfg.traffic.fr24Link': 'Ottieni una chiave API',
    'cfg.traffic.fr24Hint': 'Gli aerei FR24 appaiono in rosa. Include Mode S (MLAT). Abbonamento FR24 API richiesto (9$/mese).',
    'cfg.sections.sunTimes': 'Effemeridi',
    'cfg.sections.conditions': 'Condizioni attuali',
    'cfg.sections.fogAlert': 'Allarme nebbia',
    'cfg.sections.runwayComponents': 'Componenti vento',
    'cfg.sections.preferredRunway': 'Pista preferita',
    'cfg.sections.metar': 'METAR',
    'cfg.sections.taf': 'TAF',
    'cfg.sections.tafBar': 'Barra visiva TAF',
    'cfg.sections.sigmet': 'SIGMET',
    'cfg.sections.flightCategory': 'Categoria di volo',
    'cfg.sections.sunsetWarning': 'Allarme tramonto',
    'cfg.sections.ramadan': 'Orari Ramadan (Imsak / Iftar)',
    'cfg.sections.activityProfile': 'Profilo attività',
    'cfg.sections.profileStandard': 'Standard (aerodromo)',
    'cfg.sections.profileGlider': 'Aliante',
    'cfg.sections.profileAeromodel': 'Aeromodellismo',
    'cfg.sections.profileCustom': 'Personalizzato',
    'cfg.sections.tafDisplay': 'Visualizzazione TAF',
    'cfg.sections.tafRaw': 'Solo grezzo',
    'cfg.sections.tafDecoded': 'Solo decodificato',
    'cfg.sections.tafBoth': 'Grezzo + Decodificato',
    'cfg.sections.tafBarOnly': 'Solo barra visiva',
    'cfg.sections.sidebarPosition': 'Posizione pannello meteo',
    'cfg.sections.sidebarRight': 'A destra',
    'cfg.sections.sidebarLeft': 'A sinistra',
    'cfg.appearance.themeSection': 'Tema',
    'cfg.appearance.mode': 'Modalità',
    'cfg.appearance.auto': 'Auto (giorno/notte)',
    'cfg.appearance.fixed': 'Tema fisso',
    'cfg.appearance.dayTheme': 'Tema diurno',
    'cfg.appearance.nightTheme': 'Tema notturno',
    'cfg.appearance.themeLabel': 'Tema',
    'cfg.appearance.brandingSection': 'Identità visiva',
    'cfg.appearance.displayTitle': 'Titolo visualizzato',
    'cfg.appearance.displayTitlePlaceholder': 'es: IROISE',
    'cfg.appearance.clubName': 'Nome del club',
    'cfg.appearance.clubNamePlaceholder': 'es: Aeroclub Iroise',
    'cfg.appearance.logoDay': 'Logo giorno',
    'cfg.appearance.logoNight': 'Logo notte',
    'cfg.appearance.chooseLogo': 'Scegli...',
    'cfg.screens.title': 'Schermi',
    'cfg.screens.hint': 'Scegli la modalità di visualizzazione per ogni schermo rilevato.',
    'cfg.screens.add': 'Aggiungi schermo',
    'cfg.screens.screen': 'Schermo',
    'cfg.screens.viewFull': 'Completo (mappa + meteo)',
    'cfg.screens.viewMap': 'Solo mappa',
    'cfg.screens.viewWeather': 'Solo meteo (sidebar)',
    'cfg.screens.viewFleet': 'Flotta',
    'cfg.screens.viewClub': 'Contenuto club',
    'cfg.screens.viewPlanning': 'Pianificazione (aerei + sale)',
    'cfg.screens.viewBriefing': 'Sale briefing',
    'cfg.clubDisplay.title': 'Display club',
    'cfg.clubDisplay.enabled': 'Attiva display club',
    'cfg.clubDisplay.enabledHint': 'Mostra contenuti personalizzati sul chiosco in rotazione con il meteo.',
    'cfg.clubDisplay.serverEnabled': 'Server locale',
    'cfg.clubDisplay.serverHint': 'Accesso admin via WiFi, senza internet.',
    'cfg.clubDisplay.serverPort': 'Porta',
    'cfg.clubDisplay.placement': 'Modalità rotazione',
    'cfg.clubDisplay.placementAfter': 'Slide club dopo il meteo',
    'cfg.clubDisplay.placementInterleaved': 'Alternato con il meteo',
    'cfg.clubDisplay.placementOnly': 'Solo contenuto club',
    'cfg.clubDisplay.defaultDuration': 'Durata predefinita (s)',
    'nav.fleet': 'Flotta',
    'nav.rooms': 'Pianificazione',
    'cfg.rooms.screenThemeTitle': 'Schermo sala (tablet)',
    'cfg.rooms.screenThemeHint': 'Tema della pagina sala visualizzata sul tablet.',
    'cfg.rooms.themeDark': 'Scuro',
    'cfg.rooms.themeLight': 'Chiaro',
    'rooms.add': 'Aggiungi sala',
    'rooms.edit': 'Modifica sala',
    'rooms.empty': 'Nessuna sala configurata.',
    'rooms.name': 'Nome',
    'rooms.namePlaceholder': 'es: Sala A',
    'rooms.type': 'Tipo',
    'rooms.typeBriefing': 'Briefing',
    'rooms.typeSimulateur': 'Simulatore',
    'rooms.typeCours': 'Corso',
    'rooms.typeAutre': 'Altro',
    'rooms.capacity': 'Capacità',
    'rooms.certifications': 'Certificazioni',
    'rooms.certMCC': 'MCC',
    'rooms.certQT': 'QT',
    'rooms.simType': 'Tipo di simulatore',
    'rooms.hasBriefingArea': 'Area briefing integrata',
    'rooms.autoBookBriefForSim': 'Briefing auto per simulatore',
    'rooms.places': 'posti',
    'rooms.confirmDelete': 'Eliminare questa sala?',
    'rooms.tabManage': 'Gestione',
    'rooms.tabPlanning': 'Planning',
    'rooms.today': 'Oggi',
    'rooms.planningEmpty': 'Nessuna sala configurata. Aggiungere sale nella scheda Gestione.',
    'rooms.filterAllTypes': 'Tutti i tipi',
    'rooms.filterAllSources': 'Tutte le fonti',
    'rooms.sourceAdmin': 'Admin',
    'rooms.sourceTablet': 'Tablet',
    'rooms.sourceApi': 'API',
    'booking.add': 'Aggiungi prenotazione',
    'booking.edit': 'Modifica prenotazione',
    'booking.room': 'Sala',
    'booking.start': 'Inizio',
    'booking.end': 'Fine',
    'booking.title': 'Titolo',
    'booking.titlePlaceholder': 'Briefing, Corso nav...',
    'booking.bookedBy': 'Prenotato da',
    'booking.byPlaceholder': 'Nome',
    'booking.delete': 'Elimina',
    'booking.confirmDelete': 'Eliminare questa prenotazione?',
    'booking.defaultTitle': 'Prenotazione',
    'booking.errorRequired': 'Sala, inizio e fine sono obbligatori.',
    'booking.errorEndBeforeStart': 'L\'orario di fine deve essere dopo l\'inizio.',
    'booking.errorOverlap': 'Questo orario si sovrappone a una prenotazione esistente.',
    'booking.errorSave': 'Errore durante il salvataggio.',
    'rooms.tabFlights': 'Voli',
    'flights.add': 'Aggiungi volo',
    'flights.edit': 'Modifica volo',
    'flights.empty': 'Nessun volo in questo giorno.',
    'flights.aircraft': 'Immatricolazione',
    'flights.start': 'Inizio',
    'flights.end': 'Fine',
    'flights.pilot': 'Pilota',
    'flights.instructor': 'Istruttore',
    'flights.type': 'Tipo di volo',
    'flights.confirmDelete': 'Eliminare questo volo?',
    'flights.errorRequired': 'Immatricolazione, orari e pilota sono obbligatori.',
    'flights.errorTime': 'L\'ora di fine deve essere dopo l\'inizio.',
    'flights.errorSave': 'Errore durante il salvataggio.',
    'fleet.add': 'Aggiungi aeromobile',
    'fleet.empty': 'Nessun aeromobile configurato.',
    'fleet.registration': 'Immatricolazione',
    'fleet.regPlaceholder': 'I-ABCD',
    'fleet.type': 'Tipo di aeromobile',
    'fleet.typePlaceholder': 'Cessna 172S',
    'fleet.hours': 'Ore totali',
    'fleet.status': 'Stato',
    'fleet.melItems': 'Voci MEL',
    'fleet.melAdd': 'Aggiungi MEL',
    'fleet.melCode': 'Codice ATA',
    'fleet.melDesc': 'Descrizione',
    'fleet.melCategory': 'Cat.',
    'fleet.melExpiry': 'Scadenza',
    'fleet.nogoReason': 'Motivo di indisponibilità',
    'fleet.maintReason': 'Motivo della manutenzione',
    'fleet.save': 'Salva',
    'fleet.editTitle': 'Modifica aeromobile',
    'fleet.confirmDelete': 'Eliminare questo aeromobile?',
    'fleet.deleteTitle': 'Elimina',
    'error.loadFleet': 'Errore caricamento flotta',
    'error.saveFleet': 'Errore salvataggio flotta'
  },

  es: {
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
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
    'error.sessionExpired': 'Sesión expirada',
    'nav.content': 'Contenido',
    'nav.config': 'Configuración',
    'cfg.loading': 'Cargando...',
    'cfg.saving': 'Guardando...',
    'cfg.saveSuccess': 'Configuración guardada',
    'cfg.saveError': 'Error al guardar',
    'cfg.loadError': 'Error de carga',
    'cfg.noConfig': 'No se encontró configuración',
    'cfg.cancel': 'Cancelar',
    'cfg.save': 'Guardar',
    'cfg.tabAerodrome': 'Aeródromo',
    'cfg.tabThresholds': 'Umbrales',
    'cfg.tabUnits': 'Unidades',
    'cfg.tabMaps': 'Mapa',
    'cfg.tabTraffic': 'Tráfico',
    'cfg.tabSections': 'Secciones',
    'cfg.tabAppearance': 'Apariencia',
    'cfg.tabClubDisplay': 'Contenido club',
    'cfg.tabSystem': 'Sistema',
    'cfg.system.languageTitle': 'Idioma',
    'cfg.system.passwordTitle': 'Contraseña admin',
    'cfg.system.currentPassword': 'Contraseña actual',
    'cfg.system.newPassword': 'Nueva contraseña',
    'cfg.system.confirmPassword': 'Confirmar',
    'cfg.system.savePassword': 'Guardar contraseña',
    'cfg.system.removePassword': 'Eliminar contraseña',
    'cfg.system.passwordStatusSet': 'Se ha definido una contraseña admin.',
    'cfg.system.passwordStatusNone': 'No se ha definido contraseña admin.',
    'cfg.system.passwordOldIncorrect': 'Contraseña actual incorrecta.',
    'cfg.system.passwordNewRequired': 'Introduzca una nueva contraseña.',
    'cfg.system.passwordMismatch': 'Las contraseñas no coinciden.',
    'cfg.system.roomsTitle': 'Planificación',
    'cfg.station.icaoLabel': 'Código OACI o nombre',
    'cfg.station.searchPlaceholder': 'Buscar un aeródromo...',
    'cfg.station.displayName': 'Nombre mostrado',
    'cfg.station.latitude': 'Latitud',
    'cfg.station.longitude': 'Longitud',
    'cfg.station.fir': 'FIR',
    'cfg.station.firName': 'Nombre FIR',
    'cfg.station.firPlaceholder': 'ej: LFRR',
    'cfg.station.firNamePlaceholder': 'ej: FIR Brest',
    'cfg.station.sigmetRegion': 'Región SIGMET',
    'cfg.station.regionEur': 'Europa',
    'cfg.station.regionNam': 'Norteamérica',
    'cfg.station.regionIntl': 'Internacional',
    'cfg.station.noResult': 'Sin resultados',
    'cfg.station.searchUnavailableCloud': 'La búsqueda solo está disponible en modo WiFi local. Introduzca los datos manualmente.',
    'cfg.runways.title': 'Pistas',
    'cfg.runways.name': 'Nombre',
    'cfg.runways.heading': 'Rumbo (°)',
    'cfg.runways.add': '+ Añadir',
    'cfg.runways.noRunway': 'Sin pistas configuradas',
    'cfg.runways.namePlaceholder': 'ej: 09',
    'cfg.runways.headingPlaceholder': '090',
    'cfg.thresholds.profile': 'Perfil',
    'cfg.thresholds.standard': 'Estándar',
    'cfg.thresholds.custom': 'Personalizado',
    'cfg.thresholds.vfr': 'VFR',
    'cfg.thresholds.vfrSpecial': 'VFR Especial',
    'cfg.thresholds.greenThreshold': 'Umbral verde (condiciones óptimas)',
    'cfg.thresholds.minVisibility': 'Visibilidad mín (m)',
    'cfg.thresholds.minCeiling': 'Techo mín (ft)',
    'cfg.thresholds.runwayWind': 'Viento en pista',
    'cfg.thresholds.crossDanger': 'Cruzado peligro (kt)',
    'cfg.thresholds.crossWarning': 'Cruzado alerta (kt)',
    'cfg.thresholds.tailDanger': 'Cola peligro (kt)',
    'cfg.thresholds.tailWarning': 'Cola alerta (kt)',
    'cfg.thresholds.fogTitle': 'Niebla (dif. Temp/Rocío)',
    'cfg.thresholds.fogDanger': 'Peligro (°C)',
    'cfg.thresholds.fogWarning': 'Alerta (°C)',
    'cfg.thresholds.fogWatch': 'Vigilancia (°C)',
    'cfg.thresholds.metarAge': 'Antigüedad METAR',
    'cfg.thresholds.metarDanger': 'Peligro (min)',
    'cfg.thresholds.metarWarning': 'Alerta (min)',
    'cfg.thresholds.sunsetAlert': 'Alerta noche aeronáutica',
    'cfg.thresholds.sunsetOrange': 'Alerta naranja (min)',
    'cfg.thresholds.sunsetRed': 'Alerta roja (min)',
    'cfg.thresholds.category': 'Categoría',
    'cfg.thresholds.visibility': 'Visibilidad',
    'cfg.thresholds.ceiling': 'Techo',
    // ── Unidades ──
    'cfg.units.title': 'Unidades de visualización',
    'cfg.units.pressure': 'Presión',
    'cfg.units.visibility': 'Visibilidad',
    'cfg.units.temperature': 'Temperatura',
    'cfg.units.wind': 'Viento',
    'cfg.units.metric': 'Métrico (m/km)',
    'cfg.units.statuteMiles': 'Statute Miles (SM)',
    'cfg.units.knots': 'Nudos (kt)',
    'cfg.units.kmh': 'km/h',
    'cfg.maps.basemap': 'Mapa base',
    'cfg.maps.basemapDark': 'Oscuro mínimo',
    'cfg.maps.basemapDarkDetail': 'Oscuro detallado',
    'cfg.maps.basemapVoyager': 'Claro (calles y ciudades)',
    'cfg.maps.basemapOsm': 'Estándar OpenStreetMap',
    'cfg.maps.basemapAuto': 'Auto día/noche',
    'cfg.maps.basemapDay': 'Mapa diurno',
    'cfg.maps.basemapNight': 'Mapa nocturno',
    'cfg.maps.basemapBrightness': 'Brillo del mapa base',
    'cfg.maps.weatherIntensityDark': 'Intensidad capas meteorológicas (fondo oscuro)',
    'cfg.maps.weatherIntensityLight': 'Intensidad capas meteorológicas (fondo claro)',
    'cfg.maps.airportsOnMap': 'Aeródromos en el mapa',
    'cfg.maps.airportsNone': 'Ocultos',
    'cfg.maps.airportsIcao': 'Solo aeropuertos',
    'cfg.maps.airportsUlm': 'Solo bases ULM',
    'cfg.maps.airportsAll': 'Aeropuertos + Bases ULM',
    'cfg.maps.zoom': 'Zoom',
    'cfg.maps.offsetNS': 'Desplazamiento N/S',
    'cfg.maps.offsetEW': 'Desplazamiento E/O',
    'cfg.maps.layerDuration': 'Duración por capa (s)',
    'cfg.maps.enabledLayers': 'Capas activas',
    'cfg.traffic.title': 'Tráfico aéreo',
    'cfg.traffic.enabled': 'Mostrar tráfico aéreo en tiempo real',
    'cfg.traffic.detail': 'Nivel de detalle',
    'cfg.traffic.icon': 'Solo icono',
    'cfg.traffic.callsign': 'Icono + indicativo',
    'cfg.traffic.full': 'Icono + indicativo + altitud',
    'cfg.traffic.refresh': 'Actualización (s)',
    'cfg.traffic.radius': 'Radio (NM)',
    'cfg.traffic.alt': 'Altitud máx (ft)',
    'cfg.traffic.altUnlimited': '(0 = ilimitado)',
    'cfg.traffic.watchlist': 'Mis aviones (indicativos, comas)',
    'cfg.traffic.watchMode': 'Modo de visualización',
    'cfg.traffic.watchHighlight': 'Mis aviones resaltados',
    'cfg.traffic.watchOnly': 'Solo mis aviones',
    'cfg.traffic.flarmTitle': 'Tráfico FLARM',
    'cfg.traffic.flarmEnabled': 'Mostrar tráfico FLARM',
    'cfg.traffic.flarmRadius': 'Radio FLARM (km)',
    'cfg.traffic.flarmHint': 'Las aeronaves FLARM aparecen como triángulos verdes. Los filtros de altitud y watchlist también se aplican al FLARM.',
    'cfg.traffic.fr24Title': 'FlightRadar24',
    'cfg.traffic.fr24Enabled': 'Activar FlightRadar24',
    'cfg.traffic.fr24ApiKey': 'Clave API',
    'cfg.traffic.fr24ApiKeyPlaceholder': 'Pega tu clave API FR24...',
    'cfg.traffic.fr24Link': 'Obtener una clave API',
    'cfg.traffic.fr24Hint': 'Los aviones FR24 aparecen en rosa. Incluye Mode S (MLAT). Suscripción FR24 API requerida (9$/mes).',
    'cfg.sections.sunTimes': 'Efemérides',
    'cfg.sections.conditions': 'Condiciones actuales',
    'cfg.sections.fogAlert': 'Alerta de niebla',
    'cfg.sections.runwayComponents': 'Componentes de viento',
    'cfg.sections.preferredRunway': 'Pista preferida',
    'cfg.sections.metar': 'METAR',
    'cfg.sections.taf': 'TAF',
    'cfg.sections.tafBar': 'Barra visual TAF',
    'cfg.sections.sigmet': 'SIGMET',
    'cfg.sections.flightCategory': 'Categoría de vuelo',
    'cfg.sections.sunsetWarning': 'Alerta atardecer',
    'cfg.sections.ramadan': 'Horarios Ramadan (Imsak / Iftar)',
    'cfg.sections.activityProfile': 'Perfil de actividad',
    'cfg.sections.profileStandard': 'Estándar (aeródromo)',
    'cfg.sections.profileGlider': 'Planeador',
    'cfg.sections.profileAeromodel': 'Aeromodelismo',
    'cfg.sections.profileCustom': 'Personalizado',
    'cfg.sections.tafDisplay': 'Visualización TAF',
    'cfg.sections.tafRaw': 'Solo bruto',
    'cfg.sections.tafDecoded': 'Solo decodificado',
    'cfg.sections.tafBoth': 'Bruto + Decodificado',
    'cfg.sections.tafBarOnly': 'Solo barra visual',
    'cfg.sections.sidebarPosition': 'Posición panel meteorológico',
    'cfg.sections.sidebarRight': 'A la derecha',
    'cfg.sections.sidebarLeft': 'A la izquierda',
    'cfg.appearance.themeSection': 'Tema',
    'cfg.appearance.mode': 'Modo',
    'cfg.appearance.auto': 'Auto (día/noche)',
    'cfg.appearance.fixed': 'Tema fijo',
    'cfg.appearance.dayTheme': 'Tema diurno',
    'cfg.appearance.nightTheme': 'Tema nocturno',
    'cfg.appearance.themeLabel': 'Tema',
    'cfg.appearance.brandingSection': 'Identidad visual',
    'cfg.appearance.displayTitle': 'Título mostrado',
    'cfg.appearance.displayTitlePlaceholder': 'ej: IROISE',
    'cfg.appearance.clubName': 'Nombre del club',
    'cfg.appearance.clubNamePlaceholder': 'ej: Aeroclub Iroise',
    'cfg.appearance.logoDay': 'Logo día',
    'cfg.appearance.logoNight': 'Logo noche',
    'cfg.appearance.chooseLogo': 'Elegir...',
    'cfg.screens.title': 'Pantallas',
    'cfg.screens.hint': 'Elija el modo de visualización para cada pantalla detectada.',
    'cfg.screens.add': 'Añadir pantalla',
    'cfg.screens.screen': 'Pantalla',
    'cfg.screens.viewFull': 'Completo (mapa + meteorología)',
    'cfg.screens.viewMap': 'Solo mapa',
    'cfg.screens.viewWeather': 'Solo meteorología (sidebar)',
    'cfg.screens.viewFleet': 'Flota',
    'cfg.screens.viewClub': 'Contenido club',
    'cfg.screens.viewPlanning': 'Planificación (aviones + salas)',
    'cfg.screens.viewBriefing': 'Salas de briefing',
    'cfg.clubDisplay.title': 'Pantalla del club',
    'cfg.clubDisplay.enabled': 'Activar pantalla del club',
    'cfg.clubDisplay.enabledHint': 'Mostrar contenido personalizado en el quiosco en rotación con el tiempo.',
    'cfg.clubDisplay.serverEnabled': 'Servidor local',
    'cfg.clubDisplay.serverHint': 'Acceso admin por WiFi, sin internet.',
    'cfg.clubDisplay.serverPort': 'Puerto',
    'cfg.clubDisplay.placement': 'Modo de rotación',
    'cfg.clubDisplay.placementAfter': 'Diapositivas club después del tiempo',
    'cfg.clubDisplay.placementInterleaved': 'Alternado con el tiempo',
    'cfg.clubDisplay.placementOnly': 'Solo contenido club',
    'cfg.clubDisplay.defaultDuration': 'Duración predeterminada (s)',
    'nav.fleet': 'Flota',
    'nav.rooms': 'Planificación',
    'cfg.rooms.screenThemeTitle': 'Pantalla sala (tableta)',
    'cfg.rooms.screenThemeHint': 'Tema de la p\u00e1gina de sala en la tableta.',
    'cfg.rooms.themeDark': 'Oscuro',
    'cfg.rooms.themeLight': 'Claro',
    'rooms.add': 'Añadir sala',
    'rooms.edit': 'Modificar sala',
    'rooms.empty': 'Ninguna sala configurada.',
    'rooms.name': 'Nombre',
    'rooms.namePlaceholder': 'ej: Sala A',
    'rooms.type': 'Tipo',
    'rooms.typeBriefing': 'Briefing',
    'rooms.typeSimulateur': 'Simulador',
    'rooms.typeCours': 'Clase',
    'rooms.typeAutre': 'Otro',
    'rooms.capacity': 'Capacidad',
    'rooms.certifications': 'Certificaciones',
    'rooms.certMCC': 'MCC',
    'rooms.certQT': 'QT',
    'rooms.simType': 'Tipo de simulador',
    'rooms.hasBriefingArea': 'Área de briefing integrada',
    'rooms.autoBookBriefForSim': 'Briefing auto para simulador',
    'rooms.places': 'plazas',
    'rooms.confirmDelete': '¿Eliminar esta sala?',
    'rooms.tabManage': 'Gestión',
    'rooms.tabPlanning': 'Planificación',
    'rooms.today': 'Hoy',
    'rooms.planningEmpty': 'No hay salas configuradas. Añada salas en la pestaña Gestión.',
    'rooms.filterAllTypes': 'Todos los tipos',
    'rooms.filterAllSources': 'Todas las fuentes',
    'rooms.sourceAdmin': 'Admin',
    'rooms.sourceTablet': 'Tablet',
    'rooms.sourceApi': 'API',
    'booking.add': 'Añadir reserva',
    'booking.edit': 'Modificar reserva',
    'booking.room': 'Sala',
    'booking.start': 'Inicio',
    'booking.end': 'Fin',
    'booking.title': 'Título',
    'booking.titlePlaceholder': 'Briefing, Curso nav...',
    'booking.bookedBy': 'Reservado por',
    'booking.byPlaceholder': 'Nombre',
    'booking.delete': 'Eliminar',
    'booking.confirmDelete': '¿Eliminar esta reserva?',
    'booking.defaultTitle': 'Reserva',
    'booking.errorRequired': 'Sala, inicio y fin son obligatorios.',
    'booking.errorEndBeforeStart': 'La hora de fin debe ser posterior al inicio.',
    'booking.errorOverlap': 'Este horario se solapa con una reserva existente.',
    'booking.errorSave': 'Error al guardar.',
    'rooms.tabFlights': 'Vuelos',
    'flights.add': 'Añadir vuelo',
    'flights.edit': 'Modificar vuelo',
    'flights.empty': 'Sin vuelos este día.',
    'flights.aircraft': 'Matrícula',
    'flights.start': 'Inicio',
    'flights.end': 'Fin',
    'flights.pilot': 'Piloto',
    'flights.instructor': 'Instructor',
    'flights.type': 'Tipo de vuelo',
    'flights.confirmDelete': '¿Eliminar este vuelo?',
    'flights.errorRequired': 'Matrícula, horarios y piloto son obligatorios.',
    'flights.errorTime': 'La hora de fin debe ser posterior al inicio.',
    'flights.errorSave': 'Error al guardar.',
    'fleet.add': 'Añadir aeronave',
    'fleet.empty': 'Ninguna aeronave configurada.',
    'fleet.registration': 'Matrícula',
    'fleet.regPlaceholder': 'EC-ABC',
    'fleet.type': 'Tipo de aeronave',
    'fleet.typePlaceholder': 'Cessna 172S',
    'fleet.hours': 'Horas totales',
    'fleet.status': 'Estado',
    'fleet.melItems': 'Elementos MEL',
    'fleet.melAdd': 'Añadir MEL',
    'fleet.melCode': 'Código ATA',
    'fleet.melDesc': 'Descripción',
    'fleet.melCategory': 'Cat.',
    'fleet.melExpiry': 'Vencimiento',
    'fleet.nogoReason': 'Motivo de indisponibilidad',
    'fleet.maintReason': 'Motivo del mantenimiento',
    'fleet.save': 'Guardar',
    'fleet.editTitle': 'Modificar aeronave',
    'fleet.confirmDelete': '¿Eliminar esta aeronave?',
    'fleet.deleteTitle': 'Eliminar',
    'error.loadFleet': 'Error al cargar la flota',
    'error.saveFleet': 'Error al guardar la flota'
  },

  en: {
    'common.save': 'Save',
    'common.cancel': 'Cancel',
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
    'error.sessionExpired': 'Session expired',
    'nav.content': 'Content',
    'nav.config': 'Configuration',
    'cfg.loading': 'Loading...',
    'cfg.saving': 'Saving...',
    'cfg.saveSuccess': 'Configuration saved',
    'cfg.saveError': 'Error saving configuration',
    'cfg.loadError': 'Error loading configuration',
    'cfg.noConfig': 'No configuration found',
    'cfg.cancel': 'Cancel',
    'cfg.save': 'Save',
    'cfg.tabAerodrome': 'Aerodrome',
    'cfg.tabThresholds': 'Thresholds',
    'cfg.tabUnits': 'Units',
    'cfg.tabMaps': 'Map',
    'cfg.tabTraffic': 'Traffic',
    'cfg.tabSections': 'Sections',
    'cfg.tabAppearance': 'Appearance',
    'cfg.tabClubDisplay': 'Club content',
    'cfg.tabSystem': 'System',
    'cfg.system.languageTitle': 'Language',
    'cfg.system.passwordTitle': 'Admin password',
    'cfg.system.currentPassword': 'Current password',
    'cfg.system.newPassword': 'New password',
    'cfg.system.confirmPassword': 'Confirm',
    'cfg.system.savePassword': 'Save password',
    'cfg.system.removePassword': 'Remove password',
    'cfg.system.passwordStatusSet': 'An admin password is set.',
    'cfg.system.passwordStatusNone': 'No admin password set.',
    'cfg.system.passwordOldIncorrect': 'Current password incorrect.',
    'cfg.system.passwordNewRequired': 'Enter a new password.',
    'cfg.system.passwordMismatch': 'Passwords do not match.',
    'cfg.system.roomsTitle': 'Planning',
    'cfg.station.icaoLabel': 'ICAO code or name',
    'cfg.station.searchPlaceholder': 'Search an aerodrome...',
    'cfg.station.displayName': 'Display name',
    'cfg.station.latitude': 'Latitude',
    'cfg.station.longitude': 'Longitude',
    'cfg.station.fir': 'FIR',
    'cfg.station.firName': 'FIR name',
    'cfg.station.firPlaceholder': 'e.g.: LFRR',
    'cfg.station.firNamePlaceholder': 'e.g.: FIR Brest',
    'cfg.station.sigmetRegion': 'SIGMET region',
    'cfg.station.regionEur': 'Europe',
    'cfg.station.regionNam': 'North America',
    'cfg.station.regionIntl': 'International',
    'cfg.station.noResult': 'No results',
    'cfg.station.searchUnavailableCloud': 'Search is only available in local WiFi mode. Enter the information manually.',
    'cfg.runways.title': 'Runways',
    'cfg.runways.name': 'Name',
    'cfg.runways.heading': 'Heading (°)',
    'cfg.runways.add': '+ Add',
    'cfg.runways.noRunway': 'No runways configured',
    'cfg.runways.namePlaceholder': 'e.g.: 09',
    'cfg.runways.headingPlaceholder': '090',
    'cfg.thresholds.profile': 'Profile',
    'cfg.thresholds.standard': 'Standard',
    'cfg.thresholds.custom': 'Custom',
    'cfg.thresholds.vfr': 'VFR',
    'cfg.thresholds.vfrSpecial': 'Special VFR',
    'cfg.thresholds.greenThreshold': 'Green threshold (optimal conditions)',
    'cfg.thresholds.minVisibility': 'Min visibility (m)',
    'cfg.thresholds.minCeiling': 'Min ceiling (ft)',
    'cfg.thresholds.runwayWind': 'Runway wind',
    'cfg.thresholds.crossDanger': 'Crosswind danger (kt)',
    'cfg.thresholds.crossWarning': 'Crosswind warning (kt)',
    'cfg.thresholds.tailDanger': 'Tailwind danger (kt)',
    'cfg.thresholds.tailWarning': 'Tailwind warning (kt)',
    'cfg.thresholds.fogTitle': 'Fog (Temp/Dew spread)',
    'cfg.thresholds.fogDanger': 'Danger (°C)',
    'cfg.thresholds.fogWarning': 'Warning (°C)',
    'cfg.thresholds.fogWatch': 'Watch (°C)',
    'cfg.thresholds.metarAge': 'METAR age',
    'cfg.thresholds.metarDanger': 'Danger (min)',
    'cfg.thresholds.metarWarning': 'Warning (min)',
    'cfg.thresholds.sunsetAlert': 'Aeronautical night alert',
    'cfg.thresholds.sunsetOrange': 'Orange alert (min)',
    'cfg.thresholds.sunsetRed': 'Red alert (min)',
    'cfg.thresholds.category': 'Category',
    'cfg.thresholds.visibility': 'Visibility',
    'cfg.thresholds.ceiling': 'Ceiling',
    // ── Units ──
    'cfg.units.title': 'Display units',
    'cfg.units.pressure': 'Pressure',
    'cfg.units.visibility': 'Visibility',
    'cfg.units.temperature': 'Temperature',
    'cfg.units.wind': 'Wind',
    'cfg.units.metric': 'Metric (m/km)',
    'cfg.units.statuteMiles': 'Statute Miles (SM)',
    'cfg.units.knots': 'Knots (kt)',
    'cfg.units.kmh': 'km/h',
    'cfg.maps.basemap': 'Base map',
    'cfg.maps.basemapDark': 'Dark minimal',
    'cfg.maps.basemapDarkDetail': 'Dark detailed',
    'cfg.maps.basemapVoyager': 'Light (roads and cities)',
    'cfg.maps.basemapOsm': 'Standard OpenStreetMap',
    'cfg.maps.basemapAuto': 'Auto day/night',
    'cfg.maps.basemapDay': 'Day map',
    'cfg.maps.basemapNight': 'Night map',
    'cfg.maps.basemapBrightness': 'Base map brightness',
    'cfg.maps.weatherIntensityDark': 'Weather layer intensity (dark base)',
    'cfg.maps.weatherIntensityLight': 'Weather layer intensity (light base)',
    'cfg.maps.airportsOnMap': 'Airports on map',
    'cfg.maps.airportsNone': 'Hidden',
    'cfg.maps.airportsIcao': 'Airports only',
    'cfg.maps.airportsUlm': 'ULM bases only',
    'cfg.maps.airportsAll': 'Airports + ULM bases',
    'cfg.maps.zoom': 'Zoom',
    'cfg.maps.offsetNS': 'Offset N/S',
    'cfg.maps.offsetEW': 'Offset E/W',
    'cfg.maps.layerDuration': 'Duration per layer (s)',
    'cfg.maps.enabledLayers': 'Enabled layers',
    'cfg.traffic.title': 'Air traffic',
    'cfg.traffic.enabled': 'Show real-time air traffic',
    'cfg.traffic.detail': 'Detail level',
    'cfg.traffic.icon': 'Icon only',
    'cfg.traffic.callsign': 'Icon + callsign',
    'cfg.traffic.full': 'Icon + callsign + altitude',
    'cfg.traffic.refresh': 'Refresh (s)',
    'cfg.traffic.radius': 'Radius (NM)',
    'cfg.traffic.alt': 'Max altitude (ft)',
    'cfg.traffic.altUnlimited': '(0 = unlimited)',
    'cfg.traffic.watchlist': 'My aircraft (callsigns, commas)',
    'cfg.traffic.watchMode': 'Display mode',
    'cfg.traffic.watchHighlight': 'My aircraft highlighted',
    'cfg.traffic.watchOnly': 'My aircraft only',
    'cfg.traffic.flarmTitle': 'FLARM traffic',
    'cfg.traffic.flarmEnabled': 'Show FLARM traffic',
    'cfg.traffic.flarmRadius': 'FLARM radius (km)',
    'cfg.traffic.flarmHint': 'FLARM aircraft appear as green triangles. Altitude filters and watchlist also apply to FLARM.',
    'cfg.traffic.fr24Title': 'FlightRadar24',
    'cfg.traffic.fr24Enabled': 'Enable FlightRadar24',
    'cfg.traffic.fr24ApiKey': 'API key',
    'cfg.traffic.fr24ApiKeyPlaceholder': 'Paste your FR24 API key...',
    'cfg.traffic.fr24Link': 'Get an API key',
    'cfg.traffic.fr24Hint': 'FR24 aircraft appear in pink. Includes Mode S (MLAT) aircraft. FR24 API subscription required ($9/month).',
    'cfg.sections.sunTimes': 'Sun times',
    'cfg.sections.conditions': 'Current conditions',
    'cfg.sections.fogAlert': 'Fog alert',
    'cfg.sections.runwayComponents': 'Wind components',
    'cfg.sections.preferredRunway': 'Preferred runway',
    'cfg.sections.metar': 'METAR',
    'cfg.sections.taf': 'TAF',
    'cfg.sections.tafBar': 'Visual TAF bar',
    'cfg.sections.sigmet': 'SIGMET',
    'cfg.sections.flightCategory': 'Flight category',
    'cfg.sections.sunsetWarning': 'Sunset warning',
    'cfg.sections.ramadan': 'Ramadan times (Imsak / Iftar)',
    'cfg.sections.activityProfile': 'Activity profile',
    'cfg.sections.profileStandard': 'Standard (aerodrome)',
    'cfg.sections.profileGlider': 'Glider',
    'cfg.sections.profileAeromodel': 'Aeromodelling',
    'cfg.sections.profileCustom': 'Custom',
    'cfg.sections.tafDisplay': 'TAF display',
    'cfg.sections.tafRaw': 'Raw only',
    'cfg.sections.tafDecoded': 'Decoded only',
    'cfg.sections.tafBoth': 'Raw + Decoded',
    'cfg.sections.tafBarOnly': 'Visual bar only',
    'cfg.sections.sidebarPosition': 'Weather panel position',
    'cfg.sections.sidebarRight': 'Right',
    'cfg.sections.sidebarLeft': 'Left',
    'cfg.appearance.themeSection': 'Theme',
    'cfg.appearance.mode': 'Mode',
    'cfg.appearance.auto': 'Auto (day/night)',
    'cfg.appearance.fixed': 'Fixed theme',
    'cfg.appearance.dayTheme': 'Day theme',
    'cfg.appearance.nightTheme': 'Night theme',
    'cfg.appearance.themeLabel': 'Theme',
    'cfg.appearance.brandingSection': 'Branding',
    'cfg.appearance.displayTitle': 'Display title',
    'cfg.appearance.displayTitlePlaceholder': 'e.g.: IROISE',
    'cfg.appearance.clubName': 'Club name',
    'cfg.appearance.clubNamePlaceholder': 'e.g.: Iroise Flying Club',
    'cfg.appearance.logoDay': 'Day logo',
    'cfg.appearance.logoNight': 'Night logo',
    'cfg.appearance.chooseLogo': 'Choose...',
    'cfg.screens.title': 'Screens',
    'cfg.screens.hint': 'Choose the display mode for each detected screen.',
    'cfg.screens.add': 'Add a screen',
    'cfg.screens.screen': 'Screen',
    'cfg.screens.viewFull': 'Full (map + weather)',
    'cfg.screens.viewMap': 'Map only',
    'cfg.screens.viewWeather': 'Weather only (sidebar)',
    'cfg.screens.viewFleet': 'Fleet',
    'cfg.screens.viewClub': 'Club content',
    'cfg.screens.viewPlanning': 'Planning (aircraft + rooms)',
    'cfg.screens.viewBriefing': 'Briefing rooms',
    'cfg.clubDisplay.title': 'Club display',
    'cfg.clubDisplay.enabled': 'Enable club display',
    'cfg.clubDisplay.enabledHint': 'Show custom content on the kiosk rotating with weather.',
    'cfg.clubDisplay.serverEnabled': 'Local server',
    'cfg.clubDisplay.serverHint': 'Admin access over WiFi, no internet needed.',
    'cfg.clubDisplay.serverPort': 'Port',
    'cfg.clubDisplay.placement': 'Rotation mode',
    'cfg.clubDisplay.placementAfter': 'Club slides after weather',
    'cfg.clubDisplay.placementInterleaved': 'Interleaved with weather',
    'cfg.clubDisplay.placementOnly': 'Club content only',
    'cfg.clubDisplay.defaultDuration': 'Default duration (s)',
    'nav.fleet': 'Fleet',
    'nav.rooms': 'Scheduling',
    'cfg.rooms.screenThemeTitle': 'Room screen (tablet)',
    'cfg.rooms.screenThemeHint': 'Theme of the room page displayed on tablet.',
    'cfg.rooms.themeDark': 'Dark',
    'cfg.rooms.themeLight': 'Light',
    'rooms.add': 'Add a room',
    'rooms.edit': 'Edit room',
    'rooms.empty': 'No rooms configured.',
    'rooms.name': 'Name',
    'rooms.namePlaceholder': 'e.g.: Room A',
    'rooms.type': 'Type',
    'rooms.typeBriefing': 'Briefing',
    'rooms.typeSimulateur': 'Simulator',
    'rooms.typeCours': 'Classroom',
    'rooms.typeAutre': 'Other',
    'rooms.capacity': 'Capacity',
    'rooms.certifications': 'Certifications',
    'rooms.certMCC': 'MCC',
    'rooms.certQT': 'QT',
    'rooms.simType': 'Simulator type',
    'rooms.hasBriefingArea': 'Built-in briefing area',
    'rooms.autoBookBriefForSim': 'Auto-book brief for sim',
    'rooms.places': 'seats',
    'rooms.confirmDelete': 'Delete this room?',
    'rooms.tabManage': 'Manage',
    'rooms.tabPlanning': 'Planning',
    'rooms.today': 'Today',
    'rooms.planningEmpty': 'No rooms configured. Add rooms in the Manage tab.',
    'rooms.filterAllTypes': 'All types',
    'rooms.filterAllSources': 'All sources',
    'rooms.sourceAdmin': 'Admin',
    'rooms.sourceTablet': 'Tablet',
    'rooms.sourceApi': 'API',
    'booking.add': 'Add booking',
    'booking.edit': 'Edit booking',
    'booking.room': 'Room',
    'booking.start': 'Start',
    'booking.end': 'End',
    'booking.title': 'Title',
    'booking.titlePlaceholder': 'Briefing, Nav course...',
    'booking.bookedBy': 'Booked by',
    'booking.byPlaceholder': 'Name',
    'booking.delete': 'Delete',
    'booking.confirmDelete': 'Delete this booking?',
    'booking.defaultTitle': 'Booking',
    'booking.errorRequired': 'Room, start and end are required.',
    'booking.errorEndBeforeStart': 'End time must be after start time.',
    'booking.errorOverlap': 'This slot overlaps with an existing booking.',
    'booking.errorSave': 'Error saving booking.',
    'rooms.tabFlights': 'Flights',
    'flights.add': 'Add flight',
    'flights.edit': 'Edit flight',
    'flights.empty': 'No flights on this day.',
    'flights.aircraft': 'Registration',
    'flights.start': 'Start',
    'flights.end': 'End',
    'flights.pilot': 'Pilot',
    'flights.instructor': 'Instructor',
    'flights.type': 'Flight type',
    'flights.confirmDelete': 'Delete this flight?',
    'flights.errorRequired': 'Registration, times and pilot are required.',
    'flights.errorTime': 'End time must be after start time.',
    'flights.errorSave': 'Error saving flight.',
    'fleet.add': 'Add aircraft',
    'fleet.empty': 'No aircraft configured.',
    'fleet.registration': 'Registration',
    'fleet.regPlaceholder': 'N12345',
    'fleet.type': 'Aircraft type',
    'fleet.typePlaceholder': 'Cessna 172S',
    'fleet.hours': 'Total hours',
    'fleet.status': 'Status',
    'fleet.melItems': 'MEL items',
    'fleet.melAdd': 'Add MEL',
    'fleet.melCode': 'ATA code',
    'fleet.melDesc': 'Description',
    'fleet.melCategory': 'Cat.',
    'fleet.melExpiry': 'Expiry date',
    'fleet.nogoReason': 'Reason for unavailability',
    'fleet.maintReason': 'Maintenance reason',
    'fleet.save': 'Save',
    'fleet.editTitle': 'Edit aircraft',
    'fleet.confirmDelete': 'Delete this aircraft?',
    'fleet.deleteTitle': 'Delete',
    'error.loadFleet': 'Error loading fleet',
    'error.saveFleet': 'Error saving fleet'
  }
};

const SUPPORTED_LANGS = ['fr', 'de', 'it', 'es', 'en'];
const LANG_LABELS = { fr: 'FR', de: 'DE', it: 'IT', es: 'ES', en: 'EN' };
const DATE_LOCALES = { fr: 'fr-FR', de: 'de-DE', it: 'it-IT', es: 'es-ES', en: 'en-GB' };

/** Detect browser language → supported lang, fallback 'en' */
function detectLang() {
  // Check localStorage first (manual override)
  const saved = localStorage.getItem('clubAdminLang');
  if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
  // Auto-detect from browser
  const nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
  const short = nav.split('-')[0];
  return SUPPORTED_LANGS.includes(short) ? short : 'en';
}

let LANG = detectLang();

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
  // Sync all language selectors
  document.querySelectorAll('.lang-select').forEach(sel => { sel.value = LANG; });
}

/** Change language, persist, and re-apply */
function setLang(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  LANG = lang;
  localStorage.setItem('clubAdminLang', lang);
  applyI18n();
  // Re-render slides if visible (dynamic content)
  if (dashboard.classList.contains('visible')) {
    const modeIndicator = document.getElementById('modeIndicator');
    if (modeIndicator) {
      modeIndicator.textContent = api.mode === 'local' ? t('dashboard.modeLocal') : t('dashboard.modeCloud');
    }
    renderSlides();
    if (currentView === 'fleet') renderFleet();
    // Re-render config if loaded
    if (currentView === 'config' && fullConfig) {
      cfgRenderSectionToggles();
      cfgRenderThemeGrids();
    }
  }
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

  // ── GET FLEET ──

  async getFleet() {
    if (this.mode === 'local') {
      const resp = await this._fetchLocal('/api/fleet');
      return resp.json();
    } else {
      const resp = await fetch(
        SUPABASE_URL + '/rest/v1/club_fleet?license_key=eq.' + encodeURIComponent(this.licenseKey)
          + '&order=sort_order.asc,registration.asc',
        { headers: supabaseHeaders() }
      );
      if (!resp.ok) throw new Error(t('error.loadFleet'));
      return resp.json();
    }
  }

  // ── CREATE FLEET ITEM ──

  async createFleetItem(data) {
    if (this.mode === 'local') {
      const resp = await this._fetchLocal('/api/fleet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return resp.json();
    } else {
      const resp = await fetch(SUPABASE_URL + '/rest/v1/club_fleet', {
        method: 'POST',
        headers: supabaseHeaders({ 'Prefer': 'return=representation' }),
        body: JSON.stringify({
          license_key: this.licenseKey,
          registration: data.registration,
          type: data.type || '',
          status: data.status || 'go',
          total_hours: data.total_hours || null,
          mel_items: data.mel_items || [],
          nogo_reason: data.nogo_reason || '',
          sort_order: data.sort_order || 0
        })
      });
      if (!resp.ok) throw new Error(t('error.saveFleet'));
      const rows = await resp.json();
      return rows[0] || null;
    }
  }

  // ── UPDATE FLEET ITEM ──

  async updateFleetItem(id, data) {
    if (this.mode === 'local') {
      const resp = await this._fetchLocal('/api/fleet/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return resp.json();
    } else {
      const resp = await fetch(
        SUPABASE_URL + '/rest/v1/club_fleet?id=eq.' + encodeURIComponent(id),
        {
          method: 'PATCH',
          headers: supabaseHeaders({ 'Prefer': 'return=representation' }),
          body: JSON.stringify(data)
        }
      );
      if (!resp.ok) throw new Error(t('error.saveFleet'));
      const rows = await resp.json();
      return rows[0] || null;
    }
  }

  // ── DELETE FLEET ITEM ──

  async deleteFleetItem(id) {
    if (this.mode === 'local') {
      const resp = await this._fetchLocal('/api/fleet/' + id, { method: 'DELETE' });
      return resp.json();
    } else {
      const resp = await fetch(
        SUPABASE_URL + '/rest/v1/club_fleet?id=eq.' + encodeURIComponent(id),
        { method: 'DELETE', headers: supabaseHeaders() }
      );
      return { success: resp.ok };
    }
  }

  // ── ROOMS CRUD ──

  async getRooms() {
    if (this.mode === 'local') {
      const resp = await this._fetchLocal('/api/rooms');
      return resp.json();
    } else {
      const resp = await fetch(
        SUPABASE_URL + '/rest/v1/rooms?license_key=eq.' + encodeURIComponent(this.licenseKey) + '&order=display_order.asc,name.asc',
        { headers: supabaseHeaders() }
      );
      return resp.json();
    }
  }

  async createRoom(data) {
    if (this.mode === 'local') {
      const resp = await this._fetchLocal('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return resp.json();
    } else {
      const payload = { ...data, license_key: this.licenseKey, updated_at: new Date().toISOString() };
      const resp = await fetch(SUPABASE_URL + '/rest/v1/rooms', {
        method: 'POST',
        headers: { ...supabaseHeaders(), 'Prefer': 'return=representation' },
        body: JSON.stringify(payload)
      });
      const rows = await resp.json();
      return rows[0] || null;
    }
  }

  async updateRoom(id, data) {
    if (this.mode === 'local') {
      const resp = await this._fetchLocal('/api/rooms/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return resp.json();
    } else {
      const resp = await fetch(
        SUPABASE_URL + '/rest/v1/rooms?id=eq.' + encodeURIComponent(id),
        {
          method: 'PATCH',
          headers: { ...supabaseHeaders(), 'Prefer': 'return=representation' },
          body: JSON.stringify({ ...data, updated_at: new Date().toISOString() })
        }
      );
      const rows = await resp.json();
      return rows[0] || null;
    }
  }

  async deleteRoom(id) {
    if (this.mode === 'local') {
      const resp = await this._fetchLocal('/api/rooms/' + id, { method: 'DELETE' });
      return resp.json();
    } else {
      const resp = await fetch(
        SUPABASE_URL + '/rest/v1/rooms?id=eq.' + encodeURIComponent(id),
        { method: 'DELETE', headers: supabaseHeaders() }
      );
      return { success: resp.ok };
    }
  }

  // ── ROOM BOOKINGS CRUD ──

  async getBookings(date) {
    if (this.mode === 'local') {
      const resp = await this._fetchLocal('/api/room-bookings?date=' + encodeURIComponent(date));
      return resp.json();
    } else {
      const resp = await fetch(
        SUPABASE_URL + '/rest/v1/room_bookings?license_key=eq.' + encodeURIComponent(this.licenseKey) + '&date=eq.' + date + '&order=start_time.asc',
        { headers: supabaseHeaders() }
      );
      return resp.json();
    }
  }

  async createBooking(data) {
    if (this.mode === 'local') {
      const resp = await this._fetchLocal('/api/room-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return resp.json();
    } else {
      const payload = { ...data, license_key: this.licenseKey, updated_at: new Date().toISOString() };
      const resp = await fetch(SUPABASE_URL + '/rest/v1/room_bookings', {
        method: 'POST',
        headers: { ...supabaseHeaders(), 'Prefer': 'return=representation' },
        body: JSON.stringify(payload)
      });
      const rows = await resp.json();
      return rows[0] || null;
    }
  }

  async updateBooking(id, data) {
    if (this.mode === 'local') {
      const resp = await this._fetchLocal('/api/room-bookings/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return resp.json();
    } else {
      const resp = await fetch(
        SUPABASE_URL + '/rest/v1/room_bookings?id=eq.' + encodeURIComponent(id),
        {
          method: 'PATCH',
          headers: { ...supabaseHeaders(), 'Prefer': 'return=representation' },
          body: JSON.stringify({ ...data, updated_at: new Date().toISOString() })
        }
      );
      const rows = await resp.json();
      return rows[0] || null;
    }
  }

  async deleteBooking(id) {
    if (this.mode === 'local') {
      const resp = await this._fetchLocal('/api/room-bookings/' + id, { method: 'DELETE' });
      return resp.json();
    } else {
      const resp = await fetch(
        SUPABASE_URL + '/rest/v1/room_bookings?id=eq.' + encodeURIComponent(id),
        { method: 'DELETE', headers: supabaseHeaders() }
      );
      return { success: resp.ok };
    }
  }

  // ── FLIGHT BOOKINGS CRUD ──

  async getFlights(date) {
    if (this.mode === 'local') {
      const resp = await this._fetchLocal('/api/flight-bookings?date=' + encodeURIComponent(date));
      return resp.json();
    } else {
      const resp = await fetch(
        SUPABASE_URL + '/rest/v1/flight_bookings?license_key=eq.' + encodeURIComponent(this.licenseKey) + '&date=eq.' + date + '&order=start_time.asc',
        { headers: supabaseHeaders() }
      );
      return resp.json();
    }
  }

  async createFlight(data) {
    if (this.mode === 'local') {
      const resp = await this._fetchLocal('/api/flight-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return resp.json();
    } else {
      const payload = { ...data, license_key: this.licenseKey, updated_at: new Date().toISOString() };
      const resp = await fetch(SUPABASE_URL + '/rest/v1/flight_bookings', {
        method: 'POST',
        headers: { ...supabaseHeaders(), 'Prefer': 'return=representation' },
        body: JSON.stringify(payload)
      });
      const rows = await resp.json();
      return rows[0] || null;
    }
  }

  async updateFlight(id, data) {
    if (this.mode === 'local') {
      const resp = await this._fetchLocal('/api/flight-bookings/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return resp.json();
    } else {
      const resp = await fetch(
        SUPABASE_URL + '/rest/v1/flight_bookings?id=eq.' + encodeURIComponent(id),
        {
          method: 'PATCH',
          headers: { ...supabaseHeaders(), 'Prefer': 'return=representation' },
          body: JSON.stringify({ ...data, updated_at: new Date().toISOString() })
        }
      );
      const rows = await resp.json();
      return rows[0] || null;
    }
  }

  async deleteFlight(id) {
    if (this.mode === 'local') {
      const resp = await this._fetchLocal('/api/flight-bookings/' + id, { method: 'DELETE' });
      return resp.json();
    } else {
      const resp = await fetch(
        SUPABASE_URL + '/rest/v1/flight_bookings?id=eq.' + encodeURIComponent(id),
        { method: 'DELETE', headers: supabaseHeaders() }
      );
      return { success: resp.ok };
    }
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

  // ── GET FULL CONFIG ──

  async getFullConfig() {
    if (this.mode === 'local') {
      const resp = await this._fetchLocal('/api/full-config');
      return resp.json();
    } else {
      const resp = await fetch(
        SUPABASE_URL + '/rest/v1/club_config?license_key=eq.' + encodeURIComponent(this.licenseKey)
          + '&select=config,updated_at',
        { headers: supabaseHeaders() }
      );
      if (!resp.ok) throw new Error('Failed to load config');
      const rows = await resp.json();
      return rows.length > 0 ? rows[0].config : null;
    }
  }

  // ── SAVE FULL CONFIG ──

  async saveFullConfig(config) {
    if (this.mode === 'local') {
      const resp = await this._fetchLocal('/api/full-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      return resp.json();
    } else {
      const resp = await fetch(SUPABASE_URL + '/rest/v1/club_config', {
        method: 'POST',
        headers: supabaseHeaders({ 'Prefer': 'resolution=merge-duplicates' }),
        body: JSON.stringify({
          license_key: this.licenseKey,
          config,
          updated_at: new Date().toISOString()
        })
      });
      if (!resp.ok) throw new Error('Failed to save config');
      return { success: true };
    }
  }

  // ── SEARCH AIRPORTS ──

  async searchAirports(query) {
    if (this.mode === 'local') {
      const resp = await this._fetchLocal('/api/airports/search?q=' + encodeURIComponent(query));
      return resp.json();
    } else {
      return [];
    }
  }

  // ── GET AIRPORT DETAILS ──

  async getAirport(id) {
    if (this.mode === 'local') {
      try {
        const resp = await this._fetchLocal('/api/airports/' + encodeURIComponent(id));
        if (!resp.ok) return null;
        return resp.json();
      } catch (e) { return null; }
    } else {
      return null;
    }
  }

  // ── UPLOAD LOGO ──

  async uploadLogo(file) {
    if (this.mode === 'local') {
      const formData = new FormData();
      formData.append('image', file);
      const resp = await this._fetchLocal('/api/upload-logo', {
        method: 'POST',
        body: formData
      });
      return resp.json();
    } else {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = this.licenseKey + '/logos/' + Date.now() + '-' + safeName;
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
      return { fileName: storagePath, isCloudPath: true };
    }
  }

  // ── GOD MODE ──

  async godModeUnlock(password) {
    if (this.mode === 'local') {
      const resp = await this._fetchLocal('/api/godmode-unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      return resp.json();
    } else {
      // Mode cloud : vérification côté client
      if (!fullConfig || !fullConfig.godMode?.passwordHash) return { ok: false, needsSetup: true };
      const ok = await verifyHashClient(password, fullConfig.godMode.passwordHash);
      return { ok };
    }
  }

  async godModeSetup(password) {
    if (this.mode === 'local') {
      const resp = await this._fetchLocal('/api/godmode-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      return resp.json();
    } else {
      // Mode cloud : hash côté client et sauvegarder dans config
      const hash = await hashPasswordClient(password);
      if (!fullConfig.godMode) fullConfig.godMode = {};
      fullConfig.godMode.passwordHash = hash;
      await this.saveFullConfig(fullConfig);
      return { ok: true };
    }
  }

  async lightningToggle() {
    if (this.mode === 'local') {
      const resp = await this._fetchLocal('/api/lightning-toggle', { method: 'POST' });
      return resp.json();
    }
    // Mode cloud : pas supporté (lightning = local only)
    return { ok: false, error: 'local_only' };
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

  // Reset to content view, clear config cache
  fullConfig = null;
  originalFullConfig = null;
  godModeActive = false;
  const godTab = document.querySelector('.god-tab');
  if (godTab) godTab.style.display = 'none';
  switchView('content');

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

// ── FLEET STATE ──
let fleetItems = [];
let editingFleetId = null;

async function refreshFleet() {
  try {
    fleetItems = await api.getFleet();
    // Sort: nogo first, maint, mel, go, then by registration
    const statusOrder = { nogo: 0, maint: 1, mel: 2, go: 3 };
    fleetItems.sort((a, b) => {
      const sa = statusOrder[a.status] ?? 2;
      const sb = statusOrder[b.status] ?? 2;
      if (sa !== sb) return sa - sb;
      return (a.registration || '').localeCompare(b.registration || '');
    });
    renderFleet();
  } catch (e) {
    console.error('Error loading fleet:', e);
  }
}

function renderFleet() {
  const container = document.getElementById('fleetList');
  if (fleetItems.length === 0) {
    container.innerHTML = '<div class="empty-state">'
      + '<div class="icon">✈</div>'
      + '<p>' + t('fleet.empty') + '</p>'
      + '</div>';
    return;
  }

  container.innerHTML = fleetItems.map(a => {
    const statusLabels = { go: 'GO', mel: 'MEL', nogo: 'NO GO', maint: 'MAINT' };
    const statusLabel = statusLabels[a.status] || a.status.toUpperCase();
    let meta = a.type || '';
    if (a.total_hours != null) meta += (meta ? ' · ' : '') + a.total_hours + ' h';
    if (a.status === 'mel' && Array.isArray(a.mel_items) && a.mel_items.length > 0) {
      meta += ' · ' + a.mel_items.length + ' MEL';
    }
    if (a.status === 'nogo' && a.nogo_reason) {
      meta += (meta ? ' · ' : '') + escapeHtml(a.nogo_reason).substring(0, 50);
    }
    if (a.status === 'maint' && a.maint_reason) {
      meta += (meta ? ' · ' : '') + escapeHtml(a.maint_reason).substring(0, 50);
    }

    return '<div class="fleet-card" data-id="' + a.id + '">'
      + '<div class="fleet-card-dot ' + a.status + '"></div>'
      + '<div class="fleet-card-info">'
      + '  <div class="fleet-card-top">'
      + '    <span class="fleet-card-reg">' + escapeHtml(a.registration) + '</span>'
      + '    <span class="fleet-card-badge ' + a.status + '">' + statusLabel + '</span>'
      + '  </div>'
      + '  <div class="fleet-card-meta">' + escapeHtml(meta) + '</div>'
      + '</div>'
      + '<div class="fleet-card-actions">'
      + '  <button class="btn-edit" onclick="editFleetItem(\'' + a.id + '\')" title="Edit">✎</button>'
      + '  <button class="btn-delete" onclick="deleteFleetItem(\'' + a.id + '\')" title="' + t('fleet.deleteTitle') + '">✕</button>'
      + '</div>'
      + '</div>';
  }).join('');
}

// ── FLEET MODAL ──

const fleetModalOverlay = document.getElementById('fleetModalOverlay');
const fleetForm = document.getElementById('fleetForm');

function openFleetModal(item) {
  editingFleetId = item ? item.id : null;
  document.getElementById('fleetModalTitle').textContent = item ? t('fleet.editTitle') : t('fleet.add');
  document.getElementById('fleetReg').value = item ? item.registration : '';
  document.getElementById('fleetType').value = item ? (item.type || '') : '';
  document.getElementById('fleetHours').value = item ? (item.total_hours || '') : '';
  document.getElementById('fleetNogoReason').value = item ? (item.nogo_reason || '') : '';
  document.getElementById('fleetMaintReason').value = item ? (item.maint_reason || '') : '';

  // Status radios
  const status = item ? item.status : 'go';
  document.querySelectorAll('input[name="fleetStatus"]').forEach(r => { r.checked = r.value === status; });
  updateFleetStatusUI();

  // MEL items
  const melList = document.getElementById('fleetMelList');
  melList.innerHTML = '';
  if (item && Array.isArray(item.mel_items)) {
    item.mel_items.forEach(m => addMelItem(m));
  }

  fleetModalOverlay.classList.add('visible');
}

function closeFleetModal() {
  fleetModalOverlay.classList.remove('visible');
  editingFleetId = null;
}

function updateFleetStatusUI() {
  const status = document.querySelector('input[name="fleetStatus"]:checked')?.value || 'go';
  document.getElementById('fleetMelSection').style.display = status === 'mel' ? '' : 'none';
  document.getElementById('fleetNogoSection').style.display = status === 'nogo' ? '' : 'none';
  document.getElementById('fleetMaintSection').style.display = status === 'maint' ? '' : 'none';
}

// Status radio change
document.querySelectorAll('input[name="fleetStatus"]').forEach(r => {
  r.addEventListener('change', updateFleetStatusUI);
});

function addMelItem(data) {
  const list = document.getElementById('fleetMelList');
  const row = document.createElement('div');
  row.className = 'mel-item-row';
  row.innerHTML = '<div class="form-group" style="flex:1.2;">'
    + '<input type="text" class="mel-code" placeholder="' + t('fleet.melCode') + '" value="' + escapeHtml((data && data.code) || '') + '">'
    + '</div>'
    + '<div class="form-group" style="flex:2;">'
    + '<input type="text" class="mel-desc" placeholder="' + t('fleet.melDesc') + '" value="' + escapeHtml((data && data.description) || '') + '">'
    + '</div>'
    + '<div class="form-group" style="flex:0.6;">'
    + '<select class="mel-cat">'
    + '<option value="A"' + (data && data.category === 'A' ? ' selected' : '') + '>A</option>'
    + '<option value="B"' + (data && data.category === 'B' ? ' selected' : '') + '>B</option>'
    + '<option value="C"' + ((!data || !data.category || data.category === 'C') ? ' selected' : '') + '>C</option>'
    + '<option value="D"' + (data && data.category === 'D' ? ' selected' : '') + '>D</option>'
    + '</select>'
    + '</div>'
    + '<div class="form-group" style="flex:1;">'
    + '<input type="date" class="mel-expiry" value="' + ((data && data.expiryDate) || '') + '">'
    + '</div>'
    + '<button type="button" class="mel-remove" onclick="this.parentElement.remove()">✕</button>';
  list.appendChild(row);
}

function collectMelItems() {
  const items = [];
  document.querySelectorAll('#fleetMelList .mel-item-row').forEach(row => {
    const code = row.querySelector('.mel-code').value.trim();
    const description = row.querySelector('.mel-desc').value.trim();
    const category = row.querySelector('.mel-cat').value;
    const expiryDate = row.querySelector('.mel-expiry').value;
    if (code || description) {
      items.push({ code, description, category, expiryDate });
    }
  });
  return items;
}

fleetForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = fleetForm.querySelector('.btn-submit');
  submitBtn.disabled = true;

  const registration = document.getElementById('fleetReg').value.trim().toUpperCase();
  const type = document.getElementById('fleetType').value.trim();
  const totalHours = document.getElementById('fleetHours').value;
  const status = document.querySelector('input[name="fleetStatus"]:checked')?.value || 'go';
  const nogo_reason = document.getElementById('fleetNogoReason').value.trim();
  const maint_reason = document.getElementById('fleetMaintReason').value.trim();
  const mel_items = status === 'mel' ? collectMelItems() : [];

  const data = {
    registration,
    type,
    status,
    total_hours: totalHours ? parseFloat(totalHours) : null,
    mel_items,
    nogo_reason: status === 'nogo' ? nogo_reason : '',
    maint_reason: status === 'maint' ? maint_reason : ''
  };

  try {
    if (editingFleetId) {
      await api.updateFleetItem(editingFleetId, data);
    } else {
      await api.createFleetItem(data);
    }
    closeFleetModal();
    await refreshFleet();
  } catch (err) {
    console.error('Fleet save error:', err);
    alert(t('error.saveFleet'));
  }
  submitBtn.disabled = false;
});

fleetModalOverlay.addEventListener('click', (e) => {
  if (e.target === fleetModalOverlay) closeFleetModal();
});

function editFleetItem(id) {
  const item = fleetItems.find(a => a.id === id);
  if (item) openFleetModal(item);
}

async function deleteFleetItem(id) {
  if (!confirm(t('fleet.confirmDelete'))) return;
  try {
    await api.deleteFleetItem(id);
    await refreshFleet();
  } catch (e) {
    console.error('Fleet delete error:', e);
  }
}

// ── CONFIG STATE ──
let currentView = 'content';
// ── ROOMS STATE ──
let roomsList = [];
let editingRoomId = null;

async function refreshRooms() {
  try {
    const res = await api.getRooms();
    roomsList = res || [];
    renderRoomsList();
  } catch (err) {
    console.error('refreshRooms error:', err);
  }
}

function renderRoomsList() {
  const container = document.getElementById('roomsList');
  if (!roomsList.length) {
    container.innerHTML = `<div class="empty-state"><div class="icon">🚪</div><p>${t('rooms.empty')}</p></div>`;
    return;
  }
  // Sort by display_order
  const sorted = [...roomsList].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  container.innerHTML = sorted.map(room => {
    const typeBadge = t('rooms.type' + room.type.charAt(0).toUpperCase() + room.type.slice(1)) || room.type;
    let detail = '';
    if (room.type === 'simulateur' && room.sim_type) detail += ' ' + room.sim_type;
    if (room.type === 'simulateur' && room.has_briefing_area) detail += ' (' + (t('rooms.hasBriefingArea') || 'Brief intégré') + ')';
    if (room.type === 'briefing' && room.certifications && room.certifications.length) detail += ' [' + room.certifications.join(', ') + ']';
    const capText = room.capacity ? ` — ${room.capacity} ${t('rooms.places') || 'places'}` : '';
    return `<div class="fleet-card" data-id="${room.id}">
      <div class="fleet-card-header">
        <div class="fleet-reg">${escHtml(room.name)}</div>
        <div class="fleet-type">${escHtml(typeBadge + detail)}${capText}</div>
      </div>
      <div class="fleet-card-actions">
        <button class="btn-ghost" onclick="openRoomModal(roomsList.find(r=>r.id==='${room.id}'))">✏️</button>
        <button class="btn-ghost" onclick="deleteRoom('${room.id}')" style="color:var(--danger);">🗑</button>
      </div>
    </div>`;
  }).join('');
}

function escHtml(s) {
  const d = document.createElement('div');
  d.textContent = s || '';
  return d.innerHTML;
}

function onRoomTypeChange() {
  const type = document.getElementById('roomType').value;
  document.getElementById('roomCapacityGroup').style.display = (type === 'briefing' || type === 'cours') ? '' : 'none';
  document.getElementById('roomCertificationsGroup').style.display = type === 'briefing' ? '' : 'none';
  document.getElementById('roomSimTypeGroup').style.display = type === 'simulateur' ? '' : 'none';
  document.getElementById('roomBriefingAreaGroup').style.display = type === 'simulateur' ? '' : 'none';
}

function openRoomModal(room) {
  editingRoomId = room ? room.id : null;
  document.getElementById('roomModalTitle').textContent = room ? (t('rooms.edit') || 'Modifier la salle') : (t('rooms.add') || 'Ajouter une salle');
  document.getElementById('roomName').value = room ? room.name : '';
  document.getElementById('roomType').value = room ? room.type : 'briefing';
  document.getElementById('roomCapacity').value = room ? (room.capacity || '') : '';
  // Certifications (briefing)
  const certs = room && Array.isArray(room.certifications) ? room.certifications : [];
  document.getElementById('roomCertMCC').checked = certs.includes('MCC');
  document.getElementById('roomCertQT').checked = certs.includes('QT');
  // Simulateur
  document.getElementById('roomSimType').value = room && room.sim_type ? room.sim_type : 'VPT';
  document.getElementById('roomHasBriefingArea').checked = room ? !!room.has_briefing_area : false;
  onRoomTypeChange();
  document.getElementById('roomModalOverlay').style.display = 'flex';
}

function closeRoomModal() {
  document.getElementById('roomModalOverlay').style.display = 'none';
  editingRoomId = null;
}

async function saveRoom() {
  const name = document.getElementById('roomName').value.trim();
  if (!name) return;
  const type = document.getElementById('roomType').value;
  const data = {
    name,
    type,
    capacity: (type === 'briefing' || type === 'cours') ? (parseInt(document.getElementById('roomCapacity').value) || null) : null,
    certifications: type === 'briefing' ? ['MCC', 'QT'].filter(c => document.getElementById('roomCert' + c).checked) : [],
    sim_type: type === 'simulateur' ? document.getElementById('roomSimType').value : null,
    has_briefing_area: type === 'simulateur' ? document.getElementById('roomHasBriefingArea').checked : false
  };

  try {
    if (editingRoomId) {
      await api.updateRoom(editingRoomId, data);
    } else {
      await api.createRoom(data);
    }
    closeRoomModal();
    refreshRooms();
  } catch (err) {
    console.error('saveRoom error:', err);
  }
}

async function deleteRoom(id) {
  if (!confirm(t('rooms.confirmDelete') || 'Supprimer cette salle ?')) return;
  try {
    await api.deleteRoom(id);
    refreshRooms();
  } catch (err) {
    console.error('deleteRoom error:', err);
  }
}

// ── PLANNING STATE ──
let planningDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
let bookingsList = [];
let currentRoomsSubtab = 'manage';

function switchRoomsSubtab(tab) {
  currentRoomsSubtab = tab;
  document.querySelectorAll('.rooms-subtab').forEach(b =>
    b.classList.toggle('active', b.dataset.subtab === tab));
  document.getElementById('roomsManageView').style.display = tab === 'manage' ? '' : 'none';
  document.getElementById('roomsPlanningView').style.display = tab === 'planning' ? '' : 'none';
  document.getElementById('roomsFlightsView').style.display = tab === 'flights' ? '' : 'none';
  if (tab === 'planning') refreshPlanning();
  if (tab === 'manage') refreshRooms();
  if (tab === 'flights') refreshFlights();
}

function planningPrevDay() {
  const d = new Date(planningDate);
  d.setDate(d.getDate() - 1);
  planningDate = d.toISOString().slice(0, 10);
  refreshPlanning();
}

function planningNextDay() {
  const d = new Date(planningDate);
  d.setDate(d.getDate() + 1);
  planningDate = d.toISOString().slice(0, 10);
  refreshPlanning();
}

function planningToday() {
  planningDate = new Date().toISOString().slice(0, 10);
  refreshPlanning();
}

function planningSetDate(dateStr) {
  if (!dateStr) return;
  planningDate = dateStr;
  refreshPlanning();
}

async function refreshPlanning() {
  document.getElementById('planningDateInput').value = planningDate;
  // Fetch rooms + bookings in parallel
  try {
    const [rooms, bookings] = await Promise.all([
      api.getRooms(),
      api.getBookings(planningDate)
    ]);
    roomsList = rooms || [];
    bookingsList = bookings || [];
    renderPlanning();
  } catch (err) {
    console.error('refreshPlanning error:', err);
  }
}

function renderPlanning() {
  const wrapper = document.getElementById('planningGridWrapper');
  const emptyEl = document.getElementById('planningEmpty');

  // Apply type filter on rooms
  const filterType = document.getElementById('planningFilterType').value;
  const filterSource = document.getElementById('planningFilterSource').value;

  let sorted = [...roomsList].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  if (filterType) sorted = sorted.filter(r => r.type === filterType);

  if (!sorted.length) {
    emptyEl.style.display = '';
    const oldGrid = wrapper.querySelector('.planning-grid');
    if (oldGrid) oldGrid.remove();
    return;
  }

  emptyEl.style.display = 'none';

  // Constants
  const START_HOUR = 7;
  const END_HOUR = 21;
  const TOTAL_SLOTS = (END_HOUR - START_HOUR) * 4;
  const SLOT_WIDTH = 48;
  const LABEL_WIDTH = 120;

  let html = '<div class="planning-grid">';

  // Header row
  html += '<div class="planning-row planning-header">';
  html += `<div class="planning-label" style="width:${LABEL_WIDTH}px;min-width:${LABEL_WIDTH}px;"></div>`;
  html += '<div class="planning-slots">';
  for (let h = START_HOUR; h < END_HOUR; h++) {
    const label = String(h).padStart(2, '0') + 'h';
    html += `<div class="planning-hour-mark" style="width:${SLOT_WIDTH * 4}px;min-width:${SLOT_WIDTH * 4}px;">${label}</div>`;
  }
  html += '</div></div>';

  // Now line position
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  let nowPx = -1;
  if (planningDate === todayStr) {
    const mins = (now.getHours() - START_HOUR) * 60 + now.getMinutes();
    if (mins >= 0 && mins < (END_HOUR - START_HOUR) * 60) {
      nowPx = (mins / 15) * SLOT_WIDTH;
    }
  }

  // Room rows
  sorted.forEach(room => {
    let roomBookings = bookingsList.filter(b => b.room_id === room.id);
    if (filterSource) roomBookings = roomBookings.filter(b => b.source === filterSource);
    const typeBadge = t('rooms.type' + room.type.charAt(0).toUpperCase() + room.type.slice(1)) || room.type;

    html += '<div class="planning-row">';
    html += `<div class="planning-label" style="width:${LABEL_WIDTH}px;min-width:${LABEL_WIDTH}px;" title="${escHtml(typeBadge)}">`;
    html += `<span class="planning-label-name">${escHtml(room.name)}</span>`;
    html += `<span class="planning-label-type">${escHtml(typeBadge)}</span>`;
    html += '</div>';

    html += `<div class="planning-slots" data-room-id="${room.id}" style="width:${SLOT_WIDTH * TOTAL_SLOTS}px;">`;

    // Background cells (clickable)
    for (let i = 0; i < TOTAL_SLOTS; i++) {
      const isHour = i % 4 === 0;
      const slotMins = START_HOUR * 60 + i * 15;
      const hh = String(Math.floor(slotMins / 60)).padStart(2, '0');
      const mm = String(slotMins % 60).padStart(2, '0');
      html += `<div class="planning-cell clickable${isHour ? ' hour-mark' : ''}" data-time="${hh}:${mm}" style="left:${i * SLOT_WIDTH}px;width:${SLOT_WIDTH}px;"></div>`;
    }

    // Booking blocks (clickable)
    roomBookings.forEach(bk => {
      const startMins = timeToMinutes(bk.start_time) - START_HOUR * 60;
      const endMins = timeToMinutes(bk.end_time) - START_HOUR * 60;
      if (endMins <= 0 || startMins >= (END_HOUR - START_HOUR) * 60) return;

      const leftPx = Math.max(0, (startMins / 15) * SLOT_WIDTH);
      const widthPx = ((endMins - Math.max(0, startMins)) / 15) * SLOT_WIDTH;
      const sourceClass = 'source-' + (bk.source || 'admin');
      const titleAttr = escHtml(bk.title || '') + (bk.booked_by ? ' — ' + escHtml(bk.booked_by) : '');
      const timeLabel = (bk.start_time || '').slice(0, 5) + '–' + (bk.end_time || '').slice(0, 5);

      html += `<div class="planning-block ${sourceClass}" data-booking-id="${bk.id}" style="left:${leftPx}px;width:${widthPx}px;" title="${titleAttr}">`;
      html += `<span class="planning-block-time">${timeLabel}</span>`;
      html += `<span class="planning-block-title">${escHtml(bk.title || '')}</span>`;
      html += '</div>';
    });

    // Now line
    if (nowPx >= 0) {
      html += `<div class="planning-now" style="left:${nowPx}px;"></div>`;
    }

    html += '</div>';
    html += '</div>';
  });

  html += '</div>';

  // Replace grid
  const oldGrid = wrapper.querySelector('.planning-grid');
  if (oldGrid) oldGrid.remove();
  wrapper.insertAdjacentHTML('beforeend', html);

  // Attach click handlers
  wrapper.querySelectorAll('.planning-cell.clickable').forEach(cell => {
    cell.addEventListener('click', () => {
      const roomId = cell.closest('.planning-slots').dataset.roomId;
      const time = cell.dataset.time;
      openBookingModal(null, roomId, time);
    });
  });
  wrapper.querySelectorAll('.planning-block[data-booking-id]').forEach(block => {
    block.addEventListener('click', (e) => {
      e.stopPropagation();
      const bk = bookingsList.find(b => b.id === block.dataset.bookingId);
      if (bk) openBookingModal(bk);
    });
  });

  // Auto-scroll to now
  if (nowPx >= 0) {
    wrapper.scrollLeft = Math.max(0, nowPx - wrapper.clientWidth / 2 + LABEL_WIDTH);
  }
}

function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const parts = timeStr.split(':');
  return parseInt(parts[0]) * 60 + parseInt(parts[1] || 0);
}

function minutesToTime(mins) {
  const hh = String(Math.floor(mins / 60)).padStart(2, '0');
  const mm = String(mins % 60).padStart(2, '0');
  return hh + ':' + mm;
}

// ── BOOKING MODAL ──
let editingBookingId = null;

function openBookingModal(booking, roomId, startTime) {
  editingBookingId = booking ? booking.id : null;

  // Title
  document.getElementById('bookingModalTitle').textContent =
    booking ? (t('booking.edit') || 'Modifier la reservation') : (t('booking.add') || 'Ajouter une reservation');

  // Populate room select
  const roomSelect = document.getElementById('bookingRoom');
  const sorted = [...roomsList].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  roomSelect.innerHTML = sorted.map(r =>
    `<option value="${r.id}">${escHtml(r.name)}</option>`
  ).join('');

  // Fill fields
  if (booking) {
    roomSelect.value = booking.room_id;
    document.getElementById('bookingStart').value = (booking.start_time || '').slice(0, 5);
    document.getElementById('bookingEnd').value = (booking.end_time || '').slice(0, 5);
    document.getElementById('bookingTitle').value = booking.title || '';
    document.getElementById('bookingBy').value = booking.booked_by || '';
  } else {
    if (roomId) roomSelect.value = roomId;
    document.getElementById('bookingStart').value = startTime || '08:00';
    // Default end = start + 30min
    const startMins = timeToMinutes(startTime || '08:00');
    document.getElementById('bookingEnd').value = minutesToTime(startMins + 30);
    document.getElementById('bookingTitle').value = '';
    document.getElementById('bookingBy').value = '';
  }

  // Show/hide delete button
  document.getElementById('bookingDeleteBtn').style.display = booking ? '' : 'none';

  // Clear error
  document.getElementById('bookingError').style.display = 'none';

  document.getElementById('bookingModalOverlay').style.display = 'flex';
}

function closeBookingModal() {
  document.getElementById('bookingModalOverlay').style.display = 'none';
  editingBookingId = null;
}

function checkBookingOverlap(roomId, startTime, endTime, excludeId) {
  const startMins = timeToMinutes(startTime);
  const endMins = timeToMinutes(endTime);
  return bookingsList.find(b =>
    b.room_id === roomId &&
    b.id !== excludeId &&
    b.date === planningDate &&
    timeToMinutes(b.start_time) < endMins &&
    timeToMinutes(b.end_time) > startMins
  );
}

async function saveBooking() {
  const roomId = document.getElementById('bookingRoom').value;
  const startTime = document.getElementById('bookingStart').value;
  const endTime = document.getElementById('bookingEnd').value;
  const title = document.getElementById('bookingTitle').value.trim();
  const bookedBy = document.getElementById('bookingBy').value.trim();
  const errEl = document.getElementById('bookingError');

  // Validation
  if (!roomId || !startTime || !endTime) {
    errEl.textContent = t('booking.errorRequired') || 'Salle, debut et fin sont obligatoires.';
    errEl.style.display = '';
    return;
  }
  if (timeToMinutes(endTime) <= timeToMinutes(startTime)) {
    errEl.textContent = t('booking.errorEndBeforeStart') || 'L\'heure de fin doit etre apres le debut.';
    errEl.style.display = '';
    return;
  }

  // Overlap check
  const overlap = checkBookingOverlap(roomId, startTime, endTime, editingBookingId);
  if (overlap) {
    errEl.textContent = t('booking.errorOverlap') || 'Ce creneau chevauche une reservation existante.';
    errEl.style.display = '';
    return;
  }

  const data = {
    room_id: roomId,
    date: planningDate,
    start_time: startTime,
    end_time: endTime,
    title: title || (t('booking.defaultTitle') || 'Reservation'),
    booked_by: bookedBy,
    source: 'admin'
  };

  try {
    if (editingBookingId) {
      await api.updateBooking(editingBookingId, data);
    } else {
      await api.createBooking(data);
    }
    closeBookingModal();
    refreshPlanning();
  } catch (err) {
    console.error('saveBooking error:', err);
    errEl.textContent = t('booking.errorSave') || 'Erreur lors de l\'enregistrement.';
    errEl.style.display = '';
  }
}

async function deleteBooking() {
  if (!editingBookingId) return;
  if (!confirm(t('booking.confirmDelete') || 'Supprimer cette reservation ?')) return;
  try {
    await api.deleteBooking(editingBookingId);
    closeBookingModal();
    refreshPlanning();
  } catch (err) {
    console.error('deleteBooking error:', err);
  }
}

// ── FLIGHTS STATE ──
let flightsDate = new Date().toISOString().slice(0, 10);
let flightsList = [];
let editingFlightId = null;

function flightsPrevDay() {
  const d = new Date(flightsDate);
  d.setDate(d.getDate() - 1);
  flightsDate = d.toISOString().slice(0, 10);
  refreshFlights();
}
function flightsNextDay() {
  const d = new Date(flightsDate);
  d.setDate(d.getDate() + 1);
  flightsDate = d.toISOString().slice(0, 10);
  refreshFlights();
}
function flightsToday() {
  flightsDate = new Date().toISOString().slice(0, 10);
  refreshFlights();
}
function flightsSetDate(val) {
  if (val) { flightsDate = val; refreshFlights(); }
}

async function refreshFlights() {
  document.getElementById('flightsDateInput').value = flightsDate;
  try {
    flightsList = await api.getFlights(flightsDate) || [];
  } catch (err) {
    console.error('refreshFlights error:', err);
    flightsList = [];
  }
  renderFlights();
}

function renderFlights() {
  const tbody = document.getElementById('flightsBody');
  const empty = document.getElementById('flightsEmpty');
  const table = document.getElementById('flightsTable');

  if (flightsList.length === 0) {
    table.style.display = 'none';
    empty.style.display = '';
    return;
  }
  table.style.display = '';
  empty.style.display = 'none';

  tbody.innerHTML = flightsList.map(f => {
    return '<tr>'
      + '<td class="flight-reg">' + esc(f.aircraft_reg || '') + '</td>'
      + '<td class="flight-time">' + esc(f.start_time || '') + '</td>'
      + '<td class="flight-time">' + esc(f.end_time || '') + '</td>'
      + '<td>' + esc(f.pilot || '') + '</td>'
      + '<td>' + esc(f.instructor || '—') + '</td>'
      + '<td><span class="flight-type-badge">' + esc(f.flight_type || '') + '</span></td>'
      + '<td class="flight-actions">'
      + '<button onclick="openFlightModal(\'' + f.id + '\')" title="Modifier">&#9998;</button>'
      + '<button onclick="confirmDeleteFlight(\'' + f.id + '\')" title="Supprimer">&#10005;</button>'
      + '</td>'
      + '</tr>';
  }).join('');
}

function esc(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function openFlightModal(id) {
  editingFlightId = id || null;
  const title = document.getElementById('flightModalTitle');
  const deleteBtn = document.getElementById('flightDeleteBtn');
  document.getElementById('flightError').style.display = 'none';

  if (id) {
    const f = flightsList.find(fl => fl.id === id);
    if (!f) return;
    title.textContent = t('flights.edit') || 'Modifier le vol';
    document.getElementById('flightAircraft').value = f.aircraft_reg || '';
    document.getElementById('flightStart').value = f.start_time || '';
    document.getElementById('flightEnd').value = f.end_time || '';
    document.getElementById('flightPilot').value = f.pilot || '';
    document.getElementById('flightInstructor').value = f.instructor || '';
    document.getElementById('flightType').value = f.flight_type || 'local';
    deleteBtn.style.display = '';
  } else {
    title.textContent = t('flights.add') || 'Ajouter un vol';
    document.getElementById('flightAircraft').value = '';
    document.getElementById('flightStart').value = '';
    document.getElementById('flightEnd').value = '';
    document.getElementById('flightPilot').value = '';
    document.getElementById('flightInstructor').value = '';
    document.getElementById('flightType').value = 'local';
    deleteBtn.style.display = 'none';
  }
  document.getElementById('flightModalOverlay').style.display = 'flex';
}

function closeFlightModal() {
  document.getElementById('flightModalOverlay').style.display = 'none';
  editingFlightId = null;
}

async function saveFlight() {
  const aircraft = document.getElementById('flightAircraft').value.trim().toUpperCase();
  const start = document.getElementById('flightStart').value;
  const end = document.getElementById('flightEnd').value;
  const pilot = document.getElementById('flightPilot').value.trim();
  const instructor = document.getElementById('flightInstructor').value.trim();
  const flightType = document.getElementById('flightType').value;
  const errorEl = document.getElementById('flightError');

  // Validation
  if (!aircraft || !start || !end || !pilot) {
    errorEl.textContent = t('flights.errorRequired') || 'Immatriculation, horaires et pilote requis.';
    errorEl.style.display = '';
    return;
  }
  if (end <= start) {
    errorEl.textContent = t('flights.errorTime') || 'L\'heure de fin doit etre apres le debut.';
    errorEl.style.display = '';
    return;
  }

  const data = {
    aircraft_reg: aircraft,
    date: flightsDate,
    start_time: start,
    end_time: end,
    pilot: pilot,
    instructor: instructor || null,
    flight_type: flightType,
    source: 'admin'
  };

  try {
    if (editingFlightId) {
      await api.updateFlight(editingFlightId, data);
    } else {
      await api.createFlight(data);
    }
    closeFlightModal();
    refreshFlights();
  } catch (err) {
    errorEl.textContent = t('flights.errorSave') || 'Erreur lors de l\'enregistrement.';
    errorEl.style.display = '';
    console.error('saveFlight error:', err);
  }
}

async function deleteFlight() {
  if (!editingFlightId) return;
  if (!confirm(t('flights.confirmDelete') || 'Supprimer ce vol ?')) return;
  try {
    await api.deleteFlight(editingFlightId);
    closeFlightModal();
    refreshFlights();
  } catch (err) {
    console.error('deleteFlight error:', err);
  }
}

async function confirmDeleteFlight(id) {
  if (!confirm(t('flights.confirmDelete') || 'Supprimer ce vol ?')) return;
  try {
    await api.deleteFlight(id);
    refreshFlights();
  } catch (err) {
    console.error('confirmDeleteFlight error:', err);
  }
}

// ── CONFIG STATE ──
let currentConfigTab = 'aerodrome';
let fullConfig = null;
let originalFullConfig = null;
let cfgSearchTimeout = null;
let godModeActive = false;
let godModalMode = 'unlock'; // 'unlock' ou 'setup'

// ── VIEW / TAB SWITCHING ──
function switchView(view) {
  currentView = view;
  document.querySelectorAll('.nav-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.view === view));
  document.getElementById('viewContent').style.display = view === 'content' ? '' : 'none';
  document.getElementById('viewFleet').style.display = view === 'fleet' ? '' : 'none';
  document.getElementById('viewRooms').style.display = view === 'rooms' ? '' : 'none';
  document.getElementById('viewConfig').style.display = view === 'config' ? '' : 'none';
  if (view === 'fleet') refreshFleet();
  if (view === 'rooms') {
    if (currentRoomsSubtab === 'planning') refreshPlanning();
    else refreshRooms();
  }
  if (view === 'config' && !fullConfig) loadFullConfig();
}

function switchConfigTab(tab) {
  currentConfigTab = tab;
  document.querySelectorAll('.config-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.ctab === tab));
  document.querySelectorAll('.config-panel').forEach(p =>
    p.classList.toggle('active', p.dataset.cpanel === tab));
}

// ── LOAD CONFIG ──
async function loadFullConfig() {
  const statusEl = document.getElementById('configStatus');
  statusEl.textContent = t('cfg.loading');
  statusEl.className = 'config-status';
  try {
    const config = await api.getFullConfig();
    if (!config) {
      statusEl.textContent = t('cfg.noConfig');
      return;
    }
    fullConfig = JSON.parse(JSON.stringify(config));
    originalFullConfig = JSON.parse(JSON.stringify(config));
    populateConfigTabs();
    statusEl.textContent = '';
  } catch (err) {
    console.error('Error loading config:', err);
    statusEl.textContent = t('cfg.loadError');
    statusEl.className = 'config-status error';
  }
}

// ── SLIDER HELPERS ──
function cfgBindSlider(sliderId, valueId) {
  const slider = document.getElementById(sliderId);
  const val = document.getElementById(valueId);
  if (slider && val) {
    slider.addEventListener('input', () => { val.textContent = slider.value; });
  }
}
function cfgSetSlider(sliderId, valueId, value) {
  const s = document.getElementById(sliderId);
  const v = document.getElementById(valueId);
  if (s) s.value = value;
  if (v) v.textContent = value;
}

// ── POPULATE ALL CONFIG TABS ──
function populateConfigTabs() {
  if (!fullConfig) return;
  const c = fullConfig;

  // -- Aérodrome --
  document.getElementById('cfgStationSearch').value = c.station?.icao || '';
  document.getElementById('cfgDisplayName').value = c.station?.displayName || '';
  document.getElementById('cfgLat').value = c.station?.lat || '';
  document.getElementById('cfgLon').value = c.station?.lon || '';
  document.getElementById('cfgFir').value = (c.station?.firs || []).join(', ');
  document.getElementById('cfgFirName').value = c.station?.firName || '';
  document.getElementById('cfgSigmetRegion').value = c.station?.sigmetRegion || 'eur';
  cfgRenderRunways();

  // Cloud mode: show hint, disable search
  const cloudHint = document.getElementById('cfgSearchCloudHint');
  if (api.mode !== 'local') {
    cloudHint.style.display = '';
  } else {
    cloudHint.style.display = 'none';
    cfgInitAirportSearch();
  }

  // -- Seuils --
  let profile = c.thresholds?.profile || 'easa';
  if (profile === 'dgac') profile = 'easa'; // rétro-compat
  document.getElementById('cfgThresholdProfile').value = profile;
  document.getElementById('cfgThrVfrVis').value = c.thresholds?.vfr?.visibility ?? 5000;
  document.getElementById('cfgThrVfrCeil').value = c.thresholds?.vfr?.ceiling ?? 1500;
  document.getElementById('cfgThrSpecVis').value = c.thresholds?.vfrSpecial?.visibility ?? 1500;
  document.getElementById('cfgThrSpecCeil').value = c.thresholds?.vfrSpecial?.ceiling ?? 600;
  document.getElementById('cfgThrGreenVis').value = c.thresholds?.green?.visibility ?? 9999;
  document.getElementById('cfgThrGreenCeil').value = c.thresholds?.green?.ceiling ?? 5000;
  document.getElementById('cfgThrXwindDgr').value = c.thresholds?.wind?.crosswindDanger ?? 25;
  document.getElementById('cfgThrXwindWrn').value = c.thresholds?.wind?.crosswindWarning ?? 17;
  document.getElementById('cfgThrTailDgr').value = c.thresholds?.wind?.tailwindDanger ?? 11;
  document.getElementById('cfgThrTailWrn').value = c.thresholds?.wind?.tailwindWarning ?? 6;
  document.getElementById('cfgThrFogDgr').value = c.thresholds?.fog?.danger ?? 1;
  document.getElementById('cfgThrFogWrn').value = c.thresholds?.fog?.warning ?? 2;
  document.getElementById('cfgThrFogWatch').value = c.thresholds?.fog?.watch ?? 4;
  document.getElementById('cfgThrMetarDgr').value = c.thresholds?.metarAge?.danger ?? 60;
  document.getElementById('cfgThrMetarWrn').value = c.thresholds?.metarAge?.warning ?? 45;
  document.getElementById('cfgThrSunsetShow').value = c.thresholds?.sunsetWarning?.showMinutes ?? 30;
  document.getElementById('cfgThrSunsetCrit').value = c.thresholds?.sunsetWarning?.criticalMinutes ?? 15;
  cfgUpdateThresholdState();

  // -- Unités --
  const units = c.units || {};
  document.getElementById('cfgUnitPressure').value = units.pressure || 'hPa';
  document.getElementById('cfgUnitVisibility').value = units.visibility || 'metric';
  document.getElementById('cfgUnitTemperature').value = units.temperature || 'C';
  document.getElementById('cfgUnitWind').value = units.wind || 'kt';

  // -- Carte --
  document.getElementById('cfgMapBasemap').value = c.maps?.basemap || 'voyager';
  document.getElementById('cfgMapBasemapAuto').checked = c.maps?.basemapAuto === true;
  document.getElementById('cfgMapBasemapDay').value = c.maps?.basemapDay || 'voyager';
  document.getElementById('cfgMapBasemapNight').value = c.maps?.basemapNight || 'dark';
  cfgToggleBasemapAuto();
  document.getElementById('cfgMapAirports').value = c.maps?.airportDisplay || 'none';
  cfgSetSlider('cfgMapBrightness', 'cfgMapBrightnessVal', c.maps?.basemapBrightness ?? 52);
  cfgSetSlider('cfgWeatherDark', 'cfgWeatherDarkVal', c.maps?.weatherIntensityDark ?? 250);
  cfgSetSlider('cfgWeatherLight', 'cfgWeatherLightVal', c.maps?.weatherIntensityLight ?? 90);
  cfgSetSlider('cfgMapZoom', 'cfgMapZoomVal', c.maps?.zoom ?? 7);
  cfgSetSlider('cfgMapOffLat', 'cfgMapOffLatVal', c.maps?.offsetLat ?? 0);
  cfgSetSlider('cfgMapOffLon', 'cfgMapOffLonVal', c.maps?.offsetLon ?? 0);
  cfgSetSlider('cfgRotation', 'cfgRotationVal', c.maps?.rotationSeconds ?? 20);
  cfgRenderMapLayers();

  // -- Trafic --
  document.getElementById('cfgTrafficEnabled').checked = c.traffic?.enabled !== false;
  document.getElementById('cfgTrafficDetail').value = c.traffic?.detail || 'icon';
  cfgSetSlider('cfgTrafficRefresh', 'cfgTrafficRefreshVal', c.traffic?.refreshSeconds ?? 10);
  cfgSetSlider('cfgTrafficRadius', 'cfgTrafficRadiusVal', c.traffic?.radiusNm ?? 135);
  cfgSetSlider('cfgTrafficAlt', 'cfgTrafficAltVal', c.traffic?.maxAltitude ?? 10000);
  document.getElementById('cfgTrafficWatchlist').value = (c.traffic?.watchlist || []).join(', ');
  document.getElementById('cfgTrafficWatchMode').value = c.traffic?.watchMode || 'highlight';
  cfgToggleTraffic();
  document.getElementById('cfgOgnEnabled').checked = c.traffic?.ognEnabled === true;
  cfgSetSlider('cfgOgnRadius', 'cfgOgnRadiusVal', c.traffic?.ognRadiusKm ?? 250);
  cfgToggleOgn();

  // -- FlightRadar24 (API officielle) --
  document.getElementById('cfgFr24OfficialEnabled').checked = c.traffic?.fr24Enabled === true;
  document.getElementById('cfgFr24ApiKey').value = c.traffic?.fr24ApiKey || '';
  cfgToggleFr24Official();

  // -- Sections --
  document.getElementById('cfgActivityProfile').value = c.activityProfile || 'standard';
  cfgRenderSectionToggles();
  document.getElementById('cfgTafDisplay').value = c.tafDisplay || 'raw';
  document.getElementById('cfgSidebarPosition').value = c.sidebarPosition || 'right';

  // -- Apparence --
  const isAuto = c.themeName === 'auto';
  document.querySelectorAll('input[name="cfgThemeMode"]').forEach(r => { r.checked = r.value === (isAuto ? 'auto' : 'fixed'); });
  cfgToggleThemeMode();
  cfgRenderThemeGrids();

  document.getElementById('cfgAppTitle').value = c.branding?.appTitle || '';
  document.getElementById('cfgClubName').value = c.branding?.clubName || '';
  document.getElementById('cfgLogoDayName').textContent = c.branding?.logoDay || '—';
  document.getElementById('cfgLogoNightName').textContent = c.branding?.logoNight || '—';

  // -- Langue (dans Apparence) --
  document.getElementById('cfgLanguage').value = c.language || 'fr';

  // -- Écrans --
  cfgPopulateScreenList();

  // -- Thème écran salle --
  document.getElementById('cfgRoomScreenTheme').value = c.rooms?.screenTheme || 'dark';

  // -- Contenu club --
  document.getElementById('cfgClubEnabled').checked = c.clubDisplay?.enabled !== false;
  document.getElementById('cfgClubServerEnabled').checked = c.clubDisplay?.serverEnabled !== false;
  document.getElementById('cfgClubServerPort').value = c.clubDisplay?.serverPort || 3000;
  document.getElementById('cfgClubPlacement').value = c.clubDisplay?.placement || 'after';
  cfgSetSlider('cfgClubDuration', 'cfgClubDurationVal', c.clubDisplay?.defaultDuration ?? 15);

  // -- Système (mot de passe) --
  cfgPopulatePasswordStatus();

  // -- Brief auto simu (dans Planification) --
  document.getElementById('cfgAutoBookBriefForSim').checked = c.rooms?.autoBookBriefForSim !== false;

  // -- God mode (si actif) --
  if (godModeActive) populateGodModeTab();
}

// ── SCREEN LIST (multi-écran) ──
function cfgPopulateScreenList() {
  const c = fullConfig;
  const screens = c.screens || [{ displayIndex: c.kiosk?.displayIndex || 0, view: c.layout === 'mapOnly' ? 'map' : 'full' }];
  const container = document.getElementById('cfgScreenList');
  container.innerHTML = '';
  screens.forEach((scr, i) => cfgAddScreenRow(container, scr));

  document.getElementById('cfgBtnAddScreen').onclick = () => {
    cfgAddScreenRow(container, { displayIndex: container.children.length, view: 'full' });
  };
}

function cfgAddScreenRow(container, scr) {
  const row = document.createElement('div');
  row.style.cssText = 'display:flex; gap:8px; align-items:center;';

  const displaySel = document.createElement('select');
  displaySel.className = 'form-select cfg-screen-display';
  displaySel.style.flex = '1';
  for (let i = 0; i < 4; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${t('cfg.screens.screen') || 'Écran'} ${i + 1}`;
    if (i === scr.displayIndex) opt.selected = true;
    displaySel.appendChild(opt);
  }

  const viewSel = document.createElement('select');
  viewSel.className = 'form-select cfg-screen-view';
  viewSel.style.flex = '1';
  const views = [
    { value: 'full', label: t('cfg.screens.viewFull') || 'Complet' },
    { value: 'map', label: t('cfg.screens.viewMap') || 'Carte seule' },
    { value: 'weather', label: t('cfg.screens.viewWeather') || 'Météo seule' },
    { value: 'fleet', label: t('cfg.screens.viewFleet') || 'Flotte' },
    { value: 'club', label: t('cfg.screens.viewClub') || 'Contenu club' },
    { value: 'planning', label: t('cfg.screens.viewPlanning') || 'Planning' },
    { value: 'briefing', label: t('cfg.screens.viewBriefing') || 'Salles briefing' }
  ];
  views.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.value;
    opt.textContent = v.label;
    if (v.value === scr.view) opt.selected = true;
    viewSel.appendChild(opt);
  });

  const removeBtn = document.createElement('button');
  removeBtn.className = 'btn-ghost';
  removeBtn.textContent = '✕';
  removeBtn.style.cssText = 'padding:4px 8px; cursor:pointer; border:none; color:var(--text-dim);';
  removeBtn.onclick = () => {
    row.remove();
    if (container.children.length === 0) {
      cfgAddScreenRow(container, { displayIndex: 0, view: 'full' });
    }
  };

  row.appendChild(displaySel);
  row.appendChild(viewSel);
  row.appendChild(removeBtn);
  container.appendChild(row);
}

function cfgCollectScreens() {
  return Array.from(document.getElementById('cfgScreenList').children).map(row => ({
    displayIndex: parseInt(row.querySelector('.cfg-screen-display').value) || 0,
    view: row.querySelector('.cfg-screen-view').value || 'full'
  }));
}

// ── SYSTÈME : MOT DE PASSE ADMIN ──
function cfgPopulatePasswordStatus() {
  const hasPassword = !!fullConfig?.admin?.passwordHash;
  const statusEl = document.getElementById('cfgPasswordStatus');
  statusEl.textContent = hasPassword
    ? (t('cfg.system.passwordStatusSet') || 'Un mot de passe admin est défini.')
    : (t('cfg.system.passwordStatusNone') || 'Aucun mot de passe admin défini.');
  document.getElementById('cfgOldPasswordGroup').style.display = hasPassword ? '' : 'none';
  document.getElementById('cfgRemovePasswordBtn').style.display = hasPassword ? '' : 'none';
  document.getElementById('cfgOldPassword').value = '';
  document.getElementById('cfgNewPassword').value = '';
  document.getElementById('cfgConfirmPassword').value = '';
  document.getElementById('cfgPasswordError').style.display = 'none';
}

async function cfgSavePassword() {
  const errEl = document.getElementById('cfgPasswordError');
  errEl.style.display = 'none';
  const hasPassword = !!fullConfig?.admin?.passwordHash;
  const oldPw = document.getElementById('cfgOldPassword').value;
  const newPw = document.getElementById('cfgNewPassword').value;
  const confirmPw = document.getElementById('cfgConfirmPassword').value;

  if (hasPassword) {
    const ok = await verifyHashClient(oldPw, fullConfig.admin.passwordHash);
    if (!ok) {
      errEl.textContent = t('cfg.system.passwordOldIncorrect') || 'Mot de passe actuel incorrect.';
      errEl.style.display = '';
      return;
    }
  }
  if (!newPw) {
    errEl.textContent = t('cfg.system.passwordNewRequired') || 'Entrez un nouveau mot de passe.';
    errEl.style.display = '';
    return;
  }
  if (newPw !== confirmPw) {
    errEl.textContent = t('cfg.system.passwordMismatch') || 'Les mots de passe ne correspondent pas.';
    errEl.style.display = '';
    return;
  }
  const hash = await hashPasswordClient(newPw);
  if (!fullConfig.admin) fullConfig.admin = {};
  fullConfig.admin.passwordHash = hash;
  await saveConfig();
  cfgPopulatePasswordStatus();
}

async function cfgRemovePassword() {
  const errEl = document.getElementById('cfgPasswordError');
  errEl.style.display = 'none';
  const oldPw = document.getElementById('cfgOldPassword').value;
  if (fullConfig?.admin?.passwordHash) {
    const ok = await verifyHashClient(oldPw, fullConfig.admin.passwordHash);
    if (!ok) {
      errEl.textContent = t('cfg.system.passwordOldIncorrect') || 'Mot de passe actuel incorrect.';
      errEl.style.display = '';
      return;
    }
  }
  fullConfig.admin.passwordHash = '';
  await saveConfig();
  cfgPopulatePasswordStatus();
}

// ── BRIEF AUTO SIMU (dans onglet Planification, sauvegarde à la volée) ──
async function cfgSaveAutoBookBrief() {
  if (!fullConfig) return;
  if (!fullConfig.rooms) fullConfig.rooms = {};
  fullConfig.rooms.autoBookBriefForSim = document.getElementById('cfgAutoBookBriefForSim').checked;
  await saveConfig();
}

// ── COLLECT CONFIG VALUES ──
function collectConfigValues() {
  if (!fullConfig) return;
  const c = fullConfig;

  // Aérodrome
  if (!c.station) c.station = {};
  c.station.displayName = document.getElementById('cfgDisplayName').value.trim();
  c.station.lat = parseFloat(document.getElementById('cfgLat').value) || 0;
  c.station.lon = parseFloat(document.getElementById('cfgLon').value) || 0;
  const firVal = document.getElementById('cfgFir').value.trim();
  c.station.firs = firVal ? firVal.split(',').map(s => s.trim()).filter(Boolean) : [];
  c.station.firName = document.getElementById('cfgFirName').value.trim();
  c.station.sigmetRegion = document.getElementById('cfgSigmetRegion').value;

  // Seuils
  if (!c.thresholds) c.thresholds = {};
  c.thresholds.profile = document.getElementById('cfgThresholdProfile').value || 'easa';
  if (!c.thresholds.vfr) c.thresholds.vfr = {};
  c.thresholds.vfr.visibility = parseInt(document.getElementById('cfgThrVfrVis').value) || 5000;
  c.thresholds.vfr.ceiling = parseInt(document.getElementById('cfgThrVfrCeil').value) || 1500;
  if (!c.thresholds.vfrSpecial) c.thresholds.vfrSpecial = {};
  c.thresholds.vfrSpecial.visibility = parseInt(document.getElementById('cfgThrSpecVis').value) || 1500;
  c.thresholds.vfrSpecial.ceiling = parseInt(document.getElementById('cfgThrSpecCeil').value) || 600;
  if (!c.thresholds.green) c.thresholds.green = {};
  c.thresholds.green.visibility = parseInt(document.getElementById('cfgThrGreenVis').value) || 9999;
  c.thresholds.green.ceiling = parseInt(document.getElementById('cfgThrGreenCeil').value) || 5000;
  if (!c.thresholds.wind) c.thresholds.wind = {};
  c.thresholds.wind.crosswindDanger = parseInt(document.getElementById('cfgThrXwindDgr').value) || 25;
  c.thresholds.wind.crosswindWarning = parseInt(document.getElementById('cfgThrXwindWrn').value) || 17;
  c.thresholds.wind.tailwindDanger = parseInt(document.getElementById('cfgThrTailDgr').value) || 11;
  c.thresholds.wind.tailwindWarning = parseInt(document.getElementById('cfgThrTailWrn').value) || 6;
  if (!c.thresholds.fog) c.thresholds.fog = {};
  c.thresholds.fog.danger = parseInt(document.getElementById('cfgThrFogDgr').value) || 1;
  c.thresholds.fog.warning = parseInt(document.getElementById('cfgThrFogWrn').value) || 2;
  c.thresholds.fog.watch = parseInt(document.getElementById('cfgThrFogWatch').value) || 4;
  if (!c.thresholds.metarAge) c.thresholds.metarAge = {};
  c.thresholds.metarAge.danger = parseInt(document.getElementById('cfgThrMetarDgr').value) || 60;
  c.thresholds.metarAge.warning = parseInt(document.getElementById('cfgThrMetarWrn').value) || 45;
  if (!c.thresholds.sunsetWarning) c.thresholds.sunsetWarning = {};
  c.thresholds.sunsetWarning.showMinutes = parseInt(document.getElementById('cfgThrSunsetShow').value) || 30;
  c.thresholds.sunsetWarning.criticalMinutes = parseInt(document.getElementById('cfgThrSunsetCrit').value) || 15;

  // Unités
  if (!c.units) c.units = {};
  c.units.pressure = document.getElementById('cfgUnitPressure').value;
  c.units.visibility = document.getElementById('cfgUnitVisibility').value;
  c.units.temperature = document.getElementById('cfgUnitTemperature').value;
  c.units.wind = document.getElementById('cfgUnitWind').value;

  // Carte
  if (!c.maps) c.maps = {};
  c.maps.basemap = document.getElementById('cfgMapBasemap').value;
  c.maps.basemapAuto = document.getElementById('cfgMapBasemapAuto').checked;
  c.maps.basemapDay = document.getElementById('cfgMapBasemapDay').value;
  c.maps.basemapNight = document.getElementById('cfgMapBasemapNight').value;
  c.maps.airportDisplay = document.getElementById('cfgMapAirports').value;
  c.maps.basemapBrightness = parseInt(document.getElementById('cfgMapBrightness').value) || 52;
  c.maps.weatherIntensityDark = parseInt(document.getElementById('cfgWeatherDark').value) || 250;
  c.maps.weatherIntensityLight = parseInt(document.getElementById('cfgWeatherLight').value) || 90;
  c.maps.zoom = parseFloat(document.getElementById('cfgMapZoom').value) || 7;
  c.maps.offsetLat = parseFloat(document.getElementById('cfgMapOffLat').value) || 0;
  c.maps.offsetLon = parseFloat(document.getElementById('cfgMapOffLon').value) || 0;
  c.maps.rotationSeconds = parseInt(document.getElementById('cfgRotation').value) || 20;
  // Layers collected from rendered toggles
  if (c.maps.layers) {
    document.querySelectorAll('#cfgMapLayers input[data-layer-idx]').forEach(cb => {
      const idx = parseInt(cb.dataset.layerIdx);
      if (c.maps.layers[idx]) c.maps.layers[idx].enabled = cb.checked;
    });
  }

  // Trafic
  if (!c.traffic) c.traffic = {};
  c.traffic.enabled = document.getElementById('cfgTrafficEnabled').checked;
  c.traffic.detail = document.getElementById('cfgTrafficDetail').value;
  c.traffic.refreshSeconds = parseInt(document.getElementById('cfgTrafficRefresh').value) || 10;
  c.traffic.radiusNm = parseInt(document.getElementById('cfgTrafficRadius').value) || 135;
  c.traffic.maxAltitude = parseInt(document.getElementById('cfgTrafficAlt').value) || 0;
  const wlRaw = document.getElementById('cfgTrafficWatchlist').value.trim();
  c.traffic.watchlist = wlRaw ? wlRaw.split(',').map(s => s.trim()).filter(Boolean) : [];
  c.traffic.watchMode = document.getElementById('cfgTrafficWatchMode').value;
  c.traffic.ognEnabled = document.getElementById('cfgOgnEnabled').checked;
  c.traffic.ognRadiusKm = parseInt(document.getElementById('cfgOgnRadius').value) || 250;

  // FlightRadar24 (API officielle)
  c.traffic.fr24Enabled = document.getElementById('cfgFr24OfficialEnabled').checked;
  c.traffic.fr24ApiKey = document.getElementById('cfgFr24ApiKey').value.trim();

  // Sections
  c.activityProfile = document.getElementById('cfgActivityProfile').value;
  if (!c.sections) c.sections = {};
  document.querySelectorAll('#cfgSectionToggles input[data-section-key]').forEach(cb => {
    c.sections[cb.dataset.sectionKey] = cb.checked;
  });
  c.tafDisplay = document.getElementById('cfgTafDisplay').value;
  c.sidebarPosition = document.getElementById('cfgSidebarPosition').value;

  // Apparence
  const themeMode = document.querySelector('input[name="cfgThemeMode"]:checked')?.value || 'auto';
  if (themeMode === 'auto') {
    c.themeName = 'auto';
    if (!c.themeAuto) c.themeAuto = {};
    const dayCard = document.querySelector('#cfgThemeDayGrid .cfg-theme-card.selected');
    const nightCard = document.querySelector('#cfgThemeNightGrid .cfg-theme-card.selected');
    if (dayCard) c.themeAuto.day = dayCard.dataset.theme;
    if (nightCard) c.themeAuto.night = nightCard.dataset.theme;
  } else {
    const fixedCard = document.querySelector('#cfgThemeFixedGrid .cfg-theme-card.selected');
    if (fixedCard) c.themeName = fixedCard.dataset.theme;
  }
  if (!c.branding) c.branding = {};
  c.branding.appTitle = document.getElementById('cfgAppTitle').value.trim();
  c.branding.clubName = document.getElementById('cfgClubName').value.trim();

  // Contenu club
  if (!c.clubDisplay) c.clubDisplay = {};
  c.clubDisplay.enabled = document.getElementById('cfgClubEnabled').checked;
  c.clubDisplay.serverEnabled = document.getElementById('cfgClubServerEnabled').checked;
  c.clubDisplay.serverPort = parseInt(document.getElementById('cfgClubServerPort').value) || 3000;
  c.clubDisplay.placement = document.getElementById('cfgClubPlacement').value;
  c.clubDisplay.defaultDuration = parseInt(document.getElementById('cfgClubDuration').value) || 15;

  // Écrans
  c.screens = cfgCollectScreens();
  if (!c.kiosk) c.kiosk = {};
  c.kiosk.displayIndex = c.screens[0]?.displayIndex || 0;
  c.layout = c.screens[0]?.view === 'map' ? 'mapOnly' : 'full';

  // Thème écran salle
  if (!c.rooms) c.rooms = {};
  c.rooms.screenTheme = document.getElementById('cfgRoomScreenTheme').value || 'dark';
  c.rooms.autoBookBriefForSim = document.getElementById('cfgAutoBookBriefForSim').checked;

  // Langue
  c.language = document.getElementById('cfgLanguage').value || 'fr';

  // God mode
  if (godModeActive) collectGodModeValues();
}

// ── SAVE / CANCEL ──
async function saveConfig() {
  const btn = document.getElementById('btnSaveConfig');
  const statusEl = document.getElementById('configStatus');
  btn.disabled = true;
  statusEl.textContent = t('cfg.saving');
  statusEl.className = 'config-status';
  try {
    collectConfigValues();
    const result = await api.saveFullConfig(fullConfig);
    if (result.success !== false) {
      originalFullConfig = JSON.parse(JSON.stringify(fullConfig));
      statusEl.textContent = t('cfg.saveSuccess');
      statusEl.className = 'config-status success';
      setTimeout(() => { statusEl.textContent = ''; statusEl.className = 'config-status'; }, 3000);
    } else {
      statusEl.textContent = t('cfg.saveError');
      statusEl.className = 'config-status error';
    }
  } catch (err) {
    console.error('Save error:', err);
    statusEl.textContent = t('cfg.saveError');
    statusEl.className = 'config-status error';
  }
  btn.disabled = false;
}

function cancelConfig() {
  if (originalFullConfig) {
    fullConfig = JSON.parse(JSON.stringify(originalFullConfig));
    populateConfigTabs();
    const statusEl = document.getElementById('configStatus');
    statusEl.textContent = '';
    statusEl.className = 'config-status';
  }
}

// ── AIRPORT SEARCH ──
function cfgInitAirportSearch() {
  const input = document.getElementById('cfgStationSearch');
  const results = document.getElementById('cfgStationResults');
  input.addEventListener('input', () => {
    clearTimeout(cfgSearchTimeout);
    const q = input.value.trim();
    if (q.length < 2) { results.classList.remove('open'); return; }
    cfgSearchTimeout = setTimeout(async () => {
      try {
        const items = await api.searchAirports(q);
        if (items.length === 0) {
          results.innerHTML = '<div class="cfg-search-item"><span class="cfg-search-detail">' + t('cfg.station.noResult') + '</span></div>';
        } else {
          results.innerHTML = items.slice(0, 10).map(a =>
            '<div class="cfg-search-item" data-icao="' + escapeHtml(a.icao || a.id || '') + '">'
            + '<div class="cfg-search-name">' + escapeHtml(a.icao || a.id || '') + ' — ' + escapeHtml(a.name || '') + '</div>'
            + '<div class="cfg-search-detail">' + escapeHtml(a.city || '') + (a.type ? ' (' + a.type + ')' : '') + '</div>'
            + '</div>'
          ).join('');
        }
        results.classList.add('open');
        results.querySelectorAll('.cfg-search-item[data-icao]').forEach(el => {
          el.addEventListener('click', () => cfgSelectAirport(el.dataset.icao));
        });
      } catch (e) {
        console.error('Search error:', e);
      }
    }, 300);
  });
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.cfg-search-wrapper')) results.classList.remove('open');
  });
}

async function cfgSelectAirport(icao) {
  document.getElementById('cfgStationResults').classList.remove('open');
  document.getElementById('cfgStationSearch').value = icao;
  const details = await api.getAirport(icao);
  if (details) {
    fullConfig.station = fullConfig.station || {};
    fullConfig.station.icao = icao;
    document.getElementById('cfgDisplayName').value = details.displayName || details.name || icao;
    fullConfig.station.displayName = details.displayName || details.name || icao;
    if (details.lat != null) document.getElementById('cfgLat').value = details.lat;
    if (details.lon != null) document.getElementById('cfgLon').value = details.lon;
    if (details.firs) document.getElementById('cfgFir').value = (Array.isArray(details.firs) ? details.firs : [details.firs]).join(', ');
    if (details.firName) document.getElementById('cfgFirName').value = details.firName;
  }
}

// ── RUNWAYS ──
function cfgRenderRunways() {
  const container = document.getElementById('cfgRunwayList');
  const rwys = fullConfig?.runways || [];
  if (rwys.length === 0) {
    container.innerHTML = '<div class="cfg-hint">' + t('cfg.runways.noRunway') + '</div>';
    return;
  }
  container.innerHTML = rwys.map((r, i) =>
    '<div class="cfg-runway-item">'
    + '<span class="rwy-name">' + escapeHtml(r.name) + '</span>'
    + '<span class="rwy-heading">' + r.heading + '°</span>'
    + '<button class="cfg-rwy-delete" onclick="cfgDeleteRunway(' + i + ')">✕</button>'
    + '</div>'
  ).join('');
}

function cfgAddRunway() {
  const name = document.getElementById('cfgNewRwyName').value.trim().toUpperCase();
  const heading = parseInt(document.getElementById('cfgNewRwyHeading').value);
  if (!name || isNaN(heading)) return;
  if (!fullConfig.runways) fullConfig.runways = [];
  fullConfig.runways.push({ name, heading: heading % 360 });
  document.getElementById('cfgNewRwyName').value = '';
  document.getElementById('cfgNewRwyHeading').value = '';
  cfgRenderRunways();
}

function cfgDeleteRunway(index) {
  if (fullConfig?.runways) {
    fullConfig.runways.splice(index, 1);
    cfgRenderRunways();
  }
}

// ── THRESHOLDS TOGGLE ──
function cfgUpdateThresholdState() {
  const profile = document.getElementById('cfgThresholdProfile').value;
  const isCustom = profile === 'custom';
  const fields = document.getElementById('cfgThresholdFields');
  const presetInfo = document.getElementById('cfgPresetInfo');

  // Afficher/masquer les champs custom vs preset info
  if (fields) fields.style.display = isCustom ? 'block' : 'none';

  if (isCustom) {
    if (presetInfo) presetInfo.innerHTML = '';
    return;
  }

  // Affichage read-only des catégories du preset
  const presets = {
    easa: [
      { cat: 'VFR', color: '#22c55e', vis: '≥ 5000 m', ceil: '≥ 1500 ft' },
      { cat: 'VFR SPECIAL', color: '#f59e0b', vis: '≥ 1500 m', ceil: '≥ 600 ft' },
      { cat: 'IFR', color: '#ef4444', vis: '< 1500 m', ceil: '< 600 ft' }
    ],
    caa: [
      { cat: 'VFR', color: '#22c55e', vis: '≥ 5000 m', ceil: '≥ 1500 ft' },
      { cat: 'VFR SPECIAL', color: '#f59e0b', vis: '≥ 1500 m', ceil: '≥ 600 ft' },
      { cat: 'IFR', color: '#ef4444', vis: '< 1500 m', ceil: '< 600 ft' }
    ],
    faa: [
      { cat: 'VFR', color: '#22c55e', vis: '> 5 SM (8050 m)', ceil: '> 3000 ft' },
      { cat: 'MVFR', color: '#3b82f6', vis: '3–5 SM (4828–8050 m)', ceil: '1000–3000 ft' },
      { cat: 'IFR', color: '#ef4444', vis: '1–3 SM (1609–4828 m)', ceil: '500–1000 ft' },
      { cat: 'LIFR', color: '#d946ef', vis: '< 1 SM (1609 m)', ceil: '< 500 ft' }
    ],
    tcca: [
      { cat: 'VFR', color: '#22c55e', vis: '> 5 SM (8050 m)', ceil: '> 3000 ft' },
      { cat: 'MVFR', color: '#3b82f6', vis: '3–5 SM (4828–8050 m)', ceil: '1000–3000 ft' },
      { cat: 'IFR', color: '#ef4444', vis: '< 3 SM (4828 m)', ceil: '< 1000 ft' }
    ]
  };

  const cats = presets[profile] || presets.easa;
  if (presetInfo) {
    let html = '<div style="display:grid; grid-template-columns:auto 1fr 1fr; gap:4px 12px; font-size:12px; padding:8px; background:rgba(255,255,255,0.03); border-radius:6px; border:1px solid var(--border);">';
    html += '<div style="font-weight:600; color:var(--text-dim);">' + t('cfg.thresholds.category') + '</div>';
    html += '<div style="font-weight:600; color:var(--text-dim);">' + t('cfg.thresholds.visibility') + '</div>';
    html += '<div style="font-weight:600; color:var(--text-dim);">' + t('cfg.thresholds.ceiling') + '</div>';
    cats.forEach(c => {
      html += '<div style="color:' + c.color + '; font-weight:600;">' + c.cat + '</div>';
      html += '<div style="color:var(--text);">' + c.vis + '</div>';
      html += '<div style="color:var(--text);">' + c.ceil + '</div>';
    });
    html += '</div>';
    presetInfo.innerHTML = html;
  }
}

// ── BASEMAP AUTO TOGGLE ──
function cfgToggleBasemapAuto() {
  const auto = document.getElementById('cfgMapBasemapAuto').checked;
  document.getElementById('cfgBasemapAutoGroup').style.display = auto ? '' : 'none';
}

// ── MAP LAYERS ──
function cfgRenderMapLayers() {
  const container = document.getElementById('cfgMapLayers');
  const layers = fullConfig?.maps?.layers || [];
  container.innerHTML = layers.map((l, i) =>
    '<div class="cfg-toggle-row">'
    + '<span class="cfg-toggle-label">' + escapeHtml(l.label || l.id) + (l.dayOnly ? ' ☀' : '') + '</span>'
    + '<label class="toggle-switch"><input type="checkbox" data-layer-idx="' + i + '"' + (l.enabled ? ' checked' : '') + '><span class="toggle-track"></span><span class="toggle-knob"></span></label>'
    + '</div>'
  ).join('');
}

// ── TRAFFIC TOGGLES ──
function cfgToggleTraffic() {
  const enabled = document.getElementById('cfgTrafficEnabled').checked;
  document.getElementById('cfgTrafficGroup').style.display = enabled ? '' : 'none';
  // Show watch mode only if watchlist has content
  const wl = document.getElementById('cfgTrafficWatchlist').value.trim();
  document.getElementById('cfgWatchModeGroup').style.display = wl ? '' : 'none';
}

function cfgToggleOgn() {
  const enabled = document.getElementById('cfgOgnEnabled').checked;
  document.getElementById('cfgOgnGroup').style.display = enabled ? '' : 'none';
}

function cfgToggleFr24Official() {
  const enabled = document.getElementById('cfgFr24OfficialEnabled').checked;
  document.getElementById('cfgFr24OfficialGroup').style.display = enabled ? '' : 'none';
}

// ── ACTIVITY PROFILES ──
const CFG_ACTIVITY_PROFILES = {
  standard: {
    sections: { sunTimes: true, conditions: true, fogAlert: true, runwayComponents: true, preferredRunway: true, metar: true, taf: true, tafBar: true, sigmet: true, flightCategory: true, sunsetWarning: true },
    tafDisplay: 'both',
    layers: { clouds_new: true, precipitation_new: true, pressure_new: true, wind_new: true, temp_new: true, snow_new: false, gusts: false, dewpoint: false, cape: false, pbl: false, uv: false, wind_altitude: false }
  },
  glider: {
    sections: { sunTimes: true, conditions: true, fogAlert: true, runwayComponents: false, preferredRunway: false, metar: true, taf: true, tafBar: true, sigmet: true, flightCategory: true, sunsetWarning: true },
    tafDisplay: 'bar',
    layers: { clouds_new: true, precipitation_new: true, pressure_new: true, wind_new: true, temp_new: true, snow_new: false, gusts: true, dewpoint: true, cape: true, pbl: true, uv: false, wind_altitude: true }
  },
  aeromodel: {
    sections: { sunTimes: true, conditions: true, fogAlert: true, runwayComponents: false, preferredRunway: false, metar: false, taf: true, tafBar: false, sigmet: false, flightCategory: false, sunsetWarning: true },
    tafDisplay: 'decoded',
    layers: { clouds_new: true, precipitation_new: true, pressure_new: false, wind_new: true, temp_new: true, snow_new: false, gusts: true, dewpoint: false, cape: false, pbl: false, uv: true, wind_altitude: false },
    fleet: false
  }
};

function cfgApplyActivityProfile(profileId) {
  const profile = CFG_ACTIVITY_PROFILES[profileId];
  if (!profile) return;
  // Sections
  document.querySelectorAll('#cfgSectionToggles input[data-section-key]').forEach(cb => {
    const key = cb.dataset.sectionKey;
    if (profile.sections[key] !== undefined) cb.checked = profile.sections[key];
  });
  // TAF display
  document.getElementById('cfgTafDisplay').value = profile.tafDisplay;
  // Layers
  document.querySelectorAll('#cfgMapLayers input[data-layer-idx]').forEach(cb => {
    const idx = parseInt(cb.dataset.layerIdx);
    const layer = fullConfig?.maps?.layers?.[idx];
    if (layer && profile.layers[layer.id] !== undefined) cb.checked = profile.layers[layer.id];
  });
}

// ── SECTION TOGGLES ──
function cfgRenderSectionToggles() {
  const container = document.getElementById('cfgSectionToggles');
  const sections = fullConfig?.sections || {};
  const labels = {
    sunTimes: t('cfg.sections.sunTimes'),
    conditions: t('cfg.sections.conditions'),
    fogAlert: t('cfg.sections.fogAlert'),
    runwayComponents: t('cfg.sections.runwayComponents'),
    preferredRunway: t('cfg.sections.preferredRunway'),
    metar: t('cfg.sections.metar'),
    taf: t('cfg.sections.taf'),
    tafBar: t('cfg.sections.tafBar'),
    sigmet: t('cfg.sections.sigmet'),
    flightCategory: t('cfg.sections.flightCategory'),
    sunsetWarning: t('cfg.sections.sunsetWarning'),
    ramadan: t('cfg.sections.ramadan')
  };
  container.innerHTML = Object.entries(labels).map(([key, label]) =>
    '<div class="cfg-toggle-row">'
    + '<span class="cfg-toggle-label">' + escapeHtml(label) + '</span>'
    + '<label class="toggle-switch"><input type="checkbox" data-section-key="' + key + '"' + (sections[key] !== false ? ' checked' : '') + '><span class="toggle-track"></span><span class="toggle-knob"></span></label>'
    + '</div>'
  ).join('');

  // Passer en custom si modif manuelle
  container.querySelectorAll('input[data-section-key]').forEach(cb => {
    cb.addEventListener('change', () => {
      document.getElementById('cfgActivityProfile').value = 'custom';
    });
  });

  // Handler profil d'activité
  document.getElementById('cfgActivityProfile').addEventListener('change', (e) => {
    if (e.target.value !== 'custom') cfgApplyActivityProfile(e.target.value);
  });
}

// ── THEME GRIDS ──
const THEME_NAMES = { cockpit: 'Cockpit', ocean: 'Ocean', aeroclub: 'Aéroclub', daylight: 'Daylight' };

function cfgRenderThemeGrids() {
  const themes = fullConfig?.themes || {};
  const dayTheme = fullConfig?.themeAuto?.day || 'cockpit';
  const nightTheme = fullConfig?.themeAuto?.night || 'cockpit';
  const fixedTheme = fullConfig?.themeName !== 'auto' ? fullConfig?.themeName : 'cockpit';

  cfgBuildThemeGrid('cfgThemeDayGrid', themes, dayTheme);
  cfgBuildThemeGrid('cfgThemeNightGrid', themes, nightTheme);
  cfgBuildThemeGrid('cfgThemeFixedGrid', themes, fixedTheme);
}

function cfgBuildThemeGrid(containerId, themes, selectedTheme) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = Object.entries(THEME_NAMES).map(([key, name]) => {
    const th = themes[key] || {};
    return '<div class="cfg-theme-card' + (key === selectedTheme ? ' selected' : '') + '" data-theme="' + key + '">'
      + '<div class="cfg-theme-preview" style="background:' + (th.bg || '#0a0e14') + ';">'
      + '<span class="swatch" style="background:' + (th.accent || '#00d4ff') + ';"></span>'
      + '<span class="swatch" style="background:' + (th.vfr || '#22c55e') + ';"></span>'
      + '<span class="swatch" style="background:' + (th.ifr || '#ef4444') + ';"></span>'
      + '</div>'
      + '<div class="cfg-theme-name">' + escapeHtml(name) + '</div>'
      + '</div>';
  }).join('');

  container.querySelectorAll('.cfg-theme-card').forEach(card => {
    card.addEventListener('click', () => {
      container.querySelectorAll('.cfg-theme-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });
}

function cfgToggleThemeMode() {
  const mode = document.querySelector('input[name="cfgThemeMode"]:checked')?.value;
  document.getElementById('cfgThemeAutoConfig').style.display = mode === 'auto' ? '' : 'none';
  document.getElementById('cfgThemeFixedConfig').style.display = mode === 'fixed' ? '' : 'none';
}

// ── LOGO UPLOAD ──
document.addEventListener('DOMContentLoaded', () => {
  const logoDayFile = document.getElementById('cfgLogoDayFile');
  const logoNightFile = document.getElementById('cfgLogoNightFile');
  if (logoDayFile) logoDayFile.addEventListener('change', () => cfgUploadLogo('day'));
  if (logoNightFile) logoNightFile.addEventListener('change', () => cfgUploadLogo('night'));
});

async function cfgUploadLogo(which) {
  const fileInput = document.getElementById(which === 'day' ? 'cfgLogoDayFile' : 'cfgLogoNightFile');
  const file = fileInput.files[0];
  if (!file) return;
  try {
    const result = await api.uploadLogo(file);
    const fileName = result.fileName || result.filename || '';
    if (which === 'day') {
      fullConfig.branding = fullConfig.branding || {};
      fullConfig.branding.logoDay = fileName;
      document.getElementById('cfgLogoDayName').textContent = file.name;
      // Preview
      const reader = new FileReader();
      reader.onload = (e) => { document.getElementById('cfgLogoDayPreview').innerHTML = '<img src="' + e.target.result + '" alt="">'; };
      reader.readAsDataURL(file);
    } else {
      fullConfig.branding = fullConfig.branding || {};
      fullConfig.branding.logoNight = fileName;
      document.getElementById('cfgLogoNightName').textContent = file.name;
      const reader = new FileReader();
      reader.onload = (e) => { document.getElementById('cfgLogoNightPreview').innerHTML = '<img src="' + e.target.result + '" alt="">'; };
      reader.readAsDataURL(file);
    }
  } catch (err) {
    console.error('Logo upload error:', err);
  }
}

// ── EVENT BINDINGS (config) ──
document.addEventListener('DOMContentLoaded', () => {
  // Slider bindings
  cfgBindSlider('cfgMapZoom', 'cfgMapZoomVal');
  cfgBindSlider('cfgMapOffLat', 'cfgMapOffLatVal');
  cfgBindSlider('cfgMapOffLon', 'cfgMapOffLonVal');
  cfgBindSlider('cfgRotation', 'cfgRotationVal');
  cfgBindSlider('cfgMapBrightness', 'cfgMapBrightnessVal');
  cfgBindSlider('cfgWeatherDark', 'cfgWeatherDarkVal');
  cfgBindSlider('cfgWeatherLight', 'cfgWeatherLightVal');
  cfgBindSlider('cfgTrafficRefresh', 'cfgTrafficRefreshVal');
  cfgBindSlider('cfgTrafficRadius', 'cfgTrafficRadiusVal');
  cfgBindSlider('cfgTrafficAlt', 'cfgTrafficAltVal');
  cfgBindSlider('cfgOgnRadius', 'cfgOgnRadiusVal');
  cfgBindSlider('cfgClubDuration', 'cfgClubDurationVal');
  cfgBindSlider('cfgFr24Refresh', 'cfgFr24RefreshVal');

  // Threshold profile toggle
  const thrSelect = document.getElementById('cfgThresholdProfile');
  if (thrSelect) thrSelect.addEventListener('change', cfgUpdateThresholdState);

  // Basemap auto toggle
  const bmAuto = document.getElementById('cfgMapBasemapAuto');
  if (bmAuto) bmAuto.addEventListener('change', cfgToggleBasemapAuto);

  // Traffic toggles
  const trafficEn = document.getElementById('cfgTrafficEnabled');
  if (trafficEn) trafficEn.addEventListener('change', cfgToggleTraffic);
  const ognEn = document.getElementById('cfgOgnEnabled');
  if (ognEn) ognEn.addEventListener('change', cfgToggleOgn);
  const fr24OfficialEn = document.getElementById('cfgFr24OfficialEnabled');
  if (fr24OfficialEn) fr24OfficialEn.addEventListener('change', cfgToggleFr24Official);

  // Watchlist → show/hide watch mode
  const wlInput = document.getElementById('cfgTrafficWatchlist');
  if (wlInput) wlInput.addEventListener('input', () => {
    document.getElementById('cfgWatchModeGroup').style.display = wlInput.value.trim() ? '' : 'none';
  });

  // Theme mode toggle
  document.querySelectorAll('input[name="cfgThemeMode"]').forEach(r => {
    r.addEventListener('change', cfgToggleThemeMode);
  });

  // FR24 toggle → show/hide settings
  const fr24En = document.getElementById('cfgFr24Enabled');
  if (fr24En) fr24En.addEventListener('change', () => {
    document.getElementById('cfgFr24Settings').style.display = fr24En.checked ? '' : 'none';
  });

  // God mode keyboard shortcut: Ctrl+Shift+G
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'G') {
      e.preventDefault();
      if (godModeActive) return; // déjà actif
      if (currentView !== 'config') return; // seulement en vue config
      triggerGodMode();
    }
  });
});

// ── GOD MODE ──

// Hash SHA-256 côté client (pour mode cloud)
async function hashPasswordClient(password) {
  const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0')).join('');
  const data = new TextEncoder().encode(salt + password);
  const hashBuf = await crypto.subtle.digest('SHA-256', data);
  const hash = Array.from(new Uint8Array(hashBuf))
    .map(b => b.toString(16).padStart(2, '0')).join('');
  return `sha256:${salt}:${hash}`;
}

async function verifyHashClient(password, storedHash) {
  if (!storedHash) return false;
  const parts = storedHash.split(':');
  if (parts.length !== 3) return false;
  const [, salt, hash] = parts;
  const data = new TextEncoder().encode(salt + password);
  const hashBuf = await crypto.subtle.digest('SHA-256', data);
  const computed = Array.from(new Uint8Array(hashBuf))
    .map(b => b.toString(16).padStart(2, '0')).join('');
  return computed === hash;
}

async function triggerGodMode() {
  if (!fullConfig) return;
  // Vérifier si un mot de passe god mode est déjà défini
  if (api.mode === 'local') {
    try {
      const result = await api.godModeUnlock('__check__');
      if (result.needsSetup) {
        showGodModal('setup');
      } else {
        showGodModal('unlock');
      }
    } catch (e) {
      showGodModal('unlock');
    }
  } else {
    // Mode cloud : vérifier dans la config chargée
    if (!fullConfig.godMode?.passwordHash) {
      showGodModal('setup');
    } else {
      showGodModal('unlock');
    }
  }
}

function showGodModal(mode) {
  godModalMode = mode;
  const overlay = document.getElementById('godModeOverlay');
  const title = document.getElementById('godModalTitle');
  const desc = document.getElementById('godModalDesc');
  const pwdInput = document.getElementById('godModalPassword');
  const confirmInput = document.getElementById('godModalConfirm');
  const submitBtn = document.getElementById('godModalSubmit');
  const errorEl = document.getElementById('godModalError');

  errorEl.style.display = 'none';
  pwdInput.value = '';
  confirmInput.value = '';

  if (mode === 'setup') {
    title.textContent = 'Créer accès avancé';
    desc.textContent = 'Définissez un mot de passe pour le mode avancé. Ce mot de passe est distinct du mot de passe admin.';
    confirmInput.style.display = '';
    submitBtn.textContent = 'Créer';
  } else {
    title.textContent = 'Accès avancé';
    desc.textContent = 'Entrez le mot de passe pour activer le mode avancé.';
    confirmInput.style.display = 'none';
    submitBtn.textContent = 'Déverrouiller';
  }

  overlay.style.display = 'flex';
  setTimeout(() => pwdInput.focus(), 100);

  // Enter key handler
  pwdInput.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); if (mode === 'setup') confirmInput.focus(); else submitGodModal(); } };
  confirmInput.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); submitGodModal(); } };
}

function closeGodModal() {
  document.getElementById('godModeOverlay').style.display = 'none';
}

async function submitGodModal() {
  const pwd = document.getElementById('godModalPassword').value;
  const confirm = document.getElementById('godModalConfirm').value;
  const errorEl = document.getElementById('godModalError');

  if (!pwd) {
    errorEl.textContent = 'Mot de passe requis';
    errorEl.style.display = '';
    return;
  }

  if (godModalMode === 'setup') {
    if (pwd.length < 4) {
      errorEl.textContent = 'Minimum 4 caractères';
      errorEl.style.display = '';
      return;
    }
    if (pwd !== confirm) {
      errorEl.textContent = 'Les mots de passe ne correspondent pas';
      errorEl.style.display = '';
      return;
    }
    try {
      await api.godModeSetup(pwd);
      closeGodModal();
      activateGodMode();
    } catch (e) {
      errorEl.textContent = 'Erreur : ' + e.message;
      errorEl.style.display = '';
    }
  } else {
    try {
      const result = await api.godModeUnlock(pwd);
      if (result.ok) {
        closeGodModal();
        activateGodMode();
      } else {
        showNedry();
      }
    } catch (e) {
      errorEl.textContent = 'Erreur : ' + e.message;
      errorEl.style.display = '';
    }
  }
}

function activateGodMode() {
  godModeActive = true;
  sessionStorage.setItem('godModeActive', 'true');
  // Afficher l'onglet god mode
  const godTab = document.querySelector('.god-tab');
  if (godTab) godTab.style.display = '';
  // Basculer vers l'onglet
  switchConfigTab('godmode');
  // Populate
  populateGodModeTab();
}

function showNedry() {
  closeGodModal();
  const overlay = document.createElement('div');
  overlay.className = 'nedry-overlay';
  overlay.innerHTML = '<div class="nedry-finger">☝️</div>'
    + '<div class="nedry-text" id="nedryText"></div>'
    + '<div class="nedry-scanline"></div>';
  document.body.appendChild(overlay);

  const phrase = 'Ah ah ah, you didn\'t say the magic word!\n';
  const el = overlay.querySelector('#nedryText');
  let count = 0;
  const maxLines = 12;
  const typeInterval = setInterval(() => {
    el.textContent += phrase;
    count++;
    if (count >= maxLines) clearInterval(typeInterval);
  }, 300);

  overlay.onclick = () => { clearInterval(typeInterval); overlay.remove(); };
  setTimeout(() => { clearInterval(typeInterval); overlay.remove(); }, 5000);
}

let lightningRemoteActive = false;

async function toggleLightningRemote() {
  try {
    await api.lightningToggle();
    lightningRemoteActive = !lightningRemoteActive;
    updateLightningButton();
  } catch (e) {
    console.warn('Lightning toggle error:', e);
  }
}

function updateLightningButton() {
  const btn = document.getElementById('cfgLightningToggle');
  const status = document.getElementById('cfgLightningStatus');
  if (lightningRemoteActive) {
    btn.textContent = '⚡ Désactiver Lightning';
    btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    btn.style.color = '#fff';
    status.textContent = 'Actif';
    status.style.color = '#fbbf24';
  } else {
    btn.textContent = '⚡ Activer Lightning';
    btn.style.background = 'linear-gradient(135deg, #fbbf24, #f59e0b)';
    btn.style.color = '#000';
    status.textContent = 'Inactif';
    status.style.color = '#64748b';
  }
}

function populateGodModeTab() {
  if (!fullConfig) return;
  const gm = fullConfig.godMode || {};
  const fr24 = gm.fr24 || {};
  document.getElementById('cfgFr24Enabled').checked = !!fr24.enabled;
  document.getElementById('cfgFr24Settings').style.display = fr24.enabled ? '' : 'none';
  cfgSetSlider('cfgFr24Refresh', 'cfgFr24RefreshVal', fr24.refreshSeconds || 30, 's');
  updateLightningButton();
}

function collectGodModeValues() {
  if (!fullConfig) return;
  if (!fullConfig.godMode) fullConfig.godMode = {};
  if (!fullConfig.godMode.fr24) fullConfig.godMode.fr24 = {};
  fullConfig.godMode.fr24.enabled = document.getElementById('cfgFr24Enabled').checked;
  fullConfig.godMode.fr24.refreshSeconds = parseInt(document.getElementById('cfgFr24Refresh').value, 10) || 30;
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
