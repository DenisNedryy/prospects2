const nodemailer = require("nodemailer");

// Configuration de ton compte mail (ex: celui de ton hôtel)
const transporter = nodemailer.createTransport({
  host: "smtp.ton-hotel.com", // ou smtp.gmail.com
  port: 465,
  secure: true, // true pour le port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Envoie un mail personnalisé selon le profil de l'entreprise
 */
async function sendProspectionEmail(target) {
  // Sélection du modèle de texte selon l'effectif
  let template;
  
  if (target.tranche_effectif === "11") {
    // Profil idéal pour tes 16 chambres (10-19 pers)
    template = {
      subject: `Privatisation exclusive pour votre équipe - Hôtel [Nom]`,
      html: `<p>Bonjour ${target.dirigeant_nom},</p>
             <p>J'ai vu que <strong>${target.denomination}</strong> est basée dans la région.</p>
             <p>Notre hôtel propose une offre de <strong>privatisation totale</strong> idéale pour les équipes de votre taille : 
             16 chambres et une salle de réunion équipée, pour un séminaire en toute confidentialité.</p>`
    };
  } else {
    // Profil pour tes salles de 40 ou 100 (Journée d'étude)
    template = {
      subject: `Vos prochaines journées d'étude à [Ville]`,
      html: `<p>Bonjour ${target.dirigeant_nom},</p>
             <p>Nous disposons de deux salles de séminaire (40 et 100 places) à proximité de vos bureaux.</p>
             <p>C'est l'endroit idéal pour vos formations ou réunions trimestrielles...</p>`
    };
  }

  const mailOptions = {
    from: '"Ton Nom / Hôtel" <commercial@ton-hotel.com>',
    to: target.email, // L'email trouvé par Dropcontact
    subject: template.subject,
    html: template.html,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendProspectionEmail };