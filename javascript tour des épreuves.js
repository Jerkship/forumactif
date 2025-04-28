let joueurs = JSON.parse(localStorage.getItem('joueurs')) || {};
let joueurActif = null;
let etageActuel = 1;

function commencerDonjon() {
  const nom = document.getElementById('joueurNom').value.trim();
  if (!nom) return alert('Entrez un nom');

  if (!joueurs[nom]) {
    joueurs[nom] = {
      force: parseInt(document.getElementById('force').value),
      dex: parseInt(document.getElementById('dex').value),
      int: parseInt(document.getElementById('int').value),
      progression: {}
    };
    document.getElementById('select-joueur').innerHTML += `<option value="${nom}">${nom}</option>`;
  }
  joueurActif = nom;
  etageActuel = joueurs[nom].etage || 1;
  document.getElementById('zone-donjon').style.display = "block";
  afficherEtage();
}

function afficherEtage() {
  document.getElementById('etage').textContent = etageActuel;
  document.getElementById('narration-etage').innerHTML = `<p>Vous entrez dans l'étage ${etageActuel}. De nouvelles épreuves et dangers vous attendent...</p>`;
  afficherEpreuves();
}

function afficherEpreuves() {
  const zone = document.getElementById('epreuves');
  zone.innerHTML = '';
  
  ['force', 'dex', 'int'].forEach(stat => {
    let div = document.createElement('div');
    div.className = 'epreuve';
    div.innerHTML = `
      <h3>Test de ${stat.charAt(0).toUpperCase() + stat.slice(1)}</h3>
      <p class="narration">Affrontez une épreuve liée à votre ${stat}.</p>
      <button onclick="lancerEpreuve('${stat}')">Tenter</button>
    `;
    zone.appendChild(div);
  });
  afficherMonstres();
}

function lancerEpreuve(stat) {
  const jet = Math.floor(Math.random() * 6) + 1 + joueurs[joueurActif][stat];
  if (jet >= 7) {
    alert("Épreuve réussie !");
  } else {
    alert("Épreuve échouée !");
  }
}

function afficherMonstres() {
  const zone = document.getElementById('zone-monstres');
  zone.innerHTML = `<div class="monstre">
    <h3>Monstres rencontrés</h3>
    <p>3 ennemis surgissent !</p>
    <button onclick="affronterMonstres()">Affronter</button>
  </div>`;
}

function affronterMonstres() {
  alert("Combat contre les monstres engagé !");
}

function chargerJoueur(nom) {
  if (!nom) return;
  joueurActif = nom;
  document.getElementById('joueurNom').value = nom;
  document.getElementById('force').value = joueurs[nom].force;
  document.getElementById('dex').value = joueurs[nom].dex;
  document.getElementById('int').value = joueurs[nom].int;
  commencerDonjon();
}

function resetJoueur() {
  if (confirm("Effacer ce joueur ?")) {
    delete joueurs[joueurActif];
    localStorage.setItem('joueurs', JSON.stringify(joueurs));
    window.location.reload();
  }
}

localStorage.setItem('joueurs', JSON.stringify(joueurs));
