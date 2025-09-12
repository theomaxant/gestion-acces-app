# 💰 Guide des Logiciels à Coût Fixe

## 🎯 Vue d'ensemble

La fonctionnalité **Coût Fixe** permet de gérer des logiciels dont le coût ne dépend pas du nombre d'utilisateurs ou d'accès, mais qui ont un tarif forfaitaire mensuel.

## 🔧 Utilisation

### ✅ Création d'un Logiciel à Coût Fixe

1. **Ajouter un nouveau logiciel** via le bouton "Ajouter un logiciel"
2. **Cocher la case** "💰 Coût fixe (indépendant des accès)"
3. **Renseigner le montant** mensuel fixe en euros HT
4. **Sauvegarder** le logiciel

### 📊 Différences avec les Coûts par Accès

| **Coût par Accès (classique)** | **Coût Fixe** |
|---|---|
| Coût = Nb utilisateurs × Prix unitaire | Coût = Montant fixe |
| Géré via "Gérer les coûts" | Géré directement dans le logiciel |
| Varie selon les utilisateurs | Constant quel que soit le nombre d'utilisateurs |
| Affiché par type d'accès | Affiché globalement |

## 🎨 Interface

### 🏷️ Badges et Indicateurs
- **Badge violet "💰 Coût Fixe"** sur le nom du logiciel
- **Mention " (fixe)"** dans l'affichage des coûts
- **Texte explicatif** "coût fixe global" dans les tableaux

### 📱 Affichage Mobile
Les informations de coût fixe sont adaptées pour l'affichage mobile avec des mentions claires.

## 💻 Exemples d'Usage

### ✅ Cas d'Usage Idéaux
- **Licences globales** : Adobe Creative Suite, Office 365 Famille
- **Forfaits illimités** : Slack Premium, Zoom Pro 
- **Abonnements d'entreprise** : GitHub Enterprise, Jira Cloud
- **Logiciels internes** développés en interne avec coût de maintenance

### ❌ Cas NON Adaptés
- Logiciels facturés par utilisateur (Salesforce, Slack par siège)
- Applications avec tarification progressive
- Outils avec coûts variables selon l'usage

## 🔄 Migration et Conversion

### Passer d'un Coût par Accès à un Coût Fixe
1. **Modifier le logiciel** existant
2. **Cocher "Coût fixe"**
3. **Renseigner le montant** global
4. Les anciens coûts par accès seront **automatiquement ignorés**

### Passer d'un Coût Fixe à un Coût par Accès
1. **Modifier le logiciel**
2. **Décocher "Coût fixe"** 
3. **Aller dans "Gérer les coûts"** pour définir les tarifs par type d'accès
4. Le coût fixe sera **automatiquement ignoré**

## 📊 Impact sur les Calculs

### 🧮 Calculs Automatiquement Mis à Jour
- ✅ **Tableau des logiciels** - Coût annuel et mensuel
- ✅ **Échéancier** - Prochains paiements et calendrier
- ✅ **Tableau de bord** - Statistiques globales
- ✅ **Rapports** - Tous les rapports financiers
- ✅ **Table des accès** - Affichage des coûts globaux
- ✅ **Vue utilisateurs** - Calcul des coûts par utilisateur
- ✅ **Vue équipes** - Calcul des budgets par équipe

### 🔢 Logique de Calcul
```
Si logiciel.cout_fixe = true:
    Coût = logiciel.cout_fixe_mensuel
Sinon:
    Coût = Somme(accès × coût_par_accès)
```

## ⚠️ Points d'Attention

### 🚨 Validation et Contrôles
- **Montant obligatoire** si coût fixe activé
- **Montant positif** requis (> 0€)
- **Pas de doublon** dans les calculs

### 🔄 Cohérence des Données
- Les **coûts par accès existants sont ignorés** si coût fixe activé
- La **périodicité de paiement** reste utilisée pour l'échéancier
- Les **accès utilisateurs** restent nécessaires pour les permissions

## 📋 Base de Données

### 🗃️ Nouvelles Colonnes
```sql
-- Colonnes ajoutées à la table logiciels
cout_fixe BOOLEAN DEFAULT FALSE
cout_fixe_mensuel DECIMAL(10,2) DEFAULT 0
```

### 🔍 Requêtes Utiles
```sql
-- Logiciels à coût fixe
SELECT nom, cout_fixe_mensuel FROM logiciels WHERE cout_fixe = true;

-- Coût total des logiciels à coût fixe
SELECT SUM(cout_fixe_mensuel) as total_fixe FROM logiciels WHERE cout_fixe = true;
```

## 🎯 Bonnes Pratiques

### ✅ Recommandations
1. **Utiliser pour les vrais forfaits** - Seulement quand le coût est réellement indépendant du nombre d'utilisateurs
2. **Documenter la raison** - Utiliser le champ description pour expliquer pourquoi c'est un coût fixe
3. **Réviser régulièrement** - Vérifier que les logiciels marqués comme "coût fixe" le sont toujours
4. **Formation équipes** - Expliquer la différence aux personnes qui gèrent les logiciels

### 💡 Conseils d'Organisation
- **Préfixer les noms** avec "🏢" pour les licences d'entreprise
- **Grouper par équipe** les logiciels à coût fixe partagés
- **Surveiller les échéances** car les montants peuvent être plus importants

---

## 🚀 Résultats Attendus

Avec cette fonctionnalité, vous pouvez maintenant :
- ✅ **Gérer tous types de logiciels** (par utilisateur ET forfaitaires)
- ✅ **Avoir des calculs précis** dans tous les rapports
- ✅ **Simplifier la gestion** des licences d'entreprise
- ✅ **Améliorer la visibilité** sur les coûts réels
- ✅ **Optimiser les négociations** avec des données exactes