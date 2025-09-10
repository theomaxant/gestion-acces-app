# Guide d'Authentification

## 🔐 Protection par Mot de Passe

L'application est maintenant protégée par un système d'authentification symbolique qui s'affiche avant l'accès à l'interface principale.

## 📋 Informations de Connexion

- **Mot de passe par défaut :** `Celesty2025!`
- **Durée de session :** 24 heures
- **Interface :** Écran de connexion avec design moderne

## 🎯 Fonctionnalités

### Écran de Connexion
- Interface sécurisée avec design moderne
- Messages d'erreur en cas de mot de passe incorrect
- Animation de chargement pendant la vérification
- Focus automatique sur le champ mot de passe

### Session Utilisateur
- Session sauvegardée dans le navigateur (localStorage)
- Expiration automatique après 24 heures
- Vérification de session au chargement de la page

### Déconnexion
- Bouton de déconnexion dans l'interface principale
- Confirmation avant déconnexion
- Nettoyage automatique de la session

## 🛠️ Commandes Console

Une fois connecté, ouvrez la console du navigateur (F12) pour utiliser ces commandes :

```javascript
// Changer le mot de passe
auth.changePassword('nouveau_mot_de_passe');

// Informations sur la session en cours
auth.getSessionInfo();

// Se déconnecter manuellement
auth.logout();

// Vérifier l'état de connexion
auth.isLoggedIn();
```

## ⚙️ Configuration Avancée

### Changer le Mot de Passe
Pour modifier le mot de passe par défaut :

1. **Méthode Console** (temporaire) :
   ```javascript
   auth.changePassword('nouveau_mdp');
   ```

2. **Méthode Fichier** (permanent) :
   - Ouvrir le fichier `js/auth.js`
   - Modifier la ligne 11 : `this.PASSWORD = 'nouveau_mot_de_passe';`

### Modifier la Durée de Session
Dans `js/auth.js`, ligne ~115, modifier :
```javascript
const sessionDuration = 24 * 60 * 60 * 1000; // 24 heures en millisecondes
```

### Personnaliser l'Interface
- **Écran de connexion :** Modifier les éléments dans `index.html` (div `#login-screen`)
- **Messages :** Ajuster les textes dans `js/auth.js`
- **Styles :** Utiliser les classes Tailwind CSS existantes

## ⚠️ Avertissements de Sécurité

### Ce Système N'EST PAS Sécurisé !

Cette protection est **symbolique uniquement** et présente des vulnérabilités :

1. **Mot de passe visible** : Le mot de passe est stocké en clair dans `js/auth.js`
2. **Pas de chiffrement** : Aucun chiffrement côté serveur
3. **Contournable** : Peut être désactivé via la console ou en modifiant le code
4. **Stockage local** : Session stockée dans localStorage (modifiable)

### Usage Recommandé
- ✅ Protection contre les accès non intentionnels
- ✅ Démonstration ou environnement de développement
- ❌ **JAMAIS pour des données sensibles**
- ❌ **JAMAIS en production avec des données critiques**

### Alternatives Sécurisées
Pour une vraie sécurité, considérez :
- **Auth0** : Service d'authentification professionnel
- **Firebase Auth** : Authentification Google/Firebase
- **Netlify Identity** : Authentification intégrée à Netlify
- **Backend personnalisé** : Serveur avec authentification sécurisée

## 🔧 Dépannage

### Problèmes Courants

1. **L'écran de connexion ne s'affiche pas**
   - Vérifier que `js/auth.js` est bien chargé
   - Ouvrir la console pour voir les erreurs

2. **Mot de passe refusé**
   - Vérifier la casse (sensible à la casse)
   - Par défaut : `Celesty2025!`
   - Vérifier les espaces avant/après

3. **Déconnexion automatique**
   - Session expirée (24h)
   - localStorage effacé
   - Erreur JavaScript

4. **Bouton de déconnexion invisible**
   - Vérifier que l'élément `#logout-btn` existe
   - Problème de CSS/affichage

### Messages de Débogage
Les messages suivants apparaissent dans la console :
- `🔄 Script auth.js chargé` : Script correctement chargé
- `🔐 Système d'authentification initialisé` : Système prêt
- `✅ Connexion réussie !` : Authentification validée
- `👋 Déconnexion réussie !` : Déconnexion effectuée

## 📞 Support

En cas de problème :
1. Ouvrir la console navigateur (F12)
2. Chercher les messages d'erreur
3. Vérifier que tous les fichiers sont présents
4. Tester avec `auth.getSessionInfo()` dans la console