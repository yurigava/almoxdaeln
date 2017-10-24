export const setReserves = (reserves) => {
  return {
    type: 'PROVIDE_RESERVE_SET_RESERVES',
    reserves
  }
}

export const getPreparedReserves = (serverUrl) => {
  return {
    type: 'PROVIDE_RESERVE_GET_RESERVES',
    serverUrl
  }
}

export const registerDeliveredReserve = (serverUrl, id) => {
  return {
    type: 'PROVIDE_RESERVE_REGISTER_DELIVERED',
    serverUrl,
    id
  }
}
