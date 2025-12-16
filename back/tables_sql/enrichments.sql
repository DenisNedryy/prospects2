CREATE TABLE enrichments (
  id INT AUTO_INCREMENT PRIMARY KEY,

  -- Ce qui est enrichi
  entity_type ENUM('ENTREPRISE','DIRIGEANT') NOT NULL,
  entity_id INT NOT NULL,

  -- Par quelle API
  provider ENUM('PAPPERS','DROPCONTACT') NOT NULL,

  -- État de l’enrichissement
  status ENUM(
    'NEVER',
    'DONE', 
    'FOUND',
    'NOT_FOUND',
    'ERROR',
    'SKIPPED'
  ) NOT NULL DEFAULT 'NEVER',

  -- Gestion des appels
  last_called_at DATETIME NULL,
  next_retry_at DATETIME NULL,
  attempt_count INT NOT NULL DEFAULT 0,

  -- Anti-doublon & debug
  fingerprint CHAR(64) NULL,
  provider_ref VARCHAR(100) NULL,
  last_error VARCHAR(255) NULL,

  -- Métadonnées
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Garde-fous
  UNIQUE KEY uq_enrichment (entity_type, entity_id, provider),
  INDEX idx_retry (provider, status, next_retry_at),
  INDEX idx_entity (entity_type, entity_id)
);
