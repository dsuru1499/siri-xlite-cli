import http from './SiriService';
import * as T from '../types';

const URL = '/siri-xlite/lines-discovery';

const LinesDiscoveryService = {
  get(options) {
    let url = (process.env.NODE_ENV !== 'production') ? T.PRODUCTION_HOST + URL : URL;
    url += options && `?${Object.entries(options).map(([key, value]) => `${key}=${value}`).join('&')}`;
    return http.get(url);
  },
};

export default LinesDiscoveryService;
