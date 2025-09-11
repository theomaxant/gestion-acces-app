# 👤 Guide du Sélecteur d'Utilisateur pour les Logs

## 🎯 Objectif

Cette fonctionnalité permet de **choisir un utilisateur** et d'**utiliser cette sélection dans les logs** pour tracer qui a créé ou modifié des éléments dans l'application.

## 🚀 Fonctionnalités Principales

### 1. Sélecteur d'Utilisateur dans l'Interface
- **Emplacement** : Dans la barre de navigation du header (desktop)
- **Apparence** : Sélecteur déroulant avec icône utilisateur
- **Données** : Charge automatiquement les utilisateurs depuis la base de données
- **Persistance** : Sauvegarde la sélection dans localStorage

### 2. Intégration avec le Système de Logs
- **Traçage automatique** : Tous les logs incluent maintenant l'utilisateur sélectionné
- **Informations détaillées** : Nom, prénom, poste, équipe de l'utilisateur
- **Méthodes simplifiées** : Nouvelles fonctions pour loguer facilement

### 3. Interface de Test/Démonstration
- **Panneau de test** : Interface pour tester les différents types de logs
- **Monitoring en temps réel** : Affichage des logs dans l'interface
- **Contrôles pratiques** : Boutons pour tester création, modification, suppression

## 🛠️ Composants Techniques

### Fichiers Ajoutés/Modifiés

1. **`js/user-selector.js`** (NOUVEAU)
   - Classe `UserSelector` pour gérer la sélection d'utilisateur
   - Interface utilisateur intégrée au header
   - Gestion des événements et persistance

2. **`js/user-selector-demo.js`** (NOUVEAU)
   - Interface de démonstration et test
   - Boutons de test pour différents types de logs
   - Monitoring des actions utilisateur

3. **`js/logger.js`** (MODIFIÉ)
   - Méthode `getUserInfo()` mise à jour pour utiliser le sélecteur
   - Nouvelles méthodes utilitaires : `logCreation()`, `logUpdate()`, `logDeletion()`
   - Support de l'action `USER_CHANGE` pour tracer les changements d'utilisateur

4. **`js/auth.js`** (MODIFIÉ)
   - Méthode `getCurrentUser()` mise à jour pour compatibilité
   - Intégration avec le sélecteur d'utilisateur

5. **`index.html`** (MODIFIÉ)
   - Chargement des nouveaux scripts
   - Ordre de chargement optimisé

## 📋 Utilisation

### Sélection d'un Utilisateur

1. **Via l'Interface** :
   - Utiliser le sélecteur dans le header de l'application
   - Choisir un utilisateur dans la liste déroulante
   - La sélection est automatiquement sauvegardée

2. **Via la Console** :
   ```javascript
   // Changer rapidement d'utilisateur
   setUser("Nom Prénom");
   
   // Obtenir l'utilisateur actuel
   getUser();
   
   // Changer avec logging du changement
   logger.changeUser("Nouveau Utilisateur", "Raison du changement");
   ```

### Logging avec Utilisateur

1. **Méthodes Simplifiées** :
   ```javascript
   // Log de création
   logCreation("table_name", "record_id", newData, "Détails optionnels");
   
   // Log de modification
   logUpdate("table_name", "record_id", oldData, newData, "Détails optionnels");
   
   // Log de suppression
   logDeletion("table_name", "record_id", oldData, "Détails optionnels");
   
   // Log d'action personnalisée
   logAction("CUSTOM_ACTION", "table_name", "record_id", oldData, newData, "Détails");
   ```

2. **Méthodes Directes du Logger** :
   ```javascript
   // Via l'objet logger
   window.logger.logCreation("users", "123", userData);
   window.logger.logUpdate("software", "456", oldSoftware, newSoftware);
   window.logger.logDeletion("access", "789", accessData);
   ```

### Interface de Test

1. **Accès** : Panneau de test affiché automatiquement en haut de la page
2. **Fonctionnalités** :
   - Boutons pour tester création, modification, suppression
   - Affichage de l'utilisateur actuel avec détails
   - Console de logs intégrée
   - Bouton pour masquer/afficher le panneau

## 🔧 Configuration

### Utilisateurs par Défaut
Si la base de données n'est pas disponible, le système utilise des utilisateurs par défaut :
- **Admin Système** (Administrateur, IT)
- **Manager Équipe** (Manager, Direction)
- **User Standard** (Utilisateur, Générale)
- **Utilisateur Direct** (Standard, Défaut)

### Persistance
- **localStorage** : `current_user` contient le nom de l'utilisateur sélectionné
- **Session** : La sélection persiste pendant la session du navigateur
- **Compatibilité** : Fonctionne avec le système d'authentification existant

## 📊 Informations dans les Logs

### Données Utilisateur Enregistrées
```json
{
  "identifiedUser": "Nom Complet",
  "userDetails": {
    "nom": "Nom de famille",
    "prenom": "Prénom",
    "poste": "Poste/Fonction",
    "equipe": "Équipe/Service",
    "userId": "ID unique"
  },
  "source": "user-selector",
  "timestamp": "Date et heure",
  "sessionActive": false,
  "loginTime": "Heure de connexion"
}
```

### Types d'Actions Supportées
- **CREATE** ➕ : Création d'enregistrement
- **UPDATE** ✏️ : Modification d'enregistrement
- **DELETE** 🗑️ : Suppression d'enregistrement
- **ARCHIVE** 📦 : Archivage d'enregistrement
- **USER_CHANGE** 👤 : Changement d'utilisateur
- **LOGIN/LOGOUT** 🔑 : Connexion/Déconnexion
- **EXPORT/IMPORT** 📤📥 : Import/Export de données

## 🔍 Debugging et Surveillance

### Console Logs
```javascript
// Vérifier l'utilisateur actuel
console.log("Utilisateur:", getUser());

// Vérifier les données détaillées
console.log("Données utilisateur:", userSelector.getCurrentUserData());

// Tester un log
logAction("TEST", "debug_table", "test_id", null, {test: true}, "Test depuis console");
```

### Événements Disponibles
```javascript
// Écouter les changements d'utilisateur
window.addEventListener('userChanged', (event) => {
    console.log('Nouvel utilisateur:', event.detail.user);
    console.log('Données:', event.detail.userData);
});
```

## ⚡ Fonctions Globales Disponibles

### Sélection d'Utilisateur
- `setUser(userName)` - Définir l'utilisateur actuel
- `getUser()` - Obtenir l'utilisateur actuel
- `userSelector.refreshUsers()` - Recharger la liste des utilisateurs
- `userSelector.addTemporaryUser(name, details)` - Ajouter un utilisateur temporaire

### Logging Simplifié
- `logCreation(table, id, data, details)` - Log de création
- `logUpdate(table, id, oldData, newData, details)` - Log de modification
- `logDeletion(table, id, data, details)` - Log de suppression
- `logAction(action, table, id, oldData, newData, details)` - Log d'action personnalisée

## 🚨 Points d'Attention

1. **Chargement** : Le sélecteur se charge après l'initialisation de la page
2. **Fallback** : Si la base de données n'est pas disponible, utilise des données par défaut
3. **Compatibilité** : Fonctionne avec le système d'authentification désactivé
4. **Performance** : Les logs sont sauvegardés de manière asynchrone

## 📈 Utilisation en Production

1. **Masquer le panneau de test** : Commenter la ligne dans `index.html`
2. **Configuration des utilisateurs** : S'assurer que la table `utilisateurs` est correctement peuplée
3. **Monitoring** : Surveiller les logs dans la table `logs` pour vérifier le bon fonctionnement
4. **Performance** : Le système gère automatiquement les erreurs de base de données

---

*Cette fonctionnalité permet un suivi précis des actions utilisateur même avec l'authentification désactivée, facilitant l'audit et la traçabilité dans l'application.*