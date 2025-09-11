-- Script SQL pour corriger la table logs dans Supabase
-- Exécutez ce script dans le SQL Editor de votre Dashboard Supabase

-- Vérifier la structure actuelle de la table logs
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'logs' 
-- ORDER BY ordinal_position;

-- Ajouter les colonnes manquantes à la table logs
ALTER TABLE logs 
ADD COLUMN IF NOT EXISTS old_values TEXT,
ADD COLUMN IF NOT EXISTS new_values TEXT;

-- Vérifier que les colonnes ont été ajoutées
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'logs' 
ORDER BY ordinal_position;

-- Optionnel : Ajouter des commentaires sur les colonnes
COMMENT ON COLUMN logs.old_values IS 'Anciennes valeurs (JSON) avant modification';
COMMENT ON COLUMN logs.new_values IS 'Nouvelles valeurs (JSON) après modification';