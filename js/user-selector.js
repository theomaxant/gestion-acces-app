/**
 * Sélecteur d'utilisateur pour les logs
 * Permet de choisir qui effectue les actions pour tracer les modifications
 */

class UserSelector {
    constructor() {
        this.users = [];
        this.currentUser = 'Utilisateur Direct'; // Utilisateur par défaut
        this.init();
    }

    init() {
        this.loadUsers();
        this.setupUI();
        this.bindEvents();
        console.log('[USER-SELECTOR] Sélecteur d\'utilisateur initialisé');
    }

    async loadUsers() {
        try {
            if (window.D1API) {
                const result = await window.D1API.get('utilisateurs');
                if (result.success && result.data) {
                    this.users = result.data
                        .filter(user => !user.archived)
                        .map(user => ({
                            id: user.id,
                            fullName: `${user.prenom || ''} ${user.nom || ''}`.trim(),
                            prenom: user.prenom,
                            nom: user.nom,
                            poste: user.poste || '',
                            equipe: user.equipe || ''
                        }))
                        .sort((a, b) => a.fullName.localeCompare(b.fullName));
                } else {
                    throw new Error('Pas de données utilisateurs');
                }
            } else {
                throw new Error('API non disponible');
            }
        } catch (error) {
            console.warn('[USER-SELECTOR] Utilisation des utilisateurs par défaut:', error.message);
            // Utilisateurs par défaut
            this.users = [
                { id: '1', fullName: 'Admin Système', prenom: 'Admin', nom: 'Système', poste: 'Administrateur', equipe: 'IT' },
                { id: '2', fullName: 'Manager Équipe', prenom: 'Manager', nom: 'Équipe', poste: 'Manager', equipe: 'Direction' },
                { id: '3', fullName: 'User Standard', prenom: 'User', nom: 'Standard', poste: 'Utilisateur', equipe: 'Générale' },
                { id: '4', fullName: 'Utilisateur Direct', prenom: 'Utilisateur', nom: 'Direct', poste: 'Standard', equipe: 'Défaut' }
            ];
        }

        console.log(`[USER-SELECTOR] ${this.users.length} utilisateurs chargés`);
    }

    setupUI() {
        // Créer le sélecteur d'utilisateur adapté au header bleu
        const userSelectorHtml = `
            <div id="user-selector-container" class="flex items-center space-x-2 bg-blue-700 px-3 py-2 rounded-lg border border-blue-500">
                <i class="fas fa-user-circle text-blue-200"></i>
                <div class="flex flex-col">
                    <span class="text-xs text-blue-200 font-medium">Utilisateur</span>
                    <select id="user-selector" class="text-sm font-semibold bg-blue-700 border-none focus:ring-0 text-white cursor-pointer max-w-32 xl:max-w-40">
                        <option value="">Chargement...</option>
                    </select>
                </div>
            </div>
        `;

        // Trouver le header et l'insérer dans la navigation desktop
        const desktopNav = document.querySelector('header nav.hidden.lg\\:flex');
        if (desktopNav) {
            // Insérer avant le menu More/Plus
            const moreButton = desktopNav.querySelector('#nav-more') || desktopNav.querySelector('button:last-child');
            if (moreButton) {
                moreButton.insertAdjacentHTML('beforebegin', userSelectorHtml);
            } else {
                desktopNav.insertAdjacentHTML('beforeend', userSelectorHtml);
            }
        } else {
            // Fallback: ajouter après le header
            const header = document.querySelector('header');
            if (header) {
                header.insertAdjacentHTML('afterend', `
                    <div class="bg-blue-500 border-b border-blue-400">
                        <div class="container mx-auto px-4 py-2">
                            ${userSelectorHtml}
                        </div>
                    </div>
                `);
            } else {
                // Dernier fallback: en haut du contenu principal
                const mainContent = document.querySelector('#app .container');
                if (mainContent) {
                    mainContent.insertAdjacentHTML('afterbegin', `<div class="mb-4">${userSelectorHtml}</div>`);
                }
            }
        }

        this.populateSelector();
    }

    populateSelector() {
        const select = document.getElementById('user-selector');
        if (!select) {
            console.warn('[USER-SELECTOR] Sélecteur non trouvé dans le DOM');
            return;
        }

        // Vider et repeupler
        select.innerHTML = '';

        // Ajouter les utilisateurs
        this.users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.fullName;
            option.textContent = user.fullName;
            option.dataset.userId = user.id;
            option.dataset.poste = user.poste;
            option.dataset.equipe = user.equipe;
            select.appendChild(option);
        });

        // Sélectionner l'utilisateur par défaut
        const defaultUser = localStorage.getItem('current_user') || this.currentUser;
        select.value = defaultUser;
        this.setCurrentUser(defaultUser);
        
        console.log(`[USER-SELECTOR] Sélecteur peuplé avec ${this.users.length} utilisateurs`);
    }

    bindEvents() {
        const select = document.getElementById('user-selector');
        if (select) {
            select.addEventListener('change', (e) => {
                const selectedUser = e.target.value;
                if (selectedUser) {
                    this.setCurrentUser(selectedUser);
                    
                    // Optionnel: log du changement d'utilisateur
                    if (window.logger) {
                        window.logger.logAction('USER_CHANGE', '', '', {}, { new_user: selectedUser }, 'Changement d\'utilisateur actuel');
                    }
                }
            });
        }
    }

    setCurrentUser(userName) {
        this.currentUser = userName;
        localStorage.setItem('current_user', userName);
        
        // Mettre à jour le titre/tooltip du sélecteur avec plus d'infos
        const selector = document.getElementById('user-selector');
        if (selector) {
            const user = this.users.find(u => u.fullName === userName);
            if (user) {
                selector.title = `${user.fullName} - ${user.poste || 'Poste non défini'} (${user.equipe || 'Équipe non définie'})`;
            } else {
                selector.title = `${userName} - Utilisateur direct`;
            }
        }

        console.log(`[USER-SELECTOR] Utilisateur actuel: ${userName}`);
        
        // Émettre un événement personnalisé pour notifier les autres composants
        window.dispatchEvent(new CustomEvent('userChanged', { 
            detail: { 
                user: userName,
                userData: this.users.find(u => u.fullName === userName)
            } 
        }));
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getCurrentUserData() {
        return this.users.find(u => u.fullName === this.currentUser) || {
            id: 'unknown',
            fullName: this.currentUser,
            prenom: 'Inconnu',
            nom: 'Inconnu',
            poste: 'Non défini',
            equipe: 'Non définie'
        };
    }

    // Méthode pour rafraîchir la liste des utilisateurs
    async refreshUsers() {
        console.log('[USER-SELECTOR] Rafraîchissement des utilisateurs...');
        await this.loadUsers();
        this.populateSelector();
    }

    // Méthode pour ajouter un utilisateur temporaire (utile pour les tests)
    addTemporaryUser(name, details = {}) {
        const tempUser = {
            id: `temp_${Date.now()}`,
            fullName: name,
            prenom: details.prenom || name.split(' ')[0] || 'Temp',
            nom: details.nom || name.split(' ')[1] || 'User',
            poste: details.poste || 'Temporaire',
            equipe: details.equipe || 'Test'
        };

        this.users.unshift(tempUser); // Ajouter en premier
        this.populateSelector();
        
        console.log(`[USER-SELECTOR] Utilisateur temporaire ajouté: ${name}`);
        return tempUser;
    }
}

// Initialisation globale
window.addEventListener('DOMContentLoaded', () => {
    // Attendre un peu pour s'assurer que le DOM est complètement chargé
    setTimeout(() => {
        try {
            window.userSelector = new UserSelector();
            
            // Fonction globale pour changer d'utilisateur rapidement
            window.setUser = (userName) => {
                if (window.userSelector) {
                    window.userSelector.setCurrentUser(userName);
                } else {
                    localStorage.setItem('current_user', userName);
                }
                console.log(`[USER-SELECTOR] Utilisateur défini: ${userName}`);
            };
            
            // Fonction globale pour obtenir l'utilisateur actuel
            window.getUser = () => {
                return window.userSelector ? window.userSelector.getCurrentUser() : localStorage.getItem('current_user');
            };
            
            console.log('[USER-SELECTOR] Système de sélection utilisateur initialisé');
            console.log('[INFO] Fonctions disponibles:');
            console.log('  - setUser("Nom Complet") - Changer d\'utilisateur');
            console.log('  - getUser() - Obtenir l\'utilisateur actuel');
            console.log('  - userSelector.refreshUsers() - Recharger la liste');
            
        } catch (error) {
            console.error('[USER-SELECTOR] Erreur d\'initialisation:', error);
        }
    }, 500);
});