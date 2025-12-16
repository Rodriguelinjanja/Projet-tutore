import apiClient from './api-client.js';

const lastPhone = localStorage.getItem('lastReservationPhone');
if (lastPhone) {
  document.getElementById('phoneSearch').value = lastPhone;
}

async function searchReservations() {
  const searchValue = document.getElementById('phoneSearch').value.trim();

  if (!searchValue) {
    alert('Veuillez entrer un numéro de téléphone ou un ticket');
    return;
  }

  const container = document.getElementById('reservationsContainer');
  container.innerHTML = `
    <div class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>
  `;

  try {
    let reservations;

    if (searchValue.startsWith('AA-')) {
      const result = await apiClient.getReservations(null, searchValue);
      reservations = result ? [result] : [];
    } else {
      const allReservations = await apiClient.getReservations();
      reservations = allReservations.filter(r => r.users.telephone === searchValue);
    }

    if (reservations.length === 0) {
      container.innerHTML = `
        <div class="alert alert-warning">
          <i class="bi bi-exclamation-triangle"></i> Aucune réservation trouvée
        </div>
      `;
      return;
    }

    displayReservations(reservations);
  } catch (error) {
    console.error('Erreur recherche réservations:', error);
    container.innerHTML = `
      <div class="alert alert-danger">
        Erreur lors de la recherche
      </div>
    `;
  }
}

function displayReservations(reservations) {
  const container = document.getElementById('reservationsContainer');

  container.innerHTML = reservations.map(res => {
    const statusColor = res.statut === 'confirmée' ? 'success' :
                       res.statut === 'en_attente' ? 'warning' : 'danger';

    const dateArrivee = new Date(res.date_arrivee).toLocaleDateString('fr-FR');
    const dateDepart = new Date(res.date_depart).toLocaleDateString('fr-FR');

    return `
      <div class="card mb-3">
        <div class="card-body">
          <div class="row">
            <div class="col-md-8">
              <h5 class="card-title">
                <i class="bi bi-house"></i> ${res.appartements.type}
                <span class="badge bg-${statusColor} ms-2">${res.statut}</span>
              </h5>
              <p class="mb-2"><strong>Ticket:</strong> ${res.ticket_id}</p>
              <p class="mb-2">
                <i class="bi bi-geo-alt"></i> ${res.appartements.quartier} - ${res.appartements.code}
              </p>
              <p class="mb-2">
                <i class="bi bi-calendar"></i> Du ${dateArrivee} au ${dateDepart}
              </p>
              <p class="mb-2">
                <i class="bi bi-people"></i> ${res.nb_adultes} adulte(s), ${res.nb_enfants} enfant(s)
              </p>
              ${res.montant_total > 0 ? `<p class="mb-2"><strong>Montant:</strong> $${res.montant_total} (Acompte: $${res.acompte})</p>` : ''}
            </div>
            <div class="col-md-4 text-center">
              <img src="${res.qr_code_url}" alt="QR Code" class="img-fluid mb-2" style="max-width: 150px;">
              <button class="btn btn-sm btn-outline-primary" onclick="viewDetails('${res.id}')">
                <i class="bi bi-eye"></i> Détails
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.viewDetails = async function(reservationId) {
  try {
    const allReservations = await apiClient.getReservations();
    const reservation = allReservations.find(r => r.id === reservationId);

    if (!reservation) {
      alert('Réservation introuvable');
      return;
    }

    const dateArrivee = new Date(reservation.date_arrivee).toLocaleDateString('fr-FR');
    const dateDepart = new Date(reservation.date_depart).toLocaleDateString('fr-FR');

    const images = reservation.appartements.appartement_images || [];
    const carouselImages = images.length > 0
      ? images.map((img, index) => `
          <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <img src="${img.url}" class="d-block w-100" style="height: 300px; object-fit: cover;" alt="Image ${index + 1}">
          </div>
        `).join('')
      : `<div class="carousel-item active">
          <img src="https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600"
               class="d-block w-100" style="height: 300px; object-fit: cover;" alt="Pas d'image">
         </div>`;

    document.getElementById('modalDetailBody').innerHTML = `
      <div id="carouselDetail" class="carousel slide mb-3" data-bs-ride="carousel">
        <div class="carousel-inner">
          ${carouselImages}
        </div>
        ${images.length > 1 ? `
          <button class="carousel-control-prev" type="button" data-bs-target="#carouselDetail" data-bs-slide="prev">
            <span class="carousel-control-prev-icon"></span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#carouselDetail" data-bs-slide="next">
            <span class="carousel-control-next-icon"></span>
          </button>
        ` : ''}
      </div>

      <h5>Informations Client</h5>
      <p><strong>Nom:</strong> ${reservation.users.nom}</p>
      <p><strong>Téléphone:</strong> ${reservation.users.telephone}</p>

      <h5 class="mt-3">Informations Appartement</h5>
      <p><strong>Type:</strong> ${reservation.appartements.type}</p>
      <p><strong>Code:</strong> ${reservation.appartements.code}</p>
      <p><strong>Quartier:</strong> ${reservation.appartements.quartier}</p>
      <p><strong>Chambres:</strong> ${reservation.appartements.nb_chambres}</p>

      <h5 class="mt-3">Détails de la réservation</h5>
      <p><strong>Ticket:</strong> ${reservation.ticket_id}</p>
      <p><strong>Statut:</strong> <span class="badge bg-${reservation.statut === 'confirmée' ? 'success' : reservation.statut === 'en_attente' ? 'warning' : 'danger'}">${reservation.statut}</span></p>
      <p><strong>Arrivée:</strong> ${dateArrivee}</p>
      <p><strong>Départ:</strong> ${dateDepart}</p>
      <p><strong>Adultes:</strong> ${reservation.nb_adultes} | <strong>Enfants:</strong> ${reservation.nb_enfants}</p>
      ${reservation.motif ? `<p><strong>Motif:</strong> ${reservation.motif}</p>` : ''}
      ${reservation.montant_total > 0 ? `
        <p><strong>Montant total:</strong> $${reservation.montant_total}</p>
        <p><strong>Acompte:</strong> $${reservation.acompte}</p>
        <p><strong>Reste à payer:</strong> $${reservation.montant_total - reservation.acompte}</p>
      ` : ''}

      <h5 class="mt-3">QR Code</h5>
      <div class="text-center">
        <img src="${reservation.qr_code_url}" alt="QR Code" class="img-fluid" style="max-width: 200px;">
      </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById('reservationDetailModal'));
    modal.show();
  } catch (error) {
    console.error('Erreur chargement détails:', error);
    alert('Erreur lors du chargement des détails');
  }
};

document.getElementById('btnSearch').addEventListener('click', searchReservations);

document.getElementById('phoneSearch').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    searchReservations();
  }
});
