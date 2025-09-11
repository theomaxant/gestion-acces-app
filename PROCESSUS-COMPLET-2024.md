# 📋 PROCESSUS COMPLETS - Gestion des Accès Logiciels (2024)

## 🎯 Vue d'Ensemble

Cette application de gestion des accès logiciels permet de gérer complètement les licences, utilisateurs, équipes et coûts dans une organisation. Basée sur **Supabase** (PostgreSQL + API REST), elle offre une solution complète pour le suivi et l'optimisation des abonnements logiciels.

## 🏗️ Structure des Données

### Tables Principales

#### 👥 **Utilisateurs** (`utilisateurs`)
```sql
- id (UUID, PK)
- nom (VARCHAR) *
- prenom (VARCHAR) *  
- email (VARCHAR) *
- equipe_id (UUID, FK → equipes.id)
- telephone (VARCHAR)
- statut (VARCHAR: Actif/Inactif)
- date_creation (TIMESTAMP)
- archived (BOOLEAN)
```

#### 🏢 **Équipes** (`equipes`) 
```sql
- id (UUID, PK)
- nom (VARCHAR) *
- description (TEXT)
- budget_mensuel (DECIMAL)
- responsable_id (UUID, FK → utilisateurs.id)
- date_creation (TIMESTAMP)
```

#### 💻 **Logiciels** (`logiciels`)
```sql
- id (UUID, PK)
- nom (VARCHAR) *
- editeur (VARCHAR)
- version (VARCHAR)
- description (TEXT)
- url_officiel (VARCHAR)
- logiciel_de_base (BOOLEAN) -- Logiciel essentiel
- application_shopify (BOOLEAN) -- Spécifique e-commerce
- equipe_id (UUID, FK → equipes.id)
- payer_id (UUID, FK → utilisateurs.id) -- Qui paye
- moyen_paiement (VARCHAR: carte/prelevement/virement)
- periodicite (VARCHAR: mensuel/annuel/trimestriel)
- date_souscription (DATE)
- statut (VARCHAR: Actif/Inactif/Test)
- archived (BOOLEAN)
- date_creation (TIMESTAMP)
```

#### 🔑 **Types de Droits** (`droits`)
```sql
- id (UUID, PK)
- nom (VARCHAR) * -- Administrateur/Utilisateur/Lecture/Accès communs
- description (TEXT)
- niveau_acces (INTEGER) -- Niveau numérique (1-5)
```

#### 🎫 **Accès Utilisateur-Logiciel** (`acces`)
```sql
- id (UUID, PK)
- utilisateur_id (UUID, FK → utilisateurs.id) *
- logiciel_id (UUID, FK → logiciels.id) *
- droit_id (UUID, FK → droits.id) *
- date_attribution (TIMESTAMP)
- date_expiration (DATE)
- statut (VARCHAR: Actif/Suspendu/Expiré)
- commentaires (TEXT)
```

#### 💰 **Coûts des Licences** (`couts_licences`)
```sql
- id (UUID, PK)
- logiciel_id (UUID, FK → logiciels.id) *
- droit_id (UUID, FK → droits.id) *
- cout_mensuel (DECIMAL) * -- Coût par utilisateur/mois
- devise (VARCHAR: EUR/USD/GBP)
- date_debut (DATE)
- date_fin (DATE)
- actif (BOOLEAN)
```

#### 📊 **Logs d'Audit** (`logs`)
```sql
- id (UUID, PK)
- utilisateur_id (UUID, FK → utilisateurs.id)
- action (VARCHAR) -- CREATE/UPDATE/DELETE/LOGIN
- table_concernee (VARCHAR)
- details (JSONB) -- Données de l'action
- adresse_ip (VARCHAR)
- timestamp (TIMESTAMP)
```

## 🔄 PROCESSUS OPÉRATIONNELS

---

## 1. 👤 GESTION DES UTILISATEURS

### ➕ Création d'un Utilisateur

**Prérequis :** Équipes créées

**Étapes :**
1. **Accéder** → Onglet "Utilisateurs" → Bouton "Nouvel Utilisateur"
2. **Saisir les informations obligatoires :**
   - Nom *
   - Prénom * 
   - Email * (validation format)
   - Équipe (sélection dans liste déroulante)
3. **Informations optionnelles :**
   - Téléphone (format international recommandé)
   - Statut (Actif par défaut)
4. **Validation :** Bouton "Créer l'utilisateur"

**Résultat :** 
- Utilisateur créé avec ID unique
- Ajout automatique dans l'équipe sélectionnée
- Log d'audit généré
- Email de bienvenue (si configuré)

**Erreurs possibles :**
- Email déjà utilisé → Message d'erreur
- Équipe inexistante → Sélection obligatoire
- Format email invalide → Validation client

### ✏️ Modification d'un Utilisateur

**Prérequis :** Utilisateur existant

**Étapes :**
1. **Localiser** → Recherche par nom/email ou tri par colonnes
2. **Éditer** → Clic sur l'icône crayon ou double-clic sur la ligne
3. **Modifier** → Changements autorisés :
   - Toutes les données personnelles
   - Changement d'équipe (impact sur les accès)
   - Changement de statut (Actif ↔ Inactif)
4. **Sauvegarder** → Bouton "Mettre à jour"

**Impact automatique :**
- Changement d'équipe → Révision des accès logiciels
- Passage en Inactif → Suspension des accès (statut "Suspendu")
- Logs détaillés des modifications

### 🗂️ Archivage d'un Utilisateur

**Prérequis :** Utilisateur à archiver (ex-employé)

**Étapes :**
1. **Sélectionner** → Utilisateur dans la liste
2. **Archiver** → Bouton "Archiver" (icône dossier)
3. **Confirmer** → Dialog de confirmation avec impact :
   - Suppression de tous les accès logiciels
   - Conservation des données pour audit
   - Suppression des coûts futurs
4. **Validation** → Archivage définitif

**Résultat :**
- Utilisateur masqué des listes actives
- Accès logiciels supprimés automatiquement  
- Données historiques conservées
- Économies calculées et reportées

---

## 2. 🏢 GESTION DES ÉQUIPES

### ➕ Création d'une Équipe

**Étapes :**
1. **Accéder** → Onglet "Équipes" → Bouton "Nouvelle Équipe"
2. **Informations obligatoires :**
   - Nom de l'équipe *
3. **Informations optionnelles :**
   - Description (objectifs, domaine d'activité)
   - Budget mensuel (pour suivi des coûts)
   - Responsable (sélection parmi utilisateurs existants)
4. **Créer** → Validation

**Résultat :**
- Équipe disponible pour affectation utilisateurs
- Dashboard équipe créé automatiquement
- Suivi budgétaire initialisé

### 📊 Gestion Budgétaire d'Équipe

**Suivi automatique :**
- **Coût actuel** = Somme des licences utilisées par l'équipe
- **Budget restant** = Budget mensuel - Coût actuel  
- **Alertes** = Notifications si dépassement > 90%

**Rapports disponibles :**
- Vue par équipe avec tous les logiciels utilisés
- Coûts mensuels et annuels par équipe
- Prévisions budgétaires
- Export Excel détaillé

---

## 3. 💻 GESTION DES LOGICIELS

### ➕ Ajout d'un Nouveau Logiciel

**Étapes :**
1. **Accéder** → Onglet "Logiciels" → Bouton "Nouveau Logiciel"
2. **Informations techniques :**
   - Nom du logiciel *
   - Éditeur (ex: Microsoft, Adobe, Slack)
   - Version (ex: 2024, Pro, Enterprise)
   - URL officiel (lien vers le site éditeur)
   - Description (fonctionnalités principales)

3. **Classification :**
   - ☑️ Logiciel de base (si essentiel à l'activité)
   - ☑️ Application Shopify (si plugin e-commerce)
   - Équipe propriétaire (qui gère ce logiciel)

4. **Informations financières :**
   - Qui paye ? (sélection utilisateur responsable)
   - Moyen de paiement : Carte/Prélèvement/Virement
   - Périodicité : Mensuel/Annuel/Trimestriel
   - Date de souscription (pour calculs d'échéances)

5. **Statut :** Actif/Inactif/Test

**Résultat :**
- Logiciel disponible pour attribution d'accès
- Calculs d'échéances automatiques
- Suivi des coûts initialisé

### 💰 Configuration des Coûts

**Après création du logiciel :**
1. **Accéder aux coûts** → Bouton "€" dans le tableau
2. **Définir les tarifs par type d'accès :**
   - Administrateur : XXX€/mois
   - Utilisateur : YYY€/mois  
   - Lecture seule : ZZZ€/mois
   - Accès communs : Forfait équipe
3. **Périodes de validité :**
   - Date de début
   - Date de fin (optionnelle)
   - Devise (EUR par défaut)

**Calculs automatiques :**
- **Coût mensuel** = Somme par type d'accès × Nombre d'utilisateurs
- **Coût annuel** = Coût mensuel × 12
- **Prochaine échéance** = Basée sur périodicité et date souscription

---

## 4. 🎫 GESTION DES ACCÈS

### ➕ Attribution d'un Accès

**Prérequis :** Utilisateur et logiciel existants

**Étapes :**
1. **Méthode 1 - Via Utilisateurs :**
   - Onglet "Utilisateurs" → Bouton "Gérer accès" (👥)
   - Sélection du logiciel
   - Choix du type d'accès
   
2. **Méthode 2 - Via Logiciels :**
   - Onglet "Logiciels" → Bouton "Gérer accès" (👥)
   - Sélection de l'utilisateur
   - Choix du type d'accès

3. **Configuration de l'accès :**
   - **Type de droit :** Administrateur/Utilisateur/Lecture/Accès communs
   - **Date d'expiration :** Optionnelle (pour accès temporaires)
   - **Commentaires :** Notes sur l'attribution
   - **Statut :** Actif (par défaut)

**Résultat :**
- Accès immédiatement disponible
- Coût ajouté aux calculs d'équipe
- Log d'attribution généré
- Notification utilisateur (si configurée)

### 🔄 Modification d'un Accès

**Changements possibles :**
- **Upgrade/Downgrade** → Changement de type de droit
- **Extension temporelle** → Modification date d'expiration  
- **Suspension** → Statut "Suspendu" (conservation des données)
- **Réactivation** → Retour en statut "Actif"

**Impact financier automatique :**
- Recalcul immédiat des coûts
- Mise à jour des rapports d'équipe
- Historique des changements conservé

### ❌ Suppression d'un Accès

**Étapes :**
1. **Localiser** → Accès dans liste utilisateur ou logiciel
2. **Supprimer** → Bouton poubelle rouge
3. **Confirmer** → Impact affiché :
   - Perte d'accès immédiate
   - Économie générée (€/mois)
   - Conservation historique

**Résultat :**
- Accès révoqué instantanément  
- Coût retiré des calculs
- Log de suppression généré

---

## 5. 📊 RAPPORTS ET ANALYSES

### 📈 Rapports Disponibles

#### **Vue par Logiciel**
- Liste de tous les logiciels avec :
  - Nombre d'utilisateurs par logiciel
  - Coût mensuel et annuel
  - Équipe propriétaire
  - Prochaine échéance de paiement
- **Export Excel** avec tous les détails

#### **Vue par Utilisateur** 
- Liste de tous les utilisateurs avec :
  - Logiciels utilisés par personne
  - Coût total par utilisateur (mensuel/annuel)
  - Équipe d'appartenance
  - Statut des accès
- **Export Excel** personnalisé

#### **Vue par Équipe**
- Liste de toutes les équipes avec :
  - Budget vs coût réel
  - Logiciels utilisés par équipe
  - Membres et leurs accès
  - Analyse dépassement budgétaire
- **Export Excel** avec calculs budgétaires

### 💹 Tableaux de Bord

#### **Dashboard Principal**
- **Statistiques globales :**
  - Nombre total d'utilisateurs actifs
  - Nombre de logiciels gérés
  - Coût mensuel total
  - **Coût annuel total** (×12)
  - Nombre d'accès actifs

#### **Graphiques Interactifs**
- **Coûts par équipe** (camembert)
- **Évolution mensuelle** (histogramme)
- **Répartition par type de logiciel** (barres)
- **Top 10 logiciels les plus coûteux**

### 📅 Échéancier des Paiements

**Vue calendaire :**
- Prochains paiements par mois
- Montants à prévoir
- Logiciels concernés
- Alertes avant échéance (7 jours)

---

## 6. 📤 IMPORT/EXPORT DE DONNÉES

### 📥 Import Excel

**Formats supportés :**
- **Utilisateurs** → Nom, Prénom, Email, Équipe, Téléphone
- **Logiciels** → Nom, Éditeur, Version, Équipe, Coûts
- **Accès** → Utilisateur, Logiciel, Type de droit

**Processus :**
1. Télécharger le template Excel
2. Compléter les données (validation automatique)
3. Uploader le fichier
4. Validation et preview
5. Import définitif avec rapport d'erreurs

### 📤 Export Excel

**Exports disponibles :**
- **Export général** → Toutes les données (5 feuilles)
- **Export par logiciel** → Utilisateurs et coûts par logiciel
- **Export par équipe** → Budget et logiciels par équipe  
- **Export financier** → Coûts mensuels et annuels détaillés

**Format :**
- Fichiers Excel (.xlsx) avec mise en forme
- Colonnes calculées (totaux, moyennes)
- Graphiques intégrés
- Prêt pour présentation direction

---

## 7. 🔍 AUDIT ET LOGS

### 📋 Traçabilité Complète

**Actions loggées automatiquement :**
- Création/modification/suppression d'utilisateurs
- Attribution/révocation d'accès logiciels
- Changements de statuts et d'équipes
- Connexions et authentifications
- Exports de données

**Informations enregistrées :**
- Qui ? (utilisateur ayant effectué l'action)  
- Quoi ? (type d'action et données modifiées)
- Quand ? (timestamp précis)
- Où ? (adresse IP de connexion)
- Détails complets en JSON

### 🔍 Consultation des Logs

**Filtres disponibles :**
- Par utilisateur (qui a fait l'action)
- Par date/période
- Par type d'action  
- Par table concernée
- Recherche dans les détails

**Exports d'audit :**
- Rapport d'activité par période
- Actions d'un utilisateur spécifique  
- Historique d'un logiciel/accès
- Conformité réglementaire (RGPD)

---

## 8. ⚙️ ADMINISTRATION

### 🔑 Types de Droits d'Accès

**Configuration des niveaux :**
- **Administrateur** (Niveau 5) → Gestion complète
- **Utilisateur** (Niveau 3) → Utilisation standard  
- **Lecture** (Niveau 1) → Consultation seulement
- **Accès communs** (Niveau 2) → Partagé équipe

**Gestion :**
- Création de nouveaux types si besoin
- Modification des niveaux d'accès
- Définition des coûts par type
- Attribution par défaut par équipe

### 💻 Console et Debug

**Commandes administrateur :**
```javascript
// Mode production silencieux
consoleMgr.silence()

// Debug spécifique
consoleMgr.debug('supabase')  // Pour problèmes API
consoleMgr.debug('reports')   // Pour problèmes rapports

// Statistiques système  
consoleMgr.stats()
```

**Monitoring :**
- Nombre de requêtes API
- Temps de réponse moyens
- Erreurs et alertes
- Performance générale

---

## 📋 WORKFLOWS TYPES

### 🆕 Onboarding Nouvel Employé

1. **Créer l'utilisateur** → Onglet Utilisateurs
2. **Affecter à l'équipe** → Sélection équipe appropriée  
3. **Attribuer logiciels de base** → Accès essentiels (email, bureautique)
4. **Attribuer logiciels spécifiques** → Selon le poste
5. **Vérifier budget équipe** → Impact sur coûts mensuels

### 💼 Changement d'Équipe

1. **Modifier l'utilisateur** → Nouvelle équipe
2. **Réviser les accès** → Suppression accès ancienne équipe  
3. **Ajouter nouveaux accès** → Logiciels nouvelle équipe
4. **Valider budgets** → Impact sur les deux équipes

### 📈 Audit Financier Mensuel

1. **Rapport par équipe** → Vue budgétaire
2. **Analyse dépassements** → Équipes > budget
3. **Top logiciels coûteux** → Optimisation possible
4. **Export Excel direction** → Présentation mensuelle
5. **Planification renouvellements** → Échéances à venir

### 🔄 Renouvellement de Logiciel

1. **Consulter échéancier** → Prochaines échéances
2. **Analyser utilisation** → Nombre d'utilisateurs réels
3. **Négocier tarifs** → Avec éditeur si volume
4. **Mettre à jour coûts** → Nouveaux tarifs dans système
5. **Communiquer équipes** → Changements et impact

---

## 🎯 BONNES PRATIQUES

### ✅ Gestion Quotidienne

- **Vérifier nouveaux accès** → Validation des demandes  
- **Contrôler budgets équipes** → Alertes dépassement
- **Suivre échéances** → Préparation renouvellements
- **Consulter logs** → Activité suspecte

### 📊 Optimisation Financière

- **Audit trimestriel** → Utilisateurs inactifs
- **Négociation annuelle** → Volumes et remises
- **Consolidation logiciels** → Éviter doublons fonctionnels
- **Formation équipes** → Utilisation optimale

### 🔒 Sécurité et Conformité

- **Révision accès mensuelle** → Principe du moindre privilège
- **Audit logs régulier** → Détection anomalies  
- **Sauvegarde données** → Export mensuel sécurisé
- **Documentation processus** → Maintien de la continuité

---

## 🚨 GESTION DES INCIDENTS

### ❌ Problèmes Courants

**Utilisateur ne peut pas accéder à un logiciel :**
1. Vérifier statut utilisateur (Actif ?)
2. Contrôler accès logiciel (Attribué ? Expiré ?)
3. Vérifier statut logiciel (Actif ?)
4. Consulter logs pour dernières modifications

**Coûts incorrects dans rapports :**
1. Vérifier configuration coûts logiciel
2. Contrôler dates de validité des tarifs  
3. Recalculer si modification récente
4. Exporter pour validation externe

**Performance dégradée :**
1. Console → `consoleMgr.stats()` pour diagnostic
2. Activer logs spécifiques si nécessaire
3. Vérifier charge API Supabase
4. Mode silence si trop de logs

### 📞 Support et Escalade

**Niveaux de support :**
1. **Utilisateur final** → Guide utilisateur + FAQ
2. **Administrateur IT** → Ce document + console debug  
3. **Support technique** → Logs détaillés + API directe
4. **Éditeur Supabase** → Problèmes infrastructure

---

*🚀 Cette documentation couvre l'ensemble des processus. Pour mise en production, utiliser `consoleMgr.silence()` pour des logs minimaux.*