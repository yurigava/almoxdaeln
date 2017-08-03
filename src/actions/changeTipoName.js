export const updateTipoName = (serverUrl, familiaIndex, tipoIndex, tipoNewName) => {
  return {
    type: 'UPDATE_TIPO_NAME',
    serverUrl,
    familiaIndex,
    tipoIndex,
    tipoNewName
  }
}

export const setFamilia = (familia) => {
  return {
    type: 'SET_CHANGE_TIPO_NAME_FAMILIA',
    familia
  }
}

export const setTipo = (tipo) => {
  return {
    type: 'SET_CHANGE_TIPO_NAME_TIPO',
    tipo
  }
}
