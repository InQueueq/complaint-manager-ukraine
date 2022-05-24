import React, { useEffect, useState } from 'react';
import AWS from 'aws-sdk';
import jwt_decode from 'jwt-decode';
import { Link, Switch, Route, useRouteMatch } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import Carousel from 'react-gallery-carousel';

import { UserTypes } from '../utils/user-types';
import {
    getUser,
    validateToken,
    getUnapprovedAuthorities,
    approveAuthorityByUserId,
    getAuthorities,
    deleteAuthorityByUserId,
    deleteMarkersByUserId,
    deleteImagesByMarkerIds,
    deleteLikesByMarkerIds,
    deleteLikesByUserId,
} from './user-functions';

const S3_BUCKET = process.env.REACT_APP_S3_BUCKET;
const REGION = process.env.REACT_APP_REGION;

const makeAwsURL = (bucketName, key) => {
    const url = `https://${bucketName}.s3.amazonaws.com/${key}`;
    return url;
};

const documentsBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
});

const forbidden = (
    <div style={{ textAlign: 'center', marginTop: '25%' }}>
        <h1>FORBIDDEN</h1>
    </div>
);

const emptyS3Directory = async (bucket, dir) => {
    const listParams = {
        Bucket: bucket,
        Prefix: dir,
    };

    const listedObjects = await documentsBucket.listObjectsV2(listParams).promise();

    if (listedObjects.Contents.length === 0) return;

    const deleteParams = {
        Bucket: bucket,
        Delete: { Objects: [] },
    };

    listedObjects.Contents.forEach(({ Key }) => {
        deleteParams.Delete.Objects.push({ Key });
    });

    await documentsBucket.deleteObjects(deleteParams).promise();
};

const Authorities = () => {
    const [authorities, setAuthorities] = useState([]);
    const [currentAuthorityId, setCurrentAuthorityId] = useState('');
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

    const token = localStorage.token;

    useEffect(() => {
        async function fetchData() {
            await validateToken(token);

            const { authorities } = await getAuthorities();
            return authorities;
        }

        fetchData().then((res) => {
            setAuthorities(res);
        });
    }, [token]);

    const openDeleteModal = async (authorityId) => {
        setCurrentAuthorityId(authorityId);
        setDeleteModalIsOpen(true);
    };

    const closeDeleteModal = async () => {
        setCurrentAuthorityId('');
        setDeleteModalIsOpen(false);
    };

    const deleteAuthority = async (userId) => {
        await deleteAuthorityByUserId(userId);
        const markerIds = (await deleteMarkersByUserId(userId)).markers;
        await deleteImagesByMarkerIds(markerIds);
        await deleteLikesByUserId(userId);
        await deleteLikesByMarkerIds(markerIds);

        emptyS3Directory(S3_BUCKET, userId + '/');

        const newList = authorities.filter((item) => item._id !== userId);

        setAuthorities(newList);
        closeDeleteModal();
    };

    const DeleteModal = (
        <Modal centered show={openDeleteModal} onHide={closeDeleteModal}>
            <Modal.Header closeButton>
                <Modal.Title>Warning</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
            <Modal.Footer>
                <Button
                    variant='outline-danger'
                    onClick={() => deleteAuthority(currentAuthorityId)}
                >
                    Delete
                </Button>
                <Button variant='outline-info' onClick={closeDeleteModal}>
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
                            <h5 className='col-sm'>
                                {authority.isApprovedAuthority ? 'Approved' : 'Not approved'}
                            </h5>
                            <button
                                type='button'
                                class='btn btn-outline-danger'
                                onClick={() => openDeleteModal(authority._id)}
                            >
                                Delete
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
                <label className='font-weight-bold'> No authorities</label>
            )}
            {deleteModalIsOpen ? DeleteModal : null}
        </ul>
    );
};

const UnapprovedAuthorities = () => {
    const [authorities, setAuthorities] = useState([]);
    const [documentsModalIsOpen, setDocumentsModalIsOpen] = useState(false);
    const [currentAuthorityId, setCurrentAuthorityId] = useState('');
    const [currentAuthorityDocuments, setCurrentAuthorityDocuments] = useState([]);

    const openDocumentsModal = async (authorityId) => {
        setCurrentAuthorityId(authorityId);
        setDocumentsModalIsOpen(true);
        const documents = await listAuthorityDocuments(authorityId);

        const mappedDocs = documents.map((document) => {
            const awsUrl = makeAwsURL(S3_BUCKET, document.Key);
            return { src: awsUrl };
        });

        setCurrentAuthorityDocuments(mappedDocs);
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

    const approveAuthority = async (userId) => {
        await approveAuthorityByUserId(userId);

        const newList = authorities.filter((item) => item._id !== userId);

        setAuthorities(newList);
    };

    const listAuthorityDocuments = async (userId) => {
        const params = {
            Bucket: S3_BUCKET,
            Prefix: `${userId}/`,
        };

        const documents = (await documentsBucket.listObjects(params).promise()).Contents;
        return documents;
    };

    const DocumentsModal = (
        <Modal size='lg' centered show={documentsModalIsOpen} onHide={closeDocumentsModal}>
            <Modal.Header closeButton>
                <Modal.Title>{currentAuthorityId}</Modal.Title>
            </Modal.Header>
            <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
            <Carousel images={currentAuthorityDocuments} />
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
                                style={{ 'margin-right': '20px' }}
                                type='button'
                                class='btn btn-outline-success'
                                onClick={() => approveAuthority(authority._id)}
                            >
                                Approve
                            </button>
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
                    setAccess(false);
                }
            })
            .catch((error) => {
                setAccess(false);
                throw error;
            });
    }, [token]);

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
                <Route path={`${match.path}/authorities/unapproved`}>
                    <UnapprovedAuthorities />
                </Route>
                <Route path={`${match.path}/authorities`}>
                    <Authorities />
                </Route>
            </Switch>
        </div>
    );
};

export { AdminPage };
