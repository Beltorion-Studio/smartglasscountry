export function removeChat() {
    setTimeout(() => {
      const chat = document.querySelector('jdiv');
      if (chat) {
        chat.remove();
      }
    }, 3000);
  }
  