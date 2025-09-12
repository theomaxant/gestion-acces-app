/**
 * 📚 Système de Processus En Dur - Version Définitive
 * Tous les 10 processus intégrés directement
 */

class HardcodedProcesses {
    constructor() {
        this.currentProcess = null;
        this.processes = {
            'dashboard': {
                title: '📊 Dashboard - Tableau de Bord',
                category: 'Monitoring',
                content: `
<h1>📊 PROCESSUS - Page Tableau de Bord</h1>

<h2>🎯 Objectif</h2>
<p>Le tableau de bord fournit une vue d'ensemble complète de l'état financier et opérationnel de vos licences logiciels.</p>

<h2>📈 Sections du Dashboard</h2>

<h3>1. <strong>Statistiques Générales (En-tête)</strong></h3>
<ul>
<li><strong>Utilisateurs Actifs</strong> : Nombre total d'utilisateurs non archivés</li>
<li><strong>Logiciels</strong> : Nombre total de logiciels dans le catalogue</li>
<li><strong>Coût Total</strong> :
  <ul>
    <li><strong>Mensuel</strong> : Somme de tous les coûts fixes + coûts des licences individuelles</li>
    <li><strong>Annuel</strong> : Coût mensuel × 12</li>
  </ul>
</li>
<li><strong>Accès Accordés</strong> :
  <ul>
    <li><strong>Total</strong> : Nombre total d'accès actifs</li>
    <li><strong>Externes</strong> : Nombre d'accès pour utilisateurs externes</li>
  </ul>
</li>
</ul>

<h3>2. <strong>Top 3 (Ligne de Podiums)</strong></h3>

<h4><strong>Top 3 Logiciels (Coût Annuel)</strong></h4>
<ul>
<li><strong>Affichage</strong> : 🥇 🥈 🥉 avec nom du logiciel</li>
<li><strong>Calcul</strong> : Coût fixe mensuel + coûts des licences × 12</li>
<li><strong>Utilité</strong> : Identifier les logiciels les plus coûteux pour optimisation</li>
</ul>

<h4><strong>Top 3 Utilisateurs (Coût Annuel)</strong></h4>
<ul>
<li><strong>Affichage</strong> : Nom + prénom de l'utilisateur</li>
<li><strong>Calcul</strong> : Somme des coûts de tous les accès de l'utilisateur × 12</li>
<li><strong>Utilité</strong> : Identifier les utilisateurs avec le plus d'accès coûteux</li>
</ul>

<h4><strong>Top 3 Équipes (Coût Annuel)</strong></h4>
<ul>
<li><strong>Affichage</strong> : Nom de l'équipe</li>
<li><strong>Calcul</strong> : Répartition des coûts fixes + coûts des accès de l'équipe × 12</li>
<li><strong>Utilité</strong> : Identifier les équipes consommant le plus de budget IT</li>
</ul>

<h3>3. <strong>Statistiques par Équipe</strong></h3>
<ul>
<li><strong>Tri</strong> : Par coût annuel décroissant (équipe la plus coûteuse en premier)</li>
<li><strong>Informations affichées</strong> :
  <ul>
    <li><strong>Utilisateurs (total)</strong> : Nombre total d'utilisateurs dans l'équipe</li>
    <li><strong>Internes</strong> : Utilisateurs internes (vert)</li>
    <li><strong>Externes</strong> : Utilisateurs externes (orange)</li>
    <li><strong>Coût mensuel</strong> : Budget mensuel de l'équipe</li>
    <li><strong>Coût annuel</strong> : Budget annuel de l'équipe</li>
  </ul>
</li>
</ul>

<h2>💡 Conseils d'Utilisation</h2>
<ol>
<li><strong>Consultez quotidiennement</strong> pour suivre l'évolution des coûts</li>
<li><strong>Analysez le Top 3</strong> pour identifier les optimisations possibles</li>
<li><strong>Surveillez les équipes</strong> avec des coûts élevés pour ajustements budgétaires</li>
<li><strong>Utilisez les graphiques</strong> pour présenter les budgets IT à la direction</li>
</ol>
`
            },
            'utilisateurs': {
                title: '👥 Utilisateurs - Gestion des Personnes',
                category: 'Administration',
                content: `
<h1>👥 PROCESSUS - Gestion des Utilisateurs</h1>

<h2>🎯 Objectif</h2>
<p>Gérer complètement le cycle de vie des utilisateurs ayant accès aux logiciels de l'organisation.</p>

<h2>📝 Création d'un Utilisateur</h2>

<h3><strong>Champs Obligatoires</strong></h3>
<ul>
<li><strong>Nom</strong> : Nom de famille de l'utilisateur</li>
<li><strong>Prénom</strong> : Prénom de l'utilisateur</li>
<li><strong>Email</strong> : Adresse email unique (utilisée pour identification)</li>
</ul>

<h3><strong>Champs Optionnels</strong></h3>
<ul>
<li><strong>Téléphone</strong> : Numéro de téléphone professionnel</li>
<li><strong>Poste</strong> : Fonction/Rôle dans l'organisation</li>
<li><strong>Équipe</strong> : Équipe d'appartenance (sélection dans liste existante)</li>
<li><strong>Statut</strong> : Actif/Inactif (Actif par défaut)</li>
<li><strong>Type</strong> : Interne/Externe (Interne par défaut)</li>
</ul>

<h2>🔄 Actions en Masse</h2>

<h3><strong>Sélection Multiple</strong></h3>
<ol>
<li><strong>Cocher</strong> les cases des utilisateurs concernés</li>
<li><strong>Utiliser</strong> la barre d'actions en masse qui apparaît</li>
<li><strong>Choisir</strong> l'action à appliquer</li>
</ol>

<h3><strong>Actions Disponibles</strong></h3>
<ul>
<li><strong>Modifier l'équipe</strong> : Déplacer plusieurs utilisateurs vers une équipe</li>
<li><strong>Changer le statut</strong> : Activer/Désactiver en groupe</li>
<li><strong>Archiver</strong> : Supprimer définitivement plusieurs utilisateurs</li>
<li><strong>Exporter</strong> : Télécharger la sélection en Excel</li>
</ul>

<h2>💡 Bonnes Pratiques</h2>

<h3><strong>Création</strong></h3>
<ol>
<li><strong>Vérifier</strong> que l'utilisateur n'existe pas déjà</li>
<li><strong>Renseigner l'équipe</strong> dès la création</li>
<li><strong>Définir le type</strong> (Interne/Externe) correctement</li>
<li><strong>Valider l'email</strong> avec l'utilisateur</li>
</ol>

<h3><strong>Sécurité</strong></h3>
<ol>
<li><strong>Désactiver immédiatement</strong> les comptes des départs</li>
<li><strong>Réviser les accès</strong> lors des changements de poste</li>
<li><strong>Limiter les utilisateurs externes</strong> aux accès nécessaires</li>
<li><strong>Documenter</strong> les raisons d'archivage</li>
</ol>
`
            },
            'equipes': {
                title: '🏢 Équipes - Organisation et Budgets',
                category: 'Organisation',
                content: `
<h1>🏢 PROCESSUS - Gestion des Équipes</h1>

<h2>🎯 Objectif</h2>
<p>Organiser les utilisateurs en équipes avec des budgets dédiés pour une meilleure gestion des coûts logiciels.</p>

<h2>📝 Création d'une Équipe</h2>

<h3><strong>Champs Obligatoires</strong></h3>
<ul>
<li><strong>Nom</strong> : Nom unique de l'équipe</li>
<li><strong>Description</strong> : Description de l'équipe et de son rôle</li>
</ul>

<h3><strong>Champs Optionnels</strong></h3>
<ul>
<li><strong>Budget Mensuel</strong> : Budget alloué à l'équipe par mois (€)</li>
<li><strong>Responsable</strong> : Nom du responsable/manager de l'équipe</li>
<li><strong>Couleur</strong> : Couleur d'identification dans les graphiques</li>
</ul>

<h2>💰 Gestion des Coûts par Équipe</h2>

<h3><strong>Calcul du Coût d'une Équipe</strong></h3>
<ol>
<li><strong>Logiciels à coût fixe</strong> : Coût divisé entre toutes les équipes qui l'utilisent</li>
<li><strong>Licences individuelles</strong> : Somme des coûts des accès des utilisateurs de l'équipe</li>
<li><strong>Coût total</strong> : Coût fixe réparti + coûts individuels</li>
</ol>

<h3><strong>Répartition des Coûts Fixes</strong></h3>
<p><strong>Principe</strong> : Si un logiciel a un coût fixe mensuel, il est réparti équitablement entre toutes les équipes qui ont des utilisateurs avec accès à ce logiciel</p>
<p><strong>Exemple</strong> : Adobe Creative Suite (500€/mois) utilisé par 3 équipes → 166,67€ par équipe</p>

<h2>📊 Statistiques par Équipe</h2>

<h3><strong>Indicateurs Financiers</strong></h3>
<ul>
<li><strong>Budget Mensuel</strong> : Montant alloué</li>
<li><strong>Coût Mensuel Réel</strong> : Coût calculé des accès</li>
<li><strong>Coût Annuel</strong> : Projection sur 12 mois</li>
<li><strong>Taux d'Utilisation</strong> : (Coût Réel / Budget) × 100</li>
</ul>

<h3><strong>Indicateurs Utilisateurs</strong></h3>
<ul>
<li><strong>Nombre total</strong> d'utilisateurs</li>
<li><strong>Utilisateurs actifs</strong> avec accès</li>
<li><strong>Utilisateurs internes</strong> vs <strong>externes</strong></li>
<li><strong>Moyenne d'accès</strong> par utilisateur</li>
</ul>

<h2>💡 Bonnes Pratiques</h2>

<h3><strong>Définition des Équipes</strong></h3>
<ol>
<li><strong>Cohérence métier</strong> : Regrouper par fonction/projet</li>
<li><strong>Taille optimale</strong> : 5-15 personnes par équipe</li>
<li><strong>Responsabilité claire</strong> : Un responsable identifié</li>
<li><strong>Budget réaliste</strong> : Basé sur l'historique et les besoins</li>
</ol>

<h3><strong>Suivi Budgétaire</strong></h3>
<ol>
<li><strong>Révision mensuelle</strong> des coûts vs budget</li>
<li><strong>Ajustements trimestriels</strong> si nécessaire</li>
<li><strong>Planification annuelle</strong> des budgets</li>
<li><strong>Communication</strong> régulière avec les responsables</li>
</ol>
`
            },
            'logiciels': {
                title: '💻 Logiciels - Catalogue et Coûts',
                category: 'Catalogue',
                content: `
<h1>💻 PROCESSUS - Gestion du Catalogue Logiciels</h1>

<h2>🎯 Objectif</h2>
<p>Gérer le catalogue complet des logiciels avec leurs coûts, versions et conditions d'engagement.</p>

<h2>📝 Ajout d'un Logiciel</h2>

<h3><strong>Informations de Base (Obligatoires)</strong></h3>
<ul>
<li><strong>Nom</strong> : Nom du logiciel (unique)</li>
<li><strong>Éditeur</strong> : Société qui édite le logiciel</li>
<li><strong>Catégorie</strong> : Type de logiciel (Bureautique, Design, Développement, etc.)</li>
<li><strong>Description</strong> : Description fonctionnelle du logiciel</li>
</ul>

<h2>📊 Types de Logiciels et Calculs</h2>

<h3><strong>Coût Fixe Mensuel</strong></h3>
<ul>
<li><strong>Utilité</strong> : Pour les licences globales, abonnements entreprise</li>
<li><strong>Exemple</strong> : Adobe Creative Suite, Microsoft 365 Entreprise</li>
<li><strong>Répartition</strong> : Divisé automatiquement entre les équipes utilisatrices</li>
</ul>

<h3><strong>Coût par Licence Individuelle</strong></h3>
<ul>
<li><strong>Utilité</strong> : Pour les licences nominatives</li>
<li><strong>Exemple</strong> : Photoshop individuel, AutoCAD par utilisateur</li>
<li><strong>Application</strong> : Multiplié par le nombre d'utilisateurs ayant accès</li>
</ul>

<h3><strong>Cumul des Coûts</strong></h3>
<ul>
<li><strong>Principe</strong> : Un logiciel peut avoir BOTH coût fixe ET coût individuel</li>
<li><strong>Calcul Total</strong> : Coût fixe + (Coût individuel × Nombre d'accès)</li>
<li><strong>Exemple</strong> : Slack (base fixe 100€ + 5€ par utilisateur supplémentaire)</li>
</ul>

<h2>🔒 Gestion des Engagements</h2>

<h3><strong>Période d'Engagement</strong></h3>
<ul>
<li><strong>Définition</strong> : Durée minimale contractuelle (en mois)</li>
<li><strong>Utilité</strong> : Éviter les résiliations prématurées coûteuses</li>
<li><strong>Alerte</strong> : Notification avant expiration pour renouvellement/résiliation</li>
</ul>

<h3><strong>Date de Renouvellement</strong></h3>
<ul>
<li><strong>Calcul automatique</strong> : Date de début + période d'engagement</li>
<li><strong>Rappels</strong> : Alertes à 30, 15 et 7 jours avant échéance</li>
<li><strong>Actions</strong> : Renouveler, Renégocier, ou Résilier</li>
</ul>

<h2>📈 Optimisation du Catalogue</h2>

<h3><strong>Analyse des Doublons</strong></h3>
<ol>
<li><strong>Identifier</strong> les logiciels similaires (même fonction)</li>
<li><strong>Comparer</strong> les coûts et fonctionnalités</li>
<li><strong>Proposer</strong> une consolidation sur le plus avantageux</li>
<li><strong>Planifier</strong> la migration des utilisateurs</li>
</ol>

<h3><strong>Négociation des Tarifs</strong></h3>
<ol>
<li><strong>Volumes</strong> : Négocier selon le nombre d'utilisateurs</li>
<li><strong>Durée</strong> : Obtenir des remises pour engagements longs</li>
<li><strong>Groupement</strong> : Regrouper plusieurs logiciels du même éditeur</li>
<li><strong>Alternatives</strong> : Évaluer la concurrence régulièrement</li>
</ol>

<h2>💡 Bonnes Pratiques</h2>

<h3><strong>Documentation</strong></h3>
<ol>
<li><strong>Centraliser</strong> toutes les informations contractuelles</li>
<li><strong>Maintenir à jour</strong> les conditions et tarifs</li>
<li><strong>Archiver</strong> les anciennes versions de contrats</li>
<li><strong>Documenter</strong> les négociations et décisions</li>
</ol>

<h3><strong>Gestion des Accès</strong></h3>
<ol>
<li><strong>Contrôler</strong> régulièrement qui a accès à quoi</li>
<li><strong>Révoquer</strong> les accès des utilisateurs partis</li>
<li><strong>Optimiser</strong> les licences selon l'usage réel</li>
<li><strong>Former</strong> les utilisateurs pour maximiser la valeur</li>
</ol>
`
            },
            'droits': {
                title: '🛡️ Droits - Permissions et Sécurité',
                category: 'Sécurité',
                content: `
<h1>🛡️ PROCESSUS - Gestion des Droits et Permissions</h1>

<h2>🎯 Objectif</h2>
<p>Définir et gérer les niveaux de permissions accordés aux utilisateurs dans l'application de gestion des accès.</p>

<h2>🔐 Types de Droits Standards</h2>

<h3><strong>Droits d'Administration</strong></h3>
<ul>
<li><strong>admin_global</strong> : Administration complète de l'application</li>
<li><strong>admin_users</strong> : Gestion complète des utilisateurs</li>
<li><strong>admin_software</strong> : Gestion complète du catalogue logiciels</li>
<li><strong>admin_teams</strong> : Gestion complète des équipes</li>
<li><strong>admin_access</strong> : Attribution/révocation des accès logiciels</li>
<li><strong>admin_reports</strong> : Accès à tous les rapports et statistiques</li>
</ul>

<h3><strong>Droits de Gestion</strong></h3>
<ul>
<li><strong>manage_users</strong> : Créer/modifier les utilisateurs (sans suppression)</li>
<li><strong>manage_teams</strong> : Créer/modifier les équipes</li>
<li><strong>manage_access</strong> : Attribuer des accès selon des règles définies</li>
<li><strong>manage_budget</strong> : Gérer les budgets et coûts des équipes</li>
</ul>

<h3><strong>Droits de Consultation</strong></h3>
<ul>
<li><strong>view_users</strong> : Consulter la liste des utilisateurs</li>
<li><strong>view_software</strong> : Consulter le catalogue logiciels</li>
<li><strong>view_reports_team</strong> : Voir les rapports de sa propre équipe</li>
<li><strong>view_reports_all</strong> : Voir tous les rapports de l'organisation</li>
<li><strong>view_logs</strong> : Consulter les journaux d'audit</li>
</ul>

<h2>⚖️ Niveaux de Permissions</h2>

<h3><strong>Hiérarchie des Niveaux (1-10)</strong></h3>
<ul>
<li><strong>Niveau 1-2</strong> : Consultation basique (utilisateur standard)</li>
<li><strong>Niveau 3-4</strong> : Consultation étendue (responsable d'équipe)</li>
<li><strong>Niveau 5-6</strong> : Modification limitée (gestionnaire)</li>
<li><strong>Niveau 7-8</strong> : Gestion avancée (administrateur métier)</li>
<li><strong>Niveau 9-10</strong> : Administration complète (super-admin)</li>
</ul>

<h3><strong>Profils Utilisateurs Types</strong></h3>

<h4><strong>Utilisateur Standard</strong></h4>
<ul>
<li>view_users, view_software, view_access (ses propres accès)</li>
<li><strong>Niveau max</strong> : 2</li>
</ul>

<h4><strong>Responsable d'Équipe</strong></h4>
<ul>
<li>view_reports_team, manage_access (équipe), view_users</li>
<li><strong>Niveau max</strong> : 4</li>
</ul>

<h4><strong>Gestionnaire IT</strong></h4>
<ul>
<li>manage_users, manage_software, manage_access, view_reports_all</li>
<li><strong>Niveau max</strong> : 6</li>
</ul>

<h4><strong>Super Administrateur</strong></h4>
<ul>
<li>admin_global (tous les droits)</li>
<li><strong>Niveau max</strong> : 10</li>
</ul>

<h2>⚠️ Contrôles de Sécurité</h2>

<h3><strong>Validation des Droits</strong></h3>
<ul>
<li><strong>Cohérence</strong> : Vérifier que les droits attribués sont logiques</li>
<li><strong>Niveau approprié</strong> : Le niveau correspond au rôle de l'utilisateur</li>
<li><strong>Justification</strong> : Toute attribution doit être documentée</li>
<li><strong>Révision</strong> : Contrôle périodique des droits accordés</li>
</ul>

<h3><strong>Détection des Anomalies</strong></h3>
<ul>
<li><strong>Cumul excessif</strong> : Utilisateur avec trop de droits élevés</li>
<li><strong>Droits orphelins</strong> : Utilisateur avec des droits sans justification</li>
<li><strong>Incohérence temporelle</strong> : Droits attribués récemment sans demande</li>
</ul>

<h2>💡 Bonnes Pratiques</h2>

<h3><strong>Principe du Moindre Privilège</strong></h3>
<ol>
<li><strong>Commencer minimal</strong> : Donner uniquement les droits nécessaires</li>
<li><strong>Ajouter progressivement</strong> : Étendre selon les besoins réels</li>
<li><strong>Réviser régulièrement</strong> : Retirer les droits non utilisés</li>
<li><strong>Justifier systématiquement</strong> : Documenter chaque attribution</li>
</ol>

<h3><strong>Sécurité</strong></h3>
<ol>
<li><strong>Séparer</strong> : Ne jamais concentrer tous les droits sur une personne</li>
<li><strong>Contrôler</strong> : Vérification à quatre yeux pour droits critiques</li>
<li><strong>Tracer</strong> : Tout changement doit être enregistré et justifié</li>
<li><strong>Former</strong> : Sensibiliser aux bonnes pratiques de sécurité</li>
</ol>
`
            },
            'acces': {
                title: '🔑 Accès - Attribution aux Utilisateurs',
                category: 'Gestion',
                content: `
<h1>🔑 PROCESSUS - Gestion des Accès Logiciels</h1>

<h2>🎯 Objectif</h2>
<p>Attribuer et gérer les accès des utilisateurs aux logiciels avec calcul automatique des coûts.</p>

<h2>📝 Attribution d'un Accès</h2>

<h3><strong>Informations Obligatoires</strong></h3>
<ul>
<li><strong>Utilisateur</strong> : Sélection de l'utilisateur bénéficiaire</li>
<li><strong>Logiciel</strong> : Choix du logiciel à attribuer</li>
<li><strong>Date de Début</strong> : Quand l'accès devient effectif</li>
</ul>

<h3><strong>Informations Optionnelles</strong></h3>
<ul>
<li><strong>Date de Fin</strong> : Échéance de l'accès (si temporaire)</li>
<li><strong>Commentaire</strong> : Justification ou remarques sur l'attribution</li>
<li><strong>Coût Manuel</strong> : Override du coût automatique (si négociation spéciale)</li>
</ul>

<h2>💰 Calcul Automatique des Coûts</h2>

<h3><strong>Logiciel à Coût Individuel</strong></h3>
<ul>
<li><strong>Principe</strong> : Coût = coût par licence du logiciel</li>
<li><strong>Exemple</strong> : Adobe Photoshop à 25€/mois → Accès = 25€/mois</li>
<li><strong>Application</strong> : Immédiate lors de l'attribution</li>
</ul>

<h3><strong>Logiciel à Coût Fixe</strong></h3>
<ul>
<li><strong>Principe</strong> : Coût réparti entre tous les utilisateurs ayant accès</li>
<li><strong>Calcul</strong> : Coût fixe ÷ Nombre total d'accès au logiciel</li>
<li><strong>Exemple</strong> : Serveur Adobe 1000€/mois, 20 utilisateurs → 50€/utilisateur/mois</li>
<li><strong>Recalcul</strong> : Automatique à chaque nouvelle attribution/révocation</li>
</ul>

<h3><strong>Logiciel Mixte (Fixe + Individuel)</strong></h3>
<ul>
<li><strong>Composante fixe</strong> : Répartie entre tous les utilisateurs</li>
<li><strong>Composante individuelle</strong> : Coût par licence standard</li>
<li><strong>Total</strong> : Somme des deux composantes</li>
<li><strong>Exemple</strong> : Base 500€ (10 users = 50€) + Licence 30€ → Total 80€/user</li>
</ul>

<h2>⏰ Gestion des Dates</h2>

<h3><strong>Date de Début</strong></h3>
<ul>
<li><strong>Effet immédiat</strong> : Par défaut, accès effectif à la création</li>
<li><strong>Programmation</strong> : Possibilité de programmer dans le futur</li>
<li><strong>Impact budgétaire</strong> : Coûts calculés à partir de cette date</li>
</ul>

<h3><strong>Date de Fin (Optionnelle)</strong></h3>
<ul>
<li><strong>Accès permanent</strong> : Si non renseignée, accès sans limite</li>
<li><strong>Accès temporaire</strong> : Date de révocation automatique</li>
<li><strong>Alertes</strong> : Notification avant expiration (7, 3, 1 jour)</li>
<li><strong>Prolongation</strong> : Modification possible avant échéance</li>
</ul>

<h2>🔄 Actions en Masse</h2>

<h3><strong>Attribution Multiple</strong></h3>
<ol>
<li><strong>Sélectionner</strong> plusieurs utilisateurs</li>
<li><strong>Choisir</strong> le logiciel à attribuer</li>
<li><strong>Définir</strong> les paramètres communs (dates, commentaire)</li>
<li><strong>Valider</strong> l'attribution groupée</li>
</ol>

<h3><strong>Révocation Multiple</strong></h3>
<ol>
<li><strong>Filtrer</strong> les accès à révoquer (logiciel, équipe, date)</li>
<li><strong>Sélectionner</strong> les accès concernés</li>
<li><strong>Programmer</strong> la date de révocation</li>
<li><strong>Confirmer</strong> l'action groupée</li>
</ol>

<h2>⚠️ Règles de Validation</h2>

<h3><strong>Cohérence des Dates</strong></h3>
<ul>
<li><strong>Date de début</strong> ≤ <strong>Date de fin</strong> (si renseignée)</li>
<li><strong>Date de début</strong> ≥ <strong>Date de création du logiciel</strong></li>
<li><strong>Pas de chevauchement</strong> pour le même utilisateur/logiciel</li>
</ul>

<h3><strong>Contraintes Métier</strong></h3>
<ul>
<li><strong>Utilisateur actif</strong> : Impossible d'attribuer à un utilisateur inactif</li>
<li><strong>Logiciel disponible</strong> : Le logiciel doit être actif dans le catalogue</li>
<li><strong>Budget équipe</strong> : Alerte si dépassement du budget prévu</li>
<li><strong>Droits d'attribution</strong> : Vérifier les permissions de l'utilisateur</li>
</ul>

<h2>💡 Optimisation des Accès</h2>

<h3><strong>Analyse d'Utilisation</strong></h3>
<ol>
<li><strong>Mesurer</strong> l'usage réel des logiciels</li>
<li><strong>Identifier</strong> les accès sous-utilisés</li>
<li><strong>Proposer</strong> des alternatives moins coûteuses</li>
<li><strong>Optimiser</strong> les licences selon les besoins</li>
</ol>

<h2>📋 Bonnes Pratiques</h2>

<h3><strong>Attribution Responsable</strong></h3>
<ol>
<li><strong>Justifier</strong> chaque attribution (besoin métier réel)</li>
<li><strong>Limiter dans le temps</strong> : Préférer les accès temporaires</li>
<li><strong>Commencer minimal</strong> : Logiciels gratuits puis upgrade si besoin</li>
<li><strong>Documenter</strong> : Tracer les demandes et validations</li>
</ol>

<h3><strong>Sécurité</strong></h3>
<ol>
<li><strong>Révoquer immédiatement</strong> les accès des départs</li>
<li><strong>Limiter</strong> les accès des utilisateurs externes</li>
<li><strong>Auditer</strong> les accès à privilèges élevés</li>
<li><strong>Séparer</strong> les environnements (prod/test/dev)</li>
</ol>
`
            },
            'rapports': {
                title: '📈 Rapports - Analyses et Optimisation',
                category: 'Analyse',
                content: `
<h1>📈 PROCESSUS - Rapports et Analyses</h1>

<h2>🎯 Objectif</h2>
<p>Générer des rapports détaillés et analyses financières pour optimiser la gestion des licences logiciels.</p>

<h2>📊 Types de Rapports Disponibles</h2>

<h3><strong>Rapports Financiers</strong></h3>

<h4><strong>Coûts par Logiciel</strong></h4>
<ul>
<li><strong>Contenu</strong> : Coût mensuel et annuel de chaque logiciel</li>
<li><strong>Détail</strong> : Coût fixe + coût individuel + nombre d'utilisateurs</li>
<li><strong>Tri</strong> : Par coût décroissant</li>
<li><strong>Utilité</strong> : Identifier les postes de coûts principaux</li>
</ul>

<h4><strong>Coûts par Équipe</strong></h4>
<ul>
<li><strong>Contenu</strong> : Budget alloué vs coût réel par équipe</li>
<li><strong>Calcul</strong> : Répartition des coûts fixes + coûts individuels</li>
<li><strong>Indicateurs</strong> : Taux d'utilisation, dépassement/économie</li>
<li><strong>Utilité</strong> : Pilotage budgétaire par équipe</li>
</ul>

<h4><strong>Évolution des Coûts</strong></h4>
<ul>
<li><strong>Période</strong> : Mensuelle, trimestrielle, annuelle</li>
<li><strong>Comparaison</strong> : N vs N-1 avec pourcentages d'évolution</li>
<li><strong>Décomposition</strong> : Par logiciel, équipe, catégorie</li>
<li><strong>Prévisions</strong> : Projections basées sur les tendances</li>
</ul>

<h3><strong>Rapports d'Usage</strong></h3>

<h4><strong>Utilisation par Logiciel</strong></h4>
<ul>
<li><strong>Métriques</strong> : Nombre d'utilisateurs, taux d'adoption</li>
<li><strong>Évolution</strong> : Progression des attributions dans le temps</li>
<li><strong>Répartition</strong> : Par équipe, type d'utilisateur (interne/externe)</li>
<li><strong>ROI</strong> : Coût par utilisateur actif</li>
</ul>

<h4><strong>Profils Utilisateurs</strong></h4>
<ul>
<li><strong>Analyse</strong> : Nombre d'accès par utilisateur</li>
<li><strong>Segmentation</strong> : Utilisateurs légers/moyens/lourds</li>
<li><strong>Coûts</strong> : Budget par utilisateur et par équipe</li>
<li><strong>Optimisation</strong> : Suggestions d'ajustement des accès</li>
</ul>

<h2>🎨 Visualisations Graphiques</h2>

<h3><strong>Graphiques en Secteurs</strong></h3>
<ul>
<li><strong>Répartition des coûts</strong> par logiciel</li>
<li><strong>Distribution</strong> par équipe</li>
<li><strong>Moyens de paiement</strong> utilisés</li>
<li><strong>Types d'utilisateurs</strong> (internes vs externes)</li>
</ul>

<h3><strong>Graphiques en Barres</strong></h3>
<ul>
<li><strong>Comparaison</strong> des coûts par équipe</li>
<li><strong>Évolution temporelle</strong> des budgets</li>
<li><strong>Top 10</strong> des logiciels les plus coûteux</li>
<li><strong>Nombre d'utilisateurs</strong> par logiciel</li>
</ul>

<h3><strong>Tableaux de Bord</strong></h3>
<ul>
<li><strong>KPI principaux</strong> : Coûts, utilisateurs, logiciels</li>
<li><strong>Alertes</strong> : Dépassements, échéances, anomalies</li>
<li><strong>Comparaisons</strong> : Périodes, équipes, logiciels</li>
<li><strong>Actions</strong> : Liens directs vers les pages de gestion</li>
</ul>

<h2>📤 Exports et Partage</h2>

<h3><strong>Formats d'Export</strong></h3>
<ul>
<li><strong>Excel (.xlsx)</strong> : Données détaillées avec calculs</li>
<li><strong>CSV</strong> : Données brutes pour analyse externe</li>
<li><strong>PDF</strong> : Rapports formatés pour présentation</li>
<li><strong>PowerPoint</strong> : Graphiques pour comités de direction</li>
</ul>

<h3><strong>Contenu des Exports</strong></h3>
<ul>
<li><strong>Données brutes</strong> : Tables complètes avec tous les champs</li>
<li><strong>Données agrégées</strong> : Synthèses et totaux calculés</li>
<li><strong>Graphiques</strong> : Visualisations intégrées</li>
<li><strong>Métadonnées</strong> : Date d'export, filtres appliqués, périmètre</li>
</ul>

<h2>🎯 Analyses Avancées</h2>

<h3><strong>Optimisation des Coûts</strong></h3>

<h4><strong>Détection des Doublons</strong></h4>
<ul>
<li><strong>Logiciels similaires</strong> : Même fonction, éditeurs différents</li>
<li><strong>Utilisateurs multi-équipés</strong> : Plusieurs outils pour même besoin</li>
<li><strong>Recommandations</strong> : Consolidation sur solution unique</li>
</ul>

<h4><strong>Analyse ROI</strong></h4>
<ul>
<li><strong>Coût par utilisateur actif</strong> vs prix catalogue</li>
<li><strong>Taux d'utilisation</strong> : Usage réel vs potentiel</li>
<li><strong>Alternatives</strong> : Comparaison avec solutions concurrentes</li>
<li><strong>Négociation</strong> : Leviers pour renégocier les tarifs</li>
</ul>

<h2>💡 Bonnes Pratiques d'Analyse</h2>

<h3><strong>Fréquence de Suivi</strong></h3>
<ol>
<li><strong>Quotidien</strong> : Monitoring des alertes critiques</li>
<li><strong>Hebdomadaire</strong> : Suivi des nouveaux accès et coûts</li>
<li><strong>Mensuel</strong> : Révision complète des budgets</li>
<li><strong>Trimestriel</strong> : Analyses d'optimisation approfondie</li>
</ol>

<h3><strong>Indicateurs Clés à Surveiller</strong></h3>
<ol>
<li><strong>Coût par utilisateur</strong> : Évolution et benchmarks</li>
<li><strong>Taux d'utilisation</strong> : Efficacité des investissements</li>
<li><strong>Dépassements budgétaires</strong> : Maîtrise des coûts</li>
<li><strong>ROI logiciels</strong> : Retour sur investissement</li>
</ol>

<h3><strong>Communication des Résultats</strong></h3>
<ol>
<li><strong>Dashboard executives</strong> : KPI pour direction générale</li>
<li><strong>Rapports équipes</strong> : Budgets et optimisations par équipe</li>
<li><strong>Analyses détaillées</strong> : Pour équipes IT et achats</li>
<li><strong>Alertes ciblées</strong> : Notifications selon rôles et responsabilités</li>
</ol>
`
            },
            'echeancier': {
                title: '📅 Échéancier - Planification des Paiements',
                category: 'Planning',
                content: `
<h1>📅 PROCESSUS - Gestion de l'Échéancier</h1>

<h2>🎯 Objectif</h2>
<p>Planifier et suivre toutes les échéances contractuelles des logiciels pour optimiser les renouvellements et négociations.</p>

<h2>📋 Vue d'Ensemble de l'Échéancier</h2>

<h3><strong>Affichage Principal</strong></h3>
<ul>
<li><strong>Vue calendaire</strong> : Visualisation mensuelle des échéances</li>
<li><strong>Liste chronologique</strong> : Échéances triées par date</li>
<li><strong>Mois courant</strong> : Focus sur les actions immédiates</li>
<li><strong>Mois suivants</strong> : Planification des négociations</li>
</ul>

<h3><strong>Navigation Temporelle</strong></h3>
<ul>
<li><strong>Boutons < ></strong> : Navigation mois par mois</li>
<li><strong>Vue trimestrielle</strong> : Planification à 3 mois</li>
<li><strong>Vue annuelle</strong> : Vision globale des renouvellements</li>
<li><strong>Retour aujourd'hui</strong> : Bouton de retour rapide</li>
</ul>

<h3><strong>Indicateurs Visuels</strong></h3>
<ul>
<li><strong>🔴 Urgent</strong> : Échéances dans les 7 jours</li>
<li><strong>🟠 Important</strong> : Échéances dans les 30 jours</li>
<li><strong>🟡 À prévoir</strong> : Échéances dans les 90 jours</li>
<li><strong>🟢 Planifié</strong> : Échéances > 90 jours</li>
</ul>

<h2>📝 Informations par Échéance</h2>

<h3><strong>Détails Contractuels</strong></h3>
<ul>
<li><strong>Logiciel</strong> : Nom et version du logiciel</li>
<li><strong>Éditeur</strong> : Société fournisseur</li>
<li><strong>Date d'échéance</strong> : Date de renouvellement/résiliation</li>
<li><strong>Type de contrat</strong> : Abonnement, licence, maintenance</li>
<li><strong>Durée d'engagement</strong> : Période contractuelle (mois/années)</li>
</ul>

<h3><strong>Informations Financières</strong></h3>
<ul>
<li><strong>Coût mensuel</strong> : Montant récurrent</li>
<li><strong>Coût annuel</strong> : Budget total sur 12 mois</li>
<li><strong>Évolution tarifaire</strong> : Augmentation prévue (+%)</li>
<li><strong>Moyen de paiement</strong> : CB, prélèvement, virement</li>
<li><strong>Conditions de résiliation</strong> : Préavis, pénalités</li>
</ul>

<h3><strong>Impact Organisationnel</strong></h3>
<ul>
<li><strong>Nombre d'utilisateurs</strong> : Personnes concernées</li>
<li><strong>Équipes utilisatrices</strong> : Répartition par service</li>
<li><strong>Criticité</strong> : Impact business (faible/moyen/élevé)</li>
<li><strong>Alternatives</strong> : Solutions de remplacement identifiées</li>
</ul>

<h2>🔄 Actions sur les Échéances</h2>

<h3><strong>Renouvellement</strong></h3>

<h4><strong>Processus Standard</strong></h4>
<ol>
<li><strong>Révision</strong> : Analyser l'usage et les besoins actuels</li>
<li><strong>Négociation</strong> : Contacts éditeur 60-90 jours avant</li>
<li><strong>Validation</strong> : Approbation budget et conditions</li>
<li><strong>Signature</strong> : Nouveau contrat ou avenant</li>
<li><strong>Mise à jour</strong> : Report de la prochaine échéance</li>
</ol>

<h4><strong>Points de Négociation</strong></h4>
<ul>
<li><strong>Tarifs</strong> : Remise volume, fidélité, multi-produits</li>
<li><strong>Durée</strong> : Engagement plus long = meilleur prix</li>
<li><strong>Fonctionnalités</strong> : Modules optionnels, versions</li>
<li><strong>Support</strong> : Niveau de service inclus</li>
</ul>

<h3><strong>Résiliation</strong></h3>

<h4><strong>Motifs de Résiliation</strong></h4>
<ul>
<li><strong>Sous-utilisation</strong> : Logiciel peu/pas utilisé</li>
<li><strong>Alternative trouvée</strong> : Solution moins coûteuse</li>
<li><strong>Changement organisationnel</strong> : Évolution des besoins</li>
<li><strong>Problème qualité</strong> : Insatisfaction utilisateurs</li>
</ul>

<h4><strong>Procédure de Résiliation</strong></h4>
<ol>
<li><strong>Préavis</strong> : Respect des délais contractuels (30-90j)</li>
<li><strong>Documentation</strong> : Notification écrite à l'éditeur</li>
<li><strong>Transition</strong> : Plan de migration vers alternative</li>
<li><strong>Archivage</strong> : Sauvegarde données, documentation</li>
<li><strong>Clôture</strong> : Confirmation arrêt facturation</li>
</ol>

<h2>📊 Planification Budgétaire</h2>

<h3><strong>Projection des Coûts</strong></h3>
<ul>
<li><strong>Renouvellements certains</strong> : Contrats à reconduire</li>
<li><strong>Augmentations prévues</strong> : Inflation, nouvelles versions</li>
<li><strong>Nouveaux besoins</strong> : Logiciels à ajouter</li>
<li><strong>Économies espérées</strong> : Résiliations, renégociations</li>
</ul>

<h3><strong>Répartition Temporelle</strong></h3>
<ul>
<li><strong>T1</strong> : Échéances janvier-mars avec budgets</li>
<li><strong>T2</strong> : Échéances avril-juin et projections</li>
<li><strong>T3</strong> : Échéances juillet-septembre</li>
<li><strong>T4</strong> : Échéances octobre-décembre</li>
</ul>

<h2>🚨 Alertes et Notifications</h2>

<h3><strong>Échéances Critiques</strong></h3>
<ul>
<li><strong>J-90</strong> : Début des négociations</li>
<li><strong>J-60</strong> : Relance si pas de contact éditeur</li>
<li><strong>J-30</strong> : Alerte urgente, décision obligatoire</li>
<li><strong>J-7</strong> : Alerte critique, renouvellement automatique</li>
</ul>

<h3><strong>Destinataires des Alertes</strong></h3>
<ul>
<li><strong>Gestionnaire IT</strong> : Toutes les échéances</li>
<li><strong>Responsable budgets</strong> : Impacts financiers > seuil</li>
<li><strong>Responsables équipes</strong> : Logiciels de leur périmètre</li>
<li><strong>Direction</strong> : Contrats stratégiques ou > 10k€</li>
</ul>

<h2>📈 Optimisation des Renouvellements</h2>

<h3><strong>Stratégies d'Optimisation</strong></h3>

<h4><strong>Consolidation</strong></h4>
<ul>
<li><strong>Regroupement éditeurs</strong> : Négociation globale</li>
<li><strong>Rationalisation</strong> : Éliminer les doublons</li>
<li><strong>Standardisation</strong> : Moins d'outils, plus d'utilisateurs</li>
<li><strong>Centralisation achats</strong> : Economies d'échelle</li>
</ul>

<h4><strong>Alternatives</strong></h4>
<ul>
<li><strong>Solutions open source</strong> : Évaluation systématique</li>
<li><strong>Concurrents</strong> : Comparaison fonctionnel/prix</li>
<li><strong>Solutions intégrées</strong> : Remplacer plusieurs outils</li>
<li><strong>Développement interne</strong> : ROI vs achat externe</li>
</ul>

<h2>💡 Bonnes Pratiques</h2>

<h3><strong>Anticipation</strong></h3>
<ol>
<li><strong>Commencer tôt</strong> : Négociations 3-6 mois avant</li>
<li><strong>Préparer alternatives</strong> : Solutions de remplacement</li>
<li><strong>Documenter l'usage</strong> : Statistiques objectives</li>
<li><strong>Planifier budget</strong> : Enveloppe négociée à l'avance</li>
</ol>

<h3><strong>Négociation</strong></h3>
<ol>
<li><strong>Grouper les achats</strong> : Négociation globale</li>
<li><strong>Jouer la concurrence</strong> : Alternatives crédibles</li>
<li><strong>Valoriser fidélité</strong> : Ancienneté relation</li>
<li><strong>Négocier services</strong> : Pas seulement le prix</li>
</ol>
`
            },
            'logs': {
                title: '🔍 Logs & Audit - Traçabilité Complète',
                category: 'Audit',
                content: `
<h1>🔍 PROCESSUS - Logs et Audit</h1>

<h2>🎯 Objectif</h2>
<p>Assurer la traçabilité complète des actions dans l'application pour la conformité, la sécurité et l'analyse.</p>

<h2>📋 Types de Logs Collectés</h2>

<h3><strong>Logs d'Authentification</strong></h3>
<ul>
<li><strong>Connexions</strong> : Tentatives réussies et échouées</li>
<li><strong>Déconnexions</strong> : Fin de session normale ou timeout</li>
<li><strong>Changements d'utilisateur</strong> : Bascule entre comptes</li>
<li><strong>Échecs répétés</strong> : Détection tentatives de piratage</li>
</ul>

<h3><strong>Logs de Gestion des Données</strong></h3>

<h4><strong>Utilisateurs</strong></h4>
<ul>
<li><strong>Création</strong> : Nouveaux utilisateurs avec détails</li>
<li><strong>Modification</strong> : Changements de profil, équipe, statut</li>
<li><strong>Archivage</strong> : Suppression logique avec justification</li>
<li><strong>Restauration</strong> : Réactivation d'utilisateurs archivés</li>
</ul>

<h4><strong>Logiciels</strong></h4>
<ul>
<li><strong>Ajout</strong> : Nouveaux logiciels au catalogue</li>
<li><strong>Modification</strong> : Changements de coûts, conditions</li>
<li><strong>Suppression</strong> : Retrait du catalogue</li>
<li><strong>Mise à jour contractuelle</strong> : Renouvellements, résiliations</li>
</ul>

<h4><strong>Accès</strong></h4>
<ul>
<li><strong>Attribution</strong> : Nouveaux accès accordés</li>
<li><strong>Révocation</strong> : Retrait d'accès avec motif</li>
<li><strong>Modification</strong> : Changement dates, coûts, conditions</li>
<li><strong>Prolongation</strong> : Extensions d'accès temporaires</li>
</ul>

<h3><strong>Logs Administratifs</strong></h3>
<ul>
<li><strong>Configuration</strong> : Modifications paramètres système</li>
<li><strong>Droits</strong> : Attribution/révocation permissions</li>
<li><strong>Import/Export</strong> : Transferts de données en masse</li>
<li><strong>Maintenance</strong> : Actions techniques et corrections</li>
</ul>

<h2>🔍 Interface de Consultation</h2>

<h3><strong>Filtres de Recherche</strong></h3>

<h4><strong>Par Période</strong></h4>
<ul>
<li><strong>Plage libre</strong> : Date début et fin personnalisées</li>
<li><strong>Périodes prédéfinies</strong> : Aujourd'hui, cette semaine, ce mois</li>
<li><strong>Temps réel</strong> : Dernières heures avec actualisation auto</li>
<li><strong>Historique</strong> : Accès archives selon rétention</li>
</ul>

<h4><strong>Par Utilisateur</strong></h4>
<ul>
<li><strong>Utilisateur spécifique</strong> : Actions d'une personne</li>
<li><strong>Équipe</strong> : Actions des membres d'une équipe</li>
<li><strong>Rôle</strong> : Administrateurs, gestionnaires, utilisateurs</li>
<li><strong>Utilisateurs externes</strong> : Actions visiteurs/prestataires</li>
</ul>

<h4><strong>Par Action</strong></h4>
<ul>
<li><strong>Type d'opération</strong> : CREATE, UPDATE, DELETE, LOGIN</li>
<li><strong>Module</strong> : Utilisateurs, Logiciels, Accès, Rapports</li>
<li><strong>Niveau de criticité</strong> : INFO, WARN, ERROR, CRITICAL</li>
<li><strong>Statut</strong> : Succès, échec, en cours</li>
</ul>

<h3><strong>Affichage des Résultats</strong></h3>
<ul>
<li><strong>Liste chronologique</strong> : Tri par date décroissante</li>
<li><strong>Détails complets</strong> : Qui, quoi, quand, où, pourquoi</li>
<li><strong>Pagination</strong> : Navigation par pages de 50/100 entrées</li>
<li><strong>Export</strong> : Téléchargement CSV/Excel pour analyse</li>
</ul>

<h2>📊 Informations Tracées</h2>

<h3><strong>Métadonnées Système</strong></h3>
<ul>
<li><strong>Horodatage</strong> : Date/heure précise (millisecondes)</li>
<li><strong>ID Session</strong> : Identifiant unique de session utilisateur</li>
<li><strong>Adresse IP</strong> : Localisation réseau de l'action</li>
<li><strong>User Agent</strong> : Navigateur et OS utilisés</li>
<li><strong>ID Transaction</strong> : Référence unique de l'opération</li>
</ul>

<h3><strong>Contexte Utilisateur</strong></h3>
<ul>
<li><strong>Utilisateur actif</strong> : Nom/ID de la personne connectée</li>
<li><strong>Rôle/Droits</strong> : Permissions au moment de l'action</li>
<li><strong>Équipe</strong> : Équipe d'appartenance de l'utilisateur</li>
<li><strong>Délégation</strong> : Si action pour le compte d'un autre</li>
</ul>

<h3><strong>Détails de l'Action</strong></h3>
<ul>
<li><strong>Type d'opération</strong> : Nature précise de l'action</li>
<li><strong>Ressource cible</strong> : Objet modifié (utilisateur, logiciel, etc.)</li>
<li><strong>Valeurs avant/après</strong> : État avant et après modification</li>
<li><strong>Justification</strong> : Commentaire ou motif saisi</li>
<li><strong>Résultat</strong> : Succès, erreur avec code/message</li>
</ul>

<h2>🚨 Détection d'Anomalies</h2>

<h3><strong>Patterns Suspects</strong></h3>

<h4><strong>Activité Inhabituelle</strong></h4>
<ul>
<li><strong>Volume élevé</strong> : Nombreuses actions en peu de temps</li>
<li><strong>Horaires atypiques</strong> : Connexions nuit/weekend</li>
<li><strong>Géolocalisation</strong> : Connexions depuis pays inhabituels</li>
<li><strong>Simultanéité</strong> : Même utilisateur, lieux différents</li>
</ul>

<h4><strong>Actions Sensibles</strong></h4>
<ul>
<li><strong>Modifications en masse</strong> : Changements multiples rapides</li>
<li><strong>Élévation de privilèges</strong> : Attribution droits élevés</li>
<li><strong>Accès données sensibles</strong> : Consultation rapports confidentiels</li>
<li><strong>Suppressions groupées</strong> : Archivages multiples</li>
</ul>

<h3><strong>Alertes Automatiques</strong></h3>

<h4><strong>Seuils Configurables</strong></h4>
<ul>
<li><strong>Nombre d'actions/heure</strong> : Limite par utilisateur</li>
<li><strong>Échecs de connexion</strong> : Tentatives répétées</li>
<li><strong>Modifications critiques</strong> : Coûts, contrats, droits</li>
<li><strong>Accès non autorisés</strong> : Tentatives sur ressources interdites</li>
</ul>

<h4><strong>Notification des Alertes</strong></h4>
<ul>
<li><strong>Temps réel</strong> : Email/SMS pour alertes critiques</li>
<li><strong>Tableau de bord</strong> : Indicateur visuel d'anomalies</li>
<li><strong>Rapport quotidien</strong> : Synthèse des événements suspects</li>
<li><strong>Escalade</strong> : Notification hiérarchique selon gravité</li>
</ul>

<h2>🔐 Sécurité et Conformité</h2>

<h3><strong>Protection des Logs</strong></h3>
<ul>
<li><strong>Chiffrement</strong> : Stockage sécurisé des données</li>
<li><strong>Intégrité</strong> : Hash pour détecter modifications</li>
<li><strong>Sauvegarde</strong> : Copies multiples sécurisées</li>
<li><strong>Accès restreint</strong> : Consultation limitée aux habilités</li>
</ul>

<h3><strong>Conformité Réglementaire</strong></h3>

<h4><strong>RGPD</strong></h4>
<ul>
<li><strong>Consentement</strong> : Traçabilité des acceptations</li>
<li><strong>Droit à l'oubli</strong> : Logs des suppressions données</li>
<li><strong>Portabilité</strong> : Exports conformes demandes</li>
<li><strong>Pseudonymisation</strong> : Masquage données sensibles</li>
</ul>

<h4><strong>Audit Financier</strong></h4>
<ul>
<li><strong>Traçabilité</strong> : Toutes modifications coûts/contrats</li>
<li><strong>Approbations</strong> : Validation hiérarchique tracée</li>
<li><strong>Justifications</strong> : Motifs documentés obligatoires</li>
<li><strong>Réconciliation</strong> : Cohérence avec systèmes externes</li>
</ul>

<h2>💡 Bonnes Pratiques</h2>

<h3><strong>Collecte des Logs</strong></h3>
<ol>
<li><strong>Systématique</strong> : Logger toutes actions sensibles</li>
<li><strong>Détaillée</strong> : Information suffisante pour reconstituer</li>
<li><strong>Structurée</strong> : Format standard pour analyses</li>
<li><strong>Temps réel</strong> : Enregistrement immédiat des actions</li>
</ol>

<h3><strong>Consultation</strong></h3>
<ol>
<li><strong>Objectif clair</strong> : Savoir quoi chercher avant recherche</li>
<li><strong>Filtres précis</strong> : Affiner pour éviter surcharge</li>
<li><strong>Période limitée</strong> : Commencer par plage restreinte</li>
<li><strong>Documentation</strong> : Noter résultats investigations</li>
</ol>

<h3><strong>Conformité</strong></h3>
<ol>
<li><strong>Politique claire</strong> : Documenter objectifs et durées</li>
<li><strong>Contrôles réguliers</strong> : Vérification respect procédures</li>
<li><strong>Formation équipes</strong> : Sensibilisation enjeux légaux</li>
<li><strong>Audit externe</strong> : Validation indépendante périodique</li>
</ol>
`
            },
            'documentation': {
                title: '📚 Documentation - Vue d\'Ensemble',
                category: 'Guide',
                content: `
<h1>📚 PROCESSUS - Documentation Complète</h1>

<h2>🎯 Objectif de cette Documentation</h2>
<p>Cette section centralise tous les processus métier de l'application de gestion des accès logiciels. Chaque processus explique en détail comment utiliser chaque fonctionnalité, remplir les champs et optimiser votre gestion.</p>

<h2>📋 Liste des Processus Disponibles</h2>

<h3><strong>1. 📊 Dashboard - Tableau de Bord</strong></h3>
<ul>
<li><strong>Utilité</strong> : Vue d'ensemble des métriques clés</li>
<li><strong>Contenu</strong> : Statistiques, Top 3, graphiques financiers</li>
<li><strong>Utilisateurs</strong> : Tous, vision globale de l'organisation</li>
<li><strong>Fréquence</strong> : Consultation quotidienne recommandée</li>
</ul>

<h3><strong>2. 👥 Utilisateurs - Gestion des Personnes</strong></h3>
<ul>
<li><strong>Utilité</strong> : Créer, modifier, gérer les utilisateurs</li>
<li><strong>Contenu</strong> : Champs obligatoires, actions en masse, recherche</li>
<li><strong>Utilisateurs</strong> : Administrateurs, gestionnaires RH/IT</li>
<li><strong>Fréquence</strong> : Selon arrivées/départs et réorganisations</li>
</ul>

<h3><strong>3. 🏢 Équipes - Organisation et Budgets</strong></h3>
<ul>
<li><strong>Utilité</strong> : Structurer en équipes avec budgets alloués</li>
<li><strong>Contenu</strong> : Création équipes, répartition coûts, suivi budgets</li>
<li><strong>Utilisateurs</strong> : Responsables budgets, managers d'équipes</li>
<li><strong>Fréquence</strong> : Révision mensuelle des coûts et budgets</li>
</ul>

<h3><strong>4. 💻 Logiciels - Catalogue et Coûts</strong></h3>
<ul>
<li><strong>Utilité</strong> : Gérer le catalogue complet des logiciels</li>
<li><strong>Contenu</strong> : Coûts fixes/individuels, contrats, échéances</li>
<li><strong>Utilisateurs</strong> : Gestionnaires IT, responsables achats</li>
<li><strong>Fréquence</strong> : Mise à jour lors nouveaux logiciels/renouvellements</li>
</ul>

<h3><strong>5. 🛡️ Droits - Permissions et Sécurité</strong></h3>
<ul>
<li><strong>Utilité</strong> : Définir qui peut faire quoi dans l'application</li>
<li><strong>Contenu</strong> : Niveaux de permissions, profils utilisateurs</li>
<li><strong>Utilisateurs</strong> : Administrateurs système uniquement</li>
<li><strong>Fréquence</strong> : Révision lors changements organisationnels</li>
</ul>

<h3><strong>6. 🔑 Accès - Attribution aux Utilisateurs</strong></h3>
<ul>
<li><strong>Utilité</strong> : Donner/retirer accès logiciels aux utilisateurs</li>
<li><strong>Contenu</strong> : Attribution, calcul coûts, actions en masse</li>
<li><strong>Utilisateurs</strong> : Gestionnaires IT, responsables d'équipes</li>
<li><strong>Fréquence</strong> : Quotidienne selon demandes et départs</li>
</ul>

<h3><strong>7. 📈 Rapports - Analyses et Optimisation</strong></h3>
<ul>
<li><strong>Utilité</strong> : Générer analyses financières et d'usage</li>
<li><strong>Contenu</strong> : Coûts, ROI, projections, exports</li>
<li><strong>Utilisateurs</strong> : Direction, contrôleurs de gestion, IT</li>
<li><strong>Fréquence</strong> : Mensuel pour suivi, trimestriel pour optimisation</li>
</ul>

<h3><strong>8. 📅 Échéancier - Renouvellements Contrats</strong></h3>
<ul>
<li><strong>Utilité</strong> : Planifier renouvellements et négociations</li>
<li><strong>Contenu</strong> : Échéances, alertes, stratégies négociation</li>
<li><strong>Utilisateurs</strong> : Responsables achats, gestionnaires contrats</li>
<li><strong>Fréquence</strong> : Suivi continu, actions selon échéances</li>
</ul>

<h3><strong>9. 🔍 Logs & Audit - Traçabilité Complète</strong></h3>
<ul>
<li><strong>Utilité</strong> : Auditer toutes les actions pour conformité</li>
<li><strong>Contenu</strong> : Consultation logs, détection anomalies</li>
<li><strong>Utilisateurs</strong> : Auditeurs, responsables sécurité/conformité</li>
<li><strong>Fréquence</strong> : Surveillance continue, rapports périodiques</li>
</ul>

<h2>🚀 Parcours de Formation Recommandé</h2>

<h3><strong>Pour les Nouveaux Utilisateurs</strong></h3>
<ol>
<li><strong>Commencer par</strong> : Dashboard (vision globale)</li>
<li><strong>Puis</strong> : Utilisateurs (comprendre la base)</li>
<li><strong>Ensuite</strong> : Équipes (organisation)</li>
<li><strong>Enfin</strong> : Accès (attribution selon son rôle)</li>
</ol>

<h3><strong>Pour les Gestionnaires IT</strong></h3>
<ol>
<li><strong>Logiciels</strong> : Maîtriser le catalogue et coûts</li>
<li><strong>Accès</strong> : Attribution et gestion quotidienne</li>
<li><strong>Rapports</strong> : Analyses pour optimisation</li>
<li><strong>Échéancier</strong> : Planification renouvellements</li>
</ol>

<h3><strong>Pour les Responsables Budgets</strong></h3>
<ol>
<li><strong>Dashboard</strong> : Métriques financières clés</li>
<li><strong>Équipes</strong> : Répartition et suivi budgets</li>
<li><strong>Rapports</strong> : Analyses coûts et ROI</li>
<li><strong>Échéancier</strong> : Impact budgétaire futur</li>
</ol>

<h2>🎯 Objectifs Métier par Processus</h2>

<h3><strong>Efficacité Opérationnelle</strong></h3>
<ul>
<li><strong>Utilisateurs</strong> : Gestion centralisée des personnes</li>
<li><strong>Équipes</strong> : Organisation claire et budgets maîtrisés</li>
<li><strong>Accès</strong> : Attribution rapide et traçée</li>
</ul>

<h3><strong>Optimisation Financière</strong></h3>
<ul>
<li><strong>Logiciels</strong> : Catalogue optimisé et coûts maîtrisés</li>
<li><strong>Rapports</strong> : Analyses pour réduction coûts</li>
<li><strong>Échéancier</strong> : Négociations préparées et planifiées</li>
</ul>

<h3><strong>Conformité et Sécurité</strong></h3>
<ul>
<li><strong>Droits</strong> : Permissions appropriées et limitées</li>
<li><strong>Logs & Audit</strong> : Traçabilité complète des actions</li>
<li><strong>Dashboard</strong> : Surveillance temps réel des métriques</li>
</ul>

<h2>💡 Conseils d'Utilisation Optimale</h2>

<h3><strong>Fréquence de Mise à Jour</strong></h3>
<ol>
<li><strong>Quotidien</strong> : Dashboard, nouveaux accès, alertes</li>
<li><strong>Hebdomadaire</strong> : Utilisateurs, révision accès temporaires</li>
<li><strong>Mensuel</strong> : Budgets équipes, rapports de coûts</li>
<li><strong>Trimestriel</strong> : Optimisation catalogue, révision droits</li>
</ol>

<h3><strong>Qualité des Données</strong></h3>
<ol>
<li><strong>Exhaustivité</strong> : Renseigner tous les champs importants</li>
<li><strong>Précision</strong> : Vérifier coûts et dates régulièrement</li>
<li><strong>Cohérence</strong> : Harmoniser noms équipes/logiciels</li>
<li><strong>Actualisation</strong> : Mettre à jour lors des changements</li>
</ol>

<p><strong>🎯 L'objectif est que chaque utilisateur maîtrise parfaitement les processus de son périmètre pour maximiser la valeur de l'outil et optimiser la gestion des licences logiciels de l'organisation.</strong></p>
`
            }
        };
    }

    /**
     * 🏁 Initialisation du système
     */
    init() {
        console.log('🚀 [HardcodedProcesses] Initialisation des processus en dur');

        try {
            // Générer le menu
            this.generateMenu();
            
            console.log(`✅ [HardcodedProcesses] ${Object.keys(this.processes).length} processus chargés`);
            return true;
            
        } catch (error) {
            console.error('❌ [HardcodedProcesses] Erreur d\'initialisation:', error);
            return false;
        }
    }

    /**
     * 🎨 Génération du menu des processus
     */
    generateMenu() {
        const menuContainer = document.getElementById('process-menu-container');
        
        if (!menuContainer) {
            console.error('❌ [HardcodedProcesses] Conteneur menu non trouvé');
            return;
        }
        
        // Vider le menu existant
        menuContainer.innerHTML = '';
        
        // Données pour les boutons
        const processButtons = [
            { id: 'dashboard', icon: 'fas fa-tachometer-alt', color: 'blue', title: 'Dashboard' },
            { id: 'utilisateurs', icon: 'fas fa-users', color: 'green', title: 'Utilisateurs' },
            { id: 'equipes', icon: 'fas fa-users-cog', color: 'purple', title: 'Équipes' },
            { id: 'logiciels', icon: 'fas fa-laptop', color: 'orange', title: 'Logiciels' },
            { id: 'droits', icon: 'fas fa-shield-alt', color: 'red', title: 'Droits' },
            { id: 'acces', icon: 'fas fa-key', color: 'indigo', title: 'Accès' },
            { id: 'rapports', icon: 'fas fa-chart-line', color: 'pink', title: 'Rapports' },
            { id: 'echeancier', icon: 'fas fa-calendar-alt', color: 'teal', title: 'Échéancier' },
            { id: 'logs', icon: 'fas fa-search', color: 'gray', title: 'Logs & Audit' },
            { id: 'documentation', icon: 'fas fa-book-open', color: 'yellow', title: 'Documentation' }
        ];
        
        // Créer les boutons
        processButtons.forEach(button => {
            const buttonEl = document.createElement('button');
            buttonEl.className = `process-menu-btn flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-lg hover:bg-${button.color}-50 transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-${button.color}-200 hover:shadow-sm`;
            
            buttonEl.innerHTML = `
                <div class="text-${button.color}-600 text-lg mb-1">
                    <i class="${button.icon}"></i>
                </div>
                <span class="text-xs font-medium text-gray-700 whitespace-nowrap">${button.title}</span>
            `;
            
            // Event listener
            buttonEl.addEventListener('click', () => this.showProcess(button.id));
            
            menuContainer.appendChild(buttonEl);
        });
        
        console.log(`✅ [HardcodedProcesses] Menu généré avec ${processButtons.length} boutons`);
    }

    /**
     * 📄 Affichage d'un processus
     */
    showProcess(processId) {
        console.log(`📄 [HardcodedProcesses] Affichage du processus: ${processId}`);
        
        const process = this.processes[processId];
        if (!process) {
            console.error(`❌ [HardcodedProcesses] Processus non trouvé: ${processId}`);
            return;
        }

        // Mettre à jour l'état actuel
        this.currentProcess = processId;
        
        // Mettre à jour l'apparence des boutons
        this.updateMenuButtons(processId);
        
        // Afficher le contenu
        this.renderProcessContent(process);
    }

    /**
     * 🎨 Mise à jour visuelle des boutons de menu
     */
    updateMenuButtons(activeProcessId) {
        const buttons = document.querySelectorAll('.process-menu-btn');
        const processIds = Object.keys(this.processes);
        
        buttons.forEach((button, index) => {
            const processId = processIds[index];
            const isActive = processId === activeProcessId;
            
            if (isActive) {
                button.classList.add('bg-blue-100', 'border-blue-300');
            } else {
                button.classList.remove('bg-blue-100', 'border-blue-300');
            }
        });
    }

    /**
     * 🖥️ Rendu du contenu d'un processus
     */
    renderProcessContent(process) {
        const contentArea = document.getElementById('process-content-area');
        
        if (!contentArea) {
            console.error('❌ [HardcodedProcesses] Zone de contenu non trouvée');
            return;
        }
        
        contentArea.innerHTML = `
            <div class="process-document">
                <!-- En-tête du processus -->
                <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900 mb-2">${process.title}</h1>
                        <span class="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                            ${process.category}
                        </span>
                    </div>
                    <div class="text-sm text-gray-500">
                        ✅ Processus intégré
                    </div>
                </div>
                
                <!-- Contenu du processus -->
                <div class="process-content prose prose-lg max-w-none">
                    ${process.content}
                </div>
            </div>
        `;
        
        console.log(`✅ [HardcodedProcesses] Contenu affiché pour: ${process.title}`);
    }
}

// 🌍 Instance globale
window.hardcodedProcesses = new HardcodedProcesses();

// 🔗 Fonction globale pour compatibilité
window.showProcessInline = (processId) => {
    if (window.hardcodedProcesses) {
        window.hardcodedProcesses.showProcess(processId);
    }
};

// 🚀 Auto-initialisation quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.hardcodedProcesses) {
            const processView = document.getElementById('process-view');
            if (processView && !processView.classList.contains('hidden')) {
                window.hardcodedProcesses.init();
            }
        }
    }, 500);
});

// 🔍 Observer les clics pour initialiser quand nécessaire
document.addEventListener('click', (e) => {
    if (e.target && (e.target.id === 'nav-process' || e.target.id === 'mobile-nav-process')) {
        setTimeout(() => {
            if (window.hardcodedProcesses) {
                window.hardcodedProcesses.init();
            }
        }, 300);
    }
});

console.log('✅ [HardcodedProcesses] Module chargé - 10 processus en dur disponibles');