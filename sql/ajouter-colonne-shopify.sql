-- Script pour ajouter la colonne application_shopify à la table logiciels
-- Exécutez ceci dans votre Dashboard Supabase > SQL Editor

-- 1. Vérifier si la colonne existe déjà
SELECT 'Vérification de l''existence de la colonne application_shopify:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'logiciels' 
  AND table_schema = 'public' 
  AND column_name = 'application_shopify';

-- 2. Ajouter la colonne application_shopify si elle n'existe pas
-- Version simplifiée qui fonctionne avec Supabase
ALTER TABLE logiciels 
ADD COLUMN IF NOT EXISTS application_shopify BOOLEAN DEFAULT FALSE;

-- 3. Ajouter un commentaire sur la nouvelle colonne
COMMENT ON COLUMN logiciels.application_shopify IS 'Indique si le logiciel est une application Shopify (e-commerce)';

-- 4. Créer un index pour améliorer les performances des filtres
CREATE INDEX IF NOT EXISTS idx_logiciels_application_shopify ON logiciels(application_shopify);

-- 5. Vérifier la structure finale de la table
SELECT 'Structure finale de la table logiciels:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'logiciels' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 6. Statistiques sur les applications Shopify
SELECT 'Statistiques des applications Shopify:' as info;
SELECT 
    application_shopify,
    COUNT(*) as nombre_logiciels,
    ROUND((COUNT(*) * 100.0 / SUM(COUNT(*)) OVER()), 2) as pourcentage
FROM logiciels 
GROUP BY application_shopify
ORDER BY application_shopify DESC;

-- 7. Exemples de requêtes utiles
SELECT '--- EXEMPLES DE REQUETES UTILES ---' as info;

-- Lister toutes les applications Shopify
-- SELECT * FROM logiciels WHERE application_shopify = TRUE;

-- Lister les logiciels non-Shopify
-- SELECT * FROM logiciels WHERE application_shopify = FALSE OR application_shopify IS NULL;

-- Compter les applications Shopify par équipe
-- SELECT 
--     e.nom as equipe,
--     COUNT(l.id) as nb_apps_shopify
-- FROM logiciels l
-- JOIN equipes e ON l.equipe_id = e.id
-- WHERE l.application_shopify = TRUE
-- GROUP BY e.nom
-- ORDER BY nb_apps_shopify DESC;

SELECT 'Script terminé avec succès ! Vous pouvez maintenant utiliser le filtre Application Shopify.' as result;