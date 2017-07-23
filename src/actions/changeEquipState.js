export const updateEquipState = (serverUrl, patrimonio, estado) => {
  return {
    type: 'UPDATE_EQUIP_STATE',
    serverUrl,
    patrimonio,
    estado
  }
}

export const setEstados = (estados) => {
  return {
    type: 'SET_ESTADOS',
    estados
  }
}

export const getEstados = (serverUrl) => {
  return {
    type: 'GET_ESTADOS',
    serverUrl
  }
}
