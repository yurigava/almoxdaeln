export const insertStudentLend = (serverUrl, usuario, patrimonios, shouldAddToRequest) => {
  return {
    type: 'INSERT_STUDENT_LEND',
    serverUrl,
    usuario,
    patrimonios,
    shouldAddToRequest,
  }
}

export const setErrorDescription = (equipNumbers, errorCode) => {
  return {
    type: 'SET_STUDENT_LEND_ERROR_DESCRIPTION',
    equipNumbers,
    errorCode
  }
}

export const setIsYesNoMessage = (isYesNoMessage) => {
  return {
    type: 'SET_STUDENT_LEND_IS_YES_NO_MESSAGE',
    isYesNoMessage
  }
}
