import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Stack, Box, Button, Text } from 'grommet'
import { Link } from 'react-router-dom'
import { Edit, Logout } from 'grommet-icons'
import { logoutUser, uploadImage } from '../redux/actions/userActions'
import EditDetails from './EditDetails'
import MyButton from '../utils/MyButton'

class Profile extends Component {
  handleImageChange = (event) => {
    const image = event.target.files[0];
    // send to server
    const formData = new FormData();
    formData.append('image', image, image.name);
    this.props.uploadImage(formData);

  }
  handleEditPicture = () => {
    const fileInput = document.getElementById('imageInput');
    fileInput.click()
  }
  handleLogout = () => {
    this.props.logoutUser()
  }
  render() {
    const { 
      classes, 
      user: { 
        credentials: { username, createdAt, imageUrl, bio, website, location, email }, 
        loading,
        authenticated
      }
    } = this.props;
    console.log('this.props > ', this.props)
    let profileMarkup = !loading ? (authenticated ? (
      <Stack>
        <div className='profile'>
          <div style={{width: '200px', height: '200px', display: 'flex'}} className='profile-image'>
            <img style={{width: '200px', height: '200px', borderRadius: '50%'}} src={imageUrl}/>
            <input type='file' id='imageInput' hidden='hidden' onChange={this.handleImageChange}/>
            <div style={{position: 'relative'}}>
              <MyButton style={{position: 'absolute', bottom: '0'}} icon={<Edit/>} onClick={this.handleEditPicture} />
            </div>
          </div>
          <hr/>
          {username && <Text>{username}</Text>}
          <hr/>
          <div className='profile-details'>
            <Button as={Link} to={`/users/${username}`}  label={`@${username}`} />
          </div>
          <hr/>
          {bio && <Text>{bio}</Text>}
          <hr/>
          {email && <Text>{email}</Text>}
          <hr/>
          {website && <div><a href={website} target="_blank" rel="noopener noreferrer" >{website}</a></div>}
          <hr/>
          {location && <Text>{location}</Text>}
          <hr/>
          <div>Joined {createdAt}</div>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div><EditDetails /><span>Edit Details</span></div>
            <div onClick={this.handleLogout}>
              <MyButton icon={<Logout />} />
              <span>Logout</span>
            </div>

          </div>
        </div>
          
      </Stack>
    ) : (
      <Stack >
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <Text>No profile found, please login again</Text>
          <div style={{display: 'flex'}}>
            <div><Button as={Link} to={`/login`}  label={`Login`} /></div>
            <div><Button as={Link} to={`/signup`}  label={`Signup`} /></div>
          </div>
        </div>
      </Stack>
    )) : (<p>Loading...</p>)


    return profileMarkup
  }
}

const mapStateToProps = (state) => ({
  user: state.user
})

const mapActionsToProps = { logoutUser, uploadImage }

export default connect(mapStateToProps, mapActionsToProps)(Profile)
