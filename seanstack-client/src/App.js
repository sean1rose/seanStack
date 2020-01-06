import React from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import './App.css';
import { Box, Button, Heading, Grommet, ResponsiveContext } from 'grommet';

// Pages
import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';

// Components
import {AppBar} from './components/AppBar';

// theme
const theme = {
  global: {
    breakpoints: {
      xsmall: {
        value: 500
      },
      small: {
        value: 900
      },
      medium: undefined,
      middle: {
        value: 3000
      }
    },  
    colors: {
      brand: '#228BE6',
    },
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
    },
  },
  formField: {
    label: {
      // color: "dark-3",
      size: "small",
      margin: { vertical: "10px", bottom: "10px", horizontal: "0" },
      // weight: 600
    },
    border: false,
    margin: 0
  }
};

function App() {
  return (
    <Grommet theme={theme}>
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
                <Route exact path='/signup' component={signup}/>
                <Route exact path='/login' component={login}/>
              </Switch>
            </div>
          </Router>

        )}
      </ResponsiveContext.Consumer>
    </Grommet>
  );
}

export default App;
