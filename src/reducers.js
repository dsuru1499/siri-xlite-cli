import { handleActions } from "redux-actions";

const reducers = handleActions(
    {
        "LINES_DISCOVERY/SUCCESS": (state, action) => {
            return Object.assign({}, state, { linesDiscovery: action.payload })
        },
        "LINES_DISCOVERY/FAILURE": (state, action) => {
            return Object.assign({}, state, { linesDiscovery: {} })
        },
        "STOP_POINTS_DISCOVERY/SUCCESS": (state, action) => {
            return Object.assign({}, state, { stopPointsDiscovery: action.payload })
        },
        "STOP_POINTS_DISCOVERY/FAILURE": (state, action) => {
            return Object.assign({}, state, { stopPointsDiscovery: {} })
        },
        "STOP_MONITORING/SUCCESS": (state, action) => {
            let result = Object.assign({}, state);
            result.stopMonitoring[action.meta.name] = action.payload;
            return result;
        },
        "STOP_MONITORING/FAILURE": (state, action) => {
            let result = Object.assign({}, state);
            delete result.stopMonitoring[action.meta.name];
            return result;
        },
        "ESTIMATED_TIMETABLE/SUCCESS": (state, action) => {
            let result = Object.assign({}, state);
            result.estimatedTimetable[action.meta.name] = action.payload;
            return result;
        },
        "ESTIMATED_TIMETABLE/FAILURE": (state, action) => {
            let result = Object.assign({}, state);
            delete result.estimatedTimetable[action.meta.name];
            return result;
        }
    },
    {
        linesDiscovery: [],
        stopPointsDiscovery: [],
        stopMonitoring: [],
        estimatedTimetable: []
    }
);

export default reducers;