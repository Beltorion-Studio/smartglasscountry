import { removeChat } from './utils/removeChat';
import { ApiServices } from 'src/services/ApiServices';
const loadingElement = document.querySelector("[bo-elements='page-loader']") as HTMLElement;
const mainContentElement = document.querySelector('.page-content-wr') as HTMLElement;

document.addEventListener('DOMContentLoaded', async function () {
  const token: string = window.sessionStorage.getItem('jwt') || '';  if (token) {
    const isExpired = await checkTokenExpiration(token);
    if (isExpired) {
      window.sessionStorage.removeItem('jwt');
      redirectToLogin();
    } else {
      window.Webflow ||= [];
      window.Webflow.push(() => {
        removeChat();
        getSamples(token);
      });
    }
  } else {
    redirectToLogin();
  }
});

async function getSamples(token: string) {
  displayLoading(true);

  if (!token) {
    redirectToLogin();
    return;
  }

  try {
    const response = await fetch('http://127.0.0.1:8787/samples', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      sessionStorage.removeItem('jwt');
      redirectToLogin();
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    displayLoading(false);
    console.log(responseData);
    // Handle your response data here
  } catch (error) {
    console.error('Error fetching samples:', error);
    // Optionally redirect to an error page or show an error message
  }
}

function displayLoading(show: boolean) {
  if (show) {
    loadingElement.style.display = 'flex';
    mainContentElement.style.display = 'none';
  } else {
    loadingElement.style.display = 'none';
    mainContentElement.style.display = 'block';
  }
}

function redirectToLogin() {
  location.assign('/smart-center/log-in');
}

async function checkTokenExpiration(token: string): Promise<boolean> {
  try {
    // Decode token to check the expiration time
    const base64Url: string = token.split('.')[1];
    const base64: string = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const { exp } = JSON.parse(jsonPayload) as { exp: number };
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime > exp;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // Assume the token is expired if there's an error
  }
}
function formatExpirationTime(exp: number): string {
  const expirationDate = new Date(exp * 1000);
  const options = { timeZone: 'Europe/Budapest', timeZoneName: 'short' };
  return expirationDate.toLocaleString('en-US', options);
}
// Initially hide main content and show loading
displayLoading(true);
