class RightsManager {
    constructor() {
        this.rights = [];
        this.currentEditingRight = null;
    }

    async init() {
        await this.loadRights();
        await this.createDefaultRights();
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        // Add right button
        document.getElementById('add-right-btn').addEventListener('click', () => {
            this.openModal();
        });

        // Save right form
        document.getElementById('save-right-btn').addEventListener('click', () => {
            this.saveRight();
        });

        // Cancel button
        document.getElementById('cancel-right-btn').addEventListener('click', () => {
            this.closeModal();
        });

        // Modal background click
        document.getElementById('right-modal').addEventListener('click', (e) => {
            if (e.target.id === 'right-modal') {
                this.closeModal();
            }
        });

        // Search functionality
        document.getElementById('rights-search').addEventListener('input', (e) => {
            this.filterRights(e.target.value);
        });
    }

    async loadRights() {
        try {
            const result = await window.D1API.get('droits');
            if (result.success) {
                this.rights = result.data || [];
            } else {
                this.rights = [];
            }
        } catch (error) {
            console.error('Erreur lors du chargement des types d\'accès:', error);
            this.rights = [];
        }
    }

    async createDefaultRights() {
        const defaultRights = [
            {
                nom: 'Super Admin',
                description: 'Accès super administrateur avec tous les privilèges',
                niveau: 1,
                couleur: '#7C3AED'
            },
            {
                nom: 'Admin',
                description: 'Accès administrateur complet',
                niveau: 2,
                couleur: '#DC2626'
            },
            {
                nom: 'User',
                description: 'Accès utilisateur standard',
                niveau: 3,
                couleur: '#2563EB'
            },
            {
                nom: 'Reader',
                description: 'Accès en lecture seule',
                niveau: 4,
                couleur: '#16A34A'
            }
        ];

        for (const defaultRight of defaultRights) {
            const existingRight = this.rights.find(right => right.nom === defaultRight.nom);
            
            if (!existingRight) {
                // Créer le droit s'il n'existe pas
                try {
                    const response = await window.D1API.create('droits', defaultRight);
                    if (response.ok) {
                        console.log(`Type d'accès créé: ${defaultRight.nom}`);
                    }
                } catch (error) {
                    console.error(`Erreur lors de la création du type d'accès ${defaultRight.nom}:`, error);
                }
            } else if (existingRight.couleur !== defaultRight.couleur) {
                // Mettre à jour la couleur si elle est différente
                try {
                    const response = await window.D1API.update('droits', existingRight.id, {
                        ...existingRight,
                        couleur: defaultRight.couleur
                    });
                    if (response.ok) {
                        console.log(`Couleur mise à jour pour le type: ${defaultRight.nom}`);
                    }
                } catch (error) {
                    console.error(`Erreur lors de la mise à jour de la couleur pour le type ${defaultRight.nom}:`, error);
                }
            }
        }
        
        // Recharger après création/mise à jour
        await this.loadRights();
    }

    openModal(right = null) {
        this.currentEditingRight = right;
        const modal = document.getElementById('right-modal');
        const form = document.getElementById('right-form');
        const title = document.getElementById('modal-title');

        // Reset form
        form.reset();

        if (right) {
            title.textContent = 'Modifier le Type d\'Accès';
            document.getElementById('right-name').value = right.nom || '';
            document.getElementById('right-description').value = right.description || '';
            document.getElementById('right-color').value = right.couleur || '#3B82F6';
        } else {
            title.textContent = 'Ajouter un Type d\'Accès';
        }

        modal.classList.remove('hidden');
        document.getElementById('right-name').focus();
    }

    closeModal() {
        document.getElementById('right-modal').classList.add('hidden');
        this.currentEditingRight = null;
    }

    async saveRight() {
        const name = document.getElementById('right-name').value.trim();
        const description = document.getElementById('right-description').value.trim();
        const color = document.getElementById('right-color').value;

        if (!name) {
            alert('Le nom du type d\'accès est obligatoire');
            return;
        }

        const rightData = {
            nom: name,
            description: description,
            couleur: color
        };

        try {
            let response;
            if (this.currentEditingRight) {
                // Update existing right
                response = await window.D1API.update('droits', this.currentEditingRight.id, rightData);
            } else {
                // Create new right
                response = await window.D1API.create('droits', rightData);
            }

            if (response.ok) {
                await this.loadRights();
                this.render();
                this.closeModal();
                
                const message = this.currentEditingRight ? 
                    'Type d\'accès modifié avec succès' : 
                    'Type d\'accès ajouté avec succès';
                this.showNotification(message, 'success');
            } else {
                throw new Error('Erreur lors de la sauvegarde');
            }
        } catch (error) {
            console.error('Erreur:', error);
            this.showNotification('Erreur lors de la sauvegarde du type d\'accès', 'error');
        }
    }

    async deleteRight(rightId) {
        if (!confirm('Voulez-vous vraiment supprimer ce type d\'accès ? Cette action est irréversible.')) {
            return;
        }

        try {
            // Check if right is used in access table
            const accessResponse = await window.D1API.get('acces');
            if (accessResponse.ok) {
                const usedInAccess = (accessResponse.data || []).some(access => access.droit_id === rightId);
                
                if (usedInAccess) {
                    alert('Ce type d\'accès ne peut pas être supprimé car il est utilisé dans des accès existants.');
                    return;
                }
            }

            const response = await window.D1API.delete('droits', rightId);

            if (response.ok) {
                await this.loadRights();
                this.render();
                this.showNotification('Type d\'accès supprimé avec succès', 'success');
            } else {
                throw new Error('Erreur lors de la suppression');
            }
        } catch (error) {
            console.error('Erreur:', error);
            this.showNotification('Erreur lors de la suppression du type d\'accès', 'error');
        }
    }

    filterRights(searchTerm) {
        const rows = document.querySelectorAll('#rights-table tbody tr');
        const term = searchTerm.toLowerCase();

        rows.forEach(row => {
            const name = row.cells[0].textContent.toLowerCase();
            const description = row.cells[1].textContent.toLowerCase();

            if (name.includes(term) || description.includes(term)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }



    render() {
        const tbody = document.querySelector('#rights-table tbody');
        
        if (this.rights.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                        <i class="fas fa-user-shield text-4xl mb-4 block"></i>
                        Aucun type d'accès trouvé. Commencez par ajouter un type.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.rights.map(right => `
            <tr class="hover:bg-gray-50">
                <td class="px-4 sm:px-6 py-4">
                    <div class="flex items-center">
                        <div class="w-4 h-4 rounded-full mr-3" style="background-color: ${right.couleur || '#3B82F6'}"></div>
                        <div>
                            <div class="font-medium text-gray-900">${this.escapeHtml(right.nom || '')}</div>
                        </div>
                    </div>
                </td>
                <td class="px-4 sm:px-6 py-4 text-sm text-gray-600">
                    ${this.escapeHtml(right.description || 'Aucune description')}
                </td>
                <td class="px-4 sm:px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">
                    ${right.created_at ? new Date(right.created_at).toLocaleDateString('fr-FR') : ''}
                </td>
                <td class="px-4 sm:px-6 py-4">
                    <div class="flex space-x-2">
                        <button onclick="rightsManager.openModal(${JSON.stringify(right).replace(/"/g, '&quot;')})" 
                                class="text-blue-600 hover:text-blue-900 text-sm font-medium">
                            <i class="fas fa-edit mr-1"></i>Modifier
                        </button>
                        <button onclick="rightsManager.deleteRight('${right.id}')" 
                                class="text-red-600 hover:text-red-900 text-sm font-medium">
                            <i class="fas fa-trash mr-1"></i>Supprimer
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Update stats
        document.getElementById('rights-count').textContent = this.rights.length;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white max-w-sm ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        }`;
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${
                    type === 'success' ? 'fa-check-circle' : 
                    type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'
                } mr-2"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Global instance
let rightsManager;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    rightsManager = new RightsManager();
    window.rightsManager = rightsManager;
});
