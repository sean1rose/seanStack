import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Stack, Box, Button, Text } from 'grommet'
import { Link } from 'react-router-dom'

class Profile extends Component {
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
          <div style={{width: '200px', height: '200px'}} className='profile-image'>
            <img style={{width: '200px', height: '200px'}} src={imageUrl}/>
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

export default connect(mapStateToProps)(Profile)
