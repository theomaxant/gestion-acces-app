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
        // Intercepter console.log et filtrer AGRESSIVEMENT
        console.log = function(...args) {
            const message = args.join(' ');
            
            // BLOCAGE TOTAL des logs Supabase
            if (message.includes('[SUPABASE]') || 
                message.includes('GET https://') ||
                message.includes('enregistrements récupérés') ||
                message.includes('API chargée') ||
                message.includes('Chargement') ||
                message.includes('[LOAD]') ||
                message.includes('[UI]') ||
                message.includes('[SUCCESS]') ||
                message.includes('Utilisateurs disponibles') ||
                message.includes('utilisateurs charges') ||
                message.includes('Liaison des événements') ||
                message.includes('Bouton') ||
                message.includes('configuré') ||
                message.includes('États du menu') ||
                message.includes('Contenu affiché') ||
                message.includes('Gestionnaire') ||
                message.includes('initialisé') ||
                message.includes('ReportsManager') ||
                message.includes('Chargement du graphique')) {
                return; // IGNORE COMPLÈTEMENT
            }
            
            // Garder SEULEMENT les logs critiques
            if (message.includes('❌') || 
                message.includes('⚠️') || 
                message.includes('🎉 [SUPABASE] Prêt à utiliser') ||
                message.includes('[ERROR]') ||
                message.includes('[CRITICAL]') ||
                message.includes('COMMANDES LOGGER') ||
                message.includes('Mode PRODUCTION activé')) {
                originalConsole.log(...args);
            }
        };
        
        console.info = console.log; // Rediriger info vers log filtré
        
        // Message de confirmation
        setTimeout(() => {
            originalConsole.log('🔇 [LOGGER] Filtrage agressif activé - Console silencieuse en production');
        }, 1000);
    }
    
    console.log('🔧 [LOGGER] Migration appliquée - Logs optimisés pour la production');
});