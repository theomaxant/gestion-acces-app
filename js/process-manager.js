/**
 * Gestionnaire de Documentation des Processus
 * Gestion des Accès et Licences Logiciels - Version 2024
 */

class ProcessManager {
    constructor() {
        this.currentDocument = 'quick-start';
        this.documents = {
            'quick-start': {
                title: '🚀 Démarrage Rapide',
                file: 'DEMARRAGE-RAPIDE.md',
                description: 'Guide de mise en route en 5 minutes'
            },
            'complete-process': {
                title: '📋 Processus Complets 2024',
                file: 'PROCESSUS-COMPLET-2024.md',
                description: 'Documentation complète de tous les processus opérationnels'
            },
            'new-fields': {
                title: '🆕 Nouveaux Champs 2024',
                file: 'NOUVEAUX-CHAMPS-2024.md',
                description: 'Guide détaillé des nouvelles fonctionnalités 2024'
            },
            'documentation-index': {
                title: '📖 Index de Documentation',
                file: 'DOCUMENTATION-INDEX.md',
                description: 'Index complet de la documentation organisée par profil'
            }
        };
        this.init();
    }

    init() {
        // La méthode sera appelée par le système de navigation
        console.log('[ProcessManager] Initialisé');
    }

    async showAllProcesses() {
        try {
            const container = document.getElementById('process-view');
            if (!container) {
                console.error('[ProcessManager] Container process-view non trouvé');
                return;
            }

            container.innerHTML = this.createProcessHTML();
            await this.loadDocumentContent(this.currentDocument);
            this.setupEventListeners();
            
        } catch (error) {
            console.error('[ProcessManager] Erreur lors de l\'affichage des processus:', error);
            this.showError('Erreur lors du chargement de la documentation');
        }
    }

    createProcessHTML() {
        return `
            <div class="process-page bg-white">
                <!-- En-tête -->
                <div class="mb-8">
                    <div class="flex items-center justify-between">
                        <div>
                            <h1 class="text-3xl font-bold text-gray-900 mb-2">📚 Documentation des Processus</h1>
                            <p class="text-gray-600">Guides complets pour maîtriser l'application - Version 2024</p>
                        </div>
                        <div class="flex space-x-2">
                            <button onclick="processManager.printDocument()" 
                                    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                                <i class="fas fa-print"></i>
                                <span>Imprimer</span>
                            </button>
                            <button onclick="processManager.downloadDocument()" 
                                    class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
                                <i class="fas fa-download"></i>
                                <span>Télécharger</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Navigation des documents -->
                <div class="process-navigation grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    ${Object.entries(this.documents).map(([key, doc]) => `
                        <button onclick="processManager.loadDocumentContent('${key}')" 
                                class="process-nav-btn bg-white border-2 border-gray-200 rounded-lg p-4 text-left hover:border-blue-500 hover:shadow-md transition-all
                                       ${key === this.currentDocument ? 'border-blue-500 bg-blue-50' : ''}">
                            <h3 class="font-semibold text-lg mb-2">${doc.title}</h3>
                            <p class="text-gray-600 text-sm">${doc.description}</p>
                        </button>
                    `).join('')}
                </div>

                <!-- Zone de contenu -->
                <div class="bg-white border border-gray-200 rounded-lg">
                    <div class="process-header bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-lg">
                        <div class="flex items-center justify-between">
                            <h2 id="document-title" class="text-xl font-bold text-gray-900">
                                ${this.documents[this.currentDocument].title}
                            </h2>
                            <div class="flex items-center space-x-4 text-sm text-gray-500">
                                <span id="document-info">Chargement...</span>
                                <button onclick="processManager.toggleFullscreen()" 
                                        class="text-gray-500 hover:text-gray-700">
                                    <i class="fas fa-expand"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="process-content p-6">
                        <div id="document-content" class="prose prose-lg max-w-none">
                            <div class="flex items-center justify-center py-12">
                                <div class="text-center">
                                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p class="text-gray-600">Chargement de la documentation...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Raccourcis clavier -->
                <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 class="font-semibold text-blue-900 mb-2">⌨️ Raccourcis clavier</h4>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-blue-700">
                        <div><kbd class="bg-blue-200 px-2 py-1 rounded">F1</kbd> Aide/Tutoriel</div>
                        <div><kbd class="bg-blue-200 px-2 py-1 rounded">Ctrl+P</kbd> Imprimer</div>
                        <div><kbd class="bg-blue-200 px-2 py-1 rounded">F11</kbd> Plein écran</div>
                        <div><kbd class="bg-blue-200 px-2 py-1 rounded">Esc</kbd> Quitter plein écran</div>
                    </div>
                </div>
            </div>
        `;
    }

    async loadDocumentContent(documentKey) {
        try {
            const document = this.documents[documentKey];
            if (!document) {
                throw new Error(`Document ${documentKey} non trouvé`);
            }

            this.currentDocument = documentKey;
            
            // Mettre à jour l'interface
            document.getElementById('document-title').textContent = document.title;
            document.getElementById('document-info').textContent = 'Chargement...';
            
            // Mettre à jour la navigation
            this.updateNavigationButtons();
            
            // Charger le contenu du fichier markdown
            const content = await this.loadMarkdownFile(document.file);
            const htmlContent = this.convertMarkdownToHTML(content);
            
            document.getElementById('document-content').innerHTML = htmlContent;
            document.getElementById('document-info').textContent = `${this.getWordCount(content)} mots • Mise à jour: ${new Date().toLocaleDateString('fr-FR')}`;
            
            // Scroll vers le haut
            document.querySelector('.process-content').scrollTop = 0;
            
        } catch (error) {
            console.error('[ProcessManager] Erreur lors du chargement du document:', error);
            this.showDocumentError(error.message);
        }
    }

    async loadMarkdownFile(filename) {
        try {
            // Simuler le chargement du contenu des fichiers markdown
            // En réalité, ces fichiers existent dans le projet
            const mockContent = this.getMockContent(filename);
            return mockContent;
        } catch (error) {
            throw new Error(`Impossible de charger ${filename}: ${error.message}`);
        }
    }

    getMockContent(filename) {
        // Contenu simulé basé sur les vrais fichiers du projet
        switch (filename) {
            case 'DEMARRAGE-RAPIDE.md':
                return `# 🚀 Guide de Démarrage Rapide - Application Gestion des Licences 2024

## Configuration Initiale (5 minutes)

### 1. Premier Accès
- Accédez à l'application via votre navigateur
- Connectez-vous avec vos identifiants Supabase
- Vérifiez que la base de données PostgreSQL est accessible

### 2. Configuration de Base
- **Utilisateurs** : Ajoutez vos premiers utilisateurs
- **Équipes** : Créez les équipes de votre organisation
- **Logiciels** : Importez votre inventaire existant

## Utilisation Quotidienne

### Tableau de Bord
- **Vue d'ensemble** : Statistiques en temps réel
- **Alertes** : Licences qui expirent bientôt
- **Graphiques** : Évolution des coûts et usage

### Gestion des Logiciels
- **Nouveaux champs 2024** :
  - \`logiciel_de_base\` : Logiciel principal
  - \`application_shopify\` : Application Shopify liée
  - \`payer_id\` : Responsable du paiement
  - \`moyen_paiement\` : CB, Virement, etc.
  - \`budget_mensuel\` : Budget alloué par mois

### Actions Rapides
1. **Ajouter un logiciel** : Bouton + depuis le tableau de bord
2. **Assigner des accès** : Glisser-déposer depuis la liste utilisateurs
3. **Renouveler une licence** : Clic sur la date d'expiration
4. **Générer un rapport** : Section Rapports > Export Excel

## Support
- **F1** : Tutoriels interactifs
- **Documentation complète** : Onglet Processus
- **Logs système** : Onglet Logs pour le debugging`;

            case 'PROCESSUS-COMPLET-2024.md':
                return `# 📋 Processus Complets 2024 - Gestion des Licences Logiciels

## Table des Matières
1. [Gestion des Utilisateurs](#gestion-des-utilisateurs)
2. [Gestion des Logiciels](#gestion-des-logiciels)
3. [Gestion des Accès](#gestion-des-accès)
4. [Gestion des Équipes](#gestion-des-équipes)
5. [Processus Financiers](#processus-financiers)
6. [Rapports et Analyses](#rapports-et-analyses)

## Gestion des Utilisateurs

### Création d'un Utilisateur
**Processus :**
1. Navigation : Onglet "Utilisateurs" > Bouton "Ajouter"
2. **Champs obligatoires :**
   - \`nom\` : Nom de famille
   - \`prenom\` : Prénom
   - \`email\` : Adresse email (unique)
   - \`role\` : admin, manager, user
   - \`equipe_id\` : Équipe d'appartenance

3. **Champs optionnels 2024 :**
   - \`telephone\` : Numéro de téléphone
   - \`date_embauche\` : Date d'embauche
   - \`responsable_id\` : ID du responsable hiérarchique
   - \`budget_alloue\` : Budget mensuel alloué
   - \`notes_internes\` : Notes privées sur l'utilisateur

### Modification d'un Utilisateur
**Workflow :**
1. Recherche par nom/email dans la liste
2. Clic sur "Modifier" ou double-clic sur la ligne
3. Modification des champs autorisés selon le rôle
4. Validation et log automatique des changements

## Gestion des Logiciels

### Ajout d'un Nouveau Logiciel
**Processus détaillé :**
1. **Informations de base :**
   - \`nom\` : Nom du logiciel
   - \`editeur\` : Éditeur/Développeur
   - \`version\` : Version actuelle
   - \`url_officiel\` : Site web officiel

2. **Nouveaux champs 2024 :**
   - \`logiciel_de_base\` : Logiciel principal (si c'est une extension)
   - \`application_shopify\` : true/false si c'est une app Shopify
   - \`payer_id\` : ID de l'utilisateur responsable du paiement
   - \`moyen_paiement\` : CB, Virement, PayPal, etc.
   - \`periodicite\` : mensuel, annuel, unique
   - \`date_souscription\` : Date de première souscription
   - \`budget_mensuel\` : Coût mensuel prévu

3. **Informations financières :**
   - \`cout_mensuel\` : Coût réel par mois
   - \`devise\` : EUR, USD, etc.
   - \`date_expiration\` : Date d'expiration de la licence

### Renouvellement de Licence
**Workflow automatisé :**
1. **Détection automatique** (30 jours avant expiration)
2. **Notification** au responsable (\`payer_id\`)
3. **Processus de validation :**
   - Vérification du budget disponible
   - Confirmation du besoin métier
   - Validation hiérarchique si budget > seuil
4. **Mise à jour** des dates et coûts
5. **Log** complet de l'opération

## Gestion des Accès

### Attribution d'un Accès
**Processus :**
1. **Sélection utilisateur + logiciel**
2. **Validation des prérequis :**
   - Utilisateur actif et dans la bonne équipe
   - Licence disponible ou budget suffisant
   - Autorisation du responsable si nécessaire

3. **Enregistrement :**
   - \`utilisateur_id\` et \`logiciel_id\`
   - \`date_attribution\` : Date d'attribution
   - \`date_expiration_acces\` : Date d'expiration de l'accès
   - \`statut_acces\` : actif, suspendu, expiré
   - \`approuve_par\` : ID de l'approbateur

## Processus Financiers 2024

### Suivi Budgétaire
**Nouveaux processus :**
1. **Budget mensuel par utilisateur** (\`budget_alloue\`)
2. **Budget par logiciel** (\`budget_mensuel\`)
3. **Rapports de dépassement** automatiques
4. **Alertes** en cas de dépassement de 80% du budget

### Moyens de Paiement
**Gestion centralisée :**
- **Carte Bancaire** : Renouvellement automatique
- **Virement** : Processus manuel avec validation
- **PayPal** : Intégration API pour le suivi
- **Autre** : Processus personnalisé

## Rapports et Analyses

### Rapports Automatiques
1. **Rapport mensuel** : Coûts par équipe et logiciel
2. **Rapport d'expiration** : Licences à renouveler
3. **Rapport d'usage** : Utilisation réelle vs prévue
4. **Rapport budgétaire** : Suivi des budgets alloués

### Tableaux de Bord 2024
- **Vue Financière** : Coûts mensuels et annuels
- **Vue Opérationnelle** : Accès actifs et expirations
- **Vue Stratégique** : ROI par logiciel et équipe

## Sécurité et Conformité

### Logs et Traçabilité
**Événements tracés :**
- Création/modification/suppression d'utilisateurs
- Attribution/révocation d'accès
- Changements de licence et coûts
- Connexions et actions administratives

### Sauvegarde et Archivage
- **Sauvegarde quotidienne** de la base Supabase
- **Archivage mensuel** des logs
- **Rétention 7 ans** pour la conformité`;

            case 'NOUVEAUX-CHAMPS-2024.md':
                return `# 🆕 Nouveaux Champs et Fonctionnalités 2024

## Vue d'Ensemble
Cette version 2024 introduit de nombreux nouveaux champs pour une gestion plus fine et professionnelle des licences logiciels.

## Nouveaux Champs - Table Logiciels

### \`logiciel_de_base\`
**Type :** Texte (optionnel)
**Utilisation :** Pour les extensions, plugins, ou modules
**Exemple :** 
- Logiciel = "Shopify Plus App", logiciel_de_base = "Shopify"
- Logiciel = "Chrome Extension SEO", logiciel_de_base = "Google Chrome"

### \`application_shopify\`
**Type :** Booléen (true/false)
**Utilisation :** Identifier les applications Shopify spécifiquement
**Impact :** 
- Rapports séparés pour les apps Shopify
- Suivi du coût total Shopify ecosystem

### \`url_officiel\`
**Type :** URL
**Utilisation :** Lien direct vers le site officiel du logiciel
**Avantages :**
- Accès rapide à la documentation
- Vérification de la légitimité
- Liens vers le support

### \`payer_id\`
**Type :** ID Utilisateur
**Utilisation :** Responsable du paiement de cette licence
**Workflow :**
- Notifications envoyées au payer_id
- Responsabilité claire des coûts
- Validation des renouvellements

### \`moyen_paiement\`
**Type :** Énumération (CB, Virement, PayPal, Autre)
**Utilisation :** Méthode de paiement utilisée
**Automatisations :**
- CB : Renouvellement automatique possible
- Virement : Processus manuel requis
- PayPal : Suivi via API PayPal

### \`periodicite\`
**Type :** Énumération (mensuel, annuel, unique)
**Utilisation :** Fréquence de paiement
**Calculs automatiques :**
- Budget annuel = cout_mensuel × 12 (si mensuel)
- Prochaine échéance calculée automatiquement

### \`date_souscription\`
**Type :** Date
**Utilisation :** Date de première souscription
**Analyses :**
- Ancienneté des licences
- ROI sur la durée
- Historique des coûts

### \`budget_mensuel\`
**Type :** Décimal
**Utilisation :** Budget prévu pour ce logiciel par mois
**Alertes :**
- Dépassement si cout_mensuel > budget_mensuel
- Prévisions budgétaires
- Rapports de variance

## Nouveaux Champs - Table Utilisateurs

### \`telephone\`
**Type :** Texte (optionnel)
**Utilisation :** Contact téléphonique
**Cas d'usage :**
- Urgences techniques
- Validation d'identité
- Support utilisateur

### \`date_embauche\`
**Type :** Date
**Utilisation :** Date d'embauche dans l'entreprise
**Analyses :**
- Corrélation ancienneté/nombre de licences
- Onboarding automatique
- Calcul des droits

### \`responsable_id\`
**Type :** ID Utilisateur
**Utilisation :** Responsable hiérarchique
**Workflow :**
- Validation des demandes de licence
- Escalade en cas de problème
- Rapports hiérarchiques

### \`budget_alloue\`
**Type :** Décimal
**Utilisation :** Budget mensuel alloué à cet utilisateur
**Contrôles :**
- Limite des demandes de licence
- Alerte si dépassement
- Responsabilisation des coûts

### \`notes_internes\`
**Type :** Texte long (optionnel)
**Utilisation :** Notes privées sur l'utilisateur
**Exemples :**
- "Utilisateur avancé, peut avoir des licences premium"
- "Attention aux coûts, budget serré"
- "Nouveau, accompagner les premiers mois"

## Nouveaux Champs - Table Accès

### \`date_expiration_acces\`
**Type :** Date (optionnelle)
**Utilisation :** Date d'expiration de l'accès individuel
**Différence avec date_expiration :**
- date_expiration = licence globale
- date_expiration_acces = accès spécifique à cet utilisateur

### \`statut_acces\`
**Type :** Énumération (actif, suspendu, expiré, révoqué)
**Utilisation :** État détaillé de l'accès
**Workflow :**
- actif : Accès normal
- suspendu : Temporairement désactivé
- expiré : Date dépassée, action requise
- révoqué : Accès supprimé définitivement

### \`approuve_par\`
**Type :** ID Utilisateur (optionnel)
**Utilisation :** Qui a approuvé cet accès
**Traçabilité :**
- Responsabilité des décisions
- Audit des approbations
- Historique des validations

## Nouveaux Workflows 2024

### Processus d'Approbation
1. **Demande d'accès** par utilisateur ou manager
2. **Vérification automatique** :
   - Budget disponible (budget_alloue)
   - Cohérence avec le poste
   - Respect des politiques
3. **Approbation hiérarchique** si nécessaire
4. **Attribution automatique** si validé
5. **Notification** à tous les acteurs

### Gestion Budgétaire Avancée
1. **Allocation budgétaire** par utilisateur et équipe
2. **Suivi en temps réel** des dépenses
3. **Alertes préventives** à 80% du budget
4. **Rapports de variance** mensuel
5. **Réallocation** si nécessaire

### Notifications Intelligentes
**Basées sur les nouveaux champs :**
- **payer_id** reçoit les alertes de paiement
- **responsable_id** valide les demandes importantes
- **Équipe** informée des changements majeurs

## Migration et Compatibilité

### Données Existantes
- **Tous les nouveaux champs sont optionnels**
- **Valeurs par défaut** configurées
- **Migration progressive** possible

### Mise à Jour Recommandée
1. **Phase 1** : Ajouter les champs critiques (payer_id, budget_mensuel)
2. **Phase 2** : Compléter les informations (url_officiel, responsable_id)
3. **Phase 3** : Optimiser (notes_internes, workflows avancés)

## Impact sur les Rapports

### Nouveaux Rapports Disponibles
- **Rapport par responsable de paiement** (payer_id)
- **Suivi budgétaire détaillé** (budget_mensuel vs cout_mensuel)
- **Analyse des applications Shopify** (application_shopify = true)
- **Rapport hiérarchique** (responsable_id)

### Tableaux de Bord Enrichis
- **Graphiques de variance budgétaire**
- **Répartition par moyen de paiement**
- **Évolution des coûts par périodicité**
- **Heat map des responsables de paiement**

Cette évolution 2024 transforme l'application en un véritable outil de gestion financière et opérationnelle des licences logiciels.`;

            case 'DOCUMENTATION-INDEX.md':
                return `# 📖 Index de la Documentation - Application Gestion des Licences 2024

## Organisation de la Documentation

### 🎯 Par Profil Utilisateur

#### IT Manager / Administrateur Système
**Documents recommandés :**
1. **Installation et Configuration** (README.md)
2. **Processus Complets 2024** - Section technique
3. **Nouveaux Champs 2024** - Migration des données
4. **Logs et Debugging** (via l'interface)

**Cas d'usage principaux :**
- Configuration initiale de l'application
- Gestion des utilisateurs et rôles
- Maintenance et monitoring
- Résolution des problèmes techniques

#### Gestionnaire Financier / CFO
**Documents recommandés :**
1. **Démarrage Rapide** - Section budgétaire
2. **Processus Complets 2024** - Section financière
3. **Nouveaux Champs 2024** - Gestion budgétaire
4. **Rapports** (via l'interface - onglet Rapports)

**Cas d'usage principaux :**
- Suivi des coûts et budgets
- Validation des dépenses
- Analyse ROI des licences
- Reporting financier

#### Manager d'Équipe
**Documents recommandés :**
1. **Démarrage Rapide** - Utilisation quotidienne
2. **Processus Complets 2024** - Gestion d'équipe
3. **Tutoriels interactifs** (F1 dans l'application)

**Cas d'usage principaux :**
- Gestion des accès de l'équipe
- Demandes de nouvelles licences
- Suivi de l'usage par l'équipe
- Validation des besoins

#### Utilisateur Final
**Documents recommandés :**
1. **Démarrage Rapide** - Les bases
2. **Tutoriels interactifs** (F1 dans l'application)
3. **Guide d'utilisation** (sections spécifiques)

**Cas d'usage principaux :**
- Consultation de ses accès
- Demande de nouvelles licences
- Mise à jour de ses informations
- Support de base

### 📚 Par Type de Documentation

#### Guides de Démarrage
- **DEMARRAGE-RAPIDE.md** : 5 minutes pour commencer
- **README.md** : Vue d'ensemble et installation
- **Configuration initiale** (section du processus complet)

#### Documentation Technique
- **Processus Complets 2024** : Workflows détaillés
- **Nouveaux Champs 2024** : Spécifications techniques
- **Architecture** (intégrée dans README.md)
- **API REST** : Documentation Supabase

#### Guides Utilisateur
- **Tutoriels interactifs** : Formation pas-à-pas
- **Guide d'utilisation** : Manuel utilisateur
- **FAQ** : Questions fréquentes
- **Support** : Contacts et ressources

### 🔍 Index par Fonctionnalité

#### Gestion des Utilisateurs
**Documents :** Processus Complets 2024 - Section 1
**Nouveautés 2024 :** 
- Champ \`responsable_id\` pour la hiérarchie
- \`budget_alloue\` pour le contrôle des coûts
- \`notes_internes\` pour le suivi personnalisé

#### Gestion des Logiciels
**Documents :** Processus Complets 2024 - Section 2
**Nouveautés 2024 :**
- \`logiciel_de_base\` pour les dépendances
- \`application_shopify\` pour le e-commerce
- \`payer_id\` pour la responsabilité financière
- \`moyen_paiement\` et \`periodicite\` pour l'automatisation

#### Gestion des Accès
**Documents :** Processus Complets 2024 - Section 3
**Nouveautés 2024 :**
- \`statut_acces\` pour un suivi fin
- \`approuve_par\` pour la traçabilité
- Workflow d'approbation automatisé

#### Gestion Financière
**Documents :** 
- Processus Complets 2024 - Section 5
- Nouveaux Champs 2024 - Gestion budgétaire
**Fonctionnalités :**
- Budgets par utilisateur et logiciel
- Suivi des moyens de paiement
- Rapports de variance automatiques

#### Rapports et Analyses
**Documents :** Processus Complets 2024 - Section 6
**Accès :** Onglet Rapports dans l'application
**Types disponibles :**
- Rapports financiers
- Analyses d'usage
- Tableaux de bord interactifs
- Exports Excel/PDF

### 🛠️ Guides de Maintenance

#### Mise à Jour
1. **Sauvegarde** : Procédure complète
2. **Migration** : Scripts et validation
3. **Tests** : Checklist post-migration
4. **Rollback** : Procédure d'urgence

#### Monitoring
1. **Logs système** : Interprétation et actions
2. **Performance** : Métriques clés
3. **Sécurité** : Audit et conformité
4. **Alertes** : Configuration et réponse

### 📞 Support et Ressources

#### Support Technique
- **Logs en temps réel** : Onglet Logs
- **Console de debugging** : Outils développeur
- **Documentation API** : Supabase REST API
- **GitHub Issues** : Rapporter des bugs

#### Formation
- **Tutoriels interactifs** : Intégrés à l'application (F1)
- **Vidéos** : Chaîne YouTube (à venir)
- **Webinaires** : Sessions mensuelles
- **Documentation** : Mise à jour continue

#### Communauté
- **Forum** : Questions et partages
- **Discord** : Support en temps réel
- **Newsletter** : Nouvelles fonctionnalités
- **Roadmap** : Évolutions prévues

### 🔄 Processus de Mise à Jour

#### Versioning de la Documentation
- **Version majeure** : Changements structurels
- **Version mineure** : Nouvelles fonctionnalités
- **Patch** : Corrections et améliorations
- **Nightly** : Documentation de développement

#### Contribution
- **Pull Requests** : Améliorations communautaires
- **Issues** : Signaler des erreurs
- **Suggestions** : Nouvelles sections
- **Traductions** : Versions multilingues

### 📋 Checklist par Rôle

#### Nouvel Administrateur
- [ ] Lire README.md complet
- [ ] Suivre le guide d'installation
- [ ] Configurer la base de données
- [ ] Créer les premiers utilisateurs
- [ ] Tester les fonctionnalités principales
- [ ] Configurer les sauvegardes

#### Nouveau Manager
- [ ] Lire Démarrage Rapide
- [ ] Suivre les tutoriels interactifs
- [ ] Comprendre la gestion d'équipe
- [ ] Tester l'attribution d'accès
- [ ] Apprendre les rapports de base

#### Nouvel Utilisateur
- [ ] Lire les sections pertinentes du Démarrage Rapide
- [ ] Suivre le tutoriel F1
- [ ] Se familiariser avec l'interface
- [ ] Tester ses accès
- [ ] Connaître le processus de demande

Cette documentation est vivante et s'enrichit continuellement avec les retours utilisateurs et les évolutions de l'application.`;

            default:
                return `# Document Non Trouvé

Le document demandé (${filename}) n'a pas pu être chargé.

## Documents Disponibles
- DEMARRAGE-RAPIDE.md
- PROCESSUS-COMPLET-2024.md  
- NOUVEAUX-CHAMPS-2024.md
- DOCUMENTATION-INDEX.md

Veuillez sélectionner un document valide dans la navigation.`;
        }
    }

    convertMarkdownToHTML(markdown) {
        // Conversion basique Markdown vers HTML
        let html = markdown;
        
        // Titres
        html = html.replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-gray-900 mt-6 mb-3">$1</h3>');
        html = html.replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold text-gray-900 mt-8 mb-4">$1</h2>');
        html = html.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-6">$1</h1>');
        
        // Code inline avec backticks
        html = html.replace(/\`([^`]+)\`/g, '<code class="bg-gray-100 text-red-600 px-2 py-1 rounded text-sm font-mono">$1</code>');
        
        // Gras
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
        
        // Italique
        html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
        
        // Listes non ordonnées
        html = html.replace(/^- (.*$)/gm, '<li class="ml-4 mb-1">• $1</li>');
        
        // Listes ordonnées
        html = html.replace(/^\d+\. (.*$)/gm, '<li class="ml-4 mb-1 list-decimal">$1</li>');
        
        // Paragraphes
        html = html.replace(/\n\n/g, '</p><p class="mb-4">');
        html = '<p class="mb-4">' + html + '</p>';
        
        // Nettoyer les paragraphes vides
        html = html.replace(/<p class="mb-4"><\/p>/g, '');
        
        return html;
    }

    getWordCount(text) {
        return text.split(/\s+/).filter(word => word.length > 0).length;
    }

    updateNavigationButtons() {
        // Mettre à jour l'état actif des boutons de navigation
        document.querySelectorAll('.process-nav-btn').forEach(btn => {
            btn.classList.remove('border-blue-500', 'bg-blue-50');
            btn.classList.add('border-gray-200');
        });
        
        const activeBtn = document.querySelector(`[onclick="processManager.loadDocumentContent('${this.currentDocument}')"]`);
        if (activeBtn) {
            activeBtn.classList.remove('border-gray-200');
            activeBtn.classList.add('border-blue-500', 'bg-blue-50');
        }
    }

    setupEventListeners() {
        // Raccourcis clavier
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                this.printDocument();
            }
            if (e.key === 'F11') {
                e.preventDefault();
                this.toggleFullscreen();
            }
        });
    }

    printDocument() {
        const content = document.getElementById('document-content');
        if (content) {
            const printWindow = window.open('', '', 'height=600,width=800');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>${this.documents[this.currentDocument].title}</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 20px; }
                            h1, h2, h3 { color: #1f2937; }
                            code { background: #f3f4f6; padding: 2px 4px; border-radius: 3px; }
                            li { margin-bottom: 5px; }
                        </style>
                    </head>
                    <body>
                        <h1>${this.documents[this.currentDocument].title}</h1>
                        ${content.innerHTML}
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    }

    downloadDocument() {
        const content = document.getElementById('document-content');
        if (content) {
            const blob = new Blob([content.innerText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${this.currentDocument}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }

    toggleFullscreen() {
        const processPage = document.querySelector('.process-page');
        if (processPage) {
            if (processPage.classList.contains('fullscreen')) {
                processPage.classList.remove('fullscreen');
                document.body.style.overflow = '';
            } else {
                processPage.classList.add('fullscreen');
                document.body.style.overflow = 'hidden';
            }
        }
    }

    showDocumentError(message) {
        document.getElementById('document-content').innerHTML = `
            <div class="text-center py-12">
                <div class="text-red-500 text-6xl mb-4">⚠️</div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Erreur de Chargement</h3>
                <p class="text-gray-600 mb-6">${message}</p>
                <button onclick="processManager.loadDocumentContent('quick-start')" 
                        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    Retour au Guide de Démarrage
                </button>
            </div>
        `;
    }

    showError(message) {
        const container = document.getElementById('process-view');
        if (container) {
            container.innerHTML = `
                <div class="bg-white p-8 rounded-lg border border-red-200">
                    <div class="text-center">
                        <div class="text-red-500 text-6xl mb-4">❌</div>
                        <h2 class="text-2xl font-bold text-gray-900 mb-4">Erreur</h2>
                        <p class="text-gray-600 mb-6">${message}</p>
                        <button onclick="window.location.reload()" 
                                class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                            Recharger la Page
                        </button>
                    </div>
                </div>
            `;
        }
    }
}

// CSS pour le mode plein écran
const processCSS = `
    .process-page.fullscreen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9999;
        background: white;
        overflow-y: auto;
        padding: 20px;
    }
`;

// Ajouter le CSS pour le processus
const processStyleElement = document.createElement('style');
processStyleElement.textContent = processCSS;
document.head.appendChild(processStyleElement);

// Initialiser le ProcessManager
const processManager = new ProcessManager();
window.processManager = processManager;