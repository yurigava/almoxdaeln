export const setTipos = (tipos) => {
  return {
    type: 'SET_TIPOS',
    tipos
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
