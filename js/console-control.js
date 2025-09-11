/**
 * CONTRÔLE CONSOLE - Commandes simples pour les administrateurs
 */

// Commandes globales pour les administrateurs
window.consoleMgr = {
    
    // Mode ultra-silencieux (PRODUCTION)
    silence() {
        if (window.AppLogger) {
            window.AppLogger.setLevel('ERROR');
            Object.keys(window.AppLogger.config.modules).forEach(module => {
                window.AppLogger.disableModule(module);
            });
        }
        console.log('🔇 Console en mode SILENCE - Erreurs critiques seulement');
    },
    
    // Mode debug ciblé  
    debug(module = null) {
        if (window.AppLogger) {
            window.AppLogger.setLevel('DEBUG');
            if (module) {
                window.AppLogger.enableModule(module);
                console.log(`🛠️ Debug activé pour: ${module}`);
            } else {
                // Activer modules essentiels
                ['supabase', 'reports', 'auth'].forEach(m => {
                    window.AppLogger.enableModule(m);
                });
                console.log('🛠️ Debug activé - Modules essentiels');
            }
        }
    },
    
    // Mode normal (quelques logs importants)
    normal() {
        if (window.AppLogger) {
            window.AppLogger.setLevel('INFO');
            // Désactiver les modules bruyants
            ['ui', 'charts', 'menu'].forEach(m => {
                window.AppLogger.disableModule(m);
            });
            // Garder les modules utiles
            ['auth', 'reports'].forEach(m => {
                window.AppLogger.enableModule(m);
            });
        }
        console.log('📊 Console en mode NORMAL - Logs équilibrés');
    },
    
    // Statistiques rapides
    stats() {
        if (window.AppLogger) {
            const stats = window.AppLogger.getStats();
            console.log('📊 STATISTIQUES CONSOLE:', stats);
            return stats;
        }
    },
    
    // Guide d'aide
    help() {
        console.log(`
🎮 COMMANDES CONSOLE DISPONIBLES:

📊 MODES PRÉDÉFINIS:
  consoleMgr.silence()     - Mode production (minimal)
  consoleMgr.normal()      - Mode équilibré 
  consoleMgr.debug()       - Mode développement
  consoleMgr.debug('supabase') - Debug module spécifique

🔧 CONTRÔLES AVANCÉS:
  consoleMgr.stats()       - Statistiques actuelles
  AppLogger.setLevel('ERROR') - Niveau personnalisé
  AppLogger.enableModule('reports') - Activer module

📋 MODULES DISPONIBLES:
  supabase, reports, auth, software, users, 
  teams, ui, charts, menu, access, costs

🎯 RECOMMANDATIONS:
  • Production: consoleMgr.silence() 
  • Debug problème: consoleMgr.debug('module')
  • Usage normal: consoleMgr.normal()
        `);
    }
};

// Message d'accueil pour les administrateurs
setTimeout(() => {
    if (!window.location.hostname.includes('localhost')) {
        console.log(`
🎮 GESTION CONSOLE AVANCÉE
Tapez: consoleMgr.help() pour voir les commandes
Rapide: consoleMgr.silence() pour mode production
        `);
    }
}, 2000);