export const insertStudentReturn = (serverUrl, usuario, patrimonios) => {
  return {
    type: 'INSERT_STUDENT_RETURN',
    serverUrl,
    usuario,
    patrimonios
  }
}

export const setErrorDescription = (equipNumbers, errorCode) => {
  return {
    type: 'SET_STUDENT_RETURN_ERROR_DESCRIPTION',
    equipNumbers,
    errorCode
  }
}
