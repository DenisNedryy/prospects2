// controllers/entreprisesController.js
const pool = require('../connection/sqlConnection');
const fetchEntreprisesForDepartement = require("../services/sireneEntreprisesService");



exports.getSirenDepLength = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT codePostal FROM entreprises');
    if (rows.length <= 0) return res.status(400).json({ msg: "entreprises not found" });

    const departements = [
      { name: "Ain", dep: 1, length: 0 },
      { name: "Aisne", dep: 2, length: 0 },
      { name: "Allier", dep: 3, length: 0 },
      { name: "Alpes-de-Haute-Provence", dep: 4, length: 0 },
      { name: "Hautes-Alpes", dep: 5, length: 0 },
      { name: "Alpes-Maritimes", dep: 6, length: 0 },
      { name: "Ardèche", dep: 7, length: 0 },
      { name: "Ardennes", dep: 8, length: 0 },
      { name: "Ariège", dep: 9, length: 0 },
      { name: "Aube", dep: 10, length: 0 },
      { name: "Aude", dep: 11, length: 0 },
      { name: "Aveyron", dep: 12, length: 0 },
      { name: "Bouches-du-Rhône", dep: 13, length: 0 },
      { name: "Calvados", dep: 14, length: 0 },
      { name: "Cantal", dep: 15, length: 0 },
      { name: "Charente", dep: 16, length: 0 },
      { name: "Charente-Maritime", dep: 17, length: 0 },
      { name: "Cher", dep: 18, length: 0 },
      { name: "Corrèze", dep: 19, length: 0 },
      // 2A / 2B exclus
      { name: "Côte-d'Or", dep: 21, length: 0 },
      { name: "Côtes-d'Armor", dep: 22, length: 0 },
      { name: "Creuse", dep: 23, length: 0 },
      { name: "Dordogne", dep: 24, length: 0 },
      { name: "Doubs", dep: 25, length: 0 },
      { name: "Drôme", dep: 26, length: 0 },
      { name: "Eure", dep: 27, length: 0 },
      { name: "Eure-et-Loir", dep: 28, length: 0 },
      { name: "Finistère", dep: 29, length: 0 },
      { name: "Gard", dep: 30, length: 0 },
      { name: "Haute-Garonne", dep: 31, length: 0 },
      { name: "Gers", dep: 32, length: 0 },
      { name: "Gironde", dep: 33, length: 0 },
      { name: "Hérault", dep: 34, length: 0 },
      { name: "Ille-et-Vilaine", dep: 35, length: 0 },
      { name: "Indre", dep: 36, length: 0 },
      { name: "Indre-et-Loire", dep: 37, length: 0 },
      { name: "Isère", dep: 38, length: 0 },
      { name: "Jura", dep: 39, length: 0 },
      { name: "Landes", dep: 40, length: 0 },
      { name: "Loir-et-Cher", dep: 41, length: 0 },
      { name: "Loire", dep: 42, length: 0 },
      { name: "Haute-Loire", dep: 43, length: 0 },
      { name: "Loire-Atlantique", dep: 44, length: 0 },
      { name: "Loiret", dep: 45, length: 0 },
      { name: "Lot", dep: 46, length: 0 },
      { name: "Lot-et-Garonne", dep: 47, length: 0 },
      { name: "Lozère", dep: 48, length: 0 },
      { name: "Maine-et-Loire", dep: 49, length: 0 },
      { name: "Manche", dep: 50, length: 0 },
      { name: "Marne", dep: 51, length: 0 },
      { name: "Haute-Marne", dep: 52, length: 0 },
      { name: "Mayenne", dep: 53, length: 0 },
      { name: "Meurthe-et-Moselle", dep: 54, length: 0 },
      { name: "Meuse", dep: 55, length: 0 },
      { name: "Morbihan", dep: 56, length: 0 },
      { name: "Moselle", dep: 57, length: 0 },
      { name: "Nièvre", dep: 58, length: 0 },
      { name: "Nord", dep: 59, length: 0 },
      { name: "Oise", dep: 60, length: 0 },
      { name: "Orne", dep: 61, length: 0 },
      { name: "Pas-de-Calais", dep: 62, length: 0 },
      { name: "Puy-de-Dôme", dep: 63, length: 0 },
      { name: "Pyrénées-Atlantiques", dep: 64, length: 0 },
      { name: "Hautes-Pyrénées", dep: 65, length: 0 },
      { name: "Pyrénées-Orientales", dep: 66, length: 0 },
      { name: "Bas-Rhin", dep: 67, length: 0 },
      { name: "Haut-Rhin", dep: 68, length: 0 },
      { name: "Rhône", dep: 69, length: 0 },
      { name: "Haute-Saône", dep: 70, length: 0 },
      { name: "Saône-et-Loire", dep: 71, length: 0 },
      { name: "Sarthe", dep: 72, length: 0 },
      { name: "Savoie", dep: 73, length: 0 },
      { name: "Haute-Savoie", dep: 74, length: 0 },
      { name: "Paris", dep: 75, length: 0 },
      { name: "Seine-Maritime", dep: 76, length: 0 },
      { name: "Seine-et-Marne", dep: 77, length: 0 },
      { name: "Yvelines", dep: 78, length: 0 },
      { name: "Deux-Sèvres", dep: 79, length: 0 },
      { name: "Somme", dep: 80, length: 0 },
      { name: "Tarn", dep: 81, length: 0 },
      { name: "Tarn-et-Garonne", dep: 82, length: 0 },
      { name: "Var", dep: 83, length: 0 },
      { name: "Vaucluse", dep: 84, length: 0 },
      { name: "Vendée", dep: 85, length: 0 },
      { name: "Vienne", dep: 86, length: 0 },
      { name: "Haute-Vienne", dep: 87, length: 0 },
      { name: "Vosges", dep: 88, length: 0 },
      { name: "Yonne", dep: 89, length: 0 },
      { name: "Territoire de Belfort", dep: 90, length: 0 },
      { name: "Essonne", dep: 91, length: 0 },
      { name: "Hauts-de-Seine", dep: 92, length: 0 },
      { name: "Seine-Saint-Denis", dep: 93, length: 0 },
      { name: "Val-de-Marne", dep: 94, length: 0 },
      { name: "Val-d'Oise", dep: 95, length: 0 }
    ];


    const data = rows.reduce((acc, curr) => {
      const dep = curr.codePostal.slice(0, 2); // "57", "45", etc.

      // On cherche si le département existe déjà dans l'accumulateur
      const found = acc.find(item => item.dep === dep);

      if (found) {
        found.length++;
      } else {
        acc.push({ dep: dep, length: 1 });
      }

      return acc;
    }, []);

    // si departement contient data alors on remplace la length de data dans le dep
    for (let i = 0; i < data.length; i++) {
      const correspond = departements.find((obj) => Number(obj.dep) === Number(data[i].dep));
      if (correspond) {
        correspond.length = data[i].length;
      }
    }

    return res.status(200).json({ data: departements });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};


exports.getSirenPerDep = async (req, res, next) => {
  try {
    const dep = req.params.dep;
    if (!dep) {
      return res.status(400).json({ error: "Champ 'dep' obligatoire (paramètre d'URL ou query)" });
    }

    // On récupère par codePostal commençant par le code département
    const [rows] = await pool.query(
      `
      SELECT DISTINCT
        siren,
        nom,
        activite,
        ville,
        codePostal,
        trancheEffectifs,
        etatEtablissement
      FROM entreprises
      WHERE codePostal LIKE CONCAT(?, '%')
      ORDER BY nom ASC
      `,
      [dep]
    );

    return res.status(200).json({
      dep,
      count: rows.length,
      data: rows,
    });
  } catch (err) {
    console.error('Erreur getSiren :', err);
    return res.status(500).json({ error: err });
  }
};



exports.createSiren = async (req, res, next) => {
  try {
    const dep = req.body.dep;
    if (!dep) {
      return res.status(400).json({ error: "Champ 'dep' obligatoire" });
    }

    // 1) Récupérer les entreprises depuis Sirene
    const entreprises = await fetchEntreprisesForDepartement(dep);

    // 2) Insert / Update DB
    let inserted = 0;
    let updated = 0;

    for (const p of entreprises) {
      const [result] = await pool.query(
        `
        INSERT INTO entreprises
          (siret, siren, nom, activite, adresse, codePostal, ville, trancheEffectifs, etatEtablissement)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          nom = VALUES(nom),
          activite = VALUES(activite),
          adresse = VALUES(adresse),
          codePostal = VALUES(codePostal),
          ville = VALUES(ville),
          trancheEffectifs = VALUES(trancheEffectifs),
          etatEtablissement = VALUES(etatEtablissement)
        `,
        [
          p.siret, p.siren, p.nom, p.activite,
          p.adresse, p.codePostal, p.ville,
          p.trancheEffectifs, p.etatEtablissement
        ]
      );

      if (result.affectedRows === 1) inserted++;
      if (result.affectedRows === 2) updated++;
    }

    return res.status(201).json({
      msg: "entreprises Sirene importés",
      total: entreprises.length,
      inserted,
      updated,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err });
  }
};

exports.createName = (req, res) =>
  res.status(201).json({ msg: "Company name created" });

exports.createEmail = (req, res) =>
  res.status(201).json({ msg: "Company email created" });

exports.getAllEntreprisesData = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = 20;
    const offset = (page - 1) * limit;

    // Total entreprises
    const [[{ total }]] = await pool.query(`
      SELECT COUNT(*) AS total
      FROM entreprises
    `);

    const [rows] = await pool.query(
      `
      SELECT
        p.id,
        p.siren,
        p.nom,
        SUBSTRING(p.codePostal, 1, 2) AS dep,
        p.adresse,
        p.codePostal,
        p.ville,
        p.etatEtablissement,

        d.nom_complet AS dirigeant_nom,
        d.fonction    AS dirigeant_fonction,

        e.email AS email

      FROM entreprises p

      /* choisit 1 dirigeant DÉTERMINISTE : le plus petit id */
      LEFT JOIN dirigeants d
        ON d.id = (
          SELECT MIN(d2.id)
          FROM dirigeants d2
          WHERE d2.entreprise_id = p.id
        )

      /* choisit 1 email DÉTERMINISTE : le plus petit id parmi les valides */
      LEFT JOIN emails_dirigeants e
        ON e.id = (
          SELECT MIN(e2.id)
          FROM emails_dirigeants e2
          WHERE e2.dirigeant_id = d.id
            AND e2.valide = 1
        )

      ORDER BY p.nom ASC
      LIMIT ? OFFSET ?
      `,
      [limit, offset]
    );

    const data = rows.map(row => ({
      siren: row.siren,
      nom: row.nom,
      dep: row.dep,
      adresse: row.adresse,
      codePostal: row.codePostal,
      ville: row.ville,
      etatEtablissement: row.etatEtablissement,
      dirigeant: row.dirigeant_nom
        ? { nom_complet: row.dirigeant_nom, fonction: row.dirigeant_fonction }
        : null,
      email: row.email || null
    }));

    res.status(200).json({
      page,
      limit,
      count: data.length,
      total,
      totalPages: Math.ceil(total / limit),
      data
    });
  } catch (err) {
    console.error("Erreur getAllEntreprisesData:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};



exports.getEntreprisesByDep = async (req, res) => {
  try {
    const dep = req.params.dep || req.query.dep;

    if (!dep) {
      return res.status(400).json({ error: "Paramètre 'dep' obligatoire" });
    }

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    console.log(page);
    const limit = 20;
    const offset = (page - 1) * limit;

    // Total (pour totalPages)
    const [[{ total }]] = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM entreprises p
      WHERE p.codePostal LIKE CONCAT(?, '%')
      `,
      [dep]
    );

    // Données paginées + choix déterministe (MIN(id))
    const [rows] = await pool.query(
      `
      SELECT
        p.id,
        p.siren,
        p.nom,
        SUBSTRING(p.codePostal, 1, 2) AS dep,
        p.adresse,
        p.codePostal,
        p.ville,
        p.etatEtablissement,

        d.nom_complet AS dirigeant_nom,
        d.fonction    AS dirigeant_fonction,

        e.email AS email

      FROM entreprises p

      /* 1 dirigeant déterministe: plus petit id (ou remplace par MAX pour le dernier) */
      LEFT JOIN dirigeants d
        ON d.id = (
          SELECT MIN(d2.id)
          FROM dirigeants d2
          WHERE d2.entreprise_id = p.id
        )

      /* 1 email déterministe: plus petit id parmi les valides */
      LEFT JOIN emails_dirigeants e
        ON e.id = (
          SELECT MIN(e2.id)
          FROM emails_dirigeants e2
          WHERE e2.dirigeant_id = d.id
            AND e2.valide = 1
        )

      WHERE p.codePostal LIKE CONCAT(?, '%')

      ORDER BY p.nom ASC
      LIMIT ? OFFSET ?
      `,
      [dep, limit, offset]
    );

    const data = rows.map(row => ({
      siren: row.siren,
      nom: row.nom,
      dep: row.dep,
      adresse: row.adresse,
      codePostal: row.codePostal,
      ville: row.ville,
      etatEtablissement: row.etatEtablissement,
      dirigeant: row.dirigeant_nom
        ? { nom_complet: row.dirigeant_nom, fonction: row.dirigeant_fonction }
        : null,
      email: row.email || null
    }));

    res.status(200).json({
      dep,
      page,
      limit,
      count: data.length,
      total,
      totalPages: Math.ceil(total / limit),
      data
    });
  } catch (err) {
    console.error("Erreur getEntreprisesByDep:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};


exports.getEntreprisesByQuery = async (req, res) => {
  try {
    const query = req.query.query || req.params.query;

    if (!query) {
      return res.status(400).json({ error: "Paramètre 'query' obligatoire" });
    }

    const search = `%${query}%`;

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = 20;
    const offset = (page - 1) * limit;

    // Total (pour totalPages)
    const [[{ total }]] = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM entreprises p
      WHERE
        p.nom LIKE ?
        OR p.siren LIKE ?
        OR p.ville LIKE ?
        OR EXISTS (
          SELECT 1
          FROM dirigeants d
          WHERE d.entreprise_id = p.id
            AND d.nom_complet LIKE ?
        )
        OR EXISTS (
          SELECT 1
          FROM dirigeants d
          JOIN emails_dirigeants e ON e.dirigeant_id = d.id
          WHERE d.entreprise_id = p.id
            AND e.valide = 1
            AND e.email LIKE ?
        )
      `,
      [search, search, search, search, search]
    );

    // Données paginées + choix déterministe
    const [rows] = await pool.query(
      `
      SELECT
        p.id,
        p.siren,
        p.nom,
        SUBSTRING(p.codePostal, 1, 2) AS dep,
        p.adresse,
        p.codePostal,
        p.ville,
        p.etatEtablissement,

        d.nom_complet AS dirigeant_nom,
        d.fonction    AS dirigeant_fonction,

        e.email AS email

      FROM entreprises p

      /* 1 dirigeant déterministe */
      LEFT JOIN dirigeants d
        ON d.id = (
          SELECT MIN(d2.id)
          FROM dirigeants d2
          WHERE d2.entreprise_id = p.id
        )

      /* 1 email déterministe (valide) */
      LEFT JOIN emails_dirigeants e
        ON e.id = (
          SELECT MIN(e2.id)
          FROM emails_dirigeants e2
          WHERE e2.dirigeant_id = d.id
            AND e2.valide = 1
        )

      WHERE
        p.nom LIKE ?
        OR p.siren LIKE ?
        OR p.ville LIKE ?
        OR EXISTS (
          SELECT 1
          FROM dirigeants d3
          WHERE d3.entreprise_id = p.id
            AND d3.nom_complet LIKE ?
        )
        OR EXISTS (
          SELECT 1
          FROM dirigeants d4
          JOIN emails_dirigeants e4 ON e4.dirigeant_id = d4.id
          WHERE d4.entreprise_id = p.id
            AND e4.valide = 1
            AND e4.email LIKE ?
        )

      ORDER BY p.nom ASC
      LIMIT ? OFFSET ?
      `,
      [search, search, search, search, search, limit, offset]
    );

    const data = rows.map(row => ({
      siren: row.siren,
      nom: row.nom,
      dep: row.dep,
      adresse: row.adresse,
      codePostal: row.codePostal,
      ville: row.ville,
      etatEtablissement: row.etatEtablissement,
      dirigeant: row.dirigeant_nom
        ? { nom_complet: row.dirigeant_nom, fonction: row.dirigeant_fonction }
        : null,
      email: row.email || null
    }));

    res.status(200).json({
      query,
      page,
      limit,
      count: data.length,
      total,
      totalPages: Math.ceil(total / limit),
      data
    });
  } catch (err) {
    console.error("Erreur getEntreprisesByQuery:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

