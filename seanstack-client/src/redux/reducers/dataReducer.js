import { SET_LISTS, LIKE_LIST, UNLIKE_LIST, LOADING_DATA } from '../types'

const initialState = {
  lists: [],
  list: {},
  loading: false
}

export default function(state = initialState, action) {
  switch(action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true
      }
    case SET_LISTS:
      return {
        ...state,
        lists: action.payload,
        loading: false
      }
    case LIKE_LIST:
    case UNLIKE_LIST:
      console.log('state - ', state, action)
      let index = state.lists.findIndex((list) => list.listId === action.payload.listId)
      state.lists[index] = action.payload;
      return {
        ...state,
      }
    default:
      return state;
  }
}