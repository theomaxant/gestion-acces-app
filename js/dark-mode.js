// Gestionnaire du Mode Sombre
class DarkModeManager {
    constructor() {
        this.darkModeKey = 'darkMode';
        this.toggle = null;
        this.init();
    }

    init() {
        // Attendre que le DOM soit chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.toggle = document.getElementById('dark-mode-toggle');
        if (!this.toggle) {
            console.warn('Toggle mode sombre non trouvé');
            return;
        }

        // Charger la préférence sauvegardée
        this.loadPreference();

        // Ajouter l'écouteur d'événement
        this.toggle.addEventListener('change', (e) => {
            this.toggleDarkMode(e.target.checked);
        });

        console.log('🌙 Gestionnaire mode sombre initialisé');
    }

    loadPreference() {
        try {
            const savedPreference = localStorage.getItem(this.darkModeKey);
            const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            // Priorité : préférence sauvegardée > préférence système > mode clair par défaut
            const shouldUseDark = savedPreference !== null ? 
                savedPreference === 'true' : 
                systemPrefersDark;

            this.applyDarkMode(shouldUseDark);
            if (this.toggle) {
                this.toggle.checked = shouldUseDark;
            }

            console.log('🌙 Préférence mode sombre chargée:', shouldUseDark);
        } catch (error) {
            console.error('Erreur lors du chargement de la préférence mode sombre:', error);
        }
    }

    toggleDarkMode(enabled) {
        this.applyDarkMode(enabled);
        this.savePreference(enabled);
        
        // Animation du toggle
        this.animateToggle(enabled);

        console.log('🌙 Mode sombre', enabled ? 'activé' : 'désactivé');
    }

    applyDarkMode(enabled) {
        const root = document.documentElement;
        
        if (enabled) {
            root.setAttribute('data-theme', 'dark');
            document.body.classList.add('dark');
        } else {
            root.setAttribute('data-theme', 'light');
            document.body.classList.remove('dark');
        }

        // Mettre à jour les graphiques si ils existent
        this.updateCharts(enabled);
    }

    savePreference(enabled) {
        try {
            localStorage.setItem(this.darkModeKey, enabled.toString());
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de la préférence mode sombre:', error);
        }
    }

    animateToggle(enabled) {
        const toggleContainer = this.toggle?.parentElement?.querySelector('.dot');
        if (toggleContainer) {
            // Ajouter une petite animation bounce
            toggleContainer.style.transform = enabled ? 'translateX(100%) scale(0.9)' : 'translateX(0%) scale(0.9)';
            
            setTimeout(() => {
                toggleContainer.style.transform = enabled ? 'translateX(100%) scale(1)' : 'translateX(0%) scale(1)';
            }, 150);
        }
    }

    updateCharts(darkMode) {
        // Si Chart.js est disponible, mettre à jour les thèmes des graphiques
        if (typeof Chart !== 'undefined') {
            const textColor = darkMode ? '#f9fafb' : '#111827';
            const gridColor = darkMode ? '#4b5563' : '#e5e7eb';

            // Mettre à jour les defaults de Chart.js
            Chart.defaults.color = textColor;
            Chart.defaults.borderColor = gridColor;
            Chart.defaults.backgroundColor = darkMode ? '#1f2937' : '#ffffff';

            // Redessiner les graphiques existants si possible
            Object.values(Chart.instances || {}).forEach(chart => {
                if (chart && typeof chart.update === 'function') {
                    chart.options.plugins = chart.options.plugins || {};
                    chart.options.plugins.legend = chart.options.plugins.legend || {};
                    chart.options.plugins.legend.labels = chart.options.plugins.legend.labels || {};
                    chart.options.plugins.legend.labels.color = textColor;
                    
                    if (chart.options.scales) {
                        Object.keys(chart.options.scales).forEach(scaleKey => {
                            chart.options.scales[scaleKey].grid = chart.options.scales[scaleKey].grid || {};
                            chart.options.scales[scaleKey].grid.color = gridColor;
                            chart.options.scales[scaleKey].ticks = chart.options.scales[scaleKey].ticks || {};
                            chart.options.scales[scaleKey].ticks.color = textColor;
                        });
                    }
                    
                    chart.update('none'); // Animation rapide
                }
            });
        }
    }

    // Méthode publique pour basculer programmatiquement
    toggle() {
        if (this.toggle) {
            this.toggle.checked = !this.toggle.checked;
            this.toggleDarkMode(this.toggle.checked);
        }
    }

    // Méthode publique pour obtenir l'état actuel
    isDarkMode() {
        return document.documentElement.getAttribute('data-theme') === 'dark';
    }

    // Écouteur pour les changements de préférence système
    listenToSystemChanges() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                // Ne changer que si l'utilisateur n'a pas de préférence sauvegardée
                if (localStorage.getItem(this.darkModeKey) === null) {
                    this.applyDarkMode(e.matches);
                    if (this.toggle) {
                        this.toggle.checked = e.matches;
                    }
                }
            });
        }
    }
}

// Initialiser le gestionnaire de mode sombre
window.darkModeManager = new DarkModeManager();

// Écouter les changements de préférence système
window.darkModeManager.listenToSystemChanges();

// Raccourci clavier (Ctrl+Shift+D) pour basculer le mode sombre
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        window.darkModeManager.toggle();
    }
});