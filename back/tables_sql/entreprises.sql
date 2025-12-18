CREATE TABLE entreprises (
  id INT AUTO_INCREMENT PRIMARY KEY,

  siren CHAR(9) NOT NULL,
  denomination VARCHAR(255) NOT NULL,
  adresse VARCHAR(255),
  ville varchar(255),

  -- Données utiles pour qualifier
  activite_code VARCHAR(10) NULL,
  tranche_effectif VARCHAR(50) NULL,
  departement VARCHAR(3) NULL,

  -- Résultat final recherché 
  email VARCHAR(255) NULL,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uq_siren (siren)
);
