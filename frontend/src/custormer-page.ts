import { removeChat } from './utils/removeChat';
import axios from 'axios';

document.addEventListener('DOMContentLoaded', function () {
  window.Webflow ||= [];
  window.Webflow.push(() => {
    console.log('DOM content loaded');
    redirects();
    removeChat();
  });
});

function redirects() {
  const buySmartGlassBtn = document.querySelector(
    "[bo-elements='buySmartGlassBtn']"
  ) as HTMLButtonElement;
  const buySampleBtn = document.querySelector("[bo-elements='buySampleBtn']") as HTMLButtonElement;

  buySmartGlassBtn.addEventListener('click', () => redirectToCalculator());
  buySampleBtn.addEventListener('click', () => redirectToSamples());

  function redirectToCalculator() {
    window.location.href = '/calculator';
  }

  function redirectToSamples() {
    location.assign('/samples.html');
  }

  function createOrder() {
    axios
      .get('http://127.0.0.1:8787/checkout')
      .then((response) => {
        // Handle the response data here
        console.log('Response:', response.data);
      })
      .catch((error) => {
        // Handle any errors that occur during the request
        console.error('Error:', error);
      });
  }
}
