/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-console */

import { from } from 'rxjs';

const SiriService = {
  get(url) {
    return from(fetch(url, { headers: { Accept: 'application/json' } })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        if (response.status === 400) {
          return Promise.reject(response.json());
        }
        return Promise.reject({ errorCode: response.status, errorText: response.statusText });
      })
      .catch((error) => Promise.reject({ errorCode: 600, errorText: error.message })));
  },
};

export default SiriService;
