import axios from 'axios';
import { hideAlert, showAlert } from './alert';

export const signup = async (name, email, photo, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/users/signup',
      data: {
        name,
        email,
        photo,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Signed up successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    hideAlert();
    showAlert('error', err.response.data.message);
  }
};
