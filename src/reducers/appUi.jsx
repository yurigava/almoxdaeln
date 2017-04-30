import update from 'immutability-helper';

const linksLoggedOut = [1];
const linksAlmoxarife = [3,2];
const linksProfessor = [3,2];
const linksAdmin = [3,2];

const initialState =
{
  isDrawerOpen: false,
  visibleLinks: [1],
  loadingStatus: 'hide',
  linksById: {
    '1': {
      link: 'login',
      linkText: 'Login'
    },
    '2': {
      link: 'logout',
      linkText: 'Logout'
    },
    '3': {
      link: 'equips',
      linkText: 'Equipamentos'
    }
  }
}

const appUi = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_ROLE':
      switch (action.role) {
        case 'almoxarife':
          return (
            update(state, {visibleLinks: {$set: linksAlmoxarife}})
          )

        case 'professor':
          return (
            update(state, {visibleLinks: {$set: linksProfessor}})
          )

        case 'admin':
          return (
            update(state, {visibleLinks: {$set: linksAdmin}})
          )

        case 'loggedOut':
          return (
            update(state, {visibleLinks: {$set: linksLoggedOut}})
          )
      }

    case 'TOGGLE_DRAWER':
      return (
        update(state, {isDrawerOpen: {$set: !state.isDrawerOpen}})
      )

    case 'SET_DRAWER':
      return (
        update(state, {isDrawerOpen: {$set: action.drawerOpen}})
      )

    case 'SET_LOADING':
      return (
        update(state, {loadingStatus: {$set: 'loading'}})
      )

    case 'SET_LOADING_HIDE':
      return (
        update(state, {loadingStatus: {$set: 'hide'}})
      )

    default:
      return state
  }
}

export default appUi
