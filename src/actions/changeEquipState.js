export const updateEquipState = (serverUrl, usuario, patrimonio, estado, observacao) => {
  return {
    type: 'UPDATE_EQUIP_STATE',
    serverUrl,
    usuario,
    patrimonio,
    estado,
    observacao
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
