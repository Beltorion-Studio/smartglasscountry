import {removeChat} from './utils/removeChat';

document.addEventListener('DOMContentLoaded', function () {
  window.Webflow ||= [];
  window.Webflow.push(() => {
    console.log('DOM content loaded');
    redirects()
    removeChat();
  });
});

function redirects() {
    const buySmartGlassBtn = document.querySelector("[bo-elements='buySmartGlassBtn']") as HTMLButtonElement;
    const buySampleBtn = document.querySelector("[bo-elements='buySampleBtn']") as HTMLButtonElement;

    buySmartGlassBtn.addEventListener('click', () => redirectToCalculator());
    buySampleBtn.addEventListener('click', () => redirectToSamples());

    function redirectToCalculator() {
        window.location.href = '/calculator';
    }

    function redirectToSamples() {
        window.location.href = 'samples.html';
    }
}