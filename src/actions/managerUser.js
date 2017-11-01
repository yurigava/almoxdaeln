export const getUser = (serverUrl, usuario) => {
  return {
    type: 'MANAGER_USER_GET_USERS',
    serverUrl, 
    usuario
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

export const clearUserRole = () => {
  return {
    type: 'MANAGER_USER_CLEAR'
  }
}

export const setAllUser = (users) => {
  return {
    type: 'MANAGER_USER_SET_ALL_USER',
    users
  }
}

export const insertUserRole = (serverUrl, userRoles, usuario) => {
  return {
    type: 'MANAGER_USER_INSERT',
    serverUrl,
    userRoles,
    usuario
  }
}