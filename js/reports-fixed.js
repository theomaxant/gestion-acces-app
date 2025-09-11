// Gestionnaire des rapports et analyses - Version corrigée
class ReportsManager {
    constructor() {
        this.users = [];
        this.software = [];
        this.access = [];
        this.costs = [];
        this.droits = [];
        this.currentView = null;
        this.init();
    }

    async init() {
        await this.loadDroits();
        this.setupEventListeners();
    }

    async loadDroits() {
        try {
            const result = await window.D1API.get('droits');
            this.droits = result?.data || [];
        } catch (error) {
            console.error('Erreur lors du chargement des droits:', error);
        }
    }

    setupEventListeners() {
        console.log('Setup event listeners pour les rapports');
        
        const softwareBtn = document.getElementById('view-by-software-btn');
        if (softwareBtn) {
            softwareBtn.addEventListener('click', () => {
                console.log('Clic sur vue par logiciel');
                this.showSoftwareView();
            });
            console.log('Event listener ajouté pour view-by-software-btn');
        } else {
            console.warn('Élément view-by-software-btn non trouvé');
        }

        const userBtn = document.getElementById('view-by-user-btn');
        if (userBtn) {
            userBtn.addEventListener('click', () => {
                console.log('Clic sur vue par utilisateur');
                this.showUserView();
            });
            console.log('Event listener ajouté pour view-by-user-btn');
        } else {
            console.warn('Élément view-by-user-btn non trouvé');
        }

        const teamBtn = document.getElementById('view-by-team-btn');
        if (teamBtn) {
            teamBtn.addEventListener('click', () => {
                console.log('Clic sur vue par équipe');
                this.showTeamView();
            });
            console.log('Event listener ajouté pour view-by-team-btn');
        } else {
            console.warn('Élément view-by-team-btn non trouvé');
        }
    }

    async loadReports() {
        try {
            const [usersResult, softwareResult, accessResult, costsResult] = await Promise.all([
                window.D1API.get('utilisateurs'),
                window.D1API.get('logiciels'),
                window.D1API.get('acces'),
                window.D1API.get('couts_licences')
            ]);

            this.users = usersResult?.data || [];
            this.software = softwareResult?.data || [];
            this.access = accessResult?.data || [];
            this.costs = costsResult?.data || [];
            
            // FIX: Setup event listeners maintenant que la vue est visible
            console.log('Re-setup des event listeners pour les rapports...');
            this.setupEventListeners();
            
        } catch (error) {
            console.error('Erreur lors du chargement des données de rapport:', error);
            if (window.app && window.app.showAlert) {
                window.app.showAlert('Erreur lors du chargement des données', 'error');
            }
        }
    }

    async showSoftwareView() {
        console.log('Affichage de la vue par logiciel');
        await this.loadReports();
        this.currentView = 'software';
        
        const container = document.getElementById('detailed-reports-container');
        if (!container) {
            console.warn('Container detailed-reports-container non trouvé');
            return;
        }

        // Afficher le container
        container.classList.remove('hidden');
        
        // Version simplifiée du contenu
        const activeSoftware = this.software.filter(s => !s.archived);
        
        const html = `
            <div class="mb-6">
                <h3 class="text-2xl font-bold text-gray-800 mb-4">Vue par Logiciel</h3>
                <p class="text-gray-600">Analyse des coûts et utilisateurs par logiciel</p>
            </div>
            
            <div class="grid gap-6">
                ${activeSoftware.map(software => {
                    const softwareAccess = this.access.filter(a => a.logiciel_id === software.id);
                    const softwareCosts = this.costs.filter(c => c.logiciel_id === software.id);
                    const totalCost = softwareCosts.reduce((sum, c) => sum + (c.cout_mensuel || 0), 0);
                    
                    return `
                        <div class="bg-white border rounded-lg p-6">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <h4 class="text-lg font-semibold text-gray-900">${software.nom || 'Logiciel'}</h4>
                                    <p class="text-sm text-gray-500">Version: ${software.version || 'N/A'}</p>
                                </div>
                                <div class="text-right">
                                    <div class="text-lg font-bold text-green-600">${totalCost.toFixed(2)}€/mois</div>
                                    <div class="text-sm text-gray-500">${softwareAccess.length} utilisateurs</div>
                                </div>
                            </div>
                            
                            <div class="space-y-2">
                                ${softwareAccess.slice(0, 5).map(access => {
                                    const user = this.users.find(u => u.id === access.utilisateur_id);
                                    return `
                                        <div class="flex justify-between text-sm">
                                            <span>${user?.nom || 'Utilisateur'}</span>
                                            <span class="text-gray-500">${access.date_attribution || 'N/A'}</span>
                                        </div>
                                    `;
                                }).join('')}
                                ${softwareAccess.length > 5 ? `<div class="text-sm text-gray-500">... et ${softwareAccess.length - 5} autres</div>` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        
        container.innerHTML = html;
        console.log('Vue par logiciel affichée');
    }

    async showUserView() {
        console.log('Affichage de la vue par utilisateur');
        await this.loadReports();
        this.currentView = 'user';
        
        const container = document.getElementById('detailed-reports-container');
        if (!container) {
            console.warn('Container detailed-reports-container non trouvé');
            return;
        }

        // Afficher le container
        container.classList.remove('hidden');
        
        // Version simplifiée du contenu
        const html = `
            <div class="mb-6">
                <h3 class="text-2xl font-bold text-gray-800 mb-4">Vue par Utilisateur</h3>
                <p class="text-gray-600">Analyse des logiciels et coûts par utilisateur</p>
            </div>
            
            <div class="grid gap-6">
                ${this.users.map(user => {
                    const userAccess = this.access.filter(a => a.utilisateur_id === user.id);
                    const userSoftware = userAccess.map(access => {
                        return this.software.find(s => s.id === access.logiciel_id);
                    }).filter(Boolean);
                    
                    return `
                        <div class="bg-white border rounded-lg p-6">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <h4 class="text-lg font-semibold text-gray-900">${user.nom || 'Utilisateur'}</h4>
                                    <p class="text-sm text-gray-500">${user.email || 'N/A'}</p>
                                </div>
                                <div class="text-right">
                                    <div class="text-lg font-bold text-blue-600">${userSoftware.length} logiciels</div>
                                    <div class="text-sm text-gray-500">Équipe: ${user.equipe || 'N/A'}</div>
                                </div>
                            </div>
                            
                            <div class="space-y-2">
                                ${userSoftware.slice(0, 5).map(software => `
                                    <div class="flex justify-between text-sm">
                                        <span>${software?.nom || 'Logiciel'}</span>
                                        <span class="text-gray-500">${software?.version || 'N/A'}</span>
                                    </div>
                                `).join('')}
                                ${userSoftware.length > 5 ? `<div class="text-sm text-gray-500">... et ${userSoftware.length - 5} autres</div>` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        
        container.innerHTML = html;
        console.log('Vue par utilisateur affichée');
    }

    async showTeamView() {
        console.log('Affichage de la vue par équipe');
        await this.loadReports();
        this.currentView = 'team';
        
        const container = document.getElementById('detailed-reports-container');
        if (!container) {
            console.warn('Container detailed-reports-container non trouvé');
            return;
        }

        // Afficher le container
        container.classList.remove('hidden');
        
        // Grouper les utilisateurs par équipe
        const teamGroups = {};
        this.users.forEach(user => {
            const team = user.equipe || 'Sans équipe';
            if (!teamGroups[team]) {
                teamGroups[team] = [];
            }
            teamGroups[team].push(user);
        });
        
        const html = `
            <div class="mb-6">
                <h3 class="text-2xl font-bold text-gray-800 mb-4">Vue par Équipe</h3>
                <p class="text-gray-600">Budget et logiciels par équipe</p>
            </div>
            
            <div class="grid gap-6">
                ${Object.entries(teamGroups).map(([teamName, teamUsers]) => {
                    const teamAccess = this.access.filter(a => 
                        teamUsers.some(user => user.id === a.utilisateur_id)
                    );
                    const teamSoftware = new Set(teamAccess.map(a => a.logiciel_id)).size;
                    
                    return `
                        <div class="bg-white border rounded-lg p-6">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <h4 class="text-lg font-semibold text-gray-900">${teamName}</h4>
                                    <p class="text-sm text-gray-500">${teamUsers.length} membres</p>
                                </div>
                                <div class="text-right">
                                    <div class="text-lg font-bold text-purple-600">${teamSoftware} logiciels</div>
                                    <div class="text-sm text-gray-500">${teamAccess.length} accès</div>
                                </div>
                            </div>
                            
                            <div class="space-y-2">
                                <h5 class="font-medium text-gray-700">Membres :</h5>
                                ${teamUsers.slice(0, 5).map(user => `
                                    <div class="flex justify-between text-sm">
                                        <span>${user.nom}</span>
                                        <span class="text-gray-500">${user.email || 'N/A'}</span>
                                    </div>
                                `).join('')}
                                ${teamUsers.length > 5 ? `<div class="text-sm text-gray-500">... et ${teamUsers.length - 5} autres</div>` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        
        container.innerHTML = html;
        console.log('Vue par équipe affichée');
    }
}

// Initialiser le gestionnaire de rapports
function initReportsManager() {
    if (!window.reportsManager) {
        window.reportsManager = new ReportsManager();
        console.log('ReportsManager initialisé');
    }
    return window.reportsManager;
}

// Initialiser dès que possible
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReportsManager);
} else {
    initReportsManager();
}