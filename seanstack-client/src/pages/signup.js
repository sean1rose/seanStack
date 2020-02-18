import React, { Component } from 'react';
import {Form, FormField, Button, Text, Meter} from 'grommet';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { signupUser } from '../redux/actions/userActions';

class signup extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      username: '',
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
    const newUserData = {
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      username: this.state.username
    }
    this.props.signupUser(newUserData, this.props.history);
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    const { ui: { loading }} = this.props;
    const { errors } = this.state;
    return (
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center'}}>
        <div></div>
        <div>
          <Text size="xlarge">Signup</Text>
          <Form onSubmit={this.handleSubmit}>
            <FormField error={errors.email} id="email" name="email" type="email" label="Email" value={this.state.email} onChange={this.handleChange} />
            <FormField error={errors.password} id="password" name="password" type="password" label="Password" value={this.state.password} onChange={this.handleChange} />
            <FormField error={errors.confirmPassword} id="confirmPassword" name="confirmPassword" type="password" label="Confirm Password" value={this.state.confirmPassword} onChange={this.handleChange} />
            <FormField error={errors.username} id="username" name="username" type="text" label="Username" value={this.state.username} onChange={this.handleChange} />
            {errors.general &&
              (<div style={{margin: '10px'}}><Text color="red">{errors.general}</Text></div>)
            }
            <div>
              {!loading && (
                <div>
                  <Button disabled={loading} margin="medium" primary type="submit" label='Signup' onClick={this.handleSubmit} />
                </div>
              )}
              {loading && (
                <div>
                  <Meter size="xsmall" type="circle" values={[{value: 60}]} background="light-2" />
                </div>
              )}
            </div>
            <div><Text size="small">Already have an account? Login <Link to="/login">here</Link></Text></div>
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
})

export default connect(mapStateToProps, { signupUser })(signup)
