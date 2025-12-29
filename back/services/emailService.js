const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-fr.securemail.pro", // Configuration Amen
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendProspectionEmail(target) {
  let template;
  
  // On vérifie si l'entreprise est dans le 86 (Vienne) via le code postal
  const isLocal = target.code_postal && target.code_postal.startsWith("86");

  if (target.tranche_effectif === "11") {
    // --- Cible PME (10-19 pers) : Focus Exclusivité & Team Building ---
    template = {
      subject: isLocal 
        ? `Séminaire au vert pour ${target.denomination} - À 15 min de Poitiers`
        : `Votre prochain séminaire d'équipe au vert (1h30 de Paris)`,
      html: `
        <p>Bonjour ${target.dirigeant_nom},</p>
        <p>Je me permets de vous contacter car le cadre du <strong>Domaine de l'Écorcerie</strong> semble idéal pour les prochaines rencontres de <strong>${target.denomination}</strong>.</p>
        <p>Situé dans un écrin de 25 hectares de bois, notre domaine offre une déconnexion totale pour vos équipes, tout en restant ultra-accessible (15 min de la Gare TGV de Poitiers).</p>
        <ul>
          <li><strong>Privatisation possible :</strong> Un lieu rien que pour vous.</li>
          <li><strong>Équipements :</strong> Deux salles (70m² et 150m²), Fibre, sono JBL et vidéoprojection.</li>
          <li><strong>Activités :</strong> Idéal pour vos Team Buildings et moments de cohésion.</li>
        </ul>
        <p>${isLocal ? "Étant voisins, je serais ravi de vous faire visiter le domaine." : "N'hésitez pas à me solliciter pour une présentation de nos formules résidentielles."}</p>
        <p>Bien cordialement,<br>L'équipe du Domaine de l'Écorcerie</p>`
    };
  } else {
    // --- Cible Large : Focus Événementiel, Conférence & Réseautage ---
    template = {
      subject: `Lieu d'exception pour vos événements : Domaine de l'Écorcerie`,
      html: `
        <p>Bonjour ${target.dirigeant_nom},</p>
        <p>Le <strong>Domaine de l'Écorcerie</strong>, situé aux portes de Poitiers, accueille vos événements d'entreprise (conférences, cocktails, lancements de produit) dans une bâtisse de 1 000 m² entourée de nature.</p>
        <p>Pourquoi choisir l'Écorcerie ?</p>
        <ul>
          <li><strong>Accessibilité :</strong> 10 min de l'A10 (Paris-Bordeaux) et 15 min de l'aéroport de Biard.</li>
          <li><strong>Capacité :</strong> Deux salles modulables de 70m² et 150m².</li>
          <li><strong>Services :</strong> Accès fibre, sonorisation complète et espaces extérieurs pour vos réceptions.</li>
        </ul>
        <p>Seriez-vous intéressé par notre brochure pour vos futurs projets d'événements ?</p>
        <p>Bien cordialement,<br>La Direction - Domaine de l'Écorcerie</p>`
    };
  }

  const mailOptions = {
    from: '"Domaine de l’Écorcerie" <commercial@votre-domaine.com>',
    to: target.email,
    subject: template.subject,
    html: template.html,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendProspectionEmail };