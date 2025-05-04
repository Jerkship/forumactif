
// script-tour-des-epreuves.js
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
  zone.innerHTML = "";
  bossZone.innerHTML = "";

  const joueur = joueurs[joueurActif];
  const progression = joueur.progression || {};

  const epreuves = [
    { id: 'force', label: "Test de Force", stat: 'force', narration: "Un rocher bloque le passage." },
    { id: 'dex', label: "Test de Dextérité", stat: 'dex', narration: "Des lames jaillissent du sol." },
    { id: 'int', label: "Test d'Intelligence", stat: 'int', narration: "Une énigme gravée sur un mur." }
  ];

  epreuves.forEach(ep => {
    const div = document.createElement("div");
    div.className = "epreuve";

    let contenu = `<h3>${ep.label}</h3><p>${ep.narration}</p>`;
    const etat = progression[ep.id];

    if (etat === "succès") {
      contenu += `<div class="resultat">✅ Réussi</div>`;
    } else {
      contenu += `
        <button class="btn" onclick="lancerEpreuve('${ep.id}', '${ep.stat}')">Tenter l'épreuve</button>
        <div class="resultat" id="result-${ep.id}">${etat === "échec" ? "❌ Échec" : ""}</div>
      `;
    }

    div.innerHTML = contenu;
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
  afficherEpreuves();
}

function verifierBoss() {
  const joueur = joueurs[joueurActif];
  const prog = joueur.progression;
  if (prog.force === "succès" && prog.dex === "succès" && prog.int === "succès") {
    const zone = document.getElementById("boss-zone");
    zone.innerHTML = `<div class='epreuve'><h3>Boss d'étage</h3>`;
    if (prog.boss === "succès") {
      zone.innerHTML += `<div class="resultat">🛡️ Boss vaincu !</div>`;
    } else {
      zone.innerHTML += `<button class='btn' onclick="affronterBoss()">Combattre le boss</button><div class="resultat" id="result-boss"></div>`;
    }
    zone.innerHTML += `</div>`;
  }
}

function affronterBoss() {
  const joueur = joueurs[joueurActif];
  const score = joueur.force + joueur.dex + joueur.int;
  const jet = Math.floor(Math.random() * 6) + 1 + score;
  const bossReussi = jet >= 15;
  joueur.progression.boss = bossReussi ? "succès" : "échec";
  localStorage.setItem("joueurs", JSON.stringify(joueurs));
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
