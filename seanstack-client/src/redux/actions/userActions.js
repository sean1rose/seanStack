import { SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI } from '../types';
import axios from 'axios';

export const loginUser = (loginUserData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI}); 
  axios.post('/login', loginUserData)
    .then(res => {
      console.log(res.data);
      const fbIdToken = `Bearer ${res.data.token}`
      localStorage.setItem('FBIdToken', `Bearer ${res.data.token}`);
      axios.defaults.headers.common['Authorization'] = fbIdToken;
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS});
      history.push('/');
    })
    .catch(err => {
      dispatch({ type:  SET_ERRORS, payload: err.response.data})
    })
}

export const getUserData = () => (dispatch) => {
  axios.get('/user')
    .then(res => {
      dispatch({
        type: SET_USER,
        payload: res.data // user data
      })
    })
    .catch(err => console.log('err', err))
}