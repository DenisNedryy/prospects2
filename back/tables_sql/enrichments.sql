CREATE TABLE enrichments (
  id INT AUTO_INCREMENT PRIMARY KEY,

  entity_type ENUM('ENTREPRISE','DIRIGEANT') NOT NULL,
  entity_id INT NOT NULL,

  provider ENUM('PAPPERS','DROPCONTACT') NOT NULL,

  status ENUM(
    'NEVER',
    'FOUND',
    'NOT_FOUND',
    'ERROR'
  ) NOT NULL DEFAULT 'NEVER',

  last_called_at DATETIME NULL,
  attempt_count INT NOT NULL DEFAULT 0,
  next_retry_at DATETIME NULL,

  last_error VARCHAR(255) NULL,
  provider_ref VARCHAR(100) NULL,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uq_enrichment (entity_type, entity_id, provider),
  INDEX idx_retry (provider, status, next_retry_at),
  INDEX idx_entity (entity_type, entity_id)
);
