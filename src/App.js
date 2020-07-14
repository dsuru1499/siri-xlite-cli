/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBus } from '@fortawesome/free-solid-svg-icons';
import './App.scss';
import StopPointsDiscoveryComponent from "./components/stop-points-discovery/StopPointsDiscoveryComponent";

library.add(faBus);

// eslint-disable-next-line react/prefer-stateless-function
class App extends React.Component {
  render() {
    return (
      <div className="App">
        <StopPointsDiscoveryComponent center={[48.866667, 2.333333]} zoom={16} />
      </div>
    );
  }
}

export default App;
