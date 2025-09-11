/**
 * MODE PRODUCTION ULTRA-SILENCIEUX
 * Désactive TOUS les logs non-critiques pour une console propre
 */

// Détecter si on est en production
const isProduction = !window.location.hostname.includes('localhost') && 
                    !window.location.hostname.includes('127.0.0.1');

if (isProduction) {
    // Sauvegarder console originale
    const originalConsole = {
        log: console.log,
        info: console.info,
        warn: console.warn,
        error: console.error
    };
    
    // Liste des messages autorisés (ULTRA restrictive - SEULEMENT notre app)
    const allowedMessages = [
        // Erreurs critiques de NOTRE application uniquement
        '❌ [',           // Nos erreurs formatées
        '[ERROR]',        // Erreurs système
        '[CRITICAL]',     // Erreurs critiques
        
        // Messages de démarrage essentiels SEULEMENT
        '🎉 [SUPABASE] Prêt à utiliser',
        '🔇 [PRODUCTION]',
        '🏭 [LOGGER]',
        
        // Aucun warning - production silencieuse
    ];
    
    // Remplacer console.log avec filtrage ultra-agressif
    console.log = function(...args) {
        const message = args.join(' ');
        
        // Vérifier si le message est autorisé
        const isAllowed = allowedMessages.some(pattern => 
            message.includes(pattern)
        );
        
        if (isAllowed) {
            originalConsole.log(...args);
        }
        // Sinon : SILENCE TOTAL
    };
    
    // Rediriger info vers log filtré
    console.info = console.log;
    
    // Garder les erreurs et warnings
    console.error = originalConsole.error;
    console.warn = function(...args) {
        const message = args.join(' ');
        // Filtrer même les warnings non-critiques
        if (message.includes('⚠️') || 
            message.includes('ATTENTION') ||
            message.includes('Error') ||
            message.includes('Failed')) {
            originalConsole.warn(...args);
        }
    };
    
    // Message de confirmation (sera autorisé par le filtre)
    setTimeout(() => {
        console.log('🔇 [PRODUCTION] Console ultra-silencieuse activée - Erreurs critiques seulement');
    }, 500);
}