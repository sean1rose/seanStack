import React, { Component } from 'react';
import {Form, FormField, Button, Text, Meter} from 'grommet';
import axios from 'axios';
import { Link } from 'react-router-dom';

class signup extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      loading: false,
      username: '',
      errors: {}
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
    axios.post('/signup', newUserData)
      .then(res => {
        console.log(res.data);
        localStorage.setItem('FBIdToken', `Bearer ${res.data.token}`);
        this.setState({
          loading: false
        });
        this.props.history.push('/');
      })
      .catch(err => {
        this.setState({
          errors: err.response.data,
          loading: false
        })
      })
    console.log('hi', event.target.value);
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    const { errors, loading } = this.state;
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

export default signup
