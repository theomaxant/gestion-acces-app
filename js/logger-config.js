/**
 * CONFIGURATION DES LOGS - PRODUCTION READY
 * Système de logs intelligent avec niveaux configurables
 */

class AppLogger {
    constructor() {
        // 🔧 CONFIGURATION GLOBALE
        this.config = {
            // Niveau global (ERROR = minimal, DEBUG = tout)
            level: 'INFO', // ERROR | WARN | INFO | DEBUG
            
            // Logs par module (true = activé)
            modules: {
                supabase: false,     // Requêtes API Supabase  
                reports: false,      // Génération des rapports
                auth: false,         // Authentification
                ui: false,           // Interface utilisateur
                software: false,     // Gestion logiciels
                users: false,        // Gestion utilisateurs
                menu: false,         // Navigation menu
                charts: false,       // Graphiques Chart.js
                export: false,       // Exports Excel
                access: false,       // Gestion des accès
                teams: false,        // Gestion équipes
                costs: false         // Calculs de coûts
            },
            
            // Performance monitoring
            performance: true,       // Temps de chargement
            apiCalls: false,        // Compteur requêtes API
            errors: true,           // Toujours afficher les erreurs
            
            // Mode développement (true = plus de logs)
            isDevelopment: false
        };
        
        // Niveaux de priorité
        this.levels = {
            ERROR: 0,
            WARN: 1, 
            INFO: 2,
            DEBUG: 3
        };
        
        this.currentLevel = this.levels[this.config.level];
        this.apiCallCount = 0;
        
        // Initialisation
        this.init();
    }
    
    init() {
        // Détecter l'environnement
        const isLocalhost = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1' ||
                          window.location.hostname.includes('github.io');
                          
        if (isLocalhost && this.config.isDevelopment) {
            this.activateDevelopmentMode();
        } else {
            this.activateProductionMode();
        }
        
        console.log('🔧 [LOGGER] Configuration:', {
            niveau: this.config.level,
            production: !this.config.isDevelopment,
            modules_actifs: Object.entries(this.config.modules)
                .filter(([k, v]) => v)
                .map(([k, v]) => k)
        });
    }
    
    activateProductionMode() {
        this.config.level = 'WARN';
        this.config.isDevelopment = false;
        this.currentLevel = this.levels.WARN;
        
        // Désactiver tous les logs de debug
        Object.keys(this.config.modules).forEach(module => {
            this.config.modules[module] = false;
        });
        
        this.config.performance = false;
        this.config.apiCalls = false;
        
        console.log('🏭 [LOGGER] Mode PRODUCTION activé - Logs minimaux');
    }
    
    activateDevelopmentMode() {
        this.config.level = 'DEBUG';
        this.config.isDevelopment = true;
        this.currentLevel = this.levels.DEBUG;
        
        // Activer les logs essentiels en dev
        this.config.modules.supabase = true;
        this.config.modules.reports = true;
        this.config.modules.auth = true;
        
        console.log('🛠️ [LOGGER] Mode DÉVELOPPEMENT activé - Logs détaillés');
    }
    
    // Méthodes de logging
    error(module, message, data = null) {
        if (this.shouldLog('ERROR', module)) {
            console.error(`❌ [${module.toUpperCase()}]`, message, data || '');
        }
    }
    
    warn(module, message, data = null) {
        if (this.shouldLog('WARN', module)) {
            console.warn(`⚠️ [${module.toUpperCase()}]`, message, data || '');
        }
    }
    
    info(module, message, data = null) {
        if (this.shouldLog('INFO', module)) {
            console.log(`ℹ️ [${module.toUpperCase()}]`, message, data || '');
        }
    }
    
    debug(module, message, data = null) {
        if (this.shouldLog('DEBUG', module)) {
            console.log(`🐛 [${module.toUpperCase()}]`, message, data || '');
        }
    }
    
    // Logs spécialisés
    api(method, url, status = null) {
        this.apiCallCount++;
        
        if (this.config.apiCalls) {
            const statusIcon = status >= 200 && status < 300 ? '✅' : '❌';
            console.log(`${statusIcon} [API] ${method} ${this.truncateUrl(url)}`);
        }
        
        // Alerte performance si trop de requêtes
        if (this.apiCallCount > 100 && this.apiCallCount % 50 === 0) {
            this.warn('PERFORMANCE', `${this.apiCallCount} requêtes API effectuées`);
        }
    }
    
    performance(label, timeMs) {
        if (this.config.performance) {
            const icon = timeMs > 5000 ? '🐌' : timeMs > 2000 ? '⏱️' : '⚡';
            console.log(`${icon} [PERF] ${label}: ${timeMs}ms`);
        }
    }
    
    success(module, message, data = null) {
        if (this.shouldLog('INFO', module)) {
            console.log(`✅ [${module.toUpperCase()}]`, message, data || '');
        }
    }
    
    // Utilitaires
    shouldLog(level, module) {
        const levelOk = this.levels[level] <= this.currentLevel;
        const moduleOk = this.config.modules[module] !== false;
        
        // Toujours logger les erreurs
        if (level === 'ERROR' && this.config.errors) return true;
        
        return levelOk && moduleOk;
    }
    
    truncateUrl(url) {
        if (url.length > 60) {
            return url.substring(0, 40) + '...' + url.substring(url.length - 17);
        }
        return url;
    }
    
    // Configuration dynamique
    setLevel(level) {
        this.config.level = level;
        this.currentLevel = this.levels[level];
        console.log(`🔧 [LOGGER] Niveau changé: ${level}`);
    }
    
    enableModule(module) {
        this.config.modules[module] = true;
        console.log(`🔧 [LOGGER] Module ${module} activé`);
    }
    
    disableModule(module) {
        this.config.modules[module] = false;
        console.log(`🔧 [LOGGER] Module ${module} désactivé`);
    }
    
    getStats() {
        return {
            niveau: this.config.level,
            requetes_api: this.apiCallCount,
            modules_actifs: Object.entries(this.config.modules)
                .filter(([k, v]) => v).length,
            mode: this.config.isDevelopment ? 'Développement' : 'Production'
        };
    }
}

// Instance globale
window.AppLogger = new AppLogger();

// Raccourcis globaux pour faciliter l'usage
window.log = {
    error: (module, msg, data) => window.AppLogger.error(module, msg, data),
    warn: (module, msg, data) => window.AppLogger.warn(module, msg, data), 
    info: (module, msg, data) => window.AppLogger.info(module, msg, data),
    debug: (module, msg, data) => window.AppLogger.debug(module, msg, data),
    api: (method, url, status) => window.AppLogger.api(method, url, status),
    success: (module, msg, data) => window.AppLogger.success(module, msg, data),
    perf: (label, timeMs) => window.AppLogger.performance(label, timeMs)
};

// Commandes console utiles
console.log(`
🔧 COMMANDES LOGGER DISPONIBLES:
  AppLogger.setLevel('ERROR')     - Logs minimaux
  AppLogger.setLevel('WARN')      - Warnings seulement  
  AppLogger.setLevel('INFO')      - Logs standards
  AppLogger.setLevel('DEBUG')     - Logs détaillés
  
  AppLogger.enableModule('supabase')  - Activer module
  AppLogger.disableModule('reports')  - Désactiver module
  AppLogger.getStats()                - Statistiques
`);