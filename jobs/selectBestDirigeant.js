const fs = require('fs');

function scoreEmail(email) {
  if (!email) return 0;
  email = email.toLowerCase();

  // Score selon la qualité du pattern
  if (/^[a-z]+\.[a-z]+@/.test(email)) return 100; // prenom.nom@domaine
  if (/^[a-z]+@/.test(email)) return 80;          // prenom@domaine
  if (/^[a-z]\w+@/.test(email)) return 60;        // initiale + nom
  return 10;                                      // email chelou
}

function bestEmail(dirigeantsEmails) {
  if (!dirigeantsEmails || dirigeantsEmails.length === 0) return null;

  let best = null;
  let bestScore = -1;

  for (const d of dirigeantsEmails) {
    for (const email of d.emails) {
      const score = scoreEmail(email);
      if (score > bestScore) {
        bestScore = score;
        best = {
          nomComplet: d.nomComplet,
          email
        };
      }
    }
  }

  return best;
}

function main() {
  const input = JSON.parse(fs.readFileSync('prospects_enrichis.json', 'utf8'));
  const prospects = input.prospects || [];

  const result = prospects.map(p => {
    const best = bestEmail(p.dirigeantsEmails);
    return {
      ...p,
      emailCible: best ? best.email : null,
      nomCible: best ? best.nomComplet : null
    };
  });

  fs.writeFileSync(
    'prospects_emailCible.json',
    JSON.stringify({ ...input, prospects: result }, null, 2),
    'utf8'
  );

  console.log("✔ Fichier généré : prospects_emailCible.json");
}

main();
