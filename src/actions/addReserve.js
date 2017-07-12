export const setErrorDescription = (equipNumber, errorCode) => {
  return {
    type: 'SET_RESERVE_ERROR_DESCRIPTION',
    equipNumber,
    errorCode
  }
}

export const setMissingFieldsError = (isMissingTipo, isMissingFamilia) => {
  return {
    type: 'SET_MISSING_FIELDS_ERROR_RESERVE',
    isMissingTipo,
    isMissingFamilia
  }
}

export const insertReserve = (serverUrl, patrimonios, date) => {
  return {
    type: 'INSERT_RESERVE',
    serverUrl,
    patrimonios,
    date,
  }
}

export const setSelectedTipo = (tipo) => {
  return {
    type: 'ADD_RESERVE_SET_SELECTED_TIPO',
    tipo
  }
}

export const setSelectedFamilia = (familia) => {
  return {
    type: 'ADD_RESERVE_SET_SELECTED_FAMILIA',
    familia
  }
}

export const setinfoNumber = (infoNumber) => {
  return {
    type: 'ADD_RESERVE_SET_INFO_NUMBER',
    infoNumber
  }
}
