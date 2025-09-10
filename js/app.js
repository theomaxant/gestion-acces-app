// Application principale - Gestion des Accès
class AccessManagementApp {
    constructor() {
        this.currentView = 'dashboard';
        this.droits = [];
        this.init();
    }

    async init() {
        await this.loadDroits();
        this.setupNavigation();
        this.setupEventListeners();
        await this.loadDashboard();
    }

    async loadDroits() {
        try {
            const response = await fetch('tables/droits');
            const result = await response.json();
            this.droits = result.data || [];
        } catch (error) {
            console.error('Erreur lors du chargement des droits:', error);
        }
    }

    setupNavigation() {
        // Desktop navigation
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const viewId = e.target.id.replace('nav-', '');
                
                // Ignorer le bouton Réglages car il gère son propre sous-menu
                if (viewId === 'settings') {
                    return;
                }
                
                this.switchView(viewId);
            });
        });

        // Mobile navigation
        const mobileNavButtons = document.querySelectorAll('.mobile-nav-btn');
        mobileNavButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const viewId = e.target.id.replace('mobile-nav-', '');
                
                // Ignorer les boutons qui ne correspondent pas à des vues
                if (['logout', 'teams', 'rights', 'logs', 'tutorials'].includes(viewId)) {
                    // Ces boutons sont gérés par le MenuManager
                    return;
                }
                
                this.switchView(viewId);
                this.closeMobileMenu();
            });
        });

        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
        }
    }

    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const menuIcon = document.querySelector('#mobile-menu-btn i');
        
        if (mobileMenu) {
            mobileMenu.classList.toggle('hidden');
            
            // Change icon
            if (mobileMenu.classList.contains('hidden')) {
                menuIcon.className = 'fas fa-bars text-xl';
            } else {
                menuIcon.className = 'fas fa-times text-xl';
            }
        }
    }

    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const menuIcon = document.querySelector('#mobile-menu-btn i');
        
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            menuIcon.className = 'fas fa-bars text-xl';
        }
    }

    setupEventListeners() {
        // Import Excel handlers
        document.getElementById('import-users-btn')?.addEventListener('click', () => {
            window.importManager?.showImportModal('users');
        });
    }

    switchView(viewName) {
        // Update desktop navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-blue-500');
            btn.classList.add('hover:bg-blue-500');
        });
        const desktopBtn = document.getElementById(`nav-${viewName}`);
        if (desktopBtn) {
            desktopBtn.classList.add('active', 'bg-blue-500');
            desktopBtn.classList.remove('hover:bg-blue-500');
        }

        // Update mobile navigation
        document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-blue-500');
            btn.classList.add('hover:bg-blue-500');
        });
        const mobileBtn = document.getElementById(`mobile-nav-${viewName}`);
        if (mobileBtn) {
            mobileBtn.classList.add('active', 'bg-blue-500');
            mobileBtn.classList.remove('hover:bg-blue-500');
        }

        // Reset submenu states if we're not in a settings subsection
        if (!['teams', 'rights', 'logs', 'tutorials'].includes(viewName)) {
            // Forcer la réinitialisation complète du sous-menu
            setTimeout(() => {
                document.querySelectorAll('.submenu-btn').forEach(btn => {
                    btn.classList.remove('bg-blue-100', 'text-blue-800', 'bg-blue-500', 'text-white');
                    btn.classList.add('text-gray-700');
                });
            }, 50);
        }

        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.add('hidden');
            view.classList.remove('active');
        });

        // Show current view
        const currentView = document.getElementById(`${viewName}-view`);
        if (currentView) {
            currentView.classList.remove('hidden');
            currentView.classList.add('active');
            this.currentView = viewName;

            // Load view-specific data
            this.loadViewData(viewName);
        } else {
            console.warn(`⚠️ Vue non trouvée: ${viewName}-view`);
            
            // Fallback vers le dashboard si la vue n'existe pas
            if (viewName !== 'dashboard') {
                console.log('🔄 Redirection vers dashboard...');
                this.switchView('dashboard');
            }
        }
    }

    async loadViewData(viewName) {
        switch (viewName) {
            case 'dashboard':
                await this.loadDashboard();
                break;
            case 'users':
                if (window.usersManager) {
                    await window.usersManager.loadUsers();
                }
                break;
            case 'teams':
                if (window.teamsManager) {
                    await window.teamsManager.loadTeams();
                }
                break;
            case 'software':
                if (window.softwareManager) {
                    await window.softwareManager.loadSoftware();
                }
                break;
            case 'rights':
                if (window.rightsManager) {
                    await window.rightsManager.init();
                }
                break;
            case 'access':
                if (window.accessManager) {
                    await window.accessManager.loadAccess();
                }
                break;
            case 'reports':
                if (window.reportsManager) {
                    await window.reportsManager.loadReports();
                }
                break;
            case 'schedule':
                if (window.scheduleManager) {
                    await window.scheduleManager.init();
                }
                break;
            case 'logs':
                if (window.logsManager) {
                    await window.logsManager.init();
                }
                break;
            case 'tutorials':
                if (window.processManager) {
                    // Attendre que la vue soit complètement chargée avant d'afficher le contenu
                    setTimeout(() => {
                        window.processManager.showAllProcesses();
                    }, 300);
                }
                break;
        }
    }

    async loadDashboard() {
        try {
            // Charger les statistiques
            const [usersResult, softwareResult, accessResult] = await Promise.all([
                fetch('tables/utilisateurs').then(r => r.json()),
                fetch('tables/logiciels').then(r => r.json()),
                fetch('tables/acces').then(r => r.json())
            ]);

            const activeUsers = (usersResult.data || []).filter(u => !u.archived);
            const activeSoftware = (softwareResult.data || []).filter(s => !s.archived);
            const activeAccess = accessResult.data || [];

            // Mettre à jour les statistiques
            document.getElementById('stat-users').textContent = activeUsers.length;
            document.getElementById('stat-software').textContent = activeSoftware.length;
            document.getElementById('stat-access').textContent = activeAccess.length;

            // Calculer le coût total
            const totalCost = await this.calculateTotalCost();
            const annualCost = totalCost * 12;
            document.getElementById('stat-cost-monthly').textContent = `${totalCost.toFixed(2)}€`;
            document.getElementById('stat-cost-annual').textContent = `${annualCost.toFixed(2)}€`;

            // Charger les statistiques par équipe
            await this.loadTeamStats();
            
            // Charger les top 3
            await this.loadTopSoftware();
            await this.loadTopUsers();
            
            // Charger les graphiques
            await this.loadCharts();

        } catch (error) {
            console.error('Erreur lors du chargement du tableau de bord:', error);
        }
    }

    async calculateTotalCost() {
        try {
            const [accessResult, costsResult, droitsResult] = await Promise.all([
                fetch('tables/acces').then(r => r.json()),
                fetch('tables/couts_licences').then(r => r.json()),
                fetch('tables/droits').then(r => r.json())
            ]);

            const access = accessResult.data || [];
            const costs = costsResult.data || [];
            const droits = droitsResult.data || [];
            
            let totalCost = 0;
            const processedSharedAccess = new Set(); // Pour éviter de compter plusieurs fois les accès communs

            for (const acc of access) {
                const cost = costs.find(c => c.logiciel_id === acc.logiciel_id && c.droit_id === acc.droit_id);
                if (cost) {
                    // Pour les accès communs, ne compter qu'une fois par logiciel
                    const droit = droits.find(d => d.id === acc.droit_id);
                    if (droit && droit.nom === 'Accès communs') {
                        const sharedKey = `${acc.logiciel_id}_${acc.droit_id}`;
                        if (!processedSharedAccess.has(sharedKey)) {
                            totalCost += cost.cout_mensuel;
                            processedSharedAccess.add(sharedKey);
                        }
                    } else {
                        totalCost += cost.cout_mensuel;
                    }
                }
            }

            return Math.round(totalCost * 100) / 100;
        } catch (error) {
            console.error('Erreur lors du calcul des coûts:', error);
            return 0;
        }
    }

    async loadTeamStats() {
        try {
            const [teamsResult, usersResult, accessResult, costsResult, droitsResult] = await Promise.all([
                fetch('tables/equipes').then(r => r.json()),
                fetch('tables/utilisateurs').then(r => r.json()),
                fetch('tables/acces').then(r => r.json()),
                fetch('tables/couts_licences').then(r => r.json()),
                fetch('tables/droits').then(r => r.json())
            ]);

            const teams = (teamsResult.data || []).filter(t => !t.archived);
            const users = (usersResult.data || []).filter(u => !u.archived);
            const access = accessResult.data || [];
            const costs = costsResult.data || [];
            const droits = droitsResult.data || [];

            const container = document.getElementById('team-stats-container');
            if (!container) return;

            const teamStatsHtml = teams.map(team => {
                const teamUsers = users.filter(u => u.equipe_id === team.id);
                const teamUserIds = teamUsers.map(u => u.id);
                const teamAccess = access.filter(a => teamUserIds.includes(a.utilisateur_id));
                
                // Calculer le coût total de l'équipe
                let totalCost = 0;
                const processedShared = new Set();
                
                for (const acc of teamAccess) {
                    const cost = costs.find(c => c.logiciel_id === acc.logiciel_id && c.droit_id === acc.droit_id);
                    const droit = droits.find(d => d.id === acc.droit_id);
                    
                    if (cost) {
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

                return `
                    <div class="bg-white rounded-lg shadow-md p-4">
                        <h4 class="font-semibold text-lg text-gray-900 mb-2">${team.nom}</h4>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-600">Utilisateurs:</span>
                                <span class="font-medium">${teamUsers.length}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Coût total:</span>
                                <span class="font-bold text-blue-600">${totalCost.toFixed(2)}€</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            container.innerHTML = teamStatsHtml;

        } catch (error) {
            console.error('Erreur lors du chargement des statistiques par équipe:', error);
        }
    }

    async loadCharts() {
        try {
            // Graphique des coûts par logiciel
            await this.loadCostChart();
            
            // Graphique des coûts par équipe
            await this.loadTeamCostChart();
            
            // Graphique des moyens de paiement
            await this.loadPaymentMethodChart();
        } catch (error) {
            console.error('Erreur lors du chargement des graphiques:', error);
        }
    }

    async loadCostChart() {
        const ctx = document.getElementById('costChart');
        if (!ctx) return;

        try {
            const [accessResult, costsResult, softwareResult, droitsResult] = await Promise.all([
                fetch('tables/acces').then(r => r.json()),
                fetch('tables/couts_licences').then(r => r.json()),
                fetch('tables/logiciels').then(r => r.json()),
                fetch('tables/droits').then(r => r.json())
            ]);

            const access = accessResult.data || [];
            const costs = costsResult.data || [];
            const software = (softwareResult.data || []).filter(s => !s.archived);
            const droits = droitsResult.data || [];

            const softwareCosts = {};
            
            for (const soft of software) {
                softwareCosts[soft.id] = 0;
                const softwareAccess = access.filter(a => a.logiciel_id === soft.id);
                const processedShared = new Set();
                
                for (const acc of softwareAccess) {
                    const cost = costs.find(c => c.logiciel_id === acc.logiciel_id && c.droit_id === acc.droit_id);
                    if (cost) {
                        const droit = droits.find(d => d.id === acc.droit_id);
                        if (droit && droit.nom === 'Accès communs') {
                            const sharedKey = `${acc.logiciel_id}_${acc.droit_id}`;
                            if (!processedShared.has(sharedKey)) {
                                softwareCosts[soft.id] += cost.cout_mensuel;
                                processedShared.add(sharedKey);
                            }
                        } else {
                            softwareCosts[soft.id] += cost.cout_mensuel;
                        }
                    }
                }
            }

            const labels = software.map(s => s.nom);
            const data = software.map(s => softwareCosts[s.id] || 0);

            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: [
                            '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
                            '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Erreur lors du chargement du graphique des coûts:', error);
        }
    }

    async loadRightsChart() {
        const ctx = document.getElementById('rightsChart');
        if (!ctx) return;

        try {
            const accessResult = await fetch('tables/acces').then(r => r.json());
            const access = accessResult.data || [];

            const rightsCount = {};
            
            for (const droit of this.droits) {
                rightsCount[droit.nom] = access.filter(a => a.droit_id === droit.id).length;
            }

            const labels = Object.keys(rightsCount);
            const data = Object.values(rightsCount);

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Nombre d\'accès',
                        data: data,
                        backgroundColor: '#3B82F6'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Erreur lors du chargement du graphique des droits:', error);
        }
    }

    async loadTeamCostChart() {
        const ctx = document.getElementById('teamCostChart');
        if (!ctx) return;

        try {
            const [teamsResult, usersResult, accessResult, costsResult, droitsResult] = await Promise.all([
                fetch('tables/equipes').then(r => r.json()),
                fetch('tables/utilisateurs').then(r => r.json()),
                fetch('tables/acces').then(r => r.json()),
                fetch('tables/couts_licences').then(r => r.json()),
                fetch('tables/droits').then(r => r.json())
            ]);

            const teams = (teamsResult.data || []).filter(t => !t.archived);
            const users = (usersResult.data || []).filter(u => !u.archived);
            const access = accessResult.data || [];
            const costs = costsResult.data || [];
            const droits = droitsResult.data || [];

            const teamCosts = {};
            
            for (const team of teams) {
                const teamUsers = users.filter(u => u.equipe_id === team.id);
                const teamUserIds = teamUsers.map(u => u.id);
                const teamAccess = access.filter(a => teamUserIds.includes(a.utilisateur_id));
                
                let totalCost = 0;
                const processedShared = new Set();
                
                for (const acc of teamAccess) {
                    const cost = costs.find(c => c.logiciel_id === acc.logiciel_id && c.droit_id === acc.droit_id);
                    const droit = droits.find(d => d.id === acc.droit_id);
                    
                    if (cost) {
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
                
                teamCosts[team.nom] = totalCost;
            }

            const labels = Object.keys(teamCosts);
            const data = Object.values(teamCosts);

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Coût mensuel (€)',
                        data: data,
                        backgroundColor: '#10B981'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return value + '€';
                                }
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Erreur lors du chargement du graphique des coûts par équipe:', error);
        }
    }

    // Méthodes utilitaires
    showModal(title, content, actions = [], size = 'md') {
        const sizeClasses = {
            'sm': 'max-w-md',
            'md': 'max-w-md',
            'lg': 'max-w-2xl',
            'xl': 'max-w-4xl'
        };
        
        const modalHtml = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full max-h-screen overflow-y-auto">
                    <div class="border-b px-6 py-4 sticky top-0 bg-white">
                        <h3 class="text-lg font-semibold">${title}</h3>
                    </div>
                    <div class="px-6 py-4">
                        ${content}
                    </div>
                    <div class="border-t px-6 py-4 flex justify-end space-x-3 sticky bottom-0 bg-white">
                        ${actions.map(action => `<button class="${action.class}" onclick="${action.onclick}">${action.text}</button>`).join('')}
                        <button class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg" onclick="this.closest('.fixed').remove()">Annuler</button>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('modal-container').innerHTML = modalHtml;
    }

    showAlert(message, type = 'info') {
        const alertClass = {
            'success': 'bg-green-100 border-green-400 text-green-700',
            'error': 'bg-red-100 border-red-400 text-red-700',
            'warning': 'bg-yellow-100 border-yellow-400 text-yellow-700',
            'info': 'bg-blue-100 border-blue-400 text-blue-700'
        }[type] || 'bg-blue-100 border-blue-400 text-blue-700';

        const alertHtml = `
            <div class="fixed top-4 right-4 z-50 border-l-4 p-4 rounded-lg shadow-lg ${alertClass}" style="max-width: 300px;">
                <div class="flex justify-between items-center">
                    <p class="text-sm">${message}</p>
                    <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-lg">&times;</button>
                </div>
            </div>
        `;
        
        const alertContainer = document.createElement('div');
        alertContainer.innerHTML = alertHtml;
        document.body.appendChild(alertContainer);
        
        setTimeout(() => {
            alertContainer.remove();
        }, 5000);
    }

    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    async loadTopSoftware() {
        try {
            const [softwareResult, accessResult, costsResult, droitsResult] = await Promise.all([
                fetch('tables/logiciels').then(r => r.json()),
                fetch('tables/acces').then(r => r.json()),
                fetch('tables/couts_licences').then(r => r.json()),
                fetch('tables/droits').then(r => r.json())
            ]);
            
            const software = (softwareResult.data || []).filter(s => !s.archived);
            const access = accessResult.data || [];
            const costs = costsResult.data || [];
            const droits = droitsResult.data || [];
            
            // Calculer le coût annuel pour chaque logiciel basé sur les accès et la périodicité
            const softwareWithCosts = software.map(s => {
                const softwareAccess = access.filter(a => a.logiciel_id === s.id);
                
                // Calculer le coût mensuel total basé sur les accès
                let totalMonthlyCost = 0;
                const processedShared = new Set();
                
                softwareAccess.forEach(acc => {
                    const cost = costs.find(c => c.logiciel_id === acc.logiciel_id && c.droit_id === acc.droit_id);
                    const droit = droits.find(d => d.id === acc.droit_id);
                    
                    if (cost) {
                        const monthlyCost = cost.cout_mensuel || 0;
                        
                        if (droit && droit.nom === 'Accès communs') {
                            const sharedKey = `${acc.logiciel_id}_${acc.droit_id}`;
                            if (!processedShared.has(sharedKey)) {
                                totalMonthlyCost += monthlyCost;
                                processedShared.add(sharedKey);
                            }
                        } else {
                            totalMonthlyCost += monthlyCost;
                        }
                    }
                });
                
                return {
                    ...s,
                    cout_mensuel: totalMonthlyCost,
                    cout_annuel: totalMonthlyCost * 12
                };
            });
            
            // Trier par coût annuel décroissant et prendre les 3 premiers
            const topSoftware = softwareWithCosts
                .sort((a, b) => b.cout_annuel - a.cout_annuel)
                .slice(0, 3);
                
            this.renderTopSoftware(topSoftware);
            
        } catch (error) {
            console.error('Erreur lors du chargement du top logiciels:', error);
        }
    }

    async loadTopUsers() {
        try {
            const [usersResult, accessResult, costsResult, softwareResult, droitsResult] = await Promise.all([
                fetch('tables/utilisateurs').then(r => r.json()),
                fetch('tables/acces').then(r => r.json()),
                fetch('tables/couts_licences').then(r => r.json()),
                fetch('tables/logiciels').then(r => r.json()),
                fetch('tables/droits').then(r => r.json())
            ]);
            
            const users = (usersResult.data || []).filter(u => !u.archived);
            const access = accessResult.data || [];
            const costs = costsResult.data || [];
            const software = (softwareResult.data || []).filter(s => !s.archived);
            const droits = droitsResult.data || [];
            
            // Calculer le coût annuel par utilisateur basé sur les accès
            const usersWithCosts = users.map(user => {
                const userAccess = access.filter(a => a.utilisateur_id === user.id);
                let totalMonthlyCost = 0;
                const processedShared = new Set();
                
                userAccess.forEach(acc => {
                    const cost = costs.find(c => c.logiciel_id === acc.logiciel_id && c.droit_id === acc.droit_id);
                    const droit = droits.find(d => d.id === acc.droit_id);
                    
                    if (cost) {
                        const monthlyCost = cost.cout_mensuel || 0;
                        
                        if (droit && droit.nom === 'Accès communs') {
                            const sharedKey = `${acc.logiciel_id}_${acc.droit_id}`;
                            if (!processedShared.has(sharedKey)) {
                                totalMonthlyCost += monthlyCost;
                                processedShared.add(sharedKey);
                            }
                        } else {
                            totalMonthlyCost += monthlyCost;
                        }
                    }
                });
                
                return {
                    ...user,
                    cout_mensuel: totalMonthlyCost,
                    cout_annuel: totalMonthlyCost * 12
                };
            });
            
            // Trier par coût annuel décroissant et prendre les 3 premiers
            const topUsers = usersWithCosts
                .sort((a, b) => b.cout_annuel - a.cout_annuel)
                .slice(0, 3);
                
            this.renderTopUsers(topUsers);
            
        } catch (error) {
            console.error('Erreur lors du chargement du top utilisateurs:', error);
        }
    }

    calculateAnnualCost(monthlyCost, periodicity) {
        if (!monthlyCost) return 0;
        
        const multipliers = {
            'mensuel': 12,
            'trimestriel': 4,
            'semestriel': 2,
            'annuel': 1
        };
        
        return monthlyCost * (multipliers[periodicity] || 12);
    }

    renderTopSoftware(topSoftware) {
        const container = document.getElementById('top-software-container');
        if (!container) return;
        
        if (topSoftware.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-sm">Aucun logiciel avec coût défini</p>';
            return;
        }
        
        const medals = ['🥇', '🥈', '🥉'];
        const colors = ['text-yellow-600', 'text-gray-500', 'text-amber-600'];
        
        container.innerHTML = topSoftware.map((software, index) => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center">
                    <span class="text-xl mr-3">${medals[index]}</span>
                    <div>
                        <div class="font-medium text-gray-900">${software.nom}</div>
                        <div class="text-sm text-gray-600">${software.periodicite || 'mensuel'}</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="font-bold ${colors[index]}">${software.cout_annuel.toFixed(2)}€/an</div>
                    <div class="text-sm text-gray-600">${(software.cout_mensuel || 0).toFixed(2)}€/mois</div>
                </div>
            </div>
        `).join('');
    }

    renderTopUsers(topUsers) {
        const container = document.getElementById('top-users-container');
        if (!container) return;
        
        if (topUsers.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-sm">Aucun utilisateur avec coûts calculés</p>';
            return;
        }
        
        const medals = ['🥇', '🥈', '🥉'];
        const colors = ['text-yellow-600', 'text-gray-500', 'text-amber-600'];
        
        container.innerHTML = topUsers.map((user, index) => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center">
                    <span class="text-xl mr-3">${medals[index]}</span>
                    <div>
                        <div class="font-medium text-gray-900">${user.nom} ${user.prenom}</div>
                        <div class="text-sm text-gray-600">${user.email}</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="font-bold ${colors[index]}">${user.cout_annuel.toFixed(2)}€/an</div>
                    <div class="text-sm text-gray-600">${user.cout_mensuel.toFixed(2)}€/mois</div>
                </div>
            </div>
        `).join('');
    }

    async loadPaymentMethodChart() {
        const ctx = document.getElementById('paymentMethodChart');
        if (!ctx) return;

        try {
            const [softwareResult, accessResult, costsResult, droitsResult] = await Promise.all([
                fetch('tables/logiciels').then(r => r.json()),
                fetch('tables/acces').then(r => r.json()),
                fetch('tables/couts_licences').then(r => r.json()),
                fetch('tables/droits').then(r => r.json())
            ]);
            
            const software = (softwareResult.data || []).filter(s => !s.archived);
            const access = accessResult.data || [];
            const costs = costsResult.data || [];
            const droits = droitsResult.data || [];

            // Calculer le coût total pour chaque logiciel basé sur les accès et la périodicité
            const softwareWithCosts = software.map(s => {
                const softwareAccess = access.filter(a => a.logiciel_id === s.id);
                
                // Calculer le coût mensuel total basé sur les accès
                let totalMonthlyCost = 0;
                const processedShared = new Set();
                
                softwareAccess.forEach(acc => {
                    const cost = costs.find(c => c.logiciel_id === acc.logiciel_id && c.droit_id === acc.droit_id);
                    const droit = droits.find(d => d.id === acc.droit_id);
                    
                    if (cost) {
                        const monthlyCost = cost.cout_mensuel || 0;
                        
                        if (droit && droit.nom === 'Accès communs') {
                            const sharedKey = `${acc.logiciel_id}_${acc.droit_id}`;
                            if (!processedShared.has(sharedKey)) {
                                totalMonthlyCost += monthlyCost;
                                processedShared.add(sharedKey);
                            }
                        } else {
                            totalMonthlyCost += monthlyCost;
                        }
                    }
                });
                
                return {
                    ...s,
                    cout_annuel: totalMonthlyCost * 12
                };
            });

            // Compter par moyen de paiement
            const paymentMethods = {};
            const paymentMethodLabels = {
                'carte': 'Carte bancaire',
                'prelevement': 'Prélèvement',
                'virement': 'Virement'
            };

            softwareWithCosts.forEach(s => {
                const method = s.moyen_paiement || 'non-defini';
                if (!paymentMethods[method]) {
                    paymentMethods[method] = { count: 0, cost: 0 };
                }
                paymentMethods[method].count++;
                paymentMethods[method].cost += s.cout_annuel;
            });

            const labels = Object.keys(paymentMethods).map(key => 
                paymentMethodLabels[key] || 'Non défini'
            );
            const data = Object.values(paymentMethods).map(pm => pm.cost);
            const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: colors.slice(0, labels.length),
                        borderWidth: 2,
                        borderColor: '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                usePointStyle: true,
                                font: {
                                    size: 12
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const method = Object.keys(paymentMethods)[context.dataIndex];
                                    const pm = paymentMethods[method];
                                    return `${context.label}: ${context.parsed.toFixed(2)}€/an (${pm.count} logiciel${pm.count > 1 ? 's' : ''})`;
                                }
                            }
                        }
                    }
                }
            });

        } catch (error) {
            console.error('Erreur lors du chargement du graphique des moyens de paiement:', error);
        }
    }
}

// Initialiser l'application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AccessManagementApp();
});