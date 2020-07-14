import { handleActions } from 'redux-actions';

const reducers = handleActions(
  {
    'LINES_DISCOVERY/SUCCESS': (state, action) => ({ ...state, linesDiscovery: action.payload }),
    'LINES_DISCOVERY/FAILURE': (state) => ({ ...state, linesDiscovery: {} }),
    'STOP_POINTS_DISCOVERY/SUCCESS': (state, action) => ({ ...state, stopPointsDiscovery: action.payload }),
    'STOP_POINTS_DISCOVERY/FAILURE': (state) => ({ ...state, stopPointsDiscovery: {} }),
    'STOP_MONITORING/SUCCESS': (state, action) => {
      const result = { ...state };
      result.stopMonitoring[action.meta.name] = action.payload;
      return result;
    },
    'STOP_MONITORING/FAILURE': (state, action) => {
      const result = { ...state };
      delete result.stopMonitoring[action.meta.name];
      return result;
    },
    'ESTIMATED_TIMETABLE/SUCCESS': (state, action) => {
      const result = { ...state };
      result.estimatedTimetable[action.meta.name] = action.payload;
      return result;
    },
    'ESTIMATED_TIMETABLE/FAILURE': (state, action) => {
      const result = { ...state };
      delete result.estimatedTimetable[action.meta.name];
      return result;
    },
  },
  {
    linesDiscovery: [],
    stopPointsDiscovery: [],
    stopMonitoring: [],
    estimatedTimetable: [],
  },
);

export default reducers;
