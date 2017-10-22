export const setReserves = (reserves) => {
  return {
    type: 'PREPARE_RESERVE_SET_RESERVES',
    reserves
  }
}

export const registerReservedEquips = (serverUrl, requisicao, usuario, carrinhos, patrimonios) => {
  return {
    type: 'REGISTER_RESERVED_EQUIPS',
    serverUrl,
    requisicao,
    usuario,
    carrinhos,
    patrimonios
  }
}

export const getReserveDetails = (serverUrl, reserveId) => {
  return {
    type: 'GET_RESERVE_DETAILS',
    serverUrl,
    reserveId
  }
}

export const getCarrinhos = (serverUrl) => {
  return {
    type: 'GET_AVAILABLE_CARRINHOS',
    serverUrl
  }
}

export const getReserves = (serverUrl, date, shift) => {
  return {
    type: 'GET_RESERVES',
    serverUrl,
    date,
    shift
  }
}

export const getEquipTipo = (serverUrl, id, barCode) => {
  return {
    type: 'GET_EQUIP_TIPO',
    serverUrl,
    id,
    barCode
  }
}

export const setInfoNumber = (infoNumber) => {
  return {
    type: 'PREPARE_RESERVE_SET_INFONUMBER',
    infoNumber
  }
}

export const setBarcodeValue = (id, value) => {
  return {
    type: 'PREPARE_RESERVE_SET_BARCODE_VALUE',
    id,
    value
  }
}

export const setBarcodeTipo = (id, equipTipo) => {
  return {
    type: 'PREPARE_RESERVE_SET_BARCODE_TIPO',
    id,
    equipTipo
  }
}

export const setBarcodeIsLoading = (id, isLoading) => {
  return {
    type: 'PREPARE_RESERVE_SET_BARCODE_LOADING',
    id,
    isLoading
  }
}

export const setBarcodeErrorCode = (id, errorCode) => {
  return {
    type: 'PREPARE_RESERVE_SET_BARCODE_ERROR_CODE',
    id,
    errorCode
  }
}

export const removeBarcode = (id) => {
  return {
    type: 'PREPARE_RESERVE_REMOVE_BARCODE',
    id
  }
}

export const addBarcode = () => {
  return {
    type: 'PREPARE_RESERVE_ADD_BARCODE'
  }
}

export const clearBarcodes = () => {
  return {
    type: 'PREPARE_RESERVE_CLEAR_BARCODES'
  }
}

export const incrementMissingReserve = (index) => {
  return {
    type: 'PREPARE_RESERVE_INCREMENT_RESERVE_EQUIP',
    index
  }
}

export const decrementMissingReserve = (index) => {
  return {
    type: 'PREPARE_RESERVE_DECREMENT_RESERVE_EQUIP',
    index
  }
}

export const resetMissingReserve = (index) => {
  return {
    type: 'PREPARE_RESERVE_RESET_RESERVE_EQUIP',
    index
  }
}

export const setCarrinhoErrorText = (message) => {
  return {
    type: 'PREPARE_RESERVE_SET_CARRINHO_ERROR_TEXT',
    message
  }
}

export const setCarrinhos = (carrinhos) => {
  return {
    type: 'PREPARE_RESERVE_SET_AVAILABLE_CARRINHOS',
    carrinhos
  }
}

export const setReserveEquips = (reserveEquips, requisicao) => {
  return {
    type: 'PREPARE_RESERVE_SET_RESERVE_EQUIPS',
    reserveEquips,
    requisicao
  }
}
