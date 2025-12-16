CREATE TABLE dirigeants (
 id INT AUTO_INCREMENT PRIMARY KEY,
 entreprise_id INT,
 nom_complet VARCHAR(255),
 fonction VARCHAR(255) NULL,
 date_maj DATETIME DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (entreprise_id) REFERENCES entreprises(id)
);
