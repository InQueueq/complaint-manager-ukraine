import React, { Component } from 'react';

import { register } from './user-functions';

import { UserTypes } from '../utils/user-types';

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
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.toggleChange = this.toggleChange.bind(this);
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    toggleChange = () => {
        this.setState({
            isAuthority: !this.state.isAuthority,
        });
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

        const response = await register(user);

        const { createdUser } = response.data;

        if (createdUser) this.props.history.push('/login');
    }

    render() {
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
                        value={this.state.organisation}
                        onChange={this.onChange}
                    />
                </div>
            </div>
        );

        return (
            <div className='container'>
                <div className='row'>
                    <div className='col-md-6 mt-5 mx-auto'>
                        <form noValidate onSubmit={this.onSubmit}>
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
