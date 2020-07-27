import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import Moment from 'react-moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import actions, { loadStopMonitoring } from '../../actions';
import * as T from '../../types';
import './StopMonitoringComponent.scss';

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
    const { name, length, onChange } = this.props;
    const options = {
      [T.MONITORING_REF]: name,
      [T.MAXIMUM_STOP_VISITS]: length,
    };
    onChange(options);
    this.timer = setInterval(() => {
      this.counter += 1;
      onChange(options);
    }, 10000);
  }

  dispose() {
    const { onClose, name, length } = this.props;
    clearInterval(this.timer);
    const options = {
      [T.MONITORING_REF]: name,
      [T.MAXIMUM_STOP_VISITS]: length,
    };
    onClose(options);
  }

  render() {
    const { name, values } = this.props;

    const Row = (props) => (
      <tr>
        <th scope="row">
          <Moment format="HH:mm">
            {`1970-01-01T${props.value.estimatedCalls[props.value.index].expectedDepartureTime}`}
          </Moment>
        </th>
        <td style={{ textTransform: 'uppercase' }}>{props.value.directionName}</td>
        <td style={{ textTransform: 'uppercase' }}>{props.value.publishedLineName}</td>
        <td>
          <FontAwesomeIcon style={{ color: 'steelblue' }} icon="bus" />
        </td>
      </tr>
    );

    const Rows = (props) => ((props.values) ? (props.values.map(
      (value) => <Row value={value} key={value.datedVehicleJourneyRef} />,
    )) : (null));

    const title = `#${this.counter} StopMonitoring: ${name}`;

    return (
      <div>
        <h5>{title}</h5>
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
            <Rows values={values} />
          </tbody>
        </table>
      </div>
    );
  }
}

/* eslint-disable react/forbid-prop-types */
StopMonitoringComponent.propTypes = {
  name: PropTypes.string.isRequired,
  length: PropTypes.number.isRequired,
  values: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  onClose: (options) => dispatch(actions.stopMonitoring.failure({}, options[T.MONITORING_REF])),
  onChange: (options) => dispatch(loadStopMonitoring(options, options[T.MONITORING_REF])),
});

const selector = createSelector((state, props) => state.stopMonitoring[props.name],
  (value) => value || []);

const mapStateToProps = (state, props) => ({
  name: props.name,
  length: props.length,
  values: selector(state, props),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StopMonitoringComponent);
