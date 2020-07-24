import http from './SiriService';

const EstimatedTimetableService = {
  get(options) {
    let url = '/siri-xlite/estimated-timetable';
    url += options && `?${Object.entries(options).map(([key, value]) => `${key}=${value}`).join('&')}`;
    return http.get(url);
  },
};

export default EstimatedTimetableService;
