export const getUsers = (serverUrl) => {
  return {
    type: 'MANAGER_USER_GET_USER',
    serverUrl,
  }
}