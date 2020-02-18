import React from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import './App.css';
import { Box, Button, Heading, Grommet, ResponsiveContext } from 'grommet';
import themeFile from './utils/theme';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
// Redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';

import AuthRoute from './utils/AuthRoute';

// Pages
import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';

// Components
import {AppBar} from './components/AppBar';
import Axios from 'axios';

const token = localStorage.FBIdToken;
if (token) {
  // decode it get expiry date
  const decodedToken = jwtDecode(token);
  console.log('decoded token - ', decodedToken, token);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser())
    window.location.href = '/login';
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
}

function App() {
  return (
    <Provider store={store}>
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
                  <AuthRoute exact path='/signup' component={signup} />
                  <AuthRoute exact path='/login' component={login} />
                </Switch>
              </div>
            </Router>

          )}
        </ResponsiveContext.Consumer>
      </Grommet>
    </Provider>
  );
}

export default App;
