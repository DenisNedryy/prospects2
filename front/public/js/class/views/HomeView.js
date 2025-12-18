export class HomeView {

    render() {
        const el = document.getElementById('root');
        if (el) {
            el.innerHTML = `
            <div class="home">
                <div class="home__header">
                    <div class="home__header__naf homeHeaderBox">
                        <h2>Activités (naf)</h2>
                        <ul>
                            <li>Sièges sociaux (70.10Z)</li>
                            <li>Conseil en gestion (70.22Z)</li>
                            <li>Agences de pub (73.11Z)</li>
                            <li>Etudes de marché (73.20Z)</li>
                            <li>Organisation de salons / Congrès (82.30Z)</li>
                            <li>Formation continue adultes (85.59A)</li>
                            <li>Autres enseignements (85.59B)</li>
                        </ul>
                    </div>
                    <div class="home__header__effectifs homeHeaderBox">
                    <h2>Effectifs</h2>
                    <ul>
                        <li>11 = 10 à 19 salariés</li>
                        <li>12 = 20 à 49 salariés</li>
                        <li>21 = 50 à 99 salariés</li>
                        <li>22 = 100 à 199 salariés</li>
                        <li>31 = 200 à 249 salariés</li>
                    </ul>
                    </div>
                </div>
                <div class="home__main">
                    <div class="home__main__map">
          
<div class="carte-france">


  <svg class="overlay" width="500" height="500" viewBox="0 0 500 500" class="france_map"
       xmlns="http://www.w3.org/2000/svg">
       <defs>
  <linearGradient id="bleuBlancRouge" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="#0055A4" />  <!-- Bleu -->
    <stop offset="50%" stop-color="#FFFFFF" /> <!-- Blanc -->
    <stop offset="100%" stop-color="#EF4135" /> <!-- Rouge -->
  </linearGradient>
</defs>

    <polygon data-dep="64" points="105,431,119,436,118,447,124,445,134,452,144,454,153,463,163,461,167,450,174,434,175,424,167,419,149,420,132,421,114,420" />
    <polygon data-dep="40" points="116,419,128,369,136,366,140,371,151,371,160,379,166,385,174,388,182,392,182,399,173,401,165,415,170,420,130,421" />
    <polygon data-dep="33" points="127,368,131,359,133,351,127,353,133,311,138,308,150,325,154,319,163,324,164,331,176,334,181,337,179,350,188,349,190,355,186,362,177,373,174,382,166,384" />
    <polygon data-dep="17" points="152,321,133,295,138,280,133,274,137,265,145,262,153,266,156,274,170,280,176,287,174,297,163,297,165,305,170,313,168,323,178,328,179,336,163,330" />
    <polygon data-dep="65" points="162,461,173,469,182,468,189,469,195,469,194,463,200,457,198,451,196,443,201,435,191,432,185,428,181,424,173,419,173,426,172,440,177,431" />
    <polygon data-dep="31" points="195,469,194,461,199,452,197,442,202,435,208,429,216,431,223,422,216,409,225,410,230,406,240,402,244,409,247,419,259,426,254,431,244,441,237,441,230,437,229,449,222,445,216,449,210,462" />
    <polygon data-dep="09" points="209,463,219,465,224,470,231,468,234,476,240,473,248,477,260,472,255,467,258,457,257,448,247,442,230,437,228,449,223,444,215,448" />
    <polygon data-dep="66" points="249,477,261,472,256,468,267,472,274,463,281,464,294,460,301,463,301,479,306,484,295,484,286,488,281,491,271,487,264,486,259,489,255,484,247,483" />
    <polygon data-dep="11" points="300,462,300,454,307,441,292,433,287,439,281,434,278,430,268,428,260,432,253,432,245,441,257,448,259,456,255,468,267,471,274,463,281,464,293,460" />
    <polygon data-dep="34" points="307,441,292,433,287,438,279,430,285,425,285,418,293,418,300,416,301,408,308,408,313,402,323,406,327,400,332,404,340,409,347,416,343,422,332,425,328,430,320,438" />
    <polygon data-dep="30" points="342,421,345,416,327,400,321,406,311,403,314,397,310,393,312,388,317,392,324,389,334,389,334,377,338,374,348,382,357,377,364,382,367,390,372,398,368,403,362,415,357,418,349,427" />
    <polygon data-dep="48" points="337,373,333,378,334,389,323,389,317,391,312,389,303,384,296,362,303,348,312,345,316,351,323,350,332,356,333,369" />
    <polygon data-dep="32" points="183,396,173,401,166,414,171,422,178,420,181,426,187,430,201,434,208,428,215,430,222,421,215,408,208,400,208,394,199,397" />
    <polygon data-dep="82" points="208,401,209,393,214,381,221,376,230,383,241,385,252,380,257,389,246,394,239,403,228,407,224,411,216,410" />
    <polygon data-dep="47" points="182,395,168,383,177,373,185,360,189,352,198,361,209,359,221,363,218,370,221,376,213,381,208,394,198,397" />
    <polygon data-dep="81" points="241,401,247,394,258,389,265,388,274,392,278,398,281,407,285,418,297,416,284,426,279,430,267,428,261,432,253,432,259,426,246,419" />
    <polygon data-dep="12" points="298,415,301,407,309,407,313,398,311,392,312,386,303,384,298,361,293,348,287,346,282,350,277,362,267,363,259,367,253,370,252,381,256,390,265,388,275,392,278,399,285,416,291,418" />
    <polygon data-dep="24" points="179,330,178,337,179,351,188,350,193,355,198,361,209,360,223,363,230,357,233,351,236,341,230,333,228,325,228,316,220,308,211,307,204,303,198,313,191,318,188,327" />
    <polygon data-dep="46" points="237,339,243,340,249,344,262,343,265,350,268,363,262,365,253,369,251,380,240,384,227,381,220,376,219,365,223,360,230,354" />
    <polygon data-dep="16" points="163,296,166,307,170,312,168,322,177,329,188,328,192,318,197,312,204,301,217,287,213,278,202,278,197,284,190,280,182,280,175,285,174,296" />
    <polygon data-dep="87" points="212,278,216,288,203,302,210,306,218,306,230,317,253,305,253,297,244,294,241,290,238,281,235,274,235,266,226,264,218,267" />
    <polygon data-dep="19" points="229,315,227,331,236,341,245,341,250,345,262,343,266,332,276,319,278,302,270,303,259,301,252,302,235,315" />
    <polygon data-dep="15" points="277,318,285,317,293,320,299,325,306,325,310,331,312,344,303,346,298,358,293,348,285,345,282,350,277,361,267,361,265,355,261,343,267,331" />
    <polygon data-dep="79" points="153,264,160,261,149,230,159,226,166,222,177,223,181,234,184,240,184,249,182,259,186,267,187,274,192,279,186,280,174,285,170,281,156,273" />
    <polygon data-dep="86" points="178,225,185,219,192,225,196,231,208,232,217,244,218,252,225,257,230,264,218,267,213,278,200,278,196,284,189,279,187,271,182,258,184,240" />
    <polygon data-dep="36" points="218,244,220,234,227,226,234,225,234,219,243,216,252,216,254,223,261,225,264,235,264,245,267,257,264,263,254,261,239,263,232,268,225,257,218,252" />
    <polygon data-dep="23" points="235,265,242,263,255,260,269,263,278,270,281,278,283,284,281,292,274,294,278,302,259,301,253,296,244,293,237,282" />
    <polygon data-dep="85" points="135,266,116,257,98,231,106,224,112,228,123,232,124,222,130,229,136,221,149,228,160,259,153,265,144,260" />
    <polygon data-dep="44" points="107,225,99,216,102,207,90,210,85,203,91,199,103,196,106,189,117,187,128,182,135,182,141,195,143,201,147,206,139,206,130,210,136,221,130,230,124,222,123,231" />
    <polygon data-dep="49" points="130,210,136,220,150,229,166,222,179,224,185,218,192,196,180,192,172,188,166,184,156,185,148,184,135,182,145,203" />
    <polygon data-dep="37" points="193,196,199,193,211,190,218,191,217,197,225,197,226,205,226,212,234,220,235,225,228,225,221,232,218,249,208,232,196,230,184,218" />
    <polygon data-dep="56" points="106,186,98,161,93,159,85,165,70,156,52,156,44,156,54,170,52,176,60,185,65,196,78,188,76,194,83,197,89,199,104,197" />
    <polygon data-dep="29" points="47,176,51,170,43,154,51,155,50,132,42,126,34,125,23,127,13,131,7,134,3,143,19,143,28,148,10,146,18,150,21,156,6,158,16,168,20,176,27,167,28,170,39,177" />
    <polygon data-dep="22" points="50,157,49,127,56,120,66,120,75,125,82,134,88,140,98,131,110,136,112,146,112,153,98,163,84,165,69,155" />
    <polygon data-dep="63" points="283,280,293,272,299,280,315,284,322,289,326,298,336,310,335,323,320,320,305,321,300,326,291,320,274,318,278,304,274,295,281,294" />
    <polygon data-dep="35" points="116,131,128,134,134,143,142,141,148,146,145,154,146,170,141,175,139,183,128,181,119,186,107,188,100,161,114,152,110,132" />
    <polygon data-dep="53" points="168,184,173,171,178,161,183,153,177,142,168,145,157,146,150,143,145,145,144,152,146,171,139,175,139,183,156,185" />
    <polygon data-dep="72" points="183,149,197,146,202,158,213,163,215,172,214,184,207,192,192,197,166,185" />
    <polygon data-dep="13" points="350,426,363,429,374,433,378,428,393,431,396,440,408,440,411,428,409,412,398,412,384,411,369,401,363,414" />
    <polygon data-dep="43" points="302,323,313,319,337,322,347,319,357,327,354,334,349,343,340,350,333,355,324,349,316,350,312,344,310,331" />
    <polygon data-dep="07" points="333,354,348,342,356,327,367,319,369,325,372,341,373,348,369,353,367,363,363,381,357,376,348,382,334,373" />
    <polygon data-dep="83" points="406,438,414,446,428,448,435,441,448,440,448,430,452,422,458,422,456,414,446,404,435,409,429,408,420,414,412,409,408,414,412,427" />
    <polygon data-dep="84" points="364,377,378,379,385,379,400,390,409,411,392,412,384,410,368,402,371,397,365,386" />
    <polygon data-dep="06" points="453,424,466,415,480,405,487,387,484,380,472,383,453,373,447,381,456,399,447,404,455,413,457,423" />
    <polygon data-dep="04" points="401,388,407,382,420,373,430,368,439,367,455,357,452,364,454,373,447,382,456,398,447,404,435,409,429,408,420,413,409,411,406,403,400,394" />
    <polygon data-dep="26" points="401,389,407,381,397,373,404,366,407,358,399,351,395,334,381,336,381,324,369,322,373,350,369,354,364,376,383,381" />
    <polygon data-dep="05" points="409,357,398,371,407,382,427,369,440,367,454,357,461,353,457,345,450,342,442,332,428,330,427,338,432,344,422,348,413,353" />
    <polygon data-dep="38" points="432,345,423,329,418,315,407,314,391,291,377,296,376,305,368,310,367,316,366,323,382,324,380,337,395,335,400,351,407,359" />
    <polygon data-dep="73" points="427,330,442,333,460,323,461,313,451,298,443,295,434,287,424,301,414,297,408,290,401,304,407,315,418,316,422,327" />
    <polygon data-dep="74" points="446,296,455,284,446,270,438,259,425,262,422,271,411,276,407,280,407,289,411,294,424,301" />
    <polygon data-dep="42" points="367,317,356,328,347,319,335,322,336,311,322,290,328,272,335,274,351,273,346,283,351,293,352,304,362,309" />
    <polygon data-dep="69" points="377,295,369,289,366,270,357,267,351,271,348,277,346,285,351,293,351,302,361,308,367,315,370,307,376,304" />
    <polygon data-dep="01" points="367,269,371,255,387,259,391,266,400,265,410,266,416,262,411,276,406,281,407,292,400,303,391,292,378,296,369,289" />
    <polygon data-dep="39" points="415,262,397,274,418,250,419,237,410,227,401,226,403,218,400,214,392,211,387,220,382,228,389,236,388,244,388,253,387,260,392,267,404,265" />
    <polygon data-dep="25" points="419,249,429,240,430,229,447,212,444,195,434,192,424,199,413,205,399,213,401,226,410,227,420,241,424,216" />
    <polygon data-dep="71" points="388,257,388,232,380,229,360,235,340,221,336,227,340,238,322,245,327,256,335,260,330,273,351,273,358,266,367,271" />
    <polygon data-dep="03" points="322,288,330,272,334,259,328,255,321,244,315,249,302,248,297,241,280,247,280,257,270,263,278,271,282,281,293,272,297,280,311,283" />
    <polygon data-dep="18" points="268,262,279,258,281,246,299,241,298,223,294,210,292,202,282,202,268,194,266,204,263,214,252,220,262,225,262,242" />
    <polygon data-dep="58" points="300,243,292,200,299,198,308,202,317,199,328,207,338,210,343,221,336,227,340,239,321,244,316,249,299,248,300,243" />
    <polygon data-dep="41" points="209,188,213,183,216,167,232,175,241,173,243,180,246,191,255,191,267,192,267,200,263,213,255,224,249,216,233,219,226,211,224,197,217,196,217,190" />
    <polygon data-dep="50" points="129,136,123,122,127,113,126,104,116,87,115,74,128,79,140,77,140,88,145,97,152,108,153,117,143,122,146,129,154,131,157,139,149,147,141,141,132,144" />
    <polygon data-dep="61" points="154,129,166,124,182,127,199,120,210,128,215,138,219,144,218,153,212,158,202,159,197,146,182,151,177,143,163,145,152,145" />
    <polygon data-dep="14" points="146,96,153,95,170,100,181,102,197,94,198,103,200,122,187,126,180,128,166,125,153,131,147,131,142,122,152,118,152,108,148,102" />
    <polygon data-dep="28" points="216,137,225,132,235,131,240,122,245,138,254,149,259,158,253,170,241,173,229,175,215,167,207,160,213,157,219,154,220,144" />
    <polygon data-dep="27" points="197,92,205,90,218,97,224,104,234,99,238,93,248,96,252,102,249,107,244,115,241,123,235,132,226,132,214,139,211,128,198,122" />
    <polygon data-dep="76" points="197,94,188,90,194,77,210,70,229,67,237,58,246,67,252,76,251,85,248,96,240,95,235,100,224,105,217,98,206,90" />
    <polygon data-dep="45" points="259,157,274,157,280,167,294,166,301,175,297,185,292,190,296,199,287,203,276,198,266,192,246,190,241,172,253,170" />
    <polygon data-dep="90" points="438,192,439,178,449,187,453,196,444,201" />
    <polygon data-dep="89" points="300,175,293,166,298,154,312,152,319,156,322,166,331,177,344,176,347,183,343,193,338,209,327,206,317,198,308,201,296,198,291,190" />
    <polygon data-dep="21" points="392,211,388,202,389,194,381,196,371,191,370,182,361,172,345,176,346,184,338,210,343,224,359,234,383,230" />
    <polygon data-dep="70" points="387,193,397,187,401,180,409,174,415,172,429,177,435,175,440,179,439,194,431,195,399,214,393,212,388,203" />
    <polygon data-dep="68" points="452,197,464,201,471,190,468,159,458,152,451,153,440,179" />
    <polygon data-dep="67" points="467,159,480,126,486,110,464,110,462,117,448,110,441,117,451,123,456,129,449,141,447,150,457,152" />
    <polygon data-dep="80" points="237,57,243,53,245,40,257,45,266,54,274,50,278,56,289,60,300,60,300,72,300,81,290,81,281,87,264,81,252,80" />
    <polygon data-dep="78" points="246,113,262,119,263,126,265,132,260,138,255,150,241,133,240,121" />
    <polygon data-dep="10" points="310,151,317,140,328,144,336,135,346,132,348,141,358,143,360,151,366,156,365,165,360,172,344,176,331,176,321,165,320,156" />
    <polygon data-dep="91" points="274,156,280,135,265,131,254,149,259,158" />
    <polygon data-dep="77" points="280,135,280,115,301,112,312,128,317,139,311,153,298,155,293,167,280,167,274,155" />
    <polygon data-dep="75" points="262,123,281,117,280,125,280,134,266,132" />
    <polygon data-dep="95" points="281,116,270,109,261,105,255,110,248,106,246,112,264,122" />
    <polygon data-dep="60" points="299,112,296,100,300,94,299,81,289,81,281,85,252,80,250,95,251,102,253,109,262,105,271,110,280,115" />
    <polygon data-dep="62" points="244,39,245,14,263,5,272,20,290,26,296,37,300,47,301,55,297,59,289,59,277,54,273,49,266,52" />
    <polygon data-dep="59" points="262,6,278,2,281,15,289,23,300,20,303,26,312,34,320,42,337,46,336,62,323,61,300,63,300,56,301,48,291,29,271,20" />
    <polygon data-dep="02" points="300,62,300,81,300,93,295,100,299,111,313,128,320,118,318,110,318,98,334,96,335,81,340,74,340,61,322,61" />
    <polygon data-dep="51" points="317,113,318,99,334,95,367,104,372,116,367,125,371,135,360,145,347,140,346,132,335,135,327,144,316,140,312,129" />
    <polygon data-dep="08" points="336,64,349,64,363,52,363,65,364,74,380,79,374,86,372,92,366,104,332,96,336,80,342,73" />
    <polygon data-dep="52" points="358,144,370,136,388,149,398,158,398,168,405,175,397,187,388,197,371,191,368,181,361,172,366,165,365,156,358,151" />
    <polygon data-dep="55" points="380,79,386,94,393,94,394,105,401,115,399,129,399,143,388,149,369,135,367,125,372,116,366,101" />
    <polygon data-dep="88" points="399,144,388,149,395,156,397,169,405,176,416,172,430,176,440,178,453,151,445,150,448,140,437,148,429,146,419,147,412,152,404,148" />
    <polygon data-dep="54" points="398,144,401,116,388,96,381,83,395,85,404,90,407,101,406,112,418,120,424,128,437,133,446,137,440,147,428,146,412,152" />
    <polygon data-dep="57" points="405,89,412,86,424,90,435,105,441,100,446,106,458,103,467,109,462,118,440,117,451,124,456,128,447,142,441,136,422,127,406,111" />
  </svg>
</div>

                    </div>
                    <div class="home__main__details"> 
                        <div class="home__main__details__header">
                           
                    </div>
                        <div class="home__main__details__body"></div>
                    </div>
                </div>
                <div class="home__footer">
                    <div class="home__fotter__recap"></div>
                </div>
            </div>
            `;
        }
    }

    async generateDetailsDepartments(el, dep, departments, emailsSent = "<pas encore d'email envoyés>") {
        // S'assurer que les départements sont chargés

        el.innerHTML = "";

        // titre
        const title = document.createElement('h2');
        title.textContent = `Détails départements: ${departments[dep]}-${dep}`;
        el.appendChild(title);

        // legend
        const legend = document.createElement('p');
        legend.textContent = `Total mails envoyés: ${emailsSent}`;
        el.appendChild(legend);

        // link to crm
        if (emailsSent > 0) {
            const crma = document.createElement('a');
            crma.setAttribute('data-link', ``);
            crma.setAttribute('href', `/data?dep=${dep}`)
            const crmBtn = document.createElement('button');
            crmBtn.className = "btn btn-data";
            crmBtn.textContent = "Data";
            crma.appendChild(crmBtn);
            el.appendChild(crma);
        }


        // sous titre
        const subTitle = document.createElement('h3');
        subTitle.textContent = "Récupération des données";
        el.appendChild(subTitle);

        // btn submit
        const btn = document.createElement('button');
        btn.textContent = "Lancer l'enrichissement du département";
        btn.className = "btn-enrichissement btn";
        el.appendChild(btn);

        // ligne d'information
        const infoDiv = document.createElement('div');
        infoDiv.className = "details__phraseRassurante";
        const prSirene = document.createElement('div');
        prSirene.className = "prSirene apiEl";
        infoDiv.appendChild(prSirene);
        const prPappers = document.createElement('div');
        prPappers.className = "prPappers apiEl";
        infoDiv.appendChild(prPappers);
        const prDropContact = document.createElement('div');
        prDropContact.className = "prDropContact apiEl";
        infoDiv.appendChild(prDropContact);

        el.appendChild(infoDiv);
    }

    borderlineTheDepartment(target) {
        document.querySelectorAll('.selected').forEach((el) => el.classList.remove('selected'));
        target.classList.add('selected');
    }

    operationRecolorisation(data) {
        if (!data) return;
        const polygons = document.querySelectorAll('polygon');
        polygons.forEach((polygon) => {
            const dep = polygon.getAttribute('data-dep');
            const sameData = data.find((cell) => Number(cell.dep) === Number(dep));
            if (sameData.length === 0) {
                polygon.classList.add('polygon-white');
            }
        })
    }

    stopWhitePolygon(dep) {
        const polygons = document.querySelectorAll('polygon');
        polygons.forEach((polygon) => {
            const depPoly = polygon.getAttribute('data-dep');

            if (Number(depPoly) === Number(dep)) {
                polygon.classList.remove('polygon-white');
            }
        })
    }


    renderOperationEnCours(api) {
        let el = "";
        // afficher qu'on fetch les données
        switch (api) {
            case 'sirene':
                el = document.querySelector(".prSirene");
                el.innerHTML = `<i class="fa-solid fa-gear rotating"></i><p>Opération en cours ...</p>`;
                break;

            case 'pappers':
                el = document.querySelector(".prPappers");
                el.innerHTML = `<i class="fa-solid fa-gear rotating"></i><p>Opération en cours ...</p>`;
                break;

            case 'dropContact':
                el = document.querySelector(".prDropContact");
                el.innerHTML = `<i class="fa-solid fa-gear rotating"></i><p>Opération en cours ...</p>`;
                break;

            default: return;
        }
    }

    renderSiren(api, data) {
        let el = "";
        // afficher qu'on fetch les données
        switch (api) {
            case 'sirene':
                el = document.querySelector(".prSirene");
                el.innerHTML = `<i class="fa-solid fa-circle-check"></i><p>SIRENE: ${data.total} entreprises récupérées au total</p>`;
                break;

            case 'pappers':
                el = document.querySelector(".prPappers");
                el.innerHTML = `<i class="fa-solid fa-circle-check"></i><p>Pappers: ${data.total} dirigeants récupérées au total</p>`;
                break;

            case 'dropContact':
                el = document.querySelector(".prDropContact");
                el.innerHTML = `<i class="fa-solid fa-circle-check"></i><p>Drop-contact: ${data.total} emails récupérées au total</p>`;
                break;

            default: return;
        }
    }

    resetApiRender() {
        const sirene = document.querySelector(".prSirene");
        sirene.innerHTML = "";
        const pappers = document.querySelector(".prPappers");
        pappers.innerHTML = "";
        const dropContact = document.querySelector(".prDropContact");
        dropContact.innerHTML = "";
    }

    // renderOperationEnCours() {
    //     const el = document.querySelector(".details__phraseRassurante");
    //     if (!el) return;

    //     // afficher qu'on fetch les données
    //     el.innerHTML = `<i class="fa-solid fa-gear rotating"></i><p>Opération en cours ...</p>`;

    //     // fetch l'api
    //     const res = await this.controller.entreprise.createSiren(dep);
    //     console.log(res);
    //     el.innerHTML = `<i class="fa-solid fa-circle-check"></i><p>SIRENE: ${res.total} entreprises récupérées au total</p>`;
    //     await this.loadSirenMap();
    // }


}

