export function removeChat() {
    setTimeout(() => {
      const chat = document.querySelector('#lc_text-widget--btn');
      if (chat) {
        chat.remove();
      }
    }, 3000);
  }
  