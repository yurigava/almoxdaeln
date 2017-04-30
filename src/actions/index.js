import axios from 'axios'

const serverUrl = 'http://192.168.0.69:8081';

export const changeRole = (role) => {
  return {
    type: 'CHANGE_ROLE',
    role
  }
}

export const setLogout = () => {
  return (dispatch) => {
    dispatch(setLoading(true));
    dispatch(changeRole('loggedOut'));
    return axios.get(serverUrl + '/logout', {withCredentials:true})
    .then((response) => {
      dispatch(setLoading(false));
    })
    .catch((error) => {
      dispatch(setLoading(false));
    });
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

export const submitLogin = (login, password, push) => {
  return (dispatch, getState) => {
    dispatch(setLoading(true));
    return axios.post(serverUrl + "/login", {
      login: login,
      password: password
    }, {withCredentials:true})
    .then((response) => {
      dispatch(setLoading(false));
      dispatch(setLoginStatus(true));
      dispatch(changeRole(response.data))
      push('/'+getState().appUi.pagesList[1].info.link)
    })
    .catch((error) => {
      dispatch(setLoading(false));
      dispatch(setLoginStatus(false));
    });
  }
}

export const toggleDrawerState = () => {
  return {
    type: 'TOGGLE_DRAWER'
  }
}
