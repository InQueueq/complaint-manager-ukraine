import React, { Component } from 'react';
import { login, isActivated } from './user-functions';

const forbidden = (
    <div style={{ textAlign: 'center', marginTop: '25%' }}>
        <h1>FORBIDDEN</h1>
    </div>
);

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            access: true,
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    async onSubmit(e) {
        try {
            e.preventDefault();
            const user = {
                email: this.state.email,
                password: this.state.password,
            };

            await isActivated(user.email);

            const response = await login(user);

            const { token } = response.data;

            if (token) {
                this.props.history.push('/profile');
            }
        } catch (error) {
            this.setState({
                access: false,
            });
        }
    }
    render() {
        return this.state.access ? (
            <div className='container'>
                <div className='row'>
                    <div className='col-md-6 mt-5 mx-auto'>
                        <form noValidate onSubmit={this.onSubmit}>
                            <h1 className='h3 mb-3 font-weight-normal'>Sign In</h1>
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
                                    Sign in
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        ) : (
            forbidden
        );
    }
}
export default Login;
