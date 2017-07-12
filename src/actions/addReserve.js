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

export const insertReserve = (serverUrl, date, materia, equips) => {
  return {
    type: 'INSERT_RESERVE',
    serverUrl,
    date,
    materia,
    equips
  }
}

export const quantidadeReserve = (serverUrl) => {
  return {
    type: 'QUANTIDADE_RESERVE',
    serverUrl
  }
}

export const setQuantidade = (quantidade) => {
  return {
    type: 'SET_QUANTIDADE',
    quantidade
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
