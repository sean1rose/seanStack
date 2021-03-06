import { SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI, SET_UNAUTHENTICATED, LOADING_USER } from '../types';
import axios from 'axios';

export const loginUser = (loginUserData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI}); 
  axios.post('/login', loginUserData)
    .then(res => {
      console.log(res.data);
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS});
      history.push('/');
    })
    .catch(err => {
      dispatch({ type:  SET_ERRORS, payload: err.response.data})
    })
}

export const getUserData = () => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios.get('/user')
    .then(res => {
      dispatch({
        type: SET_USER,
        payload: res.data // user data
      })
    })
    .catch(err => console.log('err', err))
}

export const uploadImage = (formData) => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios.post('/user/image', formData)
    .then(res => {
      dispatch(getUserData());
    })
    .catch(err => console.log(err));
}

export const signupUser = (newUserData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI}); 
  axios.post('/signup', newUserData)
    .then(res => {
      console.log(res.data);
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS});
      history.push('/');
    })
    .catch(err => {
      dispatch({ type:  SET_ERRORS, payload: err.response.data})
    })
}

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('FBIdToken');
  delete axios.defaults.headers.common['Authorization'];
  dispatch({ type: SET_UNAUTHENTICATED});
}

const setAuthorizationHeader = (token) => {
  const fbIdToken = `Bearer ${token}`
  localStorage.setItem('FBIdToken', fbIdToken);
  axios.defaults.headers.common['Authorization'] = fbIdToken;

}

export const editUserDetails = (userDetails) => (dispatch) => {
  console.log('editUserDetails - ', userDetails);
  dispatch({ type: LOADING_USER});
  axios.post('/user', userDetails)
    .then(() => {
      dispatch(getUserData());
    })
    .catch(err => console.log(err));
}