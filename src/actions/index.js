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
    if (link !== 'logout') {
      dispatch(toggleDrawerState());
    }
    else {
      dispatch(changeRole('loggedOut'));
      dispatch(toggleDrawerState());
      dispatch(setLoading());
      return axios.get(serverUrl + '/logout', {withCredentials:true})
      .then((response) => {
        dispatch(setLoadingHide(true))
      })
      .catch((error) => {
        dispatch(setLoadingHide(true))
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

export const setLoading = () => {
  return {
    type: 'SET_LOADING'
  }
}

export const setLoadingHide = (success) => {
  return {
    type: 'SET_LOADING_HIDE',
    success
  }
}

export const submitLogin = (login, password) => {
  return (dispatch) => {
    dispatch(setLoading());
    return axios.post(serverUrl + "/login", {
      login: login,
      password: password
    }, {withCredentials:true})
    .then((response) => {
      dispatch(setLoadingHide(true))
      dispatch(changeRole(response.data))
    })
    .catch((error) => {
      dispatch(setLoadingHide(false))
    });
  }
}

export const toggleDrawerState = () => {
  return {
    type: 'TOGGLE_DRAWER'
  }
}
