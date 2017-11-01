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
