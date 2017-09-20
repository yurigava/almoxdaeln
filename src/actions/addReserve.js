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

export const quantidadeReserve = (serverUrl, familia, tipo, name) => {
  return {
    type: 'QUANTIDADE_RESERVE',
    serverUrl,
    familia,
    tipo,
    name
  }
}

export const setQuantidade = (index, quantidade) => {
  return {
    type: 'RESERVE_SET_QUANTIDADE',
    index,
    quantidade
  }
}

export const setAvailable = (index, availableEquips) => {
  return {
    type: 'RESERVE_SET_AVAILABLEQUIPS',
    index,
    availableEquips
  }
}

export const removeEquip = (index) => {
  return {
    type: 'RESERVE_REMOVE_EQUIP',
    index
  }
}

export const addEquip = () => {
  return {
    type: 'RESERVE_ADD_EQUIP'
  }
}

export const clearEquips = () => {
  return {
    type: 'RESERVE_CLEAR_EQUIPS'
  }
}

export const setSelectedTipo = (index, tipo) => {
  return {
    type: 'RESERVE_SET_SELECTED_TIPO',
    index,
    tipo
  }
}

export const setSelectedFamilia = (index, familia) => {
  return {
    type: 'RESERVE_SET_SELECTED_FAMILIA',
    index,
    familia
  }
}

export const setInfoNumber = (infoNumber) => {
  return {
    type: 'RESERVE_SET_INFO_NUMBER',
    infoNumber
  }
}

export const getLastReq = (serverUrl, usuario) => {
  return {
    type: 'RESERVE_GET_LAST_REQ',
    serverUrl,
    usuario
  }
}

export const setLastReq = (equipamento, requisicoes) => {
  return {
    type: 'RESERVE_SET_LAST_REQ',
    equipamento,
    requisicoes
  }
}

export const clearLastReq = () => {
  return {
    type: 'RESERVE_CLEAR_SET_LAST_REQ'
  }
}