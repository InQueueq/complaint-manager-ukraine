import React, { useState } from 'react';
import AWS from 'aws-sdk';

import { register } from './user-functions';
import { Modal, Button } from 'react-bootstrap';

import { UserTypes } from '../utils/user-types';

const S3_BUCKET = process.env.REACT_APP_S3_BUCKET;
const REGION = process.env.REACT_APP_REGION;

AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
});

const documentsBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
});

const Register = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [organisation, setOrganisation] = useState('');
    const [isAuthority, setIsAuthority] = useState(false);
    const [showActivationPopUp, setShowActivationPopUp] = useState(false);
    const [selectedDocuments, setSelectedDocuments] = useState([]);

    const handleShowPopUp = () => setShowActivationPopUp(!showActivationPopUp);

    const documentsSelected = (e) => {
        setSelectedDocuments((oldArray) => [...oldArray, ...e.target.files]);
    };

    const handleClosePopUp = () => {
        setShowActivationPopUp(!showActivationPopUp);
        props.history.push('/login');
    };

    const handleAuthorityCheck = () => {
        setIsAuthority(!isAuthority);
    };

    const uploadToS3 = async (file, userId) => {
        const params = {
            Body: file,
            Bucket: S3_BUCKET,
            Key: `${userId}/${file.name}`,
        };

        await documentsBucket.putObject(params).promise();
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const emailRegex =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!emailRegex.test(email)) {
            alert('Email is not valid!');
            return;
        }

        const user = {
            email,
            password,
            firstName,
            lastName,
            organisation: organisation || 'None',
            userType: isAuthority ? UserTypes.AUTHORITY : UserTypes.USER,
        };

        try {
            const response = await register(user);

            const { createdUser } = response.data;

            await Promise.all(selectedDocuments.map((file) => uploadToS3(file, createdUser._id)));

            if (createdUser) handleShowPopUp();
        } catch (err) {
            alert(err.response?.data?.message);
            return;
        }
    };

    const PopUp = (
        <Modal
            show={handleShowPopUp}
            size='lg'
            aria-labelledby='contained-modal-title-vcenter'
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id='contained-modal-title-vcenter'>Warning</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>You need to activate your account</h4>
                <p>Dear user, please check your email to activate your account</p>
                <p>
                    You won't be able to proceed and use the site's resources without an activated
                    account
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClosePopUp}>Close</Button>
            </Modal.Footer>
        </Modal>
    );

    const Organisation = (
        <div className='form-group row'>
            <label className='col-md-4 col-form-label text-md-right' htmlFor='organisation'>
                Organisation
            </label>
            <div className='col-md-6'>
                <input
                    type='organisation'
                    className='form-control'
                    name='organisation'
                    required
                    value={organisation}
                    onChange={(e) => setOrganisation(e.target.value)}
                />
            </div>
        </div>
    );

    const Documents = (
        <div className='form-group row'>
            <label className='col-md-4 col-form-label text-md-right' htmlFor='images'>
                Documents
            </label>
            <div className='col-md-6'>
                <input
                    type='file'
                    alt='yourImages'
                    className='form-control'
                    name='image'
                    multiple
                    required
                    accept='.jpg, .jpeg, .png'
                    onChange={documentsSelected}
                />
            </div>
        </div>
    );

    return (
        <div
            className='container'
            style={{
                marginTop: '5%',
                paddingBottom: '5%',
                border: '2px black solid',
            }}
        >
            {showActivationPopUp ? PopUp : null}
            <div className='row'>
                <div className='col-md-6 mt-5 mx-auto'>
                    <form onSubmit={onSubmit}>
                        <h1
                            className='h3 mb-3 font-weight-normal'
                            style={{
                                backgroundColor: '#D9D9D9',
                                marginRight: '75%',
                                borderRadius: 20,
                                padding: 7,
                                textAlign: 'center',
                            }}
                        >
                            Register
                        </h1>
                        <div className='form-group row'>
                            <label
                                className='col-md-4 col-form-label text-md-right'
                                htmlFor='firstName'
                            >
                                First Name
                            </label>
                            <div className='col-md-6'>
                                <input
                                    type='firstName'
                                    className='form-control'
                                    name='firstName'
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label
                                className='col-md-4 col-form-label text-md-right'
                                htmlFor='lastName'
                            >
                                Last Name
                            </label>
                            <div className='col-md-6'>
                                <input
                                    type='lastName'
                                    className='form-control'
                                    name='lastName'
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label
                                className='col-md-4 col-form-label text-md-right'
                                htmlFor='organisation'
                            >
                                Authority representative?
                            </label>
                            <div className='col-md-1'>
                                <input
                                    type='checkbox'
                                    className='form-control form-check'
                                    name='authority'
                                    defaultChecked={isAuthority}
                                    onChange={handleAuthorityCheck}
                                />
                            </div>
                        </div>
                        {isAuthority ? Organisation : null}
                        {isAuthority ? Documents : null}
                        <div className='form-group row'>
                            <label
                                className='col-md-4 col-form-label text-md-right'
                                htmlFor='email'
                            >
                                Email Address
                            </label>
                            <div className='col-md-6'>
                                <input
                                    type='email'
                                    className='form-control'
                                    name='email'
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label
                                className='col-md-4 col-form-label text-md-right'
                                htmlFor='password'
                            >
                                Password
                            </label>
                            <div className='col-md-6'>
                                <input
                                    type='password'
                                    className='form-control'
                                    name='password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='col-md-6 offset-md-5'>
                            <button type='submit' className='btn btn-outline-dark'>
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export { Register };
