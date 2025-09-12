/**
 * Utilitaire de pagination réutilisable
 * Gère la logique de pagination pour tous les tableaux
 */

class PaginationUtils {
    constructor() {
        this.itemsPerPage = 100;
    }

    /**
     * Génère les contrôles de pagination
     * @param {number} totalItems - Nombre total d'éléments
     * @param {number} currentPage - Page actuelle (1-indexed)
     * @param {string} containerId - ID du conteneur où insérer les contrôles
     * @param {function} onPageChange - Callback appelé lors du changement de page
     */
    renderPaginationControls(totalItems, currentPage, containerId, onPageChange) {
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        
        // Si moins de 100 items, pas besoin de pagination
        if (totalPages <= 1) {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = '';
            }
            return;
        }

        const startItem = (currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(currentPage * this.itemsPerPage, totalItems);

        const paginationHTML = `
            <div class="pagination-container">
                <div class="pagination-info">
                    <div class="pagination-details">
                        <div class="pagination-total">
                            ${totalItems.toLocaleString()} élément${totalItems > 1 ? 's' : ''} au total
                        </div>
                        <div class="pagination-range">
                            Affichage de ${startItem.toLocaleString()} à ${endItem.toLocaleString()}
                        </div>
                    </div>
                </div>
                
                <div class="pagination-controls">
                    <!-- Navigation précédent -->
                    <button class="pagination-nav-button" 
                            ${currentPage <= 1 ? 'disabled' : ''} 
                            onclick="${onPageChange}(${currentPage - 1})"
                            title="Page précédente">
                        <i class="fas fa-chevron-left"></i>
                        <span class="hidden sm:inline">Précédent</span>
                    </button>
                    
                    <!-- Numéros de page -->
                    <div class="pagination-numbers flex items-center gap-1">
                        ${this.generatePageNumbers(currentPage, totalPages, onPageChange)}
                    </div>
                    
                    <!-- Navigation suivant -->
                    <button class="pagination-nav-button" 
                            ${currentPage >= totalPages ? 'disabled' : ''} 
                            onclick="${onPageChange}(${currentPage + 1})"
                            title="Page suivante">
                        <span class="hidden sm:inline">Suivant</span>
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    
                    <!-- Version mobile simplifiée -->
                    <div class="pagination-mobile-only flex items-center gap-2">
                        <span class="text-sm text-gray-600">
                            Page ${currentPage} sur ${totalPages}
                        </span>
                    </div>
                </div>
            </div>
        `;

        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = paginationHTML;
        }
    }

    /**
     * Génère les numéros de page avec ellipses intelligentes
     * @param {number} currentPage - Page actuelle
     * @param {number} totalPages - Nombre total de pages
     * @param {string} onPageChange - Nom de la fonction de callback
     * @returns {string} HTML des numéros de page
     */
    generatePageNumbers(currentPage, totalPages, onPageChange) {
        const delta = 2; // Nombre de pages à afficher de chaque côté
        const pages = [];

        // Toujours afficher la première page
        if (totalPages > 0) {
            pages.push(1);
        }

        // Calculer la plage autour de la page actuelle
        const startPage = Math.max(2, currentPage - delta);
        const endPage = Math.min(totalPages - 1, currentPage + delta);

        // Ajouter des ellipses si nécessaire avant la plage
        if (startPage > 2) {
            pages.push('...');
        }

        // Ajouter les pages de la plage
        for (let i = startPage; i <= endPage; i++) {
            if (i !== 1 && i !== totalPages) {
                pages.push(i);
            }
        }

        // Ajouter des ellipses si nécessaire après la plage
        if (endPage < totalPages - 1) {
            pages.push('...');
        }

        // Toujours afficher la dernière page (si différente de la première)
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        // Générer le HTML
        return pages.map(page => {
            if (page === '...') {
                return '<div class="pagination-ellipsis">...</div>';
            }
            
            const isActive = page === currentPage;
            return `
                <button class="pagination-button ${isActive ? 'active' : ''}" 
                        onclick="${onPageChange}(${page})"
                        ${isActive ? 'aria-current="page"' : ''}>
                    ${page}
                </button>
            `;
        }).join('');
    }

    /**
     * Pagine un tableau de données
     * @param {Array} data - Données à paginer
     * @param {number} page - Numéro de page (1-indexed)
     * @returns {Object} Données paginées et métadonnées
     */
    paginateData(data, page) {
        const totalItems = data.length;
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        const currentPage = Math.max(1, Math.min(page, totalPages));
        
        const startIndex = (currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageData = data.slice(startIndex, endIndex);

        return {
            data: pageData,
            currentPage,
            totalPages,
            totalItems,
            startIndex: startIndex + 1,
            endIndex: Math.min(endIndex, totalItems),
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1
        };
    }

    /**
     * Affiche un indicateur de chargement
     * @param {string} containerId - ID du conteneur
     */
    showLoading(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="pagination-loading">
                    <div class="spinner"></div>
                    <span>Chargement...</span>
                </div>
            `;
        }
    }

    /**
     * Applique l'animation de fade-in au tableau
     * @param {string} tableSelector - Sélecteur CSS du tableau
     */
    animateTableUpdate(tableSelector) {
        const table = document.querySelector(tableSelector);
        if (table) {
            table.classList.remove('table-fade-in');
            // Force reflow
            void table.offsetWidth;
            table.classList.add('table-fade-in');
        }
    }

    /**
     * Gère la persistance de la page courante dans localStorage
     * @param {string} key - Clé pour le localStorage
     * @param {number} page - Numéro de page à sauvegarder
     */
    savePage(key, page) {
        try {
            localStorage.setItem(`pagination_${key}`, page.toString());
        } catch (e) {
            // Ignore les erreurs de localStorage
        }
    }

    /**
     * Récupère la page sauvegardée depuis localStorage
     * @param {string} key - Clé pour le localStorage
     * @returns {number} Numéro de page ou 1 par défaut
     */
    getSavedPage(key) {
        try {
            const saved = localStorage.getItem(`pagination_${key}`);
            return saved ? parseInt(saved, 10) : 1;
        } catch (e) {
            return 1;
        }
    }
}

// Instance globale pour réutilisation
window.paginationUtils = new PaginationUtils();