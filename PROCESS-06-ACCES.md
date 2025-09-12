# 🔑 PROCESSUS - Page Gestion des Accès

## 🎯 Objectif
Attribuer et gérer les accès aux logiciels pour chaque utilisateur, avec définition des coûts et gestion des permissions.

## 📋 Comprendre les Accès

### **Concept Central**
Un accès = **Utilisateur** + **Logiciel** + **Droit** + **Coût**

### **Exemple Concret**
- **Marie Dupont** + **Adobe Creative Suite** + **Utilisateur** = **45€/mois**
- **Jean Martin** + **Salesforce** + **Administrateur** = **120€/mois**
- **Équipe Marketing** + **Slack** + **Accès communs** = **200€/mois ÷ 8 utilisateurs = 25€/mois par personne**

## ➕ Ajouter un Accès

### **Bouton** : "Ajouter un accès" (bleu, en haut à droite)

### **Champs du Formulaire**

#### **1. Utilisateur*** (Obligatoire)
- **Description** : Personne qui recevra l'accès
- **Format** : Menu déroulant avec recherche
- **Affichage** : "Prénom NOM (équipe) - email"
- **Exemple** : "Marie DUPONT (Marketing) - marie.dupont@entreprise.fr"
- **Filtres** : Seuls les utilisateurs actifs (non archivés)
- **Validation** : Requis, utilisateur unique par combinaison logiciel+droit

#### **2. Logiciel*** (Obligatoire)
- **Description** : Application ou service à attribuer
- **Format** : Menu déroulant avec recherche
- **Affichage** : Nom du logiciel + équipe propriétaire
- **Exemple** : "Adobe Creative Suite (Design)"
- **Filtres** : Seuls les logiciels actifs (non archivés)
- **Impact** : Détermine les droits et coûts disponibles

#### **3. Droit*** (Obligatoire)
- **Description** : Niveau de permission accordé
- **Format** : Menu déroulant
- **Options** : Tous les droits existants
- **Exemples** : "Administrateur", "Utilisateur", "Lecture", "Accès communs"
- **Impact** : Détermine le coût final avec le logiciel choisi

### **Actions du Formulaire**
- **Sauvegarder** : Crée l'accès ET la règle de coût si nécessaire
- **Annuler** : Ferme sans sauvegarder

### **Gestion Automatique des Coûts**
#### **Si la combinaison Logiciel + Droit existe** :
- Accès créé avec le coût existant
- Attribution immédiate

#### **Si la combinaison Logiciel + Droit n'existe pas** :
- **Modal de définition de coût** s'ouvre automatiquement
- **Champs à remplir** :
  - **Coût mensuel*** : Montant en euros (ex: 45.00)
  - **Confirmation** : Valider pour créer l'accès

## ✏️ Modifier un Accès

### **Accès** : Clic sur l'icône ✏️ dans le tableau

### **Champs Modifiables**
- **Utilisateur** : Peut être changé (attention aux doublons)
- **Logiciel** : Peut être changé
- **Droit** : Peut être changé (recalcul automatique du coût)

### **Particularités**
- **Changement de droit** : Coût mis à jour automatiquement
- **Validation** : Vérification unicité utilisateur+logiciel+droit
- **Impact budgétaire** : Recalcul immédiat des coûts équipe/utilisateur

## 📊 Tableau des Accès

### **Colonnes Affichées**

#### **Utilisateur**
- **Contenu** : Prénom NOM
- **Style** : Lien cliquable vers le profil utilisateur
- **Tri** : Alphabétique par nom de famille
- **Badge** : "Externe" si utilisateur externe

#### **Email**  
- **Contenu** : Adresse email de l'utilisateur
- **Utilité** : Identification rapide, contact direct

#### **Logiciel**
- **Contenu** : Nom du logiciel
- **Style** : Lien cliquable vers la fiche logiciel
- **Badges** : 🏷️ Base, 🛒 Shopify, ⚠️ Engagement selon le logiciel

#### **Droit**
- **Contenu** : Niveau d'accès accordé
- **Style** : Badge coloré selon le type
- **Couleurs** :
  - 🔴 Administrateur (rouge)
  - 🔵 Utilisateur (bleu) 
  - 🟡 Lecture (jaune)
  - 🟢 Accès communs (vert)

#### **Coût Mensuel**
- **Contenu** : Coût de cet accès spécifique
- **Format** : "XX.XX€" (2 décimales)
- **Particularités** :
  - **Accès communs** : Coût total ÷ nombre d'utilisateurs
  - **Coût fixe** : Peut afficher "Inclus dans coût fixe + XX.XX€"
- **Couleur** : Bleu pour différencier du coût annuel

#### **Équipe**
- **Contenu** : Équipe de l'utilisateur
- **Style** : Lien cliquable vers la fiche équipe
- **Utilité** : Vérifier cohérence des accès par équipe

#### **Actions**
- **✏️ Modifier** : Ouvre le formulaire de modification
- **🗑️ Supprimer** : Supprime l'accès après confirmation

### **Fonctionnalités Avancées du Tableau**

#### **Tri et Filtres**
- **Tri** : Par utilisateur, logiciel, coût, équipe
- **Recherche globale** : Nom utilisateur, logiciel, email
- **Filtres spécialisés** :
  - Par équipe
  - Par logiciel  
  - Par type de droit
  - Par utilisateur (interne/externe)

#### **Vues Spécialisées**
- **Vue par utilisateur** : Grouper tous les accès d'un utilisateur
- **Vue par logiciel** : Voir tous les utilisateurs d'un logiciel
- **Vue par équipe** : Accès de toute une équipe

## 💰 Définition des Coûts

### **Principe**
Chaque combinaison **Logiciel + Droit** a un coût mensuel spécifique.

### **Exemples de Grille Tarifaire**
```
Adobe Creative Suite:
├── Administrateur: 60€/mois
├── Utilisateur: 45€/mois
└── Lecture: 15€/mois

Salesforce:
├── Administrateur: 120€/mois
├── Utilisateur: 80€/mois
└── Accès communs: 500€/mois (partagé)

Microsoft Office:
├── Utilisateur: 12€/mois
└── Accès communs: 200€/mois (partagé)
```

### **Création Automatique**
Lors de l'ajout d'un accès avec une combinaison inconnue :

#### **Modal "Définir le coût"**
- **Logiciel** : [Nom du logiciel] (non modifiable)
- **Droit** : [Nom du droit] (non modifiable)  
- **Coût mensuel*** : [Champ à saisir] €
- **Actions** :
  - **Confirmer** : Crée la règle de coût ET l'accès
  - **Annuler** : Annule tout le processus

#### **Validation**
- **Coût positif** : Doit être > 0
- **Format décimal** : Accepte 2 décimales maximum
- **Cohérence** : Vérification logique (Administrateur ≥ Utilisateur ≥ Lecture)

## 🔄 Actions en Masse

### **Sélection Multiple**
- **Méthode** : Cases à cocher à gauche de chaque ligne
- **Indicateur** : "X accès sélectionnés" en haut du tableau
- **Limite** : Pas de limite technique

### **Actions Disponibles**

#### **1. Suppression en Masse**
- **Bouton** : "Supprimer les accès" (rouge, apparaît si sélection)
- **Confirmation** : Double validation requise
- **Impact** : 
  - Révocation immédiate de tous les accès sélectionnés
  - Recalcul automatique des coûts
  - Action journalisée pour audit

#### **2. Modification de Droit en Masse**
- **Bouton** : "Modifier le droit" (orange, apparaît si sélection)
- **Process** :
  1. Sélectionner les accès concernés
  2. Cliquer "Modifier le droit"  
  3. Choisir le nouveau droit dans la liste
  4. Confirmer la modification
- **Conditions** : 
  - Tous les accès sélectionnés doivent concerner le **même logiciel**
  - La combinaison Logiciel + Nouveau Droit doit avoir un coût défini
- **Impact** : Mise à jour automatique des coûts

## 🗑️ Suppression d'Accès

### **Méthode** : Suppression définitive (pas d'archivage)
#### **Raisons** :
- **Départ d'utilisateur** : Révocation de tous ses accès
- **Changement de poste** : Suppression des accès devenus inutiles  
- **Optimisation budgétaire** : Retrait d'accès sous-utilisés
- **Fin de projet** : Suppression des accès temporaires

#### **Conséquences** :
- **Coûts** : Retirés immédiatement des calculs
- **Budgets équipe** : Recalculés automatiquement
- **Historique** : Conservé dans les logs pour audit
- **Accès communs** : Recalcul du coût par utilisateur restant

## 💡 Bonnes Pratiques

### **Attribution d'Accès**
1. **Principe du moindre privilège** : Commencer par "Lecture", élever si nécessaire
2. **Justification métier** : Chaque accès doit avoir une raison d'être
3. **Cohérence d'équipe** : Membres d'équipe = besoins similaires
4. **Temporalité** : Prévoir la révision pour projets temporaires

### **Gestion des Coûts**
1. **Tarification progressive** : Lecture < Utilisateur < Administrateur
2. **Accès communs** : Privilégier pour les licences équipe
3. **Négociation éditeur** : Volumes pour obtenir de meilleurs tarifs
4. **Audit régulier** : Vérifier coût réel vs. coût théorique

### **Optimisation**
1. **Top utilisateurs** : Surveiller ceux avec beaucoup d'accès
2. **Logiciels sous-utilisés** : Identifier via le nombre d'accès
3. **Niveaux inappropriés** : Administrateurs qui pourraient être Utilisateurs
4. **Doublons fonctionnels** : Logiciels faisant la même chose

### **Sécurité et Audit**
1. **Révision trimestrielle** : Vérifier la pertinence de tous les accès
2. **Départs** : Process systématique de révocation
3. **Utilisateurs externes** : Surveillance renforcée et limitation
4. **Accès administrateurs** : Limitation aux seuls référents techniques

## 🔍 Cas d'Usage Courants

### **Nouvel Employé**
1. **Créer l'utilisateur** (page Utilisateurs)
2. **Cocher "Accès de base"** → Attribution automatique des logiciels essentiels
3. **Ajouter accès spécifiques** selon le poste
4. **Valider avec le manager** avant activation

### **Changement de Poste**  
1. **Modifier l'équipe** de l'utilisateur
2. **Réviser tous ses accès** existants
3. **Supprimer** les accès devenus inutiles
4. **Ajouter** les nouveaux accès nécessaires

### **Nouveau Logiciel**
1. **Créer le logiciel** (page Logiciels)
2. **Créer les droits** nécessaires (page Droits) 
3. **Attribuer les premiers accès** → Définition automatique des coûts
4. **Déployer** progressivement aux équipes concernées

### **Optimisation Budgétaire**
1. **Analyser** le top des utilisateurs les plus coûteux
2. **Vérifier** la nécessité de chaque accès administrateur
3. **Identifier** les logiciels avec peu d'utilisateurs
4. **Négocier** ou résilier selon les usages réels