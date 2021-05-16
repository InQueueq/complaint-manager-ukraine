import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

import './Map.css';

import { options } from './map-options';

import { validateToken } from '../components/user-functions';

const mapStyle = {
    height: '100%',
    width: '100%',
    margin: '0',
    padding: '0',
    position: 'relative',
};

const Map = () => {
    const [access, setAccess] = useState(true);

    useEffect(() => {
        const token = localStorage.token;

        async function fetchData() {
            const response = await validateToken(token);
            return response;
        }

        fetchData()
            .then((response) => {
                const responseData = response.data;
            })
            .catch((e) => {
                setAccess(false);
            });
    });

    const forbidden = (
        <div style={{ textAlign: 'center', marginTop: '25%' }}>
            <h1>FORBIDDEN</h1>
        </div>
    );

    const mapComponent = <GoogleMap mapContainerStyle={mapStyle} options={options}></GoogleMap>;

    return (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
            {access ? mapComponent : forbidden}
        </LoadScript>
    );
};

export default Map;
