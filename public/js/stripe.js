import axios from 'axios';
import { showAlert } from './alert';

export const bookTour = async (tourId) => {
  try {
    const stripe = Stripe(
      'pk_test_51JJAyFHf9EtUkfJZtbAmapLD0sgtXGYyKdt2Emp0ly2xqDBtx4fLbsvjks9fj3zhoNdEoQrd6dcklaK5ES5yw1ih006SUZ8eb2'
    );
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
