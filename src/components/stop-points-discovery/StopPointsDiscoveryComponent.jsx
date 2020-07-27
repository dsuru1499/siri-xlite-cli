/* eslint-disable react/require-default-props */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Provider, connect } from 'react-redux';
import { createSelector } from 'reselect';
import * as L from 'leaflet';

import store from '../../store';
import './StopPointsDiscoveryComponent.scss';
import actions, { loadStopPointsDiscovery } from '../../actions';
import * as T from '../../types';
import StopMonitoringComponent from '../stop-monitoring/StopMonitoringComponent';

import { } from 'leaflet-mouse-position';

class StopPointsDiscoveryComponent extends React.Component {
  static diff(a, b) {
    return a * b > 0 ? Math.abs(b - a) : Math.abs(a) + Math.abs(b);
  }

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    this.initialize();
  }

  componentDidUpdate() {
    const { value } = this.props;
    this.update(value);
  }

  componentWillUnmount() {
    this.dispose();
  }

  initialize() {
    this.stopPointIcon = L.icon({
      iconUrl: 'images/marker-icon.png',
      shadowUrl: 'images/marker-shadow.png',
    });

    this.stopAreaIcon = L.icon({
      iconUrl: 'images/marker-red-icon.png',
      shadowUrl: 'images/marker-shadow.png',
    });

    const { center, zoom, url } = this.props;
    // eslint-disable-next-line new-cap
    this.map = new L.map(this.ref.current, {
      center: L.latLng(center),
      zoom,
    });
    L.tileLayer(url, {}).addTo(this.map);
    this.markers = L.layerGroup([]).addTo(this.map);
    this.popups = L.layerGroup([]).addTo(this.map);
    L.control.scale().addTo(this.map);
    L.control.mousePosition({ position: 'bottomright' }).addTo(this.map);

    this.map.on('moveend', this.load, this);
    this.load();
  }

  dispose() {
    const { onClose } = this.props;
    onClose();
  }

  load() {
    const { zoom, onChange, onClose } = this.props;

    if (this.map.getZoom() >= zoom) {
      const bounds = this.map.getBounds();
      const count = this.markers.getLayers().length;
      if (!this.bounds || !this.bounds.contains(bounds) || count === 0) {
        const dx = StopPointsDiscoveryComponent.diff(bounds.getEast(), bounds.getWest());
        const dy = StopPointsDiscoveryComponent.diff(bounds.getNorth(), bounds.getSouth());
        this.bounds = new L.LatLngBounds(
          new L.LatLng(bounds.getSouth() - dy, bounds.getWest() - dx),
          new L.LatLng(bounds.getNorth() + dy, bounds.getEast() + dx),
        );
        const options = {
          [T.UPPER_LEFT_LONGITUDE]: this.bounds.getNorthWest().lng,
          [T.UPPER_LEFT_LATITUDE]: this.bounds.getNorthWest().lat,
          [T.LOWER_RIGHT_LONGITUDE]: this.bounds.getSouthEast().lng,
          [T.LOWER_RIGHT_LATITUDE]: this.bounds.getSouthEast().lat,
        };

        onChange(options);
      }
    } else {
      onClose();
    }
  }

  update(values) {
    // console.log('[DSU] update ');
    // console.log(values);
    this.markers.clearLayers();
    this.popups.clearLayers();
    if (values && values.length > 0) {
      values.forEach((i) => {
        const latlng = L.latLng(i.location.latitude, i.location.longitude);
        const options = {
          title: `${i.stopName}\n${i.stopPointRef}`,
          alt: i.stopPointRef,
          icon: i.stopPointRef.startsWith('StopArea') ? this.stopAreaIcon : this.stopPointIcon,
        };
        const marker = L.marker(latlng, options);
        marker.on('click', () => {
          this.createPopup(marker);
        });
        this.markers.addLayer(marker);
      });
    }
  }

  createPopup(marker) {
    let popup = marker.getPopup();
    if (popup) {
      popup.closePopup();
    } else {
      popup = L.popup({
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      });
      popup.setLatLng(marker.getLatLng());

      const div = document.createElement('div');
      popup.setContent(div);
      const element = (
        <Provider store={store}>
          <StopMonitoringComponent name={marker.options.alt} length={10} />
        </Provider>
      );
      ReactDOM.render(element, div);

      marker.bindPopup(popup);
      marker.on('popupclose', () => {
        ReactDOM.unmountComponentAtNode(div);
        marker.unbindPopup();
      });
      this.popups.addLayer(popup);
    }
  }

  render() {
    return (<div id="map" ref={this.ref} />);
  }
}

/* eslint-disable react/forbid-prop-types */
StopPointsDiscoveryComponent.propTypes = {
  url: PropTypes.string.isRequired,
  center: PropTypes.array.isRequired,
  zoom: PropTypes.number.isRequired,
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

/* eslint-disable react/default-props-match-prop-types */
StopPointsDiscoveryComponent.defaultProps = {
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  center: [48.866667, 2.333333],
  zoom: 16,
  value: [],
};

const mapDispatchToProps = (dispatch) => ({
  onClose: () => dispatch(actions.stopPointsDiscovery.failure({})),
  onChange: (options) => dispatch(loadStopPointsDiscovery(options)),
});

// eslint-disable-next-line no-unused-vars
const selector = createSelector((state, props) => state.stopPointsDiscovery, (value) => value);

const mapStateToProps = (state, props) => ({
  url: props.url,
  center: props.center,
  zoom: props.zoom,
  value: selector(state, props),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StopPointsDiscoveryComponent);
