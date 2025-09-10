/**
 * Gestionnaire des tutoriels et documentation
 */

class ProcessManager {
    constructor() {
        this.processContent = {};
        this.currentTutorial = 'all';
        this.init();
    }

    init() {
        this.loadTutorialContent();
        this.setupEventListeners();
        this.showAllProcesses();
    }

    setupEventListeners() {
        // Navigation entre les processus
        document.querySelectorAll('.process-nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const processType = e.target.id.replace('btn-process-', '').replace('btn-all-processes', 'all');
                this.showProcess(processType);
                this.updateActiveButton(e.target);
            });
        });

        // Bouton d'export Markdown
        const exportBtn = document.getElementById('btn-export-markdown');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportCurrentProcessToMarkdown();
            });
        }
    }

    updateActiveButton(activeBtn) {
        // Retirer la classe active de tous les boutons
        document.querySelectorAll('.process-nav-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-blue-600', 'text-white');
            btn.classList.add('bg-gray-200', 'text-gray-700');
        });

        // Ajouter la classe active au bouton cliqué
        activeBtn.classList.add('active', 'bg-blue-600', 'text-white');
        activeBtn.classList.remove('bg-gray-200', 'text-gray-700');
    }

    loadTutorialContent() {
        // Contenu des tutoriels intégré directement dans le JavaScript
        this.processContent = {
            connection: {
                title: "Comment se connecter à l'application",
                content: `
# 🔐 COMMENT SE CONNECTER À L'APPLICATION

## 📋 Ce que vous allez faire
Se connecter de manière sécurisée à l'application de gestion des accès.

---

## ⚡ ÉTAPES À SUIVRE

### ÉTAPE 1 : Ouvrir l'application
**Action :** Ouvrir votre navigateur et aller sur l'application
1. Ouvrez votre navigateur web (Chrome, Firefox, Safari...)
2. Tapez l'URL de l'application dans la barre d'adresse
3. Appuyez sur **Entrée**

**✅ Résultat :** Vous voyez l'écran de connexion avec un champ mot de passe

---

### ÉTAPE 2 : Saisir le mot de passe
**Action :** Entrer le mot de passe de sécurité
1. Cliquez dans le champ **"Mot de passe"**
2. Tapez le mot de passe fourni : \`Celesty2025!\`
3. ⚠️ Le mot de passe s'affiche en points pour la sécurité
4. Cliquez sur **"Se connecter"** ou appuyez sur **Entrée**

**✅ Résultat :** Le formulaire passe à l'étape suivante (captcha)

---

### ÉTAPE 3 : Résoudre le captcha anti-robot
**Action :** Prouver que vous n'êtes pas un robot
1. 🧮 Un calcul mathématique s'affiche (exemple: \`7 + 3 = ?\`)
2. Calculez le résultat dans votre tête
3. Tapez la réponse dans le champ (exemple: \`10\`)
4. Cliquez sur **"Vérifier"** ou appuyez sur **Entrée**

**✅ Résultat :** Si correct, passage à la sélection d'utilisateur

---

### ÉTAPE 4 : S'identifier pour l'audit
**Action :** Indiquer qui vous êtes
1. 👤 Une liste déroulante apparaît avec les noms des employés
2. Cliquez sur la liste pour la dérouler
3. Sélectionnez votre nom (ordre alphabétique: Jean, Pierre, Sophie...)
4. Cliquez sur **"Se connecter"**

**✅ Résultat :** Connexion réussie, accès au tableau de bord

---

### ÉTAPE 5 : Accès au tableau de bord
**Action :** Utiliser l'application
1. ✅ Vous voyez le message "Connexion réussie !"
2. Le tableau de bord principal s'affiche
3. Votre nom est maintenant enregistré pour toutes vos actions

**✅ Résultat :** Vous êtes connecté et identifié pour l'audit trail

---

## 🚨 QUE FAIRE EN CAS DE PROBLÈME ?

### ❌ "Mot de passe incorrect"
**Si vous voyez ce message :**
1. Vérifiez que vous tapez le bon mot de passe : \`Celesty2025!\`
2. Attention aux majuscules/minuscules (C majuscule, ! à la fin)
3. Videz le champ et retapez entièrement

### ❌ "Réponse incorrecte" (Captcha)
**Si le captcha ne fonctionne pas :**
1. 🧮 Une nouvelle question se génère automatiquement
2. Recalculez la nouvelle opération
3. Vérifiez bien l'opération (+ addition, - soustraction, × multiplication)
4. Tapez seulement le nombre (pas de virgule)

### ❌ "Veuillez sélectionner qui vous êtes"
**Si l'identification ne fonctionne pas :**
1. Cliquez bien dans la liste déroulante
2. Sélectionnez votre nom complet (Jean Dupont, Pierre Durand, Sophie Martin)
3. Si votre nom n'apparaît pas, contactez l'administrateur

### ❌ La page ne se charge pas
**Si ça ne marche pas :**
1. Vérifiez votre connexion internet
2. Actualisez la page (F5)
3. Videz le cache du navigateur
4. Contactez votre administrateur

---

## 🔒 SÉCURITÉ & TRAÇABILITÉ

**Important :**
- 🔑 Ne partagez jamais le mot de passe \`Celesty2025!\`
- 🤖 Le captcha empêche les accès automatisés par des robots
- 👤 Votre identification permet de tracer qui fait quoi
- 📝 Toutes vos actions sont enregistrées dans les logs avec votre nom
- 🚪 Déconnectez-vous après utilisation (bouton en haut à droite)
- 💻 Fermez le navigateur sur un ordinateur partagé

**Pourquoi 3 étapes ?**
1. **Mot de passe** : Protection d'accès de base
2. **Captcha** : Bloquer les robots et accès automatisés
3. **Identification** : Savoir qui effectue chaque action pour l'audit

---

## ➡️ ÉTAPE SUIVANTE
Une fois connecté avec votre nom identifié, vous pouvez passer aux processus de création d'utilisateurs ou de logiciels. Toutes vos actions seront maintenant tracées !
                `
            },
            creation: {
                title: "Comment créer un utilisateur ou un logiciel",
                content: `
# 👤 COMMENT CRÉER UN NOUVEL UTILISATEUR

## 📋 Ce que vous allez faire
Ajouter un nouveau collaborateur dans l'application avec ses accès automatiques.

---

## ⚡ ÉTAPES À SUIVRE

### ÉTAPE 1 : Aller dans la section Utilisateurs
**Action :** Naviguer vers la gestion des utilisateurs
1. Dans le menu du haut, cliquez sur **"Utilisateur"**
2. Vous voyez la liste de tous les utilisateurs

**✅ Résultat :** Vous êtes sur la page des utilisateurs

---

### ÉTAPE 2 : Ouvrir le formulaire de création
**Action :** Lancer la création d'un nouvel utilisateur
1. Cliquez sur le bouton **"+ Ajouter un utilisateur"** (en haut à droite)
2. Un formulaire s'ouvre

**✅ Résultat :** Le formulaire de création est ouvert

---

### ÉTAPE 3 : Remplir les informations personnelles
**Action :** Saisir les informations de base
1. **Nom** : Tapez le nom de famille (obligatoire)
2. **Prénom** : Tapez le prénom (obligatoire)
3. **Email** : Tapez l'adresse email professionnelle (optionnel)
4. **Téléphone** : Tapez le numéro de téléphone (optionnel)

**✅ Résultat :** Les informations personnelles sont saisies

---

### ÉTAPE 4 : Choisir l'équipe
**Action :** Affecter l'utilisateur à une équipe
1. Dans la liste déroulante **"Équipe"**, sélectionnez l'équipe
2. ⚠️ L'équipe détermine automatiquement les logiciels attribués

**✅ Résultat :** L'équipe est sélectionnée

---

### ÉTAPE 5 : Définir le statut
**Action :** Activer ou désactiver le compte
1. Choisissez **"Actif"** si la personne doit avoir accès immédiatement
2. Choisissez **"Inactif"** si c'est une création anticipée

**✅ Résultat :** Le statut est défini

---

### ÉTAPE 6 : Créer l'utilisateur
**Action :** Valider et enregistrer
1. Vérifiez toutes les informations
2. Cliquez sur **"Créer l'utilisateur"**
3. Attendez la confirmation

**✅ Résultat :** L'utilisateur est créé et apparaît dans la liste

---

## 💻 COMMENT CRÉER UN NOUVEAU LOGICIEL

## 📋 Ce que vous allez faire
Ajouter un nouveau logiciel avec sa configuration de coûts et de facturation.

---

## ⚡ ÉTAPES À SUIVRE

### ÉTAPE 1 : Aller dans la section Logiciels
**Action :** Naviguer vers la gestion des logiciels
1. Dans le menu du haut, cliquez sur **"Logiciel"**
2. Vous voyez la liste de tous les logiciels

**✅ Résultat :** Vous êtes sur la page des logiciels

---

### ÉTAPE 2 : Ouvrir le formulaire de création
**Action :** Lancer la création d'un nouveau logiciel
1. Cliquez sur le bouton **"+ Ajouter un logiciel"** (en haut à droite)
2. Un formulaire s'ouvre

**✅ Résultat :** Le formulaire de création est ouvert

---

### ÉTAPE 3 : Remplir les informations de base
**Action :** Saisir les informations du logiciel
1. **Nom** : Tapez le nom du logiciel (obligatoire)
2. **Catégorie** : Sélectionnez le type (Bureautique, Design, etc.)
3. **Description** : Décrivez l'utilisation (optionnel)
4. **Version** : Indiquez la version actuelle (optionnel)
5. **URL** : Site web du logiciel (optionnel)

**✅ Résultat :** Les informations de base sont saisies

---

### ÉTAPE 4 : Configurer les coûts
**Action :** Définir le prix et la facturation
1. **Coût par utilisateur** : Tapez le prix par personne
2. **Périodicité** : Choisissez la fréquence de paiement
   - Mensuel, Trimestriel, Semestriel, ou Annuel
3. **Prochaine facturation** : Sélectionnez la date du prochain paiement

**✅ Résultat :** La configuration financière est définie

---

### ÉTAPE 5 : Définir le statut
**Action :** Activer ou désactiver le logiciel
1. Choisissez **"Actif"** si le logiciel peut être attribué
2. Choisissez **"Inactif"** pour une création sans utilisation immédiate

**✅ Résultat :** Le statut est défini

---

### ÉTAPE 6 : Créer le logiciel
**Action :** Valider et enregistrer
1. Vérifiez toutes les informations
2. Cliquez sur **"Créer le logiciel"**
3. Attendez la confirmation

**✅ Résultat :** Le logiciel est créé et apparaît dans la liste

---

## 🚨 QUE FAIRE EN CAS DE PROBLÈME ?

### ❌ "Champ obligatoire manquant"
**Si vous ne pouvez pas valider :**
1. Vérifiez que tous les champs avec * sont remplis
2. Pour les utilisateurs : Nom et Prénom sont obligatoires
3. Pour les logiciels : Nom et Catégorie sont obligatoires

### ❌ "Erreur lors de la création"
**Si ça ne marche pas :**
1. Vérifiez votre connexion internet
2. Réessayez dans quelques secondes
3. Contactez votre administrateur

---

## ➡️ ÉTAPE SUIVANTE
Une fois créé, vous pouvez modifier les informations ou gérer les accès spécifiques.
                `
            },
            modification: {
                title: "Comment modifier un utilisateur ou un logiciel",
                content: `
# ✏️ COMMENT MODIFIER UN UTILISATEUR

## 📋 Ce que vous allez faire
Mettre à jour les informations d'un utilisateur existant (nom, équipe, statut, etc.).

---

## ⚡ ÉTAPES À SUIVRE

### ÉTAPE 1 : Trouver l'utilisateur à modifier
**Action :** Localiser l'utilisateur dans la liste
1. Allez dans **"Utilisateur"** (menu du haut)
2. Cherchez l'utilisateur dans la liste
3. Utilisez la barre de recherche si nécessaire

**✅ Résultat :** Vous voyez l'utilisateur à modifier

---

### ÉTAPE 2 : Ouvrir le formulaire de modification
**Action :** Accéder au mode édition
1. Sur la ligne de l'utilisateur, cliquez sur l'icône **crayon** (✏️)
2. Le formulaire s'ouvre avec les informations actuelles

**✅ Résultat :** Le formulaire de modification est ouvert

---

### ÉTAPE 3 : Modifier les informations personnelles
**Action :** Changer les données de base
1. **Nom** : Modifiez le nom de famille si nécessaire
2. **Prénom** : Modifiez le prénom si nécessaire
3. **Email** : Mettez à jour l'adresse email
4. **Téléphone** : Changez le numéro de téléphone

**✅ Résultat :** Les nouvelles informations sont saisies

---

### ÉTAPE 4 : Changer l'équipe (si nécessaire)
**Action :** Modifier l'affectation d'équipe
1. Dans la liste déroulante **"Équipe"**, sélectionnez la nouvelle équipe
2. ⚠️ **ATTENTION** : Changer d'équipe modifie automatiquement les logiciels attribués

**✅ Résultat :** La nouvelle équipe est sélectionnée

---

### ÉTAPE 5 : Modifier le statut
**Action :** Activer ou désactiver l'utilisateur
1. **Actif** : L'utilisateur a accès aux logiciels
2. **Inactif** : L'utilisateur n'a plus accès (mais reste dans la base)

**✅ Résultat :** Le statut est mis à jour

---

### ÉTAPE 6 : Sauvegarder les modifications
**Action :** Enregistrer les changements
1. Vérifiez toutes les informations modifiées
2. Cliquez sur **"Enregistrer les modifications"**
3. Attendez la confirmation

**✅ Résultat :** Les modifications sont sauvegardées

---

## 💻 COMMENT MODIFIER UN LOGICIEL

## 📋 Ce que vous allez faire
Mettre à jour les informations d'un logiciel existant (prix, nom, périodicité, etc.).

---

## ⚡ ÉTAPES À SUIVRE

### ÉTAPE 1 : Trouver le logiciel à modifier
**Action :** Localiser le logiciel dans la liste
1. Allez dans **"Logiciel"** (menu du haut)
2. Cherchez le logiciel dans la liste
3. Utilisez la barre de recherche si nécessaire

**✅ Résultat :** Vous voyez le logiciel à modifier

---

### ÉTAPE 2 : Ouvrir le formulaire de modification
**Action :** Accéder au mode édition
1. Sur la ligne du logiciel, cliquez sur l'icône **crayon** (✏️)
2. Le formulaire s'ouvre avec les informations actuelles

**✅ Résultat :** Le formulaire de modification est ouvert

---

### ÉTAPE 3 : Modifier les informations de base
**Action :** Changer les données générales
1. **Nom** : Modifiez le nom du logiciel
2. **Catégorie** : Changez le type si nécessaire
3. **Description** : Mettez à jour la description
4. **Version** : Indiquez la nouvelle version
5. **URL** : Modifiez le site web

**✅ Résultat :** Les nouvelles informations sont saisies

---

### ÉTAPE 4 : Modifier les coûts
**Action :** Mettre à jour la configuration financière
1. **Coût par utilisateur** : Changez le prix par personne
2. **Périodicité** : Modifiez la fréquence de facturation
3. **Prochaine facturation** : Changez la date du prochain paiement
4. ⚠️ **ATTENTION** : Cela recalcule automatiquement tous les coûts

**✅ Résultat :** La configuration financière est mise à jour

---

### ÉTAPE 5 : Modifier le statut
**Action :** Activer ou désactiver le logiciel
1. **Actif** : Le logiciel peut être attribué aux utilisateurs
2. **Inactif** : Le logiciel ne peut plus être attribué

**✅ Résultat :** Le statut est mis à jour

---

### ÉTAPE 6 : Sauvegarder les modifications
**Action :** Enregistrer les changements
1. Vérifiez toutes les informations modifiées
2. Cliquez sur **"Enregistrer les modifications"**
3. Attendez la confirmation

**✅ Résultat :** Les modifications sont sauvegardées et les coûts recalculés

---

## 🚨 QUE FAIRE EN CAS DE PROBLÈME ?

### ❌ "Impossible de sauvegarder"
**Si vous ne pouvez pas enregistrer :**
1. Vérifiez que tous les champs obligatoires sont remplis
2. Vérifiez votre connexion internet
3. Réessayez dans quelques secondes

### ❌ "Changement d'équipe problématique"
**Si l'utilisateur perd des accès importants :**
1. Vous pouvez annuler la modification
2. Ou ajouter manuellement les accès spécifiques après
3. Contactez l'utilisateur pour l'informer

---

## 💡 CONSEILS PRATIQUES

### Avant de modifier
- Vérifiez l'impact sur les autres utilisateurs
- Prévenez si c'est un changement important
- Sauvegardez mentalement les anciennes valeurs

### Pour les coûts de logiciels
- Vérifiez avec votre comptabilité avant de changer les prix
- Les changements affectent immédiatement tous les calculs
- Consultez l'échéancier après modification

---

## ➡️ ÉTAPE SUIVANTE
Après modification, vous pouvez consulter les logs pour voir l'historique des changements.
                `
            },
            archiving: {
                title: "Comment archiver un utilisateur ou logiciel",
                content: `
# 📦 COMMENT ARCHIVER UN UTILISATEUR (DÉPART)

## 📋 Ce que vous allez faire
Désactiver un utilisateur qui quitte l'entreprise tout en gardant son historique.

---

## ⚡ ÉTAPES À SUIVRE

### ÉTAPE 1 : Trouver l'utilisateur qui part
**Action :** Localiser l'utilisateur dans la liste
1. Allez dans **"Utilisateur"** (menu du haut)
2. Cherchez l'utilisateur qui quitte l'entreprise
3. Utilisez la barre de recherche si nécessaire

**✅ Résultat :** Vous voyez l'utilisateur à archiver

---

### ÉTAPE 2 : Ouvrir le formulaire de modification
**Action :** Accéder aux paramètres de l'utilisateur
1. Sur la ligne de l'utilisateur, cliquez sur l'icône **crayon** (✏️)
2. Le formulaire s'ouvre avec les informations actuelles

**✅ Résultat :** Le formulaire de modification est ouvert

---

### ÉTAPE 3 : Passer le statut à "Inactif"
**Action :** Désactiver l'utilisateur
1. Dans la section **"Statut"**, sélectionnez **"Inactif"**
2. ⚠️ **EFFET** : L'utilisateur perdra immédiatement tous ses accès

**✅ Résultat :** Le statut est changé à "Inactif"

---

### ÉTAPE 4 : Sauvegarder l'archivage
**Action :** Confirmer la désactivation
1. Cliquez sur **"Enregistrer les modifications"**
2. Attendez la confirmation

**✅ Résultat :** L'utilisateur est archivé, tous ses accès sont révoqués

---

## 💾 CE QUI SE PASSE AUTOMATIQUEMENT

### ✅ Conservé (historique)
- Toutes les données de l'utilisateur
- L'historique de ses accès
- Les logs de ses actions passées

### ❌ Supprimé (accès)
- Accès à tous les logiciels
- Comptage dans les coûts actuels
- Possibilité de nouveaux accès

---

## 💻 COMMENT ARCHIVER UN LOGICIEL

## 📋 Ce que vous allez faire
Désactiver un logiciel qui n'est plus utilisé (fin d'abonnement, remplacement, etc.).

---

## ⚡ ÉTAPES À SUIVRE

### ÉTAPE 1 : Identifier les utilisateurs concernés
**Action :** Vérifier qui utilise ce logiciel
1. Allez dans **"Logiciel"** (menu du haut)
2. Cherchez le logiciel à archiver
3. Notez mentalement qui l'utilise (vous le voyez dans la liste)

**✅ Résultat :** Vous savez qui sera impacté

---

### ÉTAPE 2 : Ouvrir le formulaire de modification
**Action :** Accéder aux paramètres du logiciel
1. Sur la ligne du logiciel, cliquez sur l'icône **crayon** (✏️)
2. Le formulaire s'ouvre avec les informations actuelles

**✅ Résultat :** Le formulaire de modification est ouvert

---

### ÉTAPE 3 : Passer le statut à "Inactif"
**Action :** Désactiver le logiciel
1. Dans la section **"Statut"**, sélectionnez **"Inactif"**
2. ⚠️ **EFFET** : Plus personne ne pourra avoir accès à ce logiciel

**✅ Résultat :** Le statut est changé à "Inactif"

---

### ÉTAPE 4 : Sauvegarder l'archivage
**Action :** Confirmer la désactivation
1. Cliquez sur **"Enregistrer les modifications"**
2. Attendez la confirmation

**✅ Résultat :** Le logiciel est archivé, tous les accès sont révoqués

---

## 💾 CE QUI SE PASSE AUTOMATIQUEMENT

### ✅ Conservé (historique)
- Toutes les données du logiciel
- L'historique de qui l'utilisait
- Les données de coûts passées

### ❌ Supprimé (utilisation)
- Accès de tous les utilisateurs
- Comptage dans les coûts actuels
- Possibilité de nouvelles attributions

---

## 🔄 COMMENT RÉACTIVER UN ÉLÉMENT ARCHIVÉ

### Pour un utilisateur (retour d'un ancien employé)
1. Trouvez l'utilisateur dans la liste
2. Modifiez son statut : **"Inactif"** → **"Actif"**
3. Vérifiez son équipe et ses accès
4. Sauvegardez

### Pour un logiciel (renouvellement d'abonnement)
1. Trouvez le logiciel dans la liste
2. Modifiez son statut : **"Inactif"** → **"Actif"**
3. Vérifiez les coûts et dates de facturation
4. Réattribuez aux utilisateurs si nécessaire
5. Sauvegardez

---

## 🚨 POINTS IMPORTANTS

### ⚠️ Archivage = Pas de suppression
- Les données restent dans l'application
- Seuls les accès sont coupés
- Possibilité de réactiver à tout moment

### 💰 Impact sur les coûts
- Les coûts sont immédiatement recalculés
- Les économies apparaissent dans les rapports
- L'historique financier est conservé

### 👥 Communication
- Prévenez les utilisateurs avant d'archiver un logiciel
- Vérifiez qu'il n'y a pas de projets en cours
- Documentez la raison de l'archivage

---

## ➡️ ÉTAPE SUIVANTE
Après archivage, consultez les rapports pour voir l'impact sur les coûts globaux.
                `
            },
            access: {
                title: "Comment gérer les accès aux logiciels",
                content: `
# 🔐 COMMENT GÉRER LES ACCÈS AUX LOGICIELS

## 📋 Ce que vous allez apprendre
3 méthodes pour donner ou retirer l'accès aux logiciels selon vos besoins.

## 🎯 3 MÉTHODES POUR GÉRER LES ACCÈS

---

## 📋 MÉTHODE 1 : PAR ÉQUIPE (RECOMMANDÉE)

### 💡 Quand l'utiliser
- Nouvelle équipe avec des besoins standards
- Logiciels que toute une équipe doit avoir
- Gestion centralisée et automatique

### ⚡ ÉTAPES À SUIVRE

#### ÉTAPE 1 : Configurer les logiciels d'équipe
1. Allez dans **"Réglages"** → **"Équipe"**
2. Trouvez l'équipe à configurer
3. Cliquez sur l'icône **crayon** (✏️)

#### ÉTAPE 2 : Définir les logiciels par défaut
1. Dans la section **"Logiciels par défaut"**
2. **Cochez** les logiciels que tous les membres doivent avoir
3. Cliquez sur **"Enregistrer"**

**✅ Résultat :** Tous les nouveaux membres de cette équipe auront automatiquement ces logiciels

---

## 👤 MÉTHODE 2 : PAR UTILISATEUR

### 💡 Quand l'utiliser
- Accès spécifique pour une personne
- Logiciel temporaire pour un projet
- Exception aux règles d'équipe

### ⚡ ÉTAPES À SUIVRE

#### ÉTAPE 1 : Aller sur l'utilisateur
1. Allez dans **"Utilisateur"**
2. Trouvez la personne concernée
3. Cliquez sur l'icône **crayon** (✏️)

#### ÉTAPE 2 : Gérer ses accès
1. Cherchez la section **"Logiciels attribués"**
2. Cliquez sur le bouton **"+"** ou **"Gérer les accès"**
3. Une fenêtre s'ouvre avec la liste des logiciels

#### ÉTAPE 3 : Donner ou retirer l'accès
1. **Cochez** les logiciels à donner
2. **Décochez** les logiciels à retirer
3. Cliquez sur **"Sauvegarder"**

**✅ Résultat :** L'utilisateur a immédiatement accès (ou non) aux logiciels sélectionnés

---

## 💻 MÉTHODE 3 : PAR LOGICIEL

### 💡 Quand l'utiliser
- Nouveau logiciel à déployer massivement
- Vérifier qui a accès à un outil spécifique
- Réduire les licences d'un logiciel coûteux

### ⚡ ÉTAPES À SUIVRE

#### ÉTAPE 1 : Aller sur le logiciel
1. Allez dans **"Logiciel"**
2. Trouvez le logiciel concerné
3. Cliquez sur l'icône **crayon** (✏️)

#### ÉTAPE 2 : Gérer les utilisateurs
1. Cherchez la section **"Utilisateurs ayant accès"**
2. Cliquez sur **"Gérer les accès"**
3. Une fenêtre s'ouvre avec la liste des utilisateurs

#### ÉTAPE 3 : Sélectionner les utilisateurs
1. **Cochez** les utilisateurs qui doivent avoir l'accès
2. **Décochez** ceux qui ne doivent plus l'avoir
3. Utilisez le filtre par équipe si nécessaire
4. Cliquez sur **"Sauvegarder"**

**✅ Résultat :** Les utilisateurs sélectionnés ont accès au logiciel

---

## 🔍 VÉRIFIER LES ACCÈS

### Voir les accès d'un utilisateur
1. **"Utilisateur"** → Trouvez la personne → **"Modifier"**
2. Regardez la section **"Logiciels attribués"**

### Voir qui utilise un logiciel
1. **"Logiciel"** → Trouvez le logiciel → **"Modifier"**
2. Regardez la section **"Utilisateurs ayant accès"**

### Voir les logiciels d'une équipe
1. **"Réglages"** → **"Équipe"** → Trouvez l'équipe → **"Modifier"**
2. Regardez la section **"Logiciels par défaut"**

---

## 🚨 RÈGLES IMPORTANTES

### ⚠️ Priorité des accès
1. **Accès individuel** = plus fort que les règles d'équipe
2. **Équipe** = appliqué automatiquement aux nouveaux membres
3. **Si conflit** = l'accès individuel gagne toujours

### ⚠️ Changement d'équipe
- Si vous changez quelqu'un d'équipe, ses accès changent automatiquement
- Vérifiez après le changement si tout est correct
- Ajoutez des accès individuels si nécessaire

---

## 💡 CONSEILS PRATIQUES

### 🎯 Pour être efficace
- **Utilisez les équipes** pour les accès standards
- **Utilisez l'individuel** pour les exceptions
- **Utilisez le logiciel** pour les déploiements massifs

### 💰 Pour économiser
- Vérifiez régulièrement qui utilise vraiment chaque logiciel
- Retirez les accès des personnes qui n'en ont plus besoin
- Utilisez les rapports pour voir les coûts par personne

### 🔒 Pour la sécurité
- Ne donnez que les accès nécessaires
- Retirez immédiatement les accès en cas de départ
- Vérifiez les accès lors des changements d'équipe

---

## ➡️ ÉTAPE SUIVANTE
Une fois les accès configurés, consultez les rapports pour suivre les coûts et l'utilisation.
                `
            },
            all: {
                title: "Vue d'ensemble de tous les processus",
                content: `
# 🚀 TOUS LES PROCESSUS DE L'APPLICATION

## 📋 Ce que vous pouvez faire avec cette application

Cette application vous permet de gérer tous les accès logiciels de votre entreprise de A à Z.

---

## 🔍 LES 5 PROCESSUS PRINCIPAUX

### 1. 🔐 [SE CONNECTER](javascript:void(0))
**En 3 étapes :** Ouvrir l'app → Saisir le mot de passe → Cliquer "Se connecter"
- ✅ Accès sécurisé à l'application
- 🔒 Protection par mot de passe
- 🚨 Messages d'erreur clairs

---

### 2. 👤 [CRÉER](javascript:void(0))
**Utilisateurs en 6 étapes :** Aller dans "Utilisateur" → Cliquer "+" → Remplir le formulaire → Choisir l'équipe → Définir le statut → Sauvegarder

**Logiciels en 6 étapes :** Aller dans "Logiciel" → Cliquer "+" → Remplir les infos → Configurer les coûts → Définir le statut → Sauvegarder

- ✅ Nouveaux collaborateurs avec accès automatiques
- 💻 Nouveaux logiciels avec coûts et facturation
- 🤖 Attribution automatique selon les équipes

---

### 3. ✏️ [MODIFIER](javascript:void(0))
**En 6 étapes :** Trouver l'élément → Cliquer sur le crayon → Modifier les infos → Sauvegarder → Vérifier les impacts

- 📝 Mise à jour des informations personnelles
- 🔄 Changement d'équipe (attention aux accès)
- 💰 Modification des coûts (recalcul automatique)
- 🔘 Activation/désactivation

---

### 4. 📦 [ARCHIVER](javascript:void(0))
**En 4 étapes :** Trouver l'élément → Cliquer sur le crayon → Passer le statut à "Inactif" → Sauvegarder

- 👋 Départs d'entreprise (garde l'historique)
- 🚫 Logiciels plus utilisés (économies immédiates)
- 💾 Conservation de toutes les données
- 🔄 Possibilité de réactiver

---

### 5. 🔐 [GÉRER LES ACCÈS](javascript:void(0))
**3 méthodes disponibles :**

**Par équipe :** Configurer les logiciels par défaut d'une équipe
**Par utilisateur :** Donner des accès spécifiques à une personne
**Par logiciel :** Choisir qui peut utiliser un logiciel

- 🎯 Attribution automatique ou manuelle
- ⚡ Effets immédiats
- 💰 Impact direct sur les coûts

---

## 🗺️ PARCOURS TYPIQUE D'UTILISATION

### 🆕 Pour un nouveau collaborateur
1. **Créer l'utilisateur** (processus Création)
2. **Choisir son équipe** → Accès automatiques
3. **Ajouter des accès spécifiques** si besoin (processus Accès)

### 💻 Pour un nouveau logiciel
1. **Créer le logiciel** avec ses coûts (processus Création)
2. **L'attribuer aux équipes** qui en ont besoin (processus Accès)
3. **Ou l'attribuer individuellement** selon les besoins

### 👋 Pour un départ
1. **Archiver l'utilisateur** (processus Archivage)
2. **Vérifier les économies** dans les rapports
3. **Réaffecter ses responsabilités** si nécessaire

### 🔄 Pour un changement d'équipe
1. **Modifier l'utilisateur** (processus Modification)
2. **Changer son équipe** → Accès automatiquement mis à jour
3. **Ajouter des accès spécifiques** si besoin

---

## 💡 CONSEILS POUR BIEN COMMENCER

### 🎯 Stratégie recommandée
1. **Commencez par créer vos équipes** (Réglages → Équipe)
2. **Définissez les logiciels par équipe** (attribution automatique)
3. **Créez vos utilisateurs** et assignez-les aux équipes
4. **Ajustez individuellement** si nécessaire

### ⚡ Pour être efficace
- **Utilisez les équipes** pour les accès standards
- **Utilisez l'individuel** seulement pour les exceptions
- **Vérifiez régulièrement** les coûts et accès inutilisés

### 🔒 Pour la sécurité
- **Principe du minimum** : ne donnez que les accès nécessaires
- **Archivez immédiatement** en cas de départ
- **Vérifiez les accès** lors des changements d'équipe

---

## 📊 FONCTIONNALITÉS BONUS

### 📈 Rapports automatiques
- Coûts par utilisateur/équipe/logiciel
- Évolution des dépenses dans le temps
- Top des logiciels les plus coûteux

### 📅 Échéancier
- Dates de renouvellement automatiques
- Prévisions budgétaires
- Alertes avant échéances

### 📋 Logs détaillés
- Historique de toutes les modifications
- Format "Avant → Maintenant"
- Traçabilité complète pour audit

### 📱 Interface mobile
- Toutes les fonctions disponibles sur mobile
- Interface adaptative
- Menus optimisés pour tactile

---

## 🎯 NAVIGATION RAPIDE

**Utilisez les boutons en haut de cette page pour accéder directement à chaque processus détaillé.**

Chaque processus contient :
- ✅ Des étapes numérotées précises
- 🖼️ Des descriptions de ce que vous devez voir
- 🚨 Les erreurs courantes et comment les résoudre
- 💡 Des conseils pratiques

---

## 🆘 BESOIN D'AIDE ?

### 🐞 En cas de problème
1. **Vérifiez votre connexion internet**
2. **Actualisez la page** (F5)
3. **Consultez les logs** pour voir ce qui s'est passé
4. **Contactez votre administrateur** si ça persiste

### 📞 Support
- Documentation intégrée dans chaque section
- Aide contextuelle dans l'interface
- Messages d'erreur explicites

---

**🎉 Prêt à commencer ? Choisissez le processus qui vous intéresse dans la navigation ci-dessus !**
                `
            }
        };
    }

    showProcess(type) {
        this.currentProcess = type;
        const contentDiv = document.getElementById('process-content');
        
        if (!contentDiv) {
            // Si l'élément n'existe pas encore, essayer de nouveau dans un moment
            const maxRetries = 50; // 5 seconds max
            if (!this.retryCount) this.retryCount = 0;
            
            if (this.retryCount < maxRetries) {
                this.retryCount++;
                setTimeout(() => this.showProcess(type), 100);
                return;
            } else {
                console.error('Process content div not found after retries');
                return;
            }
        }
        
        // Reset retry counter on success
        this.retryCount = 0;

        const process = this.processContent[type];
        if (!process) {
            console.error('Process content not found for type:', type);
            return;
        }

        // Convertir le Markdown en HTML basique
        const htmlContent = this.markdownToHtml(process.content);
        
        contentDiv.innerHTML = `
            <div class="p-6 sm:p-8 max-w-none">
                <div class="prose prose-lg max-w-none">
                    ${htmlContent}
                </div>
            </div>
        `;
        
        console.log('✅ Contenu affiché pour le processus:', type);
        console.log('📊 Longueur du contenu HTML:', htmlContent.length);

        // Scroll to top
        contentDiv.scrollIntoView({ behavior: 'smooth' });
    }

    showAllProcesses() {
        this.showProcess('all');
    }

    markdownToHtml(markdown) {
        let html = markdown
            // Headers
            .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">$1</h1>')
            .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold text-gray-800 mb-4 mt-8">$1</h2>')
            .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-gray-700 mb-3 mt-6">$1</h3>')
            .replace(/^#### (.*$)/gim, '<h4 class="text-lg font-medium text-gray-700 mb-2 mt-4">$1</h4>')
            
            // Bold text
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
            
            // Italic text
            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
            
            // Code blocks
            .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 border border-gray-200 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-sm">$1</code></pre>')
            
            // Inline code
            .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
            
            // Links (keep as text for now since they're javascript:void(0))
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '<span class="text-blue-600 font-medium">$1</span>')
            
            // Lists
            .replace(/^\s*\* (.*$)/gim, '<li class="ml-6 mb-2">• $1</li>')
            .replace(/^\s*- (.*$)/gim, '<li class="ml-6 mb-2">• $1</li>')
            .replace(/^\s*\d+\. (.*$)/gim, '<li class="ml-6 mb-2 list-decimal">$1</li>')
            
            // Paragraphs
            .split('\n\n')
            .map(paragraph => {
                paragraph = paragraph.trim();
                if (paragraph === '') return '';
                if (paragraph.startsWith('<h') || 
                    paragraph.startsWith('<li') || 
                    paragraph.startsWith('<pre') ||
                    paragraph.startsWith('<ul') ||
                    paragraph.startsWith('<ol') ||
                    paragraph.includes('---')) {
                    return paragraph;
                }
                return `<p class="mb-4 text-gray-700 leading-relaxed">${paragraph}</p>`;
            })
            .join('\n')
            
            // Separators
            .replace(/^---$/gm, '<hr class="my-8 border-gray-300">')
            
            // Warning/Alert boxes (⚠️)
            .replace(/⚠️\s*\*\*(.*?)\*\*:?(.*?)(?=\n\n|\n$|$)/gs, 
                '<div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">' +
                '<div class="flex">' +
                '<div class="flex-shrink-0"><i class="fas fa-exclamation-triangle text-yellow-400"></i></div>' +
                '<div class="ml-3">' +
                '<p class="text-sm font-medium text-yellow-800">$1</p>' +
                '<p class="text-sm text-yellow-700 mt-1">$2</p>' +
                '</div></div></div>');

        return html;
    }

    exportCurrentProcessToMarkdown() {
        const currentProcess = this.currentProcess || 'all';
        const process = this.processContent[currentProcess];
        
        if (!process) {
            alert('Aucun processus sélectionné à exporter');
            return;
        }

        // Préparer le contenu Markdown
        const markdownContent = this.prepareMarkdownForExport(process, currentProcess);
        
        // Créer et télécharger le fichier
        this.downloadMarkdownFile(markdownContent, currentProcess);
        
        // Feedback utilisateur
        this.showExportSuccess(process.title);
    }

    prepareMarkdownForExport(process, processType) {
        const date = new Date().toLocaleDateString('fr-FR');
        const appName = "Application de Gestion des Accès";
        
        let markdown = `---
title: ${process.title}
date: ${date}
source: ${appName}
category: Processus
tags: [guide, étape-par-étape, processus]
---

# ${process.title}

> **Source :** ${appName}  
> **Date d'export :** ${date}  
> **Type :** Guide pratique étape par étape

---

${process.content}

---

## 📌 Informations d'export

- **Fichier source :** Section Process de l'application
- **Format :** Markdown compatible Notion
- **Date d'export :** ${date}
- **Processus :** ${processType}

> 💡 **Tip Notion :** Ce fichier peut être importé directement dans Notion via "Import" → "Markdown"
`;

        return markdown;
    }

    downloadMarkdownFile(content, processType) {
        // Créer un blob avec le contenu Markdown
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
        
        // Créer un lien de téléchargement
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        
        // Nom du fichier avec date
        const date = new Date().toISOString().split('T')[0];
        const processName = this.getProcessDisplayName(processType);
        link.download = `Process-${processName}-${date}.md`;
        
        // Déclencher le téléchargement
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Nettoyer l'URL
        URL.revokeObjectURL(link.href);
    }

    getProcessDisplayName(processType) {
        const names = {
            'all': 'Tous-les-processus',
            'connection': 'Connexion',
            'creation': 'Creation',
            'modification': 'Modification',
            'archiving': 'Archivage',
            'access': 'Gestion-des-acces'
        };
        return names[processType] || processType;
    }

    showExportSuccess(processTitle) {
        // Créer une notification de succès
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-check-circle mr-2"></i>
                <div>
                    <div class="font-semibold">Export réussi !</div>
                    <div class="text-sm opacity-90">${processTitle}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Supprimer la notification après 3 secondes
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Toujours initialiser le gestionnaire de processus
    window.processManager = new ProcessManager();
    console.log('⚙️ Gestionnaire de processus initialisé');
});