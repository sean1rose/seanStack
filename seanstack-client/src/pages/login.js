import React, { Component } from 'react';
import {Form, FormField, Button, Text, Meter} from 'grommet';
import axios from 'axios';
import { Link } from 'react-router-dom';
// redux...
import { connect } from 'react-redux';
import { loginUser } from '../redux/actions/userActions';

class login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      loading: false,
      errors: {}
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.ui.errors) {
      this.setState({ errors: nextProps.ui.errors });
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      loading: true
    })
    // send request to server, if successful -> redirect to home
    const loginUserData = {
      email: this.state.email,
      password: this.state.password
    }
    this.props.loginUser(loginUserData, this.props.history);
    // moved API call to userAction
    console.log('hi', event.target.value);
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    const { errors } = this.state;
    const { ui: {loading} } = this.props;
    return (
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center'}}>
        <div></div>
        <div>
          <Text size="xlarge">Login</Text>
          <Form onSubmit={this.handleSubmit}>
            <FormField error={errors.email} id="email" name="email" type="email" label="Email" value={this.state.email} onChange={this.handleChange} />
            <FormField error={errors.password} id="password" name="password" type="password" label="Password" value={this.state.password} onChange={this.handleChange} />
            {errors.general &&
              (<div style={{margin: '10px'}}><Text color="red">{errors.general}</Text></div>)
            }
            <div>
              {!loading && (
                <div>
                  <Button disabled={loading} margin="medium" primary type="submit" label='Login' onClick={this.handleSubmit} />
                </div>
              )}
              {loading && (
                <div>
                  <Meter size="xsmall" type="circle" values={[{value: 60}]} background="light-2" />
                </div>
              )}
            </div>
            <div><Text size="small">Don't have an account? Sign up <Link to="/signup">here</Link></Text></div>
          </Form>
        </div>
        <div></div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  ui: state.ui
});

const mapActionToProps = {
  loginUser
}

export default connect(mapStateToProps, mapActionToProps)(login)
