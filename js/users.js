// Gestionnaire des utilisateurs
class UsersManager {
    constructor() {
        this.users = [];
        this.droits = [];
        this.software = [];
        this.teams = [];
        this.showArchived = false;
        this.sortColumn = 'nom';
        this.sortDirection = 'asc';
        this.selectedUsers = new Set(); // Pour la sélection multiple
        this.currentPage = 1; // Pagination
        this.allUsers = []; // Stockage de tous les utilisateurs avant filtrage
        this.selectedTeamId = ''; // Filtre par équipe
        this.init();
    }

    async init() {
        await this.loadDroits();
        this.setupEventListeners();
    }

    async loadDroits() {
        try {
            const result = await window.D1API.get('droits');
            this.droits = result.data || [];
        } catch (error) {
            console.error('Erreur lors du chargement des droits:', error);
        }
    }

    setupEventListeners() {
        document.getElementById('add-user-btn')?.addEventListener('click', () => {
            this.showAddUserModal();
        });

        document.getElementById('show-archived-users')?.addEventListener('change', (e) => {
            this.showArchived = e.target.checked;
            this.currentPage = 1; // Reset à la page 1 lors du changement de filtre
            this.renderUsersTable();
        });

        // Search functionality
        document.getElementById('users-search')?.addEventListener('input', (e) => {
            this.filterUsers(e.target.value);
        });

        // Team filter
        document.getElementById('team-filter')?.addEventListener('change', (e) => {
            this.selectedTeamId = e.target.value;
            this.currentPage = 1; // Reset à la page 1 lors du changement de filtre
            this.renderUsersTable();
        });

        // Bouton pour ajout en masse d'applications
        document.getElementById('bulk-add-software-btn')?.addEventListener('click', () => {
            this.showBulkAddSoftwareModal();
        });
    }

    async loadUsers() {
        try {
            const [usersResult, softwareResult, accessResult, costsResult, teamsResult] = await Promise.all([
                window.D1API.get('utilisateurs'),
                window.D1API.get('logiciels'),
                window.D1API.get('acces'),
                window.D1API.get('couts_licences'),
                window.D1API.get('equipes')
            ]);

            this.allUsers = usersResult.data || [];
            this.software = softwareResult.data || [];
            this.access = accessResult.data || [];
            this.costs = costsResult.data || [];
            this.teams = teamsResult.data || [];

            // Peupler le filtre d'équipes
            this.populateTeamFilter();

            // Récupérer la page sauvegardée
            this.currentPage = window.paginationUtils?.getSavedPage('users') || 1;
            this.renderUsersTable();
        } catch (error) {
            console.error('Erreur lors du chargement des utilisateurs:', error);
            window.app?.showAlert('Erreur lors du chargement des utilisateurs', 'error');
        }
    }

    filterUsers(searchTerm) {
        const rows = document.querySelectorAll('#users-table-container tbody tr');
        const term = searchTerm.toLowerCase();

        rows.forEach(row => {
            // Maintenant la première colonne est la checkbox, donc décaler d'une colonne
            const name = row.cells[1]?.textContent.toLowerCase() || '';
            const email = row.cells[2]?.textContent.toLowerCase() || '';
            const team = row.cells[3]?.textContent.toLowerCase() || '';

            if (name.includes(term) || email.includes(term) || team.includes(term)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    populateTeamFilter() {
        const teamFilter = document.getElementById('team-filter');
        if (!teamFilter) return;

        // Garder l'option "Toutes les équipes"
        const currentValue = teamFilter.value;
        teamFilter.innerHTML = '<option value="">Toutes les équipes</option>';

        // Ajouter les équipes actives
        const activeTeams = this.teams.filter(team => !team.archived);
        activeTeams.forEach(team => {
            const option = document.createElement('option');
            option.value = team.id;
            option.textContent = team.nom;
            teamFilter.appendChild(option);
        });

        // Restaurer la valeur sélectionnée
        teamFilter.value = currentValue;
    }

    renderUsersTable() {
        const container = document.getElementById('users-table-container');
        if (!container) return;

        // Filtrer les utilisateurs
        let filteredUsers = this.showArchived ? 
            this.allUsers : 
            this.allUsers.filter(u => !u.archived);

        // Filtre par équipe
        if (this.selectedTeamId) {
            filteredUsers = filteredUsers.filter(u => u.equipe_id === this.selectedTeamId);
        }

        // Paginer les résultats
        const paginationResult = window.paginationUtils?.paginateData(filteredUsers, this.currentPage);
        if (!paginationResult) return;

        this.users = paginationResult.data; // Utilisateurs de la page courante

        const tableHtml = `
            <table class="min-w-full table-auto">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                            <input type="checkbox" id="select-all-users" class="rounded" onchange="window.usersManager.toggleSelectAll(this.checked)">
                        </th>
                        <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onclick="window.usersManager.sortTable('nom')">
                            Nom <i class="fas fa-sort ml-1"></i>
                        </th>
                        <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <span class="hidden sm:inline">Email</span>
                            <span class="sm:hidden">@</span>
                        </th>
                        <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onclick="window.usersManager.sortTable('equipe')">
                            Équipe <i class="fas fa-sort ml-1"></i>
                        </th>
                        <th class="hidden lg:table-cell px-3 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">🏢 Externe</th>
                        <th class="hidden xl:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poste</th>
                        <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onclick="window.usersManager.sortTable('nb_logiciels')">
                            <span class="hidden sm:inline">Nb Logiciels</span>
                            <span class="sm:hidden">Nb</span>
                            <i class="fas fa-sort ml-1"></i>
                        </th>
                        <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onclick="window.usersManager.sortTable('cout')">
                            <span class="hidden sm:inline">Coût Annuel HT</span>
                            <span class="sm:hidden">€ HT</span>
                            <i class="fas fa-sort ml-1"></i>
                        </th>
                        <th class="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th class="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${filteredUsers.map(user => this.renderUserRow(user)).join('')}
                </tbody>
            </table>
            ${this.users.length === 0 ? '<div class="text-center py-8 text-gray-500 text-sm sm:text-base">Aucun utilisateur trouvé</div>' : ''}
        `;

        container.innerHTML = tableHtml;

        // Ajouter les contrôles de pagination
        if (window.paginationUtils) {
            window.paginationUtils.renderPaginationControls(
                paginationResult.totalItems,
                paginationResult.currentPage,
                'users-pagination',
                'window.usersManager.changePage'
            );
        }

        // Animation
        window.paginationUtils?.animateTableUpdate('#users-table-container table');
    }

    renderUserRow(user) {
        const userCost = this.calculateUserCost(user.id);
        const nbLogiciels = this.calculateUserSoftwareCount(user.id);
        const team = this.teams.find(t => t.id === user.equipe_id);
        
        return `
            <tr class="${user.archived ? 'bg-gray-50 text-gray-500' : ''}">
                <td class="px-3 py-3 sm:py-4 text-center">
                    <input type="checkbox" class="user-checkbox rounded" 
                           data-user-id="${user.id}" 
                           ${this.selectedUsers.has(user.id) ? 'checked' : ''}
                           onchange="window.usersManager.toggleUserSelection('${user.id}', this.checked)">
                </td>
                <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${user.nom} ${user.prenom || ''}</div>
                </td>
                <td class="px-3 sm:px-6 py-3 sm:py-4 w-1/3 min-w-0">
                    <div class="text-sm text-gray-600 truncate">${user.email || 'Non renseigné'}</div>
                </td>
                <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-600">${team?.nom || 'Aucune équipe'}</div>
                </td>
                <td class="hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center">
                    ${user.externe ? 
                        '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">🏢 Externe</span>' : 
                        '<span class="text-gray-400 text-sm">-</span>'
                    }
                </td>
                <td class="hidden xl:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-600">${user.poste || 'Non renseigné'}</div>
                </td>
                <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center">
                    <div class="text-sm text-gray-900">${nbLogiciels}</div>
                </td>
                <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center">
                    <div class="text-sm font-medium text-purple-600">${(userCost * 12).toFixed(2)}€</div>
                    <div class="text-xs text-gray-500">(${userCost.toFixed(2)}€/mois)</div>
                </td>
                <td class="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.archived ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }">
                        ${user.archived ? 'Archivé' : 'Actif'}
                    </span>
                </td>
                <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end space-x-1 sm:space-x-2">
                        <button onclick="window.usersManager.editUser('${user.id}')" 
                                class="text-blue-600 hover:text-blue-900 p-1" title="Modifier">
                            <i class="fas fa-edit text-sm"></i>
                        </button>
                        <button onclick="window.usersManager.manageUserAccess('${user.id}')" 
                                class="text-purple-600 hover:text-purple-900 p-1" title="Gérer les accès">
                            <i class="fas fa-shield-alt text-sm"></i>
                        </button>
                        <button onclick="window.usersManager.viewUserCosts('${user.id}')" 
                                class="hidden sm:inline-block text-green-600 hover:text-green-900 p-1" title="Voir les coûts">
                            <i class="fas fa-euro-sign text-sm"></i>
                        </button>
                        ${!user.archived ? 
                            `<button onclick="window.usersManager.showLeaveCompanyModal('${user.id}')" 
                                     class="text-orange-600 hover:text-orange-900 p-1" title="Plus dans l'entreprise">
                                <i class="fas fa-sign-out-alt text-sm"></i>
                             </button>` :
                            `<button onclick="window.usersManager.unarchiveUser('${user.id}')" 
                                     class="text-green-600 hover:text-green-900 p-1" title="Désarchiver">
                                <i class="fas fa-undo text-sm"></i>
                             </button>`
                        }
                    </div>
                </td>
            </tr>
        `;
    }

    showAddUserModal() {
        const modalContent = `
            <form id="add-user-form">
                <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                            <input type="text" id="user-nom" required 
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                            <input type="text" id="user-prenom" required
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input type="email" id="user-email" required
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Poste *</label>
                        <input type="text" id="user-poste" required
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Équipe *</label>
                        <select id="user-equipe" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Sélectionner une équipe</option>
                            ${this.teams.filter(t => !t.archived).map(team => 
                                `<option value="${team.id}">${team.nom}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="border-t pt-4 space-y-3">
                        <div class="flex items-center">
                            <input type="checkbox" id="user-externe" 
                                   class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded">
                            <label for="user-externe" class="ml-2 block text-sm text-gray-700 font-medium">
                                🏢 Utilisateur externe (ne fait pas partie de l'entreprise)
                            </label>
                        </div>
                        <div class="flex items-center">
                            <input type="checkbox" id="user-add-base-access" checked
                                   class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                            <label for="user-add-base-access" class="ml-2 block text-sm text-gray-700">
                                Ajouter automatiquement les accès aux logiciels de base (droit "User")
                            </label>
                        </div>
                    </div>
                </div>
            </form>
        `;

        const actions = [
            {
                text: 'Ajouter',
                class: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700',
                onclick: 'window.usersManager.saveUser()'
            }
        ];

        window.app?.showModal('Ajouter un utilisateur', modalContent, actions);
    }

    async saveUser(userId = null) {
        const nom = document.getElementById('user-nom').value.trim();
        const prenom = document.getElementById('user-prenom').value.trim();
        const email = document.getElementById('user-email').value.trim();
        const poste = document.getElementById('user-poste').value.trim();
        const equipe_id = document.getElementById('user-equipe').value;
        const externe = document.getElementById('user-externe')?.checked || false;
        const addBaseAccess = !userId && document.getElementById('user-add-base-access')?.checked;

        // Validation des champs obligatoires
        if (!nom) {
            window.app?.showAlert('Le nom est requis', 'error');
            return;
        }
        if (!prenom) {
            window.app?.showAlert('Le prénom est requis', 'error');
            return;
        }
        if (!email) {
            window.app?.showAlert('L\'email est requis', 'error');
            return;
        }
        if (!poste) {
            window.app?.showAlert('Le poste est requis', 'error');
            return;
        }
        if (!equipe_id) {
            window.app?.showAlert('L\'équipe est requise', 'error');
            return;
        }

        try {
            const userData = {
                nom,
                prenom,
                email,
                poste,
                equipe_id,
                externe,
                archived: false
            };

            let newUserId = userId;
            if (userId) {
                // Récupérer les anciennes valeurs pour le log
                const oldUser = this.users.find(u => u.id === userId);
                
                // Mise à jour
                const result = await window.D1API.update('utilisateurs', userId, userData);
                if (!result.success) {
                    throw new Error(result.error);
                }
                
                // Log de la modification
                if (window.logger) {
                    await window.logger.log('UPDATE', 'utilisateurs', userId, oldUser, userData, `Modification de l'utilisateur ${userData.nom} ${userData.prenom}`);
                }
                
                window.app?.showAlert('Utilisateur modifié avec succès', 'success');
            } else {
                // Création
                const result = await window.D1API.create('utilisateurs', userData);
                if (!result.success) {
                    throw new Error(result.error);
                }
                newUserId = result.data.id;
                
                // Log de la création
                if (window.logger) {
                    await window.logger.log('CREATE', 'utilisateurs', newUserId, null, userData, `Création de l'utilisateur ${userData.nom} ${userData.prenom}`);
                }
                
                // Ajouter les accès de base si demandé
                if (addBaseAccess) {
                    await this.addBaseAccessForUser(newUserId);
                }
                
                window.app?.showAlert('Utilisateur ajouté avec succès', 'success');
            }

            // Fermer le modal et recharger les données
            const modal = document.querySelector('.fixed');
            if (modal) {
                modal.remove();
            }
            await this.loadUsers();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            window.app?.showAlert('Erreur lors de la sauvegarde', 'error');
            // Fermer le modal même en cas d'erreur
            const modal = document.querySelector('.fixed');
            if (modal) {
                modal.remove();
            }
        }
    }

    async editUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        const modalContent = `
            <form id="edit-user-form">
                <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                            <input type="text" id="user-nom" required value="${user.nom}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                            <input type="text" id="user-prenom" value="${user.prenom || ''}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" id="user-email" value="${user.email || ''}"
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Poste</label>
                        <input type="text" id="user-poste" value="${user.poste || ''}"
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Équipe</label>
                        <select id="user-equipe"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Aucune équipe</option>
                            ${this.teams.filter(t => !t.archived).map(team => 
                                `<option value="${team.id}" ${team.id === user.equipe_id ? 'selected' : ''}>${team.nom}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="border-t pt-4">
                        <div class="flex items-center">
                            <input type="checkbox" id="user-externe" ${user.externe ? 'checked' : ''}
                                   class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded">
                            <label for="user-externe" class="ml-2 block text-sm text-gray-700 font-medium">
                                🏢 Utilisateur externe (ne fait pas partie de l'entreprise)
                            </label>
                        </div>
                    </div>
                </div>
            </form>
        `;

        const actions = [
            {
                text: 'Modifier',
                class: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700',
                onclick: `window.usersManager.saveUser('${userId}')`
            }
        ];

        window.app?.showModal('Modifier l\'utilisateur', modalContent, actions);
    }

    async manageUserAccess(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        try {
            const accessResult = await window.D1API.get('acces');
            const userAccess = (accessResult.data || []).filter(a => a.utilisateur_id === userId);
            const activeSoftware = this.software.filter(s => !s.archived);

            const modalContent = `
                <div class="space-y-4">
                    <h4 class="font-medium text-gray-900">Accès pour: ${user.nom} ${user.prenom || ''}</h4>
                    <div class="max-h-60 overflow-y-auto space-y-2">
                        ${userAccess.map(acc => {
                            const software = this.software.find(s => s.id === acc.logiciel_id);
                            const droit = this.droits.find(d => d.id === acc.droit_id);
                            return `
                                <div class="flex items-center justify-between p-2 border rounded">
                                    <span class="text-sm">${software?.nom || 'Logiciel inconnu'}</span>
                                    <div class="flex items-center space-x-2">
                                        <span class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">${droit?.nom || 'N/A'}</span>
                                        <button onclick="window.usersManager.removeUserAccess('${acc.id}')" 
                                                class="text-red-600 hover:text-red-800 text-xs">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div class="border-t pt-4">
                        <h5 class="text-sm font-medium mb-2">Ajouter un accès</h5>
                        <div class="space-y-2 sm:space-y-0 sm:flex sm:space-x-2">
                            <select id="select-software" class="w-full sm:flex-1 px-2 py-1 border border-gray-300 rounded text-sm">
                                <option value="">Sélectionner un logiciel</option>
                                ${activeSoftware.map(soft => `<option value="${soft.id}">${soft.nom}</option>`).join('')}
                            </select>
                            <select id="select-right" class="w-full sm:flex-1 px-2 py-1 border border-gray-300 rounded text-sm">
                                <option value="">Sélectionner un droit</option>
                                ${this.droits.map(droit => `<option value="${droit.id}">${droit.nom}</option>`).join('')}
                            </select>
                            <button onclick="window.usersManager.addUserAccess('${userId}')" 
                                    class="w-full sm:w-auto px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center justify-center">
                                <i class="fas fa-plus mr-1 sm:mr-0"></i>
                                <span class="sm:hidden">Ajouter</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            window.app?.showModal('Gérer les accès', modalContent, []);
        } catch (error) {
            console.error('Erreur lors du chargement des accès:', error);
            window.app?.showAlert('Erreur lors du chargement des accès', 'error');
        }
    }

    async addUserAccess(userId) {
        const softwareId = document.getElementById('select-software')?.value;
        const rightId = document.getElementById('select-right')?.value;

        if (!softwareId || !rightId) {
            window.app?.showAlert('Veuillez sélectionner un logiciel et un droit', 'error');
            return;
        }

        try {
            const result = await window.D1API.create('acces', {
                utilisateur_id: userId,
                logiciel_id: softwareId,
                droit_id: rightId
            });
            if (!result.success) {
                throw new Error(result.error);
            }

            window.app?.showAlert('Accès ajouté avec succès', 'success');
            document.querySelector('.fixed')?.remove();
            this.manageUserAccess(userId); // Recharger la modal
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'accès:', error);
            window.app?.showAlert('Erreur lors de l\'ajout de l\'accès', 'error');
        }
    }

    async removeUserAccess(accessId) {
        try {
            const result = await window.D1API.delete('acces', accessId);
            if (!result.success) {
                throw new Error(result.error);
            }
            window.app?.showAlert('Accès supprimé avec succès', 'success');
            // Recharger la vue
            const modal = document.querySelector('.fixed');
            if (modal) {
                const userId = modal.querySelector('[onclick*="addUserAccess"]')?.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
                if (userId) {
                    document.querySelector('.fixed')?.remove();
                    this.manageUserAccess(userId);
                }
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'accès:', error);
            window.app?.showAlert('Erreur lors de la suppression de l\'accès', 'error');
        }
    }

    async viewUserCosts(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        try {
            const [accessResult, costsResult] = await Promise.all([
                window.D1API.get('acces'),
                window.D1API.get('couts_licences')
            ]);

            const userAccess = (accessResult.data || []).filter(a => a.utilisateur_id === userId);
            const costs = costsResult.data || [];

            let totalCost = 0;
            const costDetails = [];
            const processedShared = new Set();

            for (const acc of userAccess) {
                const software = this.software.find(s => s.id === acc.logiciel_id);
                const droit = this.droits.find(d => d.id === acc.droit_id);
                const cost = costs.find(c => c.logiciel_id === acc.logiciel_id && c.droit_id === acc.droit_id);

                if (cost) {
                    let costToAdd = cost.cout_mensuel;
                    
                    // Pour les accès communs, ne compter qu'une fois
                    if (droit && droit.nom === 'Accès communs') {
                        const sharedKey = `${acc.logiciel_id}_${acc.droit_id}`;
                        if (processedShared.has(sharedKey)) {
                            costToAdd = 0; // Déjà compté
                        } else {
                            processedShared.add(sharedKey);
                        }
                    }

                    totalCost += costToAdd;
                    costDetails.push({
                        software: software?.nom || 'Inconnu',
                        droit: droit?.nom || 'Inconnu',
                        cost: costToAdd
                    });
                }
            }

            const modalContent = `
                <div class="space-y-4">
                    <h4 class="font-medium text-gray-900">Coûts pour: ${user.nom} ${user.prenom || ''}</h4>
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <div class="text-2xl font-bold text-blue-900">${totalCost.toFixed(2)}€ HT / mois</div>
                        <div class="text-sm text-blue-700">Coût total</div>
                    </div>
                    <div class="max-h-60 overflow-y-auto space-y-2">
                        <h5 class="text-sm font-medium">Détail des coûts:</h5>
                        ${costDetails.map(detail => `
                            <div class="flex justify-between items-center p-2 border rounded">
                                <div>
                                    <span class="text-sm font-medium">${detail.software}</span>
                                    <span class="text-xs text-gray-500 ml-2">(${detail.droit})</span>
                                </div>
                                <span class="text-sm font-medium">${detail.cost.toFixed(2)}€ HT</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            window.app?.showModal('Coûts utilisateur', modalContent, []);
        } catch (error) {
            console.error('Erreur lors du calcul des coûts:', error);
            window.app?.showAlert('Erreur lors du calcul des coûts', 'error');
        }
    }

    showLeaveCompanyModal(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        const modalContent = `
            <div class="space-y-4">
                <div class="bg-orange-50 border-l-4 border-orange-400 p-4">
                    <p class="text-orange-800">
                        <strong>${user.nom} ${user.prenom || ''}</strong> ne fait plus partie de l'entreprise.
                    </p>
                    <p class="text-sm text-orange-700 mt-2">
                        Cette action va archiver l'utilisateur et vous permettra de gérer ses accès.
                    </p>
                </div>
                <div id="user-software-list" class="max-h-60 overflow-y-auto">
                    <!-- Liste des logiciels sera chargée ici -->
                </div>
            </div>
        `;

        const actions = [
            {
                text: 'Confirmer et Archiver',
                class: 'px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700',
                onclick: `window.usersManager.archiveUserAndRemoveAccess('${userId}')`
            }
        ];

        window.app?.showModal('Utilisateur plus dans l\'entreprise', modalContent, actions);
        this.loadUserSoftwareForLeaving(userId);
    }

    async loadUserSoftwareForLeaving(userId) {
        try {
            const accessResult = await window.D1API.get('acces');
            const userAccess = (accessResult.data || []).filter(a => a.utilisateur_id === userId);

            const softwareList = document.getElementById('user-software-list');
            if (!softwareList) return;

            if (userAccess.length === 0) {
                softwareList.innerHTML = '<p class="text-gray-500 text-center py-4">Aucun accès à supprimer</p>';
                return;
            }

            const softwareHtml = `
                <h5 class="text-sm font-medium mb-2">Accès qui seront supprimés:</h5>
                <div class="space-y-2">
                    ${userAccess.map(acc => {
                        const software = this.software.find(s => s.id === acc.logiciel_id);
                        const droit = this.droits.find(d => d.id === acc.droit_id);
                        return `
                            <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <span class="text-sm">${software?.nom || 'Logiciel inconnu'}</span>
                                <span class="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">${droit?.nom || 'N/A'}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;

            softwareList.innerHTML = softwareHtml;
        } catch (error) {
            console.error('Erreur lors du chargement des accès utilisateur:', error);
        }
    }

    async archiveUserAndRemoveAccess(userId) {
        try {
            // 1. Archiver l'utilisateur
            const user = this.users.find(u => u.id === userId);
            if (user) {
                const result = await window.D1API.update('utilisateurs', userId, { ...user, archived: true });
                if (!result.success) {
                    throw new Error(result.error);
                }
                
                // Log de l'archivage
                if (window.logger) {
                    await window.logger.log('ARCHIVE', 'utilisateurs', userId, user, { ...user, archived: true }, `Archivage de l'utilisateur ${user.nom} ${user.prenom}`);
                }
            }

            // 2. Supprimer tous les accès de l'utilisateur
            const accessResult = await window.D1API.get('acces');
            const userAccess = (accessResult.data || []).filter(a => a.utilisateur_id === userId);

            for (const access of userAccess) {
                const result = await window.D1API.delete('acces', access.id);
                if (!result.success) {
                    throw new Error(result.error);
                }
            }

            document.querySelector('.fixed')?.remove();
            window.app?.showAlert('Utilisateur archivé et accès supprimés avec succès', 'success');
            await this.loadUsers();
        } catch (error) {
            console.error('Erreur lors de l\'archivage:', error);
            window.app?.showAlert('Erreur lors de l\'archivage', 'error');
        }
    }

    async unarchiveUser(userId) {
        try {
            const user = this.users.find(u => u.id === userId);
            if (user) {
                const result = await window.D1API.update('utilisateurs', userId, { ...user, archived: false });
                if (!result.success) {
                    throw new Error(result.error);
                }

                window.app?.showAlert('Utilisateur désarchivé avec succès', 'success');
                await this.loadUsers();
            }
        } catch (error) {
            console.error('Erreur lors du désarchivage:', error);
            window.app?.showAlert('Erreur lors du désarchivage', 'error');
        }
    }

    calculateUserCost(userId) {
        if (!this.access || !this.costs) return 0;
        
        const userAccess = this.access.filter(a => a.utilisateur_id === userId);
        const activeSoftware = this.software.filter(s => !s.archived);
        
        let totalCost = 0;
        const processedShared = new Set();

        for (const acc of userAccess) {
            // Vérifier que le logiciel est toujours actif
            const software = activeSoftware.find(s => s.id === acc.logiciel_id);
            if (!software) continue;

            const cost = this.costs.find(c => c.logiciel_id === acc.logiciel_id && c.droit_id === acc.droit_id);
            const droit = this.droits.find(d => d.id === acc.droit_id);
            
            if (cost && droit) {
                if (droit.nom === 'Accès communs') {
                    const sharedKey = `${acc.logiciel_id}_${acc.droit_id}`;
                    if (!processedShared.has(sharedKey)) {
                        totalCost += cost.cout_mensuel;
                        processedShared.add(sharedKey);
                    }
                } else {
                    totalCost += cost.cout_mensuel;
                }
            }
        }

        return totalCost;
    }

    calculateUserSoftwareCount(userId) {
        if (!this.access) return 0;
        
        const userAccess = this.access.filter(a => a.utilisateur_id === userId);
        const activeSoftware = this.software.filter(s => !s.archived);
        
        // Compter les logiciels uniques auxquels l'utilisateur a accès
        const uniqueSoftware = new Set();
        for (const acc of userAccess) {
            const software = activeSoftware.find(s => s.id === acc.logiciel_id);
            if (software) {
                uniqueSoftware.add(acc.logiciel_id);
            }
        }
        
        return uniqueSoftware.size;
    }

    sortTable(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        const filteredUsers = this.showArchived ? 
            this.users : 
            this.users.filter(u => !u.archived);

        filteredUsers.sort((a, b) => {
            let aVal, bVal;

            switch (column) {
                case 'nom':
                    aVal = `${a.nom} ${a.prenom || ''}`.toLowerCase();
                    bVal = `${b.nom} ${b.prenom || ''}`.toLowerCase();
                    break;
                case 'equipe':
                    const teamA = this.teams.find(t => t.id === a.equipe_id);
                    const teamB = this.teams.find(t => t.id === b.equipe_id);
                    aVal = teamA?.nom || '';
                    bVal = teamB?.nom || '';
                    break;
                case 'nb_logiciels':
                    aVal = this.calculateUserSoftwareCount(a.id);
                    bVal = this.calculateUserSoftwareCount(b.id);
                    break;
                case 'cout':
                    aVal = this.calculateUserCost(a.id);
                    bVal = this.calculateUserCost(b.id);
                    break;
                default:
                    aVal = a[column] || '';
                    bVal = b[column] || '';
            }

            if (typeof aVal === 'number') {
                return this.sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
            } else {
                const result = aVal.toString().localeCompare(bVal.toString());
                return this.sortDirection === 'asc' ? result : -result;
            }
        });

        // Réassigner les utilisateurs triés
        if (this.showArchived) {
            this.users = filteredUsers;
        } else {
            // Garder les utilisateurs archivés à leur place
            const archivedUsers = this.users.filter(u => u.archived);
            this.users = [...filteredUsers, ...archivedUsers];
        }

        this.renderUsersTable();
    }

    async addBaseAccessForUser(userId) {
        try {
            // Récupérer les logiciels de base et le droit "User"
            const [softwareResult, rightsResult] = await Promise.all([
                window.D1API.get('logiciels'),
                window.D1API.get('droits')
            ]);

            const baseSoftware = (softwareResult.data || []).filter(s => s.logiciel_de_base && !s.archived);
            const userRight = (rightsResult.data || []).find(d => d.nom === 'User');

            if (!userRight) {
                console.warn('Droit "User" non trouvé');
                return;
            }

            // Créer les accès pour chaque logiciel de base
            for (const software of baseSoftware) {
                const result = await window.D1API.create('acces', {
                    utilisateur_id: userId,
                    logiciel_id: software.id,
                    droit_id: userRight.id
                });
                if (!result.success) {
                    console.error('Erreur lors de l\'ajout d\'accès de base:', result.error);
                }
            }

            if (baseSoftware.length > 0) {
                window.app?.showAlert(`${baseSoftware.length} accès de base ajoutés automatiquement`, 'info');
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout des accès de base:', error);
            window.app?.showAlert('Erreur lors de l\'ajout des accès de base', 'warning');
        }
    }

    // =================== FONCTIONNALITÉS DE SÉLECTION MULTIPLE ===================

    toggleSelectAll(checked) {
        if (checked) {
            // Sélectionner tous les utilisateurs de la page courante
            this.users.forEach(user => {
                this.selectedUsers.add(user.id);
            });
        } else {
            // Désélectionner tous les utilisateurs de la page courante
            this.users.forEach(user => {
                this.selectedUsers.delete(user.id);
            });
        }

        // Mettre à jour les cases à cocher individuelles
        const checkboxes = document.querySelectorAll('.user-checkbox');
        checkboxes.forEach(checkbox => {
            const userId = checkbox.getAttribute('data-user-id');
            checkbox.checked = this.selectedUsers.has(userId);
        });

        this.updateBulkActionsUI();
    }

    toggleUserSelection(userId, checked) {
        if (checked) {
            this.selectedUsers.add(userId);
        } else {
            this.selectedUsers.delete(userId);
        }

        // Mettre à jour la case "Sélectionner tout" pour la page courante
        const selectAllCheckbox = document.getElementById('select-all-users');
        if (selectAllCheckbox) {
            const allPageSelected = this.users.every(user => this.selectedUsers.has(user.id));
            const somePageSelected = this.users.some(user => this.selectedUsers.has(user.id));
            
            selectAllCheckbox.checked = allPageSelected && this.users.length > 0;
            selectAllCheckbox.indeterminate = somePageSelected && !allPageSelected;
        }

        this.updateBulkActionsUI();
    }

    updateBulkActionsUI() {
        const selectedCount = this.selectedUsers.size;
        let bulkActionsBar = document.getElementById('bulk-actions-bar');

        if (selectedCount > 0) {
            if (!bulkActionsBar) {
                this.createBulkActionsBar();
            } else {
                this.updateBulkActionsCount();
            }
        } else {
            if (bulkActionsBar) {
                bulkActionsBar.remove();
            }
        }
    }

    createBulkActionsBar() {
        const usersView = document.getElementById('users-view');
        if (!usersView) return;

        const bulkActionsHTML = `
            <div id="bulk-actions-bar" class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white rounded-lg shadow-lg px-4 py-3 flex items-center space-x-4 z-50">
                <div class="flex items-center">
                    <i class="fas fa-check-circle mr-2"></i>
                    <span id="selected-count">${this.selectedUsers.size}</span>
                    <span class="ml-1">utilisateur${this.selectedUsers.size > 1 ? 's' : ''} sélectionné${this.selectedUsers.size > 1 ? 's' : ''}</span>
                </div>
                
                <div class="flex items-center space-x-2">
                    <button onclick="window.usersManager.showBulkAddSoftwareModal()" 
                            class="bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-sm flex items-center">
                        <i class="fas fa-plus mr-1"></i>
                        Ajouter Applications
                    </button>
                    
                    <button onclick="window.usersManager.showBulkChangeTeamModal()" 
                            class="bg-purple-500 hover:bg-purple-600 px-3 py-1 rounded text-sm flex items-center">
                        <i class="fas fa-users mr-1"></i>
                        Changer Équipe
                    </button>
                    
                    <button onclick="window.usersManager.showBulkRemoveAccessModal()" 
                            class="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm flex items-center">
                        <i class="fas fa-minus mr-1"></i>
                        Retirer Accès
                    </button>
                    
                    <button onclick="window.usersManager.clearSelection()" 
                            class="bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded text-sm flex items-center">
                        <i class="fas fa-times mr-1"></i>
                        Annuler
                    </button>
                </div>
            </div>
        `;

        usersView.insertAdjacentHTML('beforeend', bulkActionsHTML);
    }

    updateBulkActionsCount() {
        const countElement = document.getElementById('selected-count');
        if (countElement) {
            countElement.textContent = this.selectedUsers.size;
            const textElement = countElement.nextElementSibling;
            if (textElement) {
                textElement.textContent = ` utilisateur${this.selectedUsers.size > 1 ? 's' : ''} sélectionné${this.selectedUsers.size > 1 ? 's' : ''}`;
            }
        }
    }

    clearSelection() {
        this.selectedUsers.clear();
        
        // Décocher toutes les cases
        const checkboxes = document.querySelectorAll('.user-checkbox, #select-all-users');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.indeterminate = false;
        });
        
        // Supprimer la barre d'actions
        const bulkActionsBar = document.getElementById('bulk-actions-bar');
        if (bulkActionsBar) {
            bulkActionsBar.remove();
        }
    }

    showBulkAddSoftwareModal() {
        if (this.selectedUsers.size === 0) {
            window.app?.showAlert('Aucun utilisateur sélectionné', 'warning');
            return;
        }

        const selectedUserNames = Array.from(this.selectedUsers).map(userId => {
            const user = this.users.find(u => u.id === userId);
            return user ? `${user.nom} ${user.prenom || ''}`.trim() : 'Utilisateur inconnu';
        });

        const activeSoftware = this.software.filter(s => !s.archived);

        const modalContent = `
            <div class="space-y-4">
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 class="font-medium text-blue-900 mb-2">
                        <i class="fas fa-users mr-2"></i>
                        ${this.selectedUsers.size} utilisateur${this.selectedUsers.size > 1 ? 's' : ''} sélectionné${this.selectedUsers.size > 1 ? 's' : ''}
                    </h4>
                    <div class="text-sm text-blue-800 max-h-20 overflow-y-auto">
                        ${selectedUserNames.join(', ')}
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Sélectionner l'application à ajouter *
                    </label>
                    <select id="bulk-software-select" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">-- Choisir une application --</option>
                        ${activeSoftware.map(soft => 
                            `<option value="${soft.id}">${soft.nom}</option>`
                        ).join('')}
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Niveau d'accès *
                    </label>
                    <select id="bulk-right-select" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">-- Choisir un niveau d'accès --</option>
                        ${this.droits.map(droit => 
                            `<option value="${droit.id}">${droit.nom}</option>`
                        ).join('')}
                    </select>
                </div>

                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div class="flex items-start">
                        <i class="fas fa-info-circle text-yellow-600 mt-0.5 mr-2"></i>
                        <div class="text-sm text-yellow-800">
                            <p class="font-medium mb-1">Attention :</p>
                            <p>Cette action ajoutera l'accès sélectionné à tous les utilisateurs choisis.</p>
                            <p>Si un utilisateur a déjà cet accès, il sera ignoré.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const actions = [
            {
                text: `Ajouter à ${this.selectedUsers.size} utilisateur${this.selectedUsers.size > 1 ? 's' : ''}`,
                class: 'px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700',
                onclick: 'window.usersManager.executeBulkAddSoftware()'
            }
        ];

        window.app?.showModal('Ajout en masse d\'applications', modalContent, actions);
    }

    async executeBulkAddSoftware() {
        const softwareId = document.getElementById('bulk-software-select')?.value;
        const rightId = document.getElementById('bulk-right-select')?.value;

        if (!softwareId || !rightId) {
            window.app?.showAlert('Veuillez sélectionner une application et un niveau d\'accès', 'error');
            return;
        }

        const software = this.software.find(s => s.id === softwareId);
        const right = this.droits.find(d => d.id === rightId);

        try {
            let successCount = 0;
            let skipCount = 0;
            const errors = [];

            // Récupérer tous les accès existants pour éviter les doublons
            const accessResult = await window.D1API.get('acces');
            const existingAccess = accessResult.data || [];

            for (const userId of this.selectedUsers) {
                // Vérifier si l'accès existe déjà
                const existingAccess_user = existingAccess.find(acc => 
                    acc.utilisateur_id === userId && 
                    acc.logiciel_id === softwareId && 
                    acc.droit_id === rightId
                );

                if (existingAccess_user) {
                    skipCount++;
                    continue;
                }

                try {
                    const result = await window.D1API.create('acces', {
                        utilisateur_id: userId,
                        logiciel_id: softwareId,
                        droit_id: rightId
                    });

                    if (result.success) {
                        successCount++;
                        
                        // Log de l'ajout d'accès
                        if (window.logger) {
                            const user = this.users.find(u => u.id === userId);
                            await window.logger.log('CREATE', 'acces', result.data.id, null, {
                                utilisateur_id: userId,
                                logiciel_id: softwareId,
                                droit_id: rightId
                            }, `Ajout en masse: ${software?.nom} (${right?.nom}) pour ${user?.nom} ${user?.prenom}`);
                        }
                    } else {
                        throw new Error(result.error);
                    }
                } catch (error) {
                    const user = this.users.find(u => u.id === userId);
                    errors.push(`${user?.nom || 'Utilisateur inconnu'}: ${error.message}`);
                }
            }

            // Fermer le modal
            document.querySelector('.fixed')?.remove();

            // Afficher le résultat
            let message = `✅ ${successCount} accès ajouté${successCount > 1 ? 's' : ''}`;
            if (skipCount > 0) {
                message += `\n⚠️ ${skipCount} accès ignoré${skipCount > 1 ? 's' : ''} (déjà existant${skipCount > 1 ? 's' : ''})`;
            }
            if (errors.length > 0) {
                message += `\n❌ ${errors.length} erreur${errors.length > 1 ? 's' : ''}`;
                console.error('Erreurs lors de l\'ajout en masse:', errors);
            }

            window.app?.showAlert(message, successCount > 0 ? 'success' : 'warning');
            
            // Rafraîchir les données
            await this.loadUsers();
            
        } catch (error) {
            console.error('Erreur lors de l\'ajout en masse:', error);
            window.app?.showAlert('Erreur lors de l\'ajout en masse', 'error');
        }
    }

    showBulkRemoveAccessModal() {
        if (this.selectedUsers.size === 0) {
            window.app?.showAlert('Aucun utilisateur sélectionné', 'warning');
            return;
        }

        // Récupérer les accès communs à tous les utilisateurs sélectionnés
        const commonAccess = this.getCommonAccessForUsers(Array.from(this.selectedUsers));
        
        if (commonAccess.length === 0) {
            window.app?.showAlert('Aucun accès commun trouvé entre les utilisateurs sélectionnés', 'info');
            return;
        }

        const selectedUserNames = Array.from(this.selectedUsers).map(userId => {
            const user = this.users.find(u => u.id === userId);
            return user ? `${user.nom} ${user.prenom || ''}`.trim() : 'Utilisateur inconnu';
        });

        const modalContent = `
            <div class="space-y-4">
                <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 class="font-medium text-red-900 mb-2">
                        <i class="fas fa-users mr-2"></i>
                        ${this.selectedUsers.size} utilisateur${this.selectedUsers.size > 1 ? 's' : ''} sélectionné${this.selectedUsers.size > 1 ? 's' : ''}
                    </h4>
                    <div class="text-sm text-red-800 max-h-20 overflow-y-auto">
                        ${selectedUserNames.join(', ')}
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Accès communs à supprimer
                    </label>
                    <div class="max-h-40 overflow-y-auto border border-gray-300 rounded-lg">
                        ${commonAccess.map(access => {
                            const software = this.software.find(s => s.id === access.logiciel_id);
                            const right = this.droits.find(d => d.id === access.droit_id);
                            return `
                                <label class="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0">
                                    <input type="checkbox" class="bulk-remove-access rounded mr-3" 
                                           data-software-id="${access.logiciel_id}" 
                                           data-right-id="${access.droit_id}">
                                    <div class="flex-1">
                                        <div class="font-medium text-gray-900">${software?.nom || 'Application inconnue'}</div>
                                        <div class="text-sm text-gray-600">${right?.nom || 'Niveau inconnu'}</div>
                                    </div>
                                </label>
                            `;
                        }).join('')}
                    </div>
                </div>

                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div class="flex items-start">
                        <i class="fas fa-exclamation-triangle text-yellow-600 mt-0.5 mr-2"></i>
                        <div class="text-sm text-yellow-800">
                            <p class="font-medium mb-1">Attention :</p>
                            <p>Cette action supprimera les accès sélectionnés pour tous les utilisateurs choisis.</p>
                            <p>Cette action est irréversible.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const actions = [
            {
                text: `Supprimer les accès sélectionnés`,
                class: 'px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700',
                onclick: 'window.usersManager.executeBulkRemoveAccess()'
            }
        ];

        window.app?.showModal('Suppression en masse d\'accès', modalContent, actions);
    }

    getCommonAccessForUsers(userIds) {
        if (!this.access || userIds.length === 0) return [];

        // Récupérer les accès du premier utilisateur
        const firstUserAccess = this.access.filter(acc => acc.utilisateur_id === userIds[0]);
        
        // Trouver les accès communs à tous les utilisateurs
        const commonAccess = firstUserAccess.filter(firstAcc => {
            return userIds.every(userId => {
                return this.access.some(acc => 
                    acc.utilisateur_id === userId && 
                    acc.logiciel_id === firstAcc.logiciel_id && 
                    acc.droit_id === firstAcc.droit_id
                );
            });
        });

        // Retourner les accès uniques (dédoublonner par logiciel + droit)
        const uniqueAccess = [];
        commonAccess.forEach(acc => {
            const exists = uniqueAccess.some(unique => 
                unique.logiciel_id === acc.logiciel_id && unique.droit_id === acc.droit_id
            );
            if (!exists) {
                uniqueAccess.push({
                    logiciel_id: acc.logiciel_id,
                    droit_id: acc.droit_id
                });
            }
        });

        return uniqueAccess;
    }

    showBulkChangeTeamModal() {
        if (this.selectedUsers.size === 0) {
            window.app?.showAlert('Aucun utilisateur sélectionné', 'warning');
            return;
        }

        const selectedUserNames = Array.from(this.selectedUsers).map(userId => {
            const user = this.users.find(u => u.id === userId);
            return user ? `${user.nom} ${user.prenom || ''}`.trim() : 'Utilisateur inconnu';
        });

        const activeTeams = this.teams.filter(t => !t.archived);

        const modalContent = `
            <div class="space-y-4">
                <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 class="font-medium text-purple-900 mb-2">
                        <i class="fas fa-users mr-2"></i>
                        ${this.selectedUsers.size} utilisateur${this.selectedUsers.size > 1 ? 's' : ''} sélectionné${this.selectedUsers.size > 1 ? 's' : ''}
                    </h4>
                    <div class="text-sm text-purple-800 max-h-20 overflow-y-auto">
                        ${selectedUserNames.join(', ')}
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Nouvelle équipe *
                    </label>
                    <select id="bulk-team-select" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option value="">-- Choisir une équipe --</option>
                        <option value="null">Aucune équipe</option>
                        ${activeTeams.map(team => 
                            `<option value="${team.id}">${team.nom}</option>`
                        ).join('')}
                    </select>
                </div>

                <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div class="flex items-start">
                        <i class="fas fa-info-circle text-blue-600 mt-0.5 mr-2"></i>
                        <div class="text-sm text-blue-800">
                            <p class="font-medium mb-1">Information :</p>
                            <p>Cette action changera l'équipe de tous les utilisateurs sélectionnés.</p>
                            <p>Les budgets et coûts seront automatiquement recalculés.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const actions = [
            {
                text: `Changer l'équipe de ${this.selectedUsers.size} utilisateur${this.selectedUsers.size > 1 ? 's' : ''}`,
                class: 'px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700',
                onclick: 'window.usersManager.executeBulkChangeTeam()'
            }
        ];

        window.app?.showModal('Changement d\'équipe en masse', modalContent, actions);
    }

    async executeBulkChangeTeam() {
        const teamId = document.getElementById('bulk-team-select')?.value;

        if (teamId === '') {
            window.app?.showAlert('Veuillez sélectionner une équipe', 'error');
            return;
        }

        const newTeamId = teamId === 'null' ? null : teamId;
        const team = newTeamId ? this.teams.find(t => t.id === newTeamId) : null;
        const teamName = team ? team.nom : 'Aucune équipe';

        try {
            let successCount = 0;
            const errors = [];

            for (const userId of this.selectedUsers) {
                try {
                    const user = this.users.find(u => u.id === userId);
                    if (!user) {
                        errors.push(`Utilisateur non trouvé: ${userId}`);
                        continue;
                    }

                    const oldTeamId = user.equipe_id;
                    const updatedUser = { ...user, equipe_id: newTeamId };

                    const result = await window.D1API.update('utilisateurs', userId, updatedUser);
                    
                    if (result.success) {
                        successCount++;
                        
                        // Log du changement d'équipe
                        if (window.logger) {
                            const oldTeam = oldTeamId ? this.teams.find(t => t.id === oldTeamId) : null;
                            await window.logger.log('UPDATE', 'utilisateurs', userId, 
                                { ...user, equipe_id: oldTeamId }, 
                                updatedUser, 
                                `Changement d'équipe en masse: ${user.nom} ${user.prenom} de "${oldTeam?.nom || 'Aucune équipe'}" vers "${teamName}"`
                            );
                        }
                    } else {
                        throw new Error(result.error);
                    }
                } catch (error) {
                    const user = this.users.find(u => u.id === userId);
                    errors.push(`${user?.nom || 'Utilisateur inconnu'}: ${error.message}`);
                }
            }

            // Fermer le modal
            document.querySelector('.fixed')?.remove();

            // Afficher le résultat
            let message = `✅ ${successCount} utilisateur${successCount > 1 ? 's' : ''} transféré${successCount > 1 ? 's' : ''} vers "${teamName}"`;
            if (errors.length > 0) {
                message += `\n❌ ${errors.length} erreur${errors.length > 1 ? 's' : ''}`;
                console.error('Erreurs lors du changement d\'équipe en masse:', errors);
            }

            window.app?.showAlert(message, successCount > 0 ? 'success' : 'error');
            
            // Rafraîchir les données
            await this.loadUsers();
            
        } catch (error) {
            console.error('Erreur lors du changement d\'équipe en masse:', error);
            window.app?.showAlert('Erreur lors du changement d\'équipe en masse', 'error');
        }
    }

    async executeBulkRemoveAccess() {
        const selectedAccess = document.querySelectorAll('.bulk-remove-access:checked');
        
        if (selectedAccess.length === 0) {
            window.app?.showAlert('Veuillez sélectionner au moins un accès à supprimer', 'error');
            return;
        }

        try {
            let successCount = 0;
            const errors = [];

            // Récupérer tous les accès existants
            const accessResult = await window.D1API.get('acces');
            const allAccess = accessResult.data || [];

            for (const checkbox of selectedAccess) {
                const softwareId = checkbox.getAttribute('data-software-id');
                const rightId = checkbox.getAttribute('data-right-id');

                for (const userId of this.selectedUsers) {
                    // Trouver l'accès spécifique à supprimer
                    const accessToRemove = allAccess.find(acc => 
                        acc.utilisateur_id === userId && 
                        acc.logiciel_id === softwareId && 
                        acc.droit_id === rightId
                    );

                    if (accessToRemove) {
                        try {
                            const result = await window.D1API.delete('acces', accessToRemove.id);
                            if (result.success) {
                                successCount++;
                                
                                // Log de la suppression
                                if (window.logger) {
                                    const user = this.users.find(u => u.id === userId);
                                    const software = this.software.find(s => s.id === softwareId);
                                    const right = this.droits.find(d => d.id === rightId);
                                    await window.logger.log('DELETE', 'acces', accessToRemove.id, accessToRemove, null, 
                                        `Suppression en masse: ${software?.nom} (${right?.nom}) pour ${user?.nom} ${user?.prenom}`);
                                }
                            } else {
                                throw new Error(result.error);
                            }
                        } catch (error) {
                            const user = this.users.find(u => u.id === userId);
                            errors.push(`${user?.nom || 'Utilisateur inconnu'}: ${error.message}`);
                        }
                    }
                }
            }

            // Fermer le modal
            document.querySelector('.fixed')?.remove();

            // Afficher le résultat
            let message = `✅ ${successCount} accès supprimé${successCount > 1 ? 's' : ''}`;
            if (errors.length > 0) {
                message += `\n❌ ${errors.length} erreur${errors.length > 1 ? 's' : ''}`;
                console.error('Erreurs lors de la suppression en masse:', errors);
            }

            window.app?.showAlert(message, successCount > 0 ? 'success' : 'error');
            
            // Rafraîchir les données
            await this.loadUsers();
            
        } catch (error) {
            console.error('Erreur lors de la suppression en masse:', error);
            window.app?.showAlert('Erreur lors de la suppression en masse', 'error');
        }
    }

    // =================== PAGINATION ===================

    changePage(page) {
        this.currentPage = page;
        window.paginationUtils?.savePage('users', page);
        this.renderUsersTable();
        
        // Scroll vers le haut du tableau
        document.getElementById('users-table-container')?.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialiser le gestionnaire des utilisateurs
document.addEventListener('DOMContentLoaded', () => {
    window.usersManager = new UsersManager();
});