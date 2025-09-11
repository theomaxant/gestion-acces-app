/**
 * Démonstration du système de sélection d'utilisateur pour les logs
 */

// Attendre que tout soit chargé
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.userSelector && window.logger) {
            addDemoControls();
        }
    }, 1000);
});

function addDemoControls() {
    // Créer des contrôles de démonstration
    const demoHtml = `
        <div id="user-selector-demo" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-semibold text-yellow-800 flex items-center">
                    <i class="fas fa-flask mr-2"></i>Test du Sélecteur d'Utilisateur
                </h3>
                <button id="toggle-demo" class="text-xs text-yellow-600 hover:text-yellow-800">
                    <i class="fas fa-eye-slash"></i> Masquer
                </button>
            </div>
            <div id="demo-content">
                <p class="text-xs text-yellow-700 mb-3">
                    Ce panneau vous permet de tester la fonctionnalité de sélection d'utilisateur pour les logs.
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-medium text-yellow-800 mb-1">Actions de test</label>
                        <div class="space-y-2">
                            <button id="test-creation" class="w-full px-3 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded text-xs font-medium">
                                <i class="fas fa-plus mr-1"></i> Tester Création
                            </button>
                            <button id="test-modification" class="w-full px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded text-xs font-medium">
                                <i class="fas fa-edit mr-1"></i> Tester Modification
                            </button>
                            <button id="test-suppression" class="w-full px-3 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded text-xs font-medium">
                                <i class="fas fa-trash mr-1"></i> Tester Suppression
                            </button>
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-yellow-800 mb-1">Utilisateur actuel</label>
                        <div id="current-user-display" class="bg-white p-2 rounded border text-xs">
                            Chargement...
                        </div>
                        <button id="refresh-user-info" class="w-full mt-2 px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded text-xs">
                            <i class="fas fa-sync mr-1"></i> Rafraîchir
                        </button>
                    </div>
                </div>
                <div class="mt-3 p-2 bg-white rounded border">
                    <div class="text-xs font-medium text-gray-600 mb-1">Console (derniers logs)</div>
                    <div id="demo-logs" class="text-xs text-gray-500 max-h-20 overflow-y-auto">
                        Aucun log encore...
                    </div>
                </div>
            </div>
        </div>
    `;

    // Insérer après le header ou au début du contenu principal
    const insertTarget = document.querySelector('#dashboard-content') || 
                         document.querySelector('.container.mx-auto.px-4.py-6') ||
                         document.querySelector('#app .container');
    
    if (insertTarget) {
        insertTarget.insertAdjacentHTML('afterbegin', demoHtml);
        bindDemoEvents();
        updateCurrentUserDisplay();
    }
}

function bindDemoEvents() {
    // Toggle du panneau de démo
    document.getElementById('toggle-demo')?.addEventListener('click', () => {
        const content = document.getElementById('demo-content');
        const button = document.getElementById('toggle-demo');
        if (content.style.display === 'none') {
            content.style.display = 'block';
            button.innerHTML = '<i class="fas fa-eye-slash"></i> Masquer';
        } else {
            content.style.display = 'none';
            button.innerHTML = '<i class="fas fa-eye"></i> Afficher';
        }
    });

    // Tests de logging
    document.getElementById('test-creation')?.addEventListener('click', async () => {
        const testData = { nom: 'Test Item', type: 'Demo', created_at: new Date().toISOString() };
        await window.logger.logCreation('demo_table', 'demo_123', testData, 'Test de création via interface demo');
        logToDemo(`✅ Log de création envoyé par ${window.userSelector?.getCurrentUser() || 'Utilisateur inconnu'}`);
        updateCurrentUserDisplay();
    });

    document.getElementById('test-modification')?.addEventListener('click', async () => {
        const oldData = { nom: 'Ancien Nom', type: 'Demo' };
        const newData = { nom: 'Nouveau Nom', type: 'Demo Modifié' };
        await window.logger.logUpdate('demo_table', 'demo_123', oldData, newData, 'Test de modification via interface demo');
        logToDemo(`✏️ Log de modification envoyé par ${window.userSelector?.getCurrentUser() || 'Utilisateur inconnu'}`);
        updateCurrentUserDisplay();
    });

    document.getElementById('test-suppression')?.addEventListener('click', async () => {
        const deletedData = { nom: 'Item Supprimé', type: 'Demo' };
        await window.logger.logDeletion('demo_table', 'demo_123', deletedData, 'Test de suppression via interface demo');
        logToDemo(`🗑️ Log de suppression envoyé par ${window.userSelector?.getCurrentUser() || 'Utilisateur inconnu'}`);
        updateCurrentUserDisplay();
    });

    // Rafraîchir les informations utilisateur
    document.getElementById('refresh-user-info')?.addEventListener('click', () => {
        updateCurrentUserDisplay();
        logToDemo(`🔄 Informations utilisateur rafraîchies`);
    });

    // Écouter les changements d'utilisateur
    window.addEventListener('userChanged', (event) => {
        updateCurrentUserDisplay();
        logToDemo(`👤 Utilisateur changé vers: ${event.detail.user}`);
    });
}

function updateCurrentUserDisplay() {
    const display = document.getElementById('current-user-display');
    if (display && window.userSelector) {
        const currentUser = window.userSelector.getCurrentUser();
        const userData = window.userSelector.getCurrentUserData();
        
        display.innerHTML = `
            <div class="font-medium">${currentUser}</div>
            <div class="text-gray-500 text-xs mt-1">
                ${userData.poste || 'Poste non défini'} - ${userData.equipe || 'Équipe non définie'}
            </div>
            <div class="text-gray-400 text-xs">ID: ${userData.id || 'N/A'}</div>
        `;
    }
}

function logToDemo(message) {
    const logsContainer = document.getElementById('demo-logs');
    if (logsContainer) {
        const timestamp = new Date().toLocaleTimeString('fr-FR');
        const logEntry = `<div class="border-b border-gray-200 py-1">[${timestamp}] ${message}</div>`;
        logsContainer.insertAdjacentHTML('afterbegin', logEntry);
        
        // Limiter à 10 entrées
        const logs = logsContainer.children;
        while (logs.length > 10) {
            logsContainer.removeChild(logs[logs.length - 1]);
        }
    }
    
    // Aussi logger dans la console
    console.log(`[USER-SELECTOR-DEMO] ${message}`);
}