export const changeRole = (role) => {
  return {
    type: 'CHANGE_ROLE',
    role
  }
}

export const setUsuario = (usuario) => {
  return {
    type: 'SET_USUARIO',
    usuario
  }
}

export const setLogout = (serverUrl) => {
  return {
    type: 'LOG_USER_OUT',
    serverUrl
  }
}

export const submitLogin = (serverUrl, login, password) => {
  return {
    type: 'SUBMIT_LOGIN',
    serverUrl,
    login,
    password
  }
}

export const setLoginStatus = (success) => {
  return {
    type: 'SET_LOGIN_STATUS',
    success
  }
}

export const getUserRole = (serverUrl) => {
  return {
    type: 'GET_USER_ROLE',
    serverUrl
  }
}
