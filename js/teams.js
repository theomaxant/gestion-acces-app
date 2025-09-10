// Gestionnaire des équipes
class TeamsManager {
    constructor() {
        this.teams = [];
        this.users = [];
        this.software = [];
        this.access = [];
        this.costs = [];
        this.droits = [];
        this.showArchived = false;
        this.init();
    }

    async init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('add-team-btn')?.addEventListener('click', () => {
            this.showAddTeamModal();
        });

        document.getElementById('show-archived-teams')?.addEventListener('change', (e) => {
            this.showArchived = e.target.checked;
            this.loadTeams();
        });

        // Search functionality
        document.getElementById('teams-search')?.addEventListener('input', (e) => {
            this.filterTeams(e.target.value);
        });
    }

    async loadTeams() {
        try {
            const [teamsResult, usersResult, softwareResult, accessResult, costsResult, droitsResult] = await Promise.all([
                fetch('tables/equipes').then(r => r.json()),
                fetch('tables/utilisateurs').then(r => r.json()),
                fetch('tables/logiciels').then(r => r.json()),
                fetch('tables/acces').then(r => r.json()),
                fetch('tables/couts_licences').then(r => r.json()),
                fetch('tables/droits').then(r => r.json())
            ]);

            this.teams = teamsResult.data || [];
            this.users = usersResult.data || [];
            this.software = softwareResult.data || [];
            this.access = accessResult.data || [];
            this.costs = costsResult.data || [];
            this.droits = droitsResult.data || [];

            this.renderTeamsTable();
        } catch (error) {
            console.error('Erreur lors du chargement des équipes:', error);
            window.app?.showAlert('Erreur lors du chargement des équipes', 'error');
        }
    }

    filterTeams(searchTerm) {
        const rows = document.querySelectorAll('#teams-table-container tbody tr');
        const term = searchTerm.toLowerCase();

        rows.forEach(row => {
            const name = row.cells[0]?.textContent.toLowerCase() || '';
            const description = row.cells[1]?.textContent.toLowerCase() || '';
            const members = row.cells[2]?.textContent.toLowerCase() || '';

            if (name.includes(term) || description.includes(term) || members.includes(term)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    renderTeamsTable() {
        const container = document.getElementById('teams-table-container');
        if (!container) return;

        const filteredTeams = this.showArchived ? 
            this.teams : 
            this.teams.filter(t => !t.archived);

        const tableHtml = `
            <table class="min-w-full table-auto">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onclick="window.teamsManager.sortTable('nom')">
                            Équipe <i class="fas fa-sort ml-1"></i>
                        </th>
                        <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <span class="hidden sm:inline">Nb Utilisateurs</span>
                            <span class="sm:hidden">Nb</span>
                        </th>
                        <th class="hidden lg:table-cell px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <span class="hidden xl:inline">Coût Logiciels/Mois</span>
                            <span class="xl:hidden">Log/Mois</span>
                        </th>
                        <th class="hidden lg:table-cell px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <span class="hidden xl:inline">Coût Logiciels/An</span>
                            <span class="xl:hidden">Log/An</span>
                        </th>
                        <th class="hidden lg:table-cell px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <span class="hidden xl:inline">Coût Users/Mois</span>
                            <span class="xl:hidden">User/Mois</span>
                        </th>
                        <th class="hidden lg:table-cell px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <span class="hidden xl:inline">Coût Users/An</span>
                            <span class="xl:hidden">User/An</span>
                        </th>
                        <th class="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th class="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${filteredTeams.map(team => this.renderTeamRow(team)).join('')}
                </tbody>
            </table>
            ${filteredTeams.length === 0 ? '<div class="text-center py-8 text-gray-500 text-sm sm:text-base">Aucune équipe trouvée</div>' : ''}
        `;

        container.innerHTML = tableHtml;
    }

    renderTeamRow(team) {
        const userCount = this.getUserCountForTeam(team.id);
        const teamSoftwareMonthlyCost = this.getTeamSoftwareCost(team.id);
        const teamSoftwareAnnualCost = teamSoftwareMonthlyCost * 12;
        const teamUserMonthlyCost = this.getTeamUsersCost(team.id);
        const teamUserAnnualCost = teamUserMonthlyCost * 12;
        
        return `
            <tr class="${team.archived ? 'bg-gray-50 text-gray-500' : ''}">
                <td class="px-3 sm:px-6 py-3 sm:py-4">
                    <div class="text-sm font-medium text-gray-900">${team.nom}</div>
                    ${team.description ? `<div class="text-xs text-gray-500 mt-1">${team.description}</div>` : ''}
                </td>
                <td class="px-3 sm:px-6 py-3 sm:py-4 text-center">
                    <div class="text-sm text-gray-900">${userCount}</div>
                </td>
                <td class="hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4 text-right">
                    <div class="text-sm font-medium text-gray-900">${teamSoftwareMonthlyCost.toFixed(2)}€</div>
                </td>
                <td class="hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4 text-right">
                    <div class="text-sm font-medium text-gray-900">${teamSoftwareAnnualCost.toFixed(2)}€</div>
                </td>
                <td class="hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4 text-right">
                    <div class="text-sm font-medium text-gray-900">${teamUserMonthlyCost.toFixed(2)}€</div>
                </td>
                <td class="hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4 text-right">
                    <div class="text-sm font-medium text-gray-900">${teamUserAnnualCost.toFixed(2)}€</div>
                </td>
                <td class="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        team.archived ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }">
                        ${team.archived ? 'Archivée' : 'Active'}
                    </span>
                </td>
                <td class="px-3 sm:px-6 py-3 sm:py-4 text-right">
                    <div class="flex justify-end space-x-1 sm:space-x-2">
                        <button onclick="window.teamsManager.editTeam('${team.id}')" 
                                class="text-blue-600 hover:text-blue-900 p-1" title="Modifier">
                            <i class="fas fa-edit text-sm"></i>
                        </button>
                        <button onclick="window.teamsManager.viewTeamMembers('${team.id}')" 
                                class="text-purple-600 hover:text-purple-900 p-1" title="Voir les membres">
                            <i class="fas fa-users text-sm"></i>
                        </button>
                        ${!team.archived ? 
                            `<button onclick="window.teamsManager.archiveTeam('${team.id}')" 
                                     class="text-red-600 hover:text-red-900 p-1" title="Archiver">
                                <i class="fas fa-archive text-sm"></i>
                             </button>` :
                            `<button onclick="window.teamsManager.unarchiveTeam('${team.id}')" 
                                     class="text-green-600 hover:text-green-900 p-1" title="Désarchiver">
                                <i class="fas fa-undo text-sm"></i>
                             </button>`
                        }
                    </div>
                    ${!team.archived && window.innerWidth < 640 ? 
                        `<div class="sm:hidden mt-1">
                            <span class="px-2 py-1 text-xs font-semibold rounded-full ${
                                team.archived ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }">
                                Active
                            </span>
                         </div>` : ''
                    }
                </td>
            </tr>
        `;
    }

    getUserCountForTeam(teamId) {
        return this.users.filter(u => u.equipe_id === teamId && !u.archived).length;
    }

    // Calcule le coût mensuel des logiciels dédiés au budget de l'équipe
    getTeamSoftwareCost(teamId) {
        const teamSoftware = this.software.filter(s => s.equipe_id === teamId && !s.archived);
        let totalCost = 0;

        teamSoftware.forEach(software => {
            // Trouver tous les accès à ce logiciel
            const softwareAccess = this.access.filter(a => a.logiciel_id === software.id);
            const processedShared = new Set();

            softwareAccess.forEach(access => {
                const cost = this.costs.find(c => 
                    c.logiciel_id === access.logiciel_id && c.droit_id === access.droit_id);
                const droit = this.droits.find(d => d.id === access.droit_id);
                const user = this.users.find(u => u.id === access.utilisateur_id);

                if (cost && user && !user.archived) {
                    if (droit && droit.nom === 'Accès communs') {
                        // Pour les accès communs, ne compter qu'une fois par logiciel
                        const sharedKey = `${access.logiciel_id}_${access.droit_id}`;
                        if (!processedShared.has(sharedKey)) {
                            totalCost += cost.cout_mensuel;
                            processedShared.add(sharedKey);
                        }
                    } else {
                        totalCost += cost.cout_mensuel;
                    }
                }
            });
        });

        return totalCost;
    }

    // Calcule le coût mensuel selon les utilisateurs de l'équipe (tous logiciels confondus)
    getTeamUsersCost(teamId) {
        const teamUsers = this.users.filter(u => u.equipe_id === teamId && !u.archived);
        const teamUserIds = teamUsers.map(u => u.id);
        const teamAccess = this.access.filter(a => teamUserIds.includes(a.utilisateur_id));
        
        let totalCost = 0;
        const processedShared = new Set();

        teamAccess.forEach(access => {
            const cost = this.costs.find(c => 
                c.logiciel_id === access.logiciel_id && c.droit_id === access.droit_id);
            const droit = this.droits.find(d => d.id === access.droit_id);

            if (cost) {
                if (droit && droit.nom === 'Accès communs') {
                    // Pour les accès communs, ne compter qu'une fois par logiciel
                    const sharedKey = `${access.logiciel_id}_${access.droit_id}`;
                    if (!processedShared.has(sharedKey)) {
                        totalCost += cost.cout_mensuel;
                        processedShared.add(sharedKey);
                    }
                } else {
                    totalCost += cost.cout_mensuel;
                }
            }
        });

        return totalCost;
    }

    showAddTeamModal() {
        const modalContent = `
            <form id="add-team-form">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nom de l'équipe *</label>
                        <input type="text" id="team-nom" required 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea id="team-description" rows="3"
                                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>
                </div>
            </form>
        `;

        const actions = [
            {
                text: 'Ajouter',
                class: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700',
                onclick: 'window.teamsManager.saveTeam()'
            }
        ];

        window.app?.showModal('Ajouter une équipe', modalContent, actions);
    }

    async saveTeam(teamId = null) {
        const nom = document.getElementById('team-nom').value.trim();
        const description = document.getElementById('team-description').value.trim();

        if (!nom) {
            window.app?.showAlert('Le nom de l\'équipe est requis', 'error');
            return;
        }

        try {
            const teamData = {
                nom,
                description,
                archived: false
            };

            if (teamId) {
                // Mise à jour
                await fetch(`tables/equipes/${teamId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(teamData)
                });
                window.app?.showAlert('Équipe modifiée avec succès', 'success');
            } else {
                // Création
                await fetch('tables/equipes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(teamData)
                });
                window.app?.showAlert('Équipe ajoutée avec succès', 'success');
            }

            document.querySelector('.fixed')?.remove();
            await this.loadTeams();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            window.app?.showAlert('Erreur lors de la sauvegarde', 'error');
        }
    }

    async editTeam(teamId) {
        const team = this.teams.find(t => t.id === teamId);
        if (!team) return;

        const modalContent = `
            <form id="edit-team-form">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nom de l'équipe *</label>
                        <input type="text" id="team-nom" required value="${team.nom}"
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea id="team-description" rows="3"
                                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">${team.description || ''}</textarea>
                    </div>
                </div>
            </form>
        `;

        const actions = [
            {
                text: 'Modifier',
                class: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700',
                onclick: `window.teamsManager.saveTeam('${teamId}')`
            }
        ];

        window.app?.showModal('Modifier l\'équipe', modalContent, actions);
    }

    async viewTeamMembers(teamId) {
        const team = this.teams.find(t => t.id === teamId);
        if (!team) return;

        try {
            const usersResult = await fetch('tables/utilisateurs').then(r => r.json());
            const teamMembers = (usersResult.data || []).filter(u => u.equipe_id === teamId && !u.archived);

            const modalContent = `
                <div class="space-y-4">
                    <h4 class="font-medium text-gray-900">Membres de l'équipe: ${team.nom}</h4>
                    <div class="max-h-60 overflow-y-auto space-y-2">
                        ${teamMembers.length === 0 ? 
                            '<p class="text-gray-500 text-center py-4">Aucun membre dans cette équipe</p>' :
                            teamMembers.map(user => `
                                <div class="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <div class="font-medium">${user.nom} ${user.prenom || ''}</div>
                                        <div class="text-sm text-gray-500">${user.poste || 'Poste non défini'}</div>
                                        <div class="text-sm text-gray-500">${user.email || ''}</div>
                                    </div>
                                    <button onclick="window.teamsManager.removeFromTeam('${user.id}')" 
                                            class="text-red-600 hover:text-red-800 text-sm">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            `).join('')
                        }
                    </div>
                </div>
            `;

            window.app?.showModal('Membres de l\'équipe', modalContent, []);
        } catch (error) {
            console.error('Erreur lors du chargement des membres:', error);
            window.app?.showAlert('Erreur lors du chargement des membres', 'error');
        }
    }

    async removeFromTeam(userId) {
        if (!confirm('Retirer cet utilisateur de l\'équipe ?')) return;

        try {
            const usersResult = await fetch(`tables/utilisateurs/${userId}`).then(r => r.json());
            if (usersResult) {
                await fetch(`tables/utilisateurs/${userId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...usersResult, equipe_id: '' })
                });

                window.app?.showAlert('Utilisateur retiré de l\'équipe', 'success');
                document.querySelector('.fixed')?.remove();
            }
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            window.app?.showAlert('Erreur lors de la suppression', 'error');
        }
    }

    async archiveTeam(teamId) {
        if (!confirm('Êtes-vous sûr de vouloir archiver cette équipe ?')) return;

        try {
            const team = this.teams.find(t => t.id === teamId);
            if (team) {
                await fetch(`tables/equipes/${teamId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...team, archived: true })
                });

                window.app?.showAlert('Équipe archivée avec succès', 'success');
                await this.loadTeams();
            }
        } catch (error) {
            console.error('Erreur lors de l\'archivage:', error);
            window.app?.showAlert('Erreur lors de l\'archivage', 'error');
        }
    }

    async unarchiveTeam(teamId) {
        try {
            const team = this.teams.find(t => t.id === teamId);
            if (team) {
                await fetch(`tables/equipes/${teamId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...team, archived: false })
                });

                window.app?.showAlert('Équipe désarchivée avec succès', 'success');
                await this.loadTeams();
            }
        } catch (error) {
            console.error('Erreur lors du désarchivage:', error);
            window.app?.showAlert('Erreur lors du désarchivage', 'error');
        }
    }

    sortTable(column) {
        // Implémentation du tri
        this.teams.sort((a, b) => {
            const aVal = a[column] || '';
            const bVal = b[column] || '';
            return aVal.localeCompare(bVal);
        });
        this.renderTeamsTable();
    }
}

// Initialiser le gestionnaire des équipes
document.addEventListener('DOMContentLoaded', () => {
    window.teamsManager = new TeamsManager();
});