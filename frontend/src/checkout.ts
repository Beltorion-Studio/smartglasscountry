import { removeChat } from './utils/removeChat';
declare const STRIPE_KEY: string;

document.addEventListener('DOMContentLoaded', function () {
  window.Webflow ||= [];
  window.Webflow.push(() => {
    console.log('DOM content loaded');
    removeChat();
  });
});

// This is your test publishable API key.
//const stripe = window.Stripe?.(STRIPE_KEY);
//initialize();

// Create a Checkout Session
async function initialize() {
  const fetchClientSecret = async () => {
    const response = await fetch('/create-checkout-session', {
      method: 'POST',
    });
    const { clientSecret } = await response.json();
    return clientSecret;
  };

  const checkout = await stripe.initEmbeddedCheckout({
    fetchClientSecret,
  });

  // Mount Checkout
  checkout.mount('#checkout');
}

async function init() {
  const stripe = window.Stripe?.(STRIPE_KEY);
  console.log(stripe);
  if (!stripe) {
    console.log('stripe not defined');
    return;
  }
  const stripeElement = document.querySelector<HTMLElement>('#checkout');
  if (!stripeElement) {
    console.log('stripe element not found');
    return;
  }
  const element = stripe.elements();
  const cardElement = element.create('card', {});
  cardElement.mount(stripeElement);
}
//init();
