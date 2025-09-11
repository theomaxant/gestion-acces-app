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
            const result = await window.D1API.get('droits');
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
                if (['logout', 'teams', 'rights', 'logs', 'process'].includes(viewId)) {
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
        
        // Documentation process handlers - Fonction globale pour les clics sur les blocs
        window.openProcessDocumentation = (processId) => {
            console.log('Ouverture documentation pour:', processId);
            
            // Essayer avec la classe si disponible
            if (window.ProcessDocumentation) {
                try {
                    const doc = new window.ProcessDocumentation();
                    doc.showProcess(processId);
                    return;
                } catch (error) {
                    console.error('Erreur ProcessDocumentation:', error);
                }
            }
            
            // Sinon utiliser l'instance si disponible
            if (window.processDocumentation && typeof window.processDocumentation.showProcess === 'function') {
                try {
                    window.processDocumentation.showProcess(processId);
                    return;
                } catch (error) {
                    console.error('Erreur instance processDocumentation:', error);
                }
            }
            
            // Fallback : affichage simple
            console.warn('Système de documentation non disponible pour:', processId);
            alert(`Documentation "${processId}" - Système en cours de chargement`);
        };
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
        if (!['teams', 'rights', 'logs', 'process'].includes(viewName)) {
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
                // S'assurer que le ReportsManager est initialisé
                if (!window.reportsManager && window.initReportsManager) {
                    window.initReportsManager();
                }
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
            case 'process':
                if (window.processManager) {
                    // Attendre que la vue soit complètement chargée avant d'afficher le contenu
                    setTimeout(() => {
                        window.processManager.showAllProcesses();
                    }, 300);
                }
                break;
            case 'tutorials':
                // Page des tutoriels - le système de tutoriels est géré par tutorials.js
                // Aucune action spécifique requise ici
                break;
        }
    }

    async loadDashboard() {
        try {
            // Charger les statistiques via Supabase API
            const [usersResult, softwareResult, accessResult] = await Promise.all([
                window.D1API.get('utilisateurs'),
                window.D1API.get('logiciels'),
                window.D1API.get('acces')
            ]);

            const activeUsers = (usersResult.data || []).filter(u => !u.archived);
            const activeSoftware = (softwareResult.data || []).filter(s => !s.archived);
            const activeAccess = accessResult.data || [];

            // Mettre à jour les statistiques
            document.getElementById('stat-users').textContent = activeUsers.length;
            document.getElementById('stat-software').textContent = activeSoftware.length;

            // Calculer le coût total
            const totalCost = await this.calculateTotalCost();
            const annualCost = totalCost * 12;
            document.getElementById('stat-cost-monthly').textContent = `${totalCost.toFixed(2)}€`;
            document.getElementById('stat-cost-annual').textContent = `${annualCost.toFixed(2)}€`;

            // Calculer le coût des externes
            const externalCost = await this.calculateExternalUsersCost();
            const externalAnnualCost = externalCost * 12;
            document.getElementById('stat-external-cost-monthly').textContent = `${externalCost.toFixed(2)}€`;
            document.getElementById('stat-external-cost-annual').textContent = `${externalAnnualCost.toFixed(2)}€`;

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
                window.D1API.get('acces'),
                window.D1API.get('couts_licences'),
                window.D1API.get('droits')
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

    async calculateExternalUsersCost() {
        try {
            const [usersResult, accessResult, costsResult, droitsResult] = await Promise.all([
                window.D1API.get('utilisateurs'),
                window.D1API.get('acces'),
                window.D1API.get('couts_licences'),
                window.D1API.get('droits')
            ]);

            const users = (usersResult.data || []).filter(u => !u.archived && u.externe);
            const access = accessResult.data || [];
            const costs = costsResult.data || [];
            const droits = droitsResult.data || [];
            
            let totalCost = 0;
            const processedSharedAccess = new Set(); // Pour éviter de compter plusieurs fois les accès communs
            
            // Récupérer les IDs des utilisateurs externes
            const externalUserIds = users.map(u => u.id);

            for (const acc of access) {
                // Ne compter que les accès des utilisateurs externes
                if (!externalUserIds.includes(acc.utilisateur_id)) continue;
                
                const cost = costs.find(c => c.logiciel_id === acc.logiciel_id && c.droit_id === acc.droit_id);
                if (cost) {
                    const droit = droits.find(d => d.id === acc.droit_id);
                    
                    if (droit && droit.nom === 'Accès communs') {
                        // Pour les accès communs, ne compter qu'une fois par logiciel
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
            console.error('Erreur lors du calcul des coûts externes:', error);
            return 0;
        }
    }

    async loadTeamStats() {
        try {
            const [teamsResult, usersResult, accessResult, costsResult, droitsResult] = await Promise.all([
                window.D1API.get('equipes'),
                window.D1API.get('utilisateurs'),
                window.D1API.get('acces'),
                window.D1API.get('couts_licences'),
                window.D1API.get('droits')
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
            // Graphique des utilisateurs internes vs externes
            await this.loadExternalUsersChart();
            
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

    async loadExternalUsersChart() {
        const ctx = document.getElementById('externalUsersChart');
        if (!ctx) {
            console.warn('Element externalUsersChart non trouvé');
            return;
        }

        try {
            const [usersResult, accessResult, costsResult, droitsResult] = await Promise.all([
                window.D1API.get('utilisateurs'),
                window.D1API.get('acces'),
                window.D1API.get('couts_licences'),
                window.D1API.get('droits')
            ]);

            const users = (usersResult.data || []).filter(u => !u.archived);
            const access = accessResult.data || [];
            const costs = costsResult.data || [];
            const droits = droitsResult.data || [];

            // Compter les utilisateurs internes vs externes
            const internalUsers = users.filter(u => !u.externe);
            const externalUsers = users.filter(u => u.externe);

            // Calculer les coûts
            const totalCost = await this.calculateTotalCost();
            const externalCost = await this.calculateExternalUsersCost();
            const internalCost = totalCost - externalCost;

            // Détruire le graphique existant s'il existe
            if (this.externalUsersChartInstance) {
                this.externalUsersChartInstance.destroy();
            }

            // Créer le graphique combiné (barres pour utilisateurs, ligne pour coûts)
            this.externalUsersChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Utilisateurs Internes', 'Utilisateurs Externes'],
                    datasets: [
                        {
                            type: 'bar',
                            label: 'Nombre d\'utilisateurs',
                            data: [internalUsers.length, externalUsers.length],
                            backgroundColor: ['rgba(59, 130, 246, 0.7)', 'rgba(249, 115, 22, 0.7)'],
                            borderColor: ['rgba(59, 130, 246, 1)', 'rgba(249, 115, 22, 1)'],
                            borderWidth: 2,
                            yAxisID: 'y'
                        },
                        {
                            type: 'line',
                            label: 'Coût mensuel (€)',
                            data: [internalCost, externalCost],
                            backgroundColor: 'rgba(34, 197, 94, 0.2)',
                            borderColor: 'rgba(34, 197, 94, 1)',
                            borderWidth: 3,
                            fill: false,
                            tension: 0.1,
                            pointRadius: 8,
                            pointBackgroundColor: 'rgba(34, 197, 94, 1)',
                            yAxisID: 'y1'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Nombre d\'utilisateurs'
                            }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            title: {
                                display: true,
                                text: 'Coût mensuel (€)'
                            },
                            grid: {
                                drawOnChartArea: false,
                            },
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: `Total: ${users.length} utilisateurs - Coût total: ${totalCost.toFixed(2)}€/mois`
                        }
                    }
                }
            });

        } catch (error) {
            console.error('Erreur lors du chargement du graphique des utilisateurs externes:', error);
        }
    }

    async loadCostChart() {
        const ctx = document.getElementById('costChart');
        if (!ctx) {
            console.warn('Element costChart non trouvé');
            return;
        }
        console.log('Chargement du graphique des coûts...');

        try {
            const [accessResult, costsResult, softwareResult, droitsResult] = await Promise.all([
                window.D1API.get('acces'),
                window.D1API.get('couts_licences'),
                window.D1API.get('logiciels'),
                window.D1API.get('droits')
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

            // Filtrer les logiciels qui ont des coûts > 0
            const softwareWithCosts = software.filter(s => (softwareCosts[s.id] || 0) > 0);
            
            const labels = softwareWithCosts.map(s => s.nom);
            const data = softwareWithCosts.map(s => softwareCosts[s.id]);

            // Si aucune donnée, afficher un message au lieu du graphique
            if (data.length === 0 || data.every(d => d === 0)) {
                ctx.getContext('2d').clearRect(0, 0, ctx.width, ctx.height);
                const context = ctx.getContext('2d');
                context.font = '16px Arial';
                context.fillStyle = '#6B7280';
                context.textAlign = 'center';
                context.fillText('Aucune donnée de coût disponible', ctx.width / 2, ctx.height / 2);
                return;
            }

            // Détruire le graphique existant s'il y en a un
            if (window.costChart && typeof window.costChart.destroy === 'function') {
                try {
                    window.costChart.destroy();
                } catch (e) {
                    console.warn('Erreur lors de la destruction du graphique coûts:', e);
                }
            }
            window.costChart = null;

            // Vérifier que Chart.js est disponible
            if (typeof Chart === 'undefined') {
                console.error('Chart.js n\'est pas chargé');
                return;
            }
            
            window.costChart = new Chart(ctx, {
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
                plugins: [ChartDataLabels],
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    const percentage = ((value / context.dataset.data.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
                                    return `${label}: ${value}€/mois (${percentage}%)`;
                                }
                            }
                        },
                        datalabels: {
                            display: function(context) {
                                const value = context.dataset.data[context.dataIndex];
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = (value / total) * 100;
                                return percentage > 5; // Afficher seulement si > 5%
                            },
                            color: '#fff',
                            font: {
                                weight: 'bold',
                                size: 12
                            },
                            formatter: function(value, context) {
                                if (value === 0) return '';
                                return value + '€';
                            }
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
            const accessResult = await window.D1API.get('acces');
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
        if (!ctx) {
            console.warn('Element teamCostChart non trouvé');
            return;
        }
        console.log('Chargement du graphique des coûts par équipe...');

        try {
            const [teamsResult, usersResult, accessResult, costsResult, droitsResult] = await Promise.all([
                window.D1API.get('equipes'),
                window.D1API.get('utilisateurs'),
                window.D1API.get('acces'),
                window.D1API.get('couts_licences'),
                window.D1API.get('droits')
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

            // Détruire le graphique existant s'il y en a un
            if (window.teamCostChart && typeof window.teamCostChart.destroy === 'function') {
                try {
                    window.teamCostChart.destroy();
                } catch (e) {
                    console.warn('Erreur lors de la destruction du graphique équipes:', e);
                }
            }
            window.teamCostChart = null;

            // Vérifier que Chart.js est disponible
            if (typeof Chart === 'undefined') {
                console.error('Chart.js n\'est pas chargé pour teamCostChart');
                return;
            }
            
            window.teamCostChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Coût mensuel (€)',
                        data: data,
                        backgroundColor: '#10B981'
                    }]
                },
                plugins: [ChartDataLabels],
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.label}: ${context.raw}€/mois`;
                                }
                            }
                        },
                        datalabels: {
                            anchor: 'end',
                            align: 'top',
                            color: '#374151',
                            font: {
                                weight: 'bold',
                                size: 11
                            },
                            formatter: function(value) {
                                if (value === 0) return '';
                                return value + '€';
                            }
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
                window.D1API.get('logiciels'),
                window.D1API.get('acces'),
                window.D1API.get('couts_licences'),
                window.D1API.get('droits')
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
                window.D1API.get('utilisateurs'),
                window.D1API.get('acces'),
                window.D1API.get('couts_licences'),
                window.D1API.get('logiciels'),
                window.D1API.get('droits')
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
        if (!ctx) {
            console.warn('Element paymentMethodChart non trouvé');
            return;
        }
        console.log('Chargement du graphique des moyens de paiement...');

        try {
            const [softwareResult, accessResult, costsResult, droitsResult] = await Promise.all([
                window.D1API.get('logiciels'),
                window.D1API.get('acces'),
                window.D1API.get('couts_licences'),
                window.D1API.get('droits')
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

            // Filtrer les moyens de paiement qui ont des coûts > 0 et qui ne sont pas "non-défini"
            const filteredPaymentMethods = Object.entries(paymentMethods)
                .filter(([key, pm]) => pm.cost > 0 && key !== 'non-defini')
                .reduce((acc, [key, value]) => {
                    acc[key] = value;
                    return acc;
                }, {});

            const labels = Object.keys(filteredPaymentMethods).map(key => 
                paymentMethodLabels[key] || key
            );
            const data = Object.values(filteredPaymentMethods).map(pm => pm.cost);
            const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

            // Si aucune donnée, afficher un message au lieu du graphique
            if (data.length === 0 || data.every(d => d === 0)) {
                ctx.getContext('2d').clearRect(0, 0, ctx.width, ctx.height);
                const context = ctx.getContext('2d');
                context.font = '16px Arial';
                context.fillStyle = '#6B7280';
                context.textAlign = 'center';
                context.fillText('Aucun moyen de paiement défini', ctx.width / 2, ctx.height / 2);
                return;
            }

            // Détruire le graphique existant s'il y en a un
            if (window.paymentMethodChart && typeof window.paymentMethodChart.destroy === 'function') {
                try {
                    window.paymentMethodChart.destroy();
                } catch (e) {
                    console.warn('Erreur lors de la destruction du graphique paiements:', e);
                }
            }
            window.paymentMethodChart = null;

            // Vérifier que Chart.js est disponible
            if (typeof Chart === 'undefined') {
                console.error('Chart.js n\'est pas chargé pour paymentMethodChart');
                return;
            }
            
            window.paymentMethodChart = new Chart(ctx, {
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
                plugins: [ChartDataLabels],
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
                                    const method = Object.keys(filteredPaymentMethods)[context.dataIndex];
                                    const pm = filteredPaymentMethods[method];
                                    const percentage = ((context.raw / data.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
                                    return `${context.label}: ${context.raw.toFixed(0)}€/an (${pm.count} logiciel${pm.count > 1 ? 's' : ''}) - ${percentage}%`;
                                }
                            }
                        },
                        datalabels: {
                            display: function(context) {
                                const value = context.dataset.data[context.dataIndex];
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = (value / total) * 100;
                                return percentage > 8; // Afficher seulement si > 8%
                            },
                            color: '#fff',
                            font: {
                                weight: 'bold',
                                size: 11
                            },
                            formatter: function(value, context) {
                                if (value === 0) return '';
                                return Math.round(value) + '€';
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