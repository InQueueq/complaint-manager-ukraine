import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { Link, Switch, Route, useRouteMatch, useHistory } from 'react-router-dom';

import { UserTypes, getKeyByValue } from '../utils/user-types';
import { openProfile, editProfile, getMarkersOfUser, validateToken } from './user-functions';

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

const MyComplaints = (complaints) => (
    <ul className='card'>
        {complaints.complaints.length ? (
            complaints.complaints.map((complaint) => (
                <div>
                    <li className='font-weight-bold pl-2 pr-5 mt-2 mb-2 row' key={complaint._id}>
                        <h5 className='col-sm'>{complaint.name}</h5>
                        <h5 className='col-sm'>
                            {complaint.inProcess ? 'In Progress' : 'Resolved'}
                        </h5>
                        <h5 className='col-sm'>Rating: {complaint.rating}</h5>
                        <h5 className='ml-auto'>
                            Created at: {new Date(complaint.createdAt).toDateString()}
                        </h5>
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
            <label className='font-weight-bold'> You have no complaints</label>
        )}
    </ul>
);

const Profile = () => {
    let match = useRouteMatch();

    const [complaints, setComplaints] = useState([]);

    const [access, setAccess] = useState(true);

    const token = localStorage.token;

    useEffect(() => {
        async function fetchData() {
            await validateToken(token);
            const currentUserId = jwt_decode(token).id;

            const { markers } = (await getMarkersOfUser(currentUserId)).data;
            return markers;
        }
        fetchData()
            .then((res) => {
                setComplaints(res);
            })
            .catch((error) => {
                setAccess(false);
                throw error;
            });
    }, [token]);

    const forbidden = (
        <div style={{ textAlign: 'center', marginTop: '25%' }}>
            <h1>FORBIDDEN</h1>
        </div>
    );

    return !access ? (
        forbidden
    ) : (
        <div className='container'>
            <div className='d-flex justify-content-center mb-3'>
                <h2>PROFILE</h2>
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
                    <Link style={{ color: 'white' }} to={`${match.url}/complaints`}>
                        My Complaints
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
                    <Link style={{ color: 'white' }} to={`${match.url}/info`}>
                        My Profile Information
                    </Link>
                </li>
            </ul>

            <Switch>
                <Route path={`${match.path}/complaints`}>
                    <MyComplaints complaints={complaints} />
                </Route>
                <Route path={`${match.path}/info`}>
                    <ProfileInfo />
                </Route>
            </Switch>
        </div>
    );
};

export { Profile };
