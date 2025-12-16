import apiClient from '../api-client.js';

const adminSession = sessionStorage.getItem('adminSession');
if (adminSession) {
  window.location.href = '/admin/dashboard.html';
}

document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const telephone = document.getElementById('telephone').value;
  const password = document.getElementById('password').value;

  const btnLogin = document.getElementById('btnLogin');
  const originalText = btnLogin.innerHTML;
  btnLogin.disabled = true;
  btnLogin.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Connexion...';

  const errorAlert = document.getElementById('errorAlert');
  errorAlert.classList.add('d-none');

  try {
    const result = await apiClient.adminLogin(telephone, password);

    if (result.success) {
      sessionStorage.setItem('adminSession', JSON.stringify(result.admin));
      window.location.href = '/admin/dashboard.html';
    } else {
      errorAlert.textContent = result.message || 'Identifiants incorrects';
      errorAlert.classList.remove('d-none');
    }
  } catch (error) {
    console.error('Erreur login:', error);
    errorAlert.textContent = 'Erreur de connexion. Veuillez réessayer.';
    errorAlert.classList.remove('d-none');
  } finally {
    btnLogin.disabled = false;
    btnLogin.innerHTML = originalText;
  }
});
