-- Script simple pour ajouter la colonne application_shopify
-- Exécutez ceci dans votre Dashboard Supabase > SQL Editor

-- 1. Ajouter la colonne application_shopify
ALTER TABLE logiciels 
ADD COLUMN IF NOT EXISTS application_shopify BOOLEAN DEFAULT FALSE;

-- 2. Ajouter un commentaire
COMMENT ON COLUMN logiciels.application_shopify IS 'Indique si le logiciel est une application Shopify';

-- 3. Créer un index pour les performances
CREATE INDEX IF NOT EXISTS idx_logiciels_application_shopify ON logiciels(application_shopify);

-- 4. Vérifier que ça a fonctionné
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'logiciels' 
  AND table_schema = 'public' 
  AND column_name = 'application_shopify';