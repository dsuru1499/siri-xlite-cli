/* eslint-disable max-len */
/* eslint-disable no-mixed-operators */

import { from } from 'rxjs';
import { mergeMap, reduce } from 'rxjs/operators';
import http from './SiriService';
import * as T from '../types';

const URL = '/siri-xlite/stoppoints-discovery';

const StopPointsDiscoveryService = {
  get(options) {
    if (options) {
      const upperLeft = this.toTile(options[T.UPPER_LEFT_LONGITUDE], options[T.UPPER_LEFT_LATITUDE], T.ZOOM);
      const lowerRight = this.toTile(options[T.LOWER_RIGHT_LONGITUDE], options[T.LOWER_RIGHT_LATITUDE], T.ZOOM);
      const urls = [];

      for (let y = upperLeft[1]; y <= lowerRight[1]; y += 1) {
        for (let x = upperLeft[0]; x <= lowerRight[0]; x += 1) {
          let url = (process.env.NODE_ENV !== 'production') ? T.DEVELOPEMENT_HOST : '';
          url += URL + T.SEP + x + T.SEP + y;
          urls.push(url);
        }
      }

      return from(urls).pipe(
        mergeMap((url) => http.get(url)),
        reduce((accumulator, value) => accumulator.concat(value)),
      );
    }
    let url = URL;
    url += options && `?${Object.entries(options).map(([key, value]) => `${key}=${value}`).join('&')}`;
    return http.get(url);
  },

  toTile(lon, lat, zoom) {
    const n = (2 ** zoom);
    const x = Math.floor((lon + 180) / 360 * n);
    const y = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * n);
    return [x, y];
  },
};

export default StopPointsDiscoveryService;
