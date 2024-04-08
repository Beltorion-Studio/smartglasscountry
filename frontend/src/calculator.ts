import { cloneNode } from '@finsweet/ts-utils';
import { duplicatePanel } from './utils/duplicatePanel';
import { CalculatorUI } from './components/CalculatorUI';

document.addEventListener('DOMContentLoaded', function () {
  window.Webflow ||= [];
  window.Webflow.push(() => {
    console.log('DOM content loaded');
    duplicatePanel();
    removeChat();
    //const calculator = new Calculator();
    new CalculatorUI();
  });
});


function removeChat() {
  setTimeout(() => {
    const chat = document.querySelector('jdiv');
    if (chat) {
      chat.remove();
    }
  }, 3000);
}

function removeScript() {
  let scriptToRemove = document.querySelector(
    'script[src^="https://cdn.jsdelivr.net/npm/@beltorion/"]'
  );
  if (scriptToRemove) {
    scriptToRemove.onload = function () {
      scriptToRemove.remove();
      scriptToRemove.setAttribute('src', '');
    };
  } else {
    console.log('Script element not found.');
  }
}
