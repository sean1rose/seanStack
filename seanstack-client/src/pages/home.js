import React, { Component } from 'react';
import List from '../components/List';
import ListItem from '../components/ListItem';
import Scream from '../components/Scream';
import {Box, Heading} from 'grommet';
import Profile from '../components/Profile';
import { connect } from 'react-redux'
import { getLists } from '../redux/actions/dataActions'

export class home extends Component {
  componentDidMount() {
    this.props.getLists()
  }

  render() {
    const { lists, loading } = this.props.data;
    console.log('home list - ', this.props.data, lists, lists.lists, loading);
    let recentListsMarkup = !loading && lists.lists
      ? (lists.lists.map((list, index) => {
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
        <Profile />
      </div>
    )
  }
}



const mapStateToProps = state => ({
  data: state.data
})

export default connect(mapStateToProps, { getLists })(home)
