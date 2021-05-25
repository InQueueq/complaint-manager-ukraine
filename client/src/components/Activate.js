import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';

import { validateToken, activateUser } from './user-functions';

const ActivateWindow = (props) => {
    const [access, setAccess] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const token = props.match.params.token;

            const { id } = jwt_decode(token);

            await validateToken(token);

            await activateUser(id);
        }
        fetchData()
            .then(() => {
                setAccess(true);
            })
            .catch(() => {
                setAccess(false);
            });
    }, []);

    const forbidden = (
        <div style={{ textAlign: 'center', marginTop: '25%' }}>
            <h1>FORBIDDEN</h1>
        </div>
    );

    const success = (
        <div style={{ textAlign: 'center', marginTop: '25%' }}>
            <h1>Account activated!</h1>
        </div>
    );

    return access ? success : forbidden;
};

export { ActivateWindow };
