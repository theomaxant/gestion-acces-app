# 👤 Processus de Création d'un Utilisateur

## Vue d'ensemble
Ce processus guide la création d'un nouvel utilisateur dans l'application de gestion des accès, avec attribution automatique des logiciels de base.

---

## Prérequis
### 🔐 Accès requis
- Être connecté à l'application
- Avoir les droits d'administration

### 📋 Informations nécessaires
- **Nom** (obligatoire)
- **Prénom** (obligatoire)  
- **Email** (obligatoire, unique)
- **Poste** (recommandé)
- **Équipe** (optionnel)

---

## Étape 1 : Navigation vers la Section Utilisateurs
### 📝 Description
Accéder à la page de gestion des utilisateurs depuis le menu principal.

### 🎯 Actions à effectuer
1. Dans le menu principal, cliquer sur **"Utilisateur"**
2. Attendre le chargement de la liste des utilisateurs

### ✅ Résultat attendu
- La page **"Gestion des Utilisateurs"** s'affiche
- La liste des utilisateurs existants est visible
- Le bouton **"+ Ajouter un utilisateur"** est présent en haut à droite

### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Page de gestion des utilisateurs avec la liste et le bouton d'ajout*

---

## Étape 2 : Ouverture du Formulaire de Création
### 📝 Description
Ouvrir la modale de création d'un nouvel utilisateur.

### 🎯 Actions à effectuer
1. Cliquer sur le bouton **"+ Ajouter un utilisateur"**
2. Attendre l'ouverture de la modale

### ✅ Résultat attendu
- **Modale "Ajouter un utilisateur"** s'ouvre
- Formulaire avec 5 champs visibles :
  - Nom (champ obligatoire marqué *)
  - Prénom (champ obligatoire marqué *)
  - Email (champ obligatoire marqué *)
  - Poste
  - Équipe (liste déroulante)
- Boutons **"Sauvegarder"** et **"Annuler"** en bas

### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Modale de création d'utilisateur avec formulaire vide*

---

## Étape 3 : Saisie des Informations Obligatoires
### 📝 Description
Remplir les champs obligatoires pour créer l'utilisateur.

### 🎯 Actions à effectuer
1. **Champ "Nom" :**
   - Cliquer dans le champ
   - Saisir le nom de famille (ex: "Dupont")
   
2. **Champ "Prénom" :**
   - Cliquer dans le champ
   - Saisir le prénom (ex: "Jean")
   
3. **Champ "Email" :**
   - Cliquer dans le champ
   - Saisir l'adresse email (ex: "jean.dupont@entreprise.com")

### ⚠️ Points d'attention
- **Format email :** Doit contenir @ et un domaine valide
- **Unicité :** L'email ne doit pas déjà exister dans le système
- **Casse :** Peu importe pour le nom/prénom

### ✅ Résultat attendu
- Les trois champs obligatoires sont remplis
- Aucun message d'erreur ne s'affiche
- Les champs restent bordés en gris (pas d'erreur)

### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Formulaire avec les champs obligatoires remplis*

---

## Étape 4 : Saisie des Informations Complémentaires
### 📝 Description
Ajouter les informations optionnelles pour enrichir le profil utilisateur.

### 🎯 Actions à effectuer
1. **Champ "Poste" :**
   - Cliquer dans le champ
   - Saisir le poste (ex: "Développeur Frontend")
   
2. **Champ "Équipe" :**
   - Cliquer sur la liste déroulante
   - Sélectionner l'équipe appropriée (ex: "Développement")
   - Si aucune équipe ne convient, laisser vide

### 💡 Conseils
- **Poste :** Être précis pour faciliter l'attribution des droits
- **Équipe :** Aide pour l'organisation et les rapports
- **Ces champs peuvent être modifiés ultérieurement**

### ✅ Résultat attendu
- Tous les champs souhaités sont remplis
- L'équipe sélectionnée apparaît dans le champ
- Le formulaire est complet et cohérent

### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Formulaire complètement rempli avec tous les champs*

---

## Étape 5 : Validation et Création
### 📝 Description
Valider la création de l'utilisateur et traiter les éventuelles erreurs.

### 🎯 Actions à effectuer
1. Vérifier une dernière fois les informations saisies
2. Cliquer sur le bouton **"Sauvegarder"**
3. Attendre la confirmation de création

### ✅ Résultat attendu - Succès
- **Message de confirmation** : "Utilisateur créé avec succès"
- **Fermeture automatique** de la modale
- **Actualisation** de la liste des utilisateurs
- **Nouvel utilisateur visible** dans la liste

### ❌ Résultat possible - Erreur
**Email déjà existant :**
- Message d'erreur : "Cet email existe déjà"
- Le champ email est bordé en rouge
- La modale reste ouverte pour correction

**Champs obligatoires manquants :**
- Les champs vides obligatoires sont bordés en rouge
- Message : "Veuillez remplir tous les champs obligatoires"

### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Message de confirmation de création réussie*

---

## Étape 6 : Attribution Automatique des Logiciels de Base
### 📝 Description
Le système attribue automatiquement les "logiciels de base" au nouvel utilisateur avec des droits "User".

### 🎯 Actions automatiques du système
1. **Identification** des logiciels marqués comme "logiciel de base"
2. **Création automatique** des accès avec droit "User"
3. **Enregistrement** dans les logs système

### ✅ Résultat attendu
- **Accès automatiques** créés pour tous les logiciels de base
- **Droits "User"** attribués par défaut
- **Logs** générés pour traçabilité

### 💡 Information
Les logiciels de base sont configurés dans la section "Logiciel" avec la case "Logiciel de base" cochée.

### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Liste des accès automatiquement créés pour le nouvel utilisateur*

---

## Étape 7 : Vérification de la Création
### 📝 Description
Vérifier que l'utilisateur a été correctement créé avec toutes ses informations.

### 🎯 Actions à effectuer
1. **Localiser** le nouvel utilisateur dans la liste
2. **Vérifier** les informations affichées :
   - Nom et prénom
   - Email
   - Poste
   - Équipe
   - Nombre de logiciels (doit correspondre aux logiciels de base)

### ✅ Résultat attendu
- **Utilisateur visible** dans la liste avec statut "Actif"
- **Informations complètes** affichées correctement
- **Nombre de logiciels** > 0 (logiciels de base attribués)
- **Actions disponibles** : Modifier, Gérer accès, Voir coûts

### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Nouvel utilisateur dans la liste avec toutes ses informations*

---

## 🔍 Vérification des Accès Créés (Optionnel)
### 📝 Description
Vérifier les accès automatiquement attribués au nouvel utilisateur.

### 🎯 Actions à effectuer
1. Cliquer sur l'icône **bouclier (🛡️)** à côté du nouvel utilisateur
2. Consulter la liste des accès dans la modale "Gérer les accès"

### ✅ Résultat attendu
- **Liste des logiciels de base** avec droits "User"
- **Possibilité d'ajouter** de nouveaux accès
- **Possibilité de modifier** les droits existants

### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Modale de gestion des accès du nouvel utilisateur*

---

## 🚨 Gestion des Erreurs Courantes

### Erreur : Email Invalide
**Symptôme :** "Format d'email invalide"
**Solution :** Vérifier le format (exemple@domaine.com)

### Erreur : Email Déjà Existant
**Symptôme :** "Cet email existe déjà"
**Solution :** Utiliser un autre email ou vérifier si l'utilisateur existe déjà

### Erreur : Connexion Réseau
**Symptôme :** "Erreur lors de la sauvegarde"
**Solution :** Vérifier la connexion et réessayer

### Erreur : Champs Obligatoires
**Symptôme :** Champs bordés en rouge
**Solution :** Remplir tous les champs marqués d'un astérisque (*)

---

## 📊 Impact de la Création
### Automatisations Déclenchées
1. **Attribution des logiciels de base** avec droits "User"
2. **Génération de logs** pour traçabilité
3. **Mise à jour des statistiques** du dashboard
4. **Calcul automatique des coûts** si définis

### Données Créées
- **Enregistrement utilisateur** dans la table utilisateurs
- **Enregistrements d'accès** pour chaque logiciel de base
- **Logs de création** avec horodatage et détails

---

## 📱 Spécificités Mobile
### Adaptations Interface
- **Formulaire optimisé** pour les écrans tactiles
- **Champs empilés verticalement** pour faciliter la saisie
- **Boutons plus grands** et espacés
- **Clavier adaptatif** selon le type de champ (email, texte)

### Navigation Mobile
- **Menu hamburger** pour accéder aux sections
- **Scroll** vertical pour naviguer dans les longs formulaires
- **Validation optimisée** pour le tactile