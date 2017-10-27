export const setPendingEquips = (pendingEquips) => {
  return {
    type: 'SET_PENDING_EQUIPS',
    pendingEquips
  }
}

export const getPendingEquips = (serverUrl) => {
  return {
    type: 'GET_PENDING_EQUIPS',
    serverUrl
  }
}
