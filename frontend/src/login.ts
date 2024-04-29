import { removeChat } from './utils/removeChat';
import { globalSettings } from 'src/settings/globalSettings';

document.addEventListener('DOMContentLoaded', function () {
  window.Webflow ||= [];
  window.Webflow.push(() => {
    console.log('DOM content loaded');
    logIn();
    removeChat();
  });
});

function logIn() {
  const loginForm = document.querySelector('#wf-form-Log-In-Form') as HTMLFormElement;
  if (!loginForm) {
    console.error('Login form not found');
    return;
  }
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const formData = new FormData(loginForm);
    const email = formData.get('email');
    const password = formData.get('Password');
    // Send login request to your backend
    const response = await fetch(globalSettings.loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      // Store the token in localStorage or sessionStorage
      window.sessionStorage.setItem('jwt', data.token);
      // Redirect to the dashboard
      //window.location.href = '/smart-center/dashboard';
      location.assign('/smart-center/dashboard');
    } else {
      console.log('Login failed');
    }
  });
}
