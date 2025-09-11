// Système d'authentification avec mot de passe et captcha
class AuthSecurity {
    constructor() {
        this.password = 'Celesty2025!';
        this.captchaCode = '';
        this.maxAttempts = 3;
        this.attempts = 0;
        this.isLocked = false;
        this.lockoutTime = 5 * 60 * 1000; // 5 minutes en millisecondes
        
        this.init();
    }

    init() {
        // Générer le premier captcha
        this.generateCaptcha();
        
        // Vérifier si l'utilisateur est déjà verrouillé
        this.checkLockout();
        
        // Configurer les événements
        this.setupEventListeners();
    }

    setupEventListeners() {
        const loginForm = document.getElementById('login-form');
        const refreshCaptcha = document.getElementById('refresh-captcha');
        const passwordInput = document.getElementById('password');
        const captchaInput = document.getElementById('captcha-input');

        // Soumission du formulaire
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Actualiser le captcha
        refreshCaptcha.addEventListener('click', () => {
            this.generateCaptcha();
            captchaInput.value = '';
        });

        // Validation en temps réel
        passwordInput.addEventListener('input', () => {
            this.clearError();
        });

        captchaInput.addEventListener('input', () => {
            this.clearError();
        });

        // Empêcher le copier-coller sur le captcha
        captchaInput.addEventListener('paste', (e) => {
            e.preventDefault();
            this.showError('Le copier-coller n\'est pas autorisé pour le calcul');
        });
    }

    generateCaptcha() {
        // Générer un captcha avec calcul mathématique
        const operations = ['+', '-', '*'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        
        let num1, num2, result;
        
        switch (operation) {
            case '+':
                num1 = Math.floor(Math.random() * 20) + 1; // 1-20
                num2 = Math.floor(Math.random() * 20) + 1; // 1-20
                result = num1 + num2;
                break;
            case '-':
                num1 = Math.floor(Math.random() * 20) + 10; // 10-29
                num2 = Math.floor(Math.random() * 10) + 1;  // 1-10
                result = num1 - num2;
                break;
            case '*':
                num1 = Math.floor(Math.random() * 9) + 2;  // 2-10
                num2 = Math.floor(Math.random() * 9) + 2;  // 2-10
                result = num1 * num2;
                break;
        }
        
        this.captchaCode = result.toString();
        const question = `${num1} ${operation} ${num2} = ?`;
        document.getElementById('captcha-text').textContent = question;
        
        console.log('🔐 Nouveau captcha généré:', question, '| Réponse:', result); // Pour debug uniquement
    }

    handleLogin() {
        if (this.isLocked) {
            this.showError('Accès temporairement bloqué. Veuillez patienter.');
            return;
        }

        const passwordInput = document.getElementById('password');
        const captchaInput = document.getElementById('captcha-input');
        
        const enteredPassword = passwordInput.value;
        const enteredCaptcha = captchaInput.value.trim();

        // Validation du mot de passe
        if (enteredPassword !== this.password) {
            this.handleFailedAttempt('Mot de passe incorrect');
            return;
        }

        // Validation du captcha (réponse numérique)
        if (enteredCaptcha !== this.captchaCode) {
            this.handleFailedAttempt('Résultat du calcul incorrect');
            this.generateCaptcha(); // Régénérer le captcha en cas d'erreur
            captchaInput.value = '';
            return;
        }

        // Connexion réussie
        this.handleSuccessfulLogin();
    }

    handleFailedAttempt(message) {
        this.attempts++;
        
        if (this.attempts >= this.maxAttempts) {
            this.lockAccount();
            this.showError(`Trop de tentatives échouées. Accès bloqué pendant 5 minutes.`);
        } else {
            const remainingAttempts = this.maxAttempts - this.attempts;
            this.showError(`${message}. ${remainingAttempts} tentative(s) restante(s).`);
        }

        // Vider les champs en cas d'erreur
        document.getElementById('password').value = '';
        document.getElementById('captcha-input').value = '';
        this.generateCaptcha();
    }

    handleSuccessfulLogin() {
        // Réinitialiser les tentatives
        this.attempts = 0;
        localStorage.removeItem('lockoutTime');
        
        // Animation de succès
        this.showSuccess('Connexion réussie ! Redirection...');
        
        // Masquer l'écran de connexion et afficher l'application
        setTimeout(() => {
            document.getElementById('login-screen').style.display = 'none';
            document.getElementById('app').style.display = 'block';
            
            // L'application est déjà initialisée via DOMContentLoaded
            // Mais on peut déclencher un refresh des données si nécessaire
            if (window.app && typeof window.app.loadDashboard === 'function') {
                window.app.loadDashboard();
            }
        }, 1500);
    }

    lockAccount() {
        this.isLocked = true;
        const lockoutEndTime = Date.now() + this.lockoutTime;
        localStorage.setItem('lockoutTime', lockoutEndTime.toString());
        
        // Débloquer automatiquement après le délai
        setTimeout(() => {
            this.unlockAccount();
        }, this.lockoutTime);
    }

    unlockAccount() {
        this.isLocked = false;
        this.attempts = 0;
        localStorage.removeItem('lockoutTime');
        this.clearError();
        this.generateCaptcha();
    }

    checkLockout() {
        const lockoutTime = localStorage.getItem('lockoutTime');
        if (lockoutTime) {
            const lockoutEndTime = parseInt(lockoutTime);
            const currentTime = Date.now();
            
            if (currentTime < lockoutEndTime) {
                this.isLocked = true;
                const remainingTime = Math.ceil((lockoutEndTime - currentTime) / 1000 / 60);
                this.showError(`Accès bloqué. Déblocage dans ${remainingTime} minute(s).`);
                
                // Programmer le déblocage
                setTimeout(() => {
                    this.unlockAccount();
                }, lockoutEndTime - currentTime);
            } else {
                // Le verrouillage a expiré
                this.unlockAccount();
            }
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('login-error');
        const errorMessage = document.getElementById('login-error-message');
        
        errorMessage.textContent = message;
        errorDiv.classList.remove('hidden');
        
        // Animation d'entrée
        errorDiv.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            errorDiv.style.animation = '';
        }, 500);
    }

    showSuccess(message) {
        const errorDiv = document.getElementById('login-error');
        const errorMessage = document.getElementById('login-error-message');
        
        errorMessage.textContent = message;
        errorDiv.className = 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg';
        
        // Changer l'icône pour le succès
        const icon = errorDiv.querySelector('i');
        icon.className = 'fas fa-check-circle mr-2';
    }

    clearError() {
        const errorDiv = document.getElementById('login-error');
        errorDiv.classList.add('hidden');
        
        // Restaurer les classes d'erreur par défaut
        errorDiv.className = 'hidden bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg';
        
        const icon = errorDiv.querySelector('i');
        icon.className = 'fas fa-exclamation-triangle mr-2';
    }
}

// Animation CSS pour l'effet de secousse
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Initialiser l'authentification au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    window.authSecurity = new AuthSecurity();
});