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

export const setSubmissionMessage = (message) => {
  return {
    type: 'SET_SUBMISSION_MESSAGE',
    message
  }
}

export const setDataSubmitted = (submitted) => {
  return {
    type: 'SET_DATA_SUBMITTED',
    submitted
  }
}
