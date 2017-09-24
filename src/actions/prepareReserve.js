export const setReserves = (reserves) => {
  return {
    type: 'PREPARE_RESERVE_SET_RESERVES',
    reserves
  }
}

export const registerReservedEquips = (serverUrl, requisicao, usuario, patrimonios) => {
  return {
    type: 'REGISTER_RESERVED_EQUIPS',
    serverUrl,
    requisicao,
    usuario,
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

export const getReserves = (serverUrl, date, shift) => {
  return {
    type: 'GET_RESERVES',
    serverUrl,
    date,
    shift
  }
}

export const getEquipTipo = (serverUrl, index, barCode) => {
  return {
    type: 'GET_EQUIP_TIPO',
    serverUrl,
    index,
    barCode
  }
}

export const setInfoNumber = (infoNumber) => {
  return {
    type: 'PREPARE_RESERVE_SET_INFONUMBER',
    infoNumber
  }
}

export const setBarcodeValue = (index, value) => {
  return {
    type: 'PREPARE_RESERVE_SET_BARCODE_VALUE',
    index,
    value
  }
}

export const setBarcodeTipo = (index, equipTipo) => {
  return {
    type: 'PREPARE_RESERVE_SET_BARCODE_TIPO',
    index,
    equipTipo
  }
}

export const setBarcodeIsLoading = (index, isLoading) => {
  return {
    type: 'PREPARE_RESERVE_SET_BARCODE_LOADING',
    index,
    isLoading
  }
}

export const setBarcodeErrorCode = (index, errorCode) => {
  return {
    type: 'PREPARE_RESERVE_SET_BARCODE_ERROR_CODE',
    index,
    errorCode
  }
}

export const removeBarcode = (index) => {
  return {
    type: 'PREPARE_RESERVE_REMOVE_BARCODE',
    index
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

export const setReserveEquips = (reserveEquips, requisicao) => {
  return {
    type: 'PREPARE_RESERVE_SET_RESERVE_EQUIPS',
    reserveEquips,
    requisicao
  }
}
