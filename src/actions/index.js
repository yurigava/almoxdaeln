import axios from 'axios'

const serverUrl = 'http://192.168.0.69:8081';

export const changeRole = (role) => {
  return {
    type: 'CHANGE_ROLE',
    role
  }
}

export const checkLogout = (link) => {
  return (dispatch) => {
    if (link !== 'Logout') {
      dispatch(toggleDrawerState());
    }
    else {
      dispatch(changeRole('loggedOut'));
      dispatch(toggleDrawerState());
      dispatch(setLoading(true));
      return axios.get(serverUrl + '/logout', {withCredentials:true})
      .then((response) => {
        dispatch(setLoading(false));
      })
      .catch((error) => {
        dispatch(setLoading(false));
      });
    }
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

export const submitLogin = (login, password) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    return axios.post(serverUrl + "/login", {
      login: login,
      password: password
    }, {withCredentials:true})
    .then((response) => {
      dispatch(setLoading(false));
      dispatch(setLoginStatus(true));
      dispatch(changeRole(response.data))
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
