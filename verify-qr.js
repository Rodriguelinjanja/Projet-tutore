import apiClient from './api-client.js';

async function verifyQRCode() {
  const ticketId = document.getElementById('ticketInput').value.trim();

  if (!ticketId) {
    alert('Veuillez entrer un numéro de ticket');
    return;
  }

  const resultContainer = document.getElementById('resultContainer');
  resultContainer.innerHTML = `
    <div class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Vérification...</span>
      </div>
    </div>
  `;

  try {
    const result = await apiClient.verifyQR(ticketId);

    if (!result.valid) {
      resultContainer.innerHTML = `
        <div class="alert alert-danger">
          <i class="bi bi-x-circle"></i> <strong>QR Code Invalide</strong>
          <p class="mb-0 mt-2">${result.message || 'Réservation introuvable'}</p>
        </div>
      `;
      return;
    }

    const res = result.reservation;
    const dateArrivee = new Date(res.date_arrivee).toLocaleDateString('fr-FR');
    const dateDepart = new Date(res.date_depart).toLocaleDateString('fr-FR');
    const statusColor = res.statut === 'confirmée' ? 'success' :
                       res.statut === 'en_attente' ? 'warning' : 'danger';

    resultContainer.innerHTML = `
      <div class="alert alert-success">
        <h4><i class="bi bi-check-circle"></i> QR Code Valide</h4>
      </div>

      <div class="card">
        <div class="card-body">
          <h5 class="card-title">
            Réservation ${res.ticket_id}
            <span class="badge bg-${statusColor}">${res.statut}</span>
          </h5>

          <h6 class="mt-3">Client</h6>
          <p class="mb-1"><strong>Nom:</strong> ${res.users.nom}</p>
          <p class="mb-1"><strong>Téléphone:</strong> ${res.users.telephone}</p>

          <h6 class="mt-3">Appartement</h6>
          <p class="mb-1"><strong>Type:</strong> ${res.appartements.type}</p>
          <p class="mb-1"><strong>Code:</strong> ${res.appartements.code}</p>
          <p class="mb-1"><strong>Quartier:</strong> ${res.appartements.quartier}</p>

          <h6 class="mt-3">Séjour</h6>
          <p class="mb-1"><strong>Arrivée:</strong> ${dateArrivee}</p>
          <p class="mb-1"><strong>Départ:</strong> ${dateDepart}</p>
          <p class="mb-1"><strong>Personnes:</strong> ${res.nb_adultes} adulte(s), ${res.nb_enfants} enfant(s)</p>
          ${res.motif ? `<p class="mb-1"><strong>Motif:</strong> ${res.motif}</p>` : ''}

          ${res.montant_total > 0 ? `
            <h6 class="mt-3">Paiement</h6>
            <p class="mb-1"><strong>Montant total:</strong> $${res.montant_total}</p>
            <p class="mb-1"><strong>Acompte payé:</strong> $${res.acompte}</p>
            <p class="mb-1"><strong>Reste à payer:</strong> $${res.montant_total - res.acompte}</p>
          ` : ''}

          <div class="text-center mt-3">
            <img src="${res.qr_code_url}" alt="QR Code" class="img-fluid" style="max-width: 150px;">
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Erreur vérification:', error);
    resultContainer.innerHTML = `
      <div class="alert alert-danger">
        <i class="bi bi-exclamation-triangle"></i> Erreur lors de la vérification
      </div>
    `;
  }
}

document.getElementById('btnVerify').addEventListener('click', verifyQRCode);

document.getElementById('ticketInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    verifyQRCode();
  }
});

const urlParams = new URLSearchParams(window.location.search);
const ticketId = urlParams.get('ticket_id');
if (ticketId) {
  document.getElementById('ticketInput').value = ticketId;
  verifyQRCode();
}
