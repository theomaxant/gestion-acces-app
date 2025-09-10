# 🛠️ Guide Développement Local

## Prérequis
- Node.js 16+
- Compte Airtable
- Wrangler CLI

## Installation rapide

### 1. Installer Wrangler
```bash
npm install -g wrangler
# ou
npm install wrangler --save-dev
```

### 2. Configurer l'environnement local
```bash
# Copier le template des variables
cp .dev.vars.example .dev.vars

# Éditer .dev.vars avec vos vrais identifiants
nano .dev.vars
```

### 3. Lancer le serveur de développement
```bash
npm run dev
# ou directement
npx wrangler pages dev . --compatibility-date=2024-01-15
```

L'application sera disponible sur `http://localhost:8788`

## Initialisation Airtable en local

1. Créez une base Airtable vide
2. Accédez à `http://localhost:8788/setup.html`
3. Initialisez automatiquement les tables

## Scripts disponibles

```bash
npm run dev      # Développement local
npm run deploy   # Déploiement production
npm run preview  # Aperçu avec données de test
```

## Structure des fonctions

```
functions/
├── api/
│   ├── [...path].js   # Proxy principal Airtable
│   └── setup.js       # Initialisation automatique
```

## Variables d'environnement

### Développement local (`.dev.vars`)
```
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_API_KEY=patXXXXXXXXXXXXXX.XXXXX
```

### Production (Cloudflare Dashboard)
Configurées via l'interface Cloudflare Pages → Settings → Environment variables

## Debug

### Logs en temps réel
```bash
wrangler pages deployment tail --project-name=gestion-acces-app
```

### Test des fonctions
```bash
# Test du proxy
curl http://localhost:8788/api/tables/droits

# Test de l'initialisation
curl -X POST http://localhost:8788/api/setup \
  -H "Content-Type: application/json" \
  -H "X-Airtable-Base-ID: appXXXXXXXXXXXXXX" \
  -H "X-Airtable-API-Key: patXXXXXXXXXXXXXX"
```

## Déploiement

### Via Wrangler CLI
```bash
npm run deploy
```

### Via GitHub Actions (recommandé)
1. Push vers `main`
2. Auto-déploiement via Cloudflare Pages

## Dépannage

### "Module not found"
```bash
rm -rf node_modules
npm install
```

### "Unauthorized" Airtable
- Vérifiez vos tokens Airtable
- Vérifiez les permissions du token (read + write)

### CORS Errors
- Les fonctions Cloudflare gèrent automatiquement CORS
- En local, utilisez `wrangler pages dev` (pas un serveur HTTP classique)