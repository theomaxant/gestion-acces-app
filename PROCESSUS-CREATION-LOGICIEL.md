# 💻 Processus de Création d'un Logiciel

## Vue d'ensemble
Ce processus guide la création d'un nouveau logiciel dans l'application de gestion des accès, avec configuration complète des coûts et paramètres financiers.

---

## Prérequis
### 🔐 Accès requis
- Être connecté à l'application
- Avoir les droits d'administration

### 📋 Informations nécessaires
#### Informations de Base
- **Nom du logiciel** (obligatoire)
- **Description** (recommandée)
- **Équipe assignée** (optionnel)

#### Informations Financières
- **Moyen de paiement** (Carte/Prélèvement/Virement)
- **Périodicité** (Mensuel/Trimestriel/Semestriel/Annuel)
- **Date de souscription**
- **Équipe payeuse** (qui paie pour ce logiciel)

#### Configuration Avancée
- **Logiciel de base** (attribution automatique aux nouveaux utilisateurs)
- **Coûts par type de droit** (Reader, User, Admin, etc.)

---

## Étape 1 : Navigation vers la Section Logiciels
### 📝 Description
Accéder à la page de gestion des logiciels depuis le menu principal.

### 🎯 Actions à effectuer
1. Dans le menu principal, cliquer sur **"Logiciel"**
2. Attendre le chargement de la liste des logiciels

### ✅ Résultat attendu
- La page **"Gestion des Logiciels"** s'affiche
- La liste des logiciels existants est visible avec :
  - Nom, équipe, coût mensuel
  - Actions disponibles (Modifier, Gérer coûts, Gérer accès)
- Le bouton **"+ Ajouter un logiciel"** est présent en haut à droite

### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Page de gestion des logiciels avec la liste et le bouton d'ajout*

---

## Étape 2 : Ouverture du Formulaire de Création
### 📝 Description
Ouvrir la modale de création d'un nouveau logiciel.

### 🎯 Actions à effectuer
1. Cliquer sur le bouton **"+ Ajouter un logiciel"**
2. Attendre l'ouverture de la modale large

### ✅ Résultat attendu
- **Modale "Ajouter un logiciel"** s'ouvre (format large)
- **Formulaire en 3 sections** :
  1. **Informations générales** (Nom, Description, Équipe)
  2. **Informations financières** (Paiement, Périodicité, etc.)
  3. **Configuration** (Logiciel de base)
- Boutons **"Sauvegarder"** et **"Annuler"** en bas

### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Modale de création de logiciel avec formulaire complet*

---

## Étape 3 : Saisie des Informations Générales
### 📝 Description
Remplir les informations de base du logiciel.

### 🎯 Actions à effectuer
1. **Champ "Nom" :**
   - Cliquer dans le champ (obligatoire)
   - Saisir le nom du logiciel (ex: "Microsoft Office 365")
   
2. **Champ "Description" :**
   - Cliquer dans le champ texte multi-lignes
   - Saisir une description détaillée (ex: "Suite bureautique complète avec Word, Excel, PowerPoint")
   
3. **Champ "Équipe assignée" :**
   - Cliquer sur la liste déroulante
   - Sélectionner l'équipe responsable du logiciel (ex: "IT")

### 💡 Conseils
- **Nom :** Être précis et inclure la version si pertinent
- **Description :** Détailler les fonctionnalités principales
- **Équipe :** L'équipe qui gère/administre ce logiciel

### ✅ Résultat attendu
- Les champs de la section "Informations générales" sont remplis
- Le nom est obligatoirement saisi
- La description aide à identifier le logiciel

### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Section "Informations générales" complétée*

---

## Étape 4 : Configuration des Informations Financières
### 📝 Description
Configurer les paramètres de paiement et de facturation du logiciel.

### 🎯 Actions à effectuer
1. **Moyen de paiement :**
   - Sélectionner dans la liste déroulante :
     - **Carte** : Paiement par carte bancaire
     - **Prélèvement** : Prélèvement automatique
     - **Virement** : Virement bancaire manuel
   
2. **Périodicité :**
   - Sélectionner la fréquence de paiement :
     - **Mensuel** : Tous les mois
     - **Trimestriel** : Tous les 3 mois
     - **Semestriel** : Tous les 6 mois
     - **Annuel** : Une fois par an
   
3. **Date de souscription :**
   - Cliquer sur le champ date
   - Sélectionner la date de début d'abonnement
   
4. **Équipe payeuse :**
   - Sélectionner quelle équipe paie pour ce logiciel
   - Peut être différente de l'équipe assignée

### 💡 Information Importante
- La **périodicité** détermine les **échéances de paiement** 
- Les **coûts** sont toujours calculés sur une **base mensuelle**
- L'**équipe payeuse** apparaîtra dans les rapports financiers

### ✅ Résultat attendu
- Tous les champs financiers sont configurés
- La date de souscription est cohérente
- L'équipe payeuse est définie

### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Section "Informations financières" configurée*

---

## Étape 5 : Configuration Avancée
### 📝 Description
Définir les paramètres spéciaux du logiciel.

### 🎯 Actions à effectuer
1. **Case "Logiciel de base" :**
   - Cocher si ce logiciel doit être **automatiquement attribué** aux nouveaux utilisateurs
   - Exemples : Suite Office, Messagerie, Antivirus
   - Laisser décoché pour les logiciels spécialisés

### 💡 Impact du "Logiciel de base"
- **Si coché :** Chaque nouvel utilisateur recevra automatiquement un accès "User" à ce logiciel
- **Si décoché :** Les accès devront être attribués manuellement
- **Modification ultérieure :** Ce paramètre peut être changé après création

### ✅ Résultat attendu
- Le statut "Logiciel de base" est défini selon les besoins
- La configuration est cohérente avec l'usage prévu

### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Section "Configuration" avec option logiciel de base*

---

## Étape 6 : Validation et Création
### 📝 Description
Valider la création du logiciel et traiter les éventuelles erreurs.

### 🎯 Actions à effectuer
1. **Vérification finale :**
   - Relire le nom du logiciel
   - Vérifier les informations financières
   - Confirmer le statut "logiciel de base"
   
2. **Sauvegarde :**
   - Cliquer sur le bouton **"Sauvegarder"**
   - Attendre la confirmation

### ✅ Résultat attendu - Succès
- **Message de confirmation** : "Logiciel créé avec succès"
- **Fermeture automatique** de la modale
- **Actualisation** de la liste des logiciels
- **Nouveau logiciel visible** dans la liste avec coût mensuel à 0€

### ❌ Résultat possible - Erreur
**Nom déjà existant :**
- Message : "Ce nom de logiciel existe déjà"
- Le champ nom est bordé en rouge

**Champs obligatoires manquants :**
- Message : "Veuillez remplir tous les champs obligatoires"
- Champs concernés bordés en rouge

### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Message de confirmation de création réussie*

---

## Étape 7 : Configuration des Coûts par Type de Droit
### 📝 Description
Définir les tarifs spécifiques pour chaque type de droit (Reader, User, Admin, etc.).

### 🎯 Actions à effectuer
1. **Localiser** le nouveau logiciel dans la liste
2. Cliquer sur l'icône **"€"** (Gérer les coûts)
3. **Dans la modale "Gérer les coûts" :**
   - Voir la liste des types de droits disponibles
   - Pour chaque type de droit nécessaire :
     - Saisir le **coût mensuel** en euros
     - Exemple : Reader = 5€, User = 15€, Admin = 30€
   
4. **Sauvegarder** les coûts configurés

### 💡 Information Coûts
- **Base de calcul :** Tous les coûts sont **mensuels**
- **Coût annuel :** Calculé automatiquement (mensuel × 12)
- **Coût total logiciel :** Somme de tous les utilisateurs × leurs coûts respectifs

### ✅ Résultat attendu
- **Coûts définis** pour les types de droits utilisés
- **Coût mensuel total** du logiciel mis à jour dans la liste
- **Calculs automatiques** fonctionnels

### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Modale de gestion des coûts avec tarifs configurés*

---

## Étape 8 : Vérification de la Création Complète
### 📝 Description
S'assurer que le logiciel est correctement créé et configuré.

### 🎯 Actions à effectuer
1. **Dans la liste des logiciels, vérifier :**
   - **Nom** affiché correctement
   - **Équipe** assignée visible
   - **Coût mensuel** calculé (somme des coûts × utilisateurs)
   - **Statut actif** (non archivé)

2. **Tester les fonctionnalités :**
   - **Modifier** : Modale d'édition accessible
   - **Gérer coûts** : Coûts configurés visibles
   - **Gérer accès** : Possibilité d'attribuer des droits

### ✅ Résultat attendu
- **Logiciel opérationnel** et prêt à être utilisé
- **Toutes les actions** fonctionnelles
- **Coûts cohérents** avec la configuration

### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Nouveau logiciel dans la liste avec toutes ses informations*

---

## 🔄 Attribution Automatique (Si Logiciel de Base)
### 📝 Description
Si le logiciel a été marqué comme "logiciel de base", il sera automatiquement attribué aux futurs utilisateurs.

### 🎯 Fonctionnement automatique
1. **À chaque création d'utilisateur :**
   - Le système détecte les logiciels de base
   - Crée automatiquement un accès avec droit "User"
   - Génère les logs correspondants

2. **Pour les utilisateurs existants :**
   - **Pas d'attribution automatique rétroactive**
   - Attribution manuelle nécessaire si souhaité

### 💡 Conseil
Pour attribuer le nouveau logiciel de base aux utilisateurs existants :
1. Aller dans **"Accès"**
2. Utiliser l'attribution en masse
3. Ou attribuer individuellement via **"Gérer les accès"**

---

## 🚨 Gestion des Erreurs Courantes

### Erreur : Nom Déjà Existant
**Symptôme :** "Ce nom de logiciel existe déjà"
**Solution :** Modifier le nom ou vérifier si le logiciel existe déjà

### Erreur : Date Invalide
**Symptôme :** "Format de date invalide"
**Solution :** Utiliser le sélecteur de date ou format JJ/MM/AAAA

### Erreur : Sauvegarde Impossible
**Symptôme :** "Erreur lors de la sauvegarde"
**Solution :** Vérifier la connexion réseau et réessayer

### Erreur : Équipe Introuvable
**Symptôme :** Liste des équipes vide
**Solution :** Créer d'abord les équipes dans la section correspondante

---

## 📊 Impact de la Création

### Automatisations Déclenchées
1. **Si logiciel de base :** Attribution future aux nouveaux utilisateurs
2. **Génération de logs** pour traçabilité
3. **Mise à jour des statistiques** du dashboard
4. **Calcul des échéances** selon la périodicité

### Données Créées
- **Enregistrement logiciel** avec toutes les informations
- **Coûts par type de droit** (si configurés)
- **Logs de création** avec détails complets
- **Entrées d'échéancier** selon la périodicité

---

## 📱 Spécificités Mobile

### Adaptations Interface
- **Formulaire en sections** empilées verticalement
- **Champs optimisés** pour la saisie tactile
- **Listes déroulantes** adaptées au touch
- **Validation responsive** avec messages clairs

### Navigation Mobile
- **Sections dépliables** pour une meilleure lisibilité
- **Boutons larges** et espacés
- **Scroll fluide** dans les longs formulaires