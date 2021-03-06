import update from 'immutability-helper';

const initialState = {
  errorLogin: "",
  errorPassword: "",
  userRole: "",
  usuario: ""
}

const login = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_ROLE':
      return (
        update(state, {
          userRole: {$set: action.role},
          usuario: {$set: action.usuario}
        })
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
