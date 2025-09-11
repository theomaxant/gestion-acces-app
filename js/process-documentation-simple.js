/**
 * Version simplifiée du système de documentation
 * Sans erreurs de syntaxe
 */

class ProcessDocumentation {
    constructor() {
        this.processes = {
            'vue-ensemble': {
                title: '🎯 Vue d\'Ensemble du Système',
                category: 'Introduction',
                content: `# Vue d'Ensemble - Gestion des Accès Logiciels

## 🎯 Objectif Principal

Cette application permet de gérer complètement les licences logiciels, utilisateurs, équipes et coûts dans une organisation. Elle offre une solution centralisée pour :

- **Suivi des abonnements** logiciels et licences
- **Gestion des utilisateurs** et équipes
- **Contrôle des coûts** et budgets
- **Optimisation** des dépenses IT
- **Audit et conformité** des accès

## 🏗️ Architecture Technique

### Base de Données
- **Supabase** (PostgreSQL) pour le stockage
- **API REST** automatique pour les interactions
- **Authentification** intégrée avec sélection d'utilisateur

### Interface
- **Application web** responsive (HTML/CSS/JS)
- **Framework Tailwind CSS** pour le design
- **Chart.js** pour les graphiques et statistiques

### Fonctionnalités Principales
1. **Dashboard** avec statistiques en temps réel
2. **Gestion Utilisateurs** (création, modification, archivage)
3. **Gestion Logiciels** (catalogue, versions, coûts)
4. **Gestion des Accès** (permissions, dates d'expiration)
5. **Rapports Financiers** (coûts, budgets, optimisation)
6. **Système de Logs** complet pour l'audit

## 💡 Avantages

### Pour l'Organisation
- **Visibilité complète** sur les dépenses IT
- **Optimisation** des coûts (-20 à -40% typique)
- **Conformité** réglementaire assurée
- **Évolutivité** pour la croissance

### Pour les Gestionnaires
- **Interface intuitive** et moderne
- **Rapports automatisés** prêts pour la direction
- **Alertes proactives** sur les échéances
- **Vision 360°** des accès par équipe

## 🚀 Workflow Typique

1. **Création des équipes** et budgets
2. **Ajout des utilisateurs** par équipe
3. **Catalogage des logiciels** avec coûts
4. **Attribution des accès** aux utilisateurs
5. **Suivi des coûts** et optimisation
6. **Génération de rapports** périodiques`
            },
            'structure-donnees': {
                title: '🏗️ Structure des Données',
                category: 'Technique',
                content: `# Structure des Données - Tables et Relations

## 📊 Tables Principales

### 👥 Table \`utilisateurs\`
**Colonnes principales :**
- \`id\` (UUID, Clé Primaire)
- \`nom\` (VARCHAR) *obligatoire
- \`prenom\` (VARCHAR) *obligatoire
- \`email\` (VARCHAR) *obligatoire
- \`equipe\` (VARCHAR) -- Nom de l'équipe
- \`telephone\` (VARCHAR)
- \`poste\` (VARCHAR) -- Fonction/Rôle
- \`statut\` (VARCHAR: Actif/Inactif)
- \`date_creation\` (TIMESTAMP)
- \`archived\` (BOOLEAN) -- Archivage logique

**Utilisation :** Gestion de tous les employés ayant accès aux logiciels.

### 🏢 Table \`equipes\`
**Colonnes principales :**
- \`id\` (UUID, Clé Primaire)
- \`nom\` (VARCHAR) *obligatoire
- \`description\` (TEXT)
- \`budget_mensuel\` (DECIMAL)
- \`responsable\` (VARCHAR) -- Nom du responsable
- \`date_creation\` (TIMESTAMP)
- \`archived\` (BOOLEAN)

**Utilisation :** Organisation en équipes avec budgets dédiés.

### 💻 Table \`logiciels\`
**Colonnes principales :**
- \`id\` (UUID, Clé Primaire)
- \`nom\` (VARCHAR) *obligatoire
- \`editeur\` (VARCHAR)
- \`version\` (VARCHAR)
- \`description\` (TEXT)
- \`url_officiel\` (VARCHAR)
- \`categorie\` (VARCHAR) -- Type de logiciel
- \`equipe\` (VARCHAR) -- Équipe responsable
- \`qui_paye\` (VARCHAR) -- Qui finance
- \`moyen_paiement\` (VARCHAR)
- \`periodicite\` (VARCHAR)
- \`cout_mensuel\` (DECIMAL)
- \`date_souscription\` (DATE)
- \`statut\` (VARCHAR: Actif/Inactif/Test)
- \`archived\` (BOOLEAN)

**Utilisation :** Catalogue complet des logiciels et abonnements.

### 🎫 Table \`acces\`
**Colonnes principales :**
- \`id\` (UUID, Clé Primaire)
- \`logiciel_id\` (UUID, FK → logiciels.id)
- \`utilisateur_id\` (UUID, FK → utilisateurs.id)
- \`type_acces\` (VARCHAR) -- Admin/User/Lecture
- \`date_attribution\` (DATE)
- \`date_expiration\` (DATE)
- \`statut\` (VARCHAR: Actif/Suspendu/Expiré)
- \`commentaires\` (TEXT)
- \`archived\` (BOOLEAN)

**Utilisation :** Attribution et gestion des droits d'accès.

## 🔗 Relations entre Tables

### Utilisateurs ↔ Équipes
- Un utilisateur appartient à **une équipe**
- Une équipe contient **plusieurs utilisateurs**

### Logiciels ↔ Équipes
- Un logiciel est géré par **une équipe**
- Une équipe gère **plusieurs logiciels**

### Accès = Utilisateurs × Logiciels
- **Table de liaison** entre utilisateurs et logiciels
- **Historique complet** des attributions/révocations
- **Gestion temporelle** avec dates d'expiration

## 💾 Gestion des Données

### Archivage Logique
- **Pas de suppression** physique des données
- **Flag \`archived\`** pour masquer les éléments
- **Conservation** pour l'audit et historique

### Intégrité Référentielle
- **Clés étrangères** pour maintenir la cohérence
- **Validation** côté application et base de données
- **Gestion des erreurs** en cas de conflit`
            },
            'gestion-utilisateurs': {
                title: '👥 Gestion des Utilisateurs',
                category: 'Processus',
                content: `# Processus - Gestion des Utilisateurs

## 🎯 Objectifs

La gestion des utilisateurs permet de :
- **Créer** les profils des employés
- **Organiser** les équipes et responsabilités
- **Suivre** les accès et permissions
- **Maintenir** la sécurité et conformité

## 📋 Processus de Création d'Utilisateur

### 1. Informations de Base
**Données obligatoires :**
- **Nom** et **Prénom** complets
- **Email professionnel** (unique)
- **Équipe** d'appartenance
- **Poste/Fonction** dans l'organisation

**Données optionnelles :**
- **Téléphone** professionnel
- **Commentaires** spécifiques

### 2. Validation et Contrôles
- ✅ **Email unique** dans le système
- ✅ **Équipe existante** sélectionnée
- ✅ **Format email** valide
- ✅ **Champs obligatoires** remplis

### 3. Attribution Automatique
Après création, l'utilisateur :
- **Apparaît** dans la liste globale
- **Devient disponible** pour attribution d'accès
- **Génère un log** de création avec horodatage
- **Reçoit un statut** "Actif" par défaut

## 🔄 Processus de Modification

### Modification des Informations
1. **Sélectionner** l'utilisateur dans la liste
2. **Cliquer** sur les champs à modifier
3. **Valider** les changements
4. **Enregistrement** automatique avec log

### Changement d'Équipe
1. **Identifier** l'utilisateur à transférer
2. **Sélectionner** la nouvelle équipe
3. **Vérifier** l'impact sur les accès existants
4. **Confirmer** le transfert
5. **Mise à jour** automatique des permissions

## 📦 Processus d'Archivage

### Quand Archiver ?
- **Départ** de l'employé (fin de contrat)
- **Changement de fonction** (plus besoin d'accès)
- **Réorganisation** d'équipe

### Procédure d'Archivage
1. **Révision** des accès actifs
2. **Révocation automatique** de tous les accès
3. **Archivage logique** (pas de suppression)
4. **Conservation** pour l'audit
5. **Notification** dans les logs

### Impact de l'Archivage
- ❌ **N'apparaît plus** dans les listes actives
- ❌ **Ne peut plus** recevoir de nouveaux accès
- ✅ **Historique conservé** pour audit
- ✅ **Données accessibles** via les rapports

## 🔍 Bonnes Pratiques

### Création d'Utilisateurs
- **Utiliser l'email professionnel** comme identifiant unique
- **Assigner immédiatement** à la bonne équipe
- **Renseigner le poste** pour faciliter la gestion des accès
- **Vérifier l'orthographe** des noms pour les rapports

### Maintenance Régulière
- **Révision trimestrielle** de la liste des utilisateurs
- **Mise à jour** des changements organisationnels
- **Archivage** des comptes inactifs
- **Vérification** des informations de contact

## 📊 Suivi et Reporting

### Métriques Importantes
- **Nombre total** d'utilisateurs actifs
- **Répartition par équipe**
- **Taux de rotation** (créations/archivages)
- **Utilisateurs sans accès** (à surveiller)

### Rapports Disponibles
- **Liste complète** des utilisateurs
- **Utilisateurs par équipe** avec détails
- **Historique des modifications**
- **Audit des archivages**`
            },
            'gestion-logiciels': {
                title: '💻 Gestion des Logiciels',
                category: 'Processus',
                content: `# Processus - Gestion des Logiciels

## 🎯 Objectifs

La gestion des logiciels permet de :
- **Centraliser** le catalogue des applications
- **Suivre** les coûts et abonnements
- **Optimiser** les dépenses IT
- **Maintenir** l'inventaire à jour

## 📋 Processus d'Ajout de Logiciel

### 1. Informations Essentielles
**Données obligatoires :**
- **Nom du logiciel** (exact et complet)
- **Éditeur/Fournisseur**
- **Version** actuelle
- **Équipe responsable** de la gestion

**Données financières :**
- **Coût mensuel** (si applicable)
- **Périodicité** (mensuel/annuel/trimestriel)
- **Qui paye** (équipe/service/direction)
- **Moyen de paiement**

### 2. Informations Complémentaires
- **Description** fonctionnelle
- **URL officielle** du logiciel
- **Catégorie** (Bureautique/Développement/Design...)
- **Date de souscription**

### 3. Classification Avancée
- **Logiciel de base** (essentiel à l'organisation)
- **Application Shopify** (si e-commerce)
- **Statut** (Actif/Test/Inactif)

## 💰 Gestion Financière

### Coûts et Budgets
1. **Saisir le coût mensuel** réel
2. **Spécifier la périodicité** de facturation
3. **Assigner** à l'équipe responsable
4. **Calculer** automatiquement le coût annuel

### Optimisation des Coûts
- **Identifier** les doublons potentiels
- **Analyser** le taux d'utilisation
- **Négocier** les renouvellements
- **Consolider** les licences similaires

## 🔄 Processus de Mise à Jour

### Changement de Version
1. **Vérifier** la nouvelle version disponible
2. **Tester** en environnement de test
3. **Planifier** la migration
4. **Mettre à jour** les informations
5. **Notifier** les utilisateurs concernés

### Modification des Coûts
1. **Recevoir** la notification du fournisseur
2. **Valider** le nouveau tarif
3. **Mettre à jour** le coût mensuel
4. **Recalculer** l'impact budgétaire
5. **Informer** l'équipe financière

## 📅 Gestion des Échéances

### Suivi des Renouvellements
- **Calculer automatiquement** les prochaines échéances
- **Alertes** 30 jours avant expiration
- **Évaluation** de la reconduction
- **Négociation** des nouveaux contrats

### Processus de Renouvellement
1. **Révision** de l'utilisation réelle
2. **Analyse** du ROI
3. **Négociation** avec le fournisseur
4. **Décision** de reconduction
5. **Mise à jour** des informations

## 🔍 Bonnes Pratiques

### Catalogue Logiciels
- **Noms standardisés** et cohérents
- **Descriptions précises** des fonctionnalités
- **URLs officielles** à jour
- **Versions exactes** maintenues

### Gestion des Coûts
- **Coûts TTC** pour la comptabilité
- **Périodicité réelle** de facturation
- **Attribution claire** des responsabilités
- **Suivi mensuel** des dépenses

## 📊 Métriques et Analyses

### Indicateurs Clés
- **Nombre total** de logiciels actifs
- **Coût mensuel global**
- **Répartition par équipe**
- **Logiciels les plus coûteux**

### Analyses d'Optimisation
- **Logiciels sous-utilisés** (< 50% utilisation)
- **Doublons fonctionnels** potentiels
- **Opportunités de consolidation**
- **Négociations de groupe** possibles`
            },
            'gestion-acces': {
                title: '🎫 Gestion des Accès',
                category: 'Processus',
                content: `# Processus - Gestion des Accès

## 🎯 Objectifs

La gestion des accès permet de :
- **Attribuer** les droits d'utilisation des logiciels
- **Contrôler** les permissions et niveaux d'accès
- **Suivre** les dates d'expiration et renouvellements
- **Maintenir** la sécurité et conformité

## 📋 Processus d'Attribution d'Accès

### 1. Préparation
**Vérifications préalables :**
- ✅ **Utilisateur actif** dans le système
- ✅ **Logiciel disponible** et actif
- ✅ **Budget disponible** dans l'équipe
- ✅ **Justification** de la demande

### 2. Configuration de l'Accès
**Informations requises :**
- **Utilisateur** bénéficiaire
- **Logiciel** concerné
- **Type d'accès** (Administrateur/Utilisateur/Lecture)
- **Date d'attribution**
- **Date d'expiration** (si applicable)

**Données complémentaires :**
- **Commentaires** sur l'attribution
- **Raison** de l'octroi d'accès
- **Validation** du responsable

### 3. Types d'Accès Disponibles

#### 🔑 **Administrateur**
- **Droits complets** sur le logiciel
- **Gestion** des autres utilisateurs
- **Configuration** avancée
- **Coût** : Premium

#### 👤 **Utilisateur Standard**
- **Utilisation complète** des fonctionnalités
- **Création/Modification** de contenu
- **Accès** aux fonctions principales
- **Coût** : Standard

#### 👁️ **Lecture Seule**
- **Consultation** uniquement
- **Rapports** et visualisations
- **Pas de modification**
- **Coût** : Minimal

#### 🏢 **Accès Commun**
- **Compte partagé** équipe
- **Usage** ponctuel/collectif
- **Pas d'attribution** individuelle
- **Coût** : Mutualisé

## ⏰ Gestion Temporelle

### Accès Temporaires
1. **Définir** la période d'accès
2. **Configurer** la date d'expiration
3. **Programmer** les notifications
4. **Révocation** automatique

### Accès Permanents
- **Pas de date d'expiration**
- **Révision** annuelle obligatoire
- **Contrôle** de l'utilisation réelle
- **Optimisation** continue

## 🔄 Processus de Modification

### Changement de Type d'Accès
1. **Évaluer** les besoins actuels
2. **Modifier** le type d'accès
3. **Ajuster** le coût associé
4. **Notifier** l'utilisateur
5. **Logger** la modification

### Extension de Période
1. **Vérifier** la justification
2. **Prolonger** la date d'expiration
3. **Recalculer** l'impact financier
4. **Confirmer** avec le responsable

## 🚫 Processus de Révocation

### Révocation Immédiate
**Cas d'usage :**
- Départ de l'employé
- Fin de projet/mission
- Violation des politiques
- Réorganisation

**Procédure :**
1. **Identifier** l'accès à révoquer
2. **Confirmer** la révocation
3. **Désactiver** immédiatement
4. **Archiver** l'accès
5. **Documenter** la raison

## 💰 Impact Financier

### Calcul des Coûts
- **Type d'accès** × **Coût mensuel**
- **Prorata** pour les accès partiels
- **Facturation** à l'équipe responsable
- **Suivi budgétaire** en temps réel

### Optimisation des Coûts
- **Éviter** les doublons d'accès
- **Downgrader** les accès sur-dimensionnés
- **Mutualiser** les accès communs
- **Négocier** les tarifs de groupe

## 🔍 Contrôles et Audits

### Contrôles Réguliers
- **Révision mensuelle** des accès actifs
- **Vérification** des dates d'expiration
- **Audit** de l'utilisation réelle
- **Nettoyage** des accès inutiles

### Alertes Automatiques
- **Expiration** dans 30/15/7 jours
- **Dépassement** budgétaire équipe
- **Accès inutilisés** depuis 30 jours
- **Anomalies** de coût`
            },
            'rapports-financiers': {
                title: '📊 Rapports Financiers',
                category: 'Analyse',
                content: `# Processus - Rapports Financiers et Optimisation

## 🎯 Objectifs

Les rapports financiers permettent de :
- **Analyser** les coûts IT de l'organisation
- **Optimiser** les dépenses logicielles
- **Préparer** les budgets prévisionnels
- **Justifier** les investissements IT

## 📊 Types de Rapports Disponibles

### 1. Rapport par Logiciels
**Contenu :**
- Liste complète des logiciels avec coûts
- Coût mensuel et annuel par logiciel
- Nombre d'utilisateurs par logiciel
- Coût par utilisateur (efficience)
- Statut et dates importantes

**Utilisation :**
- Identification des logiciels les plus coûteux
- Analyse du ROI par outil
- Négociation avec les fournisseurs
- Décisions de renouvellement

### 2. Rapport par Utilisateurs
**Contenu :**
- Coût total par utilisateur
- Détail des accès par personne
- Répartition des coûts par équipe
- Utilisateurs les plus "coûteux"

**Utilisation :**
- Analyse de l'efficience par employé
- Optimisation des attributions
- Budgétisation par poste
- Contrôle des sur-attributions

### 3. Rapport par Équipes
**Contenu :**
- Budget vs dépenses réelles
- Coûts par équipe/département
- Dépassements budgétaires
- Évolution mensuelle

**Utilisation :**
- Contrôle budgétaire
- Allocation des ressources
- Performance des équipes
- Planification financière

## 💰 Analyses Financières Avancées

### Calcul des Coûts Réels
**Formules clés :**
- \`Coût Total Mensuel = Σ (Logiciel_i × Coût_Mensuel_i)\`
- \`Coût Total Annuel = Coût_Mensuel × 12\`
- \`Coût par Utilisateur = Coût_Total / Nombre_Utilisateurs_Actifs\`

### Métriques d'Efficience
- **Coût par employé** et par équipe
- **Taux d'utilisation** des logiciels
- **ROI** par investissement logiciel
- **Évolution** des coûts dans le temps

## 📈 Processus d'Optimisation

### 1. Identification des Opportunités

#### Logiciels Sous-Utilisés
- **Critère :** < 50% d'utilisation vs licences
- **Action :** Réduction du nombre de licences
- **Économie potentielle :** 20-40%

#### Doublons Fonctionnels
- **Critère :** Logiciels avec fonctions similaires
- **Action :** Consolidation sur un seul outil
- **Économie potentielle :** 30-50%

#### Sur-Licenciement
- **Critère :** Accès Premium pour usage basique
- **Action :** Downgrade vers licence standard
- **Économie potentielle :** 15-25%

### 2. Plan d'Action d'Optimisation

#### Phase 1 : Audit (1 mois)
1. **Inventaire complet** des logiciels
2. **Analyse** de l'utilisation réelle
3. **Identification** des doublons
4. **Calcul** des économies potentielles

#### Phase 2 : Négociation (2 mois)
1. **Regroupement** des renouvellements
2. **Négociation** des tarifs de groupe
3. **Révision** des contrats existants
4. **Optimisation** des types de licences

## 📋 Processus de Budgétisation

### Budget Annuel IT
1. **Analyse** des coûts de l'année N-1
2. **Projection** des besoins année N+1
3. **Intégration** des nouveaux projets
4. **Négociation** avec la direction
5. **Validation** et allocation par équipe

### Suivi Budgétaire Mensuel
- **Comparaison** budget vs réalisé
- **Analyse** des écarts significatifs
- **Prévision** de l'atterrissage annuel
- **Actions correctives** si nécessaire

## 📊 Tableaux de Bord Exécutifs

### Indicateurs Clés (KPI)
- **Coût IT total** (mensuel/annuel)
- **Coût par employé**
- **Évolution** vs année précédente
- **Taux d'optimisation** réalisée

### Reporting Direction
**Fréquence :** Mensuelle
**Format :** Synthèse 1 page + détails annexes
**Contenu :**
- Coûts consolidés
- Évolution vs budget
- Principales économies réalisées
- Alertes et recommandations

## 🎯 Stratégies d'Optimisation

### Négociation Fournisseurs
- **Contrats pluriannuels** (remises 10-15%)
- **Licences en volume** (remises 15-30%)
- **Timing** des renouvellements (fin d'exercice)
- **Benchmarking** concurrentiel

### Rationalisation du Parc
- **Standardisation** sur outils communs
- **Élimination** des redondances
- **Mutualisation** des accès
- **Optimisation** des niveaux de service

## 📈 ROI et Justification

### Calcul du ROI Logiciel
**Formule :**
\`ROI = (Gains - Coût_Logiciel) / Coût_Logiciel × 100\`

**Gains mesurables :**
- Productivité augmentée
- Processus automatisés
- Erreurs réduites
- Temps économisé

### Business Case Type
1. **Problématique** actuelle identifiée
2. **Solution** logicielle proposée
3. **Coûts** détaillés (licence + formation + maintenance)
4. **Bénéfices** quantifiés sur 3 ans
5. **ROI** calculé et temps de retour`
            },
            'logs-audit': {
                title: '📝 Logs et Audit',
                category: 'Conformité',
                content: `# Processus - Logs et Audit

## 🎯 Objectifs du Système de Logs

Le système de logs permet de :
- **Tracer** toutes les actions effectuées
- **Identifier** qui a fait quoi et quand
- **Assurer** la conformité réglementaire
- **Faciliter** les audits internes/externes

## 📋 Types d'Événements Loggés

### Actions Utilisateurs
- ➕ **CREATE** : Création d'enregistrements
- ✏️ **UPDATE** : Modification de données
- 🗑️ **DELETE** : Suppression/Archivage
- 👤 **LOGIN** : Connexions au système
- 👋 **LOGOUT** : Déconnexions

### Actions Système
- 📤 **EXPORT** : Exports de données
- 📥 **IMPORT** : Imports de données
- 💾 **BACKUP** : Sauvegardes
- ⚙️ **CONFIG_CHANGE** : Modifications de configuration
- ❌ **ERROR** : Erreurs système

## 🔍 Informations Capturées

### Données Standard
**Structure type d'un log :**
- \`action\` : CREATE/UPDATE/DELETE/LOGIN
- \`table_name\` : utilisateurs/logiciels/acces
- \`record_id\` : UUID de l'enregistrement
- \`user_info\` : Utilisateur connecté avec détails
- \`timestamp\` : Horodatage précis
- \`old_values\` : Anciennes valeurs (si modification)
- \`new_values\` : Nouvelles valeurs
- \`details\` : Description de l'action

### Métadonnées Techniques
- **Horodatage précis** (avec millisecondes)
- **Adresse IP** de l'utilisateur (si applicable)
- **Navigateur** et version
- **Session ID** unique
- **Source** de l'action (interface/API)

## 📊 Consultation des Logs

### Interface de Visualisation
**Filtres disponibles :**
- Par utilisateur
- Par période (date début/fin)
- Par type d'action
- Par table concernée

**Options d'affichage :**
- Ordre chronologique (descendant par défaut)
- Recherche par mot-clé
- Pagination des résultats
- Vue détaillée avec avant/après

### Exports et Rapports
- **Export CSV** pour analyse externe
- **Rapports PDF** pour audits
- **Filtrage** par critères multiples
- **Agrégation** par utilisateur/période

## 🔒 Conformité et Sécurité

### Conformité RGPD
- **Pseudonymisation** des données sensibles
- **Droit à l'oubli** : archivage contrôlé
- **Minimisation** des données loggées
- **Consentement** éclairé des utilisateurs

### Intégrité des Logs
- **Immutabilité** : pas de modification possible
- **Horodatage** cryptographique
- **Hachage** pour détecter les altérations
- **Sauvegarde** sécurisée et régulière

## 📋 Processus d'Audit

### Audit Interne (Trimestriel)

#### 1. Préparation
- **Période** à auditer définie
- **Périmètre** : tables/utilisateurs concernés
- **Objectifs** spécifiques identifiés

#### 2. Collecte des Données
- **Export** des logs de la période
- **Filtrage** par critères d'audit
- **Regroupement** par type d'action
- **Analyse** des patterns anormaux

#### 3. Analyse et Contrôles
- **Vérification** de la complétude des logs
- **Détection** d'actions suspectes
- **Validation** des autorisations
- **Contrôle** de séparation des tâches

#### 4. Rapport d'Audit
- **Synthèse** des actions de la période
- **Anomalies** détectées et explications
- **Recommandations** d'amélioration
- **Plan d'action** correctif

### Audit Externe (Annuel)

#### Préparation Documentation
1. **Politique** de logs et audit
2. **Procédures** de gestion des accès
3. **Rapports** d'audits internes
4. **Preuves** de conformité RGPD

#### Mise à Disposition
- **Accès** en lecture seule aux logs
- **Exports** sécurisés des données
- **Documentation** des processus
- **Support** technique pour questions

## 🚨 Détection d'Anomalies

### Alertes Automatiques
- **Connexions** en dehors des heures
- **Actions** en masse suspectes
- **Modifications** de données sensibles
- **Échecs** de connexion répétés

### Patterns Suspects
- **Créations/suppressions** en série
- **Accès** à des données non liées au poste
- **Modifications** sans justification
- **Exports** massifs de données

## 📈 Métriques et KPI

### Activité Utilisateurs
- **Nombre** de connexions par jour/semaine
- **Durée** moyenne des sessions
- **Actions** les plus fréquentes
- **Répartition** par équipe/utilisateur

### Performance Système
- **Volume** de logs générés
- **Temps** de réponse des requêtes
- **Espace** de stockage utilisé
- **Taux** de disponibilité du système

## 🛠️ Maintenance des Logs

### Archivage Automatique
- **Rétention** : 7 ans pour conformité
- **Compression** des logs anciens
- **Sauvegarde** sur supports externes
- **Purge** automatique après expiration

### Optimisation Performance
- **Indexation** des colonnes fréquemment utilisées
- **Partitionnement** par période
- **Archivage** des données anciennes
- **Monitoring** des performances

## 📋 Bonnes Pratiques

### Pour les Utilisateurs
- **Toujours** s'identifier correctement
- **Documenter** les raisons des actions importantes
- **Respecter** les procédures établies
- **Signaler** toute anomalie détectée

### Pour les Administrateurs
- **Réviser** régulièrement les logs
- **Maintenir** la documentation à jour
- **Former** les utilisateurs aux bonnes pratiques
- **Assurer** la sécurité du système de logs`
            }
        };
        console.log('[PROCESS-DOC-SIMPLE] Initialisé avec', Object.keys(this.processes).length, 'processus');
    }

    showProcess(processId) {
        console.log('[PROCESS-DOC-SIMPLE] Affichage du processus (modal):', processId);
        
        const process = this.processes[processId];
        if (!process) {
            alert('Processus non trouvé: ' + processId);
            return;
        }

        // Créer un modal simple
        const modal = document.createElement('div');
        modal.id = 'simple-doc-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-full overflow-hidden">
                <div class="bg-blue-600 text-white p-4 flex justify-between items-center">
                    <h2 class="text-xl font-bold">${process.title}</h2>
                    <button onclick="this.closest('#simple-doc-modal').remove()" class="text-white hover:text-gray-300">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="p-6 overflow-y-auto max-h-96">
                    <div class="prose max-w-none">
                        ${this.convertMarkdownToHTML(process.content)}
                    </div>
                    <div class="mt-6 pt-4 border-t">
                        <button onclick="window.exportProcessMarkdown('${processId}')" 
                                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                            <i class="fas fa-download mr-2"></i>Exporter en Markdown
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    showProcessInline(processId) {
        console.log('[PROCESS-DOC-SIMPLE] Affichage du processus (inline):', processId);
        
        const process = this.processes[processId];
        if (!process) {
            console.error('Processus non trouvé:', processId);
            return;
        }

        // Trouver la zone de contenu
        const contentArea = document.getElementById('process-content-area');
        if (!contentArea) {
            console.error('Zone de contenu non trouvée');
            return;
        }

        // Mettre à jour les boutons actifs
        this.updateActiveMenuButton(processId);

        // Afficher le contenu
        contentArea.innerHTML = `
            <div class="max-w-none">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b gap-4">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900">${process.title}</h2>
                        <p class="text-sm text-gray-600 mt-1">Catégorie: ${process.category}</p>
                    </div>
                    <button onclick="window.exportProcessMarkdown('${processId}')" 
                            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
                        <i class="fas fa-download mr-2"></i>Exporter MD
                    </button>
                </div>
                <div class="prose prose-lg max-w-none leading-relaxed">
                    ${this.convertMarkdownToHTML(process.content)}
                </div>
            </div>
        `;

        // Scroll automatique vers le contenu
        setTimeout(() => {
            contentArea.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 100);
    }

    updateActiveMenuButton(activeProcessId) {
        // Supprimer l'état actif de tous les boutons
        document.querySelectorAll('.process-menu-btn').forEach(btn => {
            btn.classList.remove('bg-blue-100', 'border-blue-300');
            btn.classList.add('border-transparent');
        });

        // Activer le bouton sélectionné
        const activeBtn = document.querySelector(`[data-process="${activeProcessId}"]`);
        if (activeBtn) {
            activeBtn.classList.add('bg-blue-100', 'border-blue-300');
            activeBtn.classList.remove('border-transparent');
        }
    }

    convertMarkdownToHTML(markdown) {
        let html = markdown;
        
        // Titres avec des styles améliorés
        html = html.replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-6 text-gray-900 border-b pb-2">$1</h1>');
        html = html.replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mb-4 mt-8 text-gray-800">$1</h2>');
        html = html.replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mb-3 mt-6 text-gray-700">$1</h3>');
        html = html.replace(/^#### (.*$)/gm, '<h4 class="text-lg font-medium mb-2 mt-4 text-gray-700">$1</h4>');
        
        // Listes avec puces
        html = html.replace(/^- (.*$)/gm, '<li class="mb-1">$1</li>');
        html = html.replace(/(<li.*?<\/li>)/gs, '<ul class="list-disc list-inside mb-4 space-y-1 ml-4">$1</ul>');
        
        // Texte en gras et italique
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
        
        // Code inline
        html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">$1</code>');
        
        // Paragraphes
        html = html.replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 leading-relaxed">');
        html = '<p class="mb-4 text-gray-700 leading-relaxed">' + html + '</p>';
        
        // Nettoyer les paragraphes vides
        html = html.replace(/<p class="mb-4 text-gray-700 leading-relaxed"><\/p>/g, '');
        
        return html;
    }
}

// Export global pour la fonction d'export
window.exportProcessMarkdown = (processId) => {
    const instance = window.processDocSimple || new ProcessDocumentation();
    const process = instance.processes[processId];
    if (process) {
        const blob = new Blob([process.content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${process.title.replace(/[^a-zA-Z0-9]/g, '-')}.md`;
        a.click();
        URL.revokeObjectURL(url);
        console.log('[EXPORT] Processus exporté:', processId);
    }
};

// Exposition globale
window.ProcessDocumentation = ProcessDocumentation;
window.processDocSimple = new ProcessDocumentation();

// Fonction globale pour l'affichage inline
window.showProcessInline = (processId) => {
    if (window.processDocSimple && typeof window.processDocSimple.showProcessInline === 'function') {
        window.processDocSimple.showProcessInline(processId);
    } else {
        console.error('[PROCESS-DOC] Instance non disponible');
    }
};

// Pas d'auto-chargement - l'utilisateur sélectionne le processus qu'il veut voir

console.log('[PROCESS-DOC-SIMPLE] Système simple chargé et prêt');