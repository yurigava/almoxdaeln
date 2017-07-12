export const setErrorDescription = (equipNumber, errorCode) => {
  return {
    type: 'SET_RESERVE_ERROR_DESCRIPTION',
    equipNumber,
    errorCode
  }
}

export const setError = (error) => {
  return {
    type: 'SET_ERROR_RESERVE',
    error
  }
}

export const setMissingFieldsError = (isMissingTipo, isMissingFamilia) => {
  return {
    type: 'SET_MISSING_FIELDS_ERROR_RESERVE',
    isMissingTipo,
    isMissingFamilia
  }
}

export const setMissingDateTimeError = (isMissingDateTime) => {
  return {
    type: 'SET_MISSING_DATETIME_ERROR_RESERVE',
    isMissingDateTime
  }
}

export const insertReserve = (serverUrl, usuario, date, turno, materia, equips) => {
  return {
    type: 'INSERT_RESERVE',
    serverUrl,
    usuario,
    date,
    turno,
    materia,
    equips
  }
}

export const quantidadeReserve = (serverUrl, familia, tipo, name, date, turno) => {
  return {
    type: 'QUANTIDADE_RESERVE',
    serverUrl,
    familia,
    tipo,
    name,
    date,
    turno
  }
}

export const setQuantidade = (quantidade, name) => {
  return {
    type: 'SET_QUANTIDADE',
    quantidade,
    name
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
