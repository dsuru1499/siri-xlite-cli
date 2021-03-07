/* eslint-disable no-console */
import { from } from 'rxjs';
// eslint-disable-next-line object-curly-newline
import { mergeMap, reduce, concatMap, take, tap, filter } from 'rxjs/operators';
import http from './SiriService';
import * as T from '../types';

const StopMonitoringService = {
  get(options) {
    let url = '/siri-xlite/stop-monitoring';
    url += T.SEP + options[T.MONITORING_REF];
    console.time('stop-monitoring');
    return http.get(url).pipe(
      mergeMap((t) => from(t)),
    ).pipe(
      concatMap((t) => http.get(t.href), this.valid),
      filter((t) => t !== undefined),
      take(10),
      reduce((accumulator, value) => accumulator.concat(value), []),
      tap(() => console.timeEnd('stop-monitoring')),
    );
  },

  valid(t, v) {
    const { href } = t;
    const index = href.slice(href.lastIndexOf('#') + 1);
    const call = v.estimatedCalls[index];
    const expectedDepartureTime = Date.parse(`1970-01-01T${call.expectedDepartureTime}`);
    const now = (new Date()).setFullYear(1970, 0, 1);
    if (expectedDepartureTime > now) {
      return { ...v, index };
    }
    return undefined;
  },
};

export default StopMonitoringService;
