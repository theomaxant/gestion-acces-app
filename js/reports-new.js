/**
 * GESTIONNAIRE DES RAPPORTS - VERSION REFAITE DE ZÉRO
 * Approche simple et robuste pour les rapports
 */

class ReportsManager {
    constructor() {
        this.data = {
            users: [],
            software: [],
            access: [],
            costs: [],
            droits: [],
            teams: []
        };
        
        this.currentView = 'software'; // Vue par défaut
        this.isLoading = false;
        
        console.log('📊 [REPORTS] ReportsManager créé');
    }

    /**
     * Initialisation du gestionnaire
     */
    async init() {
        console.log('📊 [REPORTS] Initialisation...');
        
        try {
            // Vérifier les dépendances
            if (!window.supabaseAPI) {
                throw new Error('API Supabase non disponible');
            }
            
            console.log('📊 [REPORTS] Dépendances OK');
            this.setupEventListeners();
            console.log('📊 [REPORTS] Initialisé avec succès');
            
        } catch (error) {
            console.error('❌ [REPORTS] Erreur init:', error);
        }
    }

    /**
     * Configuration des event listeners
     */
    setupEventListeners() {
        console.log('📊 [REPORTS] Configuration event listeners...');
        
        // Attendre que le DOM soit prêt
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.bindEvents());
        } else {
            this.bindEvents();
        }
    }

    /**
     * Liaison des événements aux boutons
     */
    bindEvents() {
        console.log('📊 [REPORTS] Liaison des événements...');
        
        // Bouton Vue par Logiciel
        const btnSoftware = document.getElementById('btn-reports-software');
        if (btnSoftware) {
            btnSoftware.addEventListener('click', (e) => {
                console.log('🖱️ [REPORTS] Clic: Vue par Logiciel');
                e.preventDefault();
                e.stopPropagation();
                this.showSoftwareReport();
            });
            console.log('✅ [REPORTS] Bouton Logiciel lié');
        } else {
            console.warn('⚠️ [REPORTS] Bouton btn-reports-software non trouvé');
        }

        // Bouton Vue par Utilisateur
        const btnUser = document.getElementById('btn-reports-user');
        if (btnUser) {
            btnUser.addEventListener('click', (e) => {
                console.log('🖱️ [REPORTS] Clic: Vue par Utilisateur');
                e.preventDefault();
                e.stopPropagation();
                this.showUserReport();
            });
            console.log('✅ [REPORTS] Bouton Utilisateur lié');
        } else {
            console.warn('⚠️ [REPORTS] Bouton btn-reports-user non trouvé');
        }

        // Bouton Vue par Équipe
        const btnTeam = document.getElementById('btn-reports-team');
        if (btnTeam) {
            btnTeam.addEventListener('click', (e) => {
                console.log('🖱️ [REPORTS] Clic: Vue par Équipe');
                e.preventDefault();
                e.stopPropagation();
                this.showTeamReport();
            });
            console.log('✅ [REPORTS] Bouton Équipe lié');
        } else {
            console.warn('⚠️ [REPORTS] Bouton btn-reports-team non trouvé');
        }
    }

    /**
     * Chargement des données pour les rapports
     */
    async loadReports() {
        console.log('📊 [REPORTS] Chargement des données...');
        
        if (this.isLoading) {
            console.log('⏳ [REPORTS] Chargement déjà en cours');
            return;
        }
        
        this.isLoading = true;
        this.showLoading(true);
        
        try {
            // Charger toutes les données en parallèle
            const [users, software, access, costs, droits, teams] = await Promise.all([
                this.loadUsers(),
                this.loadSoftware(), 
                this.loadAccess(),
                this.loadCosts(),
                this.loadDroits(),
                this.loadTeams()
            ]);
            
            this.data = { users, software, access, costs, droits, teams };
            
            console.log('✅ [REPORTS] Données chargées:', {
                users: users.length,
                software: software.length,
                access: access.length,
                costs: costs.length,
                droits: droits.length,
                teams: teams.length
            });
            
            // Afficher le rapport par défaut
            this.showCurrentReport();
            
        } catch (error) {
            console.error('❌ [REPORTS] Erreur chargement:', error);
            this.showError('Erreur lors du chargement des données');
        } finally {
            this.isLoading = false;
            this.showLoading(false);
        }
    }

    /**
     * Chargement des utilisateurs
     */
    async loadUsers() {
        try {
            return await window.supabaseAPI.getRecords('utilisateurs');
        } catch (error) {
            console.error('❌ [REPORTS] Erreur utilisateurs:', error);
            return [];
        }
    }

    /**
     * Chargement des logiciels
     */
    async loadSoftware() {
        try {
            return await window.supabaseAPI.getRecords('logiciels');
        } catch (error) {
            console.error('❌ [REPORTS] Erreur logiciels:', error);
            return [];
        }
    }

    /**
     * Chargement des accès
     */
    async loadAccess() {
        try {
            return await window.supabaseAPI.getRecords('acces');
        } catch (error) {
            console.error('❌ [REPORTS] Erreur accès:', error);
            return [];
        }
    }

    /**
     * Chargement des coûts
     */
    async loadCosts() {
        try {
            return await window.supabaseAPI.getRecords('couts_licences');
        } catch (error) {
            console.error('❌ [REPORTS] Erreur coûts:', error);
            return [];
        }
    }

    /**
     * Chargement des droits
     */
    async loadDroits() {
        try {
            return await window.supabaseAPI.getRecords('droits');
        } catch (error) {
            console.error('❌ [REPORTS] Erreur droits:', error);
            return [];
        }
    }

    /**
     * Chargement des équipes
     */
    async loadTeams() {
        try {
            return await window.supabaseAPI.getRecords('equipes');
        } catch (error) {
            console.error('❌ [REPORTS] Erreur équipes:', error);
            return [];
        }
    }

    /**
     * Afficher le rapport par logiciel
     */
    async showSoftwareReport() {
        console.log('📊 [REPORTS] Génération rapport par logiciel...');
        this.currentView = 'software';
        
        if (!this.data.software || this.data.software.length === 0) {
            await this.loadReports();
            return;
        }
        
        this.updateActiveButton('btn-reports-software');
        
        const container = document.getElementById('reports-content');
        if (!container) {
            console.error('❌ [REPORTS] Container reports-content non trouvé');
            return;
        }
        
        // Générer le rapport
        const reportData = this.generateSoftwareReportData();
        const html = this.renderSoftwareReport(reportData);
        
        container.innerHTML = html;
        console.log('✅ [REPORTS] Rapport logiciels affiché');
        
        // Logger l'action
        if (window.logger) {
            window.logger.logAction('RAPPORT_LOGICIEL', 'Consultation du rapport par logiciel');
        }
    }

    /**
     * Afficher le rapport par utilisateur
     */
    async showUserReport() {
        console.log('📊 [REPORTS] Génération rapport par utilisateur...');
        this.currentView = 'user';
        
        if (!this.data.users || this.data.users.length === 0) {
            await this.loadReports();
            return;
        }
        
        this.updateActiveButton('btn-reports-user');
        
        const container = document.getElementById('reports-content');
        if (!container) {
            console.error('❌ [REPORTS] Container reports-content non trouvé');
            return;
        }
        
        // Générer le rapport
        const reportData = this.generateUserReportData();
        const html = this.renderUserReport(reportData);
        
        container.innerHTML = html;
        console.log('✅ [REPORTS] Rapport utilisateurs affiché');
        
        // Logger l'action
        if (window.logger) {
            window.logger.logAction('RAPPORT_UTILISATEUR', 'Consultation du rapport par utilisateur');
        }
    }

    /**
     * Afficher le rapport par équipe
     */
    async showTeamReport() {
        console.log('📊 [REPORTS] Génération rapport par équipe...');
        this.currentView = 'team';
        
        if (!this.data.teams || this.data.teams.length === 0) {
            await this.loadReports();
            return;
        }
        
        this.updateActiveButton('btn-reports-team');
        
        const container = document.getElementById('reports-content');
        if (!container) {
            console.error('❌ [REPORTS] Container reports-content non trouvé');
            return;
        }
        
        // Générer le rapport
        const reportData = this.generateTeamReportData();
        const html = this.renderTeamReport(reportData);
        
        container.innerHTML = html;
        console.log('✅ [REPORTS] Rapport équipes affiché');
        
        // Logger l'action
        if (window.logger) {
            window.logger.logAction('RAPPORT_EQUIPE', 'Consultation du rapport par équipe');
        }
    }

    /**
     * Générer les données du rapport logiciels
     */
    generateSoftwareReportData() {
        const { software, droits, costs } = this.data;
        
        return software.map(soft => {
            const softwareDroits = droits.filter(d => d.logiciel_id === soft.id);
            const softwareCosts = costs.filter(c => c.logiciel_id === soft.id);
            
            const totalUsers = softwareDroits.length;
            const totalCost = softwareCosts.reduce((sum, c) => sum + (c.cout_mensuel || 0), 0);
            
            return {
                id: soft.id,
                nom: soft.nom || 'Sans nom',
                editeur: soft.editeur || 'N/A',
                version: soft.version || 'N/A',
                statut: soft.statut || 'Actif',
                totalUsers,
                totalCost: totalCost.toFixed(2),
                droits: softwareDroits
            };
        });
    }

    /**
     * Générer les données du rapport utilisateurs
     */
    generateUserReportData() {
        const { users, droits, costs, software } = this.data;
        
        return users.map(user => {
            const userDroits = droits.filter(d => d.utilisateur_id === user.id);
            const userSoftware = userDroits.map(d => {
                const soft = software.find(s => s.id === d.logiciel_id);
                const cost = costs.find(c => c.logiciel_id === d.logiciel_id);
                
                return {
                    nom: soft?.nom || 'Inconnu',
                    niveau: d.niveau || 'Utilisateur',
                    cout: cost?.cout_mensuel || 0
                };
            });
            
            const totalCost = userSoftware.reduce((sum, s) => sum + s.cout, 0);
            
            return {
                id: user.id,
                nom: user.nom || 'Sans nom',
                prenom: user.prenom || '',
                email: user.email || 'N/A',
                equipe: user.equipe || 'N/A',
                statut: user.statut || 'Actif',
                totalSoftware: userSoftware.length,
                totalCost: totalCost.toFixed(2),
                software: userSoftware
            };
        });
    }

    /**
     * Générer les données du rapport équipes
     */
    generateTeamReportData() {
        const { teams, users, droits, costs } = this.data;
        
        return teams.map(team => {
            const teamUsers = users.filter(u => u.equipe_id === team.id);
            const teamDroits = droits.filter(d => 
                teamUsers.some(u => u.id === d.utilisateur_id)
            );
            
            const totalCost = teamDroits.reduce((sum, d) => {
                const cost = costs.find(c => c.logiciel_id === d.logiciel_id);
                return sum + (cost?.cout_mensuel || 0);
            }, 0);
            
            return {
                id: team.id,
                nom: team.nom || 'Sans nom',
                description: team.description || 'N/A',
                totalUsers: teamUsers.length,
                totalAccess: teamDroits.length,
                totalCost: totalCost.toFixed(2),
                users: teamUsers
            };
        });
    }

    /**
     * Rendu du rapport logiciels
     */
    renderSoftwareReport(data) {
        if (!data || data.length === 0) {
            return '<div class="text-center p-8 text-gray-500">Aucun logiciel trouvé</div>';
        }
        
        const totalCost = data.reduce((sum, item) => sum + parseFloat(item.totalCost || 0), 0);
        const totalUsers = data.reduce((sum, item) => sum + item.totalUsers, 0);
        
        return `
            <div class="space-y-6">
                <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                    <h2 class="text-2xl font-bold mb-4">
                        <i class="fas fa-desktop mr-3"></i>Rapport par Logiciel
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="text-center">
                            <div class="text-3xl font-bold">${data.length}</div>
                            <div class="text-blue-100">Logiciels</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold">${totalUsers}</div>
                            <div class="text-blue-100">Utilisateurs</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold">${totalCost.toFixed(2)}€</div>
                            <div class="text-blue-100">Coût Total</div>
                        </div>
                    </div>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="w-full bg-white rounded-lg shadow">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-4 py-3 text-left font-semibold">Logiciel</th>
                                <th class="px-4 py-3 text-left font-semibold">Éditeur</th>
                                <th class="px-4 py-3 text-left font-semibold">Version</th>
                                <th class="px-4 py-3 text-center font-semibold">Utilisateurs</th>
                                <th class="px-4 py-3 text-right font-semibold">Coût Mensuel</th>
                                <th class="px-4 py-3 text-center font-semibold">Statut</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${data.map(item => `
                                <tr class="hover:bg-gray-50">
                                    <td class="px-4 py-3 font-medium">${item.nom}</td>
                                    <td class="px-4 py-3 text-gray-600">${item.editeur}</td>
                                    <td class="px-4 py-3 text-gray-600">${item.version}</td>
                                    <td class="px-4 py-3 text-center">
                                        <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                            ${item.totalUsers}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3 text-right font-medium">${item.totalCost}€</td>
                                    <td class="px-4 py-3 text-center">
                                        <span class="px-2 py-1 rounded-full text-sm ${
                                            item.statut === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }">
                                            ${item.statut}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    /**
     * Rendu du rapport utilisateurs
     */
    renderUserReport(data) {
        if (!data || data.length === 0) {
            return '<div class="text-center p-8 text-gray-500">Aucun utilisateur trouvé</div>';
        }
        
        const totalCost = data.reduce((sum, item) => sum + parseFloat(item.totalCost || 0), 0);
        const totalSoftware = data.reduce((sum, item) => sum + item.totalSoftware, 0);
        
        return `
            <div class="space-y-6">
                <div class="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                    <h2 class="text-2xl font-bold mb-4">
                        <i class="fas fa-user mr-3"></i>Rapport par Utilisateur
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="text-center">
                            <div class="text-3xl font-bold">${data.length}</div>
                            <div class="text-purple-100">Utilisateurs</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold">${totalSoftware}</div>
                            <div class="text-purple-100">Accès Total</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold">${totalCost.toFixed(2)}€</div>
                            <div class="text-purple-100">Coût Total</div>
                        </div>
                    </div>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="w-full bg-white rounded-lg shadow">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-4 py-3 text-left font-semibold">Utilisateur</th>
                                <th class="px-4 py-3 text-left font-semibold">Email</th>
                                <th class="px-4 py-3 text-left font-semibold">Équipe</th>
                                <th class="px-4 py-3 text-center font-semibold">Logiciels</th>
                                <th class="px-4 py-3 text-right font-semibold">Coût Mensuel</th>
                                <th class="px-4 py-3 text-center font-semibold">Statut</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${data.map(item => `
                                <tr class="hover:bg-gray-50">
                                    <td class="px-4 py-3 font-medium">${item.nom} ${item.prenom}</td>
                                    <td class="px-4 py-3 text-gray-600">${item.email}</td>
                                    <td class="px-4 py-3 text-gray-600">${item.equipe}</td>
                                    <td class="px-4 py-3 text-center">
                                        <span class="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
                                            ${item.totalSoftware}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3 text-right font-medium">${item.totalCost}€</td>
                                    <td class="px-4 py-3 text-center">
                                        <span class="px-2 py-1 rounded-full text-sm ${
                                            item.statut === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }">
                                            ${item.statut}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    /**
     * Rendu du rapport équipes
     */
    renderTeamReport(data) {
        if (!data || data.length === 0) {
            return '<div class="text-center p-8 text-gray-500">Aucune équipe trouvée</div>';
        }
        
        const totalUsers = data.reduce((sum, item) => sum + item.totalUsers, 0);
        const totalCost = data.reduce((sum, item) => sum + parseFloat(item.totalCost || 0), 0);
        
        return `
            <div class="space-y-6">
                <div class="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
                    <h2 class="text-2xl font-bold mb-4">
                        <i class="fas fa-users mr-3"></i>Rapport par Équipe
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="text-center">
                            <div class="text-3xl font-bold">${data.length}</div>
                            <div class="text-orange-100">Équipes</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold">${totalUsers}</div>
                            <div class="text-orange-100">Utilisateurs</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold">${totalCost.toFixed(2)}€</div>
                            <div class="text-orange-100">Coût Total</div>
                        </div>
                    </div>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="w-full bg-white rounded-lg shadow">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-4 py-3 text-left font-semibold">Équipe</th>
                                <th class="px-4 py-3 text-left font-semibold">Description</th>
                                <th class="px-4 py-3 text-center font-semibold">Utilisateurs</th>
                                <th class="px-4 py-3 text-center font-semibold">Accès</th>
                                <th class="px-4 py-3 text-right font-semibold">Coût Mensuel</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${data.map(item => `
                                <tr class="hover:bg-gray-50">
                                    <td class="px-4 py-3 font-medium">${item.nom}</td>
                                    <td class="px-4 py-3 text-gray-600">${item.description}</td>
                                    <td class="px-4 py-3 text-center">
                                        <span class="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm">
                                            ${item.totalUsers}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3 text-center">
                                        <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                            ${item.totalAccess}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3 text-right font-medium">${item.totalCost}€</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    /**
     * Mettre à jour le bouton actif
     */
    updateActiveButton(activeId) {
        // Réinitialiser tous les boutons
        const buttons = ['btn-reports-software', 'btn-reports-user', 'btn-reports-team'];
        buttons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.classList.remove('bg-opacity-90', 'ring-2', 'ring-white');
                btn.classList.add('hover:bg-opacity-80');
            }
        });
        
        // Activer le bouton sélectionné
        const activeBtn = document.getElementById(activeId);
        if (activeBtn) {
            activeBtn.classList.add('bg-opacity-90', 'ring-2', 'ring-white');
            activeBtn.classList.remove('hover:bg-opacity-80');
        }
    }

    /**
     * Afficher le rapport actuel
     */
    showCurrentReport() {
        switch (this.currentView) {
            case 'software':
                this.showSoftwareReport();
                break;
            case 'user':
                this.showUserReport();
                break;
            case 'team':
                this.showTeamReport();
                break;
            default:
                this.showSoftwareReport();
        }
    }

    /**
     * Afficher/masquer le loading
     */
    showLoading(show) {
        const container = document.getElementById('reports-content');
        if (!container) return;
        
        if (show) {
            container.innerHTML = `
                <div class="text-center p-12">
                    <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <div class="mt-4 text-gray-600">Chargement des rapports...</div>
                </div>
            `;
        }
    }

    /**
     * Afficher une erreur
     */
    showError(message) {
        const container = document.getElementById('reports-content');
        if (!container) return;
        
        container.innerHTML = `
            <div class="text-center p-12">
                <div class="text-red-500 text-6xl mb-4">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="text-xl text-gray-800 mb-2">Erreur</div>
                <div class="text-gray-600">${message}</div>
                <button onclick="window.reportsManager.loadReports()" class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                    Réessayer
                </button>
            </div>
        `;
    }
}

/**
 * Fonction d'initialisation globale
 */
function initReportsManager() {
    console.log('📊 [REPORTS] Initialisation globale...');
    
    if (!window.reportsManager) {
        window.reportsManager = new ReportsManager();
        window.reportsManager.init();
        console.log('✅ [REPORTS] ReportsManager créé et initialisé');
    } else {
        console.log('ℹ️ [REPORTS] ReportsManager déjà existant');
    }
    
    return window.reportsManager;
}

// Auto-initialisation
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReportsManager);
} else {
    initReportsManager();
}

console.log('📊 [REPORTS] Fichier reports-new.js chargé');