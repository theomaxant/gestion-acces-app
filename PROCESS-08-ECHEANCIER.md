# 📅 PROCESSUS - Page Échéancier des Paiements

## 🎯 Objectif
Planifier et suivre toutes les échéances de paiement des logiciels, avec gestion des engagements contractuels et alertes préventives.

## 📋 Vue d'Ensemble de l'Échéancier

### **Affichage Principal**
L'échéancier présente une **vue calendaire mensuelle** avec tous les paiements et échéances prévus.

### **Éléments Affichés**
- **Calendrier principal** : Mois sélectionné avec dates importantes
- **3 blocs de résumé** : Mois courant, Mois +1, Mois +2
- **Navigation** : Boutons ← → pour naviguer mois par mois
- **Détails par jour** : Paiements et alertes pour chaque date

## 🗓️ Navigation dans le Calendrier

### **Navigation Mensuelle**
#### **Boutons de Navigation**
- **← Précédent** : Recule d'exactement 1 mois
- **→ Suivant** : Avance d'exactement 1 mois
- **Titre central** : Affiche "Mois Année" (ex: "Janvier 2024")

#### **Fonctionnement**
- **Un clic = un mois** : Navigation précise et prévisible
- **Pas de saut** : Avancement régulier mois par mois
- **Cohérence** : Le calendrier et les blocs se synchronisent

### **Blocs de Résumé Mensuel**
#### **Disposition**
- **Bloc 1** : Mois courant (même que le calendrier) - `• Courant`
- **Bloc 2** : Mois suivant (+1) - `Mois +1`
- **Bloc 3** : Mois +2 - `Mois +2`

#### **Informations par Bloc**
- **Nom du mois** et année
- **Coût total** : Somme de tous les paiements prévus
- **Nombre de paiements** : Quantité d'échéances
- **Indicateur** : Position temporelle claire

## 💰 Types d'Échéances Affichées

### **1. Paiements Récurrents**
#### **Calcul Automatique**
- **Base** : Date de souscription du logiciel
- **Fréquence** : Selon périodicité définie (mensuel, trimestriel, semestriel, annuel)
- **Montant** : Coût mensuel du logiciel (fixe + variables)

#### **Exemples**
- **Adobe Creative Suite** (mensuel) :
  - Souscription : 15/01/2024
  - Paiements : 15/02, 15/03, 15/04, etc.
  - Montant : 590€ (500€ fixe + 90€ variables)

- **Salesforce** (annuel) :
  - Souscription : 01/06/2024
  - Paiements : 01/06/2025, 01/06/2026, etc.
  - Montant : 14 400€ (1200€ × 12 mois)

### **2. Applications Shopify Groupées**
#### **Fonctionnalité Spéciale**
- **Groupement automatique** : Si plusieurs apps Shopify ont un paiement le même jour
- **Affichage** : "🛒 Apps Shopify (X)" avec montant total
- **Détail** : Liste des applications concernées au clic

#### **Exemple**
- Date : 15/03/2024
- Affichage : "🛒 Apps Shopify (3) - 150€"
- Détail : 
  - App Paiement : 50€
  - App Expédition : 60€
  - App Marketing : 40€

### **3. Alertes d'Engagement**
#### **Dates Critiques**
- **⚠️ Fin de contrat** : Date de fin d'engagement contractuel
- **🚨 Limite d'annulation** : Date limite pour résilier avant reconduction

#### **Codes Couleurs**
- **🔴 Rouge** : Date passée ou dans moins de 30 jours
- **🟡 Jaune** : Dans 30 à 90 jours
- **🟢 Vert** : Dans plus de 90 jours

#### **Exemple d'Alerte**
- Date : 28/02/2024
- Affichage : "⚠️ Fin contrat Salesforce"
- Action : Prévoir renouvellement ou résiliation

## 📊 Calcul des Montants

### **Logiciels à Coût Fixe**
#### **Composition du Montant**
- **Coût fixe mensuel** : Montant de base (ex: 500€)
- **Coûts variables** : Licences individuelles supplémentaires (ex: 90€)
- **Total périodique** : Selon la périodicité
  - Mensuel : 590€
  - Trimestriel : 590€ × 3 = 1 770€
  - Annuel : 590€ × 12 = 7 080€

### **Logiciels à Coût Variable Uniquement**
#### **Calcul**
- **Base** : Somme des coûts de tous les accès actifs
- **Périodicité** : Multiplication selon fréquence de paiement
- **Évolution** : Recalculé si ajout/suppression d'utilisateurs

### **Accès Communs**
#### **Traitement Spécial**
- **Coût total** : Compté une seule fois par équipe/logiciel
- **Répartition** : Division par nombre d'utilisateurs (pour affichage détaillé)
- **Paiement** : Montant global dans l'échéancier

## 🔍 Navigation et Consultation

### **Vue Calendaire**
#### **Affichage par Jour**
- **Jours avec paiements** : Marqués visuellement (fond coloré)
- **Montant du jour** : Somme des paiements prévus
- **Détail au clic** : Liste des logiciels et montants

#### **Codes Visuels**
- **Bleu** : Paiements normaux
- **Orange** : Paiements importants (> seuil défini)
- **Rouge** : Alertes contractuelles
- **Vert** : Applications Shopify groupées

### **Détails d'une Date**
#### **Informations Affichées**
- **Liste des logiciels** concernés
- **Montant individuel** de chaque paiement
- **Type de paiement** : Récurrent, engagement, alerte
- **Moyen de paiement** : Carte, prélèvement, virement
- **Équipe responsable** : Qui gère ce logiciel

## 📈 Utilisation Stratégique

### **Planification Budgétaire**
#### **Vue à 3 Mois**
- **Anticipation** : Prévoir les sorties de trésorerie
- **Lissage** : Identifier les pics de paiement
- **Négociation** : Décaler certaines échéances si nécessaire

#### **Analyse des Tendances**
- **Évolution mensuelle** : Croissance ou décroissance des coûts
- **Saisonnalité** : Identifier les périodes plus coûteuses
- **Prévisions** : Extrapoler les coûts futurs

### **Gestion de Trésorerie**
#### **Optimisation des Dates**
- **Étalement** : Éviter la concentration sur quelques dates
- **Synchronisation** : Aligner avec les dates de paiement client
- **Négociation** : Demander des modifications d'échéances

#### **Moyens de Paiement**
- **Répartition** : Optimiser entre carte, prélèvement, virement
- **Trésorerie** : Adapter selon les flux de trésorerie
- **Automatisation** : Privilégier les prélèvements pour régularité

### **Gestion Contractuelle**
#### **Suivi des Engagements**
- **Alertes préventives** : Ne pas rater les dates critiques
- **Négociations** : Préparer les renouvellements en amont
- **Résiliations** : Respecter les délais de préavis

#### **Optimisation Contractuelle**
- **Renégociation** : Profiter des échéances pour négocier
- **Consolidation** : Regrouper plusieurs contrats chez un éditeur
- **Arbitrage** : Décider renouvellement vs. alternative

## 🎯 Actions Recommandées

### **Consultation Quotidienne**
1. **Vérifier la semaine** : Paiements prévus dans les 7 jours
2. **Valider les montants** : Cohérence avec les budgets
3. **Préparer la trésorerie** : S'assurer des provisions nécessaires

### **Révision Mensuelle**
1. **Analyser le mois passé** : Écarts entre prévu et réalisé
2. **Valider le mois courant** : Ajustements nécessaires
3. **Anticiper le mois suivant** : Préparation budgétaire

### **Planification Trimestrielle**
1. **Vue à 3 mois** : Identifier les pics et creux
2. **Négociations** : Préparer les discussions avec éditeurs
3. **Optimisations** : Ajuster dates et moyens de paiement

### **Gestion Annuelle**
1. **Budget prévisionnel** : Extrapoler les coûts sur 12 mois
2. **Contrats** : Planifier tous les renouvellements
3. **Stratégie IT** : Aligner échéancier avec roadmap technologique

## 💡 Bonnes Pratiques

### **Organisation**
1. **Étaler les paiements** : Éviter la concentration sur quelques dates
2. **Synchroniser** avec la facturation client si applicable
3. **Documenter** les décisions de changement d'échéances
4. **Former** les équipes aux alertes contractuelles

### **Suivi**
1. **Vérification hebdomadaire** : Cohérence prévisions/réalité
2. **Mise à jour immédiate** : Nouveaux logiciels ou résiliations
3. **Archivage** : Conserver l'historique des modifications
4. **Communication** : Informer les équipes des échéances importantes

### **Optimisation**
1. **Négocier les dates** : Aligner sur cycles budgétaires
2. **Grouper les paiements** : Réduire les frais bancaires
3. **Automatiser** : Privilégier prélèvements et virements programmés
4. **Anticiper** : Prévoir les renouvellements 6 mois à l'avance

### **Alertes et Notifications**
1. **Paramétrer des rappels** : 30, 60, 90 jours avant échéances
2. **Désigner des responsables** : Qui gère quoi et quand
3. **Escalader** : Process si pas de réaction aux alertes
4. **Documenter** : Toutes les décisions de renouvellement/résiliation