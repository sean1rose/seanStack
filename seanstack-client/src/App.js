import React from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import './App.css';
import { Box, Button, Heading, Grommet } from 'grommet';

// Pages
import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';

// Components
import {AppBar} from './components/AppBar';
import { Notification } from 'grommet-icons';

// theme
const theme = {
  global: {
    colors: {
      brand: '#228BE6',
    },
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
    },
  },
};

function App() {
  return (
    <Grommet theme={theme}>
      <Router>
        <AppBar>
          {/* <Heading level='3' margin='none'>Couple O Goats</Heading> */}
          <Button as={Link} to='/'  onClick={() => {}} label='Home' />
          <Button as={Link} to='/login'  onClick={() => {}} label='Login' />
          <Button as={Link} to='/signup'  onClick={() => {}} label='Signup' />
        </AppBar>
        <div className='container'>
          <Switch>
            <Route exact path='/' component={home}/>
            <Route exact path='/login' component={login}/>
            <Route exact path='/signup' component={signup}/>
          </Switch>
        </div>
      </Router>
    </Grommet>
  );
}

export default App;
