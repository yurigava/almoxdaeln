import update from 'immutability-helper';

const initialState =
{
  isDrawerOpen: false,
  visibleLinks: [0],
  loadingStatus: 'hide',
  pagesList: [
    {
      info: {
        link: 'login',
        linkText: 'Login'
      },
      allowedRoles: [
        'loggedOut'
      ]
    },
    {
      info: {
        link: 'equips',
        linkText: 'Equipamentos'
      },
      allowedRoles: [
        "almoxarife",
        "professor",
        "admin"
      ]
    },
    {
      info: {
        link: 'students',
        linkText: 'Estudantes'
      },
      allowedRoles: [
        "almoxarife",
        "professor",
        "admin"
      ]
    },
    {
      info: {
        link: 'logout',
        linkText: 'Logout'
      },
      allowedRoles: [
        "almoxarife",
        "professor",
        "admin"
      ]
    }
  ]
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
