/* eslint-disable no-console */
import { empty, from } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { mergeMap, reduce, concatMap, take, tap } from 'rxjs/operators';

import * as T from '../types';

const URL = '/siri-xlite/stop-monitoring';

const StopMonitoringService = {
  get(options) {
    let url = (process.env.NODE_ENV !== 'production') ? T.PRODUCTION_HOST + URL : URL;
    url += T.SEP + options[T.MONITORING_REF];    
    console.time('stop-monitoring');
    return ajax.getJSON(url).pipe(
      mergeMap((t) => from(t)),
    ).pipe(
      concatMap((t) => ajax.getJSON(t.href), this.isValid),
      take(10),
      reduce((accumulator, value) => accumulator.concat(value), []),
      tap(() => console.timeEnd('stop-monitoring')),
    );
  },

  isValid(t, v) {
    const { href } = t;
    const index = href.slice(href.lastIndexOf('#') + 1);
    const call = v.estimatedCalls[index];
    const expectedDepartureTime = Date.parse(`1970-01-01T${call.expectedDepartureTime}Z`);
    const now = (new Date()).setFullYear(1970, 0, 1);
    const result = { ...v, index };
    return (expectedDepartureTime > now) ? result : empty();
  },
};

export default StopMonitoringService;
