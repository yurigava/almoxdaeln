export const updateFamiliaName = (serverUrl, familiaIndex, familiaNewName) => {
  return {
    type: 'UPDATE_FAMILIA_NAME',
    serverUrl,
    familiaIndex,
    familiaNewName
  }
}

