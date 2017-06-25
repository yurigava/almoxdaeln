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

export const toggleDrawerState = () => {
  return {
    type: 'TOGGLE_DRAWER'
  }
}
