/**
 * Nouveau Système de Connexion Simple
 * Basé uniquement sur la sélection d'utilisateur pour les logs
 * Version 2025 - Remplace l'ancien système d'authentification
 * Développé par Thoum Production © Celesty
 */

class SimpleAuthSystem {
    constructor() {
        this.users = [];
        this.currentUser = null;
        this.isLoggedIn = false;
        
        console.log('[NEW-AUTH] Initialisation du nouveau système de connexion...');
        this.init();
    }

    async init() {
        try {
            // Charger les utilisateurs
            await this.loadUsers();
            
            // Vérifier s'il y a une session existante
            if (this.checkExistingSession()) {

                this.showApp();
            } else {

                this.showLogin();
            }
        } catch (error) {
            console.error('[NEW-AUTH] Erreur d\'initialisation:', error);
            this.showLogin();
        }
    }

    async loadUsers() {
        try {
            // Attendre un peu que les APIs se chargent
            let retryCount = 0;
            while (retryCount < 5 && !window.supabaseAPI && !window.D1API) {
                await new Promise(resolve => setTimeout(resolve, 500));
                retryCount++;
            }
            
            if (window.supabaseAPI || window.D1API) {
                const api = window.supabaseAPI || window.D1API;
                
                const result = await api.get('utilisateurs');
                
                if (result.success && result.data) {
                    this.users = result.data
                        .filter(user => !user.archived && !user.deleted)
                        .map(user => ({
                            id: user.id,
                            nom: user.nom || '',
                            prenom: user.prenom || '',
                            fullName: `${user.prenom || ''} ${user.nom || ''}`.trim(),
                            email: user.email || '',
                            poste: user.poste || '',
                            equipe: user.equipe || '',
                            avatar: user.avatar || null
                        }))
                        .filter(user => user.fullName.trim()) // Supprimer les utilisateurs sans nom
                        .sort((a, b) => a.fullName.localeCompare(b.fullName));
                } else {
                    throw new Error('Aucun utilisateur trouvé dans la base');
                }
            } else {
                throw new Error('API non disponible après plusieurs tentatives');
            }
        } catch (error) {
            console.warn('[NEW-AUTH] Erreur de chargement, utilisation des utilisateurs par défaut:', error.message);
            this.users = this.getDefaultUsers();
        }

        console.log(`[NEW-AUTH] ${this.users.length} utilisateurs chargés`);
        return this.users;
    }

    getDefaultUsers() {
        return [
            {
                id: 'admin-001',
                nom: 'Administrateur',
                prenom: 'Système',
                fullName: 'Système Administrateur',
                email: 'admin@system.local',
                poste: 'Administrateur Système',
                equipe: 'IT',
                avatar: null
            },
            {
                id: 'manager-001', 
                nom: 'Manager',
                prenom: 'Principal',
                fullName: 'Principal Manager',
                email: 'manager@company.local',
                poste: 'Manager Général',
                equipe: 'Direction',
                avatar: null
            },
            {
                id: 'user-001',
                nom: 'Utilisateur',
                prenom: 'Standard',
                fullName: 'Standard Utilisateur',
                email: 'user@company.local',
                poste: 'Employé',
                equipe: 'Générale',
                avatar: null
            }
        ];
    }

    checkExistingSession() {
        const sessionData = localStorage.getItem('auth_session');
        
        if (!sessionData) return false;

        try {
            const session = JSON.parse(sessionData);
            const now = Date.now();
            const sessionAge = now - session.loginTime;
            const maxAge = 8 * 60 * 60 * 1000; // 8 heures

            if (sessionAge < maxAge && session.userId) {
                if (session.userDetails) {
                    this.currentUser = session.userDetails;
                    this.isLoggedIn = true;
                    return true;
                } else {
                    const user = this.users.find(u => u.id === session.userId);
                    if (user) {
                        this.currentUser = user;
                        this.isLoggedIn = true;
                        return true;
                    }
                }
            } else {
                localStorage.removeItem('auth_session');
            }
        } catch (error) {
            localStorage.removeItem('auth_session');
        }

        return false;
    }

    showLogin() {
        this.isLoggedIn = false;
        
        // Masquer l'application
        const app = document.getElementById('app');
        if (app) app.style.display = 'none';

        // Créer ou afficher l'écran de connexion
        this.createLoginScreen();
        
        const loginScreen = document.getElementById('simple-login-screen');
        if (loginScreen) {
            loginScreen.style.display = 'flex';
        }
    }

    showApp() {
        this.isLoggedIn = true;
        
        // Masquer l'écran de connexion avec méthode brutale
        const loginScreen = document.getElementById('simple-login-screen');
        if (loginScreen) {
            loginScreen.style.display = 'none';
            loginScreen.style.visibility = 'hidden';
            loginScreen.style.opacity = '0';
            loginScreen.style.position = 'absolute';
            loginScreen.style.left = '-9999px';
            loginScreen.style.zIndex = '-999';
            
            // Suppression complète
            loginScreen.remove();
            
            // Supprimer TOUS les écrans de connexion potentiels
            const allLoginScreens = document.querySelectorAll('[id*="login"], [class*="login"], [id*="auth"], [class*="auth"]');
            allLoginScreens.forEach((screen) => {
                if (screen.style.position === 'fixed' || screen.style.position === 'absolute') {
                    screen.remove();
                }
            });
        }

        // Afficher l'application avec un petit délai pour s'assurer que tout est chargé
        setTimeout(() => {
            const app = document.getElementById('app');
            if (app) {
                app.style.display = 'block';
                app.style.visibility = 'visible';
                app.style.opacity = '1';
                
                // Initialiser l'app si nécessaire
                setTimeout(() => {
                    if (window.app && typeof window.app.init === 'function') {
                        try {
                            window.app.init();
                        } catch (initError) {
                            console.error('[NEW-AUTH] Erreur lors de l\'initialisation:', initError);
                        }
                    }
                }, 100);
            }
        }, 200);

        // Logger la connexion
        this.logConnection();
        
        console.log('[NEW-AUTH] Connexion réussie:', this.currentUser.fullName);
        
        // Vérification finale silencieuse
        setTimeout(() => {
            const remainingLogin = document.getElementById('simple-login-screen');
            const app = document.getElementById('app');
            
            if (remainingLogin) {
                remainingLogin.remove();
            }
            
            if (app && app.style.display === 'none') {
                app.style.display = 'block';
                app.style.visibility = 'visible';
                app.style.opacity = '1';
            }
        }, 500);
    }

    createLoginScreen() {
        // Supprimer l'ancien écran s'il existe
        const existingScreen = document.getElementById('simple-login-screen');
        if (existingScreen) {
            existingScreen.remove();
        }

        const loginHTML = `
            <div id="simple-login-screen" class="fixed inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center p-4 z-50">
                <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                    <!-- Header -->
                    <div class="text-center mb-8">
                        <div class="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                            <i class="fas fa-key text-2xl text-white"></i>
                        </div>
                        <h1 class="text-2xl font-bold text-gray-800 mb-2">Connexion</h1>
                        <p class="text-gray-600">Sélectionnez votre profil pour continuer</p>
                    </div>

                    <!-- Zone d'erreur -->
                    <div id="simple-login-error" class="hidden bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                        <div class="flex items-center">
                            <i class="fas fa-exclamation-triangle text-red-500 mr-2"></i>
                            <span class="text-red-700 text-sm" id="simple-login-error-text"></span>
                        </div>
                    </div>

                    <!-- Sélecteur d'utilisateur en menu déroulant -->
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fas fa-user mr-2"></i>Choisissez votre profil
                        </label>
                        <div class="relative">
                            <select id="simple-user-select" 
                                    class="w-full px-4 py-3 pl-12 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white appearance-none text-gray-900">
                                <option value="">Sélectionnez votre nom...</option>
                            </select>
                            <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
                                <div id="selected-user-avatar" class="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-semibold" style="display: none;">
                                    ?
                                </div>
                                <i id="default-user-icon" class="fas fa-user text-gray-400"></i>
                            </div>
                            <i class="fas fa-chevron-down absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                        </div>
                        
                        <!-- Affichage des détails de l'utilisateur sélectionné -->
                        <div id="selected-user-details" class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg" style="display: none;">
                            <div class="flex items-center space-x-3">
                                <div id="details-avatar" class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    
                                </div>
                                <div class="flex-1">
                                    <div id="details-name" class="font-medium text-blue-900"></div>
                                    <div id="details-position" class="text-sm text-blue-600"></div>
                                    <div id="details-email" class="text-xs text-blue-500"></div>
                                </div>
                                <div class="text-blue-600">
                                    <i class="fas fa-check-circle text-lg"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Boutons -->
                    <div class="flex flex-col space-y-3">
                        <button id="simple-login-btn" 
                                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled>
                            <i class="fas fa-sign-in-alt mr-2"></i>
                            <span>Se connecter</span>
                        </button>
                        
                        <button id="simple-refresh-users" 
                                class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors">
                            <i class="fas fa-sync-alt mr-2"></i>
                            <span>Actualiser la liste</span>
                        </button>
                    </div>

                    <!-- Footer -->
                    <div class="mt-6 text-center text-xs text-gray-500">
                        <p>Gestion des Accès - Version Simple 2025</p>
                        <p>Développé par <span class="font-semibold text-gray-700">Thoum Production</span></p>
                        <p class="mt-1">© Celesty</p>
                        <p class="mt-2 text-gray-400">Connexion basée sur la sélection d'utilisateur</p>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', loginHTML);
        
        // Peupler la liste et attacher les événements
        this.populateUserList();
        this.attachLoginEvents();
        
        // S'assurer qu'aucun utilisateur n'est pré-sélectionné
        this.clearSelection();
    }

    populateUserList() {
        const userSelect = document.getElementById('simple-user-select');
        if (!userSelect) return;

        // Vider le select et ajouter l'option par défaut
        userSelect.innerHTML = '<option value="">Sélectionnez votre nom...</option>';

        if (this.users.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Aucun utilisateur disponible';
            option.disabled = true;
            userSelect.appendChild(option);
            return;
        }

        // Ajouter chaque utilisateur comme option
        this.users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.fullName;
            option.dataset.userJson = JSON.stringify(user);
            userSelect.appendChild(option);
        });


    }

    attachLoginEvents() {
        // Sélection d'utilisateur via menu déroulant
        const userSelect = document.getElementById('simple-user-select');
        userSelect?.addEventListener('change', (e) => {
            const userId = e.target.value;
            if (userId) {
                this.selectUser(userId);
            } else {
                this.clearSelection();
            }
        });

        // Bouton de connexion avec délégation d'événements
        document.addEventListener('click', (e) => {
            if (e.target.id === 'simple-login-btn' || e.target.closest('#simple-login-btn')) {
                e.preventDefault();
                e.stopPropagation();

                this.performLogin();
            }
        });
        
        // Méthode directe aussi (au cas où)
        const loginBtn = document.getElementById('simple-login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                this.performLogin();
            });
        }

        // Bouton d'actualisation
        const refreshBtn = document.getElementById('simple-refresh-users');
        refreshBtn?.addEventListener('click', async () => {
            refreshBtn.disabled = true;
            refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Actualisation...';
            
            await this.loadUsers();
            this.populateUserList();
            
            refreshBtn.disabled = false;
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt mr-2"></i>Actualiser la liste';
        });
    }

    selectUser(userId) {
        // Trouver l'utilisateur sélectionné
        this.currentUser = this.users.find(u => u.id === userId);
        
        if (!this.currentUser) return;

        // Créer les initiales de manière sécurisée
        const initiales = (this.currentUser.prenom.charAt(0) || 'U') + (this.currentUser.nom.charAt(0) || 'U');

        // Mettre à jour l'avatar dans le select
        const selectedAvatar = document.getElementById('selected-user-avatar');
        const defaultIcon = document.getElementById('default-user-icon');
        
        if (selectedAvatar && defaultIcon) {
            selectedAvatar.textContent = initiales;
            selectedAvatar.style.display = 'flex';
            defaultIcon.style.display = 'none';
        }

        // Afficher les détails de l'utilisateur
        const detailsSection = document.getElementById('selected-user-details');
        const detailsAvatar = document.getElementById('details-avatar');
        const detailsName = document.getElementById('details-name');
        const detailsPosition = document.getElementById('details-position');
        const detailsEmail = document.getElementById('details-email');

        if (detailsSection && detailsAvatar && detailsName && detailsPosition) {
            detailsAvatar.textContent = initiales;
            detailsName.textContent = this.currentUser.fullName;
            detailsPosition.textContent = `${this.currentUser.poste || 'Poste non défini'} - ${this.currentUser.equipe || 'Équipe non définie'}`;
            
            if (detailsEmail) {
                if (this.currentUser.email) {
                    detailsEmail.textContent = this.currentUser.email;
                    detailsEmail.style.display = 'block';
                } else {
                    detailsEmail.style.display = 'none';
                }
            }
            
            detailsSection.style.display = 'block';
        }

        // Activer le bouton de connexion
        const loginBtn = document.getElementById('simple-login-btn');
        if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.innerHTML = `
                <i class="fas fa-sign-in-alt mr-2"></i>
                Se connecter en tant que ${this.currentUser.prenom}
            `;
            
            // Ajouter des styles pour s'assurer que les clics fonctionnent
            loginBtn.style.pointerEvents = 'auto';
            loginBtn.style.cursor = 'pointer';

        }

        this.hideError();
    }

    clearSelection() {
        this.currentUser = null;

        // Cacher l'avatar sélectionné et montrer l'icône par défaut
        const selectedAvatar = document.getElementById('selected-user-avatar');
        const defaultIcon = document.getElementById('default-user-icon');
        
        if (selectedAvatar && defaultIcon) {
            selectedAvatar.style.display = 'none';
            defaultIcon.style.display = 'block';
        }

        // Cacher les détails utilisateur
        const detailsSection = document.getElementById('selected-user-details');
        if (detailsSection) {
            detailsSection.style.display = 'none';
        }

        // Réinitialiser le bouton
        this.resetLoginButton();
    }

    resetLoginButton() {
        const loginBtn = document.getElementById('simple-login-btn');
        if (loginBtn) {
            loginBtn.disabled = true;
            loginBtn.innerHTML = `
                <i class="fas fa-sign-in-alt mr-2"></i>
                <span>Se connecter</span>
            `;
            loginBtn.style.pointerEvents = 'none';
            loginBtn.style.cursor = 'not-allowed';
        }
    }

    performLogin() {
        if (!this.currentUser) {
            this.showError('Veuillez sélectionner un utilisateur');
            return;
        }

        try {
            // Sauvegarder la session
            const sessionData = {
                userId: this.currentUser.id,
                userName: this.currentUser.fullName,
                loginTime: Date.now(),
                userDetails: this.currentUser
            };

            localStorage.setItem('auth_session', JSON.stringify(sessionData));
            localStorage.setItem('current_user', this.currentUser.fullName);
            localStorage.setItem('authenticated', 'true');
            localStorage.setItem('login_time', Date.now().toString());

            // Afficher l'application
            this.showApp();
            
            // Solution temporaire : vérifier si la transition a fonctionné
            setTimeout(() => {
                const loginScreen = document.getElementById('simple-login-screen');
                const app = document.getElementById('app');
                
                if (loginScreen && loginScreen.style.display !== 'none') {
    
                    window.location.reload();
                }
            }, 3000);

        } catch (error) {
            console.error('[NEW-AUTH] Erreur lors de la connexion:', error);
            this.showError('Erreur lors de la connexion. Veuillez réessayer.');
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('simple-login-error');
        const errorText = document.getElementById('simple-login-error-text');
        
        if (errorDiv && errorText) {
            errorText.textContent = message;
            errorDiv.classList.remove('hidden');
            
            // Masquer automatiquement après 5 secondes
            setTimeout(() => this.hideError(), 5000);
        }
    }

    hideError() {
        const errorDiv = document.getElementById('simple-login-error');
        if (errorDiv) {
            errorDiv.classList.add('hidden');
        }
    }

    logConnection() {
        if (window.logger && this.currentUser) {
            const loginDetails = `Connexion de ${this.currentUser.fullName} (${this.currentUser.poste} - ${this.currentUser.equipe})`;
            window.logger.logAction('LOGIN', '', '', null, {
                user_id: this.currentUser.id,
                user_name: this.currentUser.fullName,
                user_email: this.currentUser.email,
                user_poste: this.currentUser.poste,
                user_equipe: this.currentUser.equipe,
                login_method: 'simple_user_selection'
            }, loginDetails);
        }
    }

    logout() {
        if (confirm(`Voulez-vous vraiment vous déconnecter${this.currentUser ? ` (${this.currentUser.prenom})` : ''} ?`)) {
            // Logger la déconnexion
            if (window.logger && this.currentUser) {
                const logoutDetails = `Déconnexion de ${this.currentUser.fullName}`;
                window.logger.logAction('LOGOUT', '', '', {
                    user_id: this.currentUser.id,
                    user_name: this.currentUser.fullName,
                    session_duration: Date.now() - (JSON.parse(localStorage.getItem('auth_session') || '{}').loginTime || 0)
                }, null, logoutDetails);
            }

            // Nettoyer la session
            localStorage.removeItem('auth_session');
            localStorage.removeItem('current_user');
            localStorage.removeItem('authenticated');
            localStorage.removeItem('login_time');

            this.currentUser = null;
            this.isLoggedIn = false;

            console.log('[NEW-AUTH] Déconnexion effectuée');
            this.showLogin();
        }
    }

    // Méthodes pour la compatibilité avec l'ancien système
    getCurrentUser() {
        return this.currentUser ? this.currentUser.fullName : 'Utilisateur Non Connecté';
    }

    getCurrentUserData() {
        return this.currentUser || {
            id: 'unknown',
            fullName: 'Non connecté',
            nom: 'Non connecté',
            prenom: '',
            poste: 'Non défini',
            equipe: 'Non définie',
            email: ''
        };
    }

    isAuthenticated() {
        return this.isLoggedIn && this.currentUser !== null;
    }

    getSessionInfo() {
        const sessionData = localStorage.getItem('auth_session');
        if (!sessionData) return null;

        try {
            const session = JSON.parse(sessionData);
            return {
                connected: this.isLoggedIn,
                loginTime: session.loginTime,
                user: this.currentUser,
                sessionAge: Date.now() - session.loginTime
            };
        } catch (error) {
            return null;
        }
    }

    // Alias pour la compatibilité avec menu.js
    handleLogout() {
        return this.logout();
    }
}

// Initialisation du nouveau système
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Nettoyer l'ancien système s'il existe
        if (window.auth) {
            console.log('[NEW-AUTH] Remplacement de l\'ancien système d\'authentification...');
        }

        // Attendre un peu que la page se stabilise
        setTimeout(() => {
            // Créer le nouveau système
            window.auth = new SimpleAuthSystem();
        }, 200);
        
        // Fonction d'urgence pour forcer la connexion (développement)
        window.forceLogin = (userId = null) => {
            if (userId && window.auth.users.find(u => u.id === userId)) {
                const user = window.auth.users.find(u => u.id === userId);
                window.auth.currentUser = user;
                window.auth.isLoggedIn = true;
                
                const sessionData = {
                    userId: user.id,
                    userName: user.fullName,
                    loginTime: Date.now(),
                    userDetails: user
                };
                localStorage.setItem('auth_session', JSON.stringify(sessionData));
                localStorage.setItem('current_user', user.fullName);
                localStorage.setItem('authenticated', 'true');
                
                window.auth.showApp();
                console.log(`[NEW-AUTH] Connexion forcée pour: ${user.fullName}`);
            } else {
                console.log('[NEW-AUTH] Utilisateurs disponibles:', window.auth.users.map(u => `${u.id}: ${u.fullName}`));
            }
        };


        console.log('[INFO] Fonctions disponibles:');
        console.log('  - auth.logout() - Se déconnecter');
        console.log('  - auth.getCurrentUser() - Utilisateur actuel');
        console.log('  - forceLogin("user-id") - Connexion forcée (dev)');
        
    } catch (error) {
        console.error('[NEW-AUTH] Erreur d\'initialisation:', error);
    }
});