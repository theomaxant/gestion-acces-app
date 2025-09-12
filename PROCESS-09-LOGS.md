# 📋 PROCESSUS - Page Logs et Audit

## 🎯 Objectif
Tracer et auditer toutes les actions effectuées dans l'application pour assurer la conformité, la sécurité et le suivi des modifications.

## 🔍 Comprendre les Logs

### **Principe de Traçabilité**
Chaque action importante est automatiquement enregistrée avec :
- **Qui** : Utilisateur connecté ayant effectué l'action
- **Quoi** : Type d'action et détails
- **Quand** : Date et heure précise
- **Où** : Page/section concernée
- **Données** : Valeurs avant/après modification

### **Actions Tracées Automatiquement**
#### **Gestion des Utilisateurs** :
- Création, modification, archivage d'utilisateurs
- Changement d'équipe, de statut
- Attribution/révocation d'accès

#### **Gestion des Logiciels** :
- Ajout, modification de logiciels
- Changement de coûts fixes
- Mise à jour des engagements contractuels

#### **Gestion des Accès** :
- Attribution/suppression d'accès individuels
- Actions en masse sur les accès
- Modification des droits

#### **Gestion Financière** :
- Création/modification des coûts
- Changement de budgets équipe
- Modifications impactant les calculs

## 🔧 Interface de Consultation

### **Barre de Filtres**
#### **Filtre par Action**
- **Description** : Type d'opération effectuée
- **Options** :
  - **Création** : Ajout de nouveaux éléments
  - **Modification** : Mise à jour d'éléments existants
  - **Suppression** : Archivage ou suppression d'éléments
  - **Connexion** : Actions de connexion/déconnexion
  - **Toutes** : Affichage sans filtre
- **Utilité** : Isoler un type d'action spécifique

#### **Filtre par Table**
- **Description** : Entité de données concernée
- **Options** :
  - **utilisateurs** : Actions sur les profils utilisateurs
  - **logiciels** : Gestion du catalogue logiciels
  - **acces** : Attribution et gestion des accès
  - **equipes** : Gestion des équipes
  - **couts_licences** : Modifications des tarifs
  - **droits** : Gestion des niveaux de permissions
  - **Toutes** : Affichage toutes entités
- **Utilité** : Focus sur un type de données

#### **Filtre par Période**
- **Description** : Plage temporelle des actions
- **Options** :
  - **Aujourd'hui** : Actions de la journée courante
  - **Cette semaine** : 7 derniers jours
  - **Ce mois** : Mois en cours
  - **Période personnalisée** : Sélection de dates spécifiques
- **Utilité** : Analyser une période précise

#### **Filtre par Utilisateur**
- **Description** : Auteur des actions
- **Format** : Menu déroulant avec tous les utilisateurs
- **Affichage** : "Prénom NOM (équipe)"
- **Utilité** : Tracer les actions d'une personne spécifique

#### **Filtre par Logiciel**
- **Description** : Logiciel concerné par les actions
- **Format** : Menu déroulant avec tous les logiciels
- **Utilité** : Historique d'un logiciel particulier

### **Bouton d'Application**
- **"Appliquer les filtres"** : Lance la recherche avec critères sélectionnés
- **Réinitialisation** : Option pour effacer tous les filtres

## 📊 Tableau des Logs

### **Colonnes Affichées**

#### **Date/Heure**
- **Format** : DD/MM/YYYY HH:MM:SS
- **Précision** : À la seconde près
- **Tri** : Par défaut, plus récent en premier
- **Utilité** : Chronologie précise des événements

#### **Utilisateur**
- **Contenu** : Prénom NOM de l'utilisateur connecté
- **Lien** : Cliquable vers le profil utilisateur
- **Badge** : "Système" pour actions automatiques
- **Utilité** : Identification de l'auteur de l'action

#### **Action**
- **Contenu** : Type d'opération effectuée
- **Exemples** :
  - "Création utilisateur"
  - "Modification logiciel"
  - "Attribution accès"
  - "Suppression accès"
- **Badge coloré** :
  - 🟢 Vert : Créations
  - 🔵 Bleu : Modifications
  - 🔴 Rouge : Suppressions
  - ⚫ Gris : Consultations/connexions

#### **Table**
- **Contenu** : Entité de données concernée
- **Exemples** : "utilisateurs", "logiciels", "acces"
- **Style** : Badge avec icône selon le type
- **Utilité** : Contextualisation de l'action

#### **Détails**
- **Contenu** : Description détaillée de l'action
- **Exemples** :
  - "Création utilisateur: Marie DUPONT (marketing@entreprise.fr)"
  - "Attribution accès: Adobe Creative Suite → Jean MARTIN (Administrateur)"
  - "Modification logiciel: Salesforce - Coût fixe activé (1200€/mois)"
- **Format** : Texte enrichi avec éléments clés en gras
- **Troncature** : Affichage partiel avec "..." et tooltip complet

#### **Données**
- **Contenu** : Valeurs modifiées (avant → après)
- **Format** : JSON structuré ou texte formaté
- **Exemples** :
  - "nom: 'Dupond' → 'Dupont'"
  - "cout_fixe: false → true, cout_fixe_mensuel: null → 1200"
- **Utilité** : Détail exact des changements

### **Fonctionnalités du Tableau**

#### **Pagination**
- **Affichage** : 50 logs par page par défaut
- **Navigation** : Boutons Précédent/Suivant
- **Compteur** : "Affichage X-Y sur Z total"
- **Performance** : Optimisé pour gros volumes

#### **Tri**
- **Par défaut** : Date décroissante (plus récent en premier)
- **Options** : Clic sur en-têtes pour changer l'ordre
- **Multi-critères** : Combinaison possible

#### **Recherche**
- **Champ global** : Recherche dans tous les champs
- **Instantanée** : Résultats en temps réel
- **Mots-clés** : Recherche partielle acceptée

## 🔍 Actions de Gestion

### **Actualiser**
- **Bouton** : "Actualiser les logs" (icône 🔄)
- **Action** : Recharge les derniers logs
- **Utilité** : Voir les actions récentes sans recharger la page

### **Exporter**
- **Bouton** : "Exporter" (icône 📥)
- **Formats** :
  - **Excel (.xlsx)** : Avec mise en forme et filtres
  - **CSV** : Données brutes pour analyses
- **Contenu** : Logs selon filtres appliqués
- **Utilité** : Archivage, analyse externe, audit comptable

### **Nettoyer**
- **Bouton** : "Nettoyer les logs" (icône 🗑️)
- **Action** : Suppression des anciens logs (> X mois)
- **Sécurité** : Confirmation requise + droits administrateur
- **Conservation** : Respect des obligations légales (RGPD)

## 🎯 Cas d'Usage par Profil

### **👨‍💼 Direction / Audit**
#### **Besoins** :
- Vérification de la traçabilité complète
- Audit de conformité RGPD
- Contrôle des accès sensibles

#### **Consultations Recommandées** :
- **Filtre "Suppression"** : Vérifier toutes les suppressions
- **Filtre utilisateurs privilégiés** : Actions des administrateurs
- **Export mensuel** : Archivage réglementaire

### **🔒 Responsable Sécurité**
#### **Besoins** :
- Surveillance des accès privilégiés
- Détection d'activités suspectes
- Audit des modifications critiques

#### **Consultations Recommandées** :
- **Filtre "droits" + "Modification"** : Changements de permissions
- **Actions hors horaires** : Activité inhabituelle
- **Utilisateurs externes** : Surveillance renforcée

### **💰 Contrôle de Gestion**
#### **Besoins** :
- Traçabilité des modifications de coûts
- Historique des changements budgétaires
- Justification des écarts

#### **Consultations Recommandées** :
- **Filtre "couts_licences"** : Modifications tarifaires
- **Filtre "logiciels" + coût fixe** : Changements structurels
- **Export Excel** : Analyses financières

### **👨‍💻 Support IT**
#### **Besoins** :
- Diagnostic des problèmes utilisateurs
- Historique des modifications techniques
- Support aux utilisateurs finaux

#### **Consultations Recommandées** :
- **Filtre par utilisateur** : Historique d'un utilisateur spécifique
- **Filtre "acces"** : Problèmes d'accès
- **Recherche par logiciel** : Issues sur un outil particulier

## 📋 Conformité et Audit

### **Obligations Légales**

#### **RGPD - Protection des Données**
- **Traçabilité** : Qui a accès à quelles données personnelles
- **Droit à l'oubli** : Historique des suppressions de données
- **Consentement** : Trace des accès accordés/retirés
- **Conservation** : Durée de rétention des logs (définie légalement)

#### **Audit Financier**
- **Justification des coûts** : Historique des modifications tarifaires
- **Contrôle interne** : Qui peut modifier les budgets
- **Ségrégation des tâches** : Vérification des autorisations

#### **Sécurité IT**
- **Accès privilégiés** : Trace de toutes les élévations de droits
- **Modifications système** : Changements de configuration
- **Incidents** : Chronologie pour analyse post-mortem

### **Bonnes Pratiques de Consultation**

#### **Fréquence de Contrôle**
1. **Quotidien** : Vérification des actions sensibles (suppressions, droits admin)
2. **Hebdomadaire** : Revue des modifications de coûts significatives
3. **Mensuel** : Audit complet avec export pour archivage
4. **Trimestriel** : Analyse des tendances et patterns

#### **Alertes à Surveiller**
1. **Actions hors horaires** : Activité en dehors des heures ouvrables
2. **Modifications en masse** : Changements affectant beaucoup d'utilisateurs
3. **Élévation de privilèges** : Nouveaux accès administrateur
4. **Suppressions importantes** : Suppression de logiciels coûteux ou très utilisés

#### **Documentation d'Audit**
1. **Export régulier** : Sauvegarde périodique des logs
2. **Justifications** : Documenter les actions exceptionnelles
3. **Procédures** : Process clair pour chaque type d'action
4. **Formation** : Sensibiliser les utilisateurs à l'importance de la traçabilité

## 💡 Conseils d'Utilisation

### **Recherche Efficace**
1. **Commencer large** : Utiliser période + table, puis affiner
2. **Combiner les filtres** : Croiser utilisateur + action pour précision
3. **Utiliser la recherche texte** : Pour retrouver des éléments spécifiques
4. **Exporter pour analyse** : Excel pour analyses complexes

### **Maintenance**
1. **Nettoyer régulièrement** : Éviter l'accumulation excessive
2. **Archiver avant nettoyage** : Export de sauvegarde obligatoire
3. **Surveiller l'espace disque** : Les logs peuvent grossir rapidement
4. **Tester les exports** : Vérifier la qualité des sauvegardes

### **Analyse des Tendances**
1. **Identifier les patterns** : Actions récurrentes ou inhabituelles
2. **Mesurer l'activité** : Utilisation réelle vs. prévue
3. **Détecter les anomalies** : Actions ne respectant pas les procédures
4. **Améliorer les processus** : Optimiser selon l'usage réel observé