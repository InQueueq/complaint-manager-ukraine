import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { Link, withRouter } from 'react-router-dom';

import { UserTypes } from '../utils/user-types';
import { getUser, validateToken } from './user-functions';

const Navbar = (props) => {
    const [isAdmin, setIsAdmin] = useState(false);

    const token = localStorage.token;

    useEffect(() => {
        async function fetchData() {
            if (token) {
                await validateToken(token);
                const currentUserId = jwt_decode(token).id;

                const { user } = (await getUser(currentUserId)).data;

                return user;
            }

            return null;
        }
        fetchData()
            .then((res) => {
                if (res && UserTypes['ADMIN'] === res.userType) {
                    setIsAdmin(true);
                }
            })
            .catch((error) => {
                setIsAdmin(false);
                throw error;
            });
    }, [token]);

    const logOut = (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        props.history.push(`/login`);
    };

    const loginRegLink = (
        <ul className='navbar-nav'>
            <li className='nav-item'>
                <Link to='/login' className='nav-link'>
                    Login
                </Link>
            </li>
            <li className='nav-item'>
                <Link to='/register' className='nav-link'>
                    Register
                </Link>
            </li>
        </ul>
    );

    const userLink = (
        <ul className='navbar-nav'>
            <li className='nav-item'>
                <Link to='/profile' className='nav-link'>
                    Profile
                </Link>
            </li>
            <li className='nav-item'>
                <a href='/map' onClick={(e) => logOut(e)} className='nav-link'>
                    Logout
                </a>
            </li>
        </ul>
    );

    const map = (
        <ul className='navbar-nav'>
            <li className='nav-item'>
                <Link to='/map' className='nav-link'>
                    Map
                </Link>
            </li>
        </ul>
    );

    const AdminPage = (
        <ul className='navbar-nav'>
            <li className='nav-item'>
                <Link to='/admin' className='nav-link'>
                    Admin
                </Link>
            </li>
        </ul>
    );

    return (
        <nav className='navbar navbar-expand-lg rounded'>
            <button
                className='navbar-toggler'
                type='button'
                data-toggle='collapse'
                data-target='#navbarsExample10'
                aria-controls='navbarsExample10'
                aria-expanded='false'
                aria-label='Toggle navigation'
            >
                <span className='navbar-toggler-icon' />
            </button>

            <div
                className='collapse navbar-collapse justify-content-md-center'
                id='navbarsExample10'
            >
                {' '}
                {localStorage.token ? map : null}
                {isAdmin ? AdminPage : null}
                {localStorage.token ? userLink : loginRegLink}
            </div>
        </nav>
    );
};

export default withRouter(Navbar);
