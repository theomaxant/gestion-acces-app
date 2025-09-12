# 📊 PROCESSUS - Page Tableau de Bord

## 🎯 Objectif
Le tableau de bord fournit une vue d'ensemble complète de l'état financier et opérationnel de vos licences logiciels.

## 📈 Sections du Dashboard

### 1. **Statistiques Générales (En-tête)**
- **Utilisateurs Actifs** : Nombre total d'utilisateurs non archivés
- **Logiciels** : Nombre total de logiciels dans le catalogue
- **Coût Total** :
  - **Mensuel** : Somme de tous les coûts fixes + coûts des licences individuelles
  - **Annuel** : Coût mensuel × 12
- **Accès Accordés** :
  - **Total** : Nombre total d'accès actifs
  - **Externes** : Nombre d'accès pour utilisateurs externes

### 2. **Top 3 (Ligne de Podiums)**

#### **Top 3 Logiciels (Coût Annuel)**
- **Affichage** : 🥇 🥈 🥉 avec nom du logiciel
- **Calcul** : Coût fixe mensuel + coûts des licences × 12
- **Utilité** : Identifier les logiciels les plus coûteux pour optimisation

#### **Top 3 Utilisateurs (Coût Annuel)**  
- **Affichage** : Nom + prénom de l'utilisateur
- **Calcul** : Somme des coûts de tous les accès de l'utilisateur × 12
- **Utilité** : Identifier les utilisateurs avec le plus d'accès coûteux

#### **Top 3 Équipes (Coût Annuel)**
- **Affichage** : Nom de l'équipe
- **Calcul** : Répartition des coûts fixes + coûts des accès de l'équipe × 12
- **Utilité** : Identifier les équipes consommant le plus de budget IT

### 3. **Statistiques par Équipe** 
- **Tri** : Par coût annuel décroissant (équipe la plus coûteuse en premier)
- **Informations affichées** :
  - **Utilisateurs (total)** : Nombre total d'utilisateurs dans l'équipe
  - **Internes** : Utilisateurs internes (vert)
  - **Externes** : Utilisateurs externes (orange)
  - **Coût mensuel** : Budget mensuel de l'équipe
  - **Coût annuel** : Budget annuel de l'équipe

### 4. **Graphiques Financiers**

#### **Répartition des Coûts par Logiciel**
- **Type** : Graphique en secteurs (camembert)
- **Données** : Coût mensuel de chaque logiciel (arrondis à 2 décimales)
- **Utilité** : Visualiser la répartition budgétaire par logiciel

#### **Coûts par Équipe**
- **Type** : Graphique en barres
- **Données** : Coût mensuel par équipe (arrondis à 2 décimales)
- **Utilité** : Comparer les budgets entre équipes

#### **Moyens de Paiement**
- **Type** : Graphique en secteurs
- **Données** : Répartition des coûts par moyen de paiement
- **Catégories** : Carte bancaire, Prélèvement, Virement
- **Utilité** : Optimiser la gestion des paiements

#### **Répartition Internes vs Externes**
- **Type** : Graphique en barres
- **Données** : Nombre d'utilisateurs internes vs externes
- **Utilité** : Visualiser la proportion d'utilisateurs externes

## 🔄 Actualisation
- **Automatique** : Les données se mettent à jour en temps réel
- **Navigation** : Retour au dashboard depuis n'importe quelle page
- **Performance** : Calculs optimisés avec cache pour affichage rapide

## 💡 Conseils d'Utilisation
1. **Consultez quotidiennement** pour suivre l'évolution des coûts
2. **Analysez le Top 3** pour identifier les optimisations possibles
3. **Surveillez les équipes** avec des coûts élevés pour ajustements budgétaires
4. **Utilisez les graphiques** pour présenter les budgets IT à la direction