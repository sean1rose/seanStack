import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Stack, Box, Button, Text } from 'grommet'
import { Link } from 'react-router-dom'
import { Edit } from 'grommet-icons'
import { logoutUser, uploadImage } from '../redux/actions/userActions'

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
    fileInput.click();
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
              <Button style={{position: 'absolute', bottom: '0'}} plain icon={<Edit />} onClick={this.handleEditPicture} className='button' />
            </div>
          </div>
          <hr/>
          {username && <Text>{username}</Text>}
          <hr/>
          <div className='profile-details'>
            <Button as={Link} to={`/users/${username}`}  label={`@${username}`} />
          </div>
          {/* <hr/>
          {bio && <Text>{bio}</Text>} */}
          <hr/>
          {email && <Text>{email}</Text>}
          {/* {website && <div><a href={website} target="_blank" rel="noopener noreferrer" >{website}</a></div>} */}
          <hr/>
          <div>Joined {createdAt}</div>
        </div>
          
      </Stack>
    ) : (
      <Stack>
        <Text>No profile found, please login again</Text>
        <div><Button as={Link} to={`/login`}  label={`Login`} /></div>
        <div><Button as={Link} to={`/signup`}  label={`Signup`} /></div>
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
