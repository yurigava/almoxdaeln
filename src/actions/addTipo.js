export const insertTipo = (serverUrl, tipo, familia) => {
  return {
    type: 'INSERT_TIPO',
    serverUrl,
    tipo,
    familia,
  }
}
