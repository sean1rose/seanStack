import React, { Component } from 'react';
import { Box, Image, Heading, Text } from 'grommet';
import List from './List';
import ListItem from './ListItem';
import {Link} from 'react-router-dom';

class Scream extends Component {
  render() {
    const { scream: { username, createdAt, list, title, likeCount, commentCount, userImage, listId}} = this.props;
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
      </Box>
    )
  }
}

export default Scream
