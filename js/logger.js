/**
 * Système de logging pour tracer toutes les modifications
 */

class Logger {
    constructor() {
        this.tableName = 'logs';
        this.maxRetries = 3;
        this.supportedColumns = null; // Cache pour les colonnes supportées
        this.fallbackMode = false; // Mode dégradé
    }
    
    /**
     * Enregistrer une action dans les logs
     * @param {string} action - Type d'action (CREATE, UPDATE, DELETE, ARCHIVE, LOGIN, LOGOUT)
     * @param {string} tableName - Nom de la table concernée
     * @param {string} recordId - ID de l'enregistrement
     * @param {Object} oldValues - Anciennes valeurs
     * @param {Object} newValues - Nouvelles valeurs
     * @param {string} details - Détails supplémentaires (optionnel)
     */
    async log(action, tableName = '', recordId = '', oldValues = null, newValues = null, details = '') {
        try {
            // Extraire les informations sur l'utilisateur et le logiciel depuis les données
            const contextInfo = this.extractContextInfo(tableName, oldValues, newValues);
            
            // Créer un message simple et clair
            const simpleMessage = this.createSimpleMessage(action, tableName, contextInfo, oldValues, newValues, details);
            
            // Construire l'entrée de log de base
            const logEntry = {
                action: action,
                table_name: tableName,
                record_id: recordId,
                user_info: this.getUserInfo(),
                timestamp: new Date().toISOString(),
                details: this.enrichDetails(simpleMessage, contextInfo)
            };
            
            // Ajouter old_values et new_values seulement si les colonnes existent
            // (pour éviter l'erreur PGRST204)
            try {
                if (oldValues) {
                    logEntry.old_values = JSON.stringify(oldValues);
                }
                if (newValues) {
                    logEntry.new_values = JSON.stringify(newValues);
                }
            } catch (e) {
                // Si erreur de sérialisation, l'ignorer silencieusement
                console.warn('⚠️ Erreur de sérialisation des valeurs pour le log');
            }
            
            await this.saveLog(logEntry);
            console.log(`📝 ${simpleMessage}`);
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'enregistrement du log:', error);
        }
    }
    
    /**
     * Sauvegarder le log dans la base de données
     */
    async saveLog(logEntry, retryCount = 0) {
        try {
            // Tentative de sauvegarde normale
            const result = await window.D1API.create(this.tableName, logEntry);
            
            if (!result.success) {
                throw new Error(`Erreur API: ${result.error}`);
            }
            
            console.log('✅ Log sauvegardé avec succès (mode complet)');
            return result.data;
            
        } catch (error) {
            console.warn(`⚠️ Erreur lors de la sauvegarde du log:`, error.message);
            
            // Gestion spécifique pour l'erreur PGRST204 (colonne non trouvée)
            if (error.message && (error.message.includes('PGRST204') || error.message.includes('column') || error.message.includes('schema cache'))) {
                console.warn('🔧 Passage en mode dégradé progressif...');
                
                // Étape 1: Mode réduit (sans old_values et new_values)
                try {
                    const reducedLogEntry = {
                        action: logEntry.action || 'UNKNOWN',
                        table_name: logEntry.table_name,
                        record_id: logEntry.record_id,
                        details: this.createCompactDetails(logEntry),
                        timestamp: logEntry.timestamp
                    };
                    
                    const result = await window.D1API.create(this.tableName, reducedLogEntry);
                    if (result.success) {
                        console.log('✅ Log sauvegardé en mode réduit (sans old/new values)');
                        return result.data;
                    }
                } catch (reducedError) {
                    console.warn('⚠️ Mode réduit échoué, tentative ultra-minimal...');
                }
                
                // Étape 2: Mode ultra-minimal (seulement action et details)
                try {
                    const minimalLogEntry = {
                        action: logEntry.action || 'UNKNOWN',
                        details: this.createCompactDetails(logEntry)
                    };
                    
                    const result = await window.D1API.create(this.tableName, minimalLogEntry);
                    if (result.success) {
                        console.log('✅ Log sauvegardé en mode ultra-minimal');
                        return result.data;
                    }
                } catch (minimalError) {
                    console.warn('⚠️ Mode ultra-minimal échoué, basculement vers console uniquement');
                }
                
                // Étape 3: Fallback console uniquement
                console.log(`📝 LOG CONSOLE FALLBACK: ${logEntry.action} | ${this.createCompactDetails(logEntry)}`);
                return { 
                    id: 'console-fallback-' + Date.now(), 
                    mode: 'console-fallback',
                    timestamp: new Date().toISOString()
                };
            }
            
            // Gestion des autres erreurs avec retry
            if (retryCount < this.maxRetries) {
                console.warn(`⚠️ Tentative ${retryCount + 1}/${this.maxRetries} échouée, nouvelle tentative dans ${(retryCount + 1)} secondes...`);
                await this.delay(1000 * (retryCount + 1)); // Délai progressif
                return this.saveLog(logEntry, retryCount + 1);
            }
            
            // Après tous les retries, fallback console
            console.error('❌ Échec définitif de la sauvegarde, fallback console:', error);
            console.log(`📝 LOG CONSOLE ERROR: ${logEntry.action} | ${this.createCompactDetails(logEntry)} | ERROR: ${error.message}`);
            return { 
                id: 'console-error-' + Date.now(), 
                mode: 'console-error',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
    
    /**
     * Obtenir les informations de l'utilisateur actuel
     */
    getUserInfo() {
        const sessionInfo = window.auth?.getSessionInfo();
        
        // Priorité au sélecteur d'utilisateur si disponible
        let currentUser = 'Utilisateur non identifié';
        let userDetails = null;
        
        if (window.userSelector) {
            currentUser = window.userSelector.getCurrentUser();
            userDetails = window.userSelector.getCurrentUserData();
        } else if (window.auth) {
            currentUser = window.auth.getCurrentUser();
        } else {
            currentUser = localStorage.getItem('current_user') || 'Utilisateur Direct';
        }
        
        const userAgent = navigator.userAgent;
        const timestamp = new Date().toLocaleString('fr-FR');
        
        return JSON.stringify({
            sessionActive: sessionInfo?.connected || false,
            loginTime: sessionInfo?.loginTime || 'Inconnue',
            identifiedUser: currentUser,
            userDetails: userDetails ? {
                nom: userDetails.nom,
                prenom: userDetails.prenom,
                poste: userDetails.poste,
                equipe: userDetails.equipe,
                userId: userDetails.id
            } : null,
            userAgent: userAgent,
            timestamp: timestamp,
            ip: 'Client-side', // Pas accessible côté client
            language: navigator.language,
            source: window.userSelector ? 'user-selector' : 'auth-system'
        });
    }
    
    /**
     * Récupérer les logs avec pagination et filtres
     */
    async getLogs(page = 1, limit = 50, filters = {}) {
        try {
            const result = await window.D1API.get(this.tableName, null, {
                limit: limit,
                offset: (page - 1) * limit,
                sort: 'timestamp'
            });
            
            if (!result.success) {
                throw new Error(`Erreur: ${result.error}`);
            }
            
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
     * Créer des détails compacts pour le mode dégradé
     */
    createCompactDetails(logEntry) {
        const parts = [];
        
        if (logEntry.details) parts.push(logEntry.details);
        if (logEntry.table_name) parts.push(`Table: ${logEntry.table_name}`);
        if (logEntry.record_id) parts.push(`ID: ${logEntry.record_id}`);
        if (logEntry.timestamp) parts.push(`Time: ${logEntry.timestamp}`);
        
        // Ajouter info utilisateur de manière compacte
        if (logEntry.user_info) {
            try {
                const userInfo = typeof logEntry.user_info === 'string' ? JSON.parse(logEntry.user_info) : logEntry.user_info;
                if (userInfo.identifiedUser) {
                    parts.push(`User: ${userInfo.identifiedUser}`);
                }
            } catch (e) {
                parts.push('User: parsing error');
            }
        }
        
        // Ajouter les valeurs si présentes
        if (logEntry.old_values) parts.push('Has old_values');
        if (logEntry.new_values) parts.push('Has new_values');
        
        return parts.join(' | ');
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
                    await window.D1API.delete(this.tableName, log.id);
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
    async logLogin(customMessage = '') {
        const currentUser = window.auth?.getCurrentUser() || 'Un utilisateur';
        const message = customMessage || `${currentUser} s'est connecté à l'application`;
        await this.log('LOGIN', 'système', '', null, null, message);
    }
    
    async logLogout(customMessage = '') {
        const currentUser = window.auth?.getCurrentUser() || 'Un utilisateur';
        const message = customMessage || `${currentUser} s'est déconnecté de l'application`;
        await this.log('LOGOUT', 'système', '', null, null, message);
    }
    
    // Actions système courantes
    async logSystemAction(action, message) {
        await this.log(action, 'système', '', null, null, message);
    }
    
    async logLoginAttempt(username, success = false) {
        const status = success ? 'réussie' : 'échouée';
        const message = `Tentative de connexion ${status} pour ${username}`;
        await this.log('LOGIN_ATTEMPT', 'système', '', null, null, message);
    }
    
    async logPasswordReset(username) {
        const message = `Demande de réinitialisation de mot de passe pour ${username}`;
        await this.log('PASSWORD_RESET', 'système', '', null, null, message);
    }
    
    async logSessionExpired(username) {
        const message = `Session expirée pour ${username}`;
        await this.log('SESSION_EXPIRED', 'système', '', null, null, message);
    }
    
    async logDataExport(exportType, userName) {
        const currentUser = userName || window.auth?.getCurrentUser() || 'Un utilisateur';
        const message = `${currentUser} a exporté des données (${exportType})`;
        await this.log('EXPORT', 'système', '', null, null, message);
    }
    
    async logDataImport(importType, recordCount, userName) {
        const currentUser = userName || window.auth?.getCurrentUser() || 'Un utilisateur';
        const message = `${currentUser} a importé ${recordCount} enregistrements (${importType})`;
        await this.log('IMPORT', 'système', '', null, null, message);
    }
    
    async logBackup(backupType, userName) {
        const currentUser = userName || window.auth?.getCurrentUser() || 'Système';
        const message = `${currentUser} a lancé une sauvegarde (${backupType})`;
        await this.log('BACKUP', 'système', '', null, null, message);
    }
    
    async logConfigChange(configName, oldValue, newValue, userName) {
        const currentUser = userName || window.auth?.getCurrentUser() || 'Un administrateur';
        const message = `${currentUser} a modifié la configuration "${configName}" de "${oldValue}" à "${newValue}"`;
        await this.log('CONFIG_CHANGE', 'système', '', null, null, message);
    }
    
    // Opérations CRUD avec messages personnalisés optionnels
    async logCreate(tableName, recordId, newValues, customMessage = '') {
        await this.log('CREATE', tableName, recordId, null, newValues, customMessage);
    }
    
    async logUpdate(tableName, recordId, oldValues, newValues, customMessage = '') {
        await this.log('UPDATE', tableName, recordId, oldValues, newValues, customMessage);
    }
    
    async logDelete(tableName, recordId, oldValues, customMessage = '') {
        await this.log('DELETE', tableName, recordId, oldValues, null, customMessage);
    }
    
    async logArchive(tableName, recordId, oldValues, customMessage = '') {
        await this.log('ARCHIVE', tableName, recordId, oldValues, null, customMessage);
    }
    
    // Méthodes spécialisées pour les accès avec messages clairs
    async logCreateAccess(userId, userNameDisplay, softwareId, softwareNameDisplay, role, customMessage = '') {
        const roleDisplay = this.getRoleName(role);
        const message = customMessage || `Accès créé pour ${userNameDisplay} sur "${softwareNameDisplay}" en tant que ${roleDisplay}`;
        
        const accessData = {
            utilisateur_id: userId,
            logiciel_id: softwareId,
            role: role
        };
        
        await this.log('CREATE', 'acces', '', null, accessData, message);
    }
    
    async logUpdateAccess(userId, userNameDisplay, softwareId, softwareNameDisplay, oldRole, newRole, customMessage = '') {
        const oldRoleDisplay = this.getRoleName(oldRole);
        const newRoleDisplay = this.getRoleName(newRole);
        const message = customMessage || `Accès de ${userNameDisplay} pour "${softwareNameDisplay}" modifié de ${oldRoleDisplay} à ${newRoleDisplay}`;
        
        const oldData = { role: oldRole };
        const newData = { role: newRole };
        
        await this.log('UPDATE', 'acces', '', oldData, newData, message);
    }
    
    async logDeleteAccess(userId, userNameDisplay, softwareId, softwareNameDisplay, customMessage = '') {
        const message = customMessage || `Accès de ${userNameDisplay} supprimé pour "${softwareNameDisplay}"`;
        
        const accessData = {
            utilisateur_id: userId,
            logiciel_id: softwareId
        };
        
        await this.log('DELETE', 'acces', '', accessData, null, message);
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
        // Si des détails personnalisés sont déjà fournis, les utiliser
        if (originalDetails && !originalDetails.includes('Action effectuée par')) {
            return originalDetails;
        }
        
        // Sinon, créer un message automatique clair
        const currentUser = window.auth?.getCurrentUser();
        const actor = currentUser && currentUser !== 'Utilisateur non identifié' ? currentUser : 'Système';
        
        // Ajouter les IDs pour le filtrage (invisibles à l'utilisateur)
        const contextIds = [];
        if (contextInfo.userId) contextIds.push(`user_id:${contextInfo.userId}`);
        if (contextInfo.softwareId) contextIds.push(`software_id:${contextInfo.softwareId}`);
        
        const hiddenContext = contextIds.length > 0 ? ` [${contextIds.join(', ')}]` : '';
        
        return originalDetails + hiddenContext;
    }
    
    /**
     * Créer un message de log simple et clair en français
     */
    createSimpleMessage(action, tableName, contextInfo, oldValues, newValues, customDetails = '') {
        const currentUser = window.auth?.getCurrentUser();
        const actor = this.getActorName(currentUser);
        
        // Si un message personnalisé est fourni, s'assurer qu'il inclut l'acteur
        if (customDetails) {
            if (customDetails.includes(actor) || customDetails.toLowerCase().includes('système')) {
                return customDetails;
            } else {
                return `${actor} - ${customDetails}`;
            }
        }
        
        // Messages par défaut selon le type d'action et la table
        switch (tableName) {
            case 'utilisateurs':
                return this.createUserMessage(action, actor, contextInfo, oldValues, newValues);
            case 'logiciels':
                return this.createSoftwareMessage(action, actor, contextInfo, oldValues, newValues);
            case 'acces':
                return this.createAccessMessage(action, actor, contextInfo, oldValues, newValues);
            default:
                return this.createGenericMessage(action, actor, tableName, contextInfo);
        }
    }
    
    /**
     * Obtenir le nom de l'acteur de manière claire
     */
    getActorName(currentUser) {
        if (!currentUser || currentUser === 'Utilisateur non identifié') {
            return '⚙️ SYSTÈME';
        }
        
        // Si c'est juste un email, extraire le nom
        if (currentUser.includes('@')) {
            const emailPart = currentUser.split('@')[0];
            const parts = emailPart.split('.');
            if (parts.length >= 2) {
                const prenom = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
                const nom = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
                return `👤 ${prenom} ${nom}`;
            }
            return `👤 ${emailPart}`;
        }
        
        // Sinon, utiliser le nom tel quel
        return `👤 ${currentUser}`;
    }
    
    /**
     * Messages pour les actions sur les utilisateurs
     */
    createUserMessage(action, actor, contextInfo, oldValues, newValues) {
        const userName = contextInfo.userName || this.extractUserName(newValues || oldValues);
        
        switch (action) {
            case 'CREATE':
                return `${actor} a créé l'utilisateur "${userName}"`;
            case 'UPDATE':
                const changes = this.detectUserChanges(oldValues, newValues);
                return `${actor} a modifié l'utilisateur "${userName}"${changes}`;
            case 'DELETE':
                return `${actor} a supprimé l'utilisateur "${userName}"`;
            case 'ARCHIVE':
                return `${actor} a archivé l'utilisateur "${userName}"`;
            default:
                return `${actor} a effectué l'action "${action}" sur l'utilisateur "${userName}"`;
        }
    }
    
    /**
     * Messages pour les actions sur les logiciels
     */
    createSoftwareMessage(action, actor, contextInfo, oldValues, newValues) {
        const softwareName = contextInfo.softwareName || this.extractSoftwareName(newValues || oldValues);
        
        switch (action) {
            case 'CREATE':
                return `${actor} a créé le logiciel "${softwareName}"`;
            case 'UPDATE':
                const changes = this.detectSoftwareChanges(oldValues, newValues);
                return `${actor} a modifié le logiciel "${softwareName}"${changes}`;
            case 'DELETE':
                return `${actor} a supprimé le logiciel "${softwareName}"`;
            case 'ARCHIVE':
                return `${actor} a archivé le logiciel "${softwareName}"`;
            default:
                return `${actor} - action ${action} sur le logiciel "${softwareName}"`;
        }
    }
    
    /**
     * Messages pour les actions sur les accès
     */
    createAccessMessage(action, actor, contextInfo, oldValues, newValues) {
        const data = newValues || oldValues;
        const userName = this.getRelatedUserName(data?.utilisateur_id);
        const softwareName = this.getRelatedSoftwareName(data?.logiciel_id);
        
        switch (action) {
            case 'CREATE':
                const newRole = this.getRoleName(newValues?.role);
                return `${actor} a créé un accès pour "${userName}" au logiciel "${softwareName}" avec le rôle "${newRole}"`;
            case 'UPDATE':
                const oldRole = this.getRoleName(oldValues?.role);
                const updatedRole = this.getRoleName(newValues?.role);
                if (oldRole !== updatedRole) {
                    return `${actor} a modifié l'accès de "${userName}" pour "${softwareName}" : "${oldRole}" → "${updatedRole}"`;
                } else {
                    return `${actor} a modifié l'accès de "${userName}" pour "${softwareName}"`;
                }
            case 'DELETE':
                return `${actor} a supprimé l'accès de "${userName}" pour "${softwareName}"`;
            case 'ARCHIVE':
                return `${actor} a archivé l'accès de "${userName}" pour "${softwareName}"`;
            default:
                return `${actor} a effectué l'action "${action}" sur l'accès de "${userName}" pour "${softwareName}"`;
        }
    }
    
    /**
     * Messages génériques
     */
    createGenericMessage(action, actor, tableName, contextInfo) {
        // Messages spéciaux pour les actions système
        if (tableName === 'système' || tableName === '') {
            return this.createSystemMessage(action, actor);
        }
        
        const actionName = this.getActionName(action);
        const tableNameFr = this.getTableNameInFrench(tableName);
        
        switch (action) {
            case 'CREATE':
                return `${actor} a créé un élément dans ${tableNameFr}`;
            case 'UPDATE':
                return `${actor} a modifié un élément dans ${tableNameFr}`;
            case 'DELETE':
                return `${actor} a supprimé un élément de ${tableNameFr}`;
            case 'ARCHIVE':
                return `${actor} a archivé un élément de ${tableNameFr}`;
            default:
                return `${actor} a effectué une ${actionName} dans ${tableNameFr}`;
        }
    }
    
    /**
     * Messages pour les actions système
     */
    createSystemMessage(action, actor) {
        switch (action) {
            case 'LOGIN':
                return `${actor} s'est connecté à l'application`;
            case 'LOGOUT':
                return `${actor} s'est déconnecté de l'application`;
            case 'LOGIN_ATTEMPT':
                return `Tentative de connexion de ${actor}`;
            case 'PASSWORD_RESET':
                return `${actor} a demandé une réinitialisation de mot de passe`;
            case 'SESSION_EXPIRED':
                return `Session expirée pour ${actor}`;
            case 'EXPORT':
                return `${actor} a exporté des données`;
            case 'IMPORT':
                return `${actor} a importé des données`;
            case 'BACKUP':
                return `${actor} a lancé une sauvegarde`;
            case 'CONFIG_CHANGE':
                return `${actor} a modifié une configuration`;
            case 'ERROR':
                return `Erreur système rencontrée par ${actor}`;
            case 'WARNING':
                return `Avertissement système pour ${actor}`;
            default:
                return `${actor} a effectué une action système (${action})`;
        }
    }
    
    /**
     * Traduire les noms de tables en français
     */
    getTableNameInFrench(tableName) {
        const translations = {
            'utilisateurs': 'les utilisateurs',
            'logiciels': 'les logiciels',
            'acces': 'les accès',
            'logs': 'les journaux',
            'teams': 'les équipes',
            'reports': 'les rapports',
            'schedules': 'les planifications',
            'rights': 'les droits',
            'système': 'le système',
            'system': 'le système'
        };
        return translations[tableName] || `la table ${tableName}`;
    }
    
    /**
     * Utilitaires pour extraire les informations
     */
    extractUserName(userData) {
        if (!userData) return 'Utilisateur inconnu';
        const prenom = userData.prenom || '';
        const nom = userData.nom || '';
        return `${prenom} ${nom}`.trim() || userData.email || `ID: ${userData.id}` || 'Utilisateur inconnu';
    }
    
    extractSoftwareName(softwareData) {
        return softwareData?.nom || softwareData?.name || `ID: ${softwareData?.id}` || 'Logiciel inconnu';
    }
    
    getRelatedUserName(userId) {
        // Dans un vrai contexte, on pourrait faire un appel API pour récupérer le nom
        // Pour l'instant, on utilise l'ID ou essaie de le trouver dans le cache
        return `Utilisateur ${userId}`;
    }
    
    getRelatedSoftwareName(softwareId) {
        // Dans un vrai contexte, on pourrait faire un appel API pour récupérer le nom
        // Pour l'instant, on utilise l'ID ou essaie de le trouver dans le cache
        return `Logiciel ${softwareId}`;
    }
    
    getRoleName(role) {
        const roles = {
            'admin': 'administrateur',
            'user': 'utilisateur',
            'reader': 'lecteur',
            'editor': 'éditeur',
            'viewer': 'observateur'
        };
        return roles[role] || role || 'rôle non défini';
    }
    
    detectUserChanges(oldValues, newValues) {
        if (!oldValues || !newValues) return '';
        
        const changes = [];
        if (oldValues.prenom !== newValues.prenom || oldValues.nom !== newValues.nom) {
            changes.push('nom');
        }
        if (oldValues.email !== newValues.email) {
            changes.push('email');
        }
        if (oldValues.statut !== newValues.statut) {
            changes.push('statut');
        }
        
        return changes.length > 0 ? ` (${changes.join(', ')})` : '';
    }
    
    detectSoftwareChanges(oldValues, newValues) {
        if (!oldValues || !newValues) return '';
        
        const changes = [];
        if (oldValues.nom !== newValues.nom) {
            changes.push('nom');
        }
        if (oldValues.version !== newValues.version) {
            changes.push('version');
        }
        if (oldValues.statut !== newValues.statut) {
            changes.push('statut');
        }
        
        return changes.length > 0 ? ` (${changes.join(', ')})` : '';
    }
    
    getActionName(action) {
        const actions = {
            'CREATE': 'création',
            'UPDATE': 'modification', 
            'DELETE': 'suppression',
            'ARCHIVE': 'archivage',
            'LOGIN': 'connexion',
            'LOGOUT': 'déconnexion',
            'LOGIN_ATTEMPT': 'tentative de connexion',
            'PASSWORD_RESET': 'réinitialisation de mot de passe',
            'SESSION_EXPIRED': 'expiration de session',
            'EXPORT': 'export de données',
            'IMPORT': 'import de données',
            'BACKUP': 'sauvegarde',
            'CONFIG_CHANGE': 'modification de configuration',
            'ERROR': 'erreur',
            'WARNING': 'avertissement'
        };
        return actions[action] || action.toLowerCase();
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
            'LOGOUT': '👋 Déconnexion',
            'LOGIN_ATTEMPT': '🔐 Tentative connexion',
            'PASSWORD_RESET': '🔄 Réinit. mot de passe',
            'SESSION_EXPIRED': '⏰ Session expirée',
            'EXPORT': '📤 Export',
            'IMPORT': '📥 Import',
            'BACKUP': '💾 Sauvegarde',
            'CONFIG_CHANGE': '⚙️ Configuration',
            'USER_CHANGE': '👤 Changement utilisateur',
            'ERROR': '❌ Erreur',
            'WARNING': '⚠️ Avertissement'
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
            'LOGOUT': 'text-gray-600 bg-gray-50',
            'LOGIN_ATTEMPT': 'text-indigo-600 bg-indigo-50',
            'PASSWORD_RESET': 'text-yellow-600 bg-yellow-50',
            'SESSION_EXPIRED': 'text-orange-600 bg-orange-50',
            'EXPORT': 'text-cyan-600 bg-cyan-50',
            'IMPORT': 'text-teal-600 bg-teal-50',
            'BACKUP': 'text-violet-600 bg-violet-50',
            'CONFIG_CHANGE': 'text-emerald-600 bg-emerald-50',
            'USER_CHANGE': 'text-blue-600 bg-blue-50',
            'ERROR': 'text-red-700 bg-red-100',
            'WARNING': 'text-amber-600 bg-amber-50'
        };
        return colors[action] || 'text-gray-600 bg-gray-50';
    }
    
    /**
     * Méthodes utilitaires pour simplifier le logging avec utilisateurs
     */
    
    // Log de création avec utilisateur
    async logCreation(tableName, recordId, newData, details = '') {
        const currentUser = this.getCurrentUserName();
        const enhancedDetails = details || `Créé par ${currentUser}`;
        await this.log('CREATE', tableName, recordId, null, newData, enhancedDetails);
    }
    
    // Log de modification avec utilisateur
    async logUpdate(tableName, recordId, oldData, newData, details = '') {
        const currentUser = this.getCurrentUserName();
        const enhancedDetails = details || `Modifié par ${currentUser}`;
        await this.log('UPDATE', tableName, recordId, oldData, newData, enhancedDetails);
    }
    
    // Log de suppression avec utilisateur
    async logDeletion(tableName, recordId, oldData = null, details = '') {
        const currentUser = this.getCurrentUserName();
        const enhancedDetails = details || `Supprimé par ${currentUser}`;
        await this.log('DELETE', tableName, recordId, oldData, null, enhancedDetails);
    }
    
    // Log d'action générique avec utilisateur
    async logAction(action, tableName = '', recordId = '', oldData = null, newData = null, details = '') {
        const currentUser = this.getCurrentUserName();
        const enhancedDetails = details || `Action ${action} par ${currentUser}`;
        await this.log(action, tableName, recordId, oldData, newData, enhancedDetails);
    }
    
    // Obtenir le nom de l'utilisateur actuel de manière simplifiée
    getCurrentUserName() {
        if (window.userSelector) {
            return window.userSelector.getCurrentUser();
        } else if (window.auth) {
            return window.auth.getCurrentUser();
        } else {
            return localStorage.getItem('current_user') || 'Utilisateur Direct';
        }
    }
    
    // Méthode pour changer rapidement d'utilisateur et logger le changement
    async changeUser(newUser, reason = '') {
        const oldUser = this.getCurrentUserName();
        
        if (window.userSelector) {
            window.userSelector.setCurrentUser(newUser);
        } else {
            localStorage.setItem('current_user', newUser);
        }
        
        const details = `Changement d'utilisateur de "${oldUser}" vers "${newUser}"`;
        await this.logAction('USER_CHANGE', '', '', { old_user: oldUser }, { new_user: newUser }, reason || details);
    }
}

// Initialiser le logger
window.logger = new Logger();

// Ajouter des fonctions utilitaires globales pour faciliter l'utilisation
window.addEventListener('DOMContentLoaded', () => {
    // Attendre que le sélecteur d'utilisateur soit initialisé
    setTimeout(() => {
        if (window.logger) {
            // Fonctions globales pratiques pour le logging
            window.logCreation = (table, id, data, details) => window.logger.logCreation(table, id, data, details);
            window.logUpdate = (table, id, oldData, newData, details) => window.logger.logUpdate(table, id, oldData, newData, details);
            window.logDeletion = (table, id, data, details) => window.logger.logDeletion(table, id, data, details);
            window.logAction = (action, table, id, oldData, newData, details) => window.logger.logAction(action, table, id, oldData, newData, details);
            
            console.log('[LOGGER] Fonctions de logging avec utilisateur disponibles:');
            console.log('  - logCreation(table, id, data, details)');
            console.log('  - logUpdate(table, id, oldData, newData, details)');
            console.log('  - logDeletion(table, id, data, details)');
            console.log('  - logAction(action, table, id, oldData, newData, details)');
            console.log('  - logger.changeUser(newUser, reason)');
        }
    }, 600);
});

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
    // LoggerHooks.init(); // Désactivé car nous utilisons maintenant D1API directement
    console.log('📝 Système de logging initialisé (hooks fetch désactivés)');
});