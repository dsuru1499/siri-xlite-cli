import React from "react";
import ReactDOM from 'react-dom';
import PropTypes from "prop-types";
import { Provider, connect } from "react-redux";
import { createSelector } from 'reselect'
import * as L from "leaflet";
import * as LeafletMousePosition from "leaflet-mouse-position";

import store from "../../store"
import "./StopPointsDiscoveryComponent.scss";
import actions, { loadStopPointsDiscovery } from "../../actions";
import * as T from "../../types";
import StopMonitoringComponent from "../stop-monitoring/StopMonitoringComponent";

class StopPointsDiscoveryComponent extends React.Component {

    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidMount() {
        this.initialize();
    }

    componentWillUnmount() {
        this.dispose();
    }

    componentDidUpdate() {
        this.update(this.props.value);
    }

    initialize() {
        this.stopPointIcon = L.icon({
            iconUrl: "images/marker-icon.png",
            shadowUrl: "images/marker-shadow.png"
        });

        this.stopAreaIcon = L.icon({
            iconUrl: "images/marker-red-icon.png",
            shadowUrl: "images/marker-shadow.png"
        });

        this.map = new L.map(this.ref.current, {
            center: L.latLng(this.props.center),
            zoom: this.props.zoom
        });
        L.tileLayer(this.props.url, {}).addTo(this.map);
        this.markers = L.layerGroup([]).addTo(this.map);
        this.popups = L.layerGroup([]).addTo(this.map);
        L.control.scale().addTo(this.map);
        L.control.mousePosition({ position: "bottomright" }).addTo(this.map);

        this.map.on("moveend", this.load, this);
        this.load();
    }

    dispose() {
        this.props.onClose();
    }

    load() {
        if (this.map.getZoom() >= this.props.zoom) {
            let bounds = this.map.getBounds();
            let count = this.markers.getLayers().length;
            if (!this.bounds || !this.bounds.contains(bounds) || count === 0) {
                let dx = this.diff(bounds.getEast(), bounds.getWest());
                let dy = this.diff(bounds.getNorth(), bounds.getSouth());
                this.bounds = new L.LatLngBounds(
                    new L.LatLng(bounds.getSouth() - dy, bounds.getWest() - dx),
                    new L.LatLng(bounds.getNorth() + dy, bounds.getEast() + dx)
                );
                const options = {
                    [T.UPPER_LEFT_LONGITUDE]: this.bounds.getNorthWest().lng,
                    [T.UPPER_LEFT_LATITUDE]: this.bounds.getNorthWest().lat,
                    [T.LOWER_RIGHT_LONGITUDE]: this.bounds.getSouthEast().lng,
                    [T.LOWER_RIGHT_LATITUDE]: this.bounds.getSouthEast().lat,
                };

                this.props.onChange(options);
            }
        } else {
            this.props.onClose();
        }
    }

    diff(a, b) {
        let result = a * b > 0 ? Math.abs(b - a) : Math.abs(a) + Math.abs(b);
        return result;
    }

    update(values) {
        console.log("[DSU] update ");
        console.log(values);
        this.markers.clearLayers();
        this.popups.clearLayers();
        if (values && values.length > 0) {
            values.forEach(i => {
                let latlng = L.latLng(i.location.latitude, i.location.longitude);
                let options = {
                    title: i.stopName + "\n" + i.stopPointRef,
                    alt: i.stopPointRef,
                    icon: i.stopPointRef.startsWith("StopArea")
                        ? this.stopAreaIcon
                        : this.stopPointIcon
                };
                let marker = L.marker(latlng, options);
                marker.on("click", () => {
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
            let popup = L.popup({
                autoClose: false,
                closeOnClick: false,
                closeButton: false
            });
            popup.setLatLng(marker.getLatLng());

            let div = document.createElement('div');
            popup.setContent(div);
            const element = <Provider store={store}><StopMonitoringComponent name={marker.options.alt} length={10} /></Provider>;
            ReactDOM.render(element, div);

            marker.bindPopup(popup);
            marker.on("popupclose", () => {
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

StopPointsDiscoveryComponent.propTypes = {
    url: PropTypes.string.isRequired,
    center: PropTypes.array.isRequired,
    zoom: PropTypes.number.isRequired,
    value: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

StopPointsDiscoveryComponent.defaultProps = {
    url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    center: [48.866667, 2.333333],
    zoom: 16,
    value: []
};

const mapDispatchToProps = (dispatch) => {
    return {
        onClose: () => dispatch(actions.stopPointsDiscovery.failure({})),
        onChange: (options) => {
            dispatch(loadStopPointsDiscovery(options));
        }
    }
}

const selector = createSelector((state, props) => state.stopPointsDiscovery, value => value);

const mapStateToProps = (state, props) => {
    return {
        url: props.url,
        center: props.center,
        zoom: props.zoom,
        value: selector(state, props)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StopPointsDiscoveryComponent);