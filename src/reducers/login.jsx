import update from 'immutability-helper';

const initialState = {
  login: '',
  password: '',
  userRole: 'loggedOut'
}

const login = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_LOGIN':
      return (
        update(state, {login: {$set: action.login}})
      )

    case 'CHANGE_PASSWORD':
      return (
        update(state, {password: {$set: action.password}})
      )

    case 'CHANGE_ROLE':
        return (state, {userRole: {$set: action.role}})

    default:
      return state
  }
}

export default login
