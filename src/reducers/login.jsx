import update from 'immutability-helper';

const initialState = {
  isInputDisabled: false,
  errorLogin: "",
  errorPassword: "",
  userRole: 'loggedOut'
}

const login = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_ROLE':
        return (
          update(state, {userRole: {$set: action.role}})
        )

    case 'SET_LOADING':
      return (
        update(state, {isInputDisabled: {$set: true}})
      )

    case 'SET_LOADING_HIDE':
      if (action.success) {
        return (
          update(state, {
            isInputDisabled: {$set: false},
            errorLogin: {$set: ""},
            errorPassword: {$set: ""}})
        )
      }
      else {
        return (
          update(state, {
            isInputDisabled: {$set: false},
            errorLogin: {$set: " "},
            errorPassword: {$set: "Login ou senha incorreto."}})
        )
      }

    default:
      return state
  }
}

export default login
