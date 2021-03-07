/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-console */
import { from } from 'rxjs';
import * as T from '../types';

const SiriService = {

  absolute(url) {
    const r = new RegExp('^(?:[a-z]+:)?//', 'i');
    return r.test(url);
  },

  get(url) {
    const request = ((process.env.NODE_ENV !== 'production') && !this.absolute(url)) ? T.DEVELOPEMENT_HOST + url : url;

    return from(fetch(request, { headers: { Accept: 'application/json' } })
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
