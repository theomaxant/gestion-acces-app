-- Ajout des champs d'engagement pour la table logiciels
-- Cette requête ajoute les colonnes pour gérer les engagements contractuels

-- Ajouter la colonne engagement (boolean)
ALTER TABLE logiciels 
ADD COLUMN engagement BOOLEAN DEFAULT FALSE;

-- Ajouter la colonne date_fin_contrat (date d'expiration du contrat)
ALTER TABLE logiciels 
ADD COLUMN date_fin_contrat DATE;

-- Ajouter la colonne date_limite_annulation (dernier délai pour annuler)
ALTER TABLE logiciels 
ADD COLUMN date_limite_annulation DATE;

-- Ajouter des commentaires pour documenter les colonnes
COMMENT ON COLUMN logiciels.engagement IS 'Indique si le logiciel a un engagement contractuel';
COMMENT ON COLUMN logiciels.date_fin_contrat IS 'Date de fin du contrat d''engagement';
COMMENT ON COLUMN logiciels.date_limite_annulation IS 'Date limite pour annuler le contrat avant reconduction';

-- Index pour améliorer les performances lors des requêtes sur les dates d'engagement
CREATE INDEX idx_logiciels_engagement ON logiciels(engagement) WHERE engagement = TRUE;
CREATE INDEX idx_logiciels_date_fin_contrat ON logiciels(date_fin_contrat) WHERE date_fin_contrat IS NOT NULL;
CREATE INDEX idx_logiciels_date_limite_annulation ON logiciels(date_limite_annulation) WHERE date_limite_annulation IS NOT NULL;