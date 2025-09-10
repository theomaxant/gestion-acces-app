/**
 * Interface de gestion et d'affichage des logs
 */

class LogsManager {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 20;
        this.currentFilters = {};
        this.logs = [];
        this.totalLogs = 0;
        
        // Cache pour la résolution des IDs
        this.resolveCache = {
            users: new Map(),
            software: new Map(),
            teams: new Map(),
            rights: new Map(),
            loaded: {
                users: false,
                software: false,
                teams: false,
                rights: false
            }
        };
    }
    
    /**
     * Initialiser l'interface des logs
     */
    async init() {
        try {
            console.log('🔄 Initialisation des logs...');
            this.render();
            await Promise.all([
                this.loadFilterOptions(),
                this.loadResolveData()
            ]);
            this.loadLogs();
            console.log('✅ Logs initialisés');
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation des logs:', error);
            this.renderError(error);
        }
    }
    
    /**
     * Créer l'interface HTML des logs
     */
    render() {
        const content = `
            <div class="space-y-6">
                <!-- En-tête -->
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900">
                            <i class="fas fa-history mr-3 text-blue-600"></i>
                            Journal des Activités
                        </h2>
                        <p class="text-gray-600 mt-1">Historique de toutes les actions effectuées dans l'application</p>
                    </div>
                    
                    <div class="flex items-center space-x-2">
                        <button id="refresh-logs" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <i class="fas fa-sync-alt mr-2"></i>Actualiser
                        </button>
                        <button id="export-logs" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            <i class="fas fa-download mr-2"></i>Exporter
                        </button>
                        <button id="clean-logs" class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                            <i class="fas fa-broom mr-2"></i>Nettoyer
                        </button>
                    </div>
                </div>
                
                <!-- Filtres -->
                <div class="bg-white p-4 rounded-lg shadow-sm border">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Action</label>
                            <select id="filter-action" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="">Toutes les actions</option>
                                <option value="CREATE">➕ Création</option>
                                <option value="UPDATE">✏️ Modification</option>
                                <option value="DELETE">🗑️ Suppression</option>
                                <option value="ARCHIVE">📦 Archivage</option>
                                <option value="LOGIN">🔑 Connexion</option>
                                <option value="LOGOUT">👋 Déconnexion</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Table</label>
                            <select id="filter-table" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="">Toutes les tables</option>
                                <option value="utilisateurs">Utilisateurs</option>
                                <option value="logiciels">Logiciels</option>
                                <option value="acces">Accès</option>
                                <option value="equipes">Équipes</option>
                                <option value="droits">Types d'accès</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Période</label>
                            <select id="filter-period" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="">Toute la période</option>
                                <option value="today">Aujourd'hui</option>
                                <option value="week">Cette semaine</option>
                                <option value="month">Ce mois</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Utilisateur</label>
                            <select id="filter-user" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="">Tous les utilisateurs</option>
                                <!-- Options chargées dynamiquement -->
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Logiciel</label>
                            <select id="filter-software" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="">Tous les logiciels</option>
                                <!-- Options chargées dynamiquement -->
                            </select>
                        </div>
                        
                        <div class="flex items-end">
                            <button id="apply-filters" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                <i class="fas fa-filter mr-2"></i>Filtrer
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Statistiques rapides -->
                <div id="logs-stats" class="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <!-- Les statistiques seront générées dynamiquement -->
                </div>
                
                <!-- Liste des logs -->
                <div class="bg-white rounded-lg shadow-sm border">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-medium text-gray-900">Journal d'activité</h3>
                            <span id="logs-count" class="text-sm text-gray-500">0 entrée(s)</span>
                        </div>
                    </div>
                    
                    <div id="logs-loading" class="p-8 text-center hidden">
                        <i class="fas fa-spinner fa-spin text-2xl text-blue-600 mb-4"></i>
                        <p class="text-gray-600">Chargement des logs...</p>
                    </div>
                    
                    <div id="logs-list" class="divide-y divide-gray-200">
                        <!-- Les logs seront affichés ici -->
                    </div>
                    
                    <!-- Pagination -->
                    <div id="logs-pagination" class="px-6 py-4 border-t border-gray-200">
                        <!-- La pagination sera générée dynamiquement -->
                    </div>
                </div>
            </div>
        `;
        
        const container = document.querySelector('#logs-view #main-content');
        if (container) {
            container.innerHTML = content;
        } else {
            console.error('Conteneur logs non trouvé');
        }
        this.setupEventListeners();
    }
    
    /**
     * Afficher une erreur si l'initialisation échoue
     */
    renderError(error) {
        const container = document.querySelector('#logs-view #main-content');
        if (container) {
            container.innerHTML = `
                <div class="min-h-64 flex items-center justify-center">
                    <div class="text-center">
                        <div class="text-red-500 text-6xl mb-4">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement des logs</h3>
                        <p class="text-gray-600 mb-4">${error.message || 'Une erreur inattendue s\'est produite'}</p>
                        <button onclick="window.logsManager.init()" 
                                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <i class="fas fa-redo mr-2"></i>Réessayer
                        </button>
                    </div>
                </div>
            `;
        }
    }
    
    /**
     * Charger les données pour la résolution des IDs
     */
    async loadResolveData() {
        try {
            // Charger toutes les données en parallèle
            const [usersResponse, softwareResponse, teamsResponse, rightsResponse] = await Promise.all([
                window.D1API.get('utilisateurs', null, {limit: 1000}),
                window.D1API.get('logiciels', null, {limit: 1000}),
                window.D1API.get('equipes', null, {limit: 1000}),
                window.D1API.get('droits', null, {limit: 1000})
            ]);

            // Traiter les utilisateurs
            if (usersResponse.success) {
                usersResponse.data?.forEach(user => {
                    this.resolveCache.users.set(user.id, `${user.prenom} ${user.nom}`.trim());
                });
                this.resolveCache.loaded.users = true;
            }

            // Traiter les logiciels
            if (softwareResponse.success) {
                softwareResponse.data?.forEach(software => {
                    this.resolveCache.software.set(software.id, software.nom);
                });
                this.resolveCache.loaded.software = true;
            }

            // Traiter les équipes
            if (teamsResponse.success) {
                teamsResponse.data?.forEach(team => {
                    this.resolveCache.teams.set(team.id, team.nom);
                });
                this.resolveCache.loaded.teams = true;
            }

            // Traiter les droits
            if (rightsResponse.success) {
                rightsResponse.data?.forEach(right => {
                    this.resolveCache.rights.set(right.id, right.nom);
                });
                this.resolveCache.loaded.rights = true;
            }

        } catch (error) {
            console.error('❌ Erreur lors du chargement des données de résolution:', error);
        }
    }

    /**
     * Charger les options pour les filtres (utilisateurs et logiciels)
     */
    async loadFilterOptions() {
        try {
            // Charger les utilisateurs
            const usersResponse = await window.D1API.get('utilisateurs', null, {limit: 1000});
            if (usersResponse.ok) {
                const usersData = await usersResponse.json();
                const userSelect = document.getElementById('filter-user');
                if (userSelect && usersData.data) {
                    const userOptions = usersData.data
                        .filter(user => !user.archived)
                        .map(user => `<option value="${user.id}">${user.prenom} ${user.nom}</option>`)
                        .join('');
                    userSelect.innerHTML = '<option value="">Tous les utilisateurs</option>' + userOptions;
                }
            }

            // Charger les logiciels
            const softwareResponse = await window.D1API.get('logiciels', null, {limit: 1000});
            if (softwareResponse.ok) {
                const softwareData = await softwareResponse.json();
                const softwareSelect = document.getElementById('filter-software');
                if (softwareSelect && softwareData.data) {
                    const softwareOptions = softwareData.data
                        .filter(software => !software.archived)
                        .map(software => `<option value="${software.id}">${software.nom}</option>`)
                        .join('');
                    softwareSelect.innerHTML = '<option value="">Tous les logiciels</option>' + softwareOptions;
                }
            }
        } catch (error) {
            console.error('❌ Erreur lors du chargement des options de filtres:', error);
        }
    }

    /**
     * Configurer les événements
     */
    setupEventListeners() {
        // Boutons d'action
        document.getElementById('refresh-logs')?.addEventListener('click', () => {
            this.loadLogs();
        });
        
        document.getElementById('export-logs')?.addEventListener('click', () => {
            this.exportLogs();
        });
        
        document.getElementById('clean-logs')?.addEventListener('click', () => {
            this.cleanOldLogs();
        });
        
        document.getElementById('apply-filters')?.addEventListener('click', () => {
            this.applyFilters();
        });
        
        // Filtres en temps réel
        ['filter-action', 'filter-table', 'filter-period', 'filter-user', 'filter-software'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', () => {
                this.applyFilters();
            });
        });
    }
    
    /**
     * Charger les logs depuis l'API
     */
    async loadLogs() {
        try {
            console.log('📊 Chargement des logs...', {
                page: this.currentPage,
                limit: this.itemsPerPage,
                filters: this.currentFilters
            });
            
            this.showLoading(true);
            
            // Vérifier que window.logger existe
            if (!window.logger) {
                throw new Error('window.logger non disponible');
            }
            
            const response = await window.logger.getLogs(this.currentPage, this.itemsPerPage, this.currentFilters);
            
            console.log('📊 Réponse getLogs:', response);
            
            this.logs = response.data || [];
            this.totalLogs = response.total || 0;
            
            console.log('📊 Logs chargés:', {
                count: this.logs.length,
                total: this.totalLogs
            });
            
            this.displayLogs();
            this.displayStats();
            this.displayPagination();
            
        } catch (error) {
            console.error('❌ Erreur lors du chargement des logs:', error);
            this.showError(`Erreur lors du chargement des logs: ${error.message}`);
        } finally {
            this.showLoading(false);
        }
    }
    
    /**
     * Afficher les logs
     */
    displayLogs() {
        const container = document.getElementById('logs-list');
        const countElement = document.getElementById('logs-count');
        
        if (countElement) {
            countElement.textContent = `${this.totalLogs} entrée(s)`;
        }
        
        if (this.logs.length === 0) {
            container.innerHTML = `
                <div class="p-8 text-center text-gray-500">
                    <i class="fas fa-history text-4xl mb-4"></i>
                    <p>Aucun log trouvé</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.logs.map(log => {
            const formatted = window.logger.formatLogForDisplay(log);
            const colorClass = window.logger.getActionColor(log.action);
            
            return `
                <div class="p-6 hover:bg-gray-50 transition-colors">
                    <div class="flex items-start justify-between">
                        <div class="flex items-start space-x-4 flex-1">
                            <div class="px-3 py-1 rounded-full text-xs font-medium ${colorClass}">
                                ${formatted.action}
                            </div>
                            
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center space-x-2 mb-2">
                                    <h4 class="text-sm font-medium text-gray-900">
                                        ${formatted.table}${formatted.recordId ? ` (${formatted.recordId.substring(0, 8)}...)` : ''}
                                    </h4>
                                    <span class="text-xs text-gray-500">${formatted.date}</span>
                                </div>
                                
                                ${formatted.details ? `<p class="text-sm text-gray-600 mb-2">${formatted.details}</p>` : ''}
                                
                                ${this.renderLogDetails(formatted)}
                            </div>
                        </div>
                        
                        <button class="toggle-details text-gray-400 hover:text-gray-600 ml-4" data-log-id="${log.id}">
                            <i class="fas fa-chevron-down"></i>
                        </button>
                    </div>
                    
                    <div id="details-${log.id}" class="mt-4 hidden">
                        ${this.renderFullLogDetails(formatted)}
                    </div>
                </div>
            `;
        }).join('');
        
        // Ajouter les événements pour les détails
        container.querySelectorAll('.toggle-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const logId = e.currentTarget.dataset.logId;
                this.toggleLogDetails(logId);
            });
        });
    }
    
    /**
     * Afficher les détails courts d'un log
     */
    renderLogDetails(formatted) {
        if (!formatted.newValues && !formatted.oldValues) {
            return '';
        }
        
        let details = '';
        
        // Pour les actions de modification, montrer les changements principaux
        if (formatted.oldValues && formatted.newValues) {
            const changes = this.detectChanges(formatted.oldValues, formatted.newValues);
            if (changes.length > 0) {
                details += '<div class="mt-2 space-y-1">';
                changes.slice(0, 3).forEach(change => { // Montrer max 3 changements
                    details += `<div class="text-xs bg-blue-50 px-2 py-1 rounded border-l-2 border-blue-300">`;
                    details += `<span class="font-medium text-gray-700">${this.getFieldLabel(change.field)}</span>: `;
                    
                    const oldValueFormatted = this.formatValue(change.oldValue);
                    const newValueFormatted = this.formatValue(change.newValue);
                    
                    // Essayer de résoudre les IDs pour l'affichage court
                    const oldResolved = this.resolveId(change.oldValue, change.field);
                    const newResolved = this.resolveId(change.newValue, change.field);
                    
                    details += `<span class="text-red-600">${oldResolved || oldValueFormatted}</span>`;
                    details += ` <i class="fas fa-arrow-right text-gray-400 mx-1"></i> `;
                    details += `<span class="text-green-600">${newResolved || newValueFormatted}</span>`;
                    details += `</div>`;
                });
                if (changes.length > 3) {
                    details += `<div class="text-xs text-gray-500 pl-2">... et ${changes.length - 3} autre(s) changement(s)</div>`;
                }
                details += '</div>';
            }
        } else if (formatted.newValues) {
            // Pour les créations, montrer les champs principaux
            const mainFields = this.getMainFields(formatted.newValues);
            if (mainFields.length > 0) {
                details += '<div class="mt-2">';
                details += `<div class="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">`;
                details += `<i class="fas fa-plus mr-1"></i>`;
                details += mainFields.map(field => `${this.getFieldLabel(field.key)}: ${this.formatValue(field.value)}`).join(', ');
                details += `</div>`;
                details += '</div>';
            }
        } else if (formatted.oldValues) {
            // Pour les suppressions, montrer les champs principaux
            const mainFields = this.getMainFields(formatted.oldValues);
            if (mainFields.length > 0) {
                details += '<div class="mt-2">';
                details += `<div class="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">`;
                details += `<i class="fas fa-minus mr-1"></i>`;
                details += mainFields.map(field => `${this.getFieldLabel(field.key)}: ${this.formatValue(field.value)}`).join(', ');
                details += `</div>`;
                details += '</div>';
            }
        }
        
        return details;
    }
    
    /**
     * Afficher les détails complets d'un log
     */
    renderFullLogDetails(formatted) {
        let html = '<div class="bg-gray-50 rounded-lg p-4 space-y-4">';
        
        // Changements détaillés pour les modifications
        if (formatted.oldValues && formatted.newValues) {
            const changes = this.detectChanges(formatted.oldValues, formatted.newValues);
            if (changes.length > 0) {
                html += `
                    <div>
                        <h5 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                            <i class="fas fa-exchange-alt mr-2 text-blue-600"></i>
                            Changements détaillés
                        </h5>
                        <div class="space-y-3">
                `;
                
                changes.forEach(change => {
                    html += `
                        <div class="bg-white p-3 rounded-lg border border-gray-200">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium text-gray-800">${this.getFieldLabel(change.field)}</span>
                                <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">${change.field}</span>
                            </div>
                            <div class="flex items-center space-x-3">
                                <div class="flex-1">
                                    <div class="text-xs text-gray-500 mb-1">Avant</div>
                                    <div class="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                                        ${this.formatValueDetailed(change.oldValue, change.field)}
                                    </div>
                                </div>
                                <div class="flex-shrink-0 text-gray-400">
                                    <i class="fas fa-arrow-right text-lg"></i>
                                </div>
                                <div class="flex-1">
                                    <div class="text-xs text-gray-500 mb-1">Maintenant</div>
                                    <div class="p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                                        ${this.formatValueDetailed(change.newValue, change.field)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                });
                
                html += `
                        </div>
                    </div>
                `;
            }
        }
        
        // Pour les créations - montrer les valeurs initiales
        if (formatted.newValues && !formatted.oldValues) {
            html += `
                <div>
                    <h5 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <i class="fas fa-plus mr-2 text-green-600"></i>
                        Valeurs initiales
                    </h5>
                    <div class="bg-white p-3 rounded-lg border border-green-200">
                        ${this.renderObjectValues(formatted.newValues, 'green')}
                    </div>
                </div>
            `;
        }
        
        // Pour les suppressions - montrer les valeurs supprimées
        if (formatted.oldValues && !formatted.newValues) {
            html += `
                <div>
                    <h5 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <i class="fas fa-minus mr-2 text-red-600"></i>
                        Valeurs supprimées
                    </h5>
                    <div class="bg-white p-3 rounded-lg border border-red-200">
                        ${this.renderObjectValues(formatted.oldValues, 'red')}
                    </div>
                </div>
            `;
        }
        
        // Informations utilisateur (plus compact)
        if (formatted.userInfo) {
            html += `
                <div>
                    <h5 class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <i class="fas fa-user mr-2 text-gray-600"></i>
                        Informations de session
                    </h5>
                    <div class="bg-white p-3 rounded-lg border border-gray-200">
                        <div class="grid grid-cols-2 gap-4 text-xs">
                            <div>
                                <span class="text-gray-500">Session active:</span>
                                <span class="ml-1 ${formatted.userInfo.sessionActive ? 'text-green-600' : 'text-red-600'}">
                                    ${formatted.userInfo.sessionActive ? '✓ Oui' : '✗ Non'}
                                </span>
                            </div>
                            <div>
                                <span class="text-gray-500">Connexion:</span>
                                <span class="ml-1">${formatted.userInfo.loginTime}</span>
                            </div>
                        </div>
                        <div class="mt-2 text-xs">
                            <span class="text-gray-500">Navigateur:</span>
                            <div class="mt-1 p-2 bg-gray-50 rounded text-gray-600 font-mono text-xs break-all">
                                ${formatted.userInfo.userAgent?.substring(0, 200)}...
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        html += '</div>';
        return html;
    }
    
    /**
     * Basculer l'affichage des détails d'un log
     */
    toggleLogDetails(logId) {
        const details = document.getElementById(`details-${logId}`);
        const button = document.querySelector(`[data-log-id="${logId}"] i`);
        
        if (details.classList.contains('hidden')) {
            details.classList.remove('hidden');
            button.classList.remove('fa-chevron-down');
            button.classList.add('fa-chevron-up');
        } else {
            details.classList.add('hidden');
            button.classList.remove('fa-chevron-up');
            button.classList.add('fa-chevron-down');
        }
    }
    
    /**
     * Afficher les statistiques
     */
    displayStats() {
        const stats = this.calculateStats();
        const container = document.getElementById('logs-stats');
        
        container.innerHTML = Object.entries(stats).map(([key, value]) => `
            <div class="bg-white p-4 rounded-lg shadow-sm border text-center">
                <div class="text-2xl font-bold text-blue-600">${value}</div>
                <div class="text-sm text-gray-600">${key}</div>
            </div>
        `).join('');
    }
    
    /**
     * Calculer les statistiques
     */
    calculateStats() {
        const stats = {
            'Total': this.totalLogs,
            'Créations': 0,
            'Modifications': 0,
            'Suppressions': 0,
            'Connexions': 0,
            'Archivages': 0
        };
        
        this.logs.forEach(log => {
            switch (log.action) {
                case 'CREATE':
                    stats['Créations']++;
                    break;
                case 'UPDATE':
                    stats['Modifications']++;
                    break;
                case 'DELETE':
                    stats['Suppressions']++;
                    break;
                case 'LOGIN':
                    stats['Connexions']++;
                    break;
                case 'ARCHIVE':
                    stats['Archivages']++;
                    break;
            }
        });
        
        return stats;
    }
    
    /**
     * Afficher la pagination
     */
    displayPagination() {
        const container = document.getElementById('logs-pagination');
        const totalPages = Math.ceil(this.totalLogs / this.itemsPerPage);
        
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }
        
        let html = '<div class="flex items-center justify-between">';
        
        // Informations
        const start = (this.currentPage - 1) * this.itemsPerPage + 1;
        const end = Math.min(this.currentPage * this.itemsPerPage, this.totalLogs);
        html += `<div class="text-sm text-gray-700">Affichage de ${start} à ${end} sur ${this.totalLogs} entrées</div>`;
        
        // Boutons de pagination
        html += '<div class="flex space-x-2">';
        
        if (this.currentPage > 1) {
            html += `<button class="pagination-btn px-3 py-1 border rounded hover:bg-gray-50" data-page="${this.currentPage - 1}">Précédent</button>`;
        }
        
        for (let i = Math.max(1, this.currentPage - 2); i <= Math.min(totalPages, this.currentPage + 2); i++) {
            const active = i === this.currentPage ? 'bg-blue-600 text-white' : 'hover:bg-gray-50';
            html += `<button class="pagination-btn px-3 py-1 border rounded ${active}" data-page="${i}">${i}</button>`;
        }
        
        if (this.currentPage < totalPages) {
            html += `<button class="pagination-btn px-3 py-1 border rounded hover:bg-gray-50" data-page="${this.currentPage + 1}">Suivant</button>`;
        }
        
        html += '</div></div>';
        container.innerHTML = html;
        
        // Ajouter les événements
        container.querySelectorAll('.pagination-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentPage = parseInt(e.target.dataset.page);
                this.loadLogs();
            });
        });
    }
    
    /**
     * Appliquer les filtres
     */
    applyFilters() {
        this.currentFilters = {
            action: document.getElementById('filter-action')?.value || '',
            table: document.getElementById('filter-table')?.value || '',
            period: document.getElementById('filter-period')?.value || '',
            user: document.getElementById('filter-user')?.value || '',
            software: document.getElementById('filter-software')?.value || ''
        };
        
        this.currentPage = 1;
        this.loadLogs();
    }
    
    /**
     * Exporter les logs
     */
    async exportLogs() {
        try {
            // Charger tous les logs
            const allLogs = await window.logger.getLogs(1, 1000, this.currentFilters);
            
            const csvContent = this.convertLogsToCSV(allLogs.data);
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            
            link.href = URL.createObjectURL(blob);
            link.download = `logs_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
            
            this.showSuccess('Logs exportés avec succès');
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'export:', error);
            this.showError('Erreur lors de l\'export des logs');
        }
    }
    
    /**
     * Convertir les logs en CSV
     */
    convertLogsToCSV(logs) {
        const headers = ['Date', 'Action', 'Table', 'ID Enregistrement', 'Détails'];
        const rows = logs.map(log => {
            const formatted = window.logger.formatLogForDisplay(log);
            return [
                formatted.date,
                formatted.action,
                formatted.table,
                formatted.recordId || '',
                formatted.details || ''
            ];
        });
        
        return [headers, ...rows].map(row => 
            row.map(field => `"${(field || '').toString().replace(/"/g, '""')}"`).join(',')
        ).join('\n');
    }
    
    /**
     * Nettoyer les anciens logs
     */
    async cleanOldLogs() {
        if (!confirm('Êtes-vous sûr de vouloir supprimer les logs de plus de 30 jours ?')) {
            return;
        }
        
        try {
            const deletedCount = await window.logger.cleanOldLogs(30);
            this.showSuccess(`${deletedCount} anciens logs supprimés`);
            this.loadLogs(); // Recharger
        } catch (error) {
            console.error('❌ Erreur lors du nettoyage:', error);
            this.showError('Erreur lors du nettoyage des logs');
        }
    }
    
    /**
     * Afficher/masquer le chargement
     */
    showLoading(show) {
        const loading = document.getElementById('logs-loading');
        const list = document.getElementById('logs-list');
        
        if (show) {
            loading?.classList.remove('hidden');
            list?.classList.add('hidden');
        } else {
            loading?.classList.add('hidden');
            list?.classList.remove('hidden');
        }
    }
    
    /**
     * Afficher un message de succès
     */
    showSuccess(message) {
        // Réutiliser le système de notification existant ou créer une simple alerte
        alert(message); // À remplacer par un système de notification plus élégant
    }
    
    /**
     * Afficher un message d'erreur
     */
    showError(message) {
        alert(message); // À remplacer par un système de notification plus élégant
    }
    
    /**
     * Détecter les changements entre anciennes et nouvelles valeurs
     */
    detectChanges(oldValues, newValues) {
        const changes = [];
        const allKeys = new Set([...Object.keys(oldValues), ...Object.keys(newValues)]);
        
        for (const key of allKeys) {
            // Ignorer les champs système
            if (key.startsWith('gs_') || key === 'id' || key === 'created_at' || key === 'updated_at') {
                continue;
            }
            
            const oldValue = oldValues[key];
            const newValue = newValues[key];
            
            // Détecter les changements
            if (oldValue !== newValue) {
                changes.push({
                    field: key,
                    oldValue: oldValue,
                    newValue: newValue
                });
            }
        }
        
        return changes;
    }
    
    /**
     * Obtenir les champs principaux d'un objet
     */
    getMainFields(values) {
        const mainFieldKeys = ['nom', 'prenom', 'email', 'poste', 'description', 'title', 'name'];
        const fields = [];
        
        for (const key of mainFieldKeys) {
            if (values[key] && values[key] !== '') {
                fields.push({ key, value: values[key] });
            }
        }
        
        // Si aucun champ principal trouvé, prendre les premiers champs non-système
        if (fields.length === 0) {
            const otherKeys = Object.keys(values).filter(k => 
                !k.startsWith('gs_') && k !== 'id' && k !== 'created_at' && k !== 'updated_at'
            );
            
            for (let i = 0; i < Math.min(2, otherKeys.length); i++) {
                const key = otherKeys[i];
                if (values[key] && values[key] !== '') {
                    fields.push({ key, value: values[key] });
                }
            }
        }
        
        return fields;
    }
    
    /**
     * Obtenir le libellé d'un champ
     */
    getFieldLabel(fieldName) {
        const labels = {
            'nom': 'Nom',
            'prenom': 'Prénom',
            'email': 'Email',
            'poste': 'Poste',
            'equipe_id': 'Équipe',
            'description': 'Description',
            'title': 'Titre',
            'cout_mensuel': 'Coût mensuel',
            'utilisateur_id': 'Utilisateur',
            'logiciel_id': 'Logiciel',
            'droit_id': 'Droit',
            'archived': 'Archivé',
            'logiciel_de_base': 'Logiciel de base',
            'moyen_paiement': 'Moyen de paiement',
            'periodicite': 'Périodicité',
            'date_souscription': 'Date souscription',
            'niveau': 'Niveau',
            'couleur': 'Couleur'
        };
        
        return labels[fieldName] || fieldName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    /**
     * Formater une valeur pour l'affichage
     */
    formatValue(value) {
        if (value === null || value === undefined) {
            return '<em class="text-gray-400">Vide</em>';
        }
        
        if (typeof value === 'boolean') {
            return value ? '✓ Oui' : '✗ Non';
        }
        
        if (typeof value === 'string' && value.length > 50) {
            return value.substring(0, 50) + '...';
        }
        
        // Formater les IDs d'équipe, utilisateur, etc. (on pourrait les résoudre plus tard)
        if (typeof value === 'string' && value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-/)) {
            return value.substring(0, 8) + '...';
        }
        
        return value.toString();
    }
    
    /**
     * Formater une valeur pour l'affichage détaillé
     */
    formatValueDetailed(value, fieldName = '') {
        if (value === null || value === undefined) {
            return '<em class="text-gray-400 italic">Aucune valeur</em>';
        }
        
        if (typeof value === 'boolean') {
            return value ? '<span class="text-green-600 font-medium">✓ Oui</span>' : '<span class="text-red-600 font-medium">✗ Non</span>';
        }
        
        // Résoudre les IDs en noms compréhensibles
        if (typeof value === 'string' && value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-/)) {
            const resolvedName = this.resolveId(value, fieldName);
            if (resolvedName) {
                return `
                    <div class="space-y-1">
                        <div class="font-medium">${resolvedName}</div>
                        <div class="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">${value.substring(0, 8)}...</div>
                    </div>
                `;
            } else {
                return `<span class="font-mono text-xs bg-gray-100 px-2 py-1 rounded">${value}</span>`;
            }
        }
        
        if (typeof value === 'number') {
            return `<span class="font-medium">${value.toLocaleString('fr-FR')}</span>`;
        }
        
        // Formater les dates
        if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
            try {
                const date = new Date(value);
                return `<span class="font-medium">${date.toLocaleDateString('fr-FR')} ${date.toLocaleTimeString('fr-FR')}</span>`;
            } catch (e) {
                return value.toString();
            }
        }
        
        return `<span class="break-words">${value.toString()}</span>`;
    }
    
    /**
     * Résoudre un ID en nom compréhensible
     */
    resolveId(id, fieldName = '') {
        // Déterminer le type de données à partir du nom du champ
        if (fieldName.includes('utilisateur_id') || fieldName.includes('user_id')) {
            return this.resolveCache.users.get(id);
        }
        
        if (fieldName.includes('logiciel_id') || fieldName.includes('software_id')) {
            return this.resolveCache.software.get(id);
        }
        
        if (fieldName.includes('equipe_id') || fieldName.includes('team_id')) {
            return this.resolveCache.teams.get(id);
        }
        
        if (fieldName.includes('droit_id') || fieldName.includes('right_id')) {
            return this.resolveCache.rights.get(id);
        }
        
        // Essayer de résoudre dans tous les caches si le nom du champ n'est pas explicite
        return this.resolveCache.users.get(id) || 
               this.resolveCache.software.get(id) || 
               this.resolveCache.teams.get(id) || 
               this.resolveCache.rights.get(id);
    }
    
    /**
     * Rendre les valeurs d'un objet de façon structurée
     */
    renderObjectValues(values, colorTheme = 'gray') {
        const colorClasses = {
            green: 'text-green-800 bg-green-50',
            red: 'text-red-800 bg-red-50',
            gray: 'text-gray-800 bg-gray-50'
        };
        
        let html = '<div class="space-y-2">';
        
        Object.entries(values).forEach(([key, value]) => {
            if (key.startsWith('gs_') || key === 'id') return;
            
            html += `
                <div class="flex justify-between items-start">
                    <span class="text-sm font-medium text-gray-600 min-w-0 flex-shrink-0 mr-4">
                        ${this.getFieldLabel(key)}:
                    </span>
                    <div class="text-sm ${colorClasses[colorTheme]} px-2 py-1 rounded flex-1 text-right">
                        ${this.formatValueDetailed(value, key)}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }
}

// Initialiser le gestionnaire de logs
window.logsManager = new LogsManager();