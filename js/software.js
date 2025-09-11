// Gestionnaire des logiciels
class SoftwareManager {
    constructor() {
        this.software = [];
        this.droits = [];
        this.costs = [];
        this.access = [];
        this.users = [];
        this.showArchived = false;
        this.showShopifyOnly = false;
        this.sortColumn = 'nom';
        this.sortDirection = 'asc';
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
        document.getElementById('add-software-btn')?.addEventListener('click', () => {
            this.showAddSoftwareModal();
        });

        document.getElementById('show-archived-software')?.addEventListener('change', (e) => {
            this.showArchived = e.target.checked;
            this.loadSoftware();
        });

        document.getElementById('show-shopify-only')?.addEventListener('change', (e) => {
            this.showShopifyOnly = e.target.checked;
            this.loadSoftware();
        });

        // Search functionality
        document.getElementById('software-search')?.addEventListener('input', (e) => {
            this.filterSoftware(e.target.value);
        });
    }

    async loadSoftware() {
        try {
            const [softwareResult, costsResult, usersResult, accessResult, teamsResult] = await Promise.all([
                window.D1API.get('logiciels'),
                window.D1API.get('couts_licences'),
                window.D1API.get('utilisateurs'),
                window.D1API.get('acces'),
                window.D1API.get('equipes')
            ]);

            this.software = softwareResult.data || [];
            this.costs = costsResult.data || [];
            this.users = usersResult.data || [];
            this.access = accessResult.data || [];
            this.teams = teamsResult.data || [];

            this.renderSoftwareTable();
        } catch (error) {
            console.error('Erreur lors du chargement des logiciels:', error);
            window.app?.showAlert('Erreur lors du chargement des logiciels', 'error');
        }
    }

    filterSoftware(searchTerm) {
        const rows = document.querySelectorAll('#software-table-container tbody tr');
        const term = searchTerm.toLowerCase();

        rows.forEach(row => {
            const name = row.cells[0]?.textContent.toLowerCase() || '';
            const description = row.cells[1]?.textContent.toLowerCase() || '';
            const cost = row.cells[2]?.textContent.toLowerCase() || '';

            if (name.includes(term) || description.includes(term) || cost.includes(term)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    renderSoftwareTable() {
        const container = document.getElementById('software-table-container');
        if (!container) return;

        let filteredSoftware = this.software;
        
        // Filtre archivé
        if (!this.showArchived) {
            filteredSoftware = filteredSoftware.filter(s => !s.archived);
        }
        
        // Filtre Shopify uniquement
        if (this.showShopifyOnly) {
            filteredSoftware = filteredSoftware.filter(s => s.application_shopify === true);
        }

        const tableHtml = `
            <table class="min-w-full table-auto">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onclick="window.softwareManager.sortTable('nom')">
                            Logiciel <i class="fas fa-sort ml-1"></i>
                        </th>
                        <th class="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Équipe</th>
                        <th class="hidden lg:table-cell px-3 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">🛒 Shopify</th>
                        <th class="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accès</th>
                        <th class="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qui paye</th>
                        <th class="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paiement</th>
                        <th class="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date souscription</th>
                        <th class="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prochain paiement</th>
                        <th class="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coût Annuel</th>
                        <th class="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th class="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${filteredSoftware.map(software => this.renderSoftwareRow(software)).join('')}
                </tbody>
            </table>
            ${filteredSoftware.length === 0 ? '<div class="text-center py-8 text-gray-500 text-sm sm:text-base">Aucun logiciel trouvé</div>' : ''}
        `;

        container.innerHTML = tableHtml;
    }

    renderSoftwareRow(software) {
        const payerUser = this.users.find(u => u.id === software.payer_id);
        const team = this.teams.find(t => t.id === software.equipe_id);
        const subscriptionDate = software.date_souscription ? 
            new Date(software.date_souscription).toLocaleDateString('fr-FR') : '-';
        
        const paymentMethodLabels = {
            'carte': '💳 Carte',
            'prelevement': '🏦 Prélèvement',
            'virement': '📤 Virement'
        };

        // Calculer les coûts une seule fois pour optimiser les performances
        const monthlyCost = this.calculateSoftwareCost(software.id);
        const annualCost = monthlyCost * 12;
        
        // Calculer le prochain paiement basé sur la périodicité
        const nextPayment = this.calculateNextPayment(software);

        return `
            <tr class="${software.archived ? 'bg-gray-50 text-gray-500' : ''}">
                <td class="px-3 sm:px-6 py-3 sm:py-4">
                    <div class="flex items-center">
                        <div class="text-sm font-medium text-gray-900">${software.nom}</div>
                        ${software.logiciel_de_base ? '<span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Base</span>' : ''}
                    </div>
                    ${software.description ? `<div class="text-xs text-gray-500 mt-1">${software.description}</div>` : ''}
                </td>
                <td class="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4">
                    <div class="text-sm text-gray-900">${team ? team.nom : '-'}</div>
                </td>
                <td class="hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4">
                    <div class="text-center">
                        ${software.application_shopify ? 
                            '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">🛒 Shopify</span>' : 
                            '<span class="text-gray-400 text-sm">-</span>'
                        }
                    </div>
                </td>
                <td class="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4">
                    <div class="text-sm text-center">
                        <span class="inline-flex items-center justify-center w-8 h-8 rounded-full ${this.countActiveAccessForSoftware(software.id) > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'} text-sm font-medium">
                            ${this.countActiveAccessForSoftware(software.id)}
                        </span>
                    </div>
                </td>
                <td class="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4">
                    <div class="text-sm text-gray-900">${payerUser ? `${payerUser.nom} ${payerUser.prenom}` : '-'}</div>
                </td>
                <td class="hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4">
                    <div class="text-sm text-gray-600">${paymentMethodLabels[software.moyen_paiement] || '-'}</div>
                </td>
                <td class="hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4">
                    <div class="text-sm text-gray-600">${subscriptionDate}</div>
                </td>
                <td class="hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4">
                    ${nextPayment ? `<div class="text-sm ${nextPayment.color}">${nextPayment.date}</div>` : '<div class="text-sm text-gray-400">-</div>'}
                </td>
                <td class="hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4">
                    <div class="text-sm font-medium text-purple-600">${annualCost.toFixed(2)}€</div>
                    <div class="text-xs text-gray-500">(${monthlyCost.toFixed(2)}€/mois)</div>
                </td>
                <td class="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        software.archived ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }">
                        ${software.archived ? 'Archivé' : 'Actif'}
                    </span>
                </td>
                <td class="px-3 sm:px-6 py-3 sm:py-4 text-right">
                    <div class="flex justify-end space-x-1 sm:space-x-2">
                        <button onclick="window.softwareManager.editSoftware('${software.id}')" 
                                class="text-blue-600 hover:text-blue-900 p-1" title="Modifier">
                            <i class="fas fa-edit text-sm"></i>
                        </button>
                        <button onclick="window.softwareManager.manageCosts('${software.id}')" 
                                class="text-green-600 hover:text-green-900 p-1" title="Gérer les coûts">
                            <i class="fas fa-euro-sign text-sm"></i>
                        </button>
                        <button onclick="window.softwareManager.manageAccess('${software.id}')" 
                                class="text-purple-600 hover:text-purple-900 p-1" title="Gérer les accès">
                            <i class="fas fa-users text-sm"></i>
                        </button>
                        ${!software.archived ? 
                            `<button onclick="window.softwareManager.archiveSoftware('${software.id}')" 
                                     class="text-red-600 hover:text-red-900 p-1" title="Archiver">
                                <i class="fas fa-archive text-sm"></i>
                             </button>` :
                            `<button onclick="window.softwareManager.unarchiveSoftware('${software.id}')" 
                                     class="text-green-600 hover:text-green-900 p-1" title="Désarchiver">
                                <i class="fas fa-undo text-sm"></i>
                             </button>`
                        }
                    </div>
                    <div class="sm:hidden mt-2 space-y-1">
                        ${!software.archived ? 
                            `<span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Actif
                            </span>` :
                            `<span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                Archivé
                            </span>`
                        }
                        <div class="text-xs text-gray-600 mt-1">
                            <div><strong>Coût mensuel:</strong> ${monthlyCost.toFixed(2)}€</div>
                            <div><strong>Coût annuel:</strong> ${annualCost.toFixed(2)}€</div>
                            <div><strong>Accès actifs:</strong> ${this.countActiveAccessForSoftware(software.id)}</div>
                            ${nextPayment ? `<div class="${nextPayment.color}"><strong>Prochain paiement:</strong> ${nextPayment.date}</div>` : ''}
                            ${team ? `<div><strong>Équipe:</strong> ${team.nom}</div>` : ''}
                            ${payerUser ? `<div><strong>Payé par:</strong> ${payerUser.nom} ${payerUser.prenom}</div>` : ''}
                        </div>
                    </div>
                </td>
            </tr>
        `;
    }

    async showAddSoftwareModal() {
        // Charger les utilisateurs pour la liste "Qui paye"
        const usersResponse = await window.D1API.get('utilisateurs');
        const users = (usersResponse.data || []).filter(u => !u.archived);
        const usersOptions = users.map(user => 
            `<option value="${user.id}">${user.nom} ${user.prenom || ''}</option>`
        ).join('');

        // Charger les équipes
        const teamsResponse = await window.D1API.get('equipes');
        const teams = (teamsResponse.data || []).filter(t => !t.archived);
        const teamsOptions = teams.map(team => 
            `<option value="${team.id}">${team.nom}</option>`
        ).join('');

        const modalContent = `
            <form id="add-software-form">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nom du logiciel *</label>
                        <input type="text" id="software-nom" required 
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea id="software-description" rows="3"
                                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Équipe *</label>
                            <select id="software-team" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Sélectionner une équipe</option>
                                ${teamsOptions}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Qui paye ? *</label>
                            <select id="software-payer" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Sélectionner un utilisateur</option>
                                ${usersOptions}
                            </select>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Moyen de paiement *</label>
                            <select id="software-payment-method" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Sélectionner un moyen de paiement</option>
                                <option value="carte">Carte bancaire</option>
                                <option value="prelevement">Prélèvement automatique</option>
                                <option value="virement">Virement</option>
                                <option value="cheque">Chèque</option>
                                <option value="especes">Espèces</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Périodicité de paiement *</label>
                            <select id="software-periodicity" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Sélectionner une périodicité</option>
                                <option value="mensuel">Mensuel</option>
                                <option value="trimestriel">Trimestriel</option>
                                <option value="semestriel">Semestriel</option>
                                <option value="annuel">Annuel</option>
                                <option value="ponctuel">Ponctuel (achat unique)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Date de souscription *</label>
                            <input type="date" id="software-subscription-date" required
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   value="${new Date().toISOString().split('T')[0]}">
                        </div>
                    </div>
                    
                    <div class="space-y-3">
                        <div class="flex items-center">
                            <input type="checkbox" id="software-base" 
                                   class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                            <label for="software-base" class="ml-2 block text-sm text-gray-700">
                                Logiciel de base (accès automatique pour les nouveaux utilisateurs)
                            </label>
                        </div>
                        <div class="flex items-center">
                            <input type="checkbox" id="software-shopify" 
                                   class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded">
                            <label for="software-shopify" class="ml-2 block text-sm text-gray-700">
                                🛒 Application Shopify (e-commerce)
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
                onclick: 'window.softwareManager.saveSoftware()'
            }
        ];

        window.app?.showModal('Ajouter un logiciel', modalContent, actions, 'lg');
    }

    async saveSoftware(softwareId = null) {
        const nom = document.getElementById('software-nom').value.trim();
        const description = document.getElementById('software-description').value.trim();
        const logiciel_de_base = document.getElementById('software-base').checked;
        const application_shopify = document.getElementById('software-shopify').checked;
        const equipe_id = document.getElementById('software-team').value;
        const payer_id = document.getElementById('software-payer').value;
        const moyen_paiement = document.getElementById('software-payment-method').value;
        const periodicite = document.getElementById('software-periodicity').value;
        const date_souscription = document.getElementById('software-subscription-date').value;

        // Validation des champs obligatoires
        if (!nom) {
            window.app?.showAlert('Le nom du logiciel est requis', 'error');
            return;
        }

        if (!equipe_id) {
            window.app?.showAlert('L\'équipe est requise', 'error');
            return;
        }

        if (!payer_id) {
            window.app?.showAlert('Le champ "Qui paye ?" est requis', 'error');
            return;
        }

        if (!moyen_paiement) {
            window.app?.showAlert('Le moyen de paiement est requis', 'error');
            return;
        }

        if (!periodicite) {
            window.app?.showAlert('La périodicité de paiement est requise', 'error');
            return;
        }

        if (!date_souscription) {
            window.app?.showAlert('La date de souscription est requise', 'error');
            return;
        }

        try {
            const softwareData = {
                nom,
                description,
                logiciel_de_base,
                application_shopify,
                equipe_id,
                payer_id,
                moyen_paiement,
                periodicite,
                date_souscription,
                archived: false
            };

            if (softwareId) {
                // Récupérer les anciennes valeurs pour le log
                const oldSoftware = this.software.find(s => s.id === softwareId);
                
                // Mise à jour
                const result = await window.D1API.update('logiciels', softwareId, softwareData);
                if (!result.success) {
                    throw new Error(result.error);
                }
                
                // Log de la modification
                if (window.logger) {
                    await window.logger.log('UPDATE', 'logiciels', softwareId, oldSoftware, softwareData, `Modification du logiciel ${softwareData.nom}`);
                }
                
                window.app?.showAlert('Logiciel modifié avec succès', 'success');
            } else {
                // Création
                const result = await window.D1API.create('logiciels', softwareData);
                if (!result.success) {
                    throw new Error(result.error);
                }
                
                // Log de la création
                if (window.logger) {
                    await window.logger.log('CREATE', 'logiciels', result.data.id, null, softwareData, `Création du logiciel ${softwareData.nom}`);
                }
                
                window.app?.showAlert('Logiciel ajouté avec succès', 'success');
            }

            document.querySelector('.fixed')?.remove();
            await this.loadSoftware();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            window.app?.showAlert('Erreur lors de la sauvegarde', 'error');
        }
    }





    async editSoftware(softwareId) {
        const software = this.software.find(s => s.id === softwareId);
        if (!software) return;

        // Charger les utilisateurs pour la liste "Qui paye"
        const usersResponse = await window.D1API.get('utilisateurs');
        const users = (usersResponse.data || []).filter(u => !u.archived);
        const usersOptions = users.map(user => 
            `<option value="${user.id}" ${user.id === software.payer_id ? 'selected' : ''}>${user.nom} ${user.prenom || ''}</option>`
        ).join('');

        // Charger les équipes
        const teamsResponse = await window.D1API.get('equipes');
        const teams = (teamsResponse.data || []).filter(t => !t.archived);
        const teamsOptions = teams.map(team => 
            `<option value="${team.id}" ${team.id === software.equipe_id ? 'selected' : ''}>${team.nom}</option>`
        ).join('');

        const modalContent = `
            <form id="edit-software-form">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nom du logiciel *</label>
                        <input type="text" id="software-nom" required value="${software.nom || ''}"
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea id="software-description" rows="3"
                                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">${software.description || ''}</textarea>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Équipe *</label>
                            <select id="software-team" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Sélectionner une équipe</option>
                                ${teamsOptions}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Qui paye ? *</label>
                            <select id="software-payer" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Sélectionner un utilisateur</option>
                                ${usersOptions}
                            </select>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Moyen de paiement *</label>
                            <select id="software-payment-method" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Sélectionner un moyen de paiement</option>
                                <option value="carte" ${software.moyen_paiement === 'carte' ? 'selected' : ''}>Carte bancaire</option>
                                <option value="prelevement" ${software.moyen_paiement === 'prelevement' ? 'selected' : ''}>Prélèvement automatique</option>
                                <option value="virement" ${software.moyen_paiement === 'virement' ? 'selected' : ''}>Virement</option>
                                <option value="cheque" ${software.moyen_paiement === 'cheque' ? 'selected' : ''}>Chèque</option>
                                <option value="especes" ${software.moyen_paiement === 'especes' ? 'selected' : ''}>Espèces</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Périodicité de paiement *</label>
                            <select id="software-periodicity" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Sélectionner une périodicité</option>
                                <option value="mensuel" ${software.periodicite === 'mensuel' ? 'selected' : ''}>Mensuel</option>
                                <option value="trimestriel" ${software.periodicite === 'trimestriel' ? 'selected' : ''}>Trimestriel</option>
                                <option value="semestriel" ${software.periodicite === 'semestriel' ? 'selected' : ''}>Semestriel</option>
                                <option value="annuel" ${software.periodicite === 'annuel' ? 'selected' : ''}>Annuel</option>
                                <option value="ponctuel" ${software.periodicite === 'ponctuel' ? 'selected' : ''}>Ponctuel (achat unique)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Date de souscription *</label>
                            <input type="date" id="software-subscription-date" required value="${software.date_souscription || ''}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                    
                    <div class="space-y-3">
                        <div class="flex items-center">
                            <input type="checkbox" id="software-base" ${software.logiciel_de_base ? 'checked' : ''}
                                   class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                            <label for="software-base" class="ml-2 block text-sm text-gray-700">
                                Logiciel de base (accès automatique pour les nouveaux utilisateurs)
                            </label>
                        </div>
                        <div class="flex items-center">
                            <input type="checkbox" id="software-shopify" ${software.application_shopify ? 'checked' : ''}
                                   class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded">
                            <label for="software-shopify" class="ml-2 block text-sm text-gray-700">
                                🛒 Application Shopify (e-commerce)
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
                onclick: `window.softwareManager.saveSoftware('${softwareId}')`
            }
        ];

        window.app?.showModal('Modifier le logiciel', modalContent, actions, 'lg');
    }

    manageCosts(softwareId) {
        const software = this.software.find(s => s.id === softwareId);
        if (!software) return;

        const softwareCosts = this.costs.filter(c => c.logiciel_id === softwareId);
        
        const modalContent = `
            <div class="space-y-4">
                <h4 class="font-medium text-gray-900">Coûts pour: ${software.nom}</h4>
                <div id="costs-list">
                    ${this.droits.map(droit => {
                        const existingCost = softwareCosts.find(c => c.droit_id === droit.id);
                        return `
                            <div class="flex items-center justify-between p-3 border rounded-lg">
                                <span class="font-medium">${droit.nom}</span>
                                <div class="flex items-center space-x-2">
                                    <input type="number" step="0.01" min="0" 
                                           id="cost-${droit.id}" 
                                           value="${existingCost ? existingCost.cout_mensuel : ''}"
                                           placeholder="0.00"
                                           class="w-20 px-2 py-1 border border-gray-300 rounded text-sm">
                                    <span class="text-sm text-gray-500">€/mois</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        const actions = [
            {
                text: 'Sauvegarder',
                class: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700',
                onclick: `window.softwareManager.saveCosts('${softwareId}')`
            }
        ];

        window.app?.showModal('Gérer les coûts', modalContent, actions);
    }

    async saveCosts(softwareId) {
        try {
            // Supprimer les coûts existants pour ce logiciel
            const existingCosts = this.costs.filter(c => c.logiciel_id === softwareId);
            for (const cost of existingCosts) {
                await window.D1API.delete('couts_licences', cost.id);
            }

            // Ajouter les nouveaux coûts
            for (const droit of this.droits) {
                const costValue = document.getElementById(`cost-${droit.id}`)?.value;
                if (costValue && parseFloat(costValue) > 0) {
                    const result = await window.D1API.create('couts_licences', {
                        logiciel_id: softwareId,
                        droit_id: droit.id,
                        cout_mensuel: parseFloat(costValue)
                    });
                    if (!result.success) {
                        throw new Error(result.error);
                    }
                }
            }

            document.querySelector('.fixed')?.remove();
            await this.loadSoftware();
            window.app?.showAlert('Coûts sauvegardés avec succès', 'success');
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des coûts:', error);
            window.app?.showAlert('Erreur lors de la sauvegarde des coûts', 'error');
        }
    }

    async manageAccess(softwareId) {
        const software = this.software.find(s => s.id === softwareId);
        if (!software) return;

        try {
            const [usersResult, accessResult] = await Promise.all([
                window.D1API.get('utilisateurs'),
                window.D1API.get('acces')
            ]);

            const users = (usersResult.data || []).filter(u => !u.archived);
            const access = (accessResult.data || []).filter(a => a.logiciel_id === softwareId);

            const modalContent = `
                <div class="space-y-4">
                    <h4 class="font-medium text-gray-900">Accès pour: ${software.nom}</h4>
                    <div class="max-h-60 overflow-y-auto space-y-2">
                        ${access.map(acc => {
                            const user = users.find(u => u.id === acc.utilisateur_id);
                            const droit = this.droits.find(d => d.id === acc.droit_id);
                            return `
                                <div class="flex items-center justify-between p-2 border rounded">
                                    <span class="text-sm">${user?.nom || 'Utilisateur inconnu'} ${user?.prenom || ''}</span>
                                    <div class="flex items-center space-x-2">
                                        <span class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">${droit?.nom || 'N/A'}</span>
                                        <button onclick="window.softwareManager.removeAccess('${acc.id}')" 
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
                            <select id="select-user" class="w-full sm:flex-1 px-2 py-1 border border-gray-300 rounded text-sm">
                                <option value="">Sélectionner un utilisateur</option>
                                ${users.map(user => `<option value="${user.id}">${user.nom} ${user.prenom}</option>`).join('')}
                            </select>
                            <select id="select-right" class="w-full sm:flex-1 px-2 py-1 border border-gray-300 rounded text-sm">
                                <option value="">Sélectionner un droit</option>
                                ${this.droits.map(droit => `<option value="${droit.id}">${droit.nom}</option>`).join('')}
                            </select>
                            <button onclick="window.softwareManager.addAccess('${softwareId}')" 
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

    async addAccess(softwareId) {
        const userId = document.getElementById('select-user')?.value;
        const rightId = document.getElementById('select-right')?.value;

        if (!userId || !rightId) {
            window.app?.showAlert('Veuillez sélectionner un utilisateur et un droit', 'error');
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
            this.manageAccess(softwareId); // Recharger la modal
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'accès:', error);
            window.app?.showAlert('Erreur lors de l\'ajout de l\'accès', 'error');
        }
    }

    async removeAccess(accessId) {
        try {
            const result = await window.D1API.delete('acces', accessId);
            if (!result.success) {
                throw new Error(result.error);
            }
            window.app?.showAlert('Accès supprimé avec succès', 'success');
            // Recharger la vue
            const modal = document.querySelector('.fixed');
            if (modal) {
                const softwareId = modal.querySelector('[onclick*="addAccess"]')?.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
                if (softwareId) {
                    document.querySelector('.fixed')?.remove();
                    this.manageAccess(softwareId);
                }
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'accès:', error);
            window.app?.showAlert('Erreur lors de la suppression de l\'accès', 'error');
        }
    }

    async archiveSoftware(softwareId) {
        if (!confirm('Êtes-vous sûr de vouloir archiver ce logiciel ?')) return;

        try {
            const software = this.software.find(s => s.id === softwareId);
            if (software) {
                const result = await window.D1API.update('logiciels', softwareId, { ...software, archived: true });
                if (!result.success) {
                    throw new Error(result.error);
                }

                window.app?.showAlert('Logiciel archivé avec succès', 'success');
                await this.loadSoftware();
            }
        } catch (error) {
            console.error('Erreur lors de l\'archivage:', error);
            window.app?.showAlert('Erreur lors de l\'archivage', 'error');
        }
    }

    async unarchiveSoftware(softwareId) {
        try {
            const software = this.software.find(s => s.id === softwareId);
            if (software) {
                const result = await window.D1API.update('logiciels', softwareId, { ...software, archived: false });
                if (!result.success) {
                    throw new Error(result.error);
                }

                window.app?.showAlert('Logiciel désarchivé avec succès', 'success');
                await this.loadSoftware();
            }
        } catch (error) {
            console.error('Erreur lors du désarchivage:', error);
            window.app?.showAlert('Erreur lors du désarchivage', 'error');
        }
    }

    calculateSoftwareCost(softwareId) {
        if (!this.access || !this.costs || !this.users) return 0;
        
        const software = this.software.find(s => s.id === softwareId);
        if (!software) return 0;
        
        const softwareAccess = this.access.filter(a => a.logiciel_id === softwareId);
        const activeUsers = this.users.filter(u => !u.archived);
        
        // Les coûts dans couts_licences sont mensuels
        // Périodicité utilisée seulement pour l'échéancier, pas pour les calculs de coûts
        
        let totalCost = 0;
        const processedShared = new Set();

        for (const acc of softwareAccess) {
            // Vérifier que l'utilisateur est toujours actif
            const user = activeUsers.find(u => u.id === acc.utilisateur_id);
            if (!user) continue;

            const cost = this.costs.find(c => c.logiciel_id === acc.logiciel_id && c.droit_id === acc.droit_id);
            const droit = this.droits.find(d => d.id === acc.droit_id);
            
            if (cost && droit) {
                // Le coût de base est mensuel
                const monthlyCost = cost.cout_mensuel || 0;
                
                if (droit.nom === 'Accès communs') {
                    const sharedKey = `${acc.logiciel_id}_${acc.droit_id}`;
                    if (!processedShared.has(sharedKey)) {
                        totalCost += monthlyCost;
                        processedShared.add(sharedKey);
                    }
                } else {
                    totalCost += monthlyCost;
                }
            }
        }

        return totalCost;
    }

    calculateNextPayment(software) {
        // Si pas de date de souscription, pas de calcul possible
        if (!software.date_souscription) {
            return { date: 'Non défini', color: 'text-gray-500' };
        }

        const subscriptionDate = new Date(software.date_souscription);
        const today = new Date();
        const periodicity = software.periodicite || 'mensuel';

        // Définir les intervalles en mois et les couleurs
        const periodConfig = {
            'mensuel': { months: 1, color: 'text-blue-600' },
            'trimestriel': { months: 3, color: 'text-orange-600' },
            'semestriel': { months: 6, color: 'text-purple-600' },
            'annuel': { months: 12, color: 'text-red-600' }
        };

        const config = periodConfig[periodicity] || periodConfig['mensuel'];
        
        // Calculer la prochaine date de paiement
        let nextPaymentDate = new Date(subscriptionDate);
        
        // Avancer jusqu'à dépasser aujourd'hui
        while (nextPaymentDate <= today) {
            nextPaymentDate.setMonth(nextPaymentDate.getMonth() + config.months);
        }

        // Formater la date en français
        const options = { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        };
        
        return {
            date: nextPaymentDate.toLocaleDateString('fr-FR', options),
            color: config.color
        };
    }

    sortTable(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        const filteredSoftware = this.showArchived ? 
            this.software : 
            this.software.filter(s => !s.archived);

        filteredSoftware.sort((a, b) => {
            let aVal, bVal;

            switch (column) {
                case 'nom':
                    aVal = a.nom.toLowerCase();
                    bVal = b.nom.toLowerCase();
                    break;
                case 'cout':
                    aVal = this.calculateSoftwareCost(a.id);
                    bVal = this.calculateSoftwareCost(b.id);
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

        // Réassigner les logiciels triés
        if (this.showArchived) {
            this.software = filteredSoftware;
        } else {
            // Garder les logiciels archivés à leur place
            const archivedSoftware = this.software.filter(s => s.archived);
            this.software = [...filteredSoftware, ...archivedSoftware];
        }

        this.renderSoftwareTable();
    }

    countActiveAccessForSoftware(softwareId) {
        // Compter les accès actifs (utilisateurs non archivés) pour ce logiciel
        const softwareAccess = this.access.filter(access => access.logiciel_id === softwareId);
        const activeAccess = softwareAccess.filter(access => {
            const user = this.users.find(u => u.id === access.utilisateur_id);
            return user && !user.archived;
        });
        return activeAccess.length;
    }
}

// Initialiser le gestionnaire des logiciels
document.addEventListener('DOMContentLoaded', () => {
    window.softwareManager = new SoftwareManager();
});