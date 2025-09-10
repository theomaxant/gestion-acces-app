# ⚡ CONFIGURATION SUPABASE - Guide Rapide

## 🎯 Objectif
Configurer Supabase pour héberger l'application + base de données en 30 minutes.

## 📋 Étape 1 : Créer le Projet Supabase

1. **Inscription :** https://supabase.com → "Start your project"
2. **Nouveau projet :**
   - **Nom :** `gestion-acces-app`
   - **Mot de passe DB :** (choisissez un mot de passe fort)
   - **Région :** Europe West (London) si vous êtes en France
3. **Attendre** 2-3 minutes (création du projet)

## 🗄️ Étape 2 : Créer la Base de Données

### Dans Supabase Dashboard → SQL Editor → New Query :

```sql
-- Tables principales
CREATE TABLE equipes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom TEXT NOT NULL UNIQUE,
    description TEXT,
    responsable TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE utilisateurs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    statut TEXT DEFAULT 'Actif',
    equipe_id UUID REFERENCES equipes(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE logiciels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom TEXT NOT NULL,
    description TEXT,
    editeur TEXT,
    version TEXT,
    statut TEXT DEFAULT 'Actif',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE droits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    utilisateur_id UUID REFERENCES utilisateurs(id),
    logiciel_id UUID REFERENCES logiciels(id),
    niveau_acces TEXT DEFAULT 'Lecture',
    date_attribution DATE NOT NULL,
    date_expiration DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE acces (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    utilisateur_id UUID REFERENCES utilisateurs(id),
    logiciel_id UUID REFERENCES logiciels(id),
    date_connexion TIMESTAMP NOT NULL,
    duree_session INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE couts_licences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    logiciel_id UUID REFERENCES logiciels(id),
    type_licence TEXT NOT NULL,
    cout_mensuel DECIMAL(10,2) DEFAULT 0,
    devise TEXT DEFAULT 'EUR',
    date_debut DATE NOT NULL,
    date_fin DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    utilisateur_id UUID REFERENCES utilisateurs(id),
    action TEXT NOT NULL,
    details TEXT,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Données de test
INSERT INTO equipes (nom, description, responsable) VALUES
('Développement', 'Équipe de développement logiciel', 'Jean Dupont'),
('Marketing', 'Équipe marketing et communication', 'Marie Martin'),
('RH', 'Ressources Humaines', 'Pierre Durand');

INSERT INTO logiciels (nom, description, editeur, version) VALUES
('Office 365', 'Suite bureautique Microsoft', 'Microsoft', '2024'),
('Adobe Creative Cloud', 'Suite créative Adobe', 'Adobe', '2024'),
('Slack', 'Plateforme de communication', 'Slack Technologies', 'Latest'),
('Figma', 'Outil de design collaboratif', 'Figma Inc.', 'Web');

INSERT INTO utilisateurs (nom, prenom, email, statut, equipe_id) VALUES
('Dupont', 'Jean', 'jean.dupont@example.com', 'Actif', 
 (SELECT id FROM equipes WHERE nom = 'Développement')),
('Martin', 'Marie', 'marie.martin@example.com', 'Actif', 
 (SELECT id FROM equipes WHERE nom = 'Marketing')),
('Durand', 'Pierre', 'pierre.durand@example.com', 'Actif', 
 (SELECT id FROM equipes WHERE nom = 'RH'));
```

**Cliquez "Run" pour exécuter.**

## 🌐 Étape 3 : Héberger l'Application

1. **Storage → Create bucket :**
   - **Nom :** `web-files`  
   - **Public :** ✅ Coché
   - **"Create bucket"**

2. **Upload des fichiers :**
   - Sélectionnez votre bucket `web-files`
   - **"Upload file"** → `index.html`
   - **Répétez** pour le dossier `js/` complet

3. **Structure finale :**
   ```
   web-files/
   ├── index.html
   └── js/
       ├── supabase-api.js
       ├── app.js
       ├── auth.js
       └── ... (tous les autres JS)
   ```

## 🔧 Étape 4 : Configuration API

### 4.1 Récupérer les Credentials

**Settings → API :**
- **Project URL :** `https://xxxxxx.supabase.co`
- **anon public :** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 4.2 Modifier js/supabase-api.js

**Remplacez ces lignes :**
```javascript
this.supabaseUrl = 'https://YOUR-PROJECT.supabase.co';
this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...YOUR-ANON-KEY';
```

**Par vos vraies valeurs !**

### 4.3 Re-upload du Fichier Modifié
**Storage → web-files → js/ → Remplacer supabase-api.js**

## 🎉 Étape 5 : Test Final

### URL de votre Application :
`https://VOTRE-PROJET.supabase.co/storage/v1/object/public/web-files/index.html`

### Tests de Validation :
1. **Page de connexion** s'affiche ✅
2. **Connexion** avec `admin123` ✅
3. **Console F12 :** `⚡ [SUPABASE] Prêt à utiliser !` ✅
4. **Onglet Utilisateurs :** Jean, Marie, Pierre s'affichent ✅
5. **Ajout utilisateur** fonctionne ✅

## 🛠️ Interface Admin Supabase

### Gérer les Données :
**Table Editor :** Voir/modifier toutes les données en temps réel

### Gérer l'Équipe :
**Settings → Team :** Inviter des collaborateurs

### Monitoring :
**Reports :** Métriques d'usage et performance

## ✅ Résultat Final

**Une seule URL pour :**
- 📱 Application web complète
- 🗄️ Base de données partagée
- 🛠️ Interface d'administration
- 👥 Collaboration équipe
- 📊 Monitoring intégré

**Félicitations ! Votre application est opérationnelle ! 🎉**