import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Map from './map/Map';
import Login from './components/Login';
import Register from './components/Register';
import { Profile } from './components/Profile';
import { ActivateWindow } from './components/Activate';

class App extends Component {
    render() {
        return (
            <Router>
                <div className='App' style={{ height: '100%' }}>
                    <Navbar />
                    <div className='container'>
                        <Route exact path='/' />
                        <Route exact path='/register' component={Register} />
                        <Route exact path='/login' component={Login} />
                        <Route path='/profile' component={Profile} />
                        <Route path='/activate/:token?' component={ActivateWindow} />
                    </div>
                    <div className='container' id='mapView'>
                        <Route exact path='/map' component={Map} />
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;
