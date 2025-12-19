les scripts dans jobs se lance en ligne de cmd: node jobs/fetchSireneToDb.js
Ces scripts ne doivent PAS être importés par app.js ou server.js.

https://portail-api.insee.fr/applications/d5e5a740-51cf-41e5-a5a7-4051cfe1e5a5/subscriptions?subscription=2bd85947-2457-426e-9859-472457726e76#s

## récupérer la clef api sur api sirene de l'insee: https://portail-api.insee.fr/

## récupérer la clef api sur pappers: https://moncompte.pappers.fr/api

## récupérer la clef api sur dropcontact: https://app.dropcontact.com/fr/api

node findSeminarProspects.js
# → génère prospects_seminaires_dep86.json


node enrichProspects.js
# → génère prospects_seminaires_dep86_enriched.json


node enrichDirigeants.js

### front
utilisation de live-server



## RESUMET
. index.js utilisant sireneClient.js => call api sirene de l'insee et récupère le siren => génère prospects_seminaires_dep86.json

. enrichDirigeants.js(prend param prospects_seminaires_dep86.json) utilisant pappersClient.js => call api pappers et ajoute les noms des dirigeants de l'entreprise => créer prospects_seminaires_dep86_dirigeants.json

. dropcontact.js (prend en param propects.json) => call api dropcontact et ajoute les mails si possible => créer prospects_enrichis.json

. selectBestDirigeant.js (prend email en para) retourn le mail le plus pertinant


## BESOIN
. payer les api pappers et dropcontact
    - dropcontact : 45€/mois(500credits) ou 72€/mois(1500credits)
    - pappers: 20€/mois(500credits) ou 50€/mois(2kcredits)
. créer une bdd et tout mettre dessus au lieu de créer des json
. réécrire le code pour éviter le json


## projets
. créer une carte intercatives pour prospecter/consulter/crm


# mails:
npm install nodemailer <br>
25 emails par h (passera sous les radars des filtres anti-spam.)

 