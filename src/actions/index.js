import axios from 'axios'

const serverUrl = 'http://192.168.0.69:8081';

export const setDrawerState = (drawerOpen) => {
  return {
    type: 'SET_DRAWER',
    drawerOpen
  }
}

export const toggleDrawerState = () => {
  return {
    type: 'TOGGLE_DRAWER'
  }
}

export const changePassword = (password) => {
  return {
    type: 'CHANGE_PASSWORD',
    password
  }
}

export const changeLogin = (login) => {
  return {
    type: 'CHANGE_LOGIN',
    login
  }
}

export const changeRole = (role) => {
  return {
    type: 'CHANGE_ROLE',
    role
  }
}

export const setLoading = () => {
  return {
    type: 'SET_LOADING'
  }
}

export const setLoadingHide = () => {
  return {
    type: 'SET_LOADING_HIDE'
  }
}

export const submitLogin = () => {
  return (dispatch, getState) => {
    dispatch(setLoading())
    return axios.post(serverUrl + "/login", {
      login: getState().login.login,
      password: getState().login.password
    }, {withCredentials:true})
    .then((response) => {
      dispatch(setLoadingHide())
      dispatch(changeRole(response.data))
    })
    .catch((error) => {
      //dispatch(erro de resposta)
      dispatch(setLoadingHide())
    })
  }
}
