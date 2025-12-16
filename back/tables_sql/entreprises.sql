CREATE TABLE entreprises (
 id INT AUTO_INCREMENT PRIMARY KEY,
 siret VARCHAR(14) UNIQUE,
 siren VARCHAR(9),
 nom VARCHAR(255),
 activite VARCHAR(20),
 adresse VARCHAR(255),
 codePostal VARCHAR(10),
 ville VARCHAR(100),
 trancheEffectifs VARCHAR(10),
 etatEtablissement VARCHAR(2),
 date_creation DATETIME DEFAULT CURRENT_TIMESTAMP
);
