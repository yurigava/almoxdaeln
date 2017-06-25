export const setErrorDescription = (equipNumber, errorCode) => {
  return {
    type: 'SET_INSERT_ERROR_DESCRIPTION',
    equipNumber,
    errorCode
  }
}

export const setTipos = (tipos) => {
  return {
    type: 'SET_TIPOS',
    tipos
  }
}

export const setDataSubmitted = (submitted) => {
  return {
    type: 'SET_DATA_SUBMITTED',
    submitted
  }
}

export const setSubmissionMessage = (message) => {
  return {
    type: 'SET_SUBMISSION_MESSAGE',
    message
  }
}

export const setMissingFieldsError = (isMissingTipo, isMissingFamilia) => {
  return {
    type: 'SET_MISSING_FIELDS_ERROR',
    isMissingTipo,
    isMissingFamilia
  }
}

export const setFamilias = (familias) => {
  return {
    type: 'SET_FAMILIAS',
    familias
  }
}

export const getTipos = (serverUrl) => {
  return {
    type: 'GET_TIPOS',
    serverUrl
  }
}

export const getFamilias = (serverUrl) => {
  return {
    type: 'GET_FAMILIAS',
    serverUrl
  }
}

export const insertEquips = (serverUrl, patrimonios, id_tipo) => {
  return {
    type: 'INSERT_EQUIPS',
    serverUrl,
    patrimonios,
    id_tipo,
  }
}
