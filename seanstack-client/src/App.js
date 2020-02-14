import React from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import './App.css';
import { Box, Button, Heading, Grommet, ResponsiveContext } from 'grommet';
import themeFile from './utils/theme';
import jwtDecode from 'jwt-decode'

import AuthRoute from './utils/AuthRoute';

// Pages
import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';

// Components
import {AppBar} from './components/AppBar';

let authenticated;
const token = localStorage.FBIdToken;
if (token) {
  // decode it get expiry date
  const decodedToken = jwtDecode(token);
  console.log('decoded token - ', decodedToken, token);
  if (decodedToken.exp * 1000 < Date.now()) {
    authenticated = false;
  } else {
    authenticated = true;
  }
}

function App() {
  return (
    <Grommet theme={themeFile}>
      <ResponsiveContext.Consumer>
        {size => (
          <Router>
            <AppBar>
              {/* <Heading level='3' margin='none'>Couple O Goats</Heading> */}
              <Button as={Link} to='/'  onClick={() => {}} label='Home' />
              <Button as={Link} to='/signup'  onClick={() => {}} label='Signup' />
              <Button as={Link} to='/login'  onClick={() => {}} label='Login' />
            </AppBar>
            <div className='container'>
              <Switch>
                <Route exact path='/' component={home}/>
                <AuthRoute exact path='/signup' component={signup} authenticated={authenticated}/>
                <AuthRoute exact path='/login' component={login} authenticated={authenticated}/>
              </Switch>
            </div>
          </Router>

        )}
      </ResponsiveContext.Consumer>
    </Grommet>
  );
}

export default App;
