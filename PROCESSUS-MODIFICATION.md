# ✏️ Processus de Modification d'Enregistrements

## Vue d'ensemble
Ce processus guide la modification des enregistrements existants (utilisateurs, logiciels, équipes) avec traçabilité complète des changements.

---

## Prérequis
### 🔐 Accès requis
- Être connecté à l'application
- Avoir les droits d'administration

### 📋 Informations importantes
- **Traçabilité :** Tous les changements sont enregistrés dans les logs
- **Format "Avant → Maintenant" :** Les modifications sont visibles dans les logs
- **Validation :** Certains champs ont des contraintes (email unique, etc.)

---

## 🧑 Modification d'un Utilisateur

### Étape 1 : Localisation de l'Utilisateur
#### 📝 Description
Trouver l'utilisateur à modifier dans la liste.

#### 🎯 Actions à effectuer
1. Aller dans **"Utilisateur"** depuis le menu principal
2. **Localiser l'utilisateur** dans la liste :
   - Utiliser la recherche si nécessaire
   - Faire défiler la liste
   - Vérifier les informations affichées (nom, email, équipe)

#### ✅ Résultat attendu
- L'utilisateur est visible dans la liste
- Les informations actuelles sont affichées
- Les actions sont disponibles (icônes à droite)

#### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Liste des utilisateurs avec l'utilisateur à modifier surligné*

---

### Étape 2 : Ouverture du Formulaire de Modification
#### 📝 Description
Accéder au formulaire de modification de l'utilisateur.

#### 🎯 Actions à effectuer
1. Cliquer sur l'icône **"✏️ Modifier"** à droite de l'utilisateur
2. Attendre l'ouverture de la modale

#### ✅ Résultat attendu
- **Modale "Modifier l'utilisateur"** s'ouvre
- **Formulaire pré-rempli** avec les valeurs actuelles :
  - Nom, Prénom, Email, Poste, Équipe
- **Champs modifiables** (sauf contraintes système)
- Boutons **"Sauvegarder"** et **"Annuler"**

#### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Modale de modification avec formulaire pré-rempli*

---

### Étape 3 : Modification des Informations
#### 📝 Description
Apporter les modifications nécessaires aux informations de l'utilisateur.

#### 🎯 Actions à effectuer
**Exemples de modifications courantes :**

1. **Changement d'équipe :**
   - Cliquer sur la liste déroulante "Équipe"
   - Sélectionner la nouvelle équipe (ex: RH → Direction)
   
2. **Évolution de poste :**
   - Modifier le champ "Poste"
   - Saisir le nouveau poste (ex: Assistant RH → Directeur Adjoint)
   
3. **Mise à jour email :**
   - Modifier l'adresse email si nécessaire
   - Vérifier le format et l'unicité

4. **Correction nom/prénom :**
   - Corriger les erreurs de saisie
   - Ajuster la casse si nécessaire

#### ⚠️ Points d'attention
- **Email unique :** Ne doit pas exister pour un autre utilisateur
- **Champs obligatoires :** Nom, Prénom, Email doivent rester remplis
- **Cohérence :** S'assurer que les modifications sont logiques

#### ✅ Résultat attendu
- Les modifications sont saisies dans les champs appropriés
- Aucun message d'erreur ne s'affiche
- Les changements sont visibles dans le formulaire

#### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Formulaire avec modifications apportées (exemple : changement d'équipe)*

---

### Étape 4 : Validation des Modifications
#### 📝 Description
Sauvegarder les modifications et gérer les éventuelles erreurs.

#### 🎯 Actions à effectuer
1. **Vérification finale** des informations modifiées
2. Cliquer sur **"Sauvegarder"**
3. Attendre la confirmation

#### ✅ Résultat attendu - Succès
- **Message de confirmation** : "Utilisateur modifié avec succès"
- **Fermeture de la modale**
- **Actualisation** de la liste avec nouvelles informations
- **Log automatique** généré avec format "Avant → Maintenant"

#### ❌ Gestion des erreurs
- **Email déjà existant :** Changer l'email ou annuler
- **Champs obligatoires vides :** Remplir les champs requis
- **Erreur réseau :** Réessayer la sauvegarde

#### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Message de confirmation et liste mise à jour*

---

## 💻 Modification d'un Logiciel

### Étape 1 : Accès au Logiciel
#### 📝 Description
Localiser et accéder au logiciel à modifier.

#### 🎯 Actions à effectuer
1. Aller dans **"Logiciel"** depuis le menu principal
2. Localiser le logiciel dans la liste
3. Cliquer sur l'icône **"✏️ Modifier"**

#### ✅ Résultat attendu
- **Modale "Modifier le logiciel"** s'ouvre (format large)
- **3 sections pré-remplies** :
  - Informations générales
  - Informations financières  
  - Configuration
- Toutes les valeurs actuelles sont affichées

#### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Modale de modification de logiciel avec sections pré-remplies*

---

### Étape 2 : Modifications Courantes
#### 📝 Description
Apporter les modifications nécessaires selon le besoin.

#### 🎯 Types de modifications fréquentes

**Changement d'équipe assignée :**
- Sélectionner la nouvelle équipe responsable
- Impact sur l'organisation des responsabilités

**Mise à jour des informations financières :**
- Modifier la périodicité (ex: Mensuel → Annuel)
- Changer le moyen de paiement
- Ajuster l'équipe payeuse

**Évolution du statut "Logiciel de base" :**
- Cocher/décocher selon les nouveaux besoins
- Impact sur l'attribution automatique future

**Modification des coûts :**
- Se fait via **"Gérer les coûts"** après sauvegarde
- Ajustement des tarifs par type de droit

#### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Exemple de modification des informations financières*

---

## 🏢 Modification d'une Équipe

### Étape 1 : Accès à l'Équipe
#### 📝 Description
Accéder à la modification d'équipe via le menu Réglages.

#### 🎯 Actions à effectuer
1. Cliquer sur **"Réglages"** dans le menu principal
2. Sélectionner **"Équipe"** dans le sous-menu
3. Localiser l'équipe à modifier
4. Cliquer sur **"✏️ Modifier"**

#### ✅ Résultat attendu
- **Modale "Modifier l'équipe"** s'ouvre
- **Champs pré-remplis** : Nom, Description
- **Informations actuelles** visibles

#### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Modale de modification d'équipe*

---

### Étape 2 : Modifications d'Équipe
#### 📝 Description
Modifier les informations de l'équipe.

#### 🎯 Modifications possibles
1. **Changement de nom :**
   - Renommer l'équipe selon l'évolution organisationnelle
   - Ex: "IT" → "Digital & Innovation"

2. **Mise à jour de la description :**
   - Ajuster selon les nouvelles responsabilités
   - Préciser le périmètre d'action

#### ⚠️ Impact des modifications
- **Changement de nom :** Visible partout dans l'application
- **Utilisateurs affectés :** Restent liés à l'équipe
- **Logiciels associés :** Restent assignés à l'équipe

---

## 📊 Traçabilité des Modifications

### Logs Automatiques Générés
#### 📝 Description
Chaque modification génère automatiquement des logs détaillés.

#### 🎯 Informations enregistrées
1. **Horodatage précis** de la modification
2. **Utilisateur** qui a effectué la modification
3. **Type d'action** : "UPDATE - Modification"
4. **Table concernée** : utilisateurs, logiciels, équipes
5. **Format "Avant → Maintenant"** pour chaque champ modifié

#### 🔍 Exemple de log généré
```
✏️ MODIFICATION - Utilisateurs (12345678...)
Il y a 2 minutes | Modification utilisateur | Utilisateur: Jean Dupont

Changements:
Équipe: RH → Direction  
Poste: Assistant RH → Directeur Adjoint
Coût mensuel: 2 500 € → 4 200 €
```

#### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Exemple de log de modification dans l'interface*

---

### Consultation des Logs
#### 📝 Description
Accéder à l'historique des modifications pour audit.

#### 🎯 Actions à effectuer
1. Aller dans **"Réglages"** → **"Logs"**
2. **Filtrer par :**
   - Action : "Modification"
   - Utilisateur concerné
   - Période
3. **Consulter les détails** avec vue "Avant → Maintenant"

#### ✅ Informations disponibles
- **Liste chronologique** des modifications
- **Détails complets** des changements
- **Possibilité d'export** pour audit externe
- **Recherche et filtrage** avancés

---

## 🚨 Gestion des Erreurs et Contraintes

### Erreurs de Validation
#### Contraintes d'Unicité
- **Email utilisateur :** Doit rester unique
- **Nom d'équipe :** Pas de doublons
- **Nom de logiciel :** Pas de doublons

#### Champs Obligatoires
- **Utilisateur :** Nom, Prénom, Email
- **Logiciel :** Nom
- **Équipe :** Nom

### Erreurs de Cohérence
#### Dépendances
- **Suppression d'équipe :** Impossible si des utilisateurs y sont rattachés
- **Modification d'email :** Vérifier que le nouvel email n'existe pas
- **Dates :** Cohérence des dates de souscription

### Solutions aux Erreurs Courantes
1. **Email déjà existant :**
   - Vérifier dans la liste des utilisateurs
   - Utiliser un email alternatif
   - Contacter l'administrateur

2. **Erreur de sauvegarde :**
   - Vérifier la connexion réseau
   - Actualiser la page
   - Réessayer la modification

3. **Champs manquants :**
   - Remplir tous les champs obligatoires (*)
   - Vérifier les formats (email, dates)

---

## 📱 Spécificités Mobile

### Interface Adaptée
- **Formulaires optimisés** pour écrans tactiles
- **Champs empilés** verticalement
- **Boutons plus larges** pour faciliter l'interaction
- **Validation en temps réel** adaptée au mobile

### Navigation Mobile
- **Menu hamburger** pour accéder aux sections
- **Swipe** pour naviguer entre les sections
- **Clavier adaptatif** selon le type de champ

---

## 💡 Bonnes Pratiques

### Avant Modification
1. **Vérifier** les informations actuelles
2. **S'assurer** de la nécessité de la modification
3. **Préparer** les nouvelles informations

### Pendant Modification
1. **Modifier un champ à la fois** pour éviter les erreurs
2. **Vérifier** la cohérence des informations
3. **Tester** avant sauvegarde finale

### Après Modification
1. **Vérifier** que les changements sont bien appliqués
2. **Consulter les logs** pour confirmer l'enregistrement
3. **Informer les utilisateurs** concernés si nécessaire

---

## 🔄 Impact des Modifications

### Automatisations Déclenchées
1. **Génération de logs** détaillés
2. **Mise à jour des statistiques** du dashboard
3. **Recalcul des coûts** si nécessaire
4. **Notifications** aux utilisateurs concernés (si configuré)

### Propagation des Changements
- **Changement d'équipe :** Impact sur les rapports et coûts
- **Modification de logiciel :** Répercussion sur tous les utilisateurs
- **Évolution de poste :** Mise à jour dans tous les affichages