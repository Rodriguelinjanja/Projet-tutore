import apiClient from '../api-client.js';

// Vérification session admin
const adminSession = sessionStorage.getItem('adminSession');
if (!adminSession) {
  window.location.href = '/admin/';
} else {
  const admin = JSON.parse(adminSession);
  document.getElementById('adminName').textContent = admin.nom;
}

// Déconnexion
document.getElementById('btnLogout').addEventListener('click', () => {
  sessionStorage.removeItem('adminSession');
  window.location.href = '/admin/';
});

// Section courante
let currentSection = 'appartements';
let currentEditId = null;

// Gestion clics menu
document.querySelectorAll('[data-section]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelectorAll('[data-section]').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
    currentSection = this.dataset.section;
    loadSection(currentSection);
  });
});

// Charger la section correspondante
async function loadSection(section) {
  const contentArea = document.getElementById('contentArea');
  contentArea.innerHTML = '<div class="text-center"><div class="spinner-border text-primary"></div></div>';

  try {
    switch (section) {
      case 'appartements':
        await loadAppartements();
        break;
      case 'reservations':
        await loadReservations();
        break;
      case 'tickets':
        await loadTickets();
        break;
      case 'paiements':
        await loadPaiements();
        break;
      case 'verify':
        loadVerifyQR();
        break;
    }
  } catch (error) {
    console.error('Erreur chargement section:', error);
    contentArea.innerHTML = '<div class="alert alert-danger">Erreur de chargement</div>';
  }
}

/*---------------------- APPARTEMENTS ----------------------*/
async function loadAppartements() {
  const appartements = await apiClient.getAppartements();
  const contentArea = document.getElementById('contentArea');

  contentArea.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2><i class="bi bi-building"></i> Gestion des Appartements</h2>
      <button class="btn btn-primary" onclick="window.createAppartement()">
        <i class="bi bi-plus"></i> Nouvel Appartement
      </button>
    </div>

    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>Code</th>
            <th>Type</th>
            <th>Quartier</th>
            <th>Chambres</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${appartements.map(app => {
            const statusColor = app.statut === 'disponible' ? 'success' : app.statut === 'loué' ? 'danger' : 'warning';
            return `
              <tr>
                <td>${app.code}</td>
                <td>${app.type}</td>
                <td>${app.quartier}</td>
                <td>${app.nb_chambres}</td>
                <td><span class="badge bg-${statusColor}">${app.statut}</span></td>
                <td>
                  <button class="btn btn-sm btn-outline-primary" onclick="window.editAppartement('${app.id}')">
                    <i class="bi bi-pencil"></i> Modifier
                  </button>
                  <button class="btn btn-sm btn-outline-danger" onclick="window.deleteAppartement('${app.id}', '${app.code}')">
                    <i class="bi bi-trash"></i> Supprimer
                  </button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// Création d'un nouvel appartement
window.createAppartement = function() {
  currentEditId = null;
  document.getElementById('appartementModalTitle').textContent = 'Nouvel Appartement';
  document.getElementById('appartementForm').reset();
  document.getElementById('appartement_edit_id').value = '';
  const modal = new bootstrap.Modal(document.getElementById('appartementModal'));
  modal.show();
};

// Éditer un appartement
window.editAppartement = async function(id) {
  currentEditId = id;
  const app = await apiClient.getAppartements(id);

  document.getElementById('appartementModalTitle').textContent = 'Modifier Appartement';
  document.getElementById('appartement_edit_id').value = id;
  document.getElementById('app_code').value = app.code;
  document.getElementById('app_quartier').value = app.quartier;
  document.getElementById('app_type').value = app.type;
  document.getElementById('app_nb_chambres').value = app.nb_chambres;
  document.getElementById('app_statut').value = app.statut;
  document.getElementById('app_description').value = app.description || '';
  document.getElementById('app_equipements').value = app.equipements || '';

  const modal = new bootstrap.Modal(document.getElementById('appartementModal'));
  modal.show();
};

// Supprimer un appartement
window.deleteAppartement = async function(id, code) {
  if (!confirm(`Supprimer l'appartement ${code} ?`)) return;

  try {
    await apiClient.deleteAppartement(id);
    loadAppartements();
  } catch (error) {
    alert('Erreur lors de la suppression');
  }
};

// Sauvegarde appartement
document.getElementById('btnSaveAppartement').addEventListener('click', async function() {
  const form = document.getElementById('appartementForm');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = {
    code: document.getElementById('app_code').value,
    quartier: document.getElementById('app_quartier').value,
    type: document.getElementById('app_type').value,
    nb_chambres: parseInt(document.getElementById('app_nb_chambres').value),
    statut: document.getElementById('app_statut').value,
    description: document.getElementById('app_description').value,
    equipements: document.getElementById('app_equipements').value
  };

  try {
    if (currentEditId) {
      await apiClient.updateAppartement(currentEditId, data);
    } else {
      await apiClient.createAppartement(data);
    }
    bootstrap.Modal.getInstance(document.getElementById('appartementModal')).hide();
    loadAppartements();
  } catch (error) {
    console.error('Erreur sauvegarde:', error);
    alert('Erreur lors de la sauvegarde');
  }
});

/*---------------------- RESERVATIONS ----------------------*/
async function loadReservations() {
  const reservations = await apiClient.getReservations();
  const contentArea = document.getElementById('contentArea');

  contentArea.innerHTML = `
    <h2 class="mb-4"><i class="bi bi-calendar-check"></i> Gestion des Réservations</h2>
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Client</th>
            <th>Appartement</th>
            <th>Arrivée</th>
            <th>Départ</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          ${reservations.map(res => {
            const statusColor = res.statut === 'confirmée' ? 'success' : res.statut === 'en_attente' ? 'warning' : 'danger';
            return `
              <tr>
                <td>${res.ticket_id}</td>
                <td>${res.users.nom}</td>
                <td>${res.appartements.type}</td>
                <td>${new Date(res.date_arrivee).toLocaleDateString('fr-FR')}</td>
                <td>${new Date(res.date_depart).toLocaleDateString('fr-FR')}</td>
                <td><span class="badge bg-${statusColor}">${res.statut}</span></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

/*---------------------- TICKETS ----------------------*/
async function loadTickets() {
  const tickets = await apiClient.getTickets();
  const contentArea = document.getElementById('contentArea');

  contentArea.innerHTML = `
    <h2 class="mb-4"><i class="bi bi-ticket"></i> Tickets Support</h2>
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Réservation</th>
            <th>Sujet</th>
            <th>Message</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          ${tickets.map(ticket => {
            const date = new Date(ticket.created_at).toLocaleDateString('fr-FR');
            const statusColor = ticket.statut === 'ouvert' ? 'warning' : 'success';
            return `
              <tr>
                <td>${date}</td>
                <td>${ticket.reservations.ticket_id}</td>
                <td>${ticket.sujet}</td>
                <td>${ticket.message}</td>
                <td><span class="badge bg-${statusColor}">${ticket.statut}</span></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

/*---------------------- PAIEMENTS ----------------------*/
async function loadPaiements() {
  const paiements = await apiClient.getPaiements();
  const contentArea = document.getElementById('contentArea');

  contentArea.innerHTML = `
    <h2 class="mb-4"><i class="bi bi-cash"></i> Gestion des Paiements</h2>
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Réservation</th>
            <th>Type</th>
            <th>Montant</th>
          </tr>
        </thead>
        <tbody>
          ${paiements.map(p => {
            const date = new Date(p.date).toLocaleDateString('fr-FR');
            return `
              <tr>
                <td>${date}</td>
                <td>${p.reservations.ticket_id}</td>
                <td>${p.type_paiement}</td>
                <td>$${p.montant}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

/*---------------------- VERIFIER QR ----------------------*/
function loadVerifyQR() {
  const contentArea = document.getElementById('contentArea');
  contentArea.innerHTML = `
    <h2 class="mb-4"><i class="bi bi-qr-code-scan"></i> Vérifier un QR Code</h2>
    <div class="card">
      <div class="card-body">
        <div class="mb-3">
          <label class="form-label">Numéro de ticket</label>
          <div class="input-group">
            <input type="text" class="form-control" id="adminTicketInput" placeholder="AA-...">
            <button class="btn btn-primary" id="btnAdminVerify">
              <i class="bi bi-search"></i> Vérifier
            </button>
          </div>
        </div>
        <div id="adminVerifyResult"></div>
      </div>
    </div>
  `;

  document.getElementById('btnAdminVerify').addEventListener('click', async () => {
    const ticketId = document.getElementById('adminTicketInput').value.trim();
    if (!ticketId) return;

    const resultDiv = document.getElementById('adminVerifyResult');
    resultDiv.innerHTML = '<div class="spinner-border text-primary"></div>';

    try {
      const result = await apiClient.verifyQR(ticketId);

      if (!result.valid) {
        resultDiv.innerHTML = `<div class="alert alert-danger mt-3">QR Code Invalide</div>`;
        return;
      }

      const res = result.reservation;
      const dateArrivee = new Date(res.date_arrivee).toLocaleDateString('fr-FR');
      const dateDepart = new Date(res.date_depart).toLocaleDateString('fr-FR');

      resultDiv.innerHTML = `
        <div class="alert alert-success mt-3">QR Code Valide</div>
        <div class="card mt-3">
          <div class="card-body">
            <h5>Client: ${res.users.nom}</h5>
            <p>Téléphone: ${res.users.telephone}</p>
            <p>Appartement: ${res.appartements.type} - ${res.appartements.quartier}</p>
            <p>Du ${dateArrivee} au ${dateDepart}</p>
            <p>Statut: <span class="badge bg-${res.statut === 'confirmée' ? 'success' : 'warning'}">${res.statut}</span></p>
          </div>
        </div>
      `;
    } catch (error) {
      resultDiv.innerHTML = `<div class="alert alert-danger mt-3">Erreur de vérification</div>`;
    }
  });
}

// Initialisation
loadSection(currentSection);