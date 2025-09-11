/**
 * Systeme d'authentification symbolique
 * ATTENTION : Ce systeme n'est PAS securise !
 * Le mot de passe est visible dans le code source.
 * A utiliser uniquement pour une protection basique.
 */

class SimpleAuth {
    constructor() {
        // ATTENTION : Mot de passe visible dans le code !
        this.PASSWORD = 'Celesty2025!'; // Changez ce mot de passe selon vos besoins
        
        this.loginScreen = document.getElementById('login-screen');
        this.app = document.getElementById('app');
        this.loginForm = document.getElementById('login-form');
        this.passwordInput = document.getElementById('password');
        this.captchaSection = document.getElementById('captcha-section');
        this.captchaQuestion = document.getElementById('captcha-question');
        this.captchaInput = document.getElementById('captcha-input');
        this.userSelect = document.getElementById('user-select');
        this.userIdentification = document.getElementById('user-identification');
        this.errorMessage = document.getElementById('error-message');
        this.loginBtn = document.getElementById('login-btn');
        this.loginBtnText = document.getElementById('login-btn-text');
        
        // États de connexion
        this.currentUser = null;
        this.isPasswordValidated = false;
        this.isCaptchaValidated = false;
        this.users = []; // Cache des utilisateurs
        this.captchaAnswer = null; // Réponse attendue du captcha
        
        // Note: Le bouton de déconnexion est maintenant géré par MenuManager
        
        this.init();
    }
    
    init() {
        // Vérifier si l'utilisateur est déjà connecté (session)
        if (this.isLoggedIn()) {
            this.showApp();
        } else {
            this.showLogin();
        }
        
        // Pré-charger les utilisateurs en arrière-plan pour une meilleure UX
        this.preloadUsers();
        
        // Événements
        this.setupEventListeners();
    }
    
    /**
     * Pré-charger les utilisateurs en arrière-plan
     */
    async preloadUsers() {
        try {
            await this.loadUsers();
        } catch (error) {
            // Échec silencieux du pré-chargement, on chargera lors de la connexion
            console.warn('[WARN] Pre-chargement des utilisateurs echoue, chargement differe');
        }
    }
    
    setupEventListeners() {
        console.log('[AUTH] Setup event listeners - debut');
        console.log('[AUTH] Elements disponibles:', {
            loginBtn: !!this.loginBtn,
            loginBtnId: this.loginBtn?.id,
            loginForm: !!this.loginForm,
            passwordInput: !!this.passwordInput
        });
        
        // Gestionnaire principal sur le bouton de connexion
        if (this.loginBtn) {
            console.log('[AUTH] Ajout event listener sur bouton:', this.loginBtn);
            this.loginBtn.addEventListener('click', (e) => {
                console.log('[BOUTON] === CLIC DETECTE === Étape:', {
                    isPasswordValidated: this.isPasswordValidated,
                    isCaptchaValidated: this.isCaptchaValidated,
                    userSelected: !!this.userSelect?.value
                });
                console.log('[DEBUG] Type evenement:', e.type);
                console.log('[DEBUG] Element clique:', e.target);
                console.log('[DEBUG] Current target:', e.currentTarget);
                e.preventDefault();
                e.stopPropagation();
                this.handleLogin();
            });
            console.log('[AUTH] Event listener bouton ajoute avec succes');
        } else {
            console.error('[AUTH] ERREUR: Bouton de connexion non trouve dans setupEventListeners!');
            // Essayer de le trouver à nouveau
            const btnById = document.getElementById('login-btn');
            console.log('[AUTH] Recherche par ID:', btnById);
        }
        
        // Formulaire de connexion (backup)
        if (this.loginForm) {
            console.log('[AUTH] Ajout event listener sur formulaire');
            this.loginForm.addEventListener('submit', (e) => {
                console.log('[FORM] === SUBMIT DETECTE ===');
                e.preventDefault();
                e.stopPropagation();
                this.handleLogin();
            });
            console.log('[AUTH] Event listener formulaire ajoute avec succes');
        } else {
            console.error('[AUTH] ERREUR: Formulaire de connexion non trouve!');
        }
        
        // Note: La gestion de la déconnexion est maintenant dans MenuManager
        
        // Entrée sur le champ mot de passe
        if (this.passwordInput) {
            this.passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleLogin();
                }
            });
        }
        
        // Entrée sur le champ captcha
        if (this.captchaInput) {
            this.captchaInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleLogin();
                }
            });
        }
        
        // Masquer le message d'erreur quand l'utilisateur tape
        if (this.passwordInput) {
            this.passwordInput.addEventListener('input', () => {
                this.hideError();
            });
        }
        
        if (this.captchaInput) {
            this.captchaInput.addEventListener('input', () => {
                this.hideError();
            });
        }
    }
    
    handleLogin() {
        console.log('[LOGIN] === HANDLELOGIN APPELÉ ===');
        console.log('[LOGIN] Etat actuel DÉTAILLÉ:', {
            isPasswordValidated: this.isPasswordValidated,
            isCaptchaValidated: this.isCaptchaValidated,
            hasSelectedUser: !!this.userSelect?.value,
            selectedUserValue: this.userSelect?.value,
            userSelectElement: this.userSelect,
            buttonDisabled: this.loginBtn?.disabled
        });
        
        // Test pour voir dans quelle branche on va
        if (!this.isPasswordValidated) {
            console.log('[LOGIN] >>> BRANCHE 1: Vérification mot de passe');
        } else if (!this.isCaptchaValidated) {
            console.log('[LOGIN] >>> BRANCHE 2: Vérification captcha');
        } else {
            console.log('[LOGIN] >>> BRANCHE 3: Sélection utilisateur - C\'EST ICI QUE ÇA DOIT MARCHER');
        }
        
        // Étape 1 : Vérification du mot de passe
        if (!this.isPasswordValidated) {
            const password = this.passwordInput.value;
            
            if (!password) {
                this.showError('Veuillez saisir un mot de passe.');
                return;
            }
            
            // Afficher l'état de chargement
            this.setLoading(true);
            
            // Simulation d'une vérification (délai pour l'UX)
            setTimeout(() => {
                if (password === this.PASSWORD) {
                    this.showCaptcha();
                } else {
                    this.showError('Mot de passe incorrect. Veuillez réessayer.');
                    this.setLoading(false);
                    this.passwordInput.value = '';
                    this.passwordInput.focus();
                }
            }, 500);
            
        // Étape 2 : Vérification du captcha
        } else if (!this.isCaptchaValidated) {
            const captchaValue = parseInt(this.captchaInput.value);
            
            if (isNaN(captchaValue)) {
                this.showError('Veuillez entrer un nombre valide.');
                return;
            }
            
            if (captchaValue === this.captchaAnswer) {
                this.showUserIdentification();
            } else {
                this.showError('Réponse incorrecte. Nouvelle question générée.');
                this.generateCaptcha(); // Générer une nouvelle question
                this.captchaInput.value = '';
                this.captchaInput.focus();
            }
            
        // Étape 3 : Sélection de l'utilisateur
        } else {
            console.log('[LOGIN] Étape 3 - Sélection utilisateur');
            console.log('[LOGIN] Element userSelect:', this.userSelect);
            console.log('[LOGIN] Valeur sélectionnée:', this.userSelect?.value);
            
            const selectedUser = this.userSelect.value;
            
            if (!selectedUser) {
                console.warn('[LOGIN] Aucun utilisateur sélectionné');
                this.showError('Veuillez sélectionner qui vous êtes.');
                return;
            }
            
            console.log('[LOGIN] Utilisateur sélectionné:', selectedUser);
            this.currentUser = selectedUser;
            this.login();
        }
    }

    showCaptcha() {
        this.isPasswordValidated = true;
        this.setLoading(false);
        this.hideError();
        
        // Masquer le champ mot de passe
        this.passwordInput.parentElement.parentElement.style.display = 'none';
        
        // Afficher le captcha
        this.captchaSection.classList.remove('hidden');
        
        // Générer une question de captcha
        this.generateCaptcha();
        
        // Changer le texte du bouton
        this.loginBtnText.textContent = 'Vérifier';
        this.loginBtn.querySelector('i').className = 'fas fa-check mr-2';
        
        // Mettre le focus sur le champ captcha
        this.captchaInput.focus();
        
        // Mettre à jour le texte d'instruction
        const instructionText = document.querySelector('#login-screen p');
        if (instructionText) {
            instructionText.textContent = 'Résolvez le calcul pour continuer';
        }
    }
    
    async showUserIdentification() {
        this.isCaptchaValidated = true;
        this.setLoading(false);
        this.hideError();
        
        // Charger les utilisateurs depuis la base de données
        await this.loadUsers();
        
        // Masquer le captcha
        this.captchaSection.style.display = 'none';
        
        // Afficher la sélection utilisateur
        this.userIdentification.classList.remove('hidden');
        
        // Changer le texte du bouton
        this.loginBtnText.textContent = 'Se connecter';
        this.loginBtn.querySelector('i').className = 'fas fa-sign-in-alt mr-2';
        
        // S'assurer que le bouton est activé
        this.loginBtn.disabled = false;
        console.log('[UI] Bouton configuré pour étape 3 - Texte:', this.loginBtnText.textContent, 'Disabled:', this.loginBtn.disabled);
        
        // RE-ATTACHER L'EVENT LISTENER au cas où il aurait été perdu
        this.reattachButtonListener();
        
        // Mettre le focus sur le select
        this.userSelect.focus();
        
        // Mettre à jour le texte d'instruction
        const instructionText = document.querySelector('#login-screen p');
        if (instructionText) {
            instructionText.textContent = 'Sélectionnez votre nom pour vous connecter';
        }
        
        // TEMPORAIRE: Ajouter un bouton de debug pour forcer la connexion
        this.addDebugButton();
    }
    
    login() {
        console.log('[LOGIN] 🚀 FONCTION LOGIN() APPELÉE ! Utilisateur:', this.currentUser);
        
        // Marquer comme connecté et enregistrer l'utilisateur identifié
        localStorage.setItem('authenticated', 'true');
        localStorage.setItem('login_time', Date.now().toString());
        localStorage.setItem('current_user', this.currentUser);
        
        this.showApp();
        this.setLoading(false);
        
        // Enregistrer la connexion dans les logs avec l'utilisateur identifié
        if (window.logger) {
            window.logger.logLogin();
        }
        
        // Message de bienvenue avec le nom de l'utilisateur
        console.log(`[SUCCESS] Connexion reussie ! Bienvenue ${this.currentUser}`);
    }
    
    handleLogout() {
        // Confirmation de déconnexion
        if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            this.logout();
        }
    }
    
    logout() {
        // Enregistrer la déconnexion dans les logs avant de supprimer la session
        if (window.logger) {
            window.logger.logLogout();
        }
        
        // Supprimer les données de session
        localStorage.removeItem('authenticated');
        localStorage.removeItem('login_time');
        localStorage.removeItem('current_user');
        
        // Réinitialiser l'état d'authentification
        this.currentUser = null;
        this.isPasswordValidated = false;
        this.isCaptchaValidated = false;
        this.captchaAnswer = null;
        
        this.showLogin();
        
        // Réinitialiser le formulaire complètement
        if (this.passwordInput) {
            this.passwordInput.value = '';
            this.passwordInput.parentElement.parentElement.style.display = 'block';
        }
        if (this.captchaSection) {
            this.captchaSection.classList.add('hidden');
            this.captchaInput.value = '';
        }
        if (this.userIdentification) {
            this.userIdentification.classList.add('hidden');
        }
        if (this.userSelect) {
            this.userSelect.value = '';
        }
        // Remettre le bouton à son état initial
        if (this.loginBtn) {
            this.loginBtnText.textContent = 'Se connecter';
            this.loginBtn.querySelector('i').className = 'fas fa-sign-in-alt mr-2';
        }
        // Remettre le texte d'instruction initial
        const instructionText = document.querySelector('#login-screen p');
        if (instructionText) {
            instructionText.textContent = 'Saisissez le mot de passe pour acceder a l\'application';
        }
        
        this.hideError();
        
        console.log('[LOGOUT] Deconnexion reussie !');
    }
    
    isLoggedIn() {
        const authenticated = localStorage.getItem('authenticated');
        const loginTime = localStorage.getItem('login_time');
        const currentUser = localStorage.getItem('current_user');
        
        if (!authenticated || !loginTime || !currentUser) {
            return false;
        }
        
        // Restaurer l'utilisateur depuis le localStorage
        if (!this.currentUser) {
            this.currentUser = currentUser;
        }
        
        // Vérifier si la session n'est pas expirée (24h)
        const sessionDuration = 24 * 60 * 60 * 1000; // 24 heures
        const now = Date.now();
        const loginTimestamp = parseInt(loginTime);
        
        if (now - loginTimestamp > sessionDuration) {
            // Session expirée
            this.logout();
            return false;
        }
        
        return true;
    }
    
    showLogin() {
        if (this.loginScreen) {
            this.loginScreen.style.display = 'flex';
        }
        if (this.app) {
            this.app.style.display = 'none';
        }
        
        // Focus sur le champ mot de passe
        setTimeout(() => {
            if (this.passwordInput) {
                this.passwordInput.focus();
            }
        }, 100);
    }
    
    showApp() {
        if (this.loginScreen) {
            this.loginScreen.style.display = 'none';
        }
        if (this.app) {
            this.app.style.display = 'block';
        }
    }
    
    showError(message) {
        if (this.errorMessage) {
            this.errorMessage.textContent = message;
            this.errorMessage.classList.remove('hidden');
        }
    }
    
    hideError() {
        if (this.errorMessage) {
            this.errorMessage.classList.add('hidden');
        }
    }
    
    setLoading(loading) {
        if (this.loginBtn && this.loginBtnText) {
            this.loginBtn.disabled = loading;
            
            if (loading) {
                this.loginBtn.querySelector('i').className = 'fas fa-spinner fa-spin mr-2';
                this.loginBtnText.textContent = 'Connexion...';
            } else {
                this.loginBtn.querySelector('i').className = 'fas fa-sign-in-alt mr-2';
                this.loginBtnText.textContent = 'Se connecter';
            }
            
            console.log('[UI] setLoading:', loading, '- Bouton disabled:', this.loginBtn.disabled);
        } else {
            console.error('[ERROR] setLoading - Éléments bouton non trouvés:', {
                loginBtn: !!this.loginBtn,
                loginBtnText: !!this.loginBtnText
            });
        }
    }
    
    // Méthode pour changer le mot de passe depuis la console
    // Usage: window.auth.changePassword('nouveau_mot_de_passe')
    changePassword(newPassword) {
        if (typeof newPassword !== 'string' || newPassword.length < 3) {
            console.error('[ERROR] Le mot de passe doit contenir au moins 3 caracteres');
            return false;
        }
        
        this.PASSWORD = newPassword;
        console.log('[SUCCESS] Mot de passe change avec succes !');
        console.log('[WARNING] Attention : Le nouveau mot de passe est toujours visible dans le code source');
        return true;
    }
    
    // Informations sur la session
    getSessionInfo() {
        const loginTime = localStorage.getItem('login_time');
        const currentUser = localStorage.getItem('current_user');
        if (loginTime) {
            const date = new Date(parseInt(loginTime));
            return {
                connected: this.isLoggedIn(),
                loginTime: date.toLocaleString('fr-FR'),
                sessionDuration: Math.round((Date.now() - parseInt(loginTime)) / (1000 * 60)) + ' minutes',
                currentUser: currentUser || this.currentUser || 'Utilisateur inconnu'
            };
        }
        return { connected: false, currentUser: null };
    }
    
    // Méthode pour obtenir l'utilisateur actuel
    getCurrentUser() {
        return this.currentUser || localStorage.getItem('current_user') || null;
    }
    
    /**
     * Charger les utilisateurs depuis la base de données
     */
    async loadUsers() {
        try {
            console.log('[LOAD] Chargement des utilisateurs depuis la base de donnees...');
            
            // Récupérer tous les utilisateurs non archivés via Supabase API
            if (window.D1API) {
                const result = await window.D1API.get('utilisateurs', null, {limit: 100, sort: 'nom'});
                if (result.success) {
                    this.users = (result.data || []).filter(user => !user.archived);
                } else {
                    throw new Error(result.error || 'Erreur lors du chargement');
                }
            } else {
                throw new Error('API Supabase non disponible');
            }
            
            // Populer le select avec les utilisateurs
            this.populateUserSelect();
            
            console.log(`[SUCCESS] ${this.users.length} utilisateurs charges`);
            
        } catch (error) {
            console.error('[ERROR] Erreur lors du chargement des utilisateurs:', error);
            
            // Fallback vers les utilisateurs par défaut
            this.users = [
                { id: 'admin', nom: 'Système', prenom: 'Administrateur' },
                { id: 'manager', nom: 'Équipe', prenom: 'Manager' },
                { id: 'user', nom: 'Utilisateur', prenom: 'Standard' }
            ];
            this.populateUserSelect();
            
            this.showError('Impossible de charger les utilisateurs. Utilisation de la liste par défaut.');
        }
    }
    
    /**
     * Populer le select avec la liste des utilisateurs
     */
    populateUserSelect() {
        // Vérifier que l'élément existe
        if (!this.userSelect) {
            console.error('[ERROR] Element user-select non trouvé lors de la population');
            this.userSelect = document.getElementById('user-select');
            if (!this.userSelect) {
                console.error('[CRITICAL] Impossible de trouver l\'élément user-select dans le DOM');
                return;
            }
        }
        
        console.log('[UI] Population du select utilisateurs, element trouvé:', this.userSelect);
        
        // Vider le select (garder seulement l'option par défaut)
        this.userSelect.innerHTML = '<option value="">Sélectionnez votre nom</option>';
        
        // Trier les utilisateurs par ordre alphabétique (prenom + nom)
        const sortedUsers = [...this.users].sort((a, b) => {
            const fullNameA = `${a.prenom} ${a.nom}`.trim().toLowerCase();
            const fullNameB = `${b.prenom} ${b.nom}`.trim().toLowerCase();
            return fullNameA.localeCompare(fullNameB, 'fr', { sensitivity: 'base' });
        });
        
        // Ajouter chaque utilisateur
        sortedUsers.forEach(user => {
            const option = document.createElement('option');
            const fullName = `${user.prenom} ${user.nom}`.trim();
            
            option.value = fullName;
            option.textContent = fullName;
            
            // Ajouter des informations supplémentaires si disponibles
            if (user.poste) {
                option.textContent += ` (${user.poste})`;
            }
            
            this.userSelect.appendChild(option);
        });
        
        console.log(`[UI] ${this.users.length} utilisateurs ajoutes au formulaire (tries alphabetiquement)`);
        
        // Afficher la liste des utilisateurs chargés (pour debug)
        const sortedNames = sortedUsers.map(u => `${u.prenom} ${u.nom}`.trim());
        console.log('[UI] Utilisateurs disponibles (ordre alphabetique):', sortedNames);
    }
    
    /**
     * TEMPORAIRE: Ajouter un bouton de debug pour forcer la connexion
     */
    addDebugButton() {
        // Éviter de créer plusieurs boutons
        if (document.getElementById('debug-login-btn')) return;
        
        const debugBtn = document.createElement('button');
        debugBtn.id = 'debug-login-btn';
        debugBtn.textContent = '🔧 FORCER LA CONNEXION (DEBUG)';
        debugBtn.className = 'w-full mt-4 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors';
        debugBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('[DEBUG] 🔧 BOUTON DEBUG CLIQUÉ - Forcer la connexion');
            if (this.userSelect.value) {
                this.currentUser = this.userSelect.value;
                this.login();
            } else {
                alert('Sélectionnez d\'abord un utilisateur !');
            }
        });
        
        // Insérer le bouton après le bouton principal
        this.loginBtn.parentNode.insertBefore(debugBtn, this.loginBtn.nextSibling);
        console.log('[DEBUG] Bouton de debug ajouté');
    }

    /**
     * Re-attacher l'event listener du bouton (au cas où il serait perdu)
     */
    reattachButtonListener() {
        if (this.loginBtn) {
            // Supprimer tous les event listeners existants en clonant l'élément
            const newBtn = this.loginBtn.cloneNode(true);
            this.loginBtn.parentNode.replaceChild(newBtn, this.loginBtn);
            this.loginBtn = newBtn;
            
            // Re-attacher l'event listener
            this.loginBtn.addEventListener('click', (e) => {
                console.log('[BOUTON] ⚡ NOUVEAU CLIC DETECTÉ - Forcement fonctionnel !');
                e.preventDefault();
                e.stopPropagation();
                this.handleLogin();
            });
            
            console.log('[FIX] Event listener ré-attaché au bouton');
        }
    }

    /**
     * Générer une question de captcha mathématique
     */
    generateCaptcha() {
        // Générer deux nombres aléatoirement
        const num1 = Math.floor(Math.random() * 10) + 1; // 1-10
        const num2 = Math.floor(Math.random() * 10) + 1; // 1-10
        const operations = ['+', '-', '×'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        
        let question, answer;
        
        switch (operation) {
            case '+':
                question = `${num1} + ${num2}`;
                answer = num1 + num2;
                break;
            case '-':
                // S'assurer que le résultat est positif
                const bigger = Math.max(num1, num2);
                const smaller = Math.min(num1, num2);
                question = `${bigger} - ${smaller}`;
                answer = bigger - smaller;
                break;
            case '×':
                // Utiliser des nombres plus petits pour la multiplication
                const smallNum1 = Math.floor(Math.random() * 5) + 1; // 1-5
                const smallNum2 = Math.floor(Math.random() * 5) + 1; // 1-5
                question = `${smallNum1} × ${smallNum2}`;
                answer = smallNum1 * smallNum2;
                break;
        }
        
        // Afficher la question et stocker la réponse
        this.captchaQuestion.textContent = question;
        this.captchaAnswer = answer;
        
        console.log(`[CAPTCHA] Captcha genere: ${question} = ${answer}`); // Pour debug (a supprimer en production)
    }
}

// Initialiser l'authentification au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.auth = new SimpleAuth();
        console.log('[AUTH] Systeme d\'authentification initialise');
        console.log('[INFO] Commandes disponibles dans la console :');
        console.log('   - auth.changePassword("nouveau_mdp") : Changer le mot de passe');
        console.log('   - auth.getSessionInfo() : Informations sur la session');
        console.log('   - auth.logout() : Se déconnecter');
        console.log('[WARNING] ATTENTION : Ce systeme n\'est PAS securise !');
    } catch (error) {
        console.error('[ERROR] Erreur lors de l\'initialisation de l\'authentification:', error);
    }
});

// Gestion des erreurs globales
window.addEventListener('error', (e) => {
    console.error('Erreur d\'authentification:', e.error);
});