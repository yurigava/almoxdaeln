export const insertStudentLend = (serverUrl, usuario, patrimonios) => {
  return {
    type: 'INSERT_STUDENT_LEND',
    serverUrl,
    usuario,
    patrimonios
  }
}

export const setErrorDescription = (equipNumbers, errorCode) => {
  return {
    type: 'SET_STUDENT_LEND_ERROR_DESCRIPTION',
    equipNumbers,
    errorCode
  }
}
