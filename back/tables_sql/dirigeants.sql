CREATE TABLE dirigeants (
  id INT AUTO_INCREMENT PRIMARY KEY,

  entreprise_id INT NOT NULL,

  firstname VARCHAR(100) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  fonction VARCHAR(150) NULL,

  email VARCHAR(255) NULL,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uq_dirigeant (entreprise_id, firstname, lastname),
  INDEX idx_entreprise (entreprise_id),

  CONSTRAINT fk_dirigeant_entreprise
    FOREIGN KEY (entreprise_id) REFERENCES entreprises(id)
    ON DELETE CASCADE
);
