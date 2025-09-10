// Gestionnaire d'import Excel
class ImportManager {
    constructor() {
        this.importedData = null;
        this.importType = null;
        this.init();
    }

    init() {
        // Ce gestionnaire sera appelé depuis l'interface principale
    }

    showImportModal(type) {
        this.importType = type;
        
        const typeLabels = {
            'users': 'utilisateurs',
            'software': 'logiciels',
            'access': 'accès'
        };

        const modalContent = `
            <div class="space-y-4">
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input type="file" id="excel-file-input" accept=".xlsx,.xls,.csv" class="hidden">
                    <div id="drop-zone" class="cursor-pointer">
                        <i class="fas fa-file-excel text-4xl text-green-500 mb-4"></i>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">
                            Importer des ${typeLabels[type] || type}
                        </h3>
                        <p class="text-sm text-gray-600 mb-4">
                            Glissez-déposez votre fichier Excel ici ou cliquez pour sélectionner
                        </p>
                        <button type="button" onclick="document.getElementById('excel-file-input').click()" 
                                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Choisir un fichier
                        </button>
                    </div>
                </div>
                
                <div id="file-info" class="hidden bg-blue-50 p-4 rounded-lg">
                    <div class="flex items-center">
                        <i class="fas fa-file-excel text-green-500 mr-2"></i>
                        <span id="file-name" class="text-sm font-medium"></span>
                    </div>
                </div>
                
                <div id="preview-container" class="hidden">
                    <h4 class="text-sm font-medium text-gray-900 mb-2">Aperçu des données</h4>
                    <div id="data-preview" class="max-h-60 overflow-auto border rounded-lg"></div>
                </div>
                
                <div id="mapping-container" class="hidden">
                    <h4 class="text-sm font-medium text-gray-900 mb-2">Correspondance des colonnes</h4>
                    <div id="column-mapping" class="space-y-2"></div>
                </div>
                
                ${this.getFormatInstructions(type)}
            </div>
        `;

        const actions = [
            {
                text: 'Importer',
                class: 'px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 hidden',
                onclick: 'window.importManager.processImport()'
            }
        ];

        window.app?.showModal(`Import Excel - ${typeLabels[type]}`, modalContent, actions);
        this.setupFileHandlers();
    }

    getFormatInstructions(type) {
        const instructions = {
            'users': `
                <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <h5 class="text-sm font-medium text-yellow-800 mb-2">Format attendu pour les utilisateurs:</h5>
                    <ul class="text-sm text-yellow-700 space-y-1">
                        <li>• <strong>Nom</strong> (obligatoire)</li>
                        <li>• <strong>Prénom</strong> (optionnel)</li>
                        <li>• <strong>Email</strong> (optionnel)</li>
                        <li>• <strong>Poste</strong> (optionnel)</li>
                    </ul>
                </div>
            `,
            'software': `
                <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <h5 class="text-sm font-medium text-yellow-800 mb-2">Format attendu pour les logiciels:</h5>
                    <ul class="text-sm text-yellow-700 space-y-1">
                        <li>• <strong>Nom</strong> (obligatoire)</li>
                        <li>• <strong>Description</strong> (optionnel)</li>
                    </ul>
                </div>
            `,
            'access': `
                <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <h5 class="text-sm font-medium text-yellow-800 mb-2">Format attendu pour les accès:</h5>
                    <ul class="text-sm text-yellow-700 space-y-1">
                        <li>• <strong>Utilisateur</strong> (nom ou email)</li>
                        <li>• <strong>Logiciel</strong> (nom du logiciel)</li>
                        <li>• <strong>Droit</strong> (Admin, User, Lecteur, ou Accès communs)</li>
                    </ul>
                </div>
            `
        };

        return instructions[type] || '';
    }

    setupFileHandlers() {
        const fileInput = document.getElementById('excel-file-input');
        const dropZone = document.getElementById('drop-zone');

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleFile(e.target.files[0]);
                }
            });
        }

        if (dropZone) {
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('border-blue-400', 'bg-blue-50');
            });

            dropZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                dropZone.classList.remove('border-blue-400', 'bg-blue-50');
            });

            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('border-blue-400', 'bg-blue-50');
                
                if (e.dataTransfer.files.length > 0) {
                    this.handleFile(e.dataTransfer.files[0]);
                }
            });
        }
    }

    async handleFile(file) {
        if (!file) return;

        // Vérifier le type de fichier
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'text/csv'
        ];

        if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
            window.app?.showAlert('Format de fichier non supporté. Utilisez Excel (.xlsx, .xls) ou CSV.', 'error');
            return;
        }

        // Afficher les informations du fichier
        document.getElementById('file-name').textContent = file.name;
        document.getElementById('file-info').classList.remove('hidden');

        try {
            const data = await this.parseFile(file);
            if (data && data.length > 0) {
                this.importedData = data;
                this.showPreview(data);
                this.showColumnMapping(data);
                
                // Afficher le bouton d'import
                const importButton = document.querySelector('[onclick="window.importManager.processImport()"]');
                if (importButton) {
                    importButton.classList.remove('hidden');
                }
            }
        } catch (error) {
            console.error('Erreur lors de la lecture du fichier:', error);
            window.app?.showAlert('Erreur lors de la lecture du fichier', 'error');
        }
    }

    async parseFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    if (file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv')) {
                        // Traitement CSV
                        const text = e.target.result;
                        const data = this.parseCSV(text);
                        resolve(data);
                    } else {
                        // Traitement Excel
                        const data = new Uint8Array(e.target.result);
                        const workbook = XLSX.read(data, { type: 'array' });
                        const firstSheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[firstSheetName];
                        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                        
                        // Convertir en format utilisable
                        const processedData = this.processSheetData(jsonData);
                        resolve(processedData);
                    }
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));

            if (file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv')) {
                reader.readAsText(file);
            } else {
                reader.readAsArrayBuffer(file);
            }
        });
    }

    parseCSV(text) {
        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length < 2) return [];

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            data.push(row);
        }

        return data;
    }

    processSheetData(jsonData) {
        if (jsonData.length < 2) return [];

        const headers = jsonData[0].map(h => h?.toString().trim() || '');
        const data = [];

        for (let i = 1; i < jsonData.length; i++) {
            const row = {};
            const values = jsonData[i] || [];
            
            headers.forEach((header, index) => {
                if (header) {
                    row[header] = values[index]?.toString().trim() || '';
                }
            });

            // Ne pas ajouter les lignes complètement vides
            if (Object.values(row).some(value => value !== '')) {
                data.push(row);
            }
        }

        return data;
    }

    showPreview(data) {
        const previewContainer = document.getElementById('preview-container');
        const previewDiv = document.getElementById('data-preview');
        
        if (!previewContainer || !previewDiv) return;

        const headers = Object.keys(data[0] || {});
        const previewData = data.slice(0, 5); // Afficher seulement les 5 premières lignes

        const tableHtml = `
            <table class="min-w-full text-sm">
                <thead class="bg-gray-50">
                    <tr>
                        ${headers.map(header => `<th class="px-2 py-1 text-left font-medium">${header}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${previewData.map(row => `
                        <tr class="border-t">
                            ${headers.map(header => `<td class="px-2 py-1">${row[header] || ''}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            ${data.length > 5 ? `<p class="text-xs text-gray-500 mt-2">... et ${data.length - 5} lignes supplémentaires</p>` : ''}
        `;

        previewDiv.innerHTML = tableHtml;
        previewContainer.classList.remove('hidden');
    }

    showColumnMapping(data) {
        const mappingContainer = document.getElementById('mapping-container');
        const mappingDiv = document.getElementById('column-mapping');
        
        if (!mappingContainer || !mappingDiv) return;

        const headers = Object.keys(data[0] || {});
        const expectedFields = this.getExpectedFields(this.importType);

        const mappingHtml = expectedFields.map(field => `
            <div class="flex items-center space-x-4">
                <label class="w-24 text-sm font-medium text-gray-700">${field.label}${field.required ? ' *' : ''}</label>
                <select id="mapping-${field.key}" class="flex-1 px-2 py-1 border border-gray-300 rounded text-sm">
                    <option value="">-- Ignorer --</option>
                    ${headers.map(header => {
                        const isSelected = this.suggestMapping(field.key, header);
                        return `<option value="${header}" ${isSelected ? 'selected' : ''}>${header}</option>`;
                    }).join('')}
                </select>
            </div>
        `).join('');

        mappingDiv.innerHTML = mappingHtml;
        mappingContainer.classList.remove('hidden');
    }

    getExpectedFields(type) {
        const fields = {
            'users': [
                { key: 'nom', label: 'Nom', required: true },
                { key: 'prenom', label: 'Prénom', required: false },
                { key: 'email', label: 'Email', required: false },
                { key: 'poste', label: 'Poste', required: false }
            ],
            'software': [
                { key: 'nom', label: 'Nom', required: true },
                { key: 'description', label: 'Description', required: false }
            ],
            'access': [
                { key: 'utilisateur', label: 'Utilisateur', required: true },
                { key: 'logiciel', label: 'Logiciel', required: true },
                { key: 'droit', label: 'Droit', required: true }
            ]
        };

        return fields[type] || [];
    }

    suggestMapping(fieldKey, columnHeader) {
        const suggestions = {
            'nom': ['nom', 'name', 'lastname', 'surname'],
            'prenom': ['prenom', 'prénom', 'firstname', 'prenom'],
            'email': ['email', 'e-mail', 'mail', 'courriel'],
            'poste': ['poste', 'position', 'job', 'fonction', 'title'],
            'description': ['description', 'desc', 'details'],
            'utilisateur': ['utilisateur', 'user', 'nom', 'name'],
            'logiciel': ['logiciel', 'software', 'application', 'app'],
            'droit': ['droit', 'right', 'permission', 'role', 'access']
        };

        const fieldSuggestions = suggestions[fieldKey] || [];
        return fieldSuggestions.some(suggestion => 
            columnHeader.toLowerCase().includes(suggestion.toLowerCase())
        );
    }

    async processImport() {
        if (!this.importedData || !this.importType) {
            window.app?.showAlert('Aucune donnée à importer', 'error');
            return;
        }

        try {
            // Créer le mapping des colonnes
            const mapping = {};
            const expectedFields = this.getExpectedFields(this.importType);
            
            for (const field of expectedFields) {
                const select = document.getElementById(`mapping-${field.key}`);
                if (select && select.value) {
                    mapping[field.key] = select.value;
                }
            }

            // Valider le mapping
            const requiredFields = expectedFields.filter(f => f.required);
            const missingFields = requiredFields.filter(f => !mapping[f.key]);
            
            if (missingFields.length > 0) {
                window.app?.showAlert(
                    `Champs obligatoires manquants: ${missingFields.map(f => f.label).join(', ')}`, 
                    'error'
                );
                return;
            }

            // Traiter les données selon le type
            let importedCount = 0;
            const errors = [];

            for (const row of this.importedData) {
                try {
                    if (this.importType === 'users') {
                        await this.importUser(row, mapping);
                    } else if (this.importType === 'software') {
                        await this.importSoftware(row, mapping);
                    } else if (this.importType === 'access') {
                        await this.importAccess(row, mapping);
                    }
                    importedCount++;
                } catch (error) {
                    errors.push(`Ligne ${importedCount + 1}: ${error.message}`);
                }
            }

            // Fermer la modal
            document.querySelector('.fixed')?.remove();

            // Afficher les résultats
            if (errors.length === 0) {
                window.app?.showAlert(`${importedCount} éléments importés avec succès`, 'success');
            } else {
                window.app?.showAlert(
                    `${importedCount} éléments importés, ${errors.length} erreurs. Voir la console pour les détails.`, 
                    'warning'
                );
                console.warn('Erreurs d\'import:', errors);
            }

            // Recharger les données
            this.reloadCurrentView();
            
        } catch (error) {
            console.error('Erreur lors de l\'import:', error);
            window.app?.showAlert('Erreur lors de l\'import', 'error');
        }
    }

    async importUser(row, mapping) {
        const userData = {
            nom: row[mapping.nom]?.trim(),
            prenom: row[mapping.prenom]?.trim() || '',
            email: row[mapping.email]?.trim() || '',
            poste: row[mapping.poste]?.trim() || '',
            archived: false
        };

        if (!userData.nom) {
            throw new Error('Nom manquant');
        }

        // Utiliser l'API Supabase au lieu de l'ancienne API
        const result = await window.D1API.create('utilisateurs', userData);

        if (!result.success) {
            throw new Error(`Erreur lors de la création de l'utilisateur: ${result.error}`);
        }

        // Log de la création
        if (window.logger) {
            await window.logger.logCreate('utilisateurs', result.data.id, userData, `Utilisateur importé depuis Excel: ${userData.nom} ${userData.prenom}`);
        }
    }

    async importSoftware(row, mapping) {
        const softwareData = {
            nom: row[mapping.nom]?.trim(),
            description: row[mapping.description]?.trim() || '',
            archived: false
        };

        if (!softwareData.nom) {
            throw new Error('Nom du logiciel manquant');
        }

        // Utiliser l'API Supabase
        const result = await window.D1API.create('logiciels', softwareData);

        if (!result.success) {
            throw new Error(`Erreur lors de la création du logiciel: ${result.error}`);
        }

        // Log de la création
        if (window.logger) {
            await window.logger.logCreate('logiciels', result.data.id, softwareData, `Logiciel importé depuis Excel: ${softwareData.nom}`);
        }
    }

    async importAccess(row, mapping) {
        const utilisateurStr = row[mapping.utilisateur]?.trim();
        const logicielStr = row[mapping.logiciel]?.trim();
        const droitStr = row[mapping.droit]?.trim();

        if (!utilisateurStr || !logicielStr || !droitStr) {
            throw new Error('Données d\'accès incomplètes');
        }

        // Trouver l'utilisateur
        const usersResult = await window.D1API.get('utilisateurs');
        const user = (usersResult.data || []).find(u => 
            u.nom.toLowerCase().includes(utilisateurStr.toLowerCase()) ||
            (u.email && u.email.toLowerCase() === utilisateurStr.toLowerCase())
        );

        if (!user) {
            throw new Error(`Utilisateur non trouvé: ${utilisateurStr}`);
        }

        // Trouver le logiciel
        const softwareResult = await window.D1API.get('logiciels');
        const software = (softwareResult.data || []).find(s => 
            s.nom.toLowerCase().includes(logicielStr.toLowerCase())
        );

        if (!software) {
            throw new Error(`Logiciel non trouvé: ${logicielStr}`);
        }

        // Trouver le droit
        const rightsResult = await window.D1API.get('droits');
        const droit = (rightsResult.data || []).find(d => 
            d.nom.toLowerCase() === droitStr.toLowerCase()
        );

        if (!droit) {
            throw new Error(`Droit non trouvé: ${droitStr}`);
        }

        // Créer l'accès
        const accessData = {
            utilisateur_id: user.id,
            logiciel_id: software.id,
            droit_id: droit.id
        };

        // Utiliser l'API Supabase
        const result = await window.D1API.create('acces', accessData);

        if (!result.success) {
            throw new Error(`Erreur lors de la création de l'accès: ${result.error}`);
        }
    }

    reloadCurrentView() {
        // Recharger la vue actuelle selon le type d'import
        setTimeout(() => {
            if (this.importType === 'users' && window.usersManager) {
                window.usersManager.loadUsers();
            } else if (this.importType === 'software' && window.softwareManager) {
                window.softwareManager.loadSoftware();
            } else if (this.importType === 'access' && window.accessManager) {
                window.accessManager.loadAccess();
            }
            
            // Recharger le dashboard
            if (window.app) {
                window.app.loadDashboard();
            }
        }, 100);
    }
}

// Initialiser le gestionnaire d'import
document.addEventListener('DOMContentLoaded', () => {
    window.importManager = new ImportManager();
});