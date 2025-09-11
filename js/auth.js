/**
 * Système d'Authentification Simple
 * Gestion des Accès et Licences - Version 2024
 */

class AuthManager {
    constructor() {
        this.PASSWORD = 'admin123';
        this.currentStep = 1; // 1=password, 2=captcha, 3=user
        this.captchaAnswer = 0;
        this.users = [];
        this.selectedUser = null;
        
        this.init();
    }

    init() {
        console.log('[AUTH] Initialisation du système d\'authentification');
        
        // Vérifier si déjà connecté
        if (this.isLoggedIn()) {
            this.showApp();
            return;
        }
        
        // Afficher l'écran de connexion
        this.showLogin();
        this.setupEvents();
        this.loadUsers();
    }

    isLoggedIn() {
        const auth = localStorage.getItem('authenticated');
        const loginTime = localStorage.getItem('login_time');
        
        if (auth === 'true' && loginTime) {
            const now = Date.now();
            const elapsed = now - parseInt(loginTime);
            // Session de 8 heures
            return elapsed < 8 * 60 * 60 * 1000;
        }
        
        return false;
    }

    showLogin() {
        document.getElementById('login-screen').style.display = 'flex';
        document.getElementById('app').style.display = 'none';
        this.resetForm();
    }

    showApp() {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        
        // Initialiser l'app si nécessaire
        if (window.app && typeof window.app.init === 'function') {
            window.app.init();
        }
    }

    resetForm() {
        this.currentStep = 1;
        
        // Réinitialiser tous les champs
        document.getElementById('password').value = '';
        document.getElementById('captcha-input').value = '';
        document.getElementById('user-select').value = '';
        
        // Masquer toutes les sections
        document.getElementById('captcha-section').classList.add('hidden');
        document.getElementById('user-identification').classList.add('hidden');
        
        // Afficher seulement le mot de passe
        document.getElementById('password').parentElement.parentElement.style.display = 'block';
        
        // Réinitialiser le bouton
        this.updateButton();
        this.hideError();
        
        // Focus sur le mot de passe
        document.getElementById('password').focus();
    }

    setupEvents() {
        // Bouton principal
        const loginBtn = document.getElementById('login-btn');
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Formulaire
        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Touche Entrée sur les champs
        document.getElementById('password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleSubmit();
            }
        });

        document.getElementById('captcha-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleSubmit();
            }
        });

        document.getElementById('user-select').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleSubmit();
            }
        });
    }

    handleSubmit() {
        console.log('[AUTH] Étape:', this.currentStep);
        
        switch (this.currentStep) {
            case 1:
                this.checkPassword();
                break;
            case 2:
                this.checkCaptcha();
                break;
            case 3:
                this.checkUser();
                break;
        }
    }

    checkPassword() {
        const password = document.getElementById('password').value;
        
        if (!password) {
            this.showError('Veuillez saisir le mot de passe.');
            return;
        }

        this.setLoading(true);

        setTimeout(() => {
            if (password === this.PASSWORD) {
                this.goToStep2();
            } else {
                this.showError('Mot de passe incorrect.');
                document.getElementById('password').value = '';
                document.getElementById('password').focus();
            }
            this.setLoading(false);
        }, 500);
    }

    goToStep2() {
        this.currentStep = 2;
        
        // Masquer le mot de passe
        document.getElementById('password').parentElement.parentElement.style.display = 'none';
        
        // Afficher le captcha
        document.getElementById('captcha-section').classList.remove('hidden');
        
        // Générer une question
        this.generateCaptcha();
        
        // Mettre à jour le bouton
        this.updateButton();
        
        // Focus sur le captcha
        document.getElementById('captcha-input').focus();
        
        this.hideError();
    }

    generateCaptcha() {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        this.captchaAnswer = a + b;
        
        document.getElementById('captcha-question').textContent = `${a} + ${b}`;
    }

    checkCaptcha() {
        const answer = parseInt(document.getElementById('captcha-input').value);
        
        if (isNaN(answer)) {
            this.showError('Veuillez entrer un nombre.');
            return;
        }

        if (answer === this.captchaAnswer) {
            this.goToStep3();
        } else {
            this.showError('Réponse incorrecte. Nouvelle question générée.');
            this.generateCaptcha();
            document.getElementById('captcha-input').value = '';
            document.getElementById('captcha-input').focus();
        }
    }

    goToStep3() {
        this.currentStep = 3;
        
        // Masquer le captcha
        document.getElementById('captcha-section').classList.add('hidden');
        
        // Afficher la sélection utilisateur
        document.getElementById('user-identification').classList.remove('hidden');
        
        // Populer la liste
        this.populateUsers();
        
        // Mettre à jour le bouton
        this.updateButton();
        
        // Focus sur le select
        document.getElementById('user-select').focus();
        
        this.hideError();
    }

    async loadUsers() {
        try {
            if (window.D1API) {
                const result = await window.D1API.get('utilisateurs');
                if (result.success && result.data) {
                    this.users = result.data.filter(user => !user.archived);
                } else {
                    throw new Error('Pas de données utilisateurs');
                }
            } else {
                throw new Error('API non disponible');
            }
        } catch (error) {
            console.warn('[AUTH] Utilisation des utilisateurs par défaut:', error.message);
            // Utilisateurs par défaut
            this.users = [
                { id: '1', nom: 'Admin', prenom: 'Système' },
                { id: '2', nom: 'Manager', prenom: 'Équipe' },
                { id: '3', nom: 'User', prenom: 'Standard' }
            ];
        }
    }

    populateUsers() {
        const select = document.getElementById('user-select');
        select.innerHTML = '<option value="">Sélectionnez votre nom</option>';
        
        // Trier par nom complet
        const sortedUsers = [...this.users].sort((a, b) => {
            const nameA = `${a.prenom} ${a.nom}`.toLowerCase();
            const nameB = `${b.prenom} ${b.nom}`.toLowerCase();
            return nameA.localeCompare(nameB);
        });

        sortedUsers.forEach(user => {
            const option = document.createElement('option');
            const fullName = `${user.prenom} ${user.nom}`;
            option.value = fullName;
            option.textContent = fullName;
            select.appendChild(option);
        });
        
        console.log('[AUTH] Utilisateurs chargés:', sortedUsers.length);
    }

    checkUser() {
        const selectedUser = document.getElementById('user-select').value;
        
        if (!selectedUser) {
            this.showError('Veuillez sélectionner un utilisateur.');
            return;
        }

        this.selectedUser = selectedUser;
        this.login();
    }

    login() {
        console.log('[AUTH] Connexion pour:', this.selectedUser);
        
        // Enregistrer la session
        localStorage.setItem('authenticated', 'true');
        localStorage.setItem('login_time', Date.now().toString());
        localStorage.setItem('current_user', this.selectedUser);
        
        // Afficher l'application
        this.showApp();
        
        // Log de connexion
        if (window.logger && typeof window.logger.logLogin === 'function') {
            window.logger.logLogin();
        }
        
        console.log('[AUTH] Connexion réussie !');
    }

    logout() {
        if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
            localStorage.removeItem('authenticated');
            localStorage.removeItem('login_time');
            localStorage.removeItem('current_user');
            
            this.showLogin();
            console.log('[AUTH] Déconnexion réussie');
        }
    }

    updateButton() {
        const btn = document.getElementById('login-btn');
        const btnText = document.getElementById('login-btn-text');
        const btnIcon = btn.querySelector('i');
        
        switch (this.currentStep) {
            case 1:
                btnText.textContent = 'Continuer';
                btnIcon.className = 'fas fa-arrow-right mr-2';
                break;
            case 2:
                btnText.textContent = 'Vérifier';
                btnIcon.className = 'fas fa-check mr-2';
                break;
            case 3:
                btnText.textContent = 'Se connecter';
                btnIcon.className = 'fas fa-sign-in-alt mr-2';
                break;
        }
    }

    setLoading(loading) {
        const btn = document.getElementById('login-btn');
        const btnText = document.getElementById('login-btn-text');
        const btnIcon = btn.querySelector('i');
        
        btn.disabled = loading;
        
        if (loading) {
            btnIcon.className = 'fas fa-spinner fa-spin mr-2';
            btnText.textContent = 'Chargement...';
        } else {
            this.updateButton();
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('error-message');
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        
        // Masquer après 5 secondes
        setTimeout(() => {
            this.hideError();
        }, 5000);
    }

    hideError() {
        document.getElementById('error-message').classList.add('hidden');
    }

    // Méthode pour changer le mot de passe (console)
    changePassword(newPassword) {
        if (typeof newPassword !== 'string' || newPassword.length < 3) {
            console.error('[AUTH] Le mot de passe doit contenir au moins 3 caractères');
            return false;
        }
        
        this.PASSWORD = newPassword;
        console.log('[AUTH] Mot de passe mis à jour');
        return true;
    }

    // Informations de session
    getSessionInfo() {
        return {
            authenticated: this.isLoggedIn(),
            user: localStorage.getItem('current_user'),
            loginTime: localStorage.getItem('login_time'),
            currentStep: this.currentStep
        };
    }

    // Méthode pour la compatibilité avec logger.js
    getCurrentUser() {
        return localStorage.getItem('current_user') || 'Utilisateur inconnu';
    }

    // Alias pour la compatibilité avec menu.js
    handleLogout() {
        return this.logout();
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.auth = new AuthManager();
        
        // Fonctions globales utiles
        window.forceLogin = () => {
            if (window.auth) {
                localStorage.setItem('authenticated', 'true');
                localStorage.setItem('login_time', Date.now().toString());
                localStorage.setItem('current_user', 'Utilisateur Test');
                window.auth.showApp();
                console.log('[AUTH] Connexion forcée activée');
            }
        };
        
        console.log('[AUTH] Système d\'authentification initialisé');
        console.log('[INFO] Fonctions disponibles:');
        console.log('  - auth.changePassword("nouveau_mdp")');
        console.log('  - auth.getSessionInfo()');
        console.log('  - auth.logout()');
        console.log('  - forceLogin() [urgence]');
        
    } catch (error) {
        console.error('[AUTH] Erreur d\'initialisation:', error);
    }
});