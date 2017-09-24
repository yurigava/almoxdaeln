export const setReserves = (reserves) => {
  return {
    type: 'SET_RESERVES',
    reserves
  }
}

export const getReserveDetails = (serverUrl, reserveId) => {
  return {
    type: 'GET_RESERVE_DETAILS',
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

export const setInfoNumber = (infoNumber) => {
  return {
    type: 'SET_INFONUMBER',
    infoNumber
  }
}
