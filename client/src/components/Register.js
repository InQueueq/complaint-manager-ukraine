import React, { Component } from 'react';
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

class Register extends Component {
    constructor() {
        super();

        this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            organisation: '',
            userType: '',
            isAuthority: false,
            showActivationPopUp: false,
            selectedDocuments: null,
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleShowPopUp = this.handleShowPopUp.bind(this);
        this.handleClosePopUp = this.handleClosePopUp.bind(this);
        this.toggleChange = this.toggleChange.bind(this);
        this.documentsSelected = this.documentsSelected.bind(this);
        this.uploadToS3 = this.uploadToS3.bind(this);
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleShowPopUp() {
        this.setState({ showActivationPopUp: !this.state.showActivationPopUp });
    }

    documentsSelected = (e) => {
        this.setState({ selectedDocuments: e.target.files });
        console.log(this.state);
    };

    handleClosePopUp() {
        this.setState({ showActivationPopUp: !this.state.showActivationPopUp });
        this.props.history.push('/login');
    }

    toggleChange = () => {
        this.setState({
            isAuthority: !this.state.isAuthority,
        });
    };

    uploadToS3 = async (file) => {
        const params = {
            ACL: 'public-read',
            Body: file,
            Bucket: S3_BUCKET,
            Key: file.name,
        };

        await documentsBucket.putObject(params).promise();
    };

    async onSubmit(e) {
        e.preventDefault();

        const emailRegex =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!emailRegex.test(this.state.email)) {
            alert('Email is not valid!');
            return;
        }

        const user = {
            email: this.state.email,
            password: this.state.password,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            organisation: this.state.organisation || 'None',
            userType: this.state.isAuthority ? UserTypes.AUTHORITY : UserTypes.USER,
        };

        try {
            const response = await register(user);

            if (!this.state.selectedDocuments.length) {
                await Promise.all(
                    this.state.selectedDocuments.map((file) => this.uploadToS3(file)),
                );
            }

            const { createdUser } = response.data;

            if (createdUser) this.handleShowPopUp();
        } catch (err) {
            alert(err.response.data.message);
            return;
        }
    }

    render() {
        const PopUp = (
            <Modal
                show={this.handleShowPopUp}
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
                        You won't be able to proceed and use the site's resources without an
                        activated account
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handleClosePopUp}>Close</Button>
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
                        value={this.state.organisation}
                        onChange={this.onChange}
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
                        onChange={this.documentsSelected}
                    />
                </div>
            </div>
        );

        return (
            <div className='container'>
                {this.state.showActivationPopUp ? PopUp : null}
                <div className='row'>
                    <div className='col-md-6 mt-5 mx-auto'>
                        <form onSubmit={this.onSubmit}>
                            <h1 className='h3 mb-3 font-weight-normal'>Register</h1>
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
                                        value={this.state.firstName}
                                        onChange={this.onChange}
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
                                        value={this.state.lastName}
                                        onChange={this.onChange}
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
                                        defaultChecked={this.state.isAuthority}
                                        onChange={this.toggleChange}
                                    />
                                </div>
                            </div>
                            {this.state.isAuthority ? Organisation : null}
                            {this.state.isAuthority ? Documents : null}
                            <div className='form-group row'>
                                <label
                                    className='col-md-4 col-form-label text-md-right'
                                    htmlFor='email'
                                >
                                    Email Adress
                                </label>
                                <div className='col-md-6'>
                                    <input
                                        type='email'
                                        className='form-control'
                                        name='email'
                                        required
                                        value={this.state.email}
                                        onChange={this.onChange}
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
                                        value={this.state.password}
                                        onChange={this.onChange}
                                    />
                                </div>
                            </div>
                            <div className='col-md-6 offset-md-5'>
                                <button type='submit' className='btn btn-primary'>
                                    Register
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
export default Register;
