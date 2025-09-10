/**
 * API SÉCURISÉE - CLIENT SIDE
 * 
 * Ce fichier remplace les appels directs vers Airtable
 * Toutes les requêtes passent par le proxy Cloudflare Functions
 * Aucun jeton visible côté client !
 */

// Configuration sécurisée
window.SECURE_API_CONFIG = {
    proxyUrl: '/api', // URL des Cloudflare Functions
    timeout: 30000, // 30 secondes
    retries: 3
};

// Gestionnaire d'API sécurisé
class SecureAPI {
    constructor() {
        this.baseUrl = window.SECURE_API_CONFIG.proxyUrl;
        this.timeout = window.SECURE_API_CONFIG.timeout;
        this.retries = window.SECURE_API_CONFIG.retries;
    }

    /**
     * Requête sécurisée vers le proxy
     */
    async request(endpoint, options = {}) {
        const { method = 'GET', body, params = {} } = options;
        
        // Construire l'URL avec paramètres
        let url = `${this.baseUrl}/${endpoint}`;
        if (Object.keys(params).length > 0) {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    searchParams.append(key, value.toString());
                }
            });
            url += '?' + searchParams.toString();
        }

        // Configuration de la requête
        const config = {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            signal: AbortSignal.timeout(this.timeout)
        };

        if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            config.body = JSON.stringify(body);
        }

        // Tentatives avec retry
        let lastError;
        for (let attempt = 1; attempt <= this.retries; attempt++) {
            try {
                console.log(`🔐 Requête sécurisée: ${method} ${endpoint} (tentative ${attempt})`);
                
                const response = await fetch(url, config);
                
                if (!response.ok) {
                    let errorData = {};
                    try {
                        errorData = await response.json();
                    } catch (jsonError) {
                        // Si la réponse n'est pas du JSON, c'est probablement une page d'erreur HTML
                        const htmlContent = await response.text();
                        console.error('❌ Réponse HTML au lieu de JSON:', htmlContent.substring(0, 200));
                        throw new Error(`HTTP ${response.status}: Erreur serveur (réponse HTML reçue au lieu de JSON)`);
                    }
                    throw new Error(`HTTP ${response.status}: ${errorData.error || errorData.details || response.statusText}`);
                }

                const data = await response.json();
                console.log(`✅ Requête réussie: ${endpoint}`);
                return data;

            } catch (error) {
                lastError = error;
                console.warn(`⚠️ Tentative ${attempt} échouée pour ${endpoint}:`, error.message);
                
                if (attempt < this.retries) {
                    // Délai progressif entre les tentatives
                    await this.delay(1000 * attempt);
                }
            }
        }

        console.error(`❌ Toutes les tentatives échouées pour ${endpoint}`);
        throw lastError;
    }

    /**
     * Méthodes CRUD simplifiées
     */
    async get(tableName, recordId = null, params = {}) {
        const endpoint = recordId ? `tables/${tableName}/${recordId}` : `tables/${tableName}`;
        return await this.request(endpoint, { method: 'GET', params });
    }

    async post(tableName, data) {
        const endpoint = `tables/${tableName}`;
        return await this.request(endpoint, { method: 'POST', body: data });
    }

    async put(tableName, recordId, data) {
        const endpoint = `tables/${tableName}/${recordId}`;
        return await this.request(endpoint, { method: 'PUT', body: data });
    }

    async patch(tableName, recordId, data) {
        const endpoint = `tables/${tableName}/${recordId}`;
        return await this.request(endpoint, { method: 'PATCH', body: data });
    }

    async delete(tableName, recordId) {
        const endpoint = `tables/${tableName}/${recordId}`;
        return await this.request(endpoint, { method: 'DELETE' });
    }

    /**
     * Utilitaires
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Test de connectivité
     */
    async healthCheck() {
        try {
            // Test simple sur une table
            await this.get('utilisateurs', null, { limit: 1 });
            console.log('✅ API sécurisée opérationnelle');
            return true;
        } catch (error) {
            console.error('❌ API sécurisée non disponible:', error.message);
            
            // Analyser le type d'erreur pour donner des conseils appropriés
            if (error.message.includes('Configuration manquante') || 
                error.message.includes('AIRTABLE_BASE_ID') ||
                error.message.includes('AIRTABLE_API_KEY')) {
                console.log('🔧 Variables d\'environnement Cloudflare manquantes');
                return 'config_missing';
            } else if (error.message.includes('réponse HTML reçue au lieu de JSON')) {
                console.log('🐛 Fonction Cloudflare retourne du HTML - erreur de déploiement');
                return 'deployment_error';
            } else if (error.message.includes('404') || error.message.includes('Table inconnue')) {
                console.log('📊 Tables Airtable non initialisées');
                return 'tables_missing';
            } else if (error.message.includes('500')) {
                console.log('💡 Configuration partielle détectée');
                return 'partial';
            }
            
            return false;
        }
    }
}

// Instance globale
window.secureAPI = new SecureAPI();

// Intercepteur fetch pour rediriger les appels
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Initialisation de l\'API sécurisée...');
    
    // Test de connectivité au démarrage
    window.secureAPI.healthCheck().then(status => {
        switch(status) {
            case true:
                console.log('✅ API sécurisée fonctionnelle');
                break;
            case 'config_missing':
                console.warn('🔧 Variables d\'environnement Cloudflare manquantes');
                showConfigWarning();
                break;
            case 'deployment_error':
                console.warn('🐛 Erreur de déploiement Cloudflare Functions');
                showDeploymentWarning();
                break;
            case 'tables_missing':
                console.warn('📊 Tables Airtable non initialisées');
                showAPIWarning();
                break;
            case 'partial':
                console.warn('💡 Configuration partielle détectée');
                showConfigWarning();
                break;
            default:
                console.warn('❌ API sécurisée non disponible');
                showAPIWarning();
        }
    });

    // Remplacer le fetch global pour intercepter les appels "tables/"
    const originalFetch = window.fetch;
    
    window.fetch = function(url, options = {}) {
        // Intercepter seulement les appels à nos tables
        if (typeof url === 'string' && url.startsWith('tables/')) {
            return redirectToSecureAPI(url, options);
        }
        
        // Appel normal pour les autres URLs
        return originalFetch.apply(this, arguments);
    };
});

/**
 * Rediriger vers l'API sécurisée
 */
async function redirectToSecureAPI(url, options) {
    try {
        const urlParts = url.split('/');
        const tableName = urlParts[1].split('?')[0];
        const recordId = urlParts[2];
        
        // Extraire les paramètres de requête
        const urlObj = new URL(url, window.location.origin);
        const params = {};
        urlObj.searchParams.forEach((value, key) => {
            params[key] = value;
        });

        let result;
        const method = options.method || 'GET';

        switch (method.toUpperCase()) {
            case 'GET':
                result = await window.secureAPI.get(tableName, recordId, params);
                break;
            case 'POST':
                const postData = options.body ? JSON.parse(options.body) : {};
                result = await window.secureAPI.post(tableName, postData);
                break;
            case 'PUT':
                const putData = options.body ? JSON.parse(options.body) : {};
                result = await window.secureAPI.put(tableName, recordId, putData);
                break;
            case 'PATCH':
                const patchData = options.body ? JSON.parse(options.body) : {};
                result = await window.secureAPI.patch(tableName, recordId, patchData);
                break;
            case 'DELETE':
                result = await window.secureAPI.delete(tableName, recordId);
                break;
            default:
                throw new Error(`Méthode HTTP non supportée: ${method}`);
        }

        // Retourner une réponse compatible avec fetch()
        return {
            ok: true,
            status: 200,
            json: () => Promise.resolve(result)
        };

    } catch (error) {
        console.error('❌ Erreur API sécurisée:', error);
        return {
            ok: false,
            status: 500,
            json: () => Promise.resolve({ error: error.message })
        };
    }
}

/**
 * Afficher un avertissement si l'API n'est pas disponible
 */
function showAPIWarning() {
    const warning = document.createElement('div');
    warning.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; background: #f59e0b; color: white; padding: 10px; text-align: center; z-index: 10000;">
            <strong>⚠️ Configuration requise</strong> - 
            <a href="setup-direct.html" style="color: white; text-decoration: underline; font-weight: bold;">Cliquez ici pour initialiser Airtable automatiquement</a>
            <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; color: white; font-size: 18px; cursor: pointer;">&times;</button>
        </div>
    `;
    document.body.appendChild(warning);
}

/**
 * Afficher un avertissement pour la configuration Cloudflare
 */
function showConfigWarning() {
    const warning = document.createElement('div');
    warning.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; background: #3b82f6; color: white; padding: 10px; text-align: center; z-index: 10000;">
            <strong>🔧 Configuration Cloudflare requise</strong> - 
            <a href="FINALISATION.md" style="color: white; text-decoration: underline; font-weight: bold;">Configurez les variables d'environnement</a>
            <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; color: white; font-size: 18px; cursor: pointer;">&times;</button>
        </div>
    `;
    document.body.appendChild(warning);
}

/**
 * Afficher un avertissement pour les erreurs de déploiement
 */
function showDeploymentWarning() {
    const warning = document.createElement('div');
    warning.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; background: #ef4444; color: white; padding: 10px; text-align: center; z-index: 10000;">
            <strong>🐛 Erreur de déploiement</strong> - 
            <a href="diagnostic-api.html" style="color: white; text-decoration: underline; font-weight: bold;">Testez le diagnostic API</a>
            | <a href="DEPANNAGE.md" style="color: white; text-decoration: underline; font-weight: bold;">Guide de dépannage</a>
            <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; color: white; font-size: 18px; cursor: pointer;">&times;</button>
        </div>
    `;
    document.body.appendChild(warning);
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecureAPI;
}

console.log('🔐 API sécurisée chargée - Prête pour Cloudflare + Airtable !');