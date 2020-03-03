import { SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI, SET_AUTHENTICATED, SET_UNAUTHENTICATED, LOADING_USER, LIKE_LIST, UNLIKE_LIST } from '../types';

const initialState = {
  authenticated: false,
  loading: false,
  credentials: {},
  likes: [],
  notifications: []
};

export default function(state = initialState, action) {
  switch(action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true
      }
    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_USER:
      return {
        authenticated: true,
        loading: false,
        ...action.payload
      };
    case LOADING_USER:
      return {
        ...state,
        loading: true
      }
    case LIKE_LIST:
      return {
        ...state,
        likes: [
          ...state.likes,
          {
            username: state.credentials.username,
            listId: action.payload.listId
          }
        ]
      }
    case UNLIKE_LIST:
      return {
        ...state,
        likes: state.likes.filter(like => like.listId !== action.payload.listId)
      }
    default:
      return state;
  }
}