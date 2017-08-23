export const setMissingFieldsError = (isMissingTipo, isMissingFamilia) => {
  return {
    type: 'SET_MISSING_FIELDS_ERROR_EQUIPGRAPH',
    isMissingTipo,
    isMissingFamilia
  }
}

export const setSelectedTipo = (tipo) => {
  return {
    type: 'EQUIPGRAPH_SET_SELECTED_TIPO',
    tipo
  }
}

export const setSelectedFamilia = (familia) => {
  return {
    type: 'EQUIPGRAPH_SET_SELECTED_FAMILIA',
    familia
  }
}

export const setInfoNumber = (infoNumber) => {
  return {
    type: 'EQUIPGRAPH_SET_INFO_NUMBER',
    infoNumber
  }
}

export const raiseLowerWidth = (widthActual, width) => {
  return {
    type: 'RAISE_LOWER_WIDTH_EQUIPGRAPH',
    widthActual,
    width
  }
}

export const quantidadeEquipsGraph = (serverUrl, familia, tipo, dataInicial, dataFinal) => {
  return {
    type: 'QUANTIDADE_EQUIPGRAPH',
    serverUrl,
    familia,
    tipo,
    dataInicial,
    dataFinal
  }
}

export const setQuantidadeEquipGraph = (quantidade, referencia) => {
  return {
    type: 'SET_QUANTIDADE_EQUIPGRAPH',
    quantidade,
    referencia
  }
}