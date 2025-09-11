/**
 * Système de Tutoriels Interactifs
 * Gestion des Accès et Licences Logiciels - Version 2024
 */

class TutorialSystem {
    constructor() {
        this.currentTutorial = null;
        this.tutorialStep = 0;
        this.tutorials = this.initializeTutorials();
        this.init();
    }

    init() {
        // Initialiser les événements après le chargement du DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        // Bouton d'aide dans le menu
        const helpBtn = document.getElementById('help-btn');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => this.showTutorialMenu());
        }

        // Raccourci clavier F1 pour l'aide
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F1') {
                e.preventDefault();
                this.showTutorialMenu();
            }
        });
    }

    initializeTutorials() {
        return {
            'dashboard': {
                title: 'Découverte du Tableau de Bord',
                steps: [
                    {
                        target: '.dashboard-stats',
                        title: 'Statistiques Principales',
                        content: 'Voici vos statistiques principales : nombre total de logiciels, utilisateurs actifs, et alertes importantes.'
                    },
                    {
                        target: '.chart-container',
                        title: 'Graphiques de Suivi',
                        content: 'Ces graphiques vous permettent de suivre l\'évolution de vos licences et coûts mensuels.'
                    },
                    {
                        target: '.notifications-panel',
                        title: 'Notifications',
                        content: 'Restez informé des licences qui expirent bientôt et des actions requises.'
                    }
                ]
            },
            'software': {
                title: 'Gestion des Logiciels',
                steps: [
                    {
                        target: '#add-software-btn',
                        title: 'Ajouter un Logiciel',
                        content: 'Cliquez ici pour ajouter un nouveau logiciel à votre inventaire.'
                    },
                    {
                        target: '.software-filters',
                        title: 'Filtres de Recherche',
                        content: 'Utilisez ces filtres pour trouver rapidement vos logiciels par catégorie, statut, ou équipe.'
                    },
                    {
                        target: '.software-table',
                        title: 'Liste des Logiciels',
                        content: 'Tableau complet de vos logiciels avec toutes les informations importantes : coûts, dates d\'expiration, responsables.'
                    }
                ]
            },
            'users': {
                title: 'Gestion des Utilisateurs',
                steps: [
                    {
                        target: '#add-user-btn',
                        title: 'Ajouter un Utilisateur',
                        content: 'Créez de nouveaux comptes utilisateurs pour votre équipe.'
                    },
                    {
                        target: '.user-roles',
                        title: 'Rôles et Permissions',
                        content: 'Définissez les rôles (Admin, Manager, User) pour contrôler les accès.'
                    },
                    {
                        target: '.user-access-table',
                        title: 'Droits d\'Accès',
                        content: 'Suivez et gérez les accès de chaque utilisateur aux différents logiciels.'
                    }
                ]
            },
            'process': {
                title: 'Guide des Processus',
                steps: [
                    {
                        target: '.process-navigation',
                        title: 'Navigation des Processus',
                        content: 'Explorez les différentes sections : démarrage rapide, processus complets, nouveaux champs 2024.'
                    },
                    {
                        target: '.process-content',
                        title: 'Documentation Détaillée',
                        content: 'Consultez la documentation complète pour maîtriser tous les aspects de l\'application.'
                    }
                ]
            }
        };
    }

    showTutorialMenu() {
        const currentPage = this.getCurrentPage();
        const availableTutorials = Object.keys(this.tutorials);
        
        const modal = document.createElement('div');
        modal.className = 'tutorial-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md mx-4">
                <h3 class="text-xl font-bold mb-4">🎓 Tutoriels Disponibles</h3>
                <div class="space-y-2">
                    ${availableTutorials.map(key => `
                        <button onclick="tutorialSystem.startTutorial('${key}')" 
                                class="w-full text-left p-3 rounded border hover:bg-gray-50 ${key === currentPage ? 'bg-blue-50 border-blue-200' : ''}">
                            <strong>${this.tutorials[key].title}</strong>
                            ${key === currentPage ? '<span class="text-blue-600 text-sm">(Page actuelle)</span>' : ''}
                        </button>
                    `).join('')}
                </div>
                <div class="mt-4 flex justify-between">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            class="px-4 py-2 text-gray-600 hover:text-gray-800">
                        Annuler
                    </button>
                    ${currentPage && this.tutorials[currentPage] ? `
                        <button onclick="tutorialSystem.startTutorial('${currentPage}')" 
                                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Tutoriel de cette page
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    getCurrentPage() {
        const path = window.location.hash || '#dashboard';
        return path.replace('#', '');
    }

    startTutorial(tutorialKey) {
        // Fermer la modale de sélection
        const modal = document.querySelector('.tutorial-modal');
        if (modal) modal.remove();

        if (!this.tutorials[tutorialKey]) {
            console.warn('Tutoriel non trouvé:', tutorialKey);
            return;
        }

        this.currentTutorial = tutorialKey;
        this.tutorialStep = 0;
        
        // Naviguer vers la page si nécessaire
        const currentPage = this.getCurrentPage();
        if (currentPage !== tutorialKey) {
            window.location.hash = tutorialKey;
            // Attendre que la page se charge
            setTimeout(() => this.showStep(), 500);
        } else {
            this.showStep();
        }
    }

    showStep() {
        const tutorial = this.tutorials[this.currentTutorial];
        const step = tutorial.steps[this.tutorialStep];
        
        if (!step) {
            this.endTutorial();
            return;
        }

        // Supprimer le tooltip précédent
        this.removeTooltip();

        // Créer le tooltip pour cette étape
        this.createTooltip(step);
    }

    createTooltip(step) {
        const target = document.querySelector(step.target);
        if (!target) {
            console.warn('Élément cible non trouvé:', step.target);
            this.nextStep();
            return;
        }

        // Highlight de l'élément cible
        target.style.position = 'relative';
        target.style.zIndex = '40';
        target.classList.add('tutorial-highlight');

        // Overlay sombre
        const overlay = document.createElement('div');
        overlay.className = 'tutorial-overlay fixed inset-0 bg-black bg-opacity-30 z-30';
        document.body.appendChild(overlay);

        // Tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'tutorial-tooltip fixed bg-white rounded-lg shadow-xl p-4 max-w-sm z-50';
        tooltip.innerHTML = `
            <div class="flex items-start justify-between mb-2">
                <h4 class="font-bold text-lg">${step.title}</h4>
                <button onclick="tutorialSystem.endTutorial()" class="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <p class="text-gray-700 mb-4">${step.content}</p>
            <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500">
                    Étape ${this.tutorialStep + 1}/${this.tutorials[this.currentTutorial].steps.length}
                </span>
                <div class="space-x-2">
                    ${this.tutorialStep > 0 ? `
                        <button onclick="tutorialSystem.previousStep()" class="px-3 py-1 text-gray-600 hover:text-gray-800">
                            Précédent
                        </button>
                    ` : ''}
                    <button onclick="tutorialSystem.nextStep()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        ${this.tutorialStep < this.tutorials[this.currentTutorial].steps.length - 1 ? 'Suivant' : 'Terminer'}
                    </button>
                </div>
            </div>
        `;

        // Positionner le tooltip
        document.body.appendChild(tooltip);
        this.positionTooltip(tooltip, target);

        // Scroll vers l'élément si nécessaire
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    positionTooltip(tooltip, target) {
        const targetRect = target.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
        let top = targetRect.bottom + 10;

        // Ajustements si le tooltip dépasse
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top + tooltipRect.height > window.innerHeight - 10) {
            top = targetRect.top - tooltipRect.height - 10;
        }

        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }

    nextStep() {
        this.tutorialStep++;
        this.showStep();
    }

    previousStep() {
        if (this.tutorialStep > 0) {
            this.tutorialStep--;
            this.showStep();
        }
    }

    endTutorial() {
        this.removeTooltip();
        this.currentTutorial = null;
        this.tutorialStep = 0;
        
        // Félicitations
        const congratsModal = document.createElement('div');
        congratsModal.className = 'tutorial-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        congratsModal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md mx-4 text-center">
                <div class="text-4xl mb-4">🎉</div>
                <h3 class="text-xl font-bold mb-2">Tutoriel Terminé !</h3>
                <p class="text-gray-700 mb-4">Vous maîtrisez maintenant cette section de l'application.</p>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Parfait !
                </button>
            </div>
        `;
        document.body.appendChild(congratsModal);
        
        // Supprimer automatiquement après 3 secondes
        setTimeout(() => {
            if (congratsModal.parentElement) {
                congratsModal.remove();
            }
        }, 3000);
    }

    removeTooltip() {
        // Supprimer l'overlay
        const overlay = document.querySelector('.tutorial-overlay');
        if (overlay) overlay.remove();

        // Supprimer le tooltip
        const tooltip = document.querySelector('.tutorial-tooltip');
        if (tooltip) tooltip.remove();

        // Retirer le highlight
        const highlighted = document.querySelector('.tutorial-highlight');
        if (highlighted) {
            highlighted.classList.remove('tutorial-highlight');
            highlighted.style.position = '';
            highlighted.style.zIndex = '';
        }
    }
}

// CSS pour les tutoriels
const tutorialCSS = `
    .tutorial-highlight {
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.5) !important;
        border: 2px solid #3b82f6 !important;
        border-radius: 8px !important;
    }
    
    .tutorial-tooltip {
        animation: tutorialFadeIn 0.3s ease-out;
    }
    
    @keyframes tutorialFadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

// Ajouter le CSS
const style = document.createElement('style');
style.textContent = tutorialCSS;
document.head.appendChild(style);

// Initialiser le système de tutoriels
const tutorialSystem = new TutorialSystem();

// Export pour utilisation dans d'autres scripts
window.tutorialSystem = tutorialSystem;