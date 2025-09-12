-- Ajouter la colonne pour les logiciels à coût fixe
-- Exécuter ce script dans Supabase SQL Editor

-- Ajouter la colonne cout_fixe (booléen)
ALTER TABLE logiciels ADD COLUMN cout_fixe BOOLEAN DEFAULT FALSE;

-- Ajouter la colonne cout_fixe_mensuel (décimal pour le coût mensuel fixe)
ALTER TABLE logiciels ADD COLUMN cout_fixe_mensuel DECIMAL(10,2) DEFAULT 0;

-- Commentaires pour documentation
COMMENT ON COLUMN logiciels.cout_fixe IS 'Indique si le logiciel a un coût fixe (true) ou un coût basé sur les accès (false)';
COMMENT ON COLUMN logiciels.cout_fixe_mensuel IS 'Coût mensuel fixe du logiciel si cout_fixe = true';

-- Index pour optimiser les requêtes sur les logiciels à coût fixe
CREATE INDEX idx_logiciels_cout_fixe ON logiciels(cout_fixe) WHERE cout_fixe = TRUE;