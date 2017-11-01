import update from 'immutability-helper';

const emptyAllUsers = {
  id: null,
  role: null,
};

const initialState =
{
  allUsers: [emptyAllUsers],
}

const managerUser = (state = initialState, action) => {
  switch (action.type) {
    case 'MANAGER_USER_SET_USER':
      return (
        update(state, {
          allUsers: {
            [action.index]: {
              id: {$set: action.user}
            }
          }
        })
      )

    case 'MANAGER_USER_SET_ROLE':
      return (
        update(state, {
          allUsers: {
            [action.index]: {
              role: {$set: action.role}
            }
          }
        })
      )

    case 'MANAGER_USER_REMOVE':
      return (
        update(state, {
          allUsers: {$splice: [[action.index, 1]]}
        })
      )

    case 'MANAGER_USER_ADD':
      return (
        update(state, {
          allUsers: {$push: [emptyAllUsers]}
        })
      )

    case 'MANAGER_USER_SET_ALL_USER':
      return (
        update(state, {
          allUsers: {$set: action.users},
        })
      )

    case 'MANAGER_USER_CLEAR':
      return (
        update(state, {
          allUsers: {$set: [emptyAllUsers]}
        })
      )

    default:
      return state
  }
}

export default managerUser
