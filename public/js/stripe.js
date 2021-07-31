import axios from 'axios';
import { showAlert } from './alert';

export const bookTour = async (tourId) => {
  try {
    const stripe = Stripe(`${process.env.STRIPE_PUBLIC_KEY}`);
    // 1) Get session from the server /checkout-session/:tourId
    const session = await axios(
      `http://127.0.0.1:8000/api/v1/bookings/checkout-session/${tourId}`
    );
    // 2) Create checkout form with Stripe object + charge credit crad
    return stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err);
  }
};
