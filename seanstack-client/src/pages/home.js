import React, { Component } from 'react';
import axios from 'axios';
// axios.defaults.proxy.host = "https://us-central1-seanstack-daf2a.cloudfunctions.net/api";

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
  let recentListsMarkup = this.state.lists ? (this.state.lists.map(list => <p key={list.listId}>{list.list['1']}</p>)) : <p>Loading...</p>
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
