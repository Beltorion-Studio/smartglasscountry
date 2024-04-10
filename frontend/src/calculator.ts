import { duplicatePanel } from './utils/duplicatePanel';
import { CalculatorUI } from './components/CalculatorUI';
import {removeChat} from './utils/removeChat';

document.addEventListener('DOMContentLoaded', function () {
  window.Webflow ||= [];
  window.Webflow.push(() => {
    console.log('DOM content loaded');
    duplicatePanel();
    removeChat();
    new CalculatorUI();
  });
});




