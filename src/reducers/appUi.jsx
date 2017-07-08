import update from 'immutability-helper';
import { pagesList } from './pagesList.jsx'

const initialState =
{
  isDrawerOpen: false,
  loadingStatus: 'hide',
  isInputDisabled: false,
  submissionMessage: "",
  pagesList
}

const appUi = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_DRAWER':
      return (
        update(state, {isDrawerOpen: {$set: !state.isDrawerOpen}})
      )

    case 'SET_SUBMISSION_MESSAGE':
      return (
        update(state, {submissionMessage: {$set: action.message}})
      )

    case 'SET_DRAWER':
      return (
        update(state, {isDrawerOpen: {$set: action.drawerOpen}})
      )

    case 'SET_LOADING':
      if (action.isLoading) {
        return (
          update(state, {
            loadingStatus: {$set: 'loading'},
            isInputDisabled: {$set: true}
          })
        )
      }
      else {
        return (
          update(state, {
            loadingStatus: {$set: 'hide'},
            isInputDisabled: {$set: false}
          })
        )
      }

    default:
      return state
  }
}

export default appUi
