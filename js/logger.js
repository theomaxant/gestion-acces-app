/**
 * Système de logging pour tracer toutes les modifications
 */

class Logger {
    constructor() {
        this.tableName = 'logs';
        this.maxRetries = 3;
    }
    
    /**
     * Enregistrer une action dans les logs
     * @param {string} action - Type d'action (CREATE, UPDATE, DELETE, ARCHIVE, LOGIN, LOGOUT)
     * @param {string} tableName - Nom de la table concernée
     * @param {string} recordId - ID de l'enregistrement
     * @param {Object} oldValues - Anciennes valeurs
     * @param {Object} newValues - Nouvelles valeurs
     * @param {string} details - Détails supplémentaires
     */
    async log(action, tableName = '', recordId = '', oldValues = null, newValues = null, details = '') {
        try {
            // Extraire les informations sur l'utilisateur et le logiciel depuis les données
            const contextInfo = this.extractContextInfo(tableName, oldValues, newValues);
            
            const logEntry = {
                action: action,
                table_name: tableName,
                record_id: recordId,
                old_values: oldValues ? JSON.stringify(oldValues) : null,
                new_values: newValues ? JSON.stringify(newValues) : null,
                user_info: this.getUserInfo(),
                timestamp: new Date().toISOString(),
                details: this.enrichDetails(details, contextInfo)
            };
            
            await this.saveLog(logEntry);
            console.log(`📝 Log enregistré: ${action} sur ${tableName}${recordId ? ` (${recordId})` : ''}`);
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'enregistrement du log:', error);
        }
    }
    
    /**
     * Sauvegarder le log dans la base de données
     */
    async saveLog(logEntry, retryCount = 0) {
        try {
            const response = await fetch(`tables/${this.tableName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(logEntry)
            });
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            return await response.json();
            
        } catch (error) {
            if (retryCount < this.maxRetries) {
                console.warn(`⚠️ Tentative ${retryCount + 1}/${this.maxRetries} échouée, nouvelle tentative...`);
                await this.delay(1000 * (retryCount + 1)); // Délai progressif
                return this.saveLog(logEntry, retryCount + 1);
            }
            throw error;
        }
    }
    
    /**
     * Obtenir les informations de l'utilisateur actuel
     */
    getUserInfo() {
        const sessionInfo = window.auth?.getSessionInfo();
        const currentUser = window.auth?.getCurrentUser();
        const userAgent = navigator.userAgent;
        const timestamp = new Date().toLocaleString('fr-FR');
        
        return JSON.stringify({
            sessionActive: sessionInfo?.connected || false,
            loginTime: sessionInfo?.loginTime || 'Inconnue',
            identifiedUser: currentUser || 'Utilisateur non identifié',
            userAgent: userAgent,
            timestamp: timestamp,
            ip: 'Client-side', // Pas accessible côté client
            language: navigator.language
        });
    }
    
    /**
     * Récupérer les logs avec pagination et filtres
     */
    async getLogs(page = 1, limit = 50, filters = {}) {
        try {
            let url = `tables/${this.tableName}?page=${page}&limit=${limit}&sort=timestamp&order=desc`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            const result = await response.json();
            
            // Filtrer côté client (car l'API ne supporte pas tous nos filtres personnalisés)
            if (Object.keys(filters).some(key => filters[key])) {
                result.data = this.filterLogs(result.data, filters);
                result.total = result.data.length;
            }
            
            return result;
            
        } catch (error) {
            console.error('❌ Erreur lors de la récupération des logs:', error);
            return { data: [], total: 0 };
        }
    }
    
    /**
     * Filtrer les logs côté client
     */
    filterLogs(logs, filters) {
        return logs.filter(log => {
            // Filtre par action
            if (filters.action && log.action !== filters.action) {
                return false;
            }
            
            // Filtre par table
            if (filters.table && log.table_name !== filters.table) {
                return false;
            }
            
            // Filtre par période
            if (filters.period) {
                const logDate = new Date(log.timestamp);
                const now = new Date();
                
                switch (filters.period) {
                    case 'today':
                        if (logDate.toDateString() !== now.toDateString()) {
                            return false;
                        }
                        break;
                    case 'week':
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        if (logDate < weekAgo) {
                            return false;
                        }
                        break;
                    case 'month':
                        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                        if (logDate < monthAgo) {
                            return false;
                        }
                        break;
                }
            }
            
            // Filtre par utilisateur (nom ou ID)
            if (filters.user && log.details) {
                const userFilter = filters.user.toLowerCase();
                const detailsLower = log.details.toLowerCase();
                
                // Chercher soit dans les détails, soit dans les informations utilisateur
                let userInfo = '';
                try {
                    const parsedUserInfo = JSON.parse(log.user_info);
                    userInfo = (parsedUserInfo.identifiedUser || '').toLowerCase();
                } catch (e) {
                    // Ignorer les erreurs de parsing
                }
                
                if (!detailsLower.includes(userFilter) && 
                    !detailsLower.includes(`user_id:${filters.user}`) &&
                    !userInfo.includes(userFilter)) {
                    return false;
                }
            }
            
            // Filtre par logiciel
            if (filters.software && log.details) {
                if (!log.details.includes(`software_id:${filters.software}`)) {
                    return false;
                }
            }
            
            return true;
        });
    }
    
    /**
     * Nettoyer les anciens logs (garder seulement les N derniers jours)
     */
    async cleanOldLogs(daysToKeep = 30) {
        try {
            const logs = await this.getLogs(1, 1000); // Récupérer tous les logs
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
            
            let deletedCount = 0;
            
            for (const log of logs.data) {
                const logDate = new Date(log.timestamp);
                if (logDate < cutoffDate) {
                    await fetch(`tables/${this.tableName}/${log.id}`, {
                        method: 'DELETE'
                    });
                    deletedCount++;
                }
            }
            
            console.log(`🗑️ ${deletedCount} anciens logs supprimés`);
            return deletedCount;
            
        } catch (error) {
            console.error('❌ Erreur lors du nettoyage des logs:', error);
            return 0;
        }
    }
    
    /**
     * Méthodes de logging spécialisées
     */
    
    // Connexion/Déconnexion
    async logLogin() {
        const currentUser = window.auth?.getCurrentUser() || 'Utilisateur non identifié';
        await this.log('LOGIN', '', '', null, null, `Connexion utilisateur: ${currentUser}`);
    }
    
    async logLogout() {
        const currentUser = window.auth?.getCurrentUser() || 'Utilisateur non identifié';
        await this.log('LOGOUT', '', '', null, null, `Déconnexion utilisateur: ${currentUser}`);
    }
    
    // Opérations CRUD
    async logCreate(tableName, recordId, newValues, details = '') {
        await this.log('CREATE', tableName, recordId, null, newValues, details);
    }
    
    async logUpdate(tableName, recordId, oldValues, newValues, details = '') {
        await this.log('UPDATE', tableName, recordId, oldValues, newValues, details);
    }
    
    async logDelete(tableName, recordId, oldValues, details = '') {
        await this.log('DELETE', tableName, recordId, oldValues, null, details);
    }
    
    async logArchive(tableName, recordId, oldValues, details = '') {
        await this.log('ARCHIVE', tableName, recordId, oldValues, null, details);
    }
    
    /**
     * Extraire les informations contextuelles depuis les données
     */
    extractContextInfo(tableName, oldValues, newValues) {
        const context = {
            userId: null,
            userName: null,
            softwareId: null,
            softwareName: null
        };
        
        const data = newValues || oldValues;
        if (!data) return context;
        
        // Extraire selon le type de table
        switch (tableName) {
            case 'utilisateurs':
                context.userId = data.id;
                context.userName = `${data.prenom || ''} ${data.nom || ''}`.trim();
                break;
                
            case 'logiciels':
                context.softwareId = data.id;
                context.softwareName = data.nom;
                break;
                
            case 'acces':
                context.userId = data.utilisateur_id;
                context.softwareId = data.logiciel_id;
                break;
                
            default:
                // Pour les autres tables, chercher les champs communs
                if (data.utilisateur_id) context.userId = data.utilisateur_id;
                if (data.logiciel_id) context.softwareId = data.logiciel_id;
                break;
        }
        
        return context;
    }
    
    /**
     * Enrichir les détails avec les informations contextuelles
     */
    enrichDetails(originalDetails, contextInfo) {
        let enrichedDetails = originalDetails;
        
        // Ajouter l'utilisateur authentifié qui effectue l'action
        const currentUser = window.auth?.getCurrentUser();
        if (currentUser && currentUser !== 'Utilisateur non identifié') {
            enrichedDetails += ` | Action effectuée par: ${currentUser}`;
        }
        
        if (contextInfo.userName) {
            enrichedDetails += ` | Utilisateur concerné: ${contextInfo.userName}`;
        }
        
        if (contextInfo.softwareName) {
            enrichedDetails += ` | Logiciel: ${contextInfo.softwareName}`;
        }
        
        // Ajouter les IDs pour le filtrage
        const contextIds = [];
        if (contextInfo.userId) contextIds.push(`user_id:${contextInfo.userId}`);
        if (contextInfo.softwareId) contextIds.push(`software_id:${contextInfo.softwareId}`);
        
        if (contextIds.length > 0) {
            enrichedDetails += ` | Context: ${contextIds.join(', ')}`;
        }
        
        return enrichedDetails;
    }

    /**
     * Utilitaires
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Formater un log pour l'affichage
     */
    formatLogForDisplay(log) {
        const date = new Date(log.timestamp).toLocaleString('fr-FR');
        const action = this.getActionLabel(log.action);
        const table = log.table_name || 'Système';
        
        return {
            id: log.id,
            date: date,
            action: action,
            table: table,
            recordId: log.record_id,
            details: log.details,
            oldValues: log.old_values ? JSON.parse(log.old_values) : null,
            newValues: log.new_values ? JSON.parse(log.new_values) : null,
            userInfo: log.user_info ? JSON.parse(log.user_info) : null
        };
    }
    
    /**
     * Obtenir le libellé d'une action
     */
    getActionLabel(action) {
        const labels = {
            'CREATE': '➕ Création',
            'UPDATE': '✏️ Modification',
            'DELETE': '🗑️ Suppression',
            'ARCHIVE': '📦 Archivage',
            'LOGIN': '🔑 Connexion',
            'LOGOUT': '👋 Déconnexion'
        };
        return labels[action] || action;
    }
    
    /**
     * Obtenir la couleur d'une action pour l'affichage
     */
    getActionColor(action) {
        const colors = {
            'CREATE': 'text-green-600 bg-green-50',
            'UPDATE': 'text-blue-600 bg-blue-50',
            'DELETE': 'text-red-600 bg-red-50',
            'ARCHIVE': 'text-orange-600 bg-orange-50',
            'LOGIN': 'text-purple-600 bg-purple-50',
            'LOGOUT': 'text-gray-600 bg-gray-50'
        };
        return colors[action] || 'text-gray-600 bg-gray-50';
    }
}

// Initialiser le logger
window.logger = new Logger();

// Hook pour intercepter les modifications dans l'application existante
class LoggerHooks {
    static init() {
        // Intercepter les appels à l'API REST pour enregistrer automatiquement
        LoggerHooks.interceptFetch();
        console.log('🪝 Hooks de logging initialisés');
    }
    
    static interceptFetch() {
        const originalFetch = window.fetch;
        
        window.fetch = async function(...args) {
            const [url, options] = args;
            const response = await originalFetch.apply(this, arguments);
            
            // Analyser la requête pour extraire les informations de logging
            if (url.includes('tables/') && options && options.method) {
                LoggerHooks.handleApiCall(url, options, response.clone());
            }
            
            return response;
        };
    }
    
    static async handleApiCall(url, options, response) {
        try {
            const method = options.method.toUpperCase();
            const urlParts = url.split('/');
            const tableName = urlParts[urlParts.indexOf('tables') + 1];
            const recordId = urlParts[urlParts.indexOf('tables') + 2] || '';
            
            // Ignorer les logs eux-mêmes pour éviter la récursion
            if (tableName === 'logs') return;
            
            let action;
            switch (method) {
                case 'POST':
                    action = 'CREATE';
                    break;
                case 'PUT':
                case 'PATCH':
                    action = 'UPDATE';
                    break;
                case 'DELETE':
                    action = 'DELETE';
                    break;
                default:
                    return; // Ignorer GET et autres
            }
            
            // Extraire les données de la requête
            let newValues = null;
            if (options.body) {
                try {
                    newValues = JSON.parse(options.body);
                } catch (e) {
                    // Ignorer si ce n'est pas du JSON
                }
            }
            
            // Enregistrer le log
            await window.logger.log(
                action,
                tableName,
                recordId,
                null, // oldValues - difficile à obtenir côté client
                newValues,
                `Action automatique via API`
            );
            
        } catch (error) {
            console.warn('⚠️ Erreur lors du logging automatique:', error);
        }
    }
}

// Initialiser les hooks au chargement
document.addEventListener('DOMContentLoaded', () => {
    LoggerHooks.init();
    console.log('📝 Système de logging initialisé');
});