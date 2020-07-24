import http from './SiriService';


const LinesDiscoveryService = {
  get(options) {
    let url = '/siri-xlite/lines-discovery';
    url += options && `?${Object.entries(options).map(([key, value]) => `${key}=${value}`).join('&')}`;
    return http.get(url);
  },
};

export default LinesDiscoveryService;
