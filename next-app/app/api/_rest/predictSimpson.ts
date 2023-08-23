import axios from 'axios';

import { PYTHON_API_ROUTES } from '../_constants';

export const predictSimpson = async function (key: string) {
  try {
    const { data } = await axios.post(PYTHON_API_ROUTES.PREDICT_SIMPSON, {
      key,
    });

    return data;
  } catch (e) {
    console.log(e);
  }
};