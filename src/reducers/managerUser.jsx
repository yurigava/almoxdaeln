import update from 'immutability-helper';

const initialState =
{
}

const managerUser = (state = initialState, action) => {
  switch (action.type) {
    case 'TEMPLATE':
      return (
        update(state, {managerUser: {$set: action.managerUser}})
      )

    default:
      return state
  }
}

export default managerUser
