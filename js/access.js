// Gestionnaire des accès
class AccessManager {
    constructor() {
        this.access = [];
        this.users = [];
        this.software = [];
        this.droits = [];
        this.costs = [];
        this.showAll = false; // Par défaut, ne montrer que les accès actifs
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
        document.getElementById('add-access-btn')?.addEventListener('click', () => {
            this.showAddAccessModal();
        });
        
        document.getElementById('toggle-view-btn')?.addEventListener('click', () => {
            this.toggleView();
        });
    }

    async loadAccess() {
        try {
            const [accessResult, usersResult, softwareResult, costsResult] = await Promise.all([
                window.D1API.get('acces'),
                window.D1API.get('utilisateurs'),
                window.D1API.get('logiciels'),
                window.D1API.get('couts_licences')
            ]);

            this.access = accessResult.data || [];
            this.users = usersResult.data || [];
            this.software = softwareResult.data || [];
            this.costs = costsResult.data || [];

            this.renderAccessTable();
        } catch (error) {
            console.error('Erreur lors du chargement des accès:', error);
            window.app?.showAlert('Erreur lors du chargement des accès', 'error');
        }
    }

    renderAccessTable() {
        const container = document.getElementById('access-table-container');
        if (!container) return;

        // Filtrer les accès selon le mode d'affichage
        let displayAccess;
        if (this.showAll) {
            // Montrer tous les accès
            displayAccess = this.access;
        } else {
            // Filtrer pour ne montrer que ceux d'utilisateurs et logiciels actifs
            displayAccess = this.access.filter(acc => {
                const user = this.users.find(u => u.id === acc.utilisateur_id);
                const software = this.software.find(s => s.id === acc.logiciel_id);
                return user && !user.archived && software && !software.archived;
            });
        }

        // Compter les accès cachés
        const hiddenCount = this.access.length - displayAccess.length;

        const tableHtml = `
            ${hiddenCount > 0 && !this.showAll ? 
                `<div class="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <i class="fas fa-eye-slash text-yellow-600 mr-2"></i>
                            <span class="text-sm text-yellow-800">
                                ${hiddenCount} accès caché(s) (utilisateurs ou logiciels archivés)
                            </span>
                        </div>
                        <button id="toggle-view-btn" class="text-sm bg-yellow-200 hover:bg-yellow-300 text-yellow-800 px-3 py-1 rounded transition-colors">
                            Afficher tous les accès
                        </button>
                    </div>
                </div>` : ''
            }
            ${this.showAll && hiddenCount > 0 ? 
                `<div class="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <i class="fas fa-eye text-blue-600 mr-2"></i>
                            <span class="text-sm text-blue-800">
                                Affichage de tous les accès (${this.access.length} total)
                            </span>
                        </div>
                        <button id="toggle-view-btn" class="text-sm bg-blue-200 hover:bg-blue-300 text-blue-800 px-3 py-1 rounded transition-colors">
                            Afficher uniquement les actifs
                        </button>
                    </div>
                </div>` : ''
            }
            <div class="overflow-x-auto">
                <table class="min-w-full table-auto">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logiciel</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Droit</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coût/Mois</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${displayAccess.map(access => this.renderAccessRow(access)).join('')}
                    </tbody>
                </table>
            </div>
            ${displayAccess.length === 0 ? '<div class="text-center py-8 text-gray-500">Aucun accès trouvé</div>' : ''}
        `;

        container.innerHTML = tableHtml;
        
        // Réattacher l'événement après modification du DOM
        this.setupEventListeners();
    }

    toggleView() {
        this.showAll = !this.showAll;
        this.renderAccessTable();
    }

    renderAccessRow(access) {
        const user = this.users.find(u => u.id === access.utilisateur_id);
        const software = this.software.find(s => s.id === access.logiciel_id);
        const droit = this.droits.find(d => d.id === access.droit_id);
        const cost = this.costs.find(c => c.logiciel_id === access.logiciel_id && c.droit_id === access.droit_id);

        // Vérifier si des éléments sont archivés ou manquants
        const isUserArchived = user?.archived;
        const isSoftwareArchived = software?.archived;
        const hasIssues = !user || !software || !droit || isUserArchived || isSoftwareArchived;

        let costDisplay = 'Non défini';
        if (cost) {
            if (droit && droit.nom === 'Accès communs') {
                costDisplay = `${cost.cout_mensuel}€ (partagé)`;
            } else {
                costDisplay = `${cost.cout_mensuel}€`;
            }
        }

        return `
            <tr class="${hasIssues ? 'bg-gray-50 opacity-75' : ''}">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium ${!user ? 'text-red-600' : isUserArchived ? 'text-gray-500' : 'text-gray-900'}">
                        ${user?.nom || 'Utilisateur introuvable'} ${user?.prenom || ''}
                        ${isUserArchived ? '<span class="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Archivé</span>' : ''}
                        ${!user ? '<span class="ml-2 text-xs bg-red-200 text-red-600 px-2 py-1 rounded">Introuvable</span>' : ''}
                    </div>
                    <div class="text-sm text-gray-500">${user?.email || ''}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium ${!software ? 'text-red-600' : isSoftwareArchived ? 'text-gray-500' : 'text-gray-900'}">
                        ${software?.nom || 'Logiciel introuvable'}
                        ${isSoftwareArchived ? '<span class="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Archivé</span>' : ''}
                        ${!software ? '<span class="ml-2 text-xs bg-red-200 text-red-600 px-2 py-1 rounded">Introuvable</span>' : ''}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${!droit ? 'bg-red-100 text-red-800' : this.getRightColor(droit.nom)}">
                        ${droit?.nom || 'Droit introuvable'}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${costDisplay}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end space-x-2">
                        <button onclick="window.accessManager.editAccess('${access.id}')" 
                                class="text-blue-600 hover:text-blue-900" title="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="window.accessManager.deleteAccess('${access.id}')" 
                                class="text-red-600 hover:text-red-900" title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    getRightColor(rightName) {
        const colors = {
            'Admin': 'bg-red-100 text-red-800',
            'User': 'bg-blue-100 text-blue-800',
            'Lecteur': 'bg-green-100 text-green-800',
            'Accès communs': 'bg-purple-100 text-purple-800'
        };
        return colors[rightName] || 'bg-gray-100 text-gray-800';
    }

    showAddAccessModal() {
        const activeUsers = this.users.filter(u => !u.archived);
        const activeSoftware = this.software.filter(s => !s.archived);

        const modalContent = `
            <form id="add-access-form">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Utilisateur *</label>
                        <select id="access-user" required 
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Sélectionner un utilisateur</option>
                            ${activeUsers.map(user => 
                                `<option value="${user.id}">${user.nom} ${user.prenom || ''} - ${user.email || 'Pas d\'email'}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Logiciel *</label>
                        <select id="access-software" required 
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Sélectionner un logiciel</option>
                            ${activeSoftware.map(software => 
                                `<option value="${software.id}">${software.nom}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Droit *</label>
                        <select id="access-right" required 
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Sélectionner un droit</option>
                            ${this.droits.map(droit => 
                                `<option value="${droit.id}">${droit.nom} - ${droit.description}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div id="cost-preview" class="hidden bg-blue-50 p-3 rounded-lg">
                        <div class="text-sm text-blue-800">
                            <i class="fas fa-info-circle mr-1"></i>
                            <span id="cost-info"></span>
                        </div>
                    </div>
                </div>
            </form>
        `;

        const actions = [
            {
                text: 'Ajouter',
                class: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700',
                onclick: 'window.accessManager.saveAccess()'
            }
        ];

        window.app?.showModal('Ajouter un accès', modalContent, actions);
        this.setupCostPreview();
    }

    setupCostPreview() {
        const softwareSelect = document.getElementById('access-software');
        const rightSelect = document.getElementById('access-right');
        const costPreview = document.getElementById('cost-preview');
        const costInfo = document.getElementById('cost-info');

        const updatePreview = () => {
            const softwareId = softwareSelect?.value;
            const rightId = rightSelect?.value;

            if (softwareId && rightId) {
                const cost = this.costs.find(c => c.logiciel_id === softwareId && c.droit_id === rightId);
                const droit = this.droits.find(d => d.id === rightId);
                
                if (cost) {
                    if (droit && droit.nom === 'Accès communs') {
                        costInfo.textContent = `Coût: ${cost.cout_mensuel}€/mois (partagé - facturé une seule fois)`;
                    } else {
                        costInfo.textContent = `Coût: ${cost.cout_mensuel}€/mois`;
                    }
                    costPreview.classList.remove('hidden');
                } else {
                    costInfo.textContent = 'Aucun coût défini pour cette combinaison';
                    costPreview.classList.remove('hidden');
                }
            } else {
                costPreview.classList.add('hidden');
            }
        };

        softwareSelect?.addEventListener('change', updatePreview);
        rightSelect?.addEventListener('change', updatePreview);
    }

    async saveAccess(accessId = null) {
        const userId = document.getElementById('access-user').value;
        const softwareId = document.getElementById('access-software').value;
        const rightId = document.getElementById('access-right').value;

        if (!userId || !softwareId || !rightId) {
            window.app?.showAlert('Tous les champs sont requis', 'error');
            return;
        }

        // Vérifier si l'accès existe déjà (sauf si on modifie)
        if (!accessId) {
            const existingAccess = this.access.find(a => 
                a.utilisateur_id === userId && 
                a.logiciel_id === softwareId && 
                a.droit_id === rightId
            );
            
            if (existingAccess) {
                window.app?.showAlert('Cet accès existe déjà', 'error');
                return;
            }
        }

        try {
            const accessData = {
                utilisateur_id: userId,
                logiciel_id: softwareId,
                droit_id: rightId
            };

            if (accessId) {
                // Mise à jour
                await fetch(`tables/acces/${accessId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(accessData)
                });
                window.app?.showAlert('Accès modifié avec succès', 'success');
            } else {
                // Création
                await window.D1API.get('acces', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(accessData)
                });
                window.app?.showAlert('Accès ajouté avec succès', 'success');
            }

            document.querySelector('.fixed')?.remove();
            await this.loadAccess();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            window.app?.showAlert('Erreur lors de la sauvegarde', 'error');
        }
    }

    async editAccess(accessId) {
        const access = this.access.find(a => a.id === accessId);
        if (!access) return;

        const activeUsers = this.users.filter(u => !u.archived);
        const activeSoftware = this.software.filter(s => !s.archived);

        const modalContent = `
            <form id="edit-access-form">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Utilisateur *</label>
                        <select id="access-user" required 
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Sélectionner un utilisateur</option>
                            ${activeUsers.map(user => 
                                `<option value="${user.id}" ${user.id === access.utilisateur_id ? 'selected' : ''}>
                                    ${user.nom} ${user.prenom || ''} - ${user.email || 'Pas d\'email'}
                                </option>`
                            ).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Logiciel *</label>
                        <select id="access-software" required 
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Sélectionner un logiciel</option>
                            ${activeSoftware.map(software => 
                                `<option value="${software.id}" ${software.id === access.logiciel_id ? 'selected' : ''}>
                                    ${software.nom}
                                </option>`
                            ).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Droit *</label>
                        <select id="access-right" required 
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Sélectionner un droit</option>
                            ${this.droits.map(droit => 
                                `<option value="${droit.id}" ${droit.id === access.droit_id ? 'selected' : ''}>
                                    ${droit.nom} - ${droit.description}
                                </option>`
                            ).join('')}
                        </select>
                    </div>
                    <div id="cost-preview" class="hidden bg-blue-50 p-3 rounded-lg">
                        <div class="text-sm text-blue-800">
                            <i class="fas fa-info-circle mr-1"></i>
                            <span id="cost-info"></span>
                        </div>
                    </div>
                </div>
            </form>
        `;

        const actions = [
            {
                text: 'Modifier',
                class: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700',
                onclick: `window.accessManager.saveAccess('${accessId}')`
            }
        ];

        window.app?.showModal('Modifier l\'accès', modalContent, actions);
        this.setupCostPreview();
    }

    async deleteAccess(accessId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet accès ?')) return;

        try {
            await fetch(`tables/acces/${accessId}`, {
                method: 'DELETE'
            });

            window.app?.showAlert('Accès supprimé avec succès', 'success');
            await this.loadAccess();
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            window.app?.showAlert('Erreur lors de la suppression', 'error');
        }
    }

    // Méthodes pour les statistiques et analyses
    getAccessByUser(userId) {
        return this.access.filter(a => a.utilisateur_id === userId);
    }

    getAccessBySoftware(softwareId) {
        return this.access.filter(a => a.logiciel_id === softwareId);
    }

    getAccessByRight(rightId) {
        return this.access.filter(a => a.droit_id === rightId);
    }

    calculateUserCost(userId) {
        const userAccess = this.getAccessByUser(userId);
        let totalCost = 0;
        const processedShared = new Set();

        for (const acc of userAccess) {
            const cost = this.costs.find(c => c.logiciel_id === acc.logiciel_id && c.droit_id === acc.droit_id);
            if (cost) {
                const droit = this.droits.find(d => d.id === acc.droit_id);
                if (droit && droit.nom === 'Accès communs') {
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

    calculateSoftwareCost(softwareId) {
        const softwareAccess = this.getAccessBySoftware(softwareId);
        let totalCost = 0;
        const processedShared = new Set();

        for (const acc of softwareAccess) {
            const cost = this.costs.find(c => c.logiciel_id === acc.logiciel_id && c.droit_id === acc.droit_id);
            if (cost) {
                const droit = this.droits.find(d => d.id === acc.droit_id);
                if (droit && droit.nom === 'Accès communs') {
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
}

// Initialiser le gestionnaire des accès
document.addEventListener('DOMContentLoaded', () => {
    window.accessManager = new AccessManager();
});