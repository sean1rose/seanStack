import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { editUserDetails } from '../redux/actions/userActions'
import { Button, Layer, Box, FormField, TextArea, TextInput, Select, Heading } from 'grommet'
import { Close, Add, Edit,  } from 'grommet-icons'
import MyButton from '../utils/MyButton'

class EditDetails extends Component {
  state = {
    bio: '',
    website: '',
    location: '',
    open: false,
  }
  mapUserDetailsToState = (credentials) => {
    this.setState({
      bio: credentials.bio ? credentials.bio : '',
      website: credentials.website ? credentials.website : '',
      location: credentials.location ? credentials.location : '',
    })
  }  
  handleOpen = () => {
    this.setState({
      open: true
    })
    this.mapUserDetailsToState(this.props.credentials)
  }
  handleClose = () => {
    this.setState({ open: false})
  }
  handleChange = (event) => {
    console.log('event - ', event.target.name);
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  handleSubmit = () => {
    const userDetails = {
      bio: this.state.bio,
      website: this.state.website,
      location: this.state.location,
    }
    this.props.editUserDetails(userDetails)
    this.handleClose()
  }
  componentDidMount() {
    const { credentials } = this.props
    this.mapUserDetailsToState(credentials)
  }

  render() {
    return (
      <Fragment>
        <MyButton onClick={this.handleOpen} icon={<Edit />} />
        {this.state.open && (
          <Layer
            position="center"
            modal
            onClickOutside={this.handleClose}
            onEsc={this.handleClose}
            // full="vertical"
          >
            <Box
              as="form"
              fill="vertical"
              overflow="auto"
              width="medium"
              pad="medium"
              onSubmit={this.handleSubmit}
            >
              <Box flex={false} direction="row" justify="between">
                <Heading level={2} margin="none">Edit Details</Heading>
                <Button icon={<Close />} onClick={this.handleClose} />
              </Box>
              <Box flex="grow" overflow="auto" pad={{ veritcal: "medium"}}>
                <FormField label="Bio"  type="text"  >
                  <TextInput name="bio" placeholder="Short bio about yourself" value={this.state.bio}  onChange={this.handleChange} />
                </FormField>
                <FormField label="Website"  type="text"  >
                  <TextInput name="website" placeholder="Your personal url" value={this.state.website}  onChange={this.handleChange} />
                </FormField>
                <FormField label="Location"  type="text"   >
                  <TextInput name="location" placeholder="Where you from" value={this.state.location} onChange={this.handleChange} />
                </FormField>
              </Box>
              <div style={{display: 'flex'}} >
                <MyButton onClick={this.handleClose} label="Cancel" />
                <Button
                  type="submit"
                  label="Submit"
                  onClick={this.handleSubmit}
                  primary
                />
              </div>
            </Box>
          </Layer>
        )}
      </Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  credentials: state.user.credentials
})

export default connect(mapStateToProps, { editUserDetails }) (EditDetails)
