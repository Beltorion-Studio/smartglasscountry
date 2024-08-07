document.addEventListener('DOMContentLoaded', function () {
  window.Webflow ||= [];
  window.Webflow.push(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderCompleted = urlParams.get('orderCompleted');

    if (orderCompleted === 'true') {
      sessionStorage.removeItem('orderToken');
    }
  });
});
