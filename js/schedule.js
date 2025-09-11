class ScheduleManager {
    constructor() {
        this.currentDate = new Date();
        this.software = [];
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.renderMonthlyBlocks();
        this.renderCalendar();
    }

    setupEventListeners() {
        document.getElementById('prev-month-btn')?.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });

        document.getElementById('next-month-btn')?.addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });
    }

    async loadData() {
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
            
            // Calculer le coût total pour chaque logiciel basé sur ses accès actuels et la périodicité
            this.software = software.map(s => {
                const softwareAccess = access.filter(a => a.logiciel_id === s.id);
                
                // Calculer le coût mensuel total basé sur les accès actuels
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
                    // Garder periodicite pour la fréquence de paiement dans l'échéancier
                    periodicite: s.periodicite || 'mensuel'
                };
            });
            
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
        }
    }

    calculateMonthlyPayments(month, year) {
        let total = 0;
        const payments = [];

        this.software.forEach(software => {
            if (!software.date_souscription || !software.cout_mensuel || software.cout_mensuel <= 0) return;

            // Calculer tous les paiements pour ce logiciel dans le mois donné
            const paymentsInMonth = this.getPaymentsInMonth(software, month, year);
            paymentsInMonth.forEach(payment => {
                total += payment.amount;
                payments.push(payment);
            });
        });

        return { total, payments };
    }

    getPaymentsInMonth(software, month, year) {
        const payments = [];
        const monthStart = new Date(year, month, 1);
        const monthEnd = new Date(year, month + 1, 0);

        // Calculer la période en mois
        const periodInMonths = {
            'mensuel': 1,
            'trimestriel': 3,
            'semestriel': 6,
            'annuel': 12
        };

        const period = periodInMonths[software.periodicite] || 1;
        
        // Convertir la date string en objet Date
        const nextPayment = this.calculateNextPayment(software);
        if (!nextPayment) return payments;
        
        let currentPayment = new Date(nextPayment.rawDate);

        // Calculer tous les paiements futurs sur les 12 prochains mois
        for (let i = 0; i < 12; i++) {
            const paymentDate = new Date(currentPayment);
            paymentDate.setMonth(paymentDate.getMonth() + (period * i));
            
            if (paymentDate.getMonth() === month && paymentDate.getFullYear() === year) {
                payments.push({
                    date: new Date(paymentDate),
                    amount: software.cout_mensuel,
                    software: software.nom,
                    periodicity: software.periodicite
                });
            }
        }

        return payments;
    }

    calculateNextPayment(software) {
        if (!software.date_souscription) {
            return null;
        }

        const subscriptionDate = new Date(software.date_souscription);
        const today = new Date();
        const periodicity = software.periodicite || 'mensuel';

        // Définir les intervalles en mois
        const periodConfig = {
            'mensuel': 1,
            'trimestriel': 3,
            'semestriel': 6,
            'annuel': 12
        };

        const monthsInterval = periodConfig[periodicity] || 1;
        
        // Calculer la prochaine date de paiement
        let nextPaymentDate = new Date(subscriptionDate);
        
        // Avancer jusqu'à la prochaine date dans le futur
        while (nextPaymentDate <= today) {
            nextPaymentDate.setMonth(nextPaymentDate.getMonth() + monthsInterval);
        }

        return {
            date: nextPaymentDate.toLocaleDateString('fr-FR'),
            rawDate: nextPaymentDate
        };
    }

    renderMonthlyBlocks() {
        const today = new Date();
        const monthNames = [
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ];

        // Afficher les 3 prochains mois consécutifs (mois actuel + 2 suivants)
        for (let i = 0; i < 3; i++) {
            const targetDate = new Date(today);
            targetDate.setMonth(today.getMonth() + i);
            targetDate.setDate(1); // Premier jour du mois
            
            const monthData = this.calculateMonthlyPayments(targetDate.getMonth(), targetDate.getFullYear());
            
            const block = document.getElementById(`month-${i + 1}-block`);
            if (block) {
                const monthName = monthNames[targetDate.getMonth()];
                const year = targetDate.getFullYear();
                
                block.querySelector('h3').textContent = `${monthName} ${year}`;
                block.querySelector('.text-3xl').textContent = `${monthData.total.toFixed(2)}€`;
                block.querySelector('.text-sm').textContent = `${monthData.payments.length} paiement${monthData.payments.length > 1 ? 's' : ''}`;
            }
        }
    }

    renderCalendar() {
        const monthNames = [
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ];
        
        const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        
        const currentMonth = this.currentDate.getMonth();
        const currentYear = this.currentDate.getFullYear();
        
        // Mettre à jour le titre
        document.getElementById('current-month-year').textContent = 
            `${monthNames[currentMonth]} ${currentYear}`;
        
        // Calculer les jours du mois
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        let calendarHtml = `
            <table class="w-full table-fixed border-collapse">
                <thead>
                    <tr>
                        ${dayNames.map(day => `<th class="p-2 text-sm font-medium text-gray-700 border border-gray-200 bg-gray-50 w-1/7" style="width: 14.28%;">${day}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
        `;
        
        let currentWeekDate = new Date(startDate);
        
        for (let week = 0; week < 6; week++) {
            calendarHtml += '<tr>';
            
            for (let day = 0; day < 7; day++) {
                const isCurrentMonth = currentWeekDate.getMonth() === currentMonth;
                const isToday = this.isToday(currentWeekDate);
                
                const dayPayments = isCurrentMonth ? 
                    this.getPaymentsForDate(currentWeekDate) : [];
                
                calendarHtml += `
                    <td class="p-1 border border-gray-200 align-top ${isCurrentMonth ? '' : 'bg-gray-50'} w-1/7" style="height: 90px; width: 14.28%;">
                        <div class="text-sm ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'} ${isToday ? 'font-bold bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center mx-auto' : ''}">
                            ${currentWeekDate.getDate()}
                        </div>
                        <div class="mt-1 space-y-1 overflow-hidden">
                            ${dayPayments.slice(0, 2).map(payment => this.renderPaymentBlock(payment)).join('')}
                            ${dayPayments.length > 2 ? `<div class="text-xs text-gray-500 text-center">+${dayPayments.length - 2}</div>` : ''}
                        </div>
                    </td>
                `;
                
                currentWeekDate.setDate(currentWeekDate.getDate() + 1);
            }
            
            calendarHtml += '</tr>';
            
            // Arrêter si on a dépassé le mois et qu'on a au moins 4 semaines
            if (week >= 3 && currentWeekDate.getMonth() !== currentMonth) {
                break;
            }
        }
        
        calendarHtml += '</tbody></table>';
        
        document.getElementById('calendar-container').innerHTML = calendarHtml;
    }

    getPeriodicityColor(periodicity) {
        const colors = {
            'mensuel': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
            'trimestriel': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
            'semestriel': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
            'annuel': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' }
        };
        return colors[periodicity] || colors['mensuel'];
    }

    renderPaymentBlock(payment) {
        if (payment.type === 'cancellation') {
            return `
                <div class="text-xs bg-red-100 text-red-800 p-1 rounded truncate border border-red-200" 
                     title="⚠️ ${payment.software} - ${payment.message}">
                    <div class="font-medium truncate flex items-center">
                        <span class="text-red-500 mr-1">⚠️</span>
                        ${payment.software}
                    </div>
                    <div class="text-xs opacity-75">${payment.message}</div>
                </div>
            `;
        }
        
        const colors = this.getPeriodicityColor(payment.periodicity);
        return `
            <div class="text-xs ${colors.bg} ${colors.text} p-1 rounded truncate border ${colors.border}" 
                 title="${payment.software} - ${payment.amount.toFixed(2)}€ (${payment.periodicity})">
                <div class="font-medium truncate">${payment.software}</div>
                <div class="text-xs opacity-75">${payment.amount.toFixed(2)}€</div>
            </div>
        `;
    }

    getCancellationAlertsForDate(date) {
        const alerts = [];
        
        this.software.forEach(software => {
            if (!software.engagement || !software.date_limite_annulation) return;
            
            const cancellationDate = new Date(software.date_limite_annulation);
            if (cancellationDate.getDate() === date.getDate() && 
                cancellationDate.getMonth() === date.getMonth() && 
                cancellationDate.getFullYear() === date.getFullYear()) {
                
                alerts.push({
                    type: 'cancellation',
                    software: software.nom,
                    date: cancellationDate,
                    message: 'Limite résiliation'
                });
            }
        });
        
        return alerts;
    }

    getPaymentsForDate(date) {
        const payments = [];
        
        this.software.forEach(software => {
            // Ne traiter que les logiciels avec des coûts > 0
            if (!software.cout_mensuel || software.cout_mensuel <= 0) return;
            
            const dayPayments = this.getPaymentsInMonth(software, date.getMonth(), date.getFullYear());
            dayPayments.forEach(payment => {
                if (payment.date.getDate() === date.getDate() && payment.amount > 0) {
                    payments.push(payment);
                }
            });
        });
        
        // Ajouter les alertes de résiliation
        const cancellationAlerts = this.getCancellationAlertsForDate(date);
        cancellationAlerts.forEach(alert => payments.push(alert));
        
        return payments;
    }

    isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() && 
               date.getMonth() === today.getMonth() && 
               date.getFullYear() === today.getFullYear();
    }
}

// Global instance
let scheduleManager;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    scheduleManager = new ScheduleManager();
    window.scheduleManager = scheduleManager;
});