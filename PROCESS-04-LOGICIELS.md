# 💻 PROCESSUS - Page Gestion des Logiciels

## 🎯 Objectif
Gérer le catalogue complet des logiciels : création, modification, gestion des coûts et des engagements contractuels.

## ➕ Ajouter un Logiciel

### **Bouton** : "Ajouter un logiciel" (bleu, en haut à droite)

### **Champs du Formulaire**

#### **1. Nom du logiciel*** (Obligatoire)
- **Description** : Nom commercial du logiciel
- **Format** : Texte libre, unique
- **Exemples** : 
  - "Adobe Creative Suite"
  - "Microsoft Office 365"
  - "Slack Premium"
  - "Notion Pro"
- **Validation** : Requis, minimum 2 caractères, nom unique

#### **2. Description** (Optionnel)
- **Description** : Description détaillée des fonctionnalités
- **Format** : Texte libre, multiligne
- **Exemples** :
  - "Suite complète de création graphique et vidéo"
  - "Plateforme de communication d'équipe avec intégrations"
- **Utilité** : Aide les utilisateurs à comprendre l'usage du logiciel

#### **3. Équipe*** (Obligatoire)
- **Description** : Équipe propriétaire/gestionnaire du logiciel
- **Format** : Menu déroulant
- **Options** : Liste de toutes les équipes actives
- **Impact** : Détermine qui gère les accès et le budget

#### **4. Qui paye ?*** (Obligatoire)
- **Description** : Entité responsable du paiement
- **Format** : Menu déroulant
- **Options** : 
  - "Entreprise"
  - "Équipe [Nom de l'équipe]"
- **Impact** : Détermine l'imputation budgétaire

#### **5. Moyen de paiement*** (Obligatoire)
- **Description** : Méthode de paiement utilisée
- **Format** : Menu déroulant
- **Options** :
  - **Carte bancaire** : Paiement par carte de crédit
  - **Prélèvement** : Prélèvement automatique
  - **Virement** : Virement bancaire manuel
- **Utilité** : Suivi des moyens de paiement, optimisation trésorerie

#### **6. Périodicité de paiement*** (Obligatoire)
- **Description** : Fréquence de facturation du logiciel
- **Format** : Menu déroulant
- **Options** :
  - **Mensuel** : Facturation chaque mois
  - **Trimestriel** : Facturation tous les 3 mois
  - **Semestriel** : Facturation tous les 6 mois
  - **Annuel** : Facturation une fois par an
- **Impact** : 
  - Calcul des échéances dans le calendrier
  - Planification budgétaire
  - **Note** : N'affecte PAS les calculs de coûts (toujours mensuels)

#### **7. Date de souscription*** (Obligatoire)
- **Description** : Date de début de l'abonnement
- **Format** : Sélecteur de date (DD/MM/YYYY)
- **Impact** : 
  - Point de départ pour calcul des échéances
  - Suivi de la durée d'utilisation
  - Base pour les engagements contractuels

### **8. Options Spéciales**

#### **☐ Logiciel de base**
- **Description** : Logiciel essentiel attribué automatiquement aux nouveaux utilisateurs
- **Type** : Checkbox
- **Impact** : 
  - Attribution automatique lors de création d'utilisateur (si coché "Accès de base")
  - Considéré comme indispensable à l'activité
- **Exemples** : Email, Suite bureautique, Antivirus

#### **☐ Application Shopify**
- **Description** : Extension ou application du store Shopify
- **Type** : Checkbox
- **Impact** : 
  - Regroupement dans l'échéancier (apps Shopify groupées par date)
  - Catégorisation spéciale dans les rapports
- **Exemples** : Apps de paiement, d'expédition, de marketing Shopify

### **9. Gestion des Coûts**

#### **☐ Coût fixe ?**
- **Description** : Le logiciel a-t-il un coût fixe mensuel global ?
- **Type** : Checkbox
- **Impact** : Change complètement la logique de calcul des coûts

#### **Coût fixe mensuel** (Si coût fixe activé)
- **Description** : Montant fixe mensuel du logiciel
- **Format** : Nombre décimal (€)
- **Exemples** : 
  - Adobe Creative Suite : 500€/mois (licence entreprise)
  - Salesforce Enterprise : 1200€/mois
- **Calcul** : Ce montant + coûts des licences individuelles éventuelles

### **10. Gestion d'Engagement** ⭐

#### **☐ Engagement ?**
- **Description** : Le logiciel est-il sous contrat avec engagement ?
- **Type** : Checkbox
- **Impact** : Activation des champs de gestion contractuelle

#### **Date de fin de contrat** (Si engagement activé)
- **Description** : Date de fin du contrat actuel
- **Format** : Sélecteur de date (DD/MM/YYYY)
- **Impact** : 
  - Alertes de renouvellement
  - Planification budgétaire
  - Conformité contractuelle

#### **Date limite d'annulation** (Si engagement activé)
- **Description** : Date limite pour annuler avant renouvellement
- **Format** : Sélecteur de date (DD/MM/YYYY)
- **Validation** : Doit être antérieure à la date de fin de contrat
- **Impact** : 
  - Alertes préventives
  - Gestion des résiliations
  - Éviter les reconductions tacites

### **Actions du Formulaire**
- **Sauvegarder** : Crée le logiciel et ferme le modal
- **Annuler** : Ferme sans sauvegarder

## ✏️ Modifier un Logiciel

### **Accès** : Clic sur l'icône ✏️ dans le tableau

### **Champs Modifiables**
- Tous les champs de création sont modifiables
- **Attention** : 
  - Changement de coût fixe → recalcul de tous les coûts
  - Modification d'engagement → impact sur alertes et échéances

### **Validation Spéciale**
- **Dates d'engagement** : Vérification cohérence (annulation < fin contrat)
- **Coût fixe** : Si activé, le champ montant devient obligatoire

## 📊 Tableau des Logiciels

### **Colonnes Affichées**

#### **Nom**
- **Contenu** : Nom du logiciel avec badges
- **Badges** : 
  - 🏷️ "De base" (si logiciel de base)
  - 🛒 "Shopify" (si application Shopify)
  - ⚠️ "Engagement" (si sous contrat, badge rouge)

#### **Équipe**
- **Contenu** : Nom de l'équipe propriétaire
- **Lien** : Cliquable vers la fiche équipe

#### **Utilisateurs**
- **Contenu** : Nombre d'utilisateurs ayant un accès
- **Format** : "X utilisateurs"
- **Détail** : Tous types d'accès confondus

#### **Coût Mensuel**
- **Contenu** : Coût mensuel total du logiciel
- **Calcul** : 
  - Si coût fixe : montant fixe + coûts des accès individuels
  - Si pas coût fixe : somme des coûts de tous les accès
- **Format** : "XXX.XX€" (2 décimales)

#### **Périodicité**
- **Contenu** : Fréquence de facturation
- **Affichage** : Mensuel, Trimestriel, Semestriel, Annuel
- **Note** : Pour l'échéancier uniquement, pas les calculs

#### **Moyen de paiement**
- **Contenu** : Mode de paiement utilisé
- **Icônes** : 💳 Carte, 🏦 Prélèvement, 💸 Virement

#### **Actions**
- **✏️ Modifier** : Ouvre le formulaire de modification
- **🗑️ Supprimer** : Archive le logiciel

### **Fonctionnalités du Tableau**
- **Tri** : Par nom, coût, nombre d'utilisateurs
- **Recherche** : En temps réel sur nom et description
- **Filtres** : Par équipe, type, engagement, coût fixe

## 🔧 Gestion des Coûts

### **Logiciels à Coût Fixe**
#### **Principe**
- **Coût de base** : Montant fixe mensuel (ex: 500€)
- **Coûts additionnels** : Licences individuelles en plus (ex: 3×30€ = 90€)
- **Coût total** : 500€ + 90€ = 590€/mois

#### **Répartition par Équipe**
- **Logique** : Coût fixe réparti entre équipes ayant des utilisateurs
- **Exemple** : 500€ fixe, utilisé par 2 équipes → 250€ par équipe

### **Logiciels à Coût Variable**
- **Principe** : Coût = somme des licences individuelles uniquement
- **Calcul** : Nombre d'accès × coût par accès

## 📅 Gestion d'Engagement

### **Alertes Automatiques**
- **Fin de contrat** : Notification 3 mois avant échéance
- **Limite d'annulation** : Alerte 1 mois avant date limite
- **Échéancier** : Affichage des dates critiques

### **Suivi Contractuel**
- **Tableau de bord** : Vue des logiciels sous engagement
- **Rapports** : Liste des contrats arrivant à échéance
- **Historique** : Traçabilité des renouvellements

## 🗑️ Suppression de Logiciel

### **Méthode** : Archivage
- **Prérequis** : Retirer tous les accès actifs avant suppression
- **Impact** : 
  - N'apparaît plus dans les listes
  - Historique conservé
  - Coûts retirés des calculs

## 💡 Bonnes Pratiques

### **Création de Logiciels**
1. **Noms explicites** pour faciliter la recherche
2. **Descriptions détaillées** pour clarifier l'usage
3. **Cocher "De base"** pour les logiciels essentiels
4. **Vérifier les dates d'engagement** pour cohérence

### **Gestion des Coûts**
1. **Utiliser coût fixe** pour les licences entreprise globales
2. **Combiner avec coûts variables** si licences additionnelles
3. **Surveiller le top 3** des logiciels les plus coûteux
4. **Optimiser les moyens de paiement** selon trésorerie

### **Suivi d'Engagement**
1. **Renseigner toutes les dates** contractuelles
2. **Programmer des rappels** avant échéances
3. **Négocier les renouvellements** en avance
4. **Documenter les décisions** d'annulation ou renouvellement