import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { Link, Switch, Route, useRouteMatch } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

import { UserTypes } from '../utils/user-types';
import { getUser, validateToken, getUnapprovedAuthorities } from './user-functions';

const forbidden = (
    <div style={{ textAlign: 'center', marginTop: '25%' }}>
        <h1>FORBIDDEN</h1>
    </div>
);

const UnapprovedAuthorities = () => {
    const [authorities, setAuthorities] = useState([]);
    const [documentsModalIsOpen, setDocumentsModalIsOpen] = useState(false);
    const [currentAuthorityId, setCurrentAuthorityId] = useState('');

    const openDocumentsModal = (authorityId) => {
        setCurrentAuthorityId(authorityId);
        setDocumentsModalIsOpen(true);
    };
    const closeDocumentsModal = () => setDocumentsModalIsOpen(false);

    const token = localStorage.token;

    useEffect(() => {
        async function fetchData() {
            await validateToken(token);

            const { authorities } = await getUnapprovedAuthorities();
            return authorities;
        }

        fetchData().then((res) => {
            setAuthorities(res);
        });
    }, [token]);

    const DocumentsModal = (
        <Modal show={documentsModalIsOpen} onHide={closeDocumentsModal}>
            <Modal.Header closeButton>
                <Modal.Title>{currentAuthorityId}</Modal.Title>
            </Modal.Header>
            <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={closeDocumentsModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );

    return (
        <ul className='card'>
            {authorities.length ? (
                authorities.map((authority) => (
                    <div>
                        <li
                            className='font-weight-bold pl-2 pr-5 mt-2 mb-2 row'
                            key={authority._id}
                        >
                            <h5 className='col-sm'>{authority.firstName}</h5>
                            <h5 className='col-sm'> {authority.lastName}</h5>
                            <h5 className='col-sm'> {authority.email}</h5>
                            <button
                                type='button'
                                class='btn btn-outline-dark'
                                onClick={() => openDocumentsModal(authority._id)}
                            >
                                View Documents
                            </button>
                        </li>
                        <div
                            style={{
                                width: '95%',
                                borderBottom: '1px solid black',
                                position: 'absolute',
                            }}
                        ></div>
                    </div>
                ))
            ) : (
                <label className='font-weight-bold'> No unapproved authorities</label>
            )}
            {documentsModalIsOpen ? DocumentsModal : null}
        </ul>
    );
};

const AdminPage = () => {
    let match = useRouteMatch();

    const [access, setAccess] = useState(true);

    const token = localStorage.token;

    useEffect(() => {
        async function fetchData() {
            await validateToken(token);
            const currentUserId = jwt_decode(token).id;

            const { user } = (await getUser(currentUserId)).data;

            return user;
        }
        fetchData()
            .then((res) => {
                if (UserTypes['ADMIN'] !== res.userType) {
                    throw new Error('Acces Error');
                }
            })
            .catch((error) => {
                setAccess(false);
                throw error;
            });
    }, []);

    return !access ? (
        forbidden
    ) : (
        <div className='container'>
            <div className='d-flex justify-content-center mb-3'>
                <h2>ADMIN PAGE</h2>
            </div>

            <ul style={{ display: 'flex', justifyContent: 'center' }}>
                <li
                    style={{
                        display: 'inline',
                        textTransform: 'uppercase',
                        backgroundColor: 'gray',
                        padding: '1em 1.5em',
                    }}
                >
                    <Link style={{ color: 'white' }} to={`${match.url}/authorities/unapproved`}>
                        UNAPPROVED AUTHORITIES
                    </Link>
                </li>
                <li
                    style={{
                        display: 'inline',
                        paddingLeft: '10%',
                        textTransform: 'uppercase',
                        backgroundColor: 'gray',
                        padding: '1em 1.5em',
                    }}
                >
                    <Link style={{ color: 'white' }} to={`${match.url}/authorities`}>
                        ALL AUTHORITIES
                    </Link>
                </li>
            </ul>

            <Switch>
                <Route path={`${match.path}/authorities`}>
                    <UnapprovedAuthorities />
                </Route>
            </Switch>
        </div>
    );
};

export { AdminPage };
