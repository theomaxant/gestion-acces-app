/**
 * 🚀 Système de Chargement Dynamique des Processus
 * Charge automatiquement tous les fichiers PROCESS-*.md
 */

class ProcessLoader {
    constructor() {
        this.processes = new Map();
        this.currentProcess = null;
        this.menuContainer = null;
        this.contentArea = null;
        
        // Configuration des processus avec métadonnées
        this.processConfig = {
            'PROCESS-01-DASHBOARD.md': {
                id: 'dashboard',
                title: 'Dashboard',
                icon: 'fas fa-tachometer-alt',
                color: 'blue',
                description: 'Tableau de bord et métriques'
            },
            'PROCESS-02-UTILISATEURS.md': {
                id: 'utilisateurs',
                title: 'Utilisateurs',
                icon: 'fas fa-users',
                color: 'green',
                description: 'Gestion des utilisateurs'
            },
            'PROCESS-03-EQUIPES.md': {
                id: 'equipes',
                title: 'Équipes',
                icon: 'fas fa-users-cog',
                color: 'purple',
                description: 'Gestion des équipes'
            },
            'PROCESS-04-LOGICIELS.md': {
                id: 'logiciels',
                title: 'Logiciels',
                icon: 'fas fa-laptop',
                color: 'orange',
                description: 'Catalogue des logiciels'
            },
            'PROCESS-05-DROITS.md': {
                id: 'droits',
                title: 'Droits',
                icon: 'fas fa-shield-alt',
                color: 'red',
                description: 'Gestion des droits'
            },
            'PROCESS-06-ACCES.md': {
                id: 'acces',
                title: 'Accès',
                icon: 'fas fa-key',
                color: 'indigo',
                description: 'Attribution des accès'
            },
            'PROCESS-07-RAPPORTS.md': {
                id: 'rapports',
                title: 'Rapports',
                icon: 'fas fa-chart-line',
                color: 'pink',
                description: 'Rapports et analyses'
            },
            'PROCESS-08-ECHEANCIER.md': {
                id: 'echeancier',
                title: 'Échéancier',
                icon: 'fas fa-calendar-alt',
                color: 'teal',
                description: 'Planification des paiements'
            },
            'PROCESS-09-LOGS.md': {
                id: 'logs',
                title: 'Logs & Audit',
                icon: 'fas fa-search',
                color: 'gray',
                description: 'Journaux d\'audit'
            },
            'PROCESS-10-PROCESSUS.md': {
                id: 'processus',
                title: 'Documentation',
                icon: 'fas fa-book-open',
                color: 'yellow',
                description: 'Vue d\'ensemble des processus'
            }
        };
    }

    /**
     * 🏁 Initialisation du système
     */
    async init() {
        console.log('🚀 [ProcessLoader] Initialisation du chargement dynamique des processus');
        AppLogger.warn('[ProcessLoader] Démarrage du système de processus dynamique');
        
        try {
            // Vérifier que nous sommes dans la vue processus
            this.menuContainer = document.getElementById('process-menu-container');
            this.contentArea = document.getElementById('process-content-area');
            
            if (!this.menuContainer || !this.contentArea) {
                console.error('❌ [ProcessLoader] Éléments DOM non trouvés');
                AppLogger.warn(`[ProcessLoader] DOM manquant - Menu: ${!!this.menuContainer}, Content: ${!!this.contentArea}`);
                return false;
            }
            
            AppLogger.warn('[ProcessLoader] Éléments DOM trouvés, début du chargement');

            // Charger tous les processus
            await this.loadAllProcesses();
            
            // Générer le menu
            this.generateMenu();
            
            console.log(`✅ [ProcessLoader] ${this.processes.size} processus chargés avec succès`);
            return true;
            
        } catch (error) {
            console.error('❌ [ProcessLoader] Erreur d\'initialisation:', error);
            this.showError('Erreur lors du chargement des processus');
            return false;
        }
    }

    /**
     * 📥 Chargement de tous les fichiers processus
     */
    async loadAllProcesses() {
        const loadPromises = Object.keys(this.processConfig).map(filename => 
            this.loadSingleProcess(filename)
        );

        const results = await Promise.allSettled(loadPromises);
        
        // Log des résultats
        results.forEach((result, index) => {
            const filename = Object.keys(this.processConfig)[index];
            if (result.status === 'fulfilled') {
                console.log(`✅ [ProcessLoader] ${filename} chargé`);
            } else {
                console.error(`❌ [ProcessLoader] Échec ${filename}:`, result.reason);
            }
        });
    }

    /**
     * 📄 Chargement d'un fichier processus individuel
     */
    async loadSingleProcess(filename) {
        try {
            console.log(`📥 [ProcessLoader] Chargement de ${filename}...`);
            
            const response = await fetch(filename);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const content = await response.text();
            const config = this.processConfig[filename];
            
            // Stocker le processus avec ses métadonnées
            this.processes.set(config.id, {
                filename,
                content: content.trim(),
                ...config,
                loadedAt: new Date()
            });
            
            return { filename, success: true };
            
        } catch (error) {
            console.error(`❌ [ProcessLoader] Erreur chargement ${filename}:`, error.message);
            
            // Stocker quand même avec contenu d'erreur
            const config = this.processConfig[filename];
            this.processes.set(config.id, {
                filename,
                content: `# ❌ Erreur de Chargement\n\nImpossible de charger le fichier \`${filename}\`.\n\n**Erreur:** ${error.message}`,
                ...config,
                error: true,
                loadedAt: new Date()
            });
            
            throw error;
        }
    }

    /**
     * 🎨 Génération du menu des processus
     */
    generateMenu() {
        console.log('🎨 [ProcessLoader] Génération du menu des processus');
        
        // Vider le menu existant
        this.menuContainer.innerHTML = '';
        
        // Créer les boutons pour chaque processus
        this.processes.forEach((process, processId) => {
            const button = this.createMenuButton(process);
            this.menuContainer.appendChild(button);
        });
        
        console.log(`✅ [ProcessLoader] Menu généré avec ${this.processes.size} boutons`);
    }

    /**
     * 🔘 Création d'un bouton de menu
     */
    createMenuButton(process) {
        const button = document.createElement('button');
        button.className = `process-menu-btn flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-lg hover:bg-${process.color}-50 transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-${process.color}-200 hover:shadow-sm`;
        
        // Gérer les erreurs visuellement
        if (process.error) {
            button.className += ' opacity-50';
        }
        
        button.innerHTML = `
            <div class="text-${process.color}-600 text-lg mb-1">
                <i class="${process.icon}"></i>
            </div>
            <span class="text-xs font-medium text-gray-700 whitespace-nowrap">${process.title}</span>
        `;
        
        // Event listener
        button.addEventListener('click', () => this.showProcess(process.id));
        
        return button;
    }

    /**
     * 📄 Affichage d'un processus
     */
    showProcess(processId) {
        console.log(`📄 [ProcessLoader] Affichage du processus: ${processId}`);
        
        const process = this.processes.get(processId);
        if (!process) {
            console.error(`❌ [ProcessLoader] Processus non trouvé: ${processId}`);
            this.showError(`Processus "${processId}" non trouvé`);
            return;
        }

        // Mettre à jour l'état actuel
        this.currentProcess = processId;
        
        // Mettre à jour l'apparence des boutons
        this.updateMenuButtons(processId);
        
        // Afficher le contenu
        this.renderProcessContent(process);
    }

    /**
     * 🎨 Mise à jour visuelle des boutons de menu
     */
    updateMenuButtons(activeProcessId) {
        const buttons = this.menuContainer.querySelectorAll('.process-menu-btn');
        
        buttons.forEach((button, index) => {
            const processId = Array.from(this.processes.keys())[index];
            const isActive = processId === activeProcessId;
            
            if (isActive) {
                button.classList.add('bg-blue-100', 'border-blue-300');
            } else {
                button.classList.remove('bg-blue-100', 'border-blue-300');
            }
        });
    }

    /**
     * 🖥️ Rendu du contenu d'un processus
     */
    renderProcessContent(process) {
        // Conversion simple du Markdown en HTML
        const htmlContent = this.markdownToHtml(process.content);
        
        this.contentArea.innerHTML = `
            <div class="process-document">
                <!-- En-tête du processus -->
                <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                    <div class="flex items-center">
                        <div class="text-${process.color}-600 text-2xl mr-3">
                            <i class="${process.icon}"></i>
                        </div>
                        <div>
                            <h1 class="text-2xl font-bold text-gray-900">${process.title}</h1>
                            <p class="text-gray-600">${process.description}</p>
                        </div>
                    </div>
                    <div class="text-sm text-gray-500">
                        ${process.error ? '❌ Erreur de chargement' : '✅ Chargé le ' + process.loadedAt.toLocaleString()}
                    </div>
                </div>
                
                <!-- Contenu du processus -->
                <div class="process-content prose prose-lg max-w-none">
                    ${htmlContent}
                </div>
                
                <!-- Pied de page -->
                <div class="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
                    📄 Source: <code>${process.filename}</code>
                </div>
            </div>
        `;
        
        console.log(`✅ [ProcessLoader] Contenu affiché pour: ${process.title}`);
    }

    /**
     * 📝 Conversion simple Markdown vers HTML
     */
    markdownToHtml(markdown) {
        let html = markdown;
        
        // Titres
        html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4 text-gray-900">$1</h1>');
        html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mb-3 mt-6 text-gray-800">$1</h2>');
        html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-medium mb-2 mt-4 text-gray-700">$1</h3>');
        html = html.replace(/^#### (.*$)/gim, '<h4 class="text-lg font-medium mb-2 mt-3 text-gray-700">$1</h4>');
        
        // Listes
        html = html.replace(/^\* (.*$)/gim, '<li class="mb-1">$1</li>');
        html = html.replace(/^- (.*$)/gim, '<li class="mb-1">$1</li>');
        
        // Entourer les listes dans <ul>
        html = html.replace(/((<li class="mb-1">.*<\/li>\s*)+)/gs, '<ul class="list-disc list-inside mb-4 space-y-1">$1</ul>');
        
        // Code inline
        html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>');
        
        // Blocs de code
        html = html.replace(/```[\s\S]*?```/g, (match) => {
            const code = match.replace(/```/g, '');
            return `<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4"><code class="font-mono text-sm">${code}</code></pre>`;
        });
        
        // Gras
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
        
        // Italique
        html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
        
        // Paragraphes
        html = html.replace(/^\s*(.+)$/gim, (match, p1) => {
            // Éviter de wrapper les éléments HTML déjà traités
            if (p1.startsWith('<h') || p1.startsWith('<ul') || p1.startsWith('<li') || 
                p1.startsWith('<pre') || p1.startsWith('<code') || p1.trim() === '') {
                return match;
            }
            return `<p class="mb-4 text-gray-700 leading-relaxed">${p1}</p>`;
        });
        
        // Sauts de ligne doubles
        html = html.replace(/\n\n/g, '\n');
        
        return html;
    }

    /**
     * ❌ Affichage d'erreur
     */
    showError(message) {
        this.contentArea.innerHTML = `
            <div class="text-center py-12">
                <div class="text-red-500 text-4xl mb-4">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Erreur</h3>
                <p class="text-gray-600">${message}</p>
                <button onclick="location.reload()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <i class="fas fa-redo mr-2"></i>Recharger
                </button>
            </div>
        `;
    }

    /**
     * 🔄 Rechargement d'un processus spécifique
     */
    async reloadProcess(processId) {
        console.log(`🔄 [ProcessLoader] Rechargement du processus: ${processId}`);
        
        const process = this.processes.get(processId);
        if (!process) return;
        
        try {
            await this.loadSingleProcess(process.filename);
            if (this.currentProcess === processId) {
                this.showProcess(processId);
            }
            console.log(`✅ [ProcessLoader] Processus ${processId} rechargé`);
        } catch (error) {
            console.error(`❌ [ProcessLoader] Échec rechargement ${processId}:`, error);
        }
    }

    /**
     * 📊 Statistiques des processus chargés
     */
    getStats() {
        const total = this.processes.size;
        const loaded = Array.from(this.processes.values()).filter(p => !p.error).length;
        const errors = total - loaded;
        
        return { total, loaded, errors };
    }
}

// 🌍 Instance globale
window.processLoader = new ProcessLoader();

// 🔗 Fonction globale pour compatibilité
window.showProcessInline = (processId) => {
    if (window.processLoader) {
        window.processLoader.showProcess(processId);
    }
};

// 🚀 Auto-initialisation quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    // Attendre un peu que l'interface soit complètement prête
    setTimeout(() => {
        if (window.processLoader) {
            // Initialiser seulement si on est sur la page processus OU si elle devient visible
            const processView = document.getElementById('process-view');
            if (processView && !processView.classList.contains('hidden')) {
                window.processLoader.init();
            }
        }
    }, 500);
});

// 🔍 Observer les changements de vue pour initialiser quand nécessaire
document.addEventListener('click', (e) => {
    // Si on clique sur le bouton processus, initialiser le système
    if (e.target && (e.target.id === 'nav-process' || e.target.id === 'mobile-nav-process')) {
        setTimeout(() => {
            if (window.processLoader && !window.processLoader.processes.size) {
                window.processLoader.init();
            }
        }, 200);
    }
});

console.log('✅ [ProcessLoader] Module chargé - Prêt pour l\'initialisation');