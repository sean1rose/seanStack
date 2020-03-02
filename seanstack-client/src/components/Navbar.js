import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import AppBar from './AppBar' 
import { Button } from 'grommet';
import MyButton from '../utils/MyButton'
import { Home, Add, Notification } from 'grommet-icons'

class Navbar extends Component {
  render() {
    const { authenticated } = this.props
    console.log('nvabar auth - ', authenticated)
    return (
      <AppBar>
        {authenticated ? (
          <Fragment>
            <MyButton icon={<Add />} onClick={() => {}}  />
            <MyButton as={Link} to='/' icon={<Home />} onClick={() => {}}  />
            <MyButton  icon={<Notification />} onClick={() => {}}  />
          </Fragment>
        ) : (
          <Fragment>
            <Button as={Link} to='/'  onClick={() => {}} label='Home' />
            <Button as={Link} to='/signup'  onClick={() => {}} label='Signup' />
            <Button as={Link} to='/login'  onClick={() => {}} label='Login' />
          </Fragment>
        )}
      </AppBar>
    )
  }
}

const mapStateToProps = state => ({
  authenticated: state.user.authenticated
})

export default connect(mapStateToProps)( Navbar)
