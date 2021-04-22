import './Map.css';
import React, { Component } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { options } from './map-options';

const mapStyle = {
    height: '100%',
    width: '100%',
    margin: '0',
    padding: '0',
    position: 'relative',
};

// function Map() {
//     return (
//         <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
//             <GoogleMap mapContainerStyle={mapStyle} options={options}></GoogleMap>
//         </LoadScript>
//     );
// }

class Map extends Component {
    render() {
        return (
            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
                <GoogleMap mapContainerStyle={mapStyle} options={options}></GoogleMap>
            </LoadScript>
        );
    }
}

export default Map;
