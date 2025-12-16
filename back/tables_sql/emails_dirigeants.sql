CREATE TABLE emails_dirigeants (
 id INT AUTO_INCREMENT PRIMARY KEY,
 dirigeant_id INT,
 email VARCHAR(255),
 origine VARCHAR(50),      -- dropcontact, hunter, manual, etc.
 valide BOOLEAN DEFAULT TRUE,
 date_detection DATETIME DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (dirigeant_id) REFERENCES dirigeants(id)
);
