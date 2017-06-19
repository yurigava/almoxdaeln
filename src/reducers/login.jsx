import update from 'immutability-helper';

const initialState = {
  isInputDisabled: false,
  errorLogin: "",
  errorPassword: "",
  userRole: ""
}

const login = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_ROLE':
      return (
        update(state, {userRole: {$set: action.role}})
      )

    case 'SET_LOADING':
      return (
        update(state, {isInputDisabled: {$set: action.isLoading}})
      )

    case 'SET_LOGIN_STATUS':
      if (action.success) {
        return (
          update(state, {
            errorLogin: {$set: ""},
            errorPassword: {$set: ""}})
        )
      }
      else {
        return (
          update(state, {
            errorLogin: {$set: " "},
            errorPassword: {$set: "Login ou senha incorretos."}})
        )
      }

    default:
      return state
  }
}

export default login
