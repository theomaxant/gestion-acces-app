# 🏢 PROCESSUS - Page Gestion des Équipes

## 🎯 Objectif
Organiser les utilisateurs en équipes avec gestion budgétaire et hiérarchique pour un meilleur contrôle des coûts IT.

## ➕ Créer une Équipe

### **Bouton** : "Ajouter une équipe" (bleu, en haut à droite)

### **Champs du Formulaire**

#### **1. Nom de l'équipe*** (Obligatoire)
- **Description** : Nom de l'équipe ou du département
- **Format** : Texte libre, unique
- **Exemples** : 
  - "Développement Frontend"
  - "Marketing Digital" 
  - "Ressources Humaines"
  - "Direction Générale"
- **Validation** : Requis, minimum 2 caractères, nom unique

#### **2. Description** (Optionnel)
- **Description** : Description détaillée du rôle de l'équipe
- **Format** : Texte libre, multiligne
- **Exemples** :
  - "Équipe en charge du développement des interfaces utilisateur"
  - "Gestion des campagnes marketing et communication digitale"
  - "Administration du personnel et gestion RH"
- **Utilité** : Clarifier les responsabilités et besoins métier

### **Actions du Formulaire**
- **Sauvegarder** : Crée l'équipe et ferme le modal
- **Annuler** : Ferme sans sauvegarder

## ✏️ Modifier une Équipe

### **Accès** : Clic sur l'icône ✏️ dans le tableau

### **Champs Modifiables**
- **Nom de l'équipe** : Peut être modifié (doit rester unique)
- **Description** : Mise à jour libre
- **Historique** : Toutes les modifications sont tracées

### **Impact des Modifications**
- **Changement de nom** : Mis à jour partout dans l'application
- **Utilisateurs** : Restent liés à l'équipe (pas d'impact)
- **Coûts** : Calculs recalculés automatiquement

## 📊 Tableau des Équipes

### **Colonnes Affichées**

#### **Nom**
- **Contenu** : Nom de l'équipe
- **Tri** : Alphabétique possible
- **Style** : Lien cliquable vers les détails

#### **Utilisateurs**
- **Contenu** : Nombre d'utilisateurs actifs dans l'équipe
- **Calcul** : Utilisateurs non archivés uniquement
- **Format** : "X utilisateurs"
- **Détail** : Internes + Externes si applicable

#### **Coût Mensuel**
- **Contenu** : Coût mensuel total de l'équipe
- **Calcul** : 
  - Quote-part des coûts fixes des logiciels utilisés
  - + Coûts des accès individuels des membres
- **Format** : "XXX.XX€" (2 décimales)
- **Couleur** : Bleu pour différencier du coût annuel

#### **Coût Annuel**
- **Contenu** : Coût mensuel × 12
- **Format** : "XXX.XX€" (2 décimales)
- **Couleur** : Violet pour mise en valeur
- **Utilité** : Budget annuel prévisible

#### **Description**
- **Contenu** : Description de l'équipe (tronquée si longue)
- **Affichage** : Première ligne visible avec "..."
- **Tooltip** : Description complète au survol

#### **Actions**
- **✏️ Modifier** : Ouvre le formulaire de modification
- **🗑️ Supprimer** : Archive l'équipe (suppression soft)

### **Fonctionnalités du Tableau**
- **Tri par colonnes** : Clic sur les en-têtes
- **Tri par défaut** : Par coût annuel décroissant (équipes les plus coûteuses en premier)
- **Recherche** : Barre de recherche en temps réel sur nom et description
- **Pagination** : Si beaucoup d'équipes

## 💰 Gestion Budgétaire

### **Calculs Automatiques**
#### **Coûts Fixes**
- **Logique** : Si une équipe a des utilisateurs avec accès à un logiciel à coût fixe
- **Répartition** : Coût fixe ÷ nombre d'équipes utilisatrices
- **Exemple** : 
  - Logiciel Adobe (500€/mois fixe)
  - Utilisé par 2 équipes → 250€/mois par équipe

#### **Coûts Variables**
- **Logique** : Somme des coûts des accès individuels des membres
- **Calcul** : Pour chaque membre de l'équipe, somme de ses accès
- **Accès communs** : Comptés une seule fois par équipe

### **Suivi Budgétaire**
- **Tableau de bord** : Vue temps réel des coûts par équipe
- **Alertes** : Identification des équipes à coût élevé
- **Historique** : Évolution des coûts dans le temps
- **Rapports** : Génération de rapports budgétaires par équipe

## 👥 Gestion des Membres

### **Affectation d'Utilisateurs**
- **Méthode** : Via la page Utilisateurs → Champ "Équipe"
- **Impact** : 
  - Calculs de coûts recalculés automatiquement
  - Accès de base éventuels attribués
  - Statistiques mises à jour

### **Changement d'Équipe**
- **Process** : Modifier l'utilisateur → Changer l'équipe
- **Conséquences** :
  - Coûts retirés de l'ancienne équipe
  - Coûts ajoutés à la nouvelle équipe
  - Historique conservé pour audit

## 🗑️ Suppression d'Équipe

### **Méthode** : Archivage (suppression soft)
#### **Prérequis**
- **Vérification** : L'équipe ne doit pas avoir d'utilisateurs actifs
- **Action préalable** : Réaffecter tous les utilisateurs

#### **Conséquences**
- **Statut** : Équipe marquée comme archivée
- **Visibilité** : N'apparaît plus dans les listes actives
- **Historique** : Conservé pour audit et conformité
- **Coûts** : Retirés des calculs courants

#### **Sécurités**
- **Confirmation** : Double validation requise
- **Blocage** : Impossible si utilisateurs actifs
- **Restauration** : Possible via base de données si nécessaire

## 💡 Bonnes Pratiques

### **Organisation des Équipes**
1. **Créer des équipes métier** alignées sur l'organigramme
2. **Éviter les équipes trop larges** (> 20 personnes)
3. **Noms explicites** pour faciliter la navigation
4. **Descriptions détaillées** pour clarifier les rôles

### **Gestion Budgétaire**
1. **Surveiller le top 3 équipes** les plus coûteuses
2. **Analyser les coûts** en rapport avec la taille d'équipe
3. **Répartir équitablement** les logiciels à coût fixe
4. **Auditer régulièrement** les affectations d'utilisateurs

### **Évolution Organisationnelle**
1. **Mettre à jour** lors de réorganisations
2. **Créer de nouvelles équipes** pour nouveaux projets
3. **Archiver** les équipes obsolètes après réaffectation
4. **Maintenir la cohérence** avec l'organigramme réel

### **Reporting et Suivi**
1. **Utiliser le dashboard** pour vue d'ensemble
2. **Générer des rapports** périodiques par équipe
3. **Comparer les coûts** entre équipes similaires
4. **Présenter les budgets** avec les responsables métier