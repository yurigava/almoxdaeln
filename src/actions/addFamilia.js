export const setCreatedFamiliaNumber = (familiaNumber) => {
  return {
    type: 'SET_CREATED_FAMILIA_NUMBER',
    familiaNumber
  }
}

export const insertFamilia = (serverUrl, familia) => {
  return {
    type: 'INSERT_FAMILIA',
    serverUrl,
    familia,
  }
}
