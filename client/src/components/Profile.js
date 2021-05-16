import React, { useEffect, useState } from 'react';
import { Link, Switch, Route, useRouteMatch, useHistory } from 'react-router-dom';
import { UserTypes, getKeyByValue } from '../utils/user-types';

import { openProfile, editProfile } from './user-functions';

const ProfileInfo = () => {
    const [email, setEmail] = useState('');
    const [firstName, setfirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [organisation, setOrganisation] = useState('');
    let [userTypeForm, setUserTypePage] = useState('');

    const history = useHistory();

    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('');
    const token = localStorage.token;

    useEffect(() => {
        async function fetchData() {
            const response = await openProfile(token);
            return response;
        }

        fetchData().then((response) => {
            const responseData = response.data;

            setfirstName(responseData.firstName);

            setLastName(responseData.lastName);

            setOrganisation(responseData.organisation);

            setPassword(responseData.password);

            setUserTypePage(getKeyByValue(UserTypes, userType));

            setEmail(responseData.email);

            setUserType(responseData.userType);
        });
    }, [token, userType]);

    const handleSubmit = async (e) => {
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
            organisation,
            userType,
        };

        const response = await editProfile(user, token);

        const { updatedUser } = response.data;

        if (updatedUser) {
            history.push({
                pathname: '/profile',
            });
        }
    };

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 mt-5 mx-auto'>
                    <div style={{ marginBottom: '50px' }}>
                        <h3>User type is: {userTypeForm}</h3>
                    </div>
                    <form noValidate onSubmit={handleSubmit}>
                        <h1 className='h3 mb-3 font-weight-normal'>Edit profile</h1>
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
                                    value={firstName}
                                    onChange={(e) => setfirstName(e.target.value)}
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
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label
                                className='col-md-4 col-form-label text-md-right'
                                htmlFor='email'
                            >
                                Organisation
                            </label>
                            <div className='col-md-6'>
                                <input
                                    type='organisation'
                                    className='form-control'
                                    name='organisation'
                                    value={organisation}
                                    onChange={(e) => setOrganisation(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='col-md-6 offset-md-5'>
                            <button type='submit' className='btn btn-primary'>
                                Edit profile
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const MyComplaints = () => (
    <div>
        <h2>Mock</h2>;
    </div>
);

const Profile = () => {
    let match = useRouteMatch();

    return (
        <div className='container'>
            <div className='d-flex justify-content-center'>
                <h2>Profile</h2>
            </div>

            <ul style={{ display: 'flex', justifyContent: 'center' }}>
                <li style={{ display: 'inline' }}>
                    <Link to={`${match.url}/complaints`}>My Complaints</Link>
                </li>
                <li style={{ display: 'inline', paddingLeft: '50px' }}>
                    <Link to={`${match.url}/info`}>My Profile Information</Link>
                </li>
            </ul>

            <Switch>
                <Route path={`${match.path}/complaints`}>
                    <MyComplaints />
                </Route>
                <Route path={`${match.path}/info`}>
                    <ProfileInfo />
                </Route>
            </Switch>
        </div>
    );
};

export { Profile };
