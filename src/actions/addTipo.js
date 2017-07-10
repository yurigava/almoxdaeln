export const insertTipo = (tipo, familia, serverUrl) => {
  return {
    type: 'INSERT_TIPO',
    tipo,
    familia,
    serverUrl
  }
}
