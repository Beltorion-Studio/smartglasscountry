import { removeChat } from './utils/removeChat';
import { FormManager } from './components/FormManager';

document.addEventListener('DOMContentLoaded', function () {
  window.Webflow ||= [];
  window.Webflow.push(() => {
    console.log('DOM content loaded2');
    removeChat();
    const formValidator = new FormManager('#wf-form-Contact-Details');
    formValidator.initialize();
  });
});
