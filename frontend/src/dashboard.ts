import { DashboardManager } from './components/DashboardManager'
import { removeChat } from './utils/removeChat';

document.addEventListener('DOMContentLoaded', function () {
  window.Webflow ||= [];
  window.Webflow.push(() => {
    console.log('DOM content loaded');
    removeChat();
    new DashboardManager();
  });
});
