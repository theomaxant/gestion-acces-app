# Guide du Système de Logs

## 📝 Vue d'ensemble

Le système de logs enregistre automatiquement toutes les actions effectuées dans l'application, offrant une traçabilité complète des modifications et des activités utilisateur.

## 🎯 Accès aux Logs

### Navigation
1. Connectez-vous à l'application
2. Cliquez sur **Réglages** dans le menu principal
3. Sélectionnez **Logs** dans le sous-menu

### Interface des Logs
L'interface offre une vue complète avec :
- **Statistiques en temps réel** par type d'action
- **Filtres avancés** par action, table et période
- **Détails complets** de chaque action
- **Outils d'export et de maintenance**

## 🔍 Fonctionnalités

### Affichage Avancé des Changements ⭐ *Nouveau*
- **Vue "Avant → Maintenant"** : Visualisation claire des modifications
- **Codes couleur** : Rouge pour les anciennes valeurs, vert pour les nouvelles
- **Résolution d'IDs** : Conversion automatique des IDs en noms lisibles
- **Détails complets** : Vue side-by-side pour les changements détaillés
- **Valeurs formatées** : Dates, nombres et booléens correctement affichés

### Filtrage des Logs
- **Par action** : CREATE, UPDATE, DELETE, ARCHIVE, LOGIN, LOGOUT
- **Par table** : Utilisateurs, Logiciels, Accès, Équipes, Types d'accès
- **Par période** : Aujourd'hui, Cette semaine, Ce mois
- **Par utilisateur** : Filtrer par utilisateur spécifique
- **Par logiciel** : Filtrer par logiciel spécifique

### Affichage des Détails
Chaque entrée de log contient :
- **Horodatage** précis de l'action
- **Type d'action** avec code couleur
- **Table concernée** et ID de l'enregistrement
- **Changements visuels** : format "Avant → Maintenant" avec codes couleur
- **Résolution automatique** des IDs en noms compréhensibles
- **Vue détaillée** avec comparaison side-by-side
- **Informations utilisateur** (session, navigateur)

### Actions Disponibles
- **Actualiser** : Recharger les logs récents
- **Exporter** : Télécharger en format CSV
- **Nettoyer** : Supprimer les logs anciens (>30 jours)

## 📊 Types d'Actions Loggées

### Actions sur les Données
- **➕ CREATE** : Création de nouveaux enregistrements
- **✏️ UPDATE** : Modification d'enregistrements existants
- **🗑️ DELETE** : Suppression d'enregistrements
- **📦 ARCHIVE** : Archivage d'enregistrements

### Actions d'Authentification
- **🔑 LOGIN** : Connexions utilisateur
- **👋 LOGOUT** : Déconnexions utilisateur

## 🎨 Affichage des Changements

### Vue Simplifiée (Liste principale)
Pour chaque modification, affichage compact des 3 premiers changements :
```
Équipe: RH → Direction
Poste: Assistant RH → Directeur Adjoint  
Coût mensuel: 2 500 € → 4 200 €
```

### Vue Détaillée (Clic sur la flèche)
Affichage complet avec visualisation side-by-side :

#### Changements de Données
- **Avant** (fond rouge) | **Maintenant** (fond vert)
- **Résolution automatique** des IDs d'équipes, utilisateurs, logiciels
- **Formatage intelligent** des dates, nombres, booléens

#### Types de Résolution d'IDs
- **equipe_id** → Nom de l'équipe (ex: "Direction")
- **utilisateur_id** → Prénom + Nom (ex: "Jean Dupont")  
- **logiciel_id** → Nom du logiciel (ex: "Microsoft Office")
- **droit_id** → Type d'accès (ex: "Admin")

#### Exemples d'Affichage
- **Texte** : `Assistant RH → Directeur Adjoint`
- **Nombre** : `2 500 € → 4 200 €`
- **Booléen** : `✗ Non → ✓ Oui`
- **Date** : `01/01/2024 10:30 → 15/01/2024 14:20`
- **ID résolu** : `RH (12345678...) → Direction (87654321...)`

## 🛠️ Fonctionnalités Techniques

### Logging Automatique
Le système intercepte automatiquement :
- **Appels API REST** : POST, PUT, PATCH, DELETE
- **Actions d'authentification** : Connexion/déconnexion
- **Modifications de données** : Toutes les tables principales

### Structure des Logs
```json
{
  "id": "uuid",
  "action": "CREATE|UPDATE|DELETE|ARCHIVE|LOGIN|LOGOUT",
  "table_name": "nom_de_la_table",
  "record_id": "id_de_l_enregistrement",
  "old_values": "anciennes_valeurs_json",
  "new_values": "nouvelles_valeurs_json",
  "user_info": "informations_utilisateur_json",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "details": "détails_supplémentaires"
}
```

### Informations Utilisateur Capturées
- **État de session** : Actif/inactif
- **Heure de connexion** : Timestamp de la dernière connexion
- **Navigateur** : User-Agent complet
- **Langue** : Langue du navigateur
- **Horodatage** : Moment exact de l'action

## 📈 Utilisation et Analyse

### Surveillance des Activités
- **Traçabilité** : Qui a fait quoi et quand
- **Audit** : Historique complet des modifications
- **Débogage** : Identification des problèmes de données
- **Conformité** : Respect des exigences de traçabilité

### Statistiques Disponibles
- **Total des actions** par période
- **Répartition par type** d'action
- **Activité par table** de données
- **Fréquence des connexions**

## 🔧 Maintenance

### Nettoyage des Logs
**Automatique** : Les logs peuvent être nettoyés automatiquement
- **Période par défaut** : Conservation de 30 jours
- **Action manuelle** : Bouton "Nettoyer" dans l'interface
- **Confirmation** : Demande de confirmation avant suppression

### Export des Données
**Format CSV** avec colonnes :
- Date
- Action
- Table
- ID Enregistrement
- Détails

### Performance
Le système est optimisé pour :
- **Logging asynchrone** : Pas d'impact sur les performances
- **Pagination** : Chargement rapide même avec de nombreux logs
- **Filtrage efficace** : Recherche rapide dans les logs

## ⚠️ Considérations

### Confidentialité
- **Données sensibles** : Les mots de passe ne sont jamais loggés
- **Informations personnelles** : Respect de la confidentialité
- **Accès restreint** : Seuls les utilisateurs connectés peuvent voir les logs

### Stockage
- **Espace disque** : Les logs peuvent occuper de l'espace
- **Performance** : Nettoyage régulier recommandé
- **Sauvegarde** : Exporter régulièrement pour archivage

### Limitations
- **Côté client** : Impossible de capturer l'IP réelle
- **Session limitée** : Informations liées à la session navigateur
- **Récursion** : Les logs eux-mêmes ne sont pas loggés

## 🚀 Bonnes Pratiques

1. **Consultation régulière** : Vérifier les logs périodiquement
2. **Export de sauvegarde** : Exporter avant nettoyage
3. **Analyse des tendances** : Utiliser les statistiques
4. **Investigation rapide** : Utiliser les filtres pour cibler
5. **Maintenance préventive** : Nettoyer régulièrement

## 📞 Support

En cas de problème avec les logs :
1. Vérifier la console navigateur (F12)
2. Contrôler la connexion réseau
3. Vérifier les permissions d'accès
4. Redémarrer l'application si nécessaire