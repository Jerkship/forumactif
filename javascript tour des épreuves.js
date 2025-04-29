const BESTIAIRE = {
  faible: [
    { nom: "Gobelin Grincheux", sante: "Faible", force: 2, dex: 3, int: 1, consti: 1, pouvoir: 0 },
    { nom: "Sanglier Enragé", sante: "Faible", force: 3, dex: 2, int: 1, consti: 2, pouvoir: 0 },
    { nom: "Esprit Errant", sante: "Faible", force: 1, dex: 2, int: 3, consti: 1, pouvoir: 0 }
  ],
  moyen: [
    { nom: "Orc Berserker", sante: "Moyenne", force: 5, dex: 3, int: 1, consti: 3, pouvoir: 1 },
    { nom: "Spectre de Givre", sante: "Moyenne", force: 2, dex: 4, int: 5, consti: 2, pouvoir: 1 }
  ],
  fort: [
    { nom: "Garde Déchu", sante: "Élevée", force: 6, dex: 4, int: 3, consti: 5, pouvoir: 2 },
    { nom: "Seigneur Loup", sante: "Élevée", force: 7, dex: 5, int: 2, consti: 5, pouvoir: 2 }
  ],
  très_fort: [
    { nom: "Seigneur Démoniaque", sante: "Très élevée", force: 9, dex: 7, int: 5, consti: 8, pouvoir: 3 }
  ]
};
function genererMonstres(etage) {
  let type = "faible";
  if (etage > 30 && etage <= 60) type = "moyen";
  if (etage > 60 && etage <= 90) type = "fort";
  if (etage > 90) type = "très_fort";

  const bestiaire = BESTIAIRE[type];
  const nombre = Math.min(7, Math.max(3, Math.floor(Math.random() * 5) + 3)); // 3 à 7 monstres
  const monstres = [];

  for (let i = 0; i < nombre; i++) {
    const monstre = bestiaire[Math.floor(Math.random() * bestiaire.length)];
    monstres.push(monstre);
  }
  return monstres;
}
function afficherMonstres(monstres) {
  const zone = document.getElementById('zone-monstres');
  zone.innerHTML = '';

  monstres.forEach(m => {
    const carte = document.createElement('div');
    carte.className = 'monstre-carte';
    carte.innerHTML = `
      <h4>${m.nom}</h4>
      <p>Santé : ${m.sante}</p>
      <p>Force : ${m.force} | Dextérité : ${m.dex} | Intelligence : ${m.int} | Constitution : ${m.consti} | Pouvoir : ${m.pouvoir}</p>
    `;
    zone.appendChild(carte);
  });

  zone.style.display = 'flex';
}
function afficherMonstres(monstres) {
  const zone = document.getElementById('zone-monstres');
  zone.innerHTML = '';

  monstres.forEach(m => {
    const carte = document.createElement('div');
    carte.className = 'monstre-carte';
    carte.innerHTML = `
      <h4>${m.nom}</h4>
      <p>Santé : ${m.sante}</p>
      <p>Force : ${m.force} | Dextérité : ${m.dex} | Intelligence : ${m.int} | Constitution : ${m.consti} | Pouvoir : ${m.pouvoir}</p>
    `;
    zone.appendChild(carte);
  });

  zone.style.display = 'flex';
}

let joueurs = JSON.parse(localStorage.getItem("joueurs")) || {};
let joueurActif = null;

function commencerDonjon() {
  const nom = document.getElementById("joueurNom").value.trim();
  if (!nom) return alert("Entrez un nom de joueur");

  if (!joueurs[nom]) {
    joueurs[nom] = {
      force: parseInt(document.getElementById("force").value),
      dex: parseInt(document.getElementById("dex").value),
      int: parseInt(document.getElementById("int").value),
      progression: {}
    };
    document.getElementById("select-joueur").innerHTML += `<option value="${nom}">${nom}</option>`;
  }
  joueurActif = nom;
  document.getElementById("etage-zone").style.display = "block";
  afficherEpreuves();
}

function afficherEpreuves() {
  const zone = document.getElementById("epreuve-sequence");
  const bossZone = document.getElementById("boss-zone");
  const monstreZone = document.getElementById("monstre-zone");

  zone.innerHTML = "";
  bossZone.innerHTML = "";
  monstreZone.innerHTML = "";

  const joueur = joueurs[joueurActif];
  const progression = joueur.progression || {};

  const epreuves = [
    { id: 'force', label: "Test de Force", stat: 'force', narration: "Un rocher bloque le passage." },
    { id: 'dex', label: "Test de Dextérité", stat: 'dex', narration: "Des pièges surgissent sous vos pieds." },
    { id: 'int', label: "Test d'Intelligence", stat: 'int', narration: "Une énigme vous barre la route." }
  ];

  epreuves.forEach(ep => {
    const div = document.createElement("div");
    div.className = "epreuve";

    div.innerHTML = `
      <h3>${ep.label}</h3>
      <p class="narration">${ep.narration}</p>
      ${progression[ep.id] === "succès" ? `<div class="resultat">✅ Épreuve réussie !</div>` :
       `<button class="btn" onclick="lancerEpreuve('${ep.id}', '${ep.stat}')">Tenter l'épreuve</button>
       <div class="resultat" id="result-${ep.id}">${progression[ep.id] === "échec" ? "❌ Échec, réessaie." : ""}</div>`}
    `;

    zone.appendChild(div);
  });

  verifierBoss();
}

function lancerEpreuve(id, stat) {
  const joueur = joueurs[joueurActif];
  const jet = Math.floor(Math.random() * 6) + 1 + joueur[stat];
  const succes = jet >= 7;
  joueur.progression[id] = succes ? "succès" : "échec";
  localStorage.setItem("joueurs", JSON.stringify(joueurs));

  const result = document.getElementById(`result-${id}`);
  result.innerHTML = succes ? "✅ Épreuve réussie !" : "❌ Échec, réessaie.";
  afficherEpreuves();
}

function verifierBoss() {
  const joueur = joueurs[joueurActif];
  const prog = joueur.progression;
  if (prog.force === "succès" && prog.dex === "succès" && prog.int === "succès") {
    const zone = document.getElementById("boss-zone");
    if (prog.boss === "succès") {
      zone.innerHTML = `<div class="epreuve"><h3>Boss d'étage</h3><div class="resultat">🛡️ Boss vaincu !</div></div>`;
    } else {
      zone.innerHTML = `<div class="epreuve"><h3>Boss d'étage</h3>
        <button class="btn" onclick="affronterBoss()">Combattre le boss</button>
        <div class="resultat" id="result-boss"></div></div>`;
    }
  }
}

function affronterBoss() {
  const joueur = joueurs[joueurActif];
  const score = joueur.force + joueur.dex + joueur.int;
  const jet = Math.floor(Math.random() * 6) + 1 + score;
  const bossReussi = jet >= 15;
  joueur.progression.boss = bossReussi ? "succès" : "échec";
  localStorage.setItem("joueurs", JSON.stringify(joueurs));

  const result = document.getElementById('result-boss');
  result.innerHTML = bossReussi ? "✅ Boss vaincu !" : "❌ Échec contre le boss.";
  afficherEpreuves();
}

function remplirJoueur(nom) {
  if (!nom || !joueurs[nom]) return;
  joueurActif = nom;
  document.getElementById("joueurNom").value = nom;
  document.getElementById("force").value = joueurs[nom].force;
  document.getElementById("dex").value = joueurs[nom].dex;
  document.getElementById("int").value = joueurs[nom].int;
  document.getElementById("etage-zone").style.display = "block";
  afficherEpreuves();
}

function resetJoueur() {
  if (joueurActif) delete joueurs[joueurActif];
  localStorage.setItem("joueurs", JSON.stringify(joueurs));
  window.location.reload();
}
