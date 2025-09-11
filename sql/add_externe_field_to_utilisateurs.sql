-- Ajout du champ externe pour la table utilisateurs
-- Cette requête ajoute la colonne pour identifier les utilisateurs externes

-- Ajouter la colonne externe (boolean)
ALTER TABLE utilisateurs 
ADD COLUMN externe BOOLEAN DEFAULT FALSE;

-- Ajouter un commentaire pour documenter la colonne
COMMENT ON COLUMN utilisateurs.externe IS 'Indique si l''utilisateur est externe à l''entreprise (prestataire, consultant, etc.)';

-- Index pour améliorer les performances lors des requêtes sur les utilisateurs externes
CREATE INDEX idx_utilisateurs_externe ON utilisateurs(externe) WHERE externe = TRUE;