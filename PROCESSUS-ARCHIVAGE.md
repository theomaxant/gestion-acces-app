# 📦 Processus d'Archivage et Gestion des Départs

## Vue d'ensemble
Ce processus guide l'archivage des enregistrements (utilisateurs, logiciels, équipes) avec gestion spécialisée des départs d'entreprise et suppression des accès.

---

## Prérequis
### 🔐 Accès requis
- Être connecté à l'application
- Avoir les droits d'administration

### 📋 Concepts importants
- **Archivage ≠ Suppression** : Les données restent accessibles mais masquées
- **Traçabilité complète** : Tous les archivages sont loggés
- **Réversibilité** : Possibilité de désarchiver si nécessaire
- **Gestion des accès** : Suppression automatique lors des départs

---

## 👤 Archivage d'un Utilisateur (Départ d'Entreprise)

### Étape 1 : Identification du Départ
#### 📝 Description
Localiser l'utilisateur qui quitte l'entreprise et préparer son archivage.

#### 🎯 Actions à effectuer
1. Aller dans **"Utilisateur"** depuis le menu principal
2. **Localiser l'utilisateur** dans la liste
3. **Vérifier ses informations** :
   - Nom, prénom, poste actuel
   - Équipe d'appartenance
   - Nombre de logiciels avec accès
   - Coûts associés

#### ✅ Résultat attendu
- L'utilisateur est visible et identifiable
- Les informations sont à jour
- Les accès actuels sont visibles (nombre dans la colonne)

#### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Utilisateur à archiver dans la liste avec ses informations*

---

### Étape 2 : Déclenchement du Processus "Plus dans l'Entreprise"
#### 📝 Description
Utiliser la fonction spécialisée pour gérer un départ d'entreprise.

#### 🎯 Actions à effectuer
1. Cliquer sur l'icône **"🚪"** (Plus dans l'entreprise) à droite de l'utilisateur
2. **Alternative :** Icône de sortie/déconnexion selon l'affichage

#### ✅ Résultat attendu
- **Modale "Utilisateur plus dans l'entreprise"** s'ouvre
- **Message explicatif** sur les conséquences de l'action
- **Informations utilisateur** récapitulées
- Options **"Confirmer"** et **"Annuler"**

#### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Modale de confirmation de départ d'entreprise*

---

### Étape 3 : Compréhension des Conséquences
#### 📝 Description
Prendre connaissance des actions automatiques qui vont être effectuées.

#### 🎯 Actions automatiques du système
**Ce qui va se passer :**
1. **Archivage de l'utilisateur** : Plus visible dans la liste principale
2. **Suppression de TOUS les accès** : Retrait automatique des droits sur tous les logiciels
3. **Conservation des données** : Historique et logs préservés
4. **Mise à jour des coûts** : Recalcul automatique des coûts totaux
5. **Génération de logs** : Traçabilité complète de l'opération

#### ⚠️ Points d'attention
- **Action irréversible automatiquement** (mais désarchivage possible)
- **Impact sur les coûts** : Réduction immédiate des coûts totaux
- **Accès supprimés** : L'utilisateur ne peut plus accéder aux logiciels
- **Historique préservé** : Toutes les données restent pour audit

#### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Message détaillant les conséquences de l'archivage*

---

### Étape 4 : Confirmation de l'Archivage
#### 📝 Description
Valider définitivement le départ et l'archivage de l'utilisateur.

#### 🎯 Actions à effectuer
1. **Lecture attentive** du message de confirmation
2. **Vérification** que c'est bien le bon utilisateur
3. Cliquer sur **"Confirmer le départ"** ou équivalent
4. Attendre le traitement (peut prendre quelques secondes)

#### ✅ Résultat attendu - Succès
- **Message de confirmation** : "Utilisateur archivé avec succès"
- **Disparition** de l'utilisateur de la liste principale
- **Suppression automatique** de tous ses accès
- **Logs multiples générés** :
  - Archivage de l'utilisateur
  - Suppression de chaque accès
  - Mise à jour des coûts

#### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Confirmation de l'archivage réussi et liste mise à jour*

---

### Étape 5 : Vérification de l'Archivage
#### 📝 Description
S'assurer que l'archivage s'est déroulé correctement.

#### 🎯 Actions de vérification
1. **Vérifier la liste principale :**
   - L'utilisateur n'est plus visible
   - Les statistiques sont mises à jour

2. **Consulter les utilisateurs archivés :**
   - Utiliser le filtre "Archivés" si disponible
   - Vérifier que l'utilisateur apparaît avec le statut archivé

3. **Vérifier les accès :**
   - Aller dans **"Accès"**
   - Constater que les accès de l'utilisateur ont disparu

4. **Consulter les logs :**
   - Aller dans **"Réglages"** → **"Logs"**
   - Filtrer par utilisateur pour voir l'historique complet

#### ✅ Résultat attendu
- **Utilisateur archivé** mais données préservées
- **Accès supprimés** : 0 logiciel assigné
- **Logs complets** : Traçabilité de toutes les actions
- **Coûts recalculés** : Impact sur les totaux

#### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Vue des logs montrant l'archivage et suppressions d'accès*

---

## 💻 Archivage d'un Logiciel

### Étape 1 : Accès au Logiciel à Archiver
#### 📝 Description
Localiser et préparer l'archivage d'un logiciel obsolète ou non utilisé.

#### 🎯 Actions à effectuer
1. Aller dans **"Logiciel"** depuis le menu principal
2. Localiser le logiciel à archiver
3. **Vérifier les informations** :
   - Nombre d'utilisateurs actuels
   - Coûts mensuels/annuels
   - Statut "logiciel de base"

#### ⚠️ Considérations importantes
- **Utilisateurs impactés** : Vérifier qui utilise encore ce logiciel
- **Coûts** : Impact sur le budget total
- **Dépendances** : S'assurer qu'aucun processus critique ne dépend de ce logiciel

---

### Étape 2 : Archivage du Logiciel
#### 📝 Description
Procéder à l'archivage du logiciel sélectionné.

#### 🎯 Actions à effectuer
1. Cliquer sur l'icône **"📦"** (Archiver) du logiciel
2. **Confirmer l'archivage** dans la boîte de dialogue
3. Attendre la confirmation

#### ✅ Résultat attendu
- **Logiciel archivé** : Plus visible dans la liste principale
- **Accès préservés** : Les utilisateurs gardent leurs accès (mais logiciel marqué archivé)
- **Coûts maintenus** : Les coûts restent comptabilisés
- **Nouvelles attributions impossibles** : Plus possible d'attribuer ce logiciel

#### 📸 **[CAPTURE D'ÉCRAN À INSÉRER ICI]**
*Confirmation d'archivage de logiciel*

---

## 🏢 Archivage d'une Équipe

### Étape 1 : Vérification des Dépendances
#### 📝 Description
Avant d'archiver une équipe, s'assurer qu'elle peut être archivée.

#### 🎯 Vérifications nécessaires
1. **Aller dans "Réglages" → "Équipe"**
2. **Vérifier que l'équipe est vide :**
   - Aucun utilisateur rattaché
   - Aucun logiciel assigné
   - Aucune responsabilité financière active

#### ⚠️ Contraintes d'archivage
- **Équipe avec membres** : Impossible d'archiver
- **Logiciels assignés** : Réassigner avant archivage
- **Équipe payeuse** : Changer l'équipe payeuse des logiciels

---

### Étape 2 : Archivage de l'Équipe Vide
#### 📝 Description
Archiver une équipe qui n'a plus de dépendances.

#### 🎯 Actions à effectuer
1. Cliquer sur **"📦 Archiver"** pour l'équipe concernée
2. Confirmer l'archivage
3. Vérifier la disparition de la liste

#### ✅ Résultat attendu
- **Équipe archivée** et non visible
- **Historique préservé** : Les anciens rattachements restent visibles dans l'historique
- **Logs générés** : Traçabilité de l'archivage

---

## 🔄 Désarchivage (Réactivation)

### Cas d'Usage
#### 📝 Description
Réactiver un élément archivé par erreur ou en cas de retour.

#### 🎯 Éléments désarchivables
- **Utilisateur** : Retour dans l'entreprise, erreur d'archivage
- **Logiciel** : Réactivation d'un outil
- **Équipe** : Reformation d'une équipe

### Processus de Désarchivage
#### Actions à effectuer
1. **Accéder aux éléments archivés** :
   - Utiliser les filtres "Archivés" dans chaque section
   - Ou rechercher dans les logs

2. **Cliquer sur "Désarchiver"** ou icône équivalente

3. **Confirmer la réactivation**

#### ⚠️ Points d'attention
- **Utilisateur désarchivé** : Ne récupère PAS automatiquement ses anciens accès
- **Logiciel désarchivé** : Redevient disponible pour attribution
- **Données préservées** : Toutes les informations sont restaurées

---

## 📊 Impact de l'Archivage

### Statistiques et Rapports
#### Modifications automatiques
1. **Dashboard** : Mise à jour des compteurs
2. **Coûts totaux** : Recalcul immédiat
3. **Rapports** : Les éléments archivés n'apparaissent plus
4. **Échéancier** : Suppression des échéances liées

### Conservation des Données
#### Éléments préservés
- **Logs complets** : Historique de toutes les actions
- **Données utilisateur** : Informations personnelles et professionnelles
- **Historique des accès** : Traçabilité des droits passés
- **Informations financières** : Coûts et paiements passés

---

## 📝 Traçabilité de l'Archivage

### Logs Automatiques
#### Types de logs générés
1. **ARCHIVE - Utilisateur** : Archivage de l'utilisateur
2. **DELETE - Accès** : Suppression de chaque accès (multiple)
3. **ARCHIVE - Logiciel** : Archivage de logiciel
4. **ARCHIVE - Équipe** : Archivage d'équipe

#### Format des logs d'archivage
```
📦 ARCHIVAGE - Utilisateurs (12345678...)
Il y a 5 minutes | Utilisateur plus dans l'entreprise | Utilisateur: Jean Dupont

Valeurs archivées:
• Nom: Jean Dupont
• Email: jean.dupont@entreprise.com
• Poste: Directeur Adjoint
• Équipe: Direction
```

---

## 🚨 Gestion des Erreurs

### Erreurs d'Archivage
#### Équipe avec dépendances
- **Symptôme** : "Impossible d'archiver, équipe non vide"
- **Solution** : Réassigner les utilisateurs et logiciels

#### Erreur technique
- **Symptôme** : "Erreur lors de l'archivage"
- **Solution** : Vérifier la connexion et réessayer

#### Confirmation non donnée
- **Symptôme** : Aucune action effectuée
- **Solution** : Confirmer explicitement l'archivage

### Récupération d'Erreurs
#### Archivage par erreur
1. **Accéder aux éléments archivés**
2. **Désarchiver l'élément**
3. **Réattribuer les accès si nécessaire** (pour utilisateurs)

---

## 📱 Spécificités Mobile

### Interface d'Archivage
- **Boutons d'action** adaptés au tactile
- **Confirmations claires** avec messages explicites
- **Feedback visuel** pour les actions en cours

### Navigation dans les Archives
- **Filtres simplifiés** pour accéder aux éléments archivés
- **Actions de désarchivage** facilement accessibles
- **Historique consultable** via les logs

---

## 💡 Bonnes Pratiques

### Avant Archivage
1. **Communiquer** avec l'utilisateur/équipe concerné
2. **Vérifier les dépendances** (projets en cours, responsabilités)
3. **Sauvegarder** les informations importantes si nécessaire
4. **Planifier** l'archivage en dehors des heures critiques

### Pendant l'Archivage
1. **Vérifier l'identité** de l'élément à archiver
2. **Lire attentivement** les confirmations
3. **Attendre** la fin du processus avant autre action

### Après Archivage
1. **Vérifier** que l'archivage s'est bien déroulé
2. **Consulter les logs** pour confirmer
3. **Informer** les parties prenantes si nécessaire
4. **Mettre à jour** les processus internes

---

## 🔍 Audit et Conformité

### Traçabilité Complète
- **Tous les archivages** sont loggés avec détails
- **Horodatage précis** de chaque action
- **Utilisateur responsable** identifié
- **Raisons d'archivage** documentées dans les logs

### Rapports d'Audit
- **Export des logs** possible pour audit externe
- **Filtrage par période** pour analyses temporelles
- **Recherche par utilisateur** ou logiciel archivé
- **Vue chronologique** des archivages

### Conformité RGPD
- **Données préservées** mais non accessibles (archivage)
- **Possibilité de désarchivage** pour accès aux données
- **Logs de traçabilité** pour prouver la gestion des données
- **Suppression définitive** possible sur demande (non implémentée par défaut)