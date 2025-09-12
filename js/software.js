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
        this.selectedSoftware = new Set(); // Pour la sélection multiple
        this.currentPage = 1; // Pagination
        this.allSoftware = []; // Stockage de tous les logiciels avant filtrage
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
            this.currentPage = 1; // Reset à la page 1
            this.renderSoftwareTable();
        });

        document.getElementById('show-shopify-only')?.addEventListener('change', (e) => {
            this.showShopifyOnly = e.target.checked;
            this.currentPage = 1; // Reset à la page 1
            this.renderSoftwareTable();
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

            this.allSoftware = softwareResult.data || [];
            this.costs = costsResult.data || [];
            this.users = usersResult.data || [];
            this.access = accessResult.data || [];
            this.teams = teamsResult.data || [];

            // Récupérer la page sauvegardée
            this.currentPage = window.paginationUtils?.getSavedPage('software') || 1;
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
            // Maintenant la première colonne est la checkbox, donc décaler d'une colonne
            const name = row.cells[1]?.textContent.toLowerCase() || '';
            const description = row.cells[2]?.textContent.toLowerCase() || '';
            const cost = row.cells[3]?.textContent.toLowerCase() || '';

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

        let filteredSoftware = this.allSoftware;
        
        // Filtre archivé
        if (!this.showArchived) {
            filteredSoftware = filteredSoftware.filter(s => !s.archived);
        }
        
        // Filtre Shopify uniquement
        if (this.showShopifyOnly) {
            filteredSoftware = filteredSoftware.filter(s => s.application_shopify === true);
        }

        // Paginer les résultats
        const paginationResult = window.paginationUtils?.paginateData(filteredSoftware, this.currentPage);
        if (!paginationResult) return;

        this.software = paginationResult.data; // Logiciels de la page courante

        // Légende des couleurs
        const legendHtml = `
            <div class="mb-4 p-4 bg-gray-50 rounded-lg">
                <h4 class="text-sm font-medium text-gray-700 mb-3">📊 Légende des couleurs :</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                    <div class="flex items-center">
                        <div class="w-3 h-3 bg-blue-600 rounded mr-2"></div>
                        <span class="text-blue-600">Mensuel</span>
                    </div>
                    <div class="flex items-center">
                        <div class="w-3 h-3 bg-orange-600 rounded mr-2"></div>
                        <span class="text-orange-600">Trimestriel</span>
                    </div>
                    <div class="flex items-center">
                        <div class="w-3 h-3 bg-purple-600 rounded mr-2"></div>
                        <span class="text-purple-600">Semestriel</span>
                    </div>
                    <div class="flex items-center">
                        <div class="w-3 h-3 bg-red-600 rounded mr-2"></div>
                        <span class="text-red-600">Annuel</span>
                    </div>
                </div>
                <div class="mt-2 pt-2 border-t border-gray-200">
                    <div class="flex flex-wrap gap-4 text-xs">
                        <div class="flex items-center">
                            <span class="text-red-500 mr-1">⚠️</span>
                            <span class="text-gray-600">Alerte engagement (≤30 jours)</span>
                        </div>
                        <div class="flex items-center">
                            <div class="w-3 h-3 bg-orange-50 border border-orange-200 rounded mr-2"></div>
                            <span class="text-gray-600">Logiciel archivé</span>
                        </div>
                        <div class="flex items-center">
                            <div class="w-3 h-3 bg-red-50 border-l-2 border-red-500 rounded mr-2"></div>
                            <span class="text-gray-600">Engagement en alerte</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const tableHtml = `
            <table class="min-w-full table-auto">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                            <input type="checkbox" id="select-all-software" class="rounded" onchange="window.softwareManager.toggleSelectAll(this.checked)">
                        </th>
                        <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onclick="window.softwareManager.sortTable('nom')">
                            Logiciel <i class="fas fa-sort ml-1"></i>
                        </th>
                        <th class="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Équipe / Payeur / Paiement</th>
                        <th class="hidden lg:table-cell px-3 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">🛒 Shopify</th>
                        <th class="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prochain paiement</th>
                        <th class="hidden xl:table-cell px-3 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">📋 Engagement</th>
                        <th class="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accès</th>
                        <th class="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coût Annuel HT</th>
                        <th class="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${this.software.map(software => this.renderSoftwareRow(software)).join('')}
                </tbody>
            </table>
            ${this.software.length === 0 ? '<div class="text-center py-8 text-gray-500 text-sm sm:text-base">Aucun logiciel trouvé</div>' : ''}
        `;

        container.innerHTML = legendHtml + tableHtml;

        // Ajouter les contrôles de pagination
        if (window.paginationUtils) {
            window.paginationUtils.renderPaginationControls(
                paginationResult.totalItems,
                paginationResult.currentPage,
                'software-pagination',
                'window.softwareManager.changePage'
            );
        }

        // Animation
        window.paginationUtils?.animateTableUpdate('#software-table-container table');
    }

    renderSoftwareRow(software) {
        const payerUser = this.users.find(u => u.id === software.payer_id);
        const team = this.teams.find(t => t.id === software.equipe_id);
        
        const paymentMethodLabels = {
            'carte': '💳',
            'prelevement': '🏦',
            'virement': '📤',
            'cheque': '📝',
            'especes': '💵'
        };

        // Calculer les coûts une seule fois pour optimiser les performances
        const monthlyCost = this.calculateSoftwareCost(software.id);
        const annualCost = monthlyCost * 12;
        
        // Calculer le prochain paiement basé sur la périodicité
        const nextPayment = this.calculateNextPayment(software);
        
        // Calculer l'alerte d'engagement
        const engagementAlert = this.calculateEngagementAlert(software);
        
        // Définir les classes CSS pour les alertes
        const rowClasses = [];
        if (software.archived) {
            rowClasses.push('bg-orange-50', 'text-orange-900');
        } else if (engagementAlert && engagementAlert.isAlert) {
            rowClasses.push('bg-red-50', 'border-l-4', 'border-red-500');
        }
        
        const rowClass = rowClasses.length > 0 ? ` class="${rowClasses.join(' ')}"` : '';

        return `
            <tr${rowClass}>
                <td class="px-3 py-3 sm:py-4 text-center">
                    <input type="checkbox" class="software-checkbox rounded" 
                           data-software-id="${software.id}" 
                           ${this.selectedSoftware.has(software.id) ? 'checked' : ''}
                           onchange="window.softwareManager.toggleSoftwareSelection('${software.id}', this.checked)">
                </td>
                <td class="px-3 sm:px-6 py-3 sm:py-4">
                    <div class="flex items-center">
                        ${engagementAlert && engagementAlert.isAlert ? '<span class="text-red-500 mr-2" title="' + engagementAlert.message + '">⚠️</span>' : ''}
                        <div class="text-sm font-medium text-gray-900">${software.nom}</div>
                        ${software.logiciel_de_base ? '<span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Base</span>' : ''}
                        ${software.cout_fixe ? '<span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">💰 Coût Fixe</span>' : ''}
                    </div>
                    ${software.description ? `<div class="text-xs text-gray-500 mt-1">${software.description}</div>` : ''}
                    ${engagementAlert && engagementAlert.isAlert ? `<div class="text-xs text-red-600 mt-1 font-medium">${engagementAlert.message}</div>` : ''}
                </td>
                <td class="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4">
                    <div class="text-sm text-gray-900">${team ? team.nom : '-'}</div>
                    <div class="text-xs text-gray-600">${payerUser ? `${payerUser.nom} ${payerUser.prenom}` : '-'}</div>
                    <div class="text-xs text-gray-500">${paymentMethodLabels[software.moyen_paiement] || ''} ${software.moyen_paiement ? software.moyen_paiement.charAt(0).toUpperCase() + software.moyen_paiement.slice(1) : '-'}</div>
                </td>
                <td class="hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4">
                    <div class="text-center">
                        ${software.application_shopify ? 
                            '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">🛒 Shopify</span>' : 
                            '<span class="text-gray-400 text-sm">-</span>'
                        }
                    </div>
                </td>
                <td class="hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4">
                    <div class="text-sm">
                        ${software.date_souscription ? 
                            `<div class="text-xs text-gray-500 mb-1">Souscrit: ${new Date(software.date_souscription).toLocaleDateString('fr-FR')}</div>` : 
                            ''
                        }
                        <div class="${nextPayment ? nextPayment.color : 'text-gray-400'}">
                            ${nextPayment ? nextPayment.date : '-'}
                        </div>
                        ${engagementAlert && engagementAlert.isAlert ? `<div class="text-red-600 text-xs mt-1">⚠️ Résiliation: ${engagementAlert.date}</div>` : ''}
                    </div>
                </td>
                <td class="hidden xl:table-cell px-3 sm:px-6 py-3 sm:py-4">
                    <div class="text-center">
                        ${software.engagement ? 
                            '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">📋 Engagement</span>' : 
                            '<span class="text-gray-400 text-sm">-</span>'
                        }
                        ${software.engagement && software.date_fin_contrat ? 
                            `<div class="text-xs text-gray-500 mt-1">Fin: ${new Date(software.date_fin_contrat).toLocaleDateString('fr-FR')}</div>` : 
                            ''
                        }
                        ${engagementAlert && engagementAlert.isAlert ? 
                            `<div class="text-xs text-red-600 mt-1 font-medium">⚠️ ${engagementAlert.daysRemaining >= 0 ? engagementAlert.daysRemaining + 'j' : 'Dépassé'}</div>` : 
                            ''
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
                <td class="hidden lg:table-cell px-3 sm:px-6 py-3 sm:py-4">
                    <div class="text-sm font-medium text-purple-600">${annualCost.toFixed(2)}€</div>
                    <div class="text-xs text-gray-500">(${monthlyCost.toFixed(2)}€/mois${software.cout_fixe ? ' - fixe' : ''})</div>
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
                        ${software.archived ? 
                            `<span class="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                                Archivé
                            </span>` : ''
                        }
                        ${engagementAlert && engagementAlert.isAlert ? 
                            `<div class="text-xs text-red-600 font-medium mb-2">⚠️ ${engagementAlert.message}</div>` : ''
                        }
                        <div class="text-xs text-gray-600 mt-1">
                            <div><strong>Coût mensuel:</strong> ${monthlyCost.toFixed(2)}€${software.cout_fixe ? ' (fixe)' : ''}</div>
                            <div><strong>Coût annuel:</strong> ${annualCost.toFixed(2)}€${software.cout_fixe ? ' (fixe)' : ''}</div>
                            <div><strong>Accès actifs:</strong> ${this.countActiveAccessForSoftware(software.id)}</div>
                            ${software.date_souscription ? `<div><strong>Souscrit le:</strong> ${new Date(software.date_souscription).toLocaleDateString('fr-FR')}</div>` : ''}
                            ${nextPayment ? `<div class="${nextPayment.color}"><strong>Prochain paiement:</strong> ${nextPayment.date}</div>` : ''}
                            ${software.engagement ? `<div class="text-red-600"><strong>📋 Engagement:</strong> Fin ${new Date(software.date_fin_contrat).toLocaleDateString('fr-FR')}</div>` : ''}
                            ${engagementAlert && engagementAlert.isAlert ? `<div class="text-red-600"><strong>⚠️ Résiliation limite:</strong> ${engagementAlert.date}</div>` : ''}
                            ${team ? `<div><strong>Équipe:</strong> ${team.nom}</div>` : ''}
                            ${payerUser ? `<div><strong>Payé par:</strong> ${payerUser.nom} ${payerUser.prenom}</div>` : ''}
                            <div><strong>Paiement:</strong> ${paymentMethodLabels[software.moyen_paiement] || ''} ${software.moyen_paiement ? software.moyen_paiement.charAt(0).toUpperCase() + software.moyen_paiement.slice(1) : '-'}</div>
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
            `<option value="${user.id}">${user.externe ? '🏢 ' : ''}${user.nom} ${user.prenom || ''}</option>`
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
                        <div class="flex items-center">
                            <input type="checkbox" id="software-engagement" 
                                   class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                   onchange="toggleEngagementFields()">
                            <label for="software-engagement" class="ml-2 block text-sm text-gray-700 font-medium">
                                📋 Engagement contractuel
                            </label>
                        </div>
                        <div class="flex items-center">
                            <input type="checkbox" id="software-fixed-cost" 
                                   class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                   onchange="toggleFixedCostFields()">
                            <label for="software-fixed-cost" class="ml-2 block text-sm text-gray-700 font-medium">
                                💰 Coût fixe (indépendant des accès)
                            </label>
                        </div>
                    </div>
                    
                    <!-- Champs d'engagement (conditionnels) -->
                    <div id="engagement-fields" class="space-y-4 border-l-4 border-red-200 pl-4 bg-red-50 p-4 rounded hidden">
                        <div class="text-sm text-red-800 font-medium mb-3">
                            ⚠️ Champs obligatoires pour les logiciels avec engagement
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    Date de fin de contrat *
                                    <span class="text-red-500">●</span>
                                </label>
                                <input type="date" id="software-contract-end" 
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
                                <p class="text-xs text-gray-500 mt-1">Date d'expiration du contrat d'engagement</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    Date limite d'annulation *
                                    <span class="text-red-500">●</span>
                                </label>
                                <input type="date" id="software-cancellation-deadline" 
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
                                <p class="text-xs text-gray-500 mt-1">Dernier délai pour annuler le contrat</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Champs de coût fixe (conditionnels) -->
                    <div id="fixed-cost-fields" class="space-y-4 border-l-4 border-purple-200 pl-4 bg-purple-50 p-4 rounded hidden">
                        <div class="text-sm text-purple-800 font-medium mb-3">
                            💰 Configuration du coût fixe mensuel
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    Coût mensuel fixe *
                                    <span class="text-purple-500">●</span>
                                </label>
                                <div class="relative">
                                    <input type="number" step="0.01" min="0" id="software-fixed-cost-amount" 
                                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                           placeholder="0.00">
                                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span class="text-gray-500 sm:text-sm">€ HT/mois</span>
                                    </div>
                                </div>
                                <p class="text-xs text-gray-500 mt-1">Ce coût sera appliqué indépendamment du nombre d'utilisateurs ayant accès au logiciel</p>
                            </div>
                        </div>
                        <div class="bg-purple-100 border border-purple-200 rounded-lg p-3">
                            <div class="flex items-start">
                                <i class="fas fa-info-circle text-purple-600 mt-0.5 mr-2"></i>
                                <div class="text-sm text-purple-800">
                                    <p class="font-medium mb-1">Mode coût fixe :</p>
                                    <p>• Le coût ne dépend pas du nombre d'accès utilisateurs</p>
                                    <p>• Idéal pour les licences globales ou forfaitaires</p>
                                    <p>• Les coûts par type d'accès seront ignorés</p>
                                </div>
                            </div>
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
        const cout_fixe = document.getElementById('software-fixed-cost').checked;
        const cout_fixe_mensuel = document.getElementById('software-fixed-cost-amount').value;

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

        // Validation des champs d'engagement
        let engagementData;
        try {
            engagementData = window.validateEngagementDates();
        } catch (error) {
            window.app?.showAlert(error.message, 'error');
            return;
        }

        // Validation des champs de coût fixe
        let fixedCostData;
        try {
            fixedCostData = window.validateFixedCostData();
        } catch (error) {
            window.app?.showAlert(error.message, 'error');
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
                engagement: engagementData.engagement,
                date_fin_contrat: engagementData.date_fin_contrat,
                date_limite_annulation: engagementData.date_limite_annulation,
                cout_fixe: fixedCostData.cout_fixe,
                cout_fixe_mensuel: fixedCostData.cout_fixe_mensuel,
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
            `<option value="${user.id}" ${user.id === software.payer_id ? 'selected' : ''}>${user.externe ? '🏢 ' : ''}${user.nom} ${user.prenom || ''}</option>`
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
                        <div class="flex items-center">
                            <input type="checkbox" id="software-engagement" ${software.engagement ? 'checked' : ''}
                                   class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                   onchange="toggleEngagementFields()">
                            <label for="software-engagement" class="ml-2 block text-sm text-gray-700 font-medium">
                                📋 Engagement contractuel
                            </label>
                        </div>
                        <div class="flex items-center">
                            <input type="checkbox" id="software-fixed-cost" ${software.cout_fixe ? 'checked' : ''}
                                   class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                   onchange="toggleFixedCostFields()">
                            <label for="software-fixed-cost" class="ml-2 block text-sm text-gray-700 font-medium">
                                💰 Coût fixe (indépendant des accès)
                            </label>
                        </div>
                    </div>
                    
                    <!-- Champs d'engagement (conditionnels) -->
                    <div id="engagement-fields" class="space-y-4 border-l-4 border-red-200 pl-4 bg-red-50 p-4 rounded ${software.engagement ? '' : 'hidden'}">
                        <div class="text-sm text-red-800 font-medium mb-3">
                            ⚠️ Champs obligatoires pour les logiciels avec engagement
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    Date de fin de contrat *
                                    <span class="text-red-500">●</span>
                                </label>
                                <input type="date" id="software-contract-end" value="${software.date_fin_contrat || ''}"
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
                                <p class="text-xs text-gray-500 mt-1">Date d'expiration du contrat d'engagement</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    Date limite d'annulation *
                                    <span class="text-red-500">●</span>
                                </label>
                                <input type="date" id="software-cancellation-deadline" value="${software.date_limite_annulation || ''}"
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
                                <p class="text-xs text-gray-500 mt-1">Dernier délai pour annuler le contrat</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Champs de coût fixe (conditionnels) -->
                    <div id="fixed-cost-fields" class="space-y-4 border-l-4 border-purple-200 pl-4 bg-purple-50 p-4 rounded ${software.cout_fixe ? '' : 'hidden'}">
                        <div class="text-sm text-purple-800 font-medium mb-3">
                            💰 Configuration du coût fixe mensuel
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    Coût mensuel fixe *
                                    <span class="text-purple-500">●</span>
                                </label>
                                <div class="relative">
                                    <input type="number" step="0.01" min="0" id="software-fixed-cost-amount" 
                                           value="${software.cout_fixe_mensuel || ''}"
                                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                           placeholder="0.00">
                                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span class="text-gray-500 sm:text-sm">€ HT/mois</span>
                                    </div>
                                </div>
                                <p class="text-xs text-gray-500 mt-1">Ce coût sera appliqué indépendamment du nombre d'utilisateurs ayant accès au logiciel</p>
                            </div>
                        </div>
                        <div class="bg-purple-100 border border-purple-200 rounded-lg p-3">
                            <div class="flex items-start">
                                <i class="fas fa-info-circle text-purple-600 mt-0.5 mr-2"></i>
                                <div class="text-sm text-purple-800">
                                    <p class="font-medium mb-1">Mode coût fixe :</p>
                                    <p>• Le coût ne dépend pas du nombre d'accès utilisateurs</p>
                                    <p>• Idéal pour les licences globales ou forfaitaires</p>
                                    <p>• Les coûts par type d'accès seront ignorés</p>
                                </div>
                            </div>
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
                                    <span class="text-sm text-gray-500">€ HT/mois</span>
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
                                ${users.map(user => `<option value="${user.id}">${user.externe ? '🏢 ' : ''}${user.nom} ${user.prenom}</option>`).join('')}
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
        
        // Si le logiciel a un coût fixe, retourner directement ce coût
        if (software.cout_fixe && software.cout_fixe_mensuel) {
            return software.cout_fixe_mensuel;
        }
        
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

    calculateEngagementAlert(software) {
        if (!software.engagement || !software.date_limite_annulation) {
            return null;
        }

        const today = new Date();
        const cancellationDate = new Date(software.date_limite_annulation);
        const timeDiff = cancellationDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        // Alerte si moins de 30 jours avant la date limite
        if (daysDiff <= 30 && daysDiff >= 0) {
            return {
                isAlert: true,
                daysRemaining: daysDiff,
                date: cancellationDate.toLocaleDateString('fr-FR'),
                message: `⚠️ ${daysDiff} jour${daysDiff > 1 ? 's' : ''} avant limite d'annulation`
            };
        } else if (daysDiff < 0) {
            // Date dépassée
            return {
                isAlert: true,
                isOverdue: true,
                daysOverdue: Math.abs(daysDiff),
                date: cancellationDate.toLocaleDateString('fr-FR'),
                message: `⚠️ Date limite dépassée de ${Math.abs(daysDiff)} jour${Math.abs(daysDiff) > 1 ? 's' : ''}`
            };
        }

        return null;
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

    // =================== FONCTIONNALITÉS DE SÉLECTION MULTIPLE ===================

    toggleSelectAll(checked) {
        // Utiliser les logiciels de la page courante (this.software contient déjà les données paginées et filtrées)
        const currentPageSoftware = this.software;

        if (checked) {
            // Sélectionner tous les logiciels visibles sur la page actuelle
            currentPageSoftware.forEach(software => {
                this.selectedSoftware.add(software.id);
            });
        } else {
            // Désélectionner tous les logiciels de la page actuelle
            currentPageSoftware.forEach(software => {
                this.selectedSoftware.delete(software.id);
            });
        }

        // Mettre à jour les cases à cocher individuelles
        const checkboxes = document.querySelectorAll('.software-checkbox');
        checkboxes.forEach(checkbox => {
            const softwareId = checkbox.getAttribute('data-software-id');
            checkbox.checked = this.selectedSoftware.has(softwareId);
        });

        this.updateBulkActionsUI();
    }

    toggleSoftwareSelection(softwareId, checked) {
        if (checked) {
            this.selectedSoftware.add(softwareId);
        } else {
            this.selectedSoftware.delete(softwareId);
        }

        // Mettre à jour la case "Sélectionner tout" basée sur la page actuelle
        const selectAllCheckbox = document.getElementById('select-all-software');
        if (selectAllCheckbox) {
            // Utiliser les logiciels de la page courante (déjà filtrés et paginés)
            const currentPageSoftware = this.software;
            
            const allVisible = currentPageSoftware.every(software => this.selectedSoftware.has(software.id));
            const someSelected = currentPageSoftware.some(software => this.selectedSoftware.has(software.id));
            
            selectAllCheckbox.checked = allVisible && currentPageSoftware.length > 0;
            selectAllCheckbox.indeterminate = someSelected && !allVisible;
        }

        this.updateBulkActionsUI();
    }

    // Méthode de changement de page
    changePage(page) {
        this.currentPage = page;
        window.paginationUtils?.savePage('software', page);
        this.renderSoftwareTable();
        document.getElementById('software-table-container')?.scrollIntoView({ behavior: 'smooth' });
    }

    updateBulkActionsUI() {
        const selectedCount = this.selectedSoftware.size;
        let bulkActionsBar = document.getElementById('bulk-actions-bar-software');

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
        const softwareView = document.getElementById('software-view');
        if (!softwareView) return;

        const bulkActionsHTML = `
            <div id="bulk-actions-bar-software" class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white rounded-lg shadow-lg px-4 py-3 flex items-center space-x-4 z-50">
                <div class="flex items-center">
                    <i class="fas fa-check-circle mr-2"></i>
                    <span id="selected-count-software">${this.selectedSoftware.size}</span>
                    <span class="ml-1">logiciel${this.selectedSoftware.size > 1 ? 's' : ''} sélectionné${this.selectedSoftware.size > 1 ? 's' : ''}</span>
                </div>
                
                <div class="flex items-center space-x-2">
                    <button onclick="window.softwareManager.showBulkAddUsersModal()" 
                            class="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm flex items-center">
                        <i class="fas fa-user-plus mr-1"></i>
                        Ajouter Utilisateurs
                    </button>
                    
                    <button onclick="window.softwareManager.clearSelection()" 
                            class="bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded text-sm flex items-center">
                        <i class="fas fa-times mr-1"></i>
                        Annuler
                    </button>
                </div>
            </div>
        `;

        softwareView.insertAdjacentHTML('beforeend', bulkActionsHTML);
    }

    updateBulkActionsCount() {
        const countElement = document.getElementById('selected-count-software');
        if (countElement) {
            countElement.textContent = this.selectedSoftware.size;
            const textElement = countElement.nextElementSibling;
            if (textElement) {
                textElement.textContent = ` logiciel${this.selectedSoftware.size > 1 ? 's' : ''} sélectionné${this.selectedSoftware.size > 1 ? 's' : ''}`;
            }
        }
    }

    clearSelection() {
        this.selectedSoftware.clear();
        
        // Décocher toutes les cases
        const checkboxes = document.querySelectorAll('.software-checkbox, #select-all-software');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.indeterminate = false;
        });
        
        // Supprimer la barre d'actions
        const bulkActionsBar = document.getElementById('bulk-actions-bar-software');
        if (bulkActionsBar) {
            bulkActionsBar.remove();
        }
    }

    showBulkAddUsersModal() {
        if (this.selectedSoftware.size === 0) {
            window.app?.showAlert('Aucun logiciel sélectionné', 'warning');
            return;
        }

        const selectedSoftwareNames = Array.from(this.selectedSoftware).map(softwareId => {
            const software = this.software.find(s => s.id === softwareId);
            return software ? software.nom : 'Logiciel inconnu';
        });

        const activeUsers = this.users.filter(u => !u.archived);

        const modalContent = `
            <div class="space-y-4">
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 class="font-medium text-green-900 mb-2">
                        <i class="fas fa-laptop mr-2"></i>
                        ${this.selectedSoftware.size} logiciel${this.selectedSoftware.size > 1 ? 's' : ''} sélectionné${this.selectedSoftware.size > 1 ? 's' : ''}
                    </h4>
                    <div class="text-sm text-green-800 max-h-20 overflow-y-auto">
                        ${selectedSoftwareNames.join(', ')}
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Sélectionner l'utilisateur à ajouter *
                    </label>
                    <select id="bulk-user-select" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                        <option value="">-- Choisir un utilisateur --</option>
                        ${activeUsers.map(user => 
                            `<option value="${user.id}">${user.externe ? '🏢 ' : ''}${user.nom} ${user.prenom || ''}</option>`
                        ).join('')}
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Niveau d'accès *
                    </label>
                    <select id="bulk-right-select-software" required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
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
                            <p>Cette action donnera accès aux logiciels sélectionnés à l'utilisateur choisi.</p>
                            <p>Si l'utilisateur a déjà un accès à un logiciel, il sera ignoré.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const actions = [
            {
                text: `Donner accès à ${this.selectedSoftware.size} logiciel${this.selectedSoftware.size > 1 ? 's' : ''}`,
                class: 'px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700',
                onclick: 'window.softwareManager.executeBulkAddUsers()'
            }
        ];

        window.app?.showModal('Ajout d\'utilisateur en masse aux logiciels', modalContent, actions);
    }

    async executeBulkAddUsers() {
        const userId = document.getElementById('bulk-user-select')?.value;
        const rightId = document.getElementById('bulk-right-select-software')?.value;

        if (!userId || !rightId) {
            window.app?.showAlert('Veuillez sélectionner un utilisateur et un niveau d\'accès', 'error');
            return;
        }

        const user = this.users.find(u => u.id === userId);
        const right = this.droits.find(d => d.id === rightId);

        try {
            let successCount = 0;
            let skipCount = 0;
            const errors = [];

            // Récupérer tous les accès existants pour éviter les doublons
            const accessResult = await window.D1API.get('acces');
            const existingAccess = accessResult.data || [];

            for (const softwareId of this.selectedSoftware) {
                // Vérifier si l'accès existe déjà
                const existingAccess_software = existingAccess.find(acc => 
                    acc.utilisateur_id === userId && 
                    acc.logiciel_id === softwareId && 
                    acc.droit_id === rightId
                );

                if (existingAccess_software) {
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
                            const software = this.software.find(s => s.id === softwareId);
                            await window.logger.log('CREATE', 'acces', result.data.id, null, {
                                utilisateur_id: userId,
                                logiciel_id: softwareId,
                                droit_id: rightId
                            }, `Ajout en masse: ${user?.nom} ${user?.prenom} vers ${software?.nom} (${right?.nom})`);
                        }
                    } else {
                        throw new Error(result.error);
                    }
                } catch (error) {
                    const software = this.software.find(s => s.id === softwareId);
                    errors.push(`${software?.nom || 'Logiciel inconnu'}: ${error.message}`);
                }
            }

            // Fermer le modal
            document.querySelector('.fixed')?.remove();

            // Afficher le résultat
            let message = `✅ ${successCount} accès ajouté${successCount > 1 ? 's' : ''} pour ${user?.nom} ${user?.prenom}`;
            if (skipCount > 0) {
                message += `\n⚠️ ${skipCount} accès ignoré${skipCount > 1 ? 's' : ''} (déjà existant${skipCount > 1 ? 's' : ''})`;
            }
            if (errors.length > 0) {
                message += `\n❌ ${errors.length} erreur${errors.length > 1 ? 's' : ''}`;
                console.error('Erreurs lors de l\'ajout en masse:', errors);
            }

            window.app?.showAlert(message, successCount > 0 ? 'success' : 'warning');
            
            // Rafraîchir les données
            await this.loadSoftware();
            
        } catch (error) {
            console.error('Erreur lors de l\'ajout en masse d\'utilisateurs:', error);
            window.app?.showAlert('Erreur lors de l\'ajout en masse d\'utilisateurs', 'error');
        }
    }
}

// Fonction globale pour gérer l'affichage des champs d'engagement
window.toggleEngagementFields = function() {
    const engagementCheckbox = document.getElementById('software-engagement');
    const engagementFields = document.getElementById('engagement-fields');
    const contractEndField = document.getElementById('software-contract-end');
    const cancellationDeadlineField = document.getElementById('software-cancellation-deadline');
    
    if (engagementCheckbox && engagementFields) {
        if (engagementCheckbox.checked) {
            engagementFields.classList.remove('hidden');
            // Rendre les champs obligatoires
            if (contractEndField) contractEndField.required = true;
            if (cancellationDeadlineField) cancellationDeadlineField.required = true;
        } else {
            engagementFields.classList.add('hidden');
            // Retirer l'obligation et vider les champs
            if (contractEndField) {
                contractEndField.required = false;
                contractEndField.value = '';
            }
            if (cancellationDeadlineField) {
                cancellationDeadlineField.required = false;
                cancellationDeadlineField.value = '';
            }
        }
    }
};

// Fonction globale pour gérer l'affichage des champs de coût fixe
window.toggleFixedCostFields = function() {
    const fixedCostCheckbox = document.getElementById('software-fixed-cost');
    const fixedCostFields = document.getElementById('fixed-cost-fields');
    const fixedCostAmountField = document.getElementById('software-fixed-cost-amount');
    
    if (fixedCostCheckbox && fixedCostFields) {
        if (fixedCostCheckbox.checked) {
            fixedCostFields.classList.remove('hidden');
            // Rendre le champ obligatoire
            if (fixedCostAmountField) fixedCostAmountField.required = true;
        } else {
            fixedCostFields.classList.add('hidden');
            // Retirer l'obligation et vider le champ
            if (fixedCostAmountField) {
                fixedCostAmountField.required = false;
                fixedCostAmountField.value = '';
            }
        }
    }
};

// Fonction globale de validation des dates d'engagement
window.validateEngagementDates = function() {
    const engagementCheckbox = document.getElementById('software-engagement');
    
    if (engagementCheckbox && engagementCheckbox.checked) {
        const contractEndDate = document.getElementById('software-contract-end').value;
        const cancellationDeadline = document.getElementById('software-cancellation-deadline').value;
        
        if (!contractEndDate) {
            throw new Error('La date de fin de contrat est requise pour les logiciels avec engagement');
        }
        
        if (!cancellationDeadline) {
            throw new Error('La date limite d\'annulation est requise pour les logiciels avec engagement');
        }
        
        // Vérifier que la date limite d'annulation est antérieure à la date de fin de contrat
        const contractEnd = new Date(contractEndDate);
        const cancellationLimit = new Date(cancellationDeadline);
        
        if (cancellationLimit >= contractEnd) {
            throw new Error('La date limite d\'annulation doit être antérieure à la date de fin de contrat');
        }
        
        // Vérifier que les dates ne sont pas dans le passé
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (contractEnd < today) {
            throw new Error('La date de fin de contrat ne peut pas être dans le passé');
        }
        
        return {
            engagement: true,
            date_fin_contrat: contractEndDate,
            date_limite_annulation: cancellationDeadline
        };
    }
    
    return {
        engagement: false,
        date_fin_contrat: null,
        date_limite_annulation: null
    };
};

// Fonction globale de validation des données de coût fixe
window.validateFixedCostData = function() {
    const fixedCostCheckbox = document.getElementById('software-fixed-cost');
    
    if (fixedCostCheckbox && fixedCostCheckbox.checked) {
        const fixedCostAmount = document.getElementById('software-fixed-cost-amount').value;
        
        if (!fixedCostAmount) {
            throw new Error('Le coût mensuel fixe est requis lorsque le coût fixe est activé');
        }
        
        const amount = parseFloat(fixedCostAmount);
        if (isNaN(amount) || amount < 0) {
            throw new Error('Le coût mensuel fixe doit être un nombre positif');
        }
        
        if (amount === 0) {
            throw new Error('Le coût mensuel fixe doit être supérieur à 0');
        }
        
        return {
            cout_fixe: true,
            cout_fixe_mensuel: amount
        };
    }
    
    return {
        cout_fixe: false,
        cout_fixe_mensuel: 0
    };
};

// Initialiser le gestionnaire des logiciels
document.addEventListener('DOMContentLoaded', () => {
    window.softwareManager = new SoftwareManager();
});