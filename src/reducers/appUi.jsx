import update from 'immutability-helper';
import { pagesList } from './pagesList.jsx'

console.log(pagesList);
const initialState =
{
  isDrawerOpen: false,
  loadingStatus: 'hide',
  pagesList
}

const appUi = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_DRAWER':
      return (
        update(state, {isDrawerOpen: {$set: !state.isDrawerOpen}})
      )

    case 'SET_DRAWER':
      return (
        update(state, {isDrawerOpen: {$set: action.drawerOpen}})
      )

    case 'SET_LOADING':
      if (action.isLoading) {
        return (
          update(state, {loadingStatus: {$set: 'loading'}})
        )
      }
      else {
        return (
          update(state, {loadingStatus: {$set: 'hide'}})
        )
      }

    default:
      return state
  }
}

export default appUi
