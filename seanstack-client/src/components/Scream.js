import React, { Component } from 'react';
import { Box, Image, Heading, Text } from 'grommet';
import List from './List';
import ListItem from './ListItem';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux'
import { likeList, unlikeList } from '../redux/actions/dataActions'
import MyButton from '../utils/MyButton'
import { Chat, Favorite } from 'grommet-icons'

class Scream extends Component {
  likedList = () => {
    console.log('this.props - ', this.props)
    if(this.props.list && this.props.user.likes && this.props.user.likes.find(like => like.listId === this.props.list.listId)) {
      return true
    } else  {
      return false
    }
  }
  likeList = () => {
    console.log('this.props.listId = ', this.props);
    this.props.likeList(this.props.scream.listId);
  }
  unlikeList = () => {
    this.props.unlikeList(this.props.scream.listId);
  }

  render() {
    const { scream: { username, createdAt, list, title, likeCount, commentCount, userImage, listId}, user: {authenticated}} = this.props;

    const likeButton = !authenticated ? (<MyButton as={Link} to='login' icon={<Favorite color="plain" />} />) : this.likedList() ? (<MyButton onClick={this.unlikeList} icon={<Favorite color="green" />} />) : (<MyButton onClick={this.likeList} icon={<Favorite color="plain" />} />)
    return (
      <Box round="xxsmall" elevation="small" overflow="hidden">
        {
          userImage && (
            <Box height="small">
              <Image src={userImage} fit="cover"/>
            </Box>
          )
        }
        <Box align="center" pad={{horizontal: "medium", top: "large", bottom: "xsmall"}} >
          <Text as={Link} to={`/users/${username}`}>{username}</Text>
          <Heading level="3">
            {title}
          </Heading>
        </Box>
        <Box>
          <List pad={{horizontal: "large"}}>
            {
              Object.entries(list).map(([key, value], idx) => {
                return (
                  <ListItem  key={key} index={idx}>
                    <div>{key}</div>
                    <div>{value}</div>
                  </ListItem>
                )
              })
            }
          </List>
        </Box>
        <div style={{display: 'flex'}}>
          <div style={{display: 'flex'}}>
            {likeButton}
            <div style={{textAlign: 'center'}}>{likeCount ? likeCount : '0'} Likes</div>
          </div>
          <MyButton icon={<Chat/>} />
        </div>
      </Box>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user
})

const mapActionsToProps = {
  likeList,
  unlikeList
}

export default connect(mapStateToProps, mapActionsToProps)(Scream)
