export const setReserves = (reserves) => {
  return {
    type: 'RETURN_RESERVE_SET_RESERVES',
    reserves
  }
}

export const registerReturnedEquips = (serverUrl, reserveId, equips, usuario) => {
  return {
    type: 'RETURN_RESERVE_REGISTER_RETURNED_EQUIPS',
    serverUrl,
    reserveId,
    equips,
    usuario
  }
}

export const setReserveId = (reserveId) => {
  return {
    type: 'RETURN_RESERVE_SET_RESERVE_ID',
    reserveId
  }
}

export const getInUseReserves = (serverUrl) => {
  return {
    type: 'RETURN_RESERVE_GET_IN_USE_RESERVES',
    serverUrl
  }
}

export const getReturnedReserveDetails = (serverUrl, id) => {
  return {
    type: 'RETURN_RESERVE_GET_RESERVE_DETAILS',
    serverUrl,
    id
  }
}

export const setReturnedReserveDetails = (lentEquips) => {
  return {
    type: 'RETURN_RESERVE_SET_RESERVE_DETAILS',
    lentEquips
  }
}

export const registerDeliveredReserve = (serverUrl, id) => {
  return {
    type: 'RETURN_RESERVE_REGISTER_DELIVERED',
    serverUrl,
    id
  }
}

