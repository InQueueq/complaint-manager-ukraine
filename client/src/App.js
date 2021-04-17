import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Map from './map/Map';
// import Login from './components/Login';
// import Register from './components/Register';
// import Profile from './components/Profile';

class App extends Component {
    render() {
        return (
            <Router>
                <div className='App' style={{ height: '100%' }}>
                    <Navbar />
                    <Route exact path='/' />
                    <div className='container' style={{ height: '100%' }}>
                        {/* <Route exact path='/register' component={Register} />
                        <Route exact path='/login' component={Login} />
                        <Route exact path='/profile' component={Profile} /> */}
                        <Route exact path='/map' component={Map} />
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;
