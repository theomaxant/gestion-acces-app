# Guide des Filtres de Logs

## 🔍 Filtres Disponibles

L'interface des logs propose **6 filtres** pour affiner la recherche :

### 1. **Action** 
Filtrer par type d'action effectuée :
- ➕ **Création** : Nouveaux enregistrements
- ✏️ **Modification** : Mises à jour d'enregistrements existants
- 🗑️ **Suppression** : Suppression d'enregistrements
- 📦 **Archivage** : Archivage d'enregistrements
- 🔑 **Connexion** : Authentifications réussies
- 👋 **Déconnexion** : Fins de session

### 2. **Table**
Filtrer par type de données modifiées :
- **Utilisateurs** : Actions sur les comptes utilisateur
- **Logiciels** : Modifications des logiciels
- **Accès** : Attribution/révocation de droits
- **Équipes** : Gestion des équipes
- **Types d'accès** : Configuration des droits

### 3. **Période**
Filtrer par fenêtre temporelle :
- **Aujourd'hui** : Actions du jour en cours
- **Cette semaine** : 7 derniers jours
- **Ce mois** : 30 derniers jours
- **Toute la période** : Tous les logs disponibles

### 4. **Utilisateur** ⭐ *Nouveau*
Filtrer par utilisateur concerné par l'action :
- Liste déroulante des utilisateurs actifs
- Utile pour auditer les actions d'un utilisateur spécifique
- Inclut les actions où l'utilisateur est mentionné dans les données

### 5. **Logiciel** ⭐ *Nouveau*
Filtrer par logiciel impliqué dans l'action :
- Liste déroulante des logiciels non archivés
- Permet de suivre l'historique d'un logiciel particulier
- Inclut les modifications de droits liées au logiciel

### 6. **Bouton Filtrer**
Applique tous les filtres sélectionnés simultanément.

## 🎯 Utilisation Pratique

### Scénarios d'Usage

#### 📊 **Audit Utilisateur**
Pour voir toutes les actions d'un utilisateur :
1. Sélectionner l'utilisateur dans "Utilisateur"
2. Laisser les autres filtres vides
3. Cliquer "Filtrer"

#### 🔍 **Historique Logiciel**
Pour suivre l'évolution d'un logiciel :
1. Sélectionner le logiciel dans "Logiciel"
2. Optionnel : choisir une période
3. Cliquer "Filtrer"

#### 🕒 **Activité Récente**
Pour voir les dernières modifications :
1. Sélectionner "Aujourd'hui" ou "Cette semaine"
2. Optionnel : filtrer par type d'action
3. Cliquer "Filtrer"

#### 🔐 **Audit Sécurité**
Pour voir les connexions/déconnexions :
1. Sélectionner "Connexion" ou "Déconnexion" dans Action
2. Optionnel : sélectionner une période
3. Cliquer "Filtrer"

## ⚡ Fonctionnalités Avancées

### Filtrage Combiné
- **Tous les filtres sont cumulatifs** : vous pouvez les combiner
- **Exemple** : Modifications + Utilisateur + Logiciel = voir toutes les modifications d'un utilisateur sur un logiciel spécifique

### Filtrage en Temps Réel
- Les filtres s'appliquent automatiquement dès qu'ils sont modifiés
- Pas besoin de cliquer "Filtrer" pour chaque changement

### Performance
- **Filtrage côté client** : rapide et réactif
- **Limite de 1000 logs** : pour des performances optimales
- **Pagination** : navigation fluide même avec de nombreux résultats

## 🔧 Informations Techniques

### Comment ça Marche

#### Extraction des Contextes
Le système extrait automatiquement :
- **ID utilisateur** depuis les champs `utilisateur_id` ou depuis la table `utilisateurs`
- **ID logiciel** depuis les champs `logiciel_id` ou depuis la table `logiciels`
- **Noms** résolus pour l'affichage dans les filtres

#### Stockage des Informations
Les logs contiennent :
```json
{
  "details": "Action effectuée | Utilisateur: Jean Dupont | Logiciel: Microsoft Office | Context: user_id:123, software_id:456"
}
```

#### Recherche
- **Par utilisateur** : recherche `user_id:123` dans les détails
- **Par logiciel** : recherche `software_id:456` dans les détails
- **Insensible à la casse** pour les noms

### Limitations
- **Données historiques** : seules les actions futures contiendront les nouveaux contextes
- **Logs existants** : peuvent ne pas avoir les informations utilisateur/logiciel
- **Résolution de noms** : dépend de la disponibilité des données dans les tables

## 📈 Optimisation

### Meilleures Pratiques
1. **Utilisez les filtres de période** pour limiter le volume de données
2. **Combinez les filtres** pour des recherches précises
3. **Exportez régulièrement** pour conserver l'historique
4. **Nettoyez périodiquement** pour maintenir les performances

### Performance Tips
- Plus il y a de filtres actifs, plus la recherche est rapide
- Les filtres de période sont les plus efficaces
- Évitez de laisser tous les filtres vides sur de gros volumes

## 🆘 Dépannage

### Filtres Vides
Si les listes "Utilisateur" ou "Logiciel" sont vides :
1. Vérifier la connexion réseau
2. S'assurer que les données existent dans les tables
3. Recharger la page si nécessaire

### Résultats Inattendus
Si les filtres ne donnent pas les résultats attendus :
1. Vérifier que les données ont été créées après l'implémentation du système
2. Essayer avec des filtres moins restrictifs
3. Utiliser l'export pour analyser les données brutes

### Lenteur
Si l'interface est lente :
1. Utiliser des filtres de période plus restrictifs
2. Nettoyer les anciens logs
3. Limiter le nombre de filtres combinés