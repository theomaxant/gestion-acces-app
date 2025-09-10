# 🔗 Configuration API Directe - Solution Rapide

## Si les Functions ne marchent toujours pas après correction

### Étape 1: Récupérer vos Clés Airtable

Dans Cloudflare Pages, vous avez les variables mais elles sont chiffrées. Il faut les mêmes valeurs pour l'API directe.

**Récupérez :**
- Votre `Base ID` depuis Airtable (commence par `app...`)
- Votre `API Key` depuis Airtable (commence par `key...`)

### Étape 2: Configurer l'API Directe

Éditez le fichier `js/airtable-direct.js` :

```javascript
const AIRTABLE_CONFIG = {
    baseId: 'appXXXXXXXXXXXXXX',    // Remplacez par votre Base ID
    apiKey: 'keyXXXXXXXXXXXXXX',    // Remplacez par votre API Key  
    baseUrl: 'https://api.airtable.com/v0'
};
```

### Étape 3: Ajouter le Script

Dans `index.html`, après la ligne `<script src="js/secure-api.js"></script>` :

```html
<!-- API DIRECTE TEMPORAIRE -->
<script src="js/airtable-direct.js"></script>
```

### Étape 4: Redéployer et Tester

1. **Redéployez** le projet
2. **Ouvrez votre application**
3. **Devrait fonctionner immédiatement**

## ⚠️ Important

- Cette solution expose vos clés côté client
- À utiliser **temporairement** le temps de réparer Cloudflare Functions
- **Supprimez** cette solution une fois les Functions réparées

## 🎯 Résultat Attendu

- ✅ Application se charge sans erreurs
- ✅ Données s'affichent dans les tableaux  
- ✅ Plus de bannière "Configuration requise"
- ✅ Ajout d'utilisateurs fonctionne

Une fois que ça marche avec l'API directe, on peut se concentrer sur la réparation des Cloudflare Functions sans pression.