# 🔧 Correction Variables Cloudflare

## 🎯 Votre situation actuelle

D'après votre capture d'écran, vous avez :
- ✅ `AIRTABLE_BASE_ID` (correct)
- ❌ `AIRTABLE_TOKEN` (nom incorrect)
- ⚠️ Seulement en "Production" (il faut aussi "Preview")

## 📋 Solution 1 : Correction rapide (Recommandée)

### Étape 1 : Ajouter les variables pour Preview
1. **Changez l'environnement** de "Production" → "Preview"
2. **Cliquez sur "+ Add"** 
3. **Ajoutez les 2 variables** :
   ```
   Name: AIRTABLE_BASE_ID
   Value: appR37ugolbIvJ6YF
   Type: Secret
   
   Name: AIRTABLE_TOKEN
   Value: votre_token_complet
   Type: Secret
   ```

### Étape 2 : Redéployer
- **Deployments** → **Retry deployment**
- **Attendez 2-3 minutes**

## 📋 Solution 2 : Correction complète (Optionnelle)

Si vous voulez utiliser le nom standard :

### Renommer la variable
1. **Supprimez** `AIRTABLE_TOKEN`
2. **Créez** `AIRTABLE_API_KEY` avec la même valeur
3. **Faites-le pour Production ET Preview**

## ✅ État final attendu

**Production :**
```
AIRTABLE_BASE_ID = appR37ugolbIvJ6YF
AIRTABLE_TOKEN = pat... (ou AIRTABLE_API_KEY)
```

**Preview :**
```
AIRTABLE_BASE_ID = appR37ugolbIvJ6YF  
AIRTABLE_TOKEN = pat... (ou AIRTABLE_API_KEY)
```

## 🔧 Code adapté

J'ai déjà modifié le code pour accepter `AIRTABLE_TOKEN` ou `AIRTABLE_API_KEY`, donc les deux noms fonctionnent maintenant.

## 🚨 Points importants

### Pourquoi Preview aussi ?
Cloudflare Pages utilise "Preview" pour les déploiements de test et "Production" pour le site final. Il faut les deux.

### Vérification
Après redéploiement, le message orange devrait disparaître et l'application devra charger les données depuis Airtable.

## ⏱️ Temps estimé
- **Solution 1** : 2 minutes
- **Solution 2** : 5 minutes

---

**🎯 Priorité : Ajoutez d'abord les variables en Preview, puis redéployez !**