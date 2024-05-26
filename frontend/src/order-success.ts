document.addEventListener('DOMContentLoaded', function () {
  window.Webflow ||= [];
  window.Webflow.push(() => {
    console.log('DOM content loaded2');
    const urlParams = new URLSearchParams(window.location.search);
    const orderCompleted = urlParams.get('orderCompleted');

    if (orderCompleted === 'true') {
      sessionStorage.removeItem('orderToken');
    }
  });
});
