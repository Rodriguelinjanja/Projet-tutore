const selectAppartement = document.getElementById('appartementSelect');
const prixNuitSpan = document.getElementById('prixNuit');
const nbJoursSpan = document.getElementById('nbJours');
const montantTotalSpan = document.getElementById('montantTotal');

let appartements = [];

// Charger les appartements
fetch('api.php?get_appartements=1')
    .then(res => res.json())
    .then(json => {
        if (!json.success) return;

        appartements = json.data;

        appartements.forEach(app => {
            const opt = document.createElement('option');
            opt.value = app.id;
            opt.textContent = `${app.code} - ${app.quartier}`;
            opt.dataset.prix = app.prix_nuit;
            selectAppartement.appendChild(opt);
        });
    });

// Calcul automatique
function calculer() {
    const opt = selectAppartement.selectedOptions[0];
    if (!opt) return;

    const prix = parseFloat(opt.dataset.prix);
    const d1 = new Date(dateDebut.value);
    const d2 = new Date(dateFin.value);

    if (d1 && d2 && d2 > d1) {
        const jours = (d2 - d1) / (1000 * 3600 * 24);
        prixNuitSpan.textContent = prix;
        nbJoursSpan.textContent = jours;
        montantTotalSpan.textContent = prix * jours;
    }
}

selectAppartement.addEventListener('change', calculer);
dateDebut.addEventListener('change', calculer);
dateFin.addEventListener('change', calculer);

// Envoi réservation
document.getElementById('reservationForm').addEventListener('submit', e => {
    e.preventDefault();

    const fd = new FormData(e.target);
    fd.append('action', 'create_reservation');
    fd.append('user_id', 1); // ID utilisateur connecté

    fetch('/API/api.php', {
        method: 'POST',
        body: fd
    })
    .then(res => res.json())
    .then(json => {
        alert(json.success ? 'Réservation OK' : json.message);
    });
});
