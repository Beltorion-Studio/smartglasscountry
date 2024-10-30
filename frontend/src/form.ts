import { FormManager } from './components/FormManager';

function initializeForm() {
  if (window.Zod) {
    const formValidator = new FormManager('#wf-form-Contact-Details');
    formValidator.initialize();
  } else {
    setTimeout(initializeForm, 50); // Check again in 50ms
  }
}

document.addEventListener('DOMContentLoaded', function () {
  window.Webflow ||= [];
  window.Webflow.push(initializeForm);
});
