# 👥 PROCESSUS - Page Gestion des Utilisateurs

## 🎯 Objectif
Gérer tous les utilisateurs de l'organisation : création, modification, attribution d'accès et actions en masse.

## ➕ Ajouter un Utilisateur

### **Bouton** : "Ajouter un utilisateur" (bleu, en haut à droite)

### **Champs du Formulaire**

#### **1. Nom*** (Obligatoire)
- **Description** : Nom de famille de l'utilisateur
- **Format** : Texte libre
- **Exemple** : "Dupont"
- **Validation** : Requis, minimum 2 caractères

#### **2. Prénom*** (Obligatoire)
- **Description** : Prénom de l'utilisateur  
- **Format** : Texte libre
- **Exemple** : "Marie"
- **Validation** : Requis, minimum 2 caractères

#### **3. Email*** (Obligatoire)
- **Description** : Adresse email professionnelle
- **Format** : Format email valide (xxx@domain.com)
- **Exemple** : "marie.dupont@entreprise.fr"
- **Validation** : Email unique dans la base

#### **4. Poste*** (Obligatoire)
- **Description** : Fonction ou poste occupé
- **Format** : Texte libre
- **Exemple** : "Développeur Frontend", "Chef de projet"
- **Utilité** : Aide à comprendre les besoins en logiciels

#### **5. Équipe*** (Obligatoire)
- **Description** : Équipe d'affectation
- **Format** : Menu déroulant
- **Options** : Liste de toutes les équipes actives
- **Impact** : Détermine le budget et les accès de base

#### **6. ☐ Utilisateur externe**
- **Description** : Marquer si l'utilisateur est externe à l'entreprise
- **Type** : Checkbox (coché/non coché)
- **Impact** : 
  - Suivi séparé dans les statistiques
  - Peut affecter les coûts de licences
  - Apparaît dans les rapports d'utilisateurs externes

#### **7. ☐ Ajouter accès de base automatiquement**
- **Description** : Attribuer automatiquement les logiciels de base
- **Type** : Checkbox (coché par défaut)
- **Impact** : L'utilisateur reçoit immédiatement les accès essentiels
- **Logiciels concernés** : Tous les logiciels marqués "De base"

### **Actions du Formulaire**
- **Sauvegarder** : Crée l'utilisateur et ferme le modal
- **Annuler** : Ferme sans sauvegarder

## ✏️ Modifier un Utilisateur

### **Accès** : Clic sur l'icône ✏️ dans le tableau

### **Champs Modifiables**
- Tous les champs identiques à la création
- **Statut** : Actif/Inactif (nouveau champ)
- **Historique** : Préservé automatiquement

### **Particularités**
- **Email** : Modification possible mais doit rester unique
- **Équipe** : Changement possible, impacte les accès et budgets
- **Externe** : Peut être modifié (interne ↔ externe)

## 🔄 Actions en Masse

### **1. Sélection Multiple**
- **Méthode** : Cocher les cases à gauche de chaque utilisateur
- **Indicateur** : Compteur "X utilisateurs sélectionnés"
- **Limites** : Pas de limite technique

### **2. Ajout de Logiciels en Masse**
#### **Bouton** : "Ajouter logiciels" (vert, apparaît si sélection)
#### **Processus** :
1. **Sélectionner** les utilisateurs concernés
2. **Cliquer** "Ajouter logiciels"
3. **Choisir** le logiciel dans la liste déroulante
4. **Choisir** le type de droit (Administrateur, Utilisateur, Lecture)
5. **Confirmer** l'attribution

#### **Résultat** : 
- Tous les utilisateurs sélectionnés reçoivent l'accès
- Action journalisée pour audit

### **3. Suppression d'Accès en Masse**
#### **Bouton** : "Retirer accès" (rouge, apparaît si sélection)
#### **Processus** :
1. **Sélectionner** les utilisateurs concernés
2. **Cliquer** "Retirer accès"
3. **Choisir** le logiciel à retirer
4. **Confirmer** la suppression

#### **Résultat** : 
- L'accès est retiré pour tous les utilisateurs sélectionnés
- Action journalisée pour audit

## 📊 Tableau des Utilisateurs

### **Colonnes Affichées**
- **☐** : Case de sélection
- **Nom Prénom** : Nom complet
- **Email** : Adresse email
- **Poste** : Fonction
- **Équipe** : Équipe d'affectation
- **Statut** : Actif/Inactif + badge "Externe" si applicable
- **Coût Mensuel** : Coût total des accès de l'utilisateur
- **Actions** : ✏️ Modifier | 🗑️ Supprimer

### **Fonctionnalités du Tableau**
- **Tri** : Clic sur les en-têtes de colonnes
- **Recherche** : Barre de recherche en temps réel
- **Pagination** : Navigation par pages si beaucoup d'utilisateurs
- **Filtres** : Par équipe, statut, type (interne/externe)

## 🗑️ Suppression d'Utilisateur

### **Méthode** : Archivage (pas de suppression définitive)
- **Action** : L'utilisateur passe en statut "archivé"
- **Conséquences** :
  - N'apparaît plus dans les listes actives
  - Conservé pour l'historique et audit
  - Accès automatiquement révoqués
  - Données préservées pour conformité

## 💡 Bonnes Pratiques

### **Création d'Utilisateurs**
1. **Remplir tous les champs obligatoires** précisément
2. **Vérifier l'équipe** avant validation
3. **Cocher "Accès de base"** pour nouveaux employés
4. **Marquer "Externe"** pour consultants, stagiaires, partenaires

### **Gestion des Accès**
1. **Utiliser les actions en masse** pour gain de temps
2. **Regrouper les attributions** par projet ou besoin
3. **Vérifier régulièrement** les coûts par utilisateur
4. **Auditer les accès** des utilisateurs externes

### **Maintenance**
1. **Archiver** les utilisateurs qui partent
2. **Mettre à jour les postes** lors de promotions
3. **Réviser les équipes** lors de réorganisations
4. **Contrôler les coûts** des utilisateurs avec beaucoup d'accès