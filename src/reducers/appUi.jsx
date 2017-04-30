import update from 'immutability-helper';

const linksLoggedOut = [0];
const linksAlmoxarife = [2,1];
const linksProfessor = [2,1];
const linksAdmin = [2,1];

const initialState =
{
  isDrawerOpen: false,
  visibleLinks: [0],
  loadingStatus: 'hide',
  linksById: [
    {
      link: 'login',
      linkText: 'Login'
    },
    {
      link: 'logout',
      linkText: 'Logout'
    },
    {
      link: 'equips',
      linkText: 'Equipamentos'
    }
  ]
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
