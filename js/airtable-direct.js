/**
 * API AIRTABLE DIRECTE - SOLUTION DE CONTOURNEMENT
 * 
 * ATTENTION : Cette solution expose temporairement les clés Airtable côté client
 * À utiliser uniquement en développement ou jusqu'à ce que les Cloudflare Functions marchent
 */

// Configuration TEMPORAIRE - VRAIES valeurs Airtable
const AIRTABLE_CONFIG = {
    baseId: 'appRS7ug0IbkRJ5YF', // ✅ Base ID corrigé
    apiKey: 'patcxvdi1QG6Flv1z.c845cd89e7bf19e31bd10ce4f5ae03d9ccaf889ea03a35a962900d3014133d13', // ✅ Personal Access Token valide
    baseUrl: 'https://api.airtable.com/v0'
};

// 🚨 URGENT: Vous DEVEZ remplacer les valeurs ci-dessus par vos VRAIES clés !
// Base ID: Trouvé sur airtable.com → votre base → Help → API documentation
// Token: Créé sur account.airtable.com → Developer hub → Personal access tokens

// Mapping des tables
const AIRTABLE_TABLES = {
    'utilisateurs': 'Utilisateurs',
    'equipes': 'Equipes',
    'logiciels': 'Logiciels',
    'droits': 'Droits',
    'acces': 'Acces',
    'couts_licences': 'Couts_Licences',
    'logs': 'Logs'
};

class DirectAirtableAPI {
    constructor() {
        this.baseUrl = AIRTABLE_CONFIG.baseUrl;
        this.baseId = AIRTABLE_CONFIG.baseId;
        this.apiKey = AIRTABLE_CONFIG.apiKey;
    }

    async request(endpoint, options = {}) {
        const { method = 'GET', body, params = {} } = options;
        
        // Construire l'URL
        let url = `${this.baseUrl}/${this.baseId}/${endpoint}`;
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
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            }
        };

        if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            config.body = JSON.stringify(body);
        }

        try {
            console.log(`🔗 Appel direct Airtable: ${method} ${endpoint}`);
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`HTTP ${response.status}: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            console.log(`✅ Réponse Airtable directe reçue`);
            return data;

        } catch (error) {
            console.error(`❌ Erreur API Airtable directe:`, error);
            throw error;
        }
    }

    // Méthodes CRUD
    async get(tableName, recordId = null, params = {}) {
        const airtableTableName = AIRTABLE_TABLES[tableName] || tableName;
        const endpoint = recordId ? `${airtableTableName}/${recordId}` : airtableTableName;
        return await this.request(endpoint, { method: 'GET', params });
    }

    async post(tableName, data) {
        const airtableTableName = AIRTABLE_TABLES[tableName] || tableName;
        return await this.request(airtableTableName, { method: 'POST', body: data });
    }

    async put(tableName, recordId, data) {
        const airtableTableName = AIRTABLE_TABLES[tableName] || tableName;
        const endpoint = `${airtableTableName}/${recordId}`;
        return await this.request(endpoint, { method: 'PUT', body: data });
    }

    async patch(tableName, recordId, data) {
        const airtableTableName = AIRTABLE_TABLES[tableName] || tableName;
        const endpoint = `${airtableTableName}/${recordId}`;
        return await this.request(endpoint, { method: 'PATCH', body: data });
    }

    async delete(tableName, recordId) {
        const airtableTableName = AIRTABLE_TABLES[tableName] || tableName;
        const endpoint = `${airtableTableName}/${recordId}`;
        return await this.request(endpoint, { method: 'DELETE' });
    }

    // Test de connectivité
    async healthCheck() {
        try {
            await this.get('utilisateurs', null, { limit: 1 });
            console.log('✅ API Airtable directe opérationnelle');
            return true;
        } catch (error) {
            console.error('❌ API Airtable directe non disponible:', error.message);
            return false;
        }
    }
}

// FORCER l'activation de l'API directe
console.log('🔍 Configuration détectée:', {
    baseId: AIRTABLE_CONFIG.baseId,
    apiKey: AIRTABLE_CONFIG.apiKey.substring(0, 15) + '...',
    hasValidBase: AIRTABLE_CONFIG.baseId.startsWith('app'),
    hasValidToken: AIRTABLE_CONFIG.apiKey.startsWith('pat')
});

// Activation FORCÉE (plus de condition)
window.directAirtableAPI = new DirectAirtableAPI();

// Remplacer complètement l'API sécurisée
window.secureAPI = window.directAirtableAPI;

console.log('🔗 API Airtable directe FORCÉE - Remplacement de secureAPI');
console.log('⚠️ ATTENTION: Les clés Airtable sont exposées côté client !');

// Test immédiat
window.directAirtableAPI.healthCheck().then(result => {
    if (result) {
        console.log('✅ API directe opérationnelle - Application prête');
    } else {
        console.error('❌ API directe échoue malgré l\'activation');
    }
});

export default DirectAirtableAPI;