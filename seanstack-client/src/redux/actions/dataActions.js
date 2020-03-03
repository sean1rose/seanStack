import { SET_LISTS, LOADING_DATA, LIKE_LIST, UNLIKE_LIST } from '../types'
import axios from 'axios'

// get all screams
export const getLists = () => dispatch => {
  dispatch({ type: LOADING_DATA });
  axios.get('/lists')
    .then(res => {
      dispatch({
        type: SET_LISTS,
        payload: res.data
      })
    })
    .catch(err => {
      dispatch({
        type: SET_LISTS,
        payload: []
      })
    })
}

// like a list
export const likeList = (listId) => dispatch => {
  console.log('like list - ', listId)
  // axios.get(`/list/${listId}`)
  // .then(res => {
  //   console.log('resss - ', res);
  // })
  // .catch(err => console.log('err - ', err))
  axios.get(`/list/${listId}/like`)
    .then(res => {
      console.log('res - ', res);
      dispatch({
        type: LIKE_LIST,
        payload: res.data
      })
    })
    .catch(err => console.log(err));
}


// unlike a list
export const unlikeList = (listId) => dispatch => {
  axios.get(`/list/${listId}/unlike`)
    .then(res => {
      dispatch({
        type: UNLIKE_LIST,
        payload: res.data
      })
    })
    .catch(err => console.log(err));
}