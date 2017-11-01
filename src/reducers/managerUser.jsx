import update from 'immutability-helper';

const emptyAllUser = {
  id: null,
  role: null,
};

const initialState =
{
  allUser: [emptyAllUser],
}

const managerUser = (state = initialState, action) => {
  switch (action.type) {
    case 'MANAGER_USER_SET_USER':
      return (
        update(state, {
          allUser: {
            [action.index]: {
              user: {$set: action.user}
            }
          }
        })
      )

    case 'MANAGER_USER_SET_ROLE':
      return (
        update(state, {
          allUser: {
            [action.index]: {
              role: {$set: action.role}
            }
          }
        })
      )

    case 'MANAGER_USER_REMOVE':
      return (
        update(state, {
          allUser: {$splice: [[action.index, 1]]}
        })
      )

    case 'MANAGER_USER_ADD':
      return (
        update(state, {
          allUser: {$push: [emptyAllUser]}
        })
      )

    case 'MANAGER_USER_SET_ALL_USER':
      return (
        update(state, {
          allUser: {$set: action.users},
        })
      )

    default:
      return state
  }
}

export default managerUser
