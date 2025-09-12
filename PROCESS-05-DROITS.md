# 🔐 PROCESSUS - Page Gestion des Droits

## 🎯 Objectif
Définir et gérer les différents niveaux d'accès et permissions pour tous les logiciels de l'organisation.

## 📋 Comprendre les Droits

### **Concept**
Les droits définissent le **niveau d'accès** qu'un utilisateur peut avoir sur un logiciel. Chaque combinaison logiciel + droit a son propre coût.

### **Exemples Concrets**
- **Adobe Creative Suite** :
  - Administrateur : 60€/mois (accès complet + gestion licences)
  - Utilisateur : 45€/mois (accès standard)
  - Lecture : 15€/mois (consultation uniquement)

- **Salesforce** :
  - Administrateur : 120€/mois (configuration + données)
  - Utilisateur : 80€/mois (saisie + consultation)
  - Accès communs : 200€/mois (coût partagé équipe)

## 📊 Types de Droits Standards

### **1. Administrateur**
- **Description** : Accès complet avec droits de configuration
- **Permissions** : 
  - Gestion des utilisateurs du logiciel
  - Configuration des paramètres
  - Accès à toutes les fonctionnalités
  - Administration des données
- **Utilisation** : Référents techniques, IT, super-utilisateurs
- **Coût** : Généralement le plus élevé

### **2. Utilisateur** 
- **Description** : Accès standard pour utilisation quotidienne
- **Permissions** :
  - Accès aux fonctionnalités principales
  - Création et modification de contenus
  - Collaboration avec les équipes
  - Pas de droits d'administration
- **Utilisation** : Utilisateurs finaux, collaborateurs actifs
- **Coût** : Coût moyen, le plus courant

### **3. Lecture**
- **Description** : Accès en consultation uniquement
- **Permissions** :
  - Visualisation des données
  - Téléchargement/export éventuel
  - Pas de modification
  - Pas de création de contenu
- **Utilisation** : Managers, observateurs, consultants ponctuels
- **Coût** : Généralement le moins cher

### **4. Accès communs**
- **Description** : Licence partagée par toute une équipe
- **Permissions** : Variables selon le logiciel
- **Particularité** : **Coût partagé** entre tous les membres de l'équipe
- **Utilisation** : 
  - Licences équipe (Slack équipe, Zoom Business)
  - Abonnements collectifs
  - Outils partagés
- **Calcul** : Coût total ÷ nombre d'utilisateurs avec cet accès

## ➕ Créer un Nouveau Droit

### **Bouton** : "Ajouter un droit" (bleu, en haut à droite)

### **Champs du Formulaire**

#### **1. Nom du droit*** (Obligatoire)
- **Description** : Nom explicite du niveau d'accès
- **Format** : Texte libre, unique
- **Exemples** : 
  - "Administrateur"
  - "Utilisateur Premium"
  - "Consultation RH"
  - "Accès Projet X"
  - "Licence Équipe Marketing"
- **Validation** : Requis, minimum 2 caractères, nom unique

#### **2. Description** (Recommandé)
- **Description** : Explication détaillée des permissions incluses
- **Format** : Texte libre, multiligne
- **Exemples** :
  - "Accès complet avec droits de gestion des utilisateurs et configuration système"
  - "Utilisation standard avec création et modification de contenu"
  - "Consultation uniquement, sans droits de modification"
- **Utilité** : 
  - Clarifier les permissions pour les gestionnaires
  - Justifier les différences de coûts
  - Faciliter l'attribution appropriée

### **Actions du Formulaire**
- **Sauvegarder** : Crée le droit et ferme le modal
- **Annuler** : Ferme sans sauvegarder

## ✏️ Modifier un Droit

### **Accès** : Clic sur l'icône ✏️ dans le tableau

### **Champs Modifiables**
- **Nom** : Peut être modifié (doit rester unique)
- **Description** : Mise à jour libre

### **Impact des Modifications**
- **Changement de nom** : Répercuté dans tous les accès existants
- **Coûts associés** : Non affectés (gérés dans la page Accès)
- **Historique** : Modification tracée pour audit

## 📊 Tableau des Droits

### **Colonnes Affichées**

#### **Nom**
- **Contenu** : Nom du droit d'accès
- **Style** : Lien cliquable vers les détails
- **Tri** : Alphabétique possible

#### **Description**
- **Contenu** : Description des permissions (tronquée si longue)
- **Affichage** : Première ligne avec "..." si nécessaire
- **Tooltip** : Description complète au survol de la souris

#### **Utilisations**
- **Contenu** : Nombre d'accès actifs utilisant ce droit
- **Format** : "X accès actifs"
- **Utilité** : 
  - Identifier les droits populaires
  - Éviter la suppression de droits utilisés
  - Optimiser les niveaux d'accès

#### **Actions**
- **✏️ Modifier** : Ouvre le formulaire de modification
- **🗑️ Supprimer** : Supprime le droit (si non utilisé)

### **Fonctionnalités du Tableau**
- **Tri** : Par nom, nombre d'utilisations
- **Recherche** : En temps réel sur nom et description
- **Filtres** : Par utilisation (utilisé/non utilisé)

## 🔗 Utilisation des Droits

### **Attribution d'Accès**
1. **Page Accès** → Ajouter un accès
2. **Sélectionner** utilisateur et logiciel
3. **Choisir le droit** approprié
4. **Coût automatique** selon la combinaison logiciel + droit

### **Dans les Actions en Masse**
- **Ajout groupé** : Même droit pour plusieurs utilisateurs
- **Modification** : Changement de niveau pour groupe d'utilisateurs
- **Cohérence** : Même logique de coût appliquée

## 💰 Impact sur les Coûts

### **Définition des Coûts**
- **Page Accès** : Création d'une règle de coût pour chaque combinaison
- **Formule** : Logiciel + Droit = Coût mensuel spécifique
- **Exemples** :
  - Adobe + Administrateur = 60€/mois
  - Adobe + Utilisateur = 45€/mois  
  - Adobe + Lecture = 15€/mois

### **Accès Communs - Particularité**
#### **Principe**
- **Coût total** : Défini une seule fois (ex: 200€/mois)
- **Répartition** : Divisé par le nombre d'utilisateurs ayant cet accès
- **Exemple** : 
  - Slack Équipe = 200€/mois
  - 10 utilisateurs avec "Accès communs"
  - Coût par utilisateur = 200€ ÷ 10 = 20€/mois

#### **Avantages**
- **Économies d'échelle** : Plus d'utilisateurs = coût unitaire plus bas
- **Licences équipe** : Gestion simplifiée des abonnements collectifs
- **Transparence** : Coût réel visible pour chaque utilisateur

## 🗑️ Suppression de Droit

### **Conditions**
- **Aucun accès actif** utilisant ce droit
- **Aucun coût défini** pour ce droit
- **Confirmation** requise

### **Process de Suppression**
1. **Vérification** : Système contrôle les utilisations
2. **Blocage** : Impossible si accès actifs existants
3. **Nettoyage** : Retirer d'abord tous les accès utilisant ce droit
4. **Suppression** : Définitive après confirmation

### **Alternative : Archivage**
- **Garder** pour l'historique
- **Masquer** des nouvelles attributions
- **Conserver** la cohérence des données existantes

## 💡 Bonnes Pratiques

### **Création de Droits**
1. **Noms explicites** : "Administrateur Salesforce" plutôt que "Admin"
2. **Descriptions détaillées** : Lister les permissions exactes
3. **Cohérence** : Utiliser la même nomenclature pour tous les logiciels
4. **Standards** : S'appuyer sur les 4 types de base quand possible

### **Gestion des Niveaux**
1. **Principe de moindre privilège** : Attribuer le minimum nécessaire
2. **Révision régulière** : Vérifier si les droits sont appropriés
3. **Évolution des besoins** : Ajuster selon les changements de poste
4. **Audit périodique** : Contrôler les accès administrateurs

### **Optimisation des Coûts**
1. **Utiliser "Accès communs"** pour les licences équipe
2. **Préférer "Lecture"** quand la consultation suffit
3. **Limiter les administrateurs** aux seuls référents
4. **Négocier les tarifs** selon les volumes par niveau

### **Organisation**
1. **Créer tous les droits** avant d'attribuer les accès
2. **Standardiser** les niveaux entre logiciels similaires
3. **Documenter** les permissions de chaque droit
4. **Former** les gestionnaires aux différences de coûts

## 🔍 Cas d'Usage Typiques

### **Nouveau Logiciel**
1. Créer les droits : Administrateur, Utilisateur, Lecture
2. Définir les coûts pour chaque droit (page Accès)
3. Attribuer les accès appropriés aux utilisateurs

### **Évolution d'Usage**
1. Constater le besoin d'un niveau intermédiaire
2. Créer un nouveau droit "Utilisateur Avancé"
3. Définir coût et permissions
4. Migrer certains utilisateurs vers ce niveau

### **Optimisation Budgétaire**
1. Analyser les coûts par droit dans les rapports
2. Identifier les sur-attributions (Administrateur au lieu d'Utilisateur)
3. Créer des droits plus granulaires si nécessaire
4. Négocier avec l'éditeur selon la répartition réelle