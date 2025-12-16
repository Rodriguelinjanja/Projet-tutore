import { API_BASE_URL } from './config.js';

class APIClient {
  async request(entity, options = {}) {
    const { method = 'GET', params = {}, body = null } = options;

    let url = `${API_BASE_URL}?entity=${entity}`;
    Object.keys(params).forEach(key => {
      if (params[key]) url += `&${key}=${encodeURIComponent(params[key])}`;
    });

    const fetchOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (body && (method === 'POST' || method === 'PUT')) {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);
    return await response.json();
  }

  getAppartements(id = null) {
    return this.request('appartements', { params: id ? { id } : {} });
  }

  createAppartement(data) {
    return this.request('appartements', { method: 'POST', body: data });
  }

  updateAppartement(id, data) {
    return this.request('appartements', { method: 'PUT', params: { id }, body: data });
  }

  deleteAppartement(id) {
    return this.request('appartements', { method: 'DELETE', params: { id } });
  }

  addImage(appartementId, url, ordre = 0) {
    return this.request('images', {
      method: 'POST',
      body: { appartement_id: appartementId, url, ordre }
    });
  }

  deleteImage(id) {
    return this.request('images', { method: 'DELETE', params: { id } });
  }

  getReservations(userId = null, ticketId = null) {
    const params = {};
    if (userId) params.user_id = userId;
    if (ticketId) params.ticket_id = ticketId;
    return this.request('reservations', { params });
  }

  createReservation(data) {
    return this.request('reservations', { method: 'POST', body: data });
  }

  updateReservation(id, data) {
    return this.request('reservations', { method: 'PUT', params: { id }, body: data });
  }

  verifyQR(ticketId) {
    return this.request('verify_qr', { params: { ticket_id: ticketId } });
  }

  getTickets() {
    return this.request('tickets');
  }

  createTicket(data) {
    return this.request('tickets', { method: 'POST', body: data });
  }

  getPaiements(reservationId = null) {
    const params = reservationId ? { reservation_id: reservationId } : {};
    return this.request('paiements', { params });
  }

  createPaiement(data) {
    return this.request('paiements', { method: 'POST', body: data });
  }

  adminLogin(telephone, password) {
    return this.request('admin_login', {
      method: 'POST',
      body: { telephone, password }
    });
  }
}

export default new APIClient();
