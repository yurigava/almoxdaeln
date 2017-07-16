export const setErrorDescription = (equipNumber, errorCode) => {
  return {
    type: 'SET_INSERT_EQUIP_ERROR_DESCRIPTION',
    equipNumber,
    errorCode
  }
}

export const setMissingFieldsError = (isMissingTipo, isMissingFamilia) => {
  return {
    type: 'SET_MISSING_FIELDS_ERROR',
    isMissingTipo,
    isMissingFamilia
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

export const setSelectedTipo = (tipo) => {
  return {
    type: 'ADD_EQUIP_SET_SELECTED_TIPO',
    tipo
  }
}

export const setSelectedFamilia = (familia) => {
  return {
    type: 'ADD_EQUIP_SET_SELECTED_FAMILIA',
    familia
  }
}

export const setInfoNumber = (infoNumber) => {
  return {
    type: 'ADD_EQUIP_SET_INFO_TEXT',
    infoNumber
  }
}
