/**
 * API SUPABASE - Solution finale tout-en-un
 * Hébergement + Base de données PostgreSQL
 */

class SupabaseAPI {
    constructor() {
        // ⚙️ Credentials Supabase configurés
        this.supabaseUrl = 'https://ehiagntpmmietnpnbtrk.supabase.co/';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoaWFnbnRwbW1pZXRucG5idHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NjU5NTAsImV4cCI6MjA3MzA0MTk1MH0.E5O5fbxMkkiFTKwtZsyLEcjGvQyLAjXWafIiBdff0JQ';
        
        this.baseUrl = `${this.supabaseUrl}/rest/v1`;
        this.debug = true;
        
        this.log('⚡ API Supabase initialisée - Prête à utiliser !');
        this.log('📝 N\'oubliez pas de configurer supabaseUrl et supabaseKey');
    }

    log(message, data = null) {
        if (this.debug) {
            console.log(`⚡ [SUPABASE] ${message}`, data);
        }
    }

    getHeaders() {
        return {
            'apikey': this.supabaseKey,
            'Authorization': `Bearer ${this.supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        };
    }

    // GET - Récupérer des enregistrements
    async get(tableName, recordId = null, params = {}) {
        try {
            let url = `${this.baseUrl}/${tableName}`;
            
            if (recordId) {
                url += `?id=eq.${recordId}&limit=1`;
            } else {
                // Paramètres de requête Supabase
                const queryParams = [];
                if (params.limit) queryParams.push(`limit=${params.limit}`);
                if (params.offset) queryParams.push(`offset=${params.offset}`);
                if (params.sort) queryParams.push(`order=${params.sort}.desc`);
                if (params.search) queryParams.push(`nom=ilike.%${params.search}%`);
                
                if (queryParams.length > 0) {
                    url += '?' + queryParams.join('&');
                }
            }

            this.log(`GET ${url}`);

            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            if (recordId) {
                const record = data.length > 0 ? data[0] : null;
                if (record) {
                    this.log(`✅ Enregistrement récupéré:`, record);
                    return { success: true, data: record };
                } else {
                    return { success: false, error: 'Enregistrement non trouvé' };
                }
            } else {
                this.log(`✅ ${data.length} enregistrements récupérés`);
                return { 
                    success: true, 
                    data: data, 
                    records: data,
                    total: data.length 
                };
            }

        } catch (error) {
            this.log(`❌ Erreur GET ${tableName}:`, error);
            return { success: false, error: error.message, data: [] };
        }
    }

    // CREATE - Créer un enregistrement
    async create(tableName, data) {
        try {
            const url = `${this.baseUrl}/${tableName}`;

            // Ajouter les timestamps automatiquement
            const recordData = {
                ...data,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            this.log(`POST ${url}`, recordData);

            const response = await fetch(url, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(recordData)
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorData}`);
            }

            const result = await response.json();
            const record = Array.isArray(result) ? result[0] : result;
            
            this.log(`✅ Enregistrement créé:`, record);
            return { success: true, data: record };

        } catch (error) {
            this.log(`❌ Erreur CREATE ${tableName}:`, error);
            return { success: false, error: error.message };
        }
    }

    // UPDATE - Mettre à jour un enregistrement
    async update(tableName, recordId, data) {
        try {
            const url = `${this.baseUrl}/${tableName}?id=eq.${recordId}`;

            const recordData = {
                ...data,
                updated_at: new Date().toISOString()
            };

            this.log(`PATCH ${url}`, recordData);

            const response = await fetch(url, {
                method: 'PATCH',
                headers: this.getHeaders(),
                body: JSON.stringify(recordData)
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorData}`);
            }

            const result = await response.json();
            const record = Array.isArray(result) ? result[0] : result;
            
            this.log(`✅ Enregistrement mis à jour:`, record);
            return { success: true, data: record };

        } catch (error) {
            this.log(`❌ Erreur UPDATE ${tableName}:`, error);
            return { success: false, error: error.message };
        }
    }

    // DELETE - Supprimer un enregistrement
    async delete(tableName, recordId) {
        try {
            const url = `${this.baseUrl}/${tableName}?id=eq.${recordId}`;

            this.log(`DELETE ${url}`);

            const response = await fetch(url, {
                method: 'DELETE',
                headers: this.getHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            this.log(`✅ Enregistrement supprimé: ${recordId}`);
            return { success: true };

        } catch (error) {
            this.log(`❌ Erreur DELETE ${tableName}:`, error);
            return { success: false, error: error.message };
        }
    }

    // MÉTHODES DE COMMODITÉ pour compatibilité avec l'app existante
    async getUsers(params = {}) {
        return this.get('utilisateurs', null, params);
    }

    async getTeams(params = {}) {
        return this.get('equipes', null, params);
    }

    async getSoftware(params = {}) {
        return this.get('logiciels', null, params);
    }

    async getRights(params = {}) {
        return this.get('droits', null, params);
    }

    async getAccess(params = {}) {
        return this.get('acces', null, params);
    }

    async getCosts(params = {}) {
        return this.get('couts_licences', null, params);
    }

    async getLogs(params = {}) {
        return this.get('logs', null, params);
    }

    // Test de connexion Supabase
    async testConnection() {
        try {
            this.log('🔍 Test de connexion Supabase...');
            const response = await fetch(`${this.supabaseUrl}/rest/v1/`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (response.ok) {
                this.log('✅ Connexion Supabase réussie !');
                return { success: true, message: 'Connexion Supabase OK' };
            } else {
                throw new Error(`Test connexion échoué: ${response.status}`);
            }
        } catch (error) {
            this.log('❌ Erreur de connexion Supabase:', error);
            return { success: false, error: error.message };
        }
    }
}

// Instance globale - Remplace complètement D1API
window.D1API = new SupabaseAPI();

// Test automatique de la configuration au chargement
document.addEventListener('DOMContentLoaded', async () => {
    console.log('⚡ [SUPABASE] API chargée - Test de configuration...');
    
    if (window.D1API.supabaseUrl.includes('YOUR-PROJECT')) {
        console.warn('⚠️ [SUPABASE] Configuration requise : supabaseUrl et supabaseKey');
        console.log('📖 [SUPABASE] Voir GUIDE-SUPABASE-COMPLET.md pour la configuration');
    } else {
        const test = await window.D1API.testConnection();
        if (test.success) {
            console.log('🎉 [SUPABASE] Prêt à utiliser !');
        } else {
            console.error('❌ [SUPABASE] Problème de configuration:', test.error);
        }
    }
});

console.log('⚡ [SUPABASE] API Supabase chargée - Solution finale tout-en-un !');
