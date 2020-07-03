import { createActions } from 'redux-actions';
import linesDiscoveryService from "./services/LinesDiscoveryService";
import stopPointsDiscoveryService from "./services/StopPointsDiscoveryService";
import stopMonitoringService from "./services/StopMonitoringService";
import estimatedTimetableService from "./services/EstimatedTimetableService";

export const loadLinesDiscovery = (payload) => dispatch => {
    return linesDiscoveryService.get(payload).subscribe(
        value => dispatch(actions.linesDiscovery.success(value)),
        error => dispatch(actions.linesDiscovery.failure(error))
    );
};

export const loadStopPointsDiscovery = (payload) => dispatch => {
    return stopPointsDiscoveryService.get(payload).subscribe(
        value => dispatch(actions.stopPointsDiscovery.success(value)),
        error => dispatch(actions.stopPointsDiscovery.failure(error))
    );
};

export const loadStopMonitoring = (payload, name) => dispatch => {
    return stopMonitoringService.get(payload).subscribe(
        value => dispatch(actions.stopMonitoring.success(value, name)),
        error => dispatch(actions.stopMonitoring.failure(error, name))
    );
};

export const loadEstimatedTimetable = (payload, name) => dispatch => {
    return estimatedTimetableService.get(payload).subscribe(
        value => dispatch(actions.estimatedTimetable.success(value, name)),
        error => dispatch(actions.estimatedTimetable.failure(error, name))
    );
};

const actions = createActions(
    {
        LINES_DISCOVERY: {
            SUCCESS: payload => payload,
            FAILURE: payload => payload
        },
        STOP_POINTS_DISCOVERY: {
            SUCCESS: payload => payload,
            FAILURE: payload => payload
        },
        STOP_MONITORING: {
            SUCCESS: [
                payload => payload,
                (payload, name) => ({ name })
            ],
            FAILURE: [
                payload => payload,
                (payload, name) => ({ name })
            ],
        },
        ESTIMATED_TIMETABLE: {
            SUCCESS: [
                payload => payload,
                (payload, name) => ({ name })
            ],
            FAILURE: [
                payload => payload,
                (payload, name) => ({ name })
            ],
        }
    }
);

export default actions;
