export const getUsers = (serverUrl) => {
  return {
    type: 'MANAGER_USER_GET_USER',
    serverUrl,
  }
}

export const removeUserRole = (index) => {
  return {
    type: 'MANAGER_USER_REMOVE',
    index
  }
}

export const addUserRole = () => {
  return {
    type: 'MANAGER_USER_ADD'
  }
}

export const setUser = (index, user) => {
  return {
    type: 'MANAGER_USER_SET_USER',
    index,
    user
  }
}

export const setRole = (index, role) => {
  return {
    type: 'MANAGER_USER_SET_ROLE',
    index,
    role
  }
}

export const insertUsers = (serverUrl, usuario, role) => {
  return {
    type: 'MANAGER_USER_INSERT',
    serverUrl,
    usuario,
    role
  }
}