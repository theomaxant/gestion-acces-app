// Gestionnaire des rapports et analyses
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
            this.droits = result.data || [];
        } catch (error) {
            console.error('Erreur lors du chargement des droits:', error);
        }
    }

    setupEventListeners() {
        console.log('📊 Setup event listeners pour les rapports');
        
        const softwareBtn = document.getElementById('view-by-software-btn');
        if (softwareBtn) {
            softwareBtn.addEventListener('click', () => {
                console.log('🔄 Clic sur vue par logiciel');
                this.showSoftwareView();
            });
            console.log('✅ Event listener ajouté pour view-by-software-btn');
        } else {
            console.warn('⚠️ Élément view-by-software-btn non trouvé');
        }

        const userBtn = document.getElementById('view-by-user-btn');
        if (userBtn) {
            userBtn.addEventListener('click', () => {
                console.log('🔄 Clic sur vue par utilisateur');
                this.showUserView();
            });
            console.log('✅ Event listener ajouté pour view-by-user-btn');
        } else {
            console.warn('⚠️ Élément view-by-user-btn non trouvé');
        }

        const teamBtn = document.getElementById('view-by-team-btn');
        if (teamBtn) {
            teamBtn.addEventListener('click', () => {
                console.log('🔄 Clic sur vue par équipe');
                this.showTeamView();
            });
            console.log('✅ Event listener ajouté pour view-by-team-btn');
        } else {
            console.warn('⚠️ Élément view-by-team-btn non trouvé');
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

            this.users = usersResult.data || [];
            this.software = softwareResult.data || [];
            this.access = accessResult.data || [];
            this.costs = costsResult.data || [];
        } catch (error) {
            console.error('Erreur lors du chargement des données de rapport:', error);
            window.app?.showAlert('Erreur lors du chargement des données', 'error');
        }
    }

    async showSoftwareView() {
        console.log('📊 Affichage de la vue par logiciel');
        await this.loadReports();
        this.currentView = 'software';
        
        const container = document.getElementById('detailed-reports-container');
        if (!container) return;

        const activeSoftware = this.software.filter(s => !s.archived);
        
        const html = `
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <h3 class="text-xl font-semibold text-gray-900">Vue par Logiciel</h3>
                    <button onclick="window.reportsManager.exportSoftwareReport()" 
                            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        <i class="fas fa-download mr-2"></i>Exporter
                    </button>
                </div>
                
                <div class="grid gap-6">
                    ${activeSoftware.map(software => this.renderSoftwareReportCard(software)).join('')}
                </div>
            </div>
        `;

        container.innerHTML = html;
        container.classList.remove('hidden');
    }

    renderSoftwareReportCard(software) {
        const softwareAccess = this.access.filter(a => a.logiciel_id === software.id);
        const activeUsers = this.users.filter(u => !u.archived);
        
        // Calculer les coûts
        let totalCost = 0;
        const processedShared = new Set();
        const costsByRight = {};

        for (const acc of softwareAccess) {
            const user = activeUsers.find(u => u.id === acc.utilisateur_id);
            if (!user) continue; // Ignorer les utilisateurs archivés

            const cost = this.costs.find(c => c.logiciel_id === acc.logiciel_id && c.droit_id === acc.droit_id);
            const droit = this.droits.find(d => d.id === acc.droit_id);
            
            if (cost && droit) {
                if (!costsByRight[droit.nom]) {
                    costsByRight[droit.nom] = { count: 0, unitCost: cost.cout_mensuel, totalCost: 0 };
                }

                if (droit.nom === 'Accès communs') {
                    const sharedKey = `${acc.logiciel_id}_${acc.droit_id}`;
                    if (!processedShared.has(sharedKey)) {
                        totalCost += cost.cout_mensuel;
                        costsByRight[droit.nom].totalCost = cost.cout_mensuel;
                        processedShared.add(sharedKey);
                    }
                    costsByRight[droit.nom].count = softwareAccess.filter(a => a.droit_id === acc.droit_id).length;
                } else {
                    totalCost += cost.cout_mensuel;
                    costsByRight[droit.nom].count++;
                    costsByRight[droit.nom].totalCost += cost.cout_mensuel;
                }
            }
        }

        // Grouper les utilisateurs par droit
        const usersByRight = {};
        for (const acc of softwareAccess) {
            const user = activeUsers.find(u => u.id === acc.utilisateur_id);
            if (!user) continue;

            const droit = this.droits.find(d => d.id === acc.droit_id);
            if (droit) {
                if (!usersByRight[droit.nom]) {
                    usersByRight[droit.nom] = [];
                }
                usersByRight[droit.nom].push(user);
            }
        }

        return `
            <div class="bg-white rounded-lg shadow-md border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="text-lg font-semibold text-gray-900">${software.nom}</h4>
                            <p class="text-sm text-gray-600">${software.description || 'Aucune description'}</p>
                        </div>
                        <div class="text-right">
                            <div class="text-2xl font-bold text-blue-600">${totalCost.toFixed(2)}€</div>
                            <div class="text-sm text-gray-500">Coût total/mois</div>
                        </div>
                    </div>
                </div>
                
                <div class="px-6 py-4">
                    <div class="grid md:grid-cols-2 gap-6">
                        <!-- Utilisateurs par droit -->
                        <div>
                            <h5 class="text-sm font-medium text-gray-900 mb-3">Utilisateurs par droit</h5>
                            <div class="space-y-3">
                                ${Object.keys(usersByRight).map(rightName => `
                                    <div class="border rounded-lg p-3">
                                        <div class="flex justify-between items-center mb-2">
                                            <span class="font-medium text-sm">${rightName}</span>
                                            <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                ${usersByRight[rightName].length} utilisateur${usersByRight[rightName].length > 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        <div class="flex flex-wrap gap-1">
                                            ${usersByRight[rightName].map(user => `
                                                <span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                                    ${user.nom} ${user.prenom || ''}
                                                </span>
                                            `).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <!-- Détail des coûts -->
                        <div>
                            <h5 class="text-sm font-medium text-gray-900 mb-3">Détail des coûts</h5>
                            <div class="space-y-2">
                                ${Object.keys(costsByRight).map(rightName => {
                                    const rightData = costsByRight[rightName];
                                    return `
                                        <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
                                            <div>
                                                <div class="text-sm font-medium">${rightName}</div>
                                                <div class="text-xs text-gray-500">
                                                    ${rightData.count} utilisateur${rightData.count > 1 ? 's' : ''} × ${rightData.unitCost}€
                                                    ${rightName === 'Accès communs' ? ' (partagé)' : ''}
                                                </div>
                                            </div>
                                            <div class="text-sm font-medium text-gray-900">
                                                ${rightData.totalCost.toFixed(2)}€
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="px-6 py-3 bg-gray-50 rounded-b-lg">
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-gray-600">
                            Total: ${softwareAccess.filter(a => activeUsers.find(u => u.id === a.utilisateur_id)).length} accès accordés
                        </span>
                        <button onclick="window.reportsManager.exportSoftwareDetails('${software.id}')" 
                                class="text-blue-600 hover:text-blue-800">
                            <i class="fas fa-download mr-1"></i>Exporter ce logiciel
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    async showUserView() {
        console.log('👤 Affichage de la vue par utilisateur');
        await this.loadReports();
        this.currentView = 'user';
        
        const container = document.getElementById('detailed-reports-container');
        if (!container) return;

        const activeUsers = this.users.filter(u => !u.archived);
        
        const html = `
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <h3 class="text-xl font-semibold text-gray-900">Vue par Utilisateur</h3>
                    <button onclick="window.reportsManager.exportUserReport()" 
                            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        <i class="fas fa-download mr-2"></i>Exporter
                    </button>
                </div>
                
                <div class="grid gap-6">
                    ${activeUsers.map(user => this.renderUserReportCard(user)).join('')}
                </div>
            </div>
        `;

        container.innerHTML = html;
        container.classList.remove('hidden');
    }

    renderUserReportCard(user) {
        const userAccess = this.access.filter(a => a.utilisateur_id === user.id);
        const activeSoftware = this.software.filter(s => !s.archived);
        
        // Calculer les coûts
        let totalCost = 0;
        const processedShared = new Set();
        const softwareDetails = [];

        for (const acc of userAccess) {
            const software = activeSoftware.find(s => s.id === acc.logiciel_id);
            if (!software) continue; // Ignorer les logiciels archivés

            const cost = this.costs.find(c => c.logiciel_id === acc.logiciel_id && c.droit_id === acc.droit_id);
            const droit = this.droits.find(d => d.id === acc.droit_id);
            
            let costForThisAccess = 0;
            if (cost && droit) {
                if (droit.nom === 'Accès communs') {
                    const sharedKey = `${acc.logiciel_id}_${acc.droit_id}`;
                    if (!processedShared.has(sharedKey)) {
                        costForThisAccess = cost.cout_mensuel;
                        totalCost += cost.cout_mensuel;
                        processedShared.add(sharedKey);
                    }
                } else {
                    costForThisAccess = cost.cout_mensuel;
                    totalCost += cost.cout_mensuel;
                }
            }

            softwareDetails.push({
                software: software,
                droit: droit,
                cost: costForThisAccess,
                isShared: droit && droit.nom === 'Accès communs'
            });
        }

        return `
            <div class="bg-white rounded-lg shadow-md border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="text-lg font-semibold text-gray-900">${user.nom} ${user.prenom || ''}</h4>
                            <div class="space-y-1 text-sm text-gray-600">
                                ${user.email ? `<div><i class="fas fa-envelope mr-1"></i>${user.email}</div>` : ''}
                                ${user.poste ? `<div><i class="fas fa-briefcase mr-1"></i>${user.poste}</div>` : ''}
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-2xl font-bold text-blue-600">${totalCost.toFixed(2)}€</div>
                            <div class="text-sm text-gray-500">Coût total/mois</div>
                        </div>
                    </div>
                </div>
                
                <div class="px-6 py-4">
                    <h5 class="text-sm font-medium text-gray-900 mb-3">Logiciels et droits</h5>
                    <div class="space-y-2">
                        ${softwareDetails.map(detail => `
                            <div class="flex justify-between items-center p-3 border rounded-lg">
                                <div class="flex-1">
                                    <div class="text-sm font-medium text-gray-900">${detail.software.nom}</div>
                                    <div class="text-xs text-gray-500 flex items-center mt-1">
                                        <span class="px-2 py-1 rounded ${this.getRightColor(detail.droit?.nom)}">
                                            ${detail.droit?.nom || 'N/A'}
                                        </span>
                                        ${detail.isShared ? '<span class="ml-2 text-orange-600">(Partagé)</span>' : ''}
                                    </div>
                                </div>
                                <div class="text-sm font-medium text-gray-900">
                                    ${detail.cost.toFixed(2)}€
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="px-6 py-3 bg-gray-50 rounded-b-lg">
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-gray-600">
                            Total: ${userAccess.filter(a => activeSoftware.find(s => s.id === a.logiciel_id)).length} accès
                        </span>
                        <button onclick="window.reportsManager.exportUserDetails('${user.id}')" 
                                class="text-blue-600 hover:text-blue-800">
                            <i class="fas fa-download mr-1"></i>Exporter cet utilisateur
                        </button>
                    </div>
                </div>
            </div>
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

    exportSoftwareReport() {
        if (!this.software.length) return;

        const activeSoftware = this.software.filter(s => !s.archived);
        const activeUsers = this.users.filter(u => !u.archived);
        
        const data = activeSoftware.map(software => {
            const softwareAccess = this.access.filter(a => 
                a.logiciel_id === software.id && 
                activeUsers.find(u => u.id === a.utilisateur_id)
            );
            
            let totalCost = 0;
            const processedShared = new Set();
            
            for (const acc of softwareAccess) {
                const cost = this.costs.find(c => c.logiciel_id === acc.logiciel_id && c.droit_id === acc.droit_id);
                const droit = this.droits.find(d => d.id === acc.droit_id);
                
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

            return {
                'Logiciel': software.nom,
                'Description': software.description || '',
                'Nombre d\'utilisateurs': softwareAccess.length,
                'Coût total/mois (€)': totalCost.toFixed(2)
            };
        });

        this.downloadCSV(data, 'rapport_logiciels.csv');
        window.app?.showAlert('Rapport exporté avec succès', 'success');
    }

    exportUserReport() {
        if (!this.users.length) return;

        const activeUsers = this.users.filter(u => !u.archived);
        const activeSoftware = this.software.filter(s => !s.archived);
        
        const data = activeUsers.map(user => {
            const userAccess = this.access.filter(a => 
                a.utilisateur_id === user.id && 
                activeSoftware.find(s => s.id === a.logiciel_id)
            );
            
            let totalCost = 0;
            const processedShared = new Set();
            
            for (const acc of userAccess) {
                const cost = this.costs.find(c => c.logiciel_id === acc.logiciel_id && c.droit_id === acc.droit_id);
                const droit = this.droits.find(d => d.id === acc.droit_id);
                
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

            return {
                'Nom': user.nom,
                'Prénom': user.prenom || '',
                'Email': user.email || '',
                'Poste': user.poste || '',
                'Nombre de logiciels': userAccess.length,
                'Coût total/mois (€)': totalCost.toFixed(2)
            };
        });

        this.downloadCSV(data, 'rapport_utilisateurs.csv');
        window.app?.showAlert('Rapport exporté avec succès', 'success');
    }

    exportSoftwareDetails(softwareId) {
        const software = this.software.find(s => s.id === softwareId);
        if (!software) return;

        const softwareAccess = this.access.filter(a => a.logiciel_id === softwareId);
        const activeUsers = this.users.filter(u => !u.archived);
        
        const data = softwareAccess
            .filter(acc => activeUsers.find(u => u.id === acc.utilisateur_id))
            .map(acc => {
                const user = activeUsers.find(u => u.id === acc.utilisateur_id);
                const droit = this.droits.find(d => d.id === acc.droit_id);
                const cost = this.costs.find(c => c.logiciel_id === acc.logiciel_id && c.droit_id === acc.droit_id);
                
                return {
                    'Utilisateur': `${user?.nom || ''} ${user?.prenom || ''}`.trim(),
                    'Email': user?.email || '',
                    'Poste': user?.poste || '',
                    'Droit': droit?.nom || '',
                    'Coût/mois (€)': cost ? cost.cout_mensuel.toFixed(2) : '0.00'
                };
            });

        this.downloadCSV(data, `${software.nom.replace(/[^a-zA-Z0-9]/g, '_')}_details.csv`);
        window.app?.showAlert('Détails exportés avec succès', 'success');
    }

    exportUserDetails(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        const userAccess = this.access.filter(a => a.utilisateur_id === userId);
        const activeSoftware = this.software.filter(s => !s.archived);
        
        const data = userAccess
            .filter(acc => activeSoftware.find(s => s.id === acc.logiciel_id))
            .map(acc => {
                const software = activeSoftware.find(s => s.id === acc.logiciel_id);
                const droit = this.droits.find(d => d.id === acc.droit_id);
                const cost = this.costs.find(c => c.logiciel_id === acc.logiciel_id && c.droit_id === acc.droit_id);
                
                return {
                    'Logiciel': software?.nom || '',
                    'Description': software?.description || '',
                    'Droit': droit?.nom || '',
                    'Coût/mois (€)': cost ? cost.cout_mensuel.toFixed(2) : '0.00',
                    'Type': droit && droit.nom === 'Accès communs' ? 'Partagé' : 'Individuel'
                };
            });

        const fileName = `${user.nom.replace(/[^a-zA-Z0-9]/g, '_')}_${user.prenom?.replace(/[^a-zA-Z0-9]/g, '_') || ''}_details.csv`;
        this.downloadCSV(data, fileName);
        window.app?.showAlert('Détails exportés avec succès', 'success');
    }

    downloadCSV(data, filename) {
        if (!data.length) return;

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => {
                const value = row[header] || '';
                // Échapper les guillemets et entourer de guillemets si nécessaire
                return value.toString().includes(',') || value.toString().includes('"') ? 
                    `"${value.toString().replace(/"/g, '""')}"` : value;
            }).join(','))
        ].join('\n');

        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    async showTeamView() {
        console.log('👥 Affichage de la vue par équipe');
        try {
            const [teamsResult, softwareResult, usersResult, accessResult, costsResult] = await Promise.all([
                window.D1API.get('equipes'),
                window.D1API.get('logiciels'),
                window.D1API.get('utilisateurs'),
                window.D1API.get('acces'),
                window.D1API.get('couts_licences')
            ]);

            const teams = (teamsResult.data || []).filter(t => !t.archived);
            const software = (softwareResult.data || []).filter(s => !s.archived);
            const users = (usersResult.data || []).filter(u => !u.archived);
            const access = accessResult.data || [];
            const costs = costsResult.data || [];

            let reportHtml = `
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-semibold">Rapport par Équipe</h3>
                    <button onclick="window.reportsManager.exportTeamReport()" 
                            class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                        <i class="fas fa-file-excel mr-2"></i>Exporter CSV
                    </button>
                </div>
                <div class="space-y-6">
            `;

            for (const team of teams) {
                const teamSoftware = software.filter(s => s.equipe_id === team.id);
                const teamUsers = users.filter(u => u.equipe_id === team.id);
                
                let totalMonthlyCost = 0;
                let totalAnnualCost = 0;

                teamSoftware.forEach(s => {
                    // Calculer le coût mensuel total basé sur ses accès actuels
                    const softwareAccess = access.filter(a => a.logiciel_id === s.id);
                    let softwareMonthlyCost = 0;
                    const processedShared = new Set();
                    
                    softwareAccess.forEach(acc => {
                        const cost = costs.find(c => c.logiciel_id === acc.logiciel_id && c.droit_id === acc.droit_id);
                        const droit = this.droits.find(d => d.id === acc.droit_id);
                        
                        if (cost) {
                            const monthlyCost = cost.cout_mensuel || 0;
                            
                            if (droit && droit.nom === 'Accès communs') {
                                const sharedKey = `${acc.logiciel_id}_${acc.droit_id}`;
                                if (!processedShared.has(sharedKey)) {
                                    softwareMonthlyCost += monthlyCost;
                                    processedShared.add(sharedKey);
                                }
                            } else {
                                softwareMonthlyCost += monthlyCost;
                            }
                        }
                    });
                    
                    const annualCost = softwareMonthlyCost * 12;
                    totalMonthlyCost += softwareMonthlyCost;
                    totalAnnualCost += annualCost;
                    
                    // Ajouter le coût calculé au logiciel pour l'affichage
                    s.cout_mensuel_calcule = softwareMonthlyCost;
                });

                reportHtml += `
                    <div class="bg-white rounded-lg shadow-md p-6">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h4 class="text-lg font-semibold text-gray-900">${team.nom}</h4>
                                <p class="text-gray-600">${team.description || 'Aucune description'}</p>
                                <div class="mt-2 flex space-x-4">
                                    <span class="text-sm text-gray-600">
                                        <i class="fas fa-users mr-1"></i>${teamUsers.length} utilisateur${teamUsers.length > 1 ? 's' : ''}
                                    </span>
                                    <span class="text-sm text-gray-600">
                                        <i class="fas fa-desktop mr-1"></i>${teamSoftware.length} logiciel${teamSoftware.length > 1 ? 's' : ''}
                                    </span>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-2xl font-bold text-green-600">${totalAnnualCost.toFixed(2)}€</div>
                                <div class="text-sm text-gray-600">coût annuel</div>
                                <div class="text-sm text-gray-500">${totalMonthlyCost.toFixed(2)}€/mois</div>
                            </div>
                        </div>

                        ${teamSoftware.length > 0 ? `
                            <div class="mt-4">
                                <h5 class="font-medium text-gray-900 mb-3">Logiciels de l'équipe</h5>
                                <div class="overflow-x-auto">
                                    <table class="min-w-full">
                                        <thead class="bg-gray-50">
                                            <tr>
                                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Logiciel</th>
                                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Coût mensuel</th>
                                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Coût annuel</th>
                                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Périodicité</th>
                                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Moyen de paiement</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-gray-200">
                                            ${teamSoftware.map(s => {
                                                const annualCost = (s.cout_mensuel_calcule || 0) * 12;
                                                const paymentLabels = {
                                                    'carte': '💳 Carte',
                                                    'prelevement': '🏦 Prélèvement', 
                                                    'virement': '📤 Virement'
                                                };
                                                return `
                                                    <tr>
                                                        <td class="px-4 py-2 text-sm font-medium text-gray-900">${s.nom}</td>
                                                        <td class="px-4 py-2 text-sm text-gray-600">${(s.cout_mensuel_calcule || 0).toFixed(2)}€</td>
                                                        <td class="px-4 py-2 text-sm font-semibold text-green-600">${annualCost.toFixed(2)}€</td>
                                                        <td class="px-4 py-2 text-sm text-gray-600">Mensuel</td>
                                                        <td class="px-4 py-2 text-sm text-gray-600">${paymentLabels[s.moyen_paiement] || '-'}</td>
                                                    </tr>
                                                `;
                                            }).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ` : '<p class="text-gray-500 text-sm mt-4">Aucun logiciel assigné à cette équipe</p>'}
                    </div>
                `;
            }

            reportHtml += '</div>';

            const container = document.getElementById('detailed-reports-container');
            container.innerHTML = reportHtml;
            container.classList.remove('hidden');

        } catch (error) {
            console.error('Erreur lors du chargement du rapport par équipe:', error);
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

    async exportTeamReport() {
        try {
            const [teamsResult, softwareResult, accessResult, costsResult, droitsResult] = await Promise.all([
                window.D1API.get('equipes'),
                window.D1API.get('logiciels'),
                window.D1API.get('acces'),
                window.D1API.get('couts_licences'),
                window.D1API.get('droits)
            ]);

            const teams = (teamsResult.data || []).filter(t => !t.archived);
            const software = (softwareResult.data || []).filter(s => !s.archived);
            const access = accessResult.data || [];
            const costs = costsResult.data || [];
            const droits = droitsResult.data || [];

            const csvData = [];
            csvData.push(['Équipe', 'Description', 'Nb Logiciels', 'Coût Mensuel Total', 'Coût Annuel Total']);

            teams.forEach(team => {
                const teamSoftware = software.filter(s => s.equipe_id === team.id);
                let totalMonthlyCost = 0;
                let totalAnnualCost = 0;

                teamSoftware.forEach(s => {
                    // Calculer le coût total pour ce logiciel basé sur ses accès actuels
                    const softwareAccess = access.filter(a => a.logiciel_id === s.id);
                    let softwareMonthlyCost = 0;
                    const processedShared = new Set();
                    
                    softwareAccess.forEach(acc => {
                        const cost = costs.find(c => c.logiciel_id === acc.logiciel_id && c.droit_id === acc.droit_id);
                        const droit = droits.find(d => d.id === acc.droit_id);
                        
                        if (cost) {
                            const monthlyCost = cost.cout_mensuel || 0;
                            
                            if (droit && droit.nom === 'Accès communs') {
                                const sharedKey = `${acc.logiciel_id}_${acc.droit_id}`;
                                if (!processedShared.has(sharedKey)) {
                                    softwareMonthlyCost += monthlyCost;
                                    processedShared.add(sharedKey);
                                }
                            } else {
                                softwareMonthlyCost += monthlyCost;
                            }
                        }
                    });
                    
                    const annualCost = softwareMonthlyCost * 12;
                    totalMonthlyCost += softwareMonthlyCost;
                    totalAnnualCost += annualCost;
                });

                csvData.push([
                    team.nom,
                    team.description || '',
                    teamSoftware.length,
                    totalMonthlyCost.toFixed(2),
                    totalAnnualCost.toFixed(2)
                ]);
            });

            this.downloadCSV(csvData, 'rapport_equipes');

        } catch (error) {
            console.error('Erreur lors de l\'export du rapport par équipe:', error);
        }
    }
}

// Initialiser le gestionnaire de rapports
function initReportsManager() {
    if (!window.reportsManager) {
        window.reportsManager = new ReportsManager();
        console.log('📊 ReportsManager initialisé');
    }
    return window.reportsManager;
}

// Initialiser dès que possible
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReportsManager);
} else {
    initReportsManager();
}

// S'assurer que le manager est disponible globalement
window.initReportsManager = initReportsManager;