# 🔧 Guide de Dépannage

## Problèmes courants et solutions

### ❌ Erreur "Failed to execute 'json' on 'Response'"

**Cause** : L'endpoint `/api/setup` n'est pas accessible (application pas encore déployée ou problème de configuration).

**Solutions** :

#### Solution 1 : Utiliser l'initialisation directe
```
Utilisez setup-direct.html au lieu de setup.html
URL : https://votre-app.pages.dev/setup-direct.html
```

#### Solution 2 : Vérifier le déploiement
1. Assurez-vous que l'application est bien déployée sur Cloudflare Pages
2. Vérifiez que le fichier `functions/api/setup.js` est présent
3. Attendez 2-3 minutes après le déploiement

#### Solution 3 : Variables d'environnement
1. Allez dans Cloudflare Pages → Votre projet → Settings → Environment variables
2. Ajoutez `AIRTABLE_BASE_ID` et `AIRTABLE_API_KEY`
3. Redéployez l'application

### ❌ Erreur Airtable "Unauthorized" ou "Forbidden"

**Causes possibles** :
- Token Airtable invalide
- Permissions insuffisantes
- Base ID incorrect

**Solutions** :
1. **Régénérer le token** :
   - Allez sur [airtable.com/create/tokens](https://airtable.com/create/tokens)
   - Créez un nouveau token avec les permissions :
     - `data.records:read`
     - `data.records:write`
     - `schema.bases:read`
     - `schema.bases:write`

2. **Vérifier le Base ID** :
   - Format : `appXXXXXXXXXXXXXX` (17 caractères)
   - Trouvé dans l'URL : `https://airtable.com/appXXXXXXXXXXXXXX/...`

3. **Vérifier les permissions** :
   - Le token doit avoir accès à votre base spécifique
   - Vous devez être propriétaire ou avoir les droits d'édition

### ❌ Erreur CORS

**Cause** : Requêtes bloquées par la politique CORS

**Solutions** :
1. **En développement local** : Utilisez Wrangler
   ```bash
   npx wrangler pages dev . --compatibility-date=2024-01-15
   ```

2. **En production** : Les Cloudflare Functions gèrent automatiquement CORS

3. **Alternative** : Utilisez `setup-direct.html` qui fait les appels depuis le navigateur

### ❌ Rate Limiting Airtable

**Symptômes** : Erreurs intermittentes, certaines tables ne se créent pas

**Solutions** :
- Patientez 1 minute et relancez l'initialisation
- L'outil ajoute automatiquement des délais entre les requêtes
- Plan gratuit Airtable : 5 requêtes/seconde max

### ❌ Tables déjà existantes

**Erreur** : "Table already exists"

**Solutions** :
1. **Supprimer les tables existantes** dans Airtable
2. **Ou créer une nouvelle base** vide
3. L'outil ne peut pas recréer des tables existantes

### ❌ Application ne se charge pas après configuration

**Vérifications** :

1. **Variables Cloudflare** :
   ```
   AIRTABLE_BASE_ID = appXXXXXXXXXXXXXX
   AIRTABLE_API_KEY = patXXXXXXXXXXXXXX.XXXXX...
   ```

2. **Redéployer** après ajout des variables

3. **Tester l'API** directement :
   ```
   https://votre-app.pages.dev/api/tables/droits
   ```

4. **Console du navigateur** : Vérifier les erreurs JavaScript

## Diagnostics étape par étape

### Étape 1 : Vérifier Airtable
```bash
# Test direct de l'API Airtable
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://api.airtable.com/v0/YOUR_BASE_ID/Droits?maxRecords=1"
```

### Étape 2 : Vérifier Cloudflare Functions
```bash
# Test de l'endpoint proxy
curl "https://votre-app.pages.dev/api/tables/droits"
```

### Étape 3 : Vérifier les logs
1. Cloudflare Pages → Votre projet → Functions → Real-time logs
2. Console du navigateur (F12 → Console)

## Solutions de contournement

### Initialisation manuelle d'urgence

Si rien ne fonctionne, vous pouvez créer les tables manuellement :

1. **Tables à créer** : Voir `GUIDE-DEPLOIEMENT-CLOUDFLARE.md`
2. **Données de base** :
   ```
   Table Droits :
   - Reader, Droits de lecture seule, 1, #10B981
   - User, Droits utilisateur standard, 2, #3B82F6
   - Admin, Droits d'administration, 3, #F59E0B
   - Super Admin, Accès complet au système, 4, #EF4444
   ```

### Mode développement local

Pour tester en local sans Cloudflare :

1. Clonez les tables Airtable dans une nouvelle base
2. Utilisez `setup-direct.html` 
3. Configurez `.dev.vars` avec vos identifiants
4. Lancez `npm run dev`

## Support supplémentaire

### Logs utiles à examiner :
- Console navigateur (F12 → Console)
- Cloudflare Pages → Functions → Real-time logs
- Network tab pour voir les requêtes qui échouent

### Informations à fournir si vous avez besoin d'aide :
- Message d'erreur exact
- URL de votre application
- Capture d'écran de la console
- Étapes suivies

---

**La plupart des problèmes se résolvent en utilisant `setup-direct.html` au lieu de `setup.html` !**