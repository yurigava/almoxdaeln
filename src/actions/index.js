import axios from 'axios'

export const changeRole = (role) => {
  return {
    type: 'CHANGE_ROLE',
    role
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

export const getUserRole = (serverUrl) => {
  return {
    type: 'GET_USER_ROLE',
    serverUrl
  }
}

export const setDrawerState = (drawerOpen) => {
  return {
    type: 'SET_DRAWER',
    drawerOpen
  }
}

export const setLoading = (isLoading) => {
  return {
    type: 'SET_LOADING',
    isLoading
  }
}

export const setLoginStatus = (success) => {
  return {
    type: 'SET_LOGIN_STATUS',
    success
  }
}

export const toggleDrawerState = () => {
  return {
    type: 'TOGGLE_DRAWER'
  }
}
