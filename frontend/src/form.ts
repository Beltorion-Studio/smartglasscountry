import { FormManager } from './components/FormManager';

document.addEventListener('DOMContentLoaded', function () {
  window.Webflow ||= [];
  window.Webflow.push(() => {
    const formValidator = new FormManager('#wf-form-Contact-Details');
    formValidator.initialize();
  });
});
