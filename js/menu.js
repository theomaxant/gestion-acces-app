/**
 * Gestionnaire du menu de navigation avec sous-menu Réglages
 */

class MenuManager {
    constructor() {
        this.settingsButton = document.getElementById('nav-settings');
        this.settingsSubmenu = document.getElementById('settings-submenu');
        this.isSubmenuOpen = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupClickOutside();
        this.setupHoverImprovement();
    }
    
    setupEventListeners() {
        // Gestion du bouton Réglages
        if (this.settingsButton) {
            this.settingsButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleSubmenu();
            });

            // Améliorer l'expérience hover SEULEMENT sur desktop (pas mobile)
            if (!this.isMobile()) {
                this.settingsButton.addEventListener('mouseenter', () => {
                    if (!this.isSubmenuOpen) {
                        this.openSubmenu();
                    }
                });

                // Gérer la sortie de la souris du bouton
                this.settingsButton.addEventListener('mouseleave', (e) => {
                    // Délai avant fermeture pour permettre de passer au sous-menu
                    setTimeout(() => {
                        if (!this.settingsButton.matches(':hover') && 
                            !this.settingsSubmenu.matches(':hover')) {
                            this.closeSubmenu();
                        }
                    }, 200);
                });
            }
        }

        // Gestion hover du sous-menu pour éviter qu'il se ferme (DESKTOP seulement)
        if (this.settingsSubmenu && !this.isMobile()) {
            this.settingsSubmenu.addEventListener('mouseenter', (e) => {
                e.stopPropagation();
                // Maintenir le menu ouvert quand on survole
                this.isSubmenuOpen = true;
            });

            this.settingsSubmenu.addEventListener('mouseleave', (e) => {
                // Délai avant fermeture pour éviter les fermetures accidentelles
                setTimeout(() => {
                    if (!this.settingsButton.matches(':hover') && 
                        !this.settingsSubmenu.matches(':hover')) {
                        this.closeSubmenu();
                    }
                }, 200);
            });
        }
        
        // Gestion des éléments du sous-menu
        const submenuButtons = document.querySelectorAll('.submenu-btn');
        submenuButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleSubmenuClick(button.id);
                this.closeSubmenu();
            });
        });
        
        // Gestion des boutons mobiles du sous-menu Réglages
        const mobileNavButtons = document.querySelectorAll('.mobile-nav-btn');
        mobileNavButtons.forEach(button => {
            if (['mobile-nav-teams', 'mobile-nav-rights', 'mobile-nav-logs', 'mobile-nav-tutorials'].includes(button.id)) {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    console.log('🔥 Clic mobile détecté:', button.id);
                    this.handleSubmenuClick(button.id);
                });
            }
        });
        
        // Gestion de la déconnexion dans le menu mobile
        const mobileLogoutBtn = document.getElementById('mobile-nav-logout');
        if (mobileLogoutBtn) {
            mobileLogoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }
        
        // Gestion du nouveau bouton de déconnexion du sous-menu
        const desktopLogoutBtn = document.getElementById('nav-logout');
        if (desktopLogoutBtn) {
            desktopLogoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }
    }
    
    setupClickOutside() {
        // Fermer le sous-menu si on clique ailleurs
        const handleOutsideClick = (e) => {
            if (this.isSubmenuOpen && 
                !this.settingsButton?.contains(e.target) && 
                !this.settingsSubmenu?.contains(e.target)) {
                this.closeSubmenu();
            }
        };

        document.addEventListener('click', handleOutsideClick);
        
        // Gestion spéciale pour mobile tactile
        if (this.isMobile()) {
            document.addEventListener('touchstart', handleOutsideClick, { passive: true });
        }
    }
    
    toggleSubmenu() {
        if (this.isSubmenuOpen) {
            this.closeSubmenu();
        } else {
            this.openSubmenu();
        }
    }
    
    openSubmenu() {
        if (this.settingsSubmenu) {
            this.settingsSubmenu.classList.remove('hidden');
            this.isSubmenuOpen = true;
            
            // Rotation de la flèche
            const chevron = this.settingsButton.querySelector('.fa-chevron-down');
            if (chevron) {
                chevron.style.transform = 'rotate(180deg)';
            }
        }
    }
    
    closeSubmenu() {
        if (this.settingsSubmenu) {
            this.settingsSubmenu.classList.add('hidden');
            this.isSubmenuOpen = false;
            
            // Rotation de la flèche
            const chevron = this.settingsButton.querySelector('.fa-chevron-down');
            if (chevron) {
                chevron.style.transform = 'rotate(0deg)';
            }
        }
    }
    
    handleSubmenuClick(buttonId) {
        console.log('Clic sur sous-menu:', buttonId);
        
        switch(buttonId) {
            case 'nav-teams':
            case 'mobile-nav-teams':
                this.navigateToSection('teams');
                break;
            case 'nav-rights':
            case 'mobile-nav-rights':
                this.navigateToSection('rights');
                break;
            case 'nav-logs':
            case 'mobile-nav-logs':
                this.navigateToSection('logs');
                break;
            case 'nav-tutorials':
            case 'mobile-nav-tutorials':
                this.navigateToSection('tutorials');
                break;
            case 'nav-logout':
            case 'mobile-nav-logout':
                this.handleLogout();
                break;
        }
    }
    
    navigateToSection(section) {
        // Utiliser le système de navigation existant de l'app
        if (window.app && typeof window.app.switchView === 'function') {
            window.app.switchView(section);
        }
        
        // Marquer la section comme active dans le menu principal si nécessaire
        this.updateActiveState(section);
    }
    
    updateActiveState(section) {
        // Supprimer l'état actif de tous les boutons du menu principal
        document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-blue-500');
            btn.classList.add('hover:bg-blue-500');
        });
        
        // Supprimer l'état actif de tous les boutons du sous-menu
        document.querySelectorAll('.submenu-btn').forEach(btn => {
            btn.classList.remove('bg-blue-100', 'text-blue-800');
            btn.classList.add('text-gray-700');
        });
        
        // Ajouter l'état actif au bouton Réglages si on est dans une sous-section
        if (['teams', 'rights', 'logs', 'tutorials'].includes(section)) {
            this.settingsButton?.classList.add('active', 'bg-blue-500');
            this.settingsButton?.classList.remove('hover:bg-blue-500');
            
            // Marquer l'élément actif dans le sous-menu
            const activeSubmenuBtn = document.getElementById(`nav-${section}`);
            if (activeSubmenuBtn) {
                activeSubmenuBtn.classList.add('bg-blue-100', 'text-blue-800');
                activeSubmenuBtn.classList.remove('text-gray-700');
            }
        }
    }

    // Nouvelle méthode pour réinitialiser tous les états
    resetAllActiveStates() {
        // Réinitialiser le menu principal (sauf Dashboard qui doit rester actif par défaut)
        document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach(btn => {
            if (btn.id === 'nav-dashboard' || btn.id === 'mobile-nav-dashboard') {
                // Garder Dashboard actif par défaut
                btn.classList.add('active', 'bg-blue-500');
                btn.classList.remove('hover:bg-blue-500');
            } else {
                btn.classList.remove('active', 'bg-blue-500');
                btn.classList.add('hover:bg-blue-500');
            }
        });
        
        // Réinitialiser complètement le sous-menu
        document.querySelectorAll('.submenu-btn').forEach(btn => {
            btn.classList.remove('bg-blue-100', 'text-blue-800', 'bg-blue-500', 'text-white');
            btn.classList.add('text-gray-700');
            
            // S'assurer qu'il n'y a pas d'autres classes bleues
            btn.className = btn.className
                .replace(/bg-blue-\d+/g, '')
                .replace(/text-blue-\d+/g, '')
                .trim();
            
            // Remettre les bonnes classes de base
            if (!btn.classList.contains('submenu-btn')) btn.classList.add('submenu-btn');
            if (!btn.classList.contains('w-full')) btn.classList.add('w-full');
            if (!btn.classList.contains('text-left')) btn.classList.add('text-left');
            if (!btn.classList.contains('px-4')) btn.classList.add('px-4');
            if (!btn.classList.contains('py-3')) btn.classList.add('py-3');
            if (!btn.classList.contains('transition-colors')) btn.classList.add('transition-colors');
            if (!btn.classList.contains('text-gray-700')) btn.classList.add('text-gray-700');
            
            // Classes spécifiques selon le bouton
            if (btn.id !== 'nav-logout') {
                if (!btn.classList.contains('hover:bg-gray-100')) btn.classList.add('hover:bg-gray-100');
                if (!btn.classList.contains('border-b')) btn.classList.add('border-b');
                if (!btn.classList.contains('border-gray-100')) btn.classList.add('border-gray-100');
            } else {
                // Bouton déconnexion en rouge
                btn.classList.remove('text-gray-700');
                btn.classList.add('text-red-600', 'hover:bg-red-100');
            }
        });
    }
    
    isMobile() {
        // Détecter si on est sur mobile ou tablet
        return window.innerWidth <= 768 || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    handleLogout() {
        // Utiliser le système d'authentification existant
        if (window.auth && typeof window.auth.handleLogout === 'function') {
            window.auth.handleLogout();
        } else {
            console.error('Système d\'authentification non disponible');
        }
    }

    setupHoverImprovement() {
        // Créer une zone invisible pour améliorer la navigation
        if (this.settingsButton && this.settingsSubmenu) {
            const hoverZone = document.createElement('div');
            hoverZone.style.cssText = `
                position: absolute;
                top: 100%;
                right: 0;
                width: 192px;
                height: 8px;
                z-index: 40;
                pointer-events: auto;
            `;
            hoverZone.className = 'submenu-hover-bridge';
            
            // Ajouter la zone au conteneur parent
            const parent = this.settingsButton.parentElement;
            if (parent && parent.style.position !== 'relative') {
                parent.style.position = 'relative';
            }
            parent.appendChild(hoverZone);
            
            // Empêcher la fermeture quand on passe sur la zone bridge
            hoverZone.addEventListener('mouseenter', () => {
                this.isSubmenuOpen = true;
            });
        }
    }
}

// Initialiser le gestionnaire de menu
document.addEventListener('DOMContentLoaded', () => {
    window.menuManager = new MenuManager();
    
    // Réinitialiser tous les états au chargement
    setTimeout(() => {
        if (window.menuManager) {
            window.menuManager.resetAllActiveStates();
            console.log('🔄 États du menu réinitialisés');
        }
    }, 500);
    
    console.log('📋 Gestionnaire de menu initialisé');
});