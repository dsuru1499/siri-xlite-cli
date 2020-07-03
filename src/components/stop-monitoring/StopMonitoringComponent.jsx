import React from "react";
import { connect } from 'react-redux'
import PropTypes from "prop-types";
import { createSelector } from 'reselect'
import Moment from 'react-moment';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import actions, { loadStopMonitoring } from "../../actions";
import * as T from "../../types";
import "./StopMonitoringComponent.scss"

class StopMonitoringComponent extends React.Component {

    constructor(props) {
        super(props);
        this.counter = 1;
    }

    componentDidMount() {
        this.initialize();
    }

    componentWillUnmount() {
        this.dispose();
    }

    initialize() {
        const options = {
            [T.MONITORING_REF]: this.props.name,
            [T.MAXIMUM_STOP_VISITS]: this.props.length,
            [T.MAXIMUM_NUMBER_CALLS_OF_PREVIOUS]: 0,
            [T.MAXIMUM_NUMBER_CALLS_OF_ONWARDS]: 0,
        };
        this.props.onChange(options);
        this.timer = setInterval((e) => this.counter++ && this.props.onChange(options), 10000);
    }

    dispose() {
        clearInterval(this.timer);
        this.props.onClose();
    }

    render() {

        const Row = (props) => {
            return (<tr >
                <th scope="row"><Moment format="HH:mm">{props.value.MonitoredCall.ExpectedDepartureTime}</Moment></th>
                <td style={{ textTransform: 'uppercase' }}>{props.value.DestinationName}</td>
                <td style={{ textTransform: 'uppercase' }}>{props.value.PublishedLineName}</td>
                <td>
                    <FontAwesomeIcon style={{ color: "steelblue" }} icon="bus" />
                </td>
            </tr>)
        }

        const Rows = (props) => {
            return (props.values) ? props.values.map((value) => <Row value={value.MonitoredVehicleJourney} key={value.ItemIdentifier} />) : (null);
        }

        return (<div>
            <h5>#{this.counter} StopMonitoring: {this.props.name}</h5>
            <table className="table table-sm table-hover">
                <thead>
                    <tr>
                        <th>Departure</th>
                        <th>Destination</th>
                        <th>Line</th>
                        <th>#</th>
                    </tr>
                </thead>
                <tbody>
                    <Rows values={this.props.values} />
                </tbody>
            </table>
        </div >);
    }
}

StopMonitoringComponent.propTypes = {
    name: PropTypes.string.isRequired,
    length: PropTypes.number.isRequired,
    values: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => {
    return {
        onClose: () => dispatch(actions.stopMonitoring.failure({})),
        onChange: (options) => {
            dispatch(loadStopMonitoring(options, options[T.MONITORING_REF]));
        }
    }
}

const selector = createSelector((state, props) => state.stopMonitoring[props.name],
    value => value ? value.Siri.StopMonitoringDelivery.MonitoredStopVisit : []);

const mapStateToProps = (state, props) => {
    return {
        name: props.name,
        length: props.length,
        values: selector(state, props)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StopMonitoringComponent);