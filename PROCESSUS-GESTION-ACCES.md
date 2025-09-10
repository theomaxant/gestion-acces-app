# 🛡️ Processus de Gestion des Accès

## Vue d'ensemble
Ce processus guide la gestion complète des droits d'accès aux logiciels, incluant l'attribution, la modification et la suppression des droits utilisateurs.

---

## Prérequis
### 🔐 Accès requis
- Être connecté à l'application
- Avoir les droits d'administration

### 📋 Concepts importants
- **Types de droits** : Reader, User, Admin, Super Admin (niveaux 1-4)
- **Attribution multiple** : Un utilisateur peut avoir différents droits sur différents logiciels
- **Coûts différenciés** : Chaque type de droit peut avoir un coût différent
- **Traçabilité** : Tous les changements d'accès sont loggés

---

## 🎯 Attribution d'Accès - Méthode 1 : Depuis un Utilisateur

### Étape 1 : Accès à la Gestion des Accès Utilisateur
#### 📝 Description
Attribuer des accès à un utilisateur spécifique depuis sa fiche.

#### 🎯 Actions à effectuer
1. Aller dans **"Utilisateur"** depuis le menu principal
2. Localiser l'utilisateur dans la liste
3. Cliquer sur l'icône **"🛡️"** (Gérer les accès) à droite de l'utilisateur

#### ✅ Résultat attendu
- **Modale "Gérer les accès"** s'ouvre
- **Titre** : "Accès pour: [Nom Prénom]"
- **Section supérieure** : Liste des accès actuels
- **Section inférieure** : Formulaire d'ajout d'accès

#### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Modale de gestion des accès utilisateur avec accès existants*

---

### Étape 2 : Consultation des Accès Existants
#### 📝 Description
Examiner les droits actuellement attribués à l'utilisateur.

#### 🎯 Informations affichées
Pour chaque accès existant :
- **Nom du logiciel** (ex: Microsoft Office)
- **Type de droit** avec badge coloré (ex: User)
- **Bouton suppression** (🗑️) pour retirer l'accès

#### 💡 Codes couleur des droits (exemples)
- **Reader** : Badge bleu clair (niveau 1)
- **User** : Badge vert (niveau 2)  
- **Admin** : Badge orange (niveau 3)
- **Super Admin** : Badge rouge (niveau 4)

#### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Liste des accès existants avec badges colorés*

---

### Étape 3 : Attribution d'un Nouvel Accès
#### 📝 Description
Ajouter un nouveau droit d'accès à l'utilisateur.

#### 🎯 Actions à effectuer (Version Desktop)
1. **Sélection du logiciel :**
   - Cliquer sur la liste déroulante "Sélectionner un logiciel"
   - Choisir le logiciel souhaité (ex: Adobe Photoshop)

2. **Sélection du droit :**
   - Cliquer sur la liste déroulante "Sélectionner un droit"
   - Choisir le niveau approprié (ex: User)

3. **Validation :**
   - Cliquer sur le bouton **"+"** vert

#### 🎯 Actions à effectuer (Version Mobile)
1. **Sélection du logiciel :**
   - Taper sur "Sélectionner un logiciel" (pleine largeur)
   - Choisir dans la liste

2. **Sélection du droit :**
   - Taper sur "Sélectionner un droit" (pleine largeur)
   - Choisir le niveau

3. **Validation :**
   - Taper sur **"+ Ajouter"** (bouton pleine largeur)

#### ✅ Résultat attendu
- **Nouvel accès ajouté** à la liste supérieure
- **Formulaire réinitialisé** pour un nouvel ajout
- **Message de confirmation** (optionnel)
- **Log automatique** généré

#### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Formulaire d'ajout d'accès (versions desktop et mobile)*

---

## 🎯 Attribution d'Accès - Méthode 2 : Depuis un Logiciel

### Étape 1 : Accès à la Gestion des Accès Logiciel
#### 📝 Description
Gérer tous les utilisateurs ayant accès à un logiciel spécifique.

#### 🎯 Actions à effectuer
1. Aller dans **"Logiciel"** depuis le menu principal
2. Localiser le logiciel dans la liste
3. Cliquer sur l'icône **"🛡️"** (Gérer les accès) du logiciel

#### ✅ Résultat attendu
- **Modale "Gérer les accès"** s'ouvre
- **Titre** : "Accès pour: [Nom du logiciel]"
- **Liste des utilisateurs** ayant actuellement accès
- **Formulaire d'attribution** en bas

#### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Modale de gestion des accès logiciel avec utilisateurs*

---

### Étape 2 : Vue d'Ensemble des Utilisateurs
#### 📝 Description
Consulter qui a actuellement accès au logiciel.

#### 🎯 Informations affichées
Pour chaque utilsateur ayant accès :
- **Nom complet** de l'utilisateur
- **Type de droit** avec badge coloré
- **Bouton suppression** pour retirer l'accès

#### 💡 Analyse possible
- **Répartition des droits** : Combien d'Admin vs User
- **Utilisateurs inattendus** : Vérifier les accès légitimes
- **Coûts totaux** : Impact financier visible dans la liste logiciels

#### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Liste des utilisateurs avec accès au logiciel*

---

### Étape 3 : Attribution à un Nouvel Utilisateur
#### 📝 Description
Donner accès au logiciel à un utilisateur supplémentaire.

#### 🎯 Actions à effectuer
1. **Sélection de l'utilisateur :**
   - Liste déroulante "Sélectionner un utilisateur"
   - Choisir parmi les utilisateurs actifs

2. **Sélection du droit :**
   - Choisir le niveau approprié
   - Considérer les besoins métier

3. **Validation :**
   - Cliquer sur le bouton d'ajout

#### ⚠️ Considérations
- **Utilisateurs archivés** : N'apparaissent pas dans la liste
- **Doublons** : Impossible d'attribuer deux fois le même logiciel
- **Coûts** : Impact immédiat sur les coûts totaux

---

## 🎯 Attribution d'Accès - Méthode 3 : Section Accès Centralisée

### Étape 1 : Accès à la Section Centralisée
#### 📝 Description
Gérer tous les accès depuis une interface centralisée.

#### 🎯 Actions à effectuer
1. Cliquer sur **"Accès"** dans le menu principal
2. Consulter la **liste complète** de tous les accès
3. Utiliser les **filtres** si nécessaire :
   - Par utilisateur
   - Par logiciel
   - Par type de droit

#### ✅ Résultat attendu
- **Vue d'ensemble** de tous les accès
- **Informations complètes** : Utilisateur, Logiciel, Droit
- **Actions disponibles** : Modifier, Supprimer
- **Bouton d'ajout** pour créer de nouveaux accès

#### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Interface centralisée de gestion des accès*

---

### Étape 2 : Création d'Accès Centralisée
#### 📝 Description
Créer un nouvel accès depuis l'interface centralisée.

#### 🎯 Actions à effectuer
1. Cliquer sur **"+ Ajouter un accès"**
2. **Formulaire complet** avec 3 champs :
   - Utilisateur (liste déroulante)
   - Logiciel (liste déroulante)  
   - Type de droit (liste déroulante)
3. **Sauvegarder** l'accès

#### 💡 Avantages de cette méthode
- **Vue globale** de tous les accès
- **Création rapide** sans naviguer entre sections
- **Modification facile** des accès existants
- **Filtrage avancé** pour la recherche

---

## ✏️ Modification d'un Accès Existant

### Étape 1 : Localisation de l'Accès
#### 📝 Description
Trouver l'accès à modifier parmi les différentes interfaces.

#### 🎯 Méthodes de localisation
1. **Depuis l'utilisateur** : Gérer les accès → Voir la liste
2. **Depuis le logiciel** : Gérer les accès → Voir les utilisateurs
3. **Depuis la section Accès** : Vue centralisée avec filtres

#### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Accès à modifier identifié dans une des interfaces*

---

### Étape 2 : Modification du Type de Droit
#### 📝 Description
Changer le niveau d'accès d'un utilisateur sur un logiciel.

#### 🎯 Actions à effectuer
1. **Depuis la section Accès :**
   - Cliquer sur **"✏️ Modifier"** de l'accès
   - **Modale de modification** s'ouvre
   - Changer le **type de droit** dans la liste déroulante
   - **Sauvegarder** les modifications

#### ✅ Résultat attendu
- **Droit modifié** avec nouveau badge coloré
- **Coûts recalculés** automatiquement  
- **Log généré** au format "Ancien droit → Nouveau droit"

#### 💡 Exemples de modifications courantes
- **Promotion** : User → Admin (augmentation responsabilités)
- **Restriction** : Admin → User (réduction des droits)
- **Accès temporaire** : Reader → User pour un projet

#### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Modale de modification d'accès avec nouveau droit sélectionné*

---

## 🗑️ Suppression d'Accès

### Étape 1 : Identification de l'Accès à Supprimer
#### 📝 Description
Localiser l'accès qui n'est plus nécessaire.

#### 🎯 Raisons de suppression courantes
- **Changement de poste** : Plus besoin du logiciel
- **Fin de projet** : Accès temporaire terminé
- **Réorganisation** : Redistribution des responsabilités
- **Départ** : Géré automatiquement par l'archivage

---

### Étape 2 : Suppression de l'Accès
#### 📝 Description
Retirer le droit d'accès de l'utilisateur.

#### 🎯 Actions à effectuer
**Méthode 1 - Depuis gestion utilisateur :**
1. Gérer les accès de l'utilisateur
2. Cliquer sur **"🗑️"** à côté de l'accès à supprimer
3. Confirmer la suppression

**Méthode 2 - Depuis gestion logiciel :**
1. Gérer les accès du logiciel
2. Cliquer sur **"🗑️"** à côté de l'utilisateur
3. Confirmer la suppression

**Méthode 3 - Depuis section Accès :**
1. Localiser l'accès dans la liste
2. Cliquer sur **"🗑️ Supprimer"**
3. Confirmer dans la boîte de dialogue

#### ✅ Résultat attendu
- **Accès supprimé** de toutes les listes
- **Coûts recalculés** automatiquement
- **Log généré** : "DELETE - Accès"
- **Utilisateur** ne peut plus accéder au logiciel

#### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Confirmation de suppression d'accès*

---

## 💰 Impact Financier des Accès

### Calcul Automatique des Coûts
#### 📝 Description
Comprendre comment les accès impactent les coûts.

#### 🎯 Mécanisme de calcul
1. **Coût par droit** : Chaque type de droit a un coût mensuel défini
2. **Multiplication** : Nombre d'utilisateurs × Coût du droit
3. **Totalisation** : Somme pour obtenir le coût total du logiciel
4. **Mise à jour temps réel** : Recalcul à chaque modification

#### 💡 Exemple de calcul
**Adobe Photoshop :**
- 3 utilisateurs "User" à 25€/mois = 75€
- 1 utilisateur "Admin" à 40€/mois = 40€
- **Total mensuel** : 115€
- **Total annuel** : 115€ × 12 = 1 380€

---

### Optimisation des Coûts
#### 📝 Bonnes pratiques
1. **Révision régulière** : Vérifier les accès non utilisés
2. **Droits minimaux** : Donner le niveau juste nécessaire
3. **Projets temporaires** : Supprimer les accès en fin de projet
4. **Utilisateurs archivés** : Accès supprimés automatiquement

---

## 📊 Rapports et Suivi des Accès

### Vue d'Ensemble Dashboard
#### 📝 Informations disponibles
- **Nombre total d'accès** : Compteur global
- **Répartition par logiciel** : Graphiques
- **Coûts totaux** : Impact financier global
- **Évolution** : Tendances d'attribution

### Rapports Détaillés
#### 🎯 Accès aux rapports
1. Aller dans **"Rapport"** du menu principal
2. **Rapports disponibles** :
   - Accès par utilisateur
   - Utilisateurs par logiciel
   - Coûts par équipe
   - Évolution des droits

#### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Exemple de rapport des accès par utilisateur*

---

## 📝 Traçabilité des Accès

### Logs Automatiques Générés
#### Types de logs pour les accès
1. **CREATE - Accès** : Attribution d'un nouveau droit
2. **UPDATE - Accès** : Modification d'un droit existant  
3. **DELETE - Accès** : Suppression d'un droit

#### Exemple de log d'attribution
```
➕ CRÉATION - Accès
Il y a 2 minutes | Attribution automatique | Utilisateur: Marie Dubois

Valeurs initiales:
• Utilisateur: Marie Dubois (Développeuse)
• Logiciel: Adobe Illustrator
• Droit: User
• Équipe: Design
```

### Consultation des Logs d'Accès
#### 🎯 Navigation dans les logs
1. **Réglages** → **Logs**
2. **Filtrer par** :
   - Action : CREATE/UPDATE/DELETE
   - Table : "acces"
   - Utilisateur : Voir ses attributions
   - Logiciel : Voir ses attributions
3. **Vue détaillée** : Format "Avant → Maintenant"

---

## 🚨 Gestion des Erreurs

### Erreurs d'Attribution
#### Doublons
- **Symptôme** : "Cet accès existe déjà"
- **Solution** : Vérifier les accès existants ou modifier le droit existant

#### Utilisateurs/Logiciels archivés
- **Symptôme** : Éléments non disponibles dans les listes
- **Solution** : Désarchiver si nécessaire ou choisir des éléments actifs

#### Droits non configurés
- **Symptôme** : Pas de coût défini pour le type de droit
- **Solution** : Configurer les coûts dans "Gérer les coûts" du logiciel

### Erreurs de Suppression
#### Accès inexistant
- **Symptôme** : "Accès introuvable"
- **Solution** : Actualiser et vérifier l'existence

#### Erreurs de réseau
- **Symptôme** : "Erreur lors de la sauvegarde"
- **Solution** : Vérifier la connexion et réessayer

---

## 📱 Spécificités Mobile

### Interface Adaptée
- **Modales pleine largeur** pour la gestion des accès
- **Boutons empilés verticalement** : Logiciel, Droit, Ajouter
- **Listes déroulantes** optimisées pour le tactile
- **Actions simplifiées** avec icônes claires

### Navigation Mobile
- **Menu hamburger** pour accéder aux sections
- **Swipe** pour naviguer dans les listes longues
- **Touches larges** pour les actions principales

---

## 💡 Bonnes Pratiques

### Attribution d'Accès
1. **Principe du moindre privilège** : Donner le minimum nécessaire
2. **Documentation** : Noter la raison de l'attribution
3. **Validation métier** : Confirmer avec le responsable
4. **Tests** : Vérifier que l'accès fonctionne

### Suivi et Maintenance
1. **Révision trimestrielle** : Audit des accès inutiles
2. **Formation utilisateurs** : Expliquer les niveaux de droits
3. **Processus clairs** : Définir qui peut attribuer quoi
4. **Escalade** : Procédure pour les droits élevés (Admin, Super Admin)

### Optimisation des Coûts
1. **Monitoring régulier** : Surveiller les coûts mensuels
2. **Mutualisation** : Éviter les doublons de licences
3. **Négociation** : Utiliser les données pour négocier avec les fournisseurs
4. **Alternatives** : Évaluer des solutions moins coûteuses

---

## 🔄 Automatisations

### Attribution Automatique
- **Logiciels de base** : Attribution automatique aux nouveaux utilisateurs
- **Profils d'équipe** : Attribution selon l'équipe (future fonctionnalité)
- **Règles métier** : Automatisation selon les postes

### Alertes et Notifications
- **Coûts élevés** : Alerte si dépassement de budget
- **Accès inutilisés** : Détection des droits non utilisés
- **Expirations** : Rappel pour les accès temporaires

### Intégrations Futures
- **Active Directory** : Synchronisation des droits
- **SAML/SSO** : Intégration avec les systèmes d'authentification
- **API** : Connexion avec d'autres outils de gestion