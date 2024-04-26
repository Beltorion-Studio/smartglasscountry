import { removeChat } from './utils/removeChat';
import { ApiServices } from 'src/services/ApiServices';

document.addEventListener('DOMContentLoaded', function () {
  window.Webflow ||= [];
  window.Webflow.push(() => {
    console.log('DOM content loaded1');
    removeChat();
    getSamples();
  });
});

async function getSamples() {
  const token = window.sessionStorage.getItem('jwt');
  const apiService = new ApiServices('http://127.0.0.1:8787/samples');
  if (token) {
    //send toketn to server
    console.log(token);
    const response = await fetch('http://127.0.0.1:8787/samples', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });
   // console.log(response);
  }
  console.log('no token');
  const responseData = await apiService.fetchData();
  console.log(responseData);

}
