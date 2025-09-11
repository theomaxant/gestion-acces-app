/**
 * GESTIONNAIRE DES RAPPORTS DÉTAILLÉS
 * Avec export Excel et vues détaillées par entité
 */

class ReportsManager {
    constructor() {
        this.users = [];
        this.software = [];
        this.access = [];
        this.costs = [];
        this.droits = [];
        this.teams = [];
        this.currentView = null;
        
        console.log('📊 ReportsManager initialisé');
    }

    async init() {
        console.log('📊 Initialisation ReportsManager...');
        this.setupEventListeners();
    }

    setupEventListeners() {
        console.log('📊 Configuration event listeners...');
        
        setTimeout(() => {
            this.bindEvents();
        }, 100);
    }

    bindEvents() {
        console.log('📊 Liaison des événements...');
        
        // Bouton Vue par Logiciel
        const btnSoftware = document.getElementById('view-by-software-btn');
        if (btnSoftware) {
            btnSoftware.addEventListener('click', (e) => {
                console.log('🖱️ Clic Vue par Logiciel détecté');
                e.preventDefault();
                this.showSoftwareReport();
            });
            console.log('✅ Bouton Logiciel configuré');
        } else {
            console.warn('⚠️ Bouton view-by-software-btn non trouvé');
        }

        // Bouton Vue par Utilisateur  
        const btnUser = document.getElementById('view-by-user-btn');
        if (btnUser) {
            btnUser.addEventListener('click', (e) => {
                console.log('🖱️ Clic Vue par Utilisateur détecté');
                e.preventDefault();
                this.showUserReport();
            });
            console.log('✅ Bouton Utilisateur configuré');
        } else {
            console.warn('⚠️ Bouton view-by-user-btn non trouvé');
        }

        // Bouton Vue par Équipe
        const btnTeam = document.getElementById('view-by-team-btn');
        if (btnTeam) {
            btnTeam.addEventListener('click', (e) => {
                console.log('🖱️ Clic Vue par Équipe détecté');
                e.preventDefault();
                this.showTeamReport();
            });
            console.log('✅ Bouton Équipe configuré');
        } else {
            console.warn('⚠️ Bouton view-by-team-btn non trouvé');
        }
    }

    async loadReports() {
        console.log('📊 [REPORTS] Chargement des données...');
        
        try {
            // Vérifier que l'API Supabase est disponible
            if (!window.supabaseAPI) {
                console.error('❌ [REPORTS] API Supabase non disponible');
                return;
            }
            
            // Charger les données
            console.log('📊 [REPORTS] Chargement utilisateurs...');
            this.users = await window.supabaseAPI.getRecords('utilisateurs') || [];
            
            console.log('📊 [REPORTS] Chargement logiciels...');
            this.software = await window.supabaseAPI.getRecords('logiciels') || [];
            
            console.log('📊 [REPORTS] Chargement accès...');
            this.access = await window.supabaseAPI.getRecords('acces') || [];
            
            console.log('📊 [REPORTS] Chargement coûts...');
            this.costs = await window.supabaseAPI.getRecords('couts_licences') || [];
            
            console.log('📊 [REPORTS] Chargement droits...');
            this.droits = await window.supabaseAPI.getRecords('droits') || [];
            
            console.log('📊 [REPORTS] Chargement équipes...');
            this.teams = await window.supabaseAPI.getRecords('equipes') || [];
            
            console.log('✅ [REPORTS] Données chargées avec succès:', {
                users: this.users.length,
                software: this.software.length,
                access: this.access.length,
                costs: this.costs.length,
                droits: this.droits.length,
                teams: this.teams.length
            });
            
            // Afficher un échantillon des données pour debug
            if (this.software.length > 0) {
                console.log('📊 [REPORTS] Échantillon logiciel:', this.software[0]);
            }
            if (this.users.length > 0) {
                console.log('📊 [REPORTS] Échantillon utilisateur:', this.users[0]);
            }
            if (this.droits.length > 0) {
                console.log('📊 [REPORTS] Échantillon droit:', this.droits[0]);
            }
            
        } catch (error) {
            console.error('❌ [REPORTS] Erreur chargement:', error);
            console.error('❌ [REPORTS] Détails erreur:', error.message);
        }
    }

    async showSoftwareReport() {
        console.log('📊 Affichage rapport logiciels détaillé');
        
        // Toujours recharger les données pour être sûr qu'elles sont à jour
        await this.loadReports();
        
        const container = document.getElementById('detailed-reports-container');
        if (!container) {
            console.error('❌ Container detailed-reports-container non trouvé');
            return;
        }
        
        // Afficher le container
        container.classList.remove('hidden');
        this.updateActiveButton('view-by-software-btn');
        
        // Générer les données détaillées
        const reportData = this.generateDetailedSoftwareReport();
        container.innerHTML = this.renderDetailedSoftwareReport(reportData);
        
        console.log('✅ Rapport logiciels détaillé affiché');
    }

    async showUserReport() {
        console.log('📊 Affichage rapport utilisateurs détaillé');
        
        // Toujours recharger les données pour être sûr qu'elles sont à jour
        await this.loadReports();
        
        const container = document.getElementById('detailed-reports-container');
        if (!container) {
            console.error('❌ Container detailed-reports-container non trouvé');
            return;
        }
        
        // Afficher le container
        container.classList.remove('hidden');
        this.updateActiveButton('view-by-user-btn');
        
        // Générer les données détaillées
        const reportData = this.generateDetailedUserReport();
        container.innerHTML = this.renderDetailedUserReport(reportData);
        
        console.log('✅ Rapport utilisateurs détaillé affiché');
    }

    async showTeamReport() {
        console.log('📊 Affichage rapport équipes détaillé');
        
        // Toujours recharger les données pour être sûr qu'elles sont à jour
        await this.loadReports();
        
        const container = document.getElementById('detailed-reports-container');
        if (!container) {
            console.error('❌ Container detailed-reports-container non trouvé');
            return;
        }
        
        // Afficher le container
        container.classList.remove('hidden');
        this.updateActiveButton('view-by-team-btn');
        
        // Générer les données détaillées
        const reportData = this.generateDetailedTeamReport();
        container.innerHTML = this.renderDetailedTeamReport(reportData);
        
        console.log('✅ Rapport équipes détaillé affiché');
    }

    generateDetailedSoftwareReport() {
        console.log('📊 [REPORTS] Génération rapport détaillé par logiciel');
        console.log('📊 [REPORTS] Nombre de logiciels:', this.software.length);
        console.log('📊 [REPORTS] Nombre de droits:', this.droits.length);
        console.log('📊 [REPORTS] Nombre d\'utilisateurs:', this.users.length);
        
        if (this.software.length === 0) {
            console.warn('⚠️ [REPORTS] Aucun logiciel trouvé - Utilisation des données de test');
            return this.generateTestSoftwareData();
        }
        
        return this.software.map(soft => {
            console.log('📊 [REPORTS] Traitement logiciel:', soft.nom, 'ID:', soft.id);
            
            // Trouver tous les droits pour ce logiciel
            const softwareDroits = this.droits.filter(d => d.logiciel_id === soft.id);
            console.log('📊 [REPORTS] Droits trouvés pour', soft.nom, ':', softwareDroits.length);
            
            // Trouver tous les utilisateurs ayant accès
            const softwareUsers = softwareDroits.map(droit => {
                const user = this.users.find(u => u.id === droit.utilisateur_id);
                if (!user) {
                    console.warn('⚠️ [REPORTS] Utilisateur non trouvé pour droit:', droit);
                }
                return {
                    id: user?.id || 0,
                    nom: user?.nom || 'Inconnu',
                    prenom: user?.prenom || '',
                    email: user?.email || 'N/A',
                    equipe: user?.equipe || 'N/A',
                    niveau: droit.niveau || 'Utilisateur',
                    date_attribution: droit.date_attribution || 'N/A',
                    statut: user?.statut || 'Inconnu'
                };
            });
            
            console.log('📊 [REPORTS] Utilisateurs pour', soft.nom, ':', softwareUsers.length);
            
            // Calculer les coûts
            const softwareCosts = this.costs.filter(c => c.logiciel_id === soft.id);
            const totalCost = softwareCosts.reduce((sum, c) => sum + (parseFloat(c.cout_mensuel) || 0), 0);
            console.log('📊 [REPORTS] Coût total pour', soft.nom, ':', totalCost);
            
            return {
                id: soft.id,
                nom: soft.nom || 'Sans nom',
                editeur: soft.editeur || 'N/A',
                version: soft.version || 'N/A',
                statut: soft.statut || 'Actif',
                description: soft.description || 'N/A',
                users: softwareUsers,
                totalUsers: softwareUsers.length,
                totalCost: totalCost,
                costs: softwareCosts
            };
        });
    }

    generateDetailedUserReport() {
        console.log('📊 [REPORTS] Génération rapport détaillé par utilisateur');
        console.log('📊 [REPORTS] Nombre d\'utilisateurs:', this.users.length);
        
        if (this.users.length === 0) {
            console.warn('⚠️ [REPORTS] Aucun utilisateur trouvé - Utilisation des données de test');
            return this.generateTestUserData();
        }
        
        return this.users.map(user => {
            // Trouver tous les droits de cet utilisateur
            const userDroits = this.droits.filter(d => d.utilisateur_id === user.id);
            
            // Trouver tous les logiciels auxquels il a accès
            const userSoftware = userDroits.map(droit => {
                const soft = this.software.find(s => s.id === droit.logiciel_id);
                const cost = this.costs.find(c => c.logiciel_id === droit.logiciel_id);
                
                return {
                    id: soft?.id || 0,
                    nom: soft?.nom || 'Inconnu',
                    editeur: soft?.editeur || 'N/A',
                    version: soft?.version || 'N/A',
                    niveau: droit.niveau || 'Utilisateur',
                    date_attribution: droit.date_attribution || 'N/A',
                    cout_mensuel: parseFloat(cost?.cout_mensuel) || 0,
                    statut: soft?.statut || 'Inconnu'
                };
            });
            
            const totalCost = userSoftware.reduce((sum, s) => sum + s.cout_mensuel, 0);
            
            return {
                id: user.id,
                nom: user.nom || 'Sans nom',
                prenom: user.prenom || '',
                email: user.email || 'N/A',
                equipe: user.equipe || 'N/A',
                statut: user.statut || 'Actif',
                telephone: user.telephone || 'N/A',
                software: userSoftware,
                totalSoftware: userSoftware.length,
                totalCost: totalCost
            };
        });
    }

    generateDetailedTeamReport() {
        console.log('📊 [REPORTS] Génération rapport détaillé par équipe');
        console.log('📊 [REPORTS] Nombre d\'équipes:', this.teams.length);
        
        if (this.teams.length === 0) {
            console.warn('⚠️ [REPORTS] Aucune équipe trouvée - Utilisation des données de test');
            return this.generateTestTeamData();
        }
        
        return this.teams.map(team => {
            // Trouver tous les utilisateurs de cette équipe
            const teamUsers = this.users.filter(u => u.equipe_id === team.id);
            
            // Trouver tous les logiciels utilisés par l'équipe
            const teamUserIds = teamUsers.map(u => u.id);
            const teamDroits = this.droits.filter(d => teamUserIds.includes(d.utilisateur_id));
            
            // Logiciels uniques utilisés par l'équipe
            const uniqueSoftwareIds = [...new Set(teamDroits.map(d => d.logiciel_id))];
            const teamSoftware = uniqueSoftwareIds.map(softId => {
                const soft = this.software.find(s => s.id === softId);
                const softUsers = teamDroits.filter(d => d.logiciel_id === softId);
                const cost = this.costs.find(c => c.logiciel_id === softId);
                
                return {
                    id: soft?.id || 0,
                    nom: soft?.nom || 'Inconnu',
                    editeur: soft?.editeur || 'N/A',
                    version: soft?.version || 'N/A',
                    utilisateurs_count: softUsers.length,
                    cout_mensuel: parseFloat(cost?.cout_mensuel) || 0,
                    cout_total: (parseFloat(cost?.cout_mensuel) || 0) * softUsers.length,
                    statut: soft?.statut || 'Inconnu'
                };
            });
            
            const totalCost = teamSoftware.reduce((sum, s) => sum + s.cout_total, 0);
            
            return {
                id: team.id,
                nom: team.nom || 'Sans nom',
                description: team.description || 'N/A',
                users: teamUsers.map(u => ({
                    id: u.id,
                    nom: u.nom || 'Sans nom',
                    prenom: u.prenom || '',
                    email: u.email || 'N/A',
                    statut: u.statut || 'Actif'
                })),
                software: teamSoftware,
                totalUsers: teamUsers.length,
                totalSoftware: uniqueSoftwareIds.length,
                totalCost: totalCost
            };
        });
    }

    renderDetailedSoftwareReport(data) {
        const totalSoftware = data.length;
        const totalUsers = data.reduce((sum, item) => sum + item.totalUsers, 0);
        const totalCost = data.reduce((sum, item) => sum + item.totalCost, 0);
        
        return `
            <div class="space-y-6">
                <!-- En-tête avec statistiques et export -->
                <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h2 class="text-2xl font-bold mb-2">
                                <i class="fas fa-desktop mr-3"></i>Rapport Détaillé par Logiciel
                            </h2>
                            <p class="text-blue-100">Vue complète des logiciels avec leurs utilisateurs</p>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="window.reportsManager.exportSoftwareReportExcel()" 
                                    class="bg-green-500 hover:bg-green-600 px-4 py-2 rounded flex items-center">
                                <i class="fas fa-file-excel mr-2"></i>Export Excel Général
                            </button>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="text-center">
                            <div class="text-3xl font-bold">${totalSoftware}</div>
                            <div class="text-blue-100">Logiciels</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold">${totalUsers}</div>
                            <div class="text-blue-100">Total Utilisateurs</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold">${totalCost.toFixed(2)}€</div>
                            <div class="text-blue-100">Coût Total</div>
                        </div>
                    </div>
                </div>
                
                <!-- Liste détaillée des logiciels -->
                <div class="space-y-4">
                    ${data.map(software => `
                        <div class="bg-white rounded-lg shadow-lg border">
                            <div class="p-4 border-b bg-gray-50">
                                <div class="flex justify-between items-center">
                                    <div>
                                        <h3 class="text-xl font-bold text-gray-800">${software.nom}</h3>
                                        <div class="flex gap-4 text-sm text-gray-600 mt-1">
                                            <span><i class="fas fa-building mr-1"></i>${software.editeur}</span>
                                            <span><i class="fas fa-tag mr-1"></i>v${software.version}</span>
                                            <span class="px-2 py-1 rounded ${software.statut === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">${software.statut}</span>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-2xl font-bold text-blue-600">${software.totalUsers}</div>
                                        <div class="text-sm text-gray-500">utilisateurs</div>
                                        <div class="text-lg font-semibold text-green-600">${software.totalCost.toFixed(2)}€/mois</div>
                                        <button onclick="window.reportsManager.exportSingleSoftwareExcel(${software.id})" 
                                                class="mt-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs">
                                            <i class="fas fa-download mr-1"></i>Export
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            ${software.users.length > 0 ? `
                                <div class="p-4">
                                    <h4 class="font-semibold text-gray-700 mb-3">
                                        <i class="fas fa-users mr-2"></i>Utilisateurs (${software.users.length})
                                    </h4>
                                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        ${software.users.map(user => `
                                            <div class="bg-gray-50 p-3 rounded border">
                                                <div class="font-medium">${user.nom} ${user.prenom}</div>
                                                <div class="text-sm text-gray-600">${user.email}</div>
                                                <div class="text-xs text-gray-500 mt-1">
                                                    <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded">${user.niveau}</span>
                                                    <span class="ml-2">${user.equipe}</span>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : `
                                <div class="p-4 text-center text-gray-500">
                                    <i class="fas fa-user-slash text-2xl mb-2"></i>
                                    <div>Aucun utilisateur assigné</div>
                                </div>
                            `}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderDetailedUserReport(data) {
        const totalUsers = data.length;
        const totalSoftware = data.reduce((sum, item) => sum + item.totalSoftware, 0);
        const totalCost = data.reduce((sum, item) => sum + item.totalCost, 0);
        
        return `
            <div class="space-y-6">
                <!-- En-tête avec statistiques et export -->
                <div class="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h2 class="text-2xl font-bold mb-2">
                                <i class="fas fa-user mr-3"></i>Rapport Détaillé par Utilisateur
                            </h2>
                            <p class="text-purple-100">Vue complète des utilisateurs avec leurs logiciels</p>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="window.reportsManager.exportUserReportExcel()" 
                                    class="bg-green-500 hover:bg-green-600 px-4 py-2 rounded flex items-center">
                                <i class="fas fa-file-excel mr-2"></i>Export Excel Général
                            </button>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="text-center">
                            <div class="text-3xl font-bold">${totalUsers}</div>
                            <div class="text-purple-100">Utilisateurs</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold">${totalSoftware}</div>
                            <div class="text-purple-100">Total Accès</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold">${totalCost.toFixed(2)}€</div>
                            <div class="text-purple-100">Coût Total</div>
                        </div>
                    </div>
                </div>
                
                <!-- Liste détaillée des utilisateurs -->
                <div class="space-y-4">
                    ${data.map(user => `
                        <div class="bg-white rounded-lg shadow-lg border">
                            <div class="p-4 border-b bg-gray-50">
                                <div class="flex justify-between items-center">
                                    <div>
                                        <h3 class="text-xl font-bold text-gray-800">${user.nom} ${user.prenom}</h3>
                                        <div class="flex gap-4 text-sm text-gray-600 mt-1">
                                            <span><i class="fas fa-envelope mr-1"></i>${user.email}</span>
                                            <span><i class="fas fa-users mr-1"></i>${user.equipe}</span>
                                            <span class="px-2 py-1 rounded ${user.statut === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">${user.statut}</span>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-2xl font-bold text-purple-600">${user.totalSoftware}</div>
                                        <div class="text-sm text-gray-500">logiciels</div>
                                        <div class="text-lg font-semibold text-green-600">${user.totalCost.toFixed(2)}€/mois</div>
                                        <button onclick="window.reportsManager.exportSingleUserExcel(${user.id})" 
                                                class="mt-1 bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-xs">
                                            <i class="fas fa-download mr-1"></i>Export
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            ${user.software.length > 0 ? `
                                <div class="p-4">
                                    <h4 class="font-semibold text-gray-700 mb-3">
                                        <i class="fas fa-desktop mr-2"></i>Logiciels (${user.software.length})
                                    </h4>
                                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        ${user.software.map(soft => `
                                            <div class="bg-gray-50 p-3 rounded border">
                                                <div class="font-medium">${soft.nom}</div>
                                                <div class="text-sm text-gray-600">${soft.editeur} v${soft.version}</div>
                                                <div class="text-xs text-gray-500 mt-1 flex justify-between">
                                                    <span class="bg-purple-100 text-purple-800 px-2 py-1 rounded">${soft.niveau}</span>
                                                    <span class="text-green-600 font-medium">${soft.cout_mensuel}€/mois</span>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : `
                                <div class="p-4 text-center text-gray-500">
                                    <i class="fas fa-desktop text-2xl mb-2"></i>
                                    <div>Aucun logiciel assigné</div>
                                </div>
                            `}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderDetailedTeamReport(data) {
        const totalTeams = data.length;
        const totalUsers = data.reduce((sum, item) => sum + item.totalUsers, 0);
        const totalCost = data.reduce((sum, item) => sum + item.totalCost, 0);
        
        return `
            <div class="space-y-6">
                <!-- En-tête avec statistiques et export -->
                <div class="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h2 class="text-2xl font-bold mb-2">
                                <i class="fas fa-users mr-3"></i>Rapport Détaillé par Équipe
                            </h2>
                            <p class="text-orange-100">Vue complète des équipes avec utilisateurs et logiciels</p>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="window.reportsManager.exportTeamReportExcel()" 
                                    class="bg-green-500 hover:bg-green-600 px-4 py-2 rounded flex items-center">
                                <i class="fas fa-file-excel mr-2"></i>Export Excel Général
                            </button>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="text-center">
                            <div class="text-3xl font-bold">${totalTeams}</div>
                            <div class="text-orange-100">Équipes</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold">${totalUsers}</div>
                            <div class="text-orange-100">Total Utilisateurs</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl font-bold">${totalCost.toFixed(2)}€</div>
                            <div class="text-orange-100">Coût Total</div>
                        </div>
                    </div>
                </div>
                
                <!-- Liste détaillée des équipes -->
                <div class="space-y-4">
                    ${data.map(team => `
                        <div class="bg-white rounded-lg shadow-lg border">
                            <div class="p-4 border-b bg-gray-50">
                                <div class="flex justify-between items-center">
                                    <div>
                                        <h3 class="text-xl font-bold text-gray-800">${team.nom}</h3>
                                        <div class="text-sm text-gray-600 mt-1">${team.description}</div>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-2xl font-bold text-orange-600">${team.totalUsers}</div>
                                        <div class="text-sm text-gray-500">utilisateurs</div>
                                        <div class="text-lg font-semibold text-green-600">${team.totalCost.toFixed(2)}€/mois</div>
                                        <button onclick="window.reportsManager.exportSingleTeamExcel(${team.id})" 
                                                class="mt-1 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs">
                                            <i class="fas fa-download mr-1"></i>Export
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="p-4">
                                <!-- Utilisateurs -->
                                ${team.users.length > 0 ? `
                                    <div class="mb-6">
                                        <h4 class="font-semibold text-gray-700 mb-3">
                                            <i class="fas fa-users mr-2"></i>Utilisateurs (${team.users.length})
                                        </h4>
                                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            ${team.users.map(user => `
                                                <div class="bg-blue-50 p-3 rounded border">
                                                    <div class="font-medium">${user.nom} ${user.prenom}</div>
                                                    <div class="text-sm text-gray-600">${user.email}</div>
                                                    <div class="text-xs mt-1">
                                                        <span class="px-2 py-1 rounded ${user.statut === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">${user.statut}</span>
                                                    </div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                                
                                <!-- Logiciels -->
                                ${team.software.length > 0 ? `
                                    <div>
                                        <h4 class="font-semibold text-gray-700 mb-3">
                                            <i class="fas fa-desktop mr-2"></i>Logiciels (${team.software.length})
                                        </h4>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            ${team.software.map(soft => `
                                                <div class="bg-green-50 p-3 rounded border">
                                                    <div class="flex justify-between items-start">
                                                        <div>
                                                            <div class="font-medium">${soft.nom}</div>
                                                            <div class="text-sm text-gray-600">${soft.editeur} v${soft.version}</div>
                                                            <div class="text-xs text-gray-500 mt-1">${soft.utilisateurs_count} utilisateurs</div>
                                                        </div>
                                                        <div class="text-right">
                                                            <div class="text-sm text-green-600 font-medium">${soft.cout_mensuel}€/mois/user</div>
                                                            <div class="text-lg font-bold text-green-700">${soft.cout_total.toFixed(2)}€/mois</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : `
                                    <div class="text-center text-gray-500 py-4">
                                        <i class="fas fa-desktop text-2xl mb-2"></i>
                                        <div>Aucun logiciel utilisé</div>
                                    </div>
                                `}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // FONCTIONS D'EXPORT EXCEL

    async exportSoftwareReportExcel() {
        console.log('📊 Export Excel - Rapport Logiciels');
        
        try {
            // Générer les données
            const reportData = this.generateDetailedSoftwareReport();
            
            // Créer le workbook
            const wb = XLSX.utils.book_new();
            
            // Feuille principale - Résumé
            const summaryData = reportData.map(soft => ({
                'Logiciel': soft.nom,
                'Éditeur': soft.editeur,
                'Version': soft.version,
                'Statut': soft.statut,
                'Nb Utilisateurs': soft.totalUsers,
                'Coût Mensuel €': soft.totalCost.toFixed(2)
            }));
            
            const ws1 = XLSX.utils.json_to_sheet(summaryData);
            XLSX.utils.book_append_sheet(wb, ws1, 'Résumé Logiciels');
            
            // Feuille détaillée - Tous les utilisateurs par logiciel
            const detailedData = [];
            reportData.forEach(soft => {
                soft.users.forEach(user => {
                    detailedData.push({
                        'Logiciel': soft.nom,
                        'Éditeur': soft.editeur,
                        'Version': soft.version,
                        'Utilisateur': `${user.nom} ${user.prenom}`,
                        'Email': user.email,
                        'Équipe': user.equipe,
                        'Niveau d\'accès': user.niveau,
                        'Date Attribution': user.date_attribution,
                        'Statut Utilisateur': user.statut
                    });
                });
            });
            
            const ws2 = XLSX.utils.json_to_sheet(detailedData);
            XLSX.utils.book_append_sheet(wb, ws2, 'Détail Utilisateurs');
            
            // Télécharger
            XLSX.writeFile(wb, `Rapport_Logiciels_${new Date().toISOString().split('T')[0]}.xlsx`);
            
            console.log('✅ Export Excel réussi - Rapport Logiciels');
        } catch (error) {
            console.error('❌ Erreur export Excel:', error);
            alert('Erreur lors de l\'export Excel');
        }
    }

    async exportUserReportExcel() {
        console.log('📊 Export Excel - Rapport Utilisateurs');
        
        try {
            const reportData = this.generateDetailedUserReport();
            const wb = XLSX.utils.book_new();
            
            // Feuille résumé utilisateurs
            const summaryData = reportData.map(user => ({
                'Utilisateur': `${user.nom} ${user.prenom}`,
                'Email': user.email,
                'Équipe': user.equipe,
                'Statut': user.statut,
                'Nb Logiciels': user.totalSoftware,
                'Coût Mensuel €': user.totalCost.toFixed(2)
            }));
            
            const ws1 = XLSX.utils.json_to_sheet(summaryData);
            XLSX.utils.book_append_sheet(wb, ws1, 'Résumé Utilisateurs');
            
            // Feuille détaillée - Tous les logiciels par utilisateur
            const detailedData = [];
            reportData.forEach(user => {
                user.software.forEach(soft => {
                    detailedData.push({
                        'Utilisateur': `${user.nom} ${user.prenom}`,
                        'Email': user.email,
                        'Équipe': user.equipe,
                        'Logiciel': soft.nom,
                        'Éditeur': soft.editeur,
                        'Version': soft.version,
                        'Niveau d\'accès': soft.niveau,
                        'Date Attribution': soft.date_attribution,
                        'Coût Mensuel €': soft.cout_mensuel.toFixed(2)
                    });
                });
            });
            
            const ws2 = XLSX.utils.json_to_sheet(detailedData);
            XLSX.utils.book_append_sheet(wb, ws2, 'Détail Logiciels');
            
            XLSX.writeFile(wb, `Rapport_Utilisateurs_${new Date().toISOString().split('T')[0]}.xlsx`);
            console.log('✅ Export Excel réussi - Rapport Utilisateurs');
        } catch (error) {
            console.error('❌ Erreur export Excel:', error);
            alert('Erreur lors de l\'export Excel');
        }
    }

    async exportTeamReportExcel() {
        console.log('📊 Export Excel - Rapport Équipes');
        
        try {
            const reportData = this.generateDetailedTeamReport();
            const wb = XLSX.utils.book_new();
            
            // Feuille résumé équipes
            const summaryData = reportData.map(team => ({
                'Équipe': team.nom,
                'Description': team.description,
                'Nb Utilisateurs': team.totalUsers,
                'Nb Logiciels': team.totalSoftware,
                'Coût Mensuel €': team.totalCost.toFixed(2)
            }));
            
            const ws1 = XLSX.utils.json_to_sheet(summaryData);
            XLSX.utils.book_append_sheet(wb, ws1, 'Résumé Équipes');
            
            // Feuille utilisateurs par équipe
            const userData = [];
            reportData.forEach(team => {
                team.users.forEach(user => {
                    userData.push({
                        'Équipe': team.nom,
                        'Utilisateur': `${user.nom} ${user.prenom}`,
                        'Email': user.email,
                        'Statut': user.statut
                    });
                });
            });
            
            const ws2 = XLSX.utils.json_to_sheet(userData);
            XLSX.utils.book_append_sheet(wb, ws2, 'Utilisateurs par Équipe');
            
            // Feuille logiciels par équipe
            const softwareData = [];
            reportData.forEach(team => {
                team.software.forEach(soft => {
                    softwareData.push({
                        'Équipe': team.nom,
                        'Logiciel': soft.nom,
                        'Éditeur': soft.editeur,
                        'Version': soft.version,
                        'Nb Utilisateurs': soft.utilisateurs_count,
                        'Coût Unit. €': soft.cout_mensuel.toFixed(2),
                        'Coût Total €': soft.cout_total.toFixed(2)
                    });
                });
            });
            
            const ws3 = XLSX.utils.json_to_sheet(softwareData);
            XLSX.utils.book_append_sheet(wb, ws3, 'Logiciels par Équipe');
            
            XLSX.writeFile(wb, `Rapport_Equipes_${new Date().toISOString().split('T')[0]}.xlsx`);
            console.log('✅ Export Excel réussi - Rapport Équipes');
        } catch (error) {
            console.error('❌ Erreur export Excel:', error);
            alert('Erreur lors de l\'export Excel');
        }
    }

    async exportSingleSoftwareExcel(softwareId) {
        console.log('📊 Export Excel - Logiciel individuel:', softwareId);
        
        try {
            const reportData = this.generateDetailedSoftwareReport();
            const software = reportData.find(s => s.id === softwareId);
            
            if (!software) {
                alert('Logiciel non trouvé');
                return;
            }
            
            const wb = XLSX.utils.book_new();
            
            // Données des utilisateurs
            const userData = software.users.map(user => ({
                'Nom': user.nom,
                'Prénom': user.prenom,
                'Email': user.email,
                'Équipe': user.equipe,
                'Niveau d\'accès': user.niveau,
                'Date Attribution': user.date_attribution,
                'Statut': user.statut
            }));
            
            const ws = XLSX.utils.json_to_sheet(userData);
            XLSX.utils.book_append_sheet(wb, ws, software.nom.substring(0, 31));
            
            XLSX.writeFile(wb, `${software.nom}_Utilisateurs_${new Date().toISOString().split('T')[0]}.xlsx`);
            console.log('✅ Export Excel réussi - Logiciel individuel');
        } catch (error) {
            console.error('❌ Erreur export Excel:', error);
            alert('Erreur lors de l\'export Excel');
        }
    }

    async exportSingleUserExcel(userId) {
        console.log('📊 Export Excel - Utilisateur individuel:', userId);
        
        try {
            const reportData = this.generateDetailedUserReport();
            const user = reportData.find(u => u.id === userId);
            
            if (!user) {
                alert('Utilisateur non trouvé');
                return;
            }
            
            const wb = XLSX.utils.book_new();
            
            const softwareData = user.software.map(soft => ({
                'Logiciel': soft.nom,
                'Éditeur': soft.editeur,
                'Version': soft.version,
                'Niveau d\'accès': soft.niveau,
                'Date Attribution': soft.date_attribution,
                'Coût Mensuel €': soft.cout_mensuel.toFixed(2),
                'Statut': soft.statut
            }));
            
            const ws = XLSX.utils.json_to_sheet(softwareData);
            XLSX.utils.book_append_sheet(wb, ws, `${user.nom}_${user.prenom}`.substring(0, 31));
            
            XLSX.writeFile(wb, `${user.nom}_${user.prenom}_Logiciels_${new Date().toISOString().split('T')[0]}.xlsx`);
            console.log('✅ Export Excel réussi - Utilisateur individuel');
        } catch (error) {
            console.error('❌ Erreur export Excel:', error);
            alert('Erreur lors de l\'export Excel');
        }
    }

    async exportSingleTeamExcel(teamId) {
        console.log('📊 Export Excel - Équipe individuelle:', teamId);
        
        try {
            const reportData = this.generateDetailedTeamReport();
            const team = reportData.find(t => t.id === teamId);
            
            if (!team) {
                alert('Équipe non trouvée');
                return;
            }
            
            const wb = XLSX.utils.book_new();
            
            // Feuille utilisateurs
            const userData = team.users.map(user => ({
                'Nom': user.nom,
                'Prénom': user.prenom,
                'Email': user.email,
                'Statut': user.statut
            }));
            
            const ws1 = XLSX.utils.json_to_sheet(userData);
            XLSX.utils.book_append_sheet(wb, ws1, 'Utilisateurs');
            
            // Feuille logiciels
            const softwareData = team.software.map(soft => ({
                'Logiciel': soft.nom,
                'Éditeur': soft.editeur,
                'Version': soft.version,
                'Nb Utilisateurs': soft.utilisateurs_count,
                'Coût Unit. €': soft.cout_mensuel.toFixed(2),
                'Coût Total €': soft.cout_total.toFixed(2)
            }));
            
            const ws2 = XLSX.utils.json_to_sheet(softwareData);
            XLSX.utils.book_append_sheet(wb, ws2, 'Logiciels');
            
            XLSX.writeFile(wb, `Equipe_${team.nom}_${new Date().toISOString().split('T')[0]}.xlsx`);
            console.log('✅ Export Excel réussi - Équipe individuelle');
        } catch (error) {
            console.error('❌ Erreur export Excel:', error);
            alert('Erreur lors de l\'export Excel');
        }
    }

    updateActiveButton(activeId) {
        // Réinitialiser les boutons
        const buttons = ['view-by-software-btn', 'view-by-user-btn', 'view-by-team-btn'];
        
        buttons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.classList.remove('ring-4', 'ring-blue-300');
                btn.classList.add('hover:shadow-lg');
            }
        });
        
        // Activer le bouton sélectionné
        const activeBtn = document.getElementById(activeId);
        if (activeBtn) {
            activeBtn.classList.add('ring-4', 'ring-blue-300');
            activeBtn.classList.remove('hover:shadow-lg');
        }
    }

    // FONCTIONS DE DONNÉES DE TEST (pour debugging)
    generateTestSoftwareData() {
        return [
            {
                id: 1,
                nom: 'Microsoft Office 365',
                editeur: 'Microsoft',
                version: '2024',
                statut: 'Actif',
                description: 'Suite bureautique complète',
                users: [
                    {
                        id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@empresa.com',
                        equipe: 'IT', niveau: 'Administrateur', date_attribution: '2024-01-15', statut: 'Actif'
                    },
                    {
                        id: 2, nom: 'Martin', prenom: 'Marie', email: 'marie.martin@empresa.com', 
                        equipe: 'RH', niveau: 'Utilisateur', date_attribution: '2024-02-01', statut: 'Actif'
                    }
                ],
                totalUsers: 2,
                totalCost: 25.50,
                costs: [{id: 1, cout_mensuel: 12.75}]
            },
            {
                id: 2,
                nom: 'Adobe Photoshop',
                editeur: 'Adobe',
                version: 'CC 2024',
                statut: 'Actif',
                description: 'Logiciel de retouche photo',
                users: [
                    {
                        id: 3, nom: 'Moreau', prenom: 'Sophie', email: 'sophie.moreau@empresa.com',
                        equipe: 'Design', niveau: 'Utilisateur', date_attribution: '2024-01-20', statut: 'Actif'
                    }
                ],
                totalUsers: 1,
                totalCost: 22.99,
                costs: [{id: 2, cout_mensuel: 22.99}]
            }
        ];
    }

    generateTestUserData() {
        return [
            {
                id: 1,
                nom: 'Dupont',
                prenom: 'Jean',
                email: 'jean.dupont@empresa.com',
                equipe: 'IT',
                statut: 'Actif',
                telephone: '01.23.45.67.89',
                software: [
                    {
                        id: 1, nom: 'Microsoft Office 365', editeur: 'Microsoft', version: '2024',
                        niveau: 'Administrateur', date_attribution: '2024-01-15', cout_mensuel: 12.75, statut: 'Actif'
                    },
                    {
                        id: 3, nom: 'Slack', editeur: 'Slack Technologies', version: 'Pro',
                        niveau: 'Utilisateur', date_attribution: '2024-02-10', cout_mensuel: 8.00, statut: 'Actif'
                    }
                ],
                totalSoftware: 2,
                totalCost: 20.75
            },
            {
                id: 2,
                nom: 'Martin',
                prenom: 'Marie', 
                email: 'marie.martin@empresa.com',
                equipe: 'RH',
                statut: 'Actif',
                telephone: '01.23.45.67.90',
                software: [
                    {
                        id: 1, nom: 'Microsoft Office 365', editeur: 'Microsoft', version: '2024',
                        niveau: 'Utilisateur', date_attribution: '2024-02-01', cout_mensuel: 12.75, statut: 'Actif'
                    }
                ],
                totalSoftware: 1,
                totalCost: 12.75
            }
        ];
    }

    generateTestTeamData() {
        return [
            {
                id: 1,
                nom: 'Équipe IT',
                description: 'Département informatique et technique',
                users: [
                    {id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@empresa.com', statut: 'Actif'},
                    {id: 4, nom: 'Durand', prenom: 'Pierre', email: 'pierre.durand@empresa.com', statut: 'Actif'}
                ],
                software: [
                    {
                        id: 1, nom: 'Microsoft Office 365', editeur: 'Microsoft', version: '2024',
                        utilisateurs_count: 2, cout_mensuel: 12.75, cout_total: 25.50, statut: 'Actif'
                    },
                    {
                        id: 3, nom: 'Slack Pro', editeur: 'Slack Technologies', version: 'Pro',
                        utilisateurs_count: 2, cout_mensuel: 8.00, cout_total: 16.00, statut: 'Actif'
                    }
                ],
                totalUsers: 2,
                totalSoftware: 2,
                totalCost: 41.50
            },
            {
                id: 2,
                nom: 'Équipe RH',
                description: 'Ressources humaines',
                users: [
                    {id: 2, nom: 'Martin', prenom: 'Marie', email: 'marie.martin@empresa.com', statut: 'Actif'}
                ],
                software: [
                    {
                        id: 1, nom: 'Microsoft Office 365', editeur: 'Microsoft', version: '2024',
                        utilisateurs_count: 1, cout_mensuel: 12.75, cout_total: 12.75, statut: 'Actif'
                    }
                ],
                totalUsers: 1,
                totalSoftware: 1,
                totalCost: 12.75
            }
        ];
    }
}

// Fonction d'initialisation globale
function initReportsManager() {
    console.log('📊 Initialisation ReportsManager globale');
    
    if (!window.reportsManager) {
        window.reportsManager = new ReportsManager();
        window.reportsManager.init();
        console.log('✅ ReportsManager créé');
    }
    
    return window.reportsManager;
}

// Auto-initialisation
if (typeof window !== 'undefined') {
    window.initReportsManager = initReportsManager;
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initReportsManager);
    } else {
        initReportsManager();
    }
}

console.log('📊 Fichier reports.js détaillé chargé');