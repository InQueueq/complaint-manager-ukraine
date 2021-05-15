import React, { useEffect, useState } from 'react';
import { Link, Switch, Route, useRouteMatch } from 'react-router-dom';
import { UserTypes, getKeyByValue } from '../utils/user-types';

import { openProfile, editProfile } from './user-functions';

const ProfileInfo = () => {
    const [id, setId] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setfirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [organisation, setOrganisation] = useState('');
    let [userTypeForm, setUserType] = useState('');

    let password;
    let userType;
    const token = localStorage.token;

    useEffect(() => {
        async function fetchData() {
            const response = await openProfile(token);
            return response;
        }

        fetchData().then((response) => {
            const responseData = response.data;

            setId(responseData.id);

            setfirstName(responseData.firstName);

            setLastName(responseData.lastName);

            setOrganisation(responseData.organisation);

            userType = responseData.userType;

            setUserType(getKeyByValue(UserTypes, userType));

            setEmail(responseData.email);

            password = responseData.password;
        });
    }, [token]);

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

        console.log(response.data);

        const { updatedUser } = response.data;

        console.log(updatedUser);

        if (updatedUser) this.props.history.push('/profile/info');
    };

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 mt-5 mx-auto'>
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
// class Profile extends Component {
// constructor() {
//     super();
//     this.state = {
//         id: '',
//         firstName: '',
//         lastName: '',
//         organisation: '',
//         userType: '',
//     };
// }
// async componentDidMount() {
//     const token = localStorage.token;

//     const response = await openProfile(token);

//     const responseData = response.data;

//     this.setState({
//         ...responseData,
//         userType: getKeyByValue(UserTypes, responseData.userType),
//     });
// }

//     onChange = (e) => {
//         this.setState({ [e.target.name]: e.target.value });
//     };

//     render() {
//         return (
//             <div>
//                 <h2>Profile</h2>
//                 <Switch>
//                     <Route path='/info'>
//                         <ProfileInfo />
//                     </Route>
//                     <Route path='/complaints'>
//                         <MyComplaints />
//                     </Route>
//                 </Switch>
//             </div>
//             /* <ul class='list-group'>
//                     <li class='list-group-item'>
//                         <a id='profile' href='#'>
//                             Profile
//                         </a>
//                     </li>
//                     <li class='list-group-item'>
//                         <a id='account' href='#'>
//                             Account
//                         </a>
//                     </li>
//                     <li class='list-group-item'>
//                         <a id='activity' href='#'>
//                             Activity
//                         </a>
//                     </li>
//                     <li class='list-group-item'>
//                         <a id='security' href='#'>
//                             Security
//                         </a>
//                     </li>
//                     <li class='list-group-item'>
//                         <a id='notifications' href='#'>
//                             Notifications
//                         </a>
//                     </li>
//                 </ul> */
//         );
//     }
// }
export { Profile };
