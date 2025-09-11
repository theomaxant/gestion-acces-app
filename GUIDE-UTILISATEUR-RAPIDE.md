# 🚀 Guide Rapide : Sélecteur d'Utilisateur

## 📍 Où se trouve le sélecteur ?

Le sélecteur d'utilisateur se trouve dans **la barre de navigation en haut** de l'application, à côté des menus principaux.

Il ressemble à ceci : 
```
👤 Utilisateur
   [Liste déroulante ▼]
```

## 🎯 À quoi ça sert ?

Cette fonctionnalité permet de **choisir qui effectue les actions** dans l'application. 

**Exemple concret :**
- Si Marie crée un nouvel accès logiciel, le log indiquera "Créé par Marie"
- Si Pierre modifie un utilisateur, le log indiquera "Modifié par Pierre"

## 🔧 Comment l'utiliser ?

### 1. Sélectionner un utilisateur
1. Cliquer sur la liste déroulante dans le header
2. Choisir l'utilisateur qui effectue l'action
3. La sélection est automatiquement sauvegardée

### 2. Vérifier qui est sélectionné
- Le nom affiché dans le sélecteur indique l'utilisateur actuel
- Passer la souris sur le sélecteur pour voir le poste et l'équipe

### 3. Tester la fonctionnalité
Un panneau de test jaune apparaît en haut de la page avec :
- ✅ **Bouton "Tester Création"** - Simule la création d'un élément
- ✏️ **Bouton "Tester Modification"** - Simule la modification d'un élément
- 🗑️ **Bouton "Tester Suppression"** - Simule la suppression d'un élément

## 📋 Cas d'usage pratiques

### Scénario 1 : Nouvelle embauche
```
1. Sélectionner "Marie Dupont" dans le header
2. Aller dans Utilisateurs > Ajouter
3. Créer le profil de la nouvelle personne
4. Le log indiquera "Utilisateur créé par Marie Dupont"
```

### Scénario 2 : Modification d'accès
```
1. Sélectionner "Pierre Martin" dans le header
2. Modifier un accès logiciel existant
3. Le log indiquera "Accès modifié par Pierre Martin"
```

### Scénario 3 : Nettoyage de données
```
1. Sélectionner "Admin Système" dans le header
2. Supprimer des données obsolètes
3. Chaque suppression sera tracée comme "Supprimé par Admin Système"
```

## 🔍 Où voir les logs ?

Les logs avec l'utilisateur sélectionné sont visibles dans :
1. **Console du navigateur** (F12 > Console)
2. **Onglet Logs** de l'application (si disponible)
3. **Base de données** dans la table `logs`

## ⚡ Conseils pratiques

### ✅ Bonnes pratiques
- **Changer d'utilisateur** avant chaque session de travail
- **Utiliser des noms complets** pour faciliter la traçabilité
- **Tester avec le panneau de démo** avant une utilisation intensive

### ⚠️ Points d'attention
- La sélection **persiste** pendant toute la session du navigateur
- Si aucun utilisateur n'est sélectionné, "Utilisateur Direct" est utilisé par défaut
- Les utilisateurs sont chargés depuis la base de données (table `utilisateurs`)

## 🆘 Dépannage

### Problème : La liste d'utilisateurs est vide
**Solution :** Vérifier que la table `utilisateurs` contient des données dans la base de données

### Problème : Le sélecteur n'apparaît pas
**Solutions :**
1. Actualiser la page (F5)
2. Vérifier la console pour les erreurs (F12)
3. Attendre quelques secondes (chargement en cours)

### Problème : Les logs ne montrent pas l'utilisateur
**Solutions :**
1. Vérifier qu'un utilisateur est bien sélectionné
2. Tester avec les boutons de démonstration
3. Regarder la console du navigateur pour les messages

## 🎛️ Commandes console avancées

Pour les utilisateurs techniques, ces commandes sont disponibles dans la console :

```javascript
// Changer rapidement d'utilisateur
setUser("Marie Dupont");

// Voir l'utilisateur actuel
getUser();

// Tester un log manuel
logCreation("test_table", "123", {nom: "Test"}, "Test manuel");

// Recharger la liste des utilisateurs
userSelector.refreshUsers();
```

---

*Cette fonctionnalité améliore significativement la traçabilité des actions dans l'application, permettant un suivi précis des modifications pour l'audit et la conformité.*