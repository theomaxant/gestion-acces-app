/**
 * MIGRATION DES LOGS - Script temporaire
 * Remplace les console.log par le nouveau système de logger
 */

// Ce script sera inclus temporairement pour migrer les logs
document.addEventListener('DOMContentLoaded', () => {
    // Sauvegarder les méthodes console originales
    const originalConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error
    };
    
    // Mode production : filtrer les logs automatiquement
    if (!window.AppLogger.config.isDevelopment) {
        // Intercepter console.log et filtrer
        console.log = function(...args) {
            const message = args.join(' ');
            
            // Garder seulement les logs critiques
            if (message.includes('❌') || 
                message.includes('⚠️') || 
                message.includes('🎉') ||
                message.includes('[ERROR]') ||
                message.includes('[CRITICAL]') ||
                message.includes('Prêt à utiliser') ||
                message.includes('COMMANDES LOGGER')) {
                originalConsole.log(...args);
            }
            // Ignorer tous les autres logs détaillés
        };
        
        console.info = console.log; // Rediriger info vers log filtré
    }
    
    console.log('🔧 [LOGGER] Migration appliquée - Logs optimisés pour la production');
});