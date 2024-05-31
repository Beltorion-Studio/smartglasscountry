import { DashboardManager } from './components/DashboardManager';
const loadingElement = document.querySelector("[bo-elements='page-loader']") as HTMLElement;
const mainContentElement = document.querySelector("[bo-elements='page-wrapper']") as HTMLElement;

document.addEventListener('DOMContentLoaded', async function () {
  const token: string = window.sessionStorage.getItem('jwt') || '';
  if (token) {
    const isExpired = await checkTokenExpiration(token);
    if (isExpired) {
      window.sessionStorage.removeItem('jwt');
      redirectToLogin();
    } else {
      window.Webflow ||= [];
      window.Webflow.push(() => {
        displayLoading(false);

        new DashboardManager();
      });
    }
  } else {
    redirectToLogin();
  }
});

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

function displayLoading(show: boolean) {
  if (show) {
    loadingElement.style.display = 'flex';
    mainContentElement.style.display = 'none';
  } else {
    loadingElement.style.display = 'none';
    mainContentElement.style.display = 'block';
  }
}

displayLoading(true);
