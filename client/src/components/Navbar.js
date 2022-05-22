import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

class Navbar extends Component {
    logOut(e) {
        e.preventDefault();
        localStorage.removeItem('token');
        this.props.history.push(`/login`);
    }

    render() {
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
                    <a href='/map' onClick={this.logOut.bind(this)} className='nav-link'>
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
                    {localStorage.token ? userLink : loginRegLink}
                </div>
            </nav>
        );
    }
}

export default withRouter(Navbar);
