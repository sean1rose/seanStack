import React, { Component } from 'react';
import axios from 'axios';
import List from '../components/List';
import ListItem from '../components/ListItem';
import Scream from '../components/Scream'
import {Box, Heading} from 'grommet'

export class home extends Component {
  state = {
    lists: null,
  }

  componentDidMount() {
    axios.get('/lists')
    // axios.get("https://us-central1-seanstack-daf2a.cloudfunctions.net/api/lists")
      .then(res => {
        // store lists in component state
        console.log('res.data.lists - ', res.data.lists)
        this.setState({
          lists: res.data.lists
        })
      })
      .catch(err => console.log('err', err))
  }

  render() {
  let recentListsMarkup = this.state.lists 
    ? (this.state.lists.map((list, index) => {
      return (
        <Box pad={{horizontal: "medium", top: "large", bottom: "xsmall"}} key={index} >
          <Box border={{color: "brand", size: "large"}} elevation="medium"  >
            <Scream 
              scream={list}
            />
          </Box>
        </Box>
      )
    })) 
    : <p>Loading...</p>

    return (
      <div style={{display: 'grid', gridTemplateColumns: '3fr 1fr', gridGap: '12px'}}>
        <div>
          {recentListsMarkup}
        </div>
        <div>Profile...</div>
      </div>
    )
  }
}

export default home
