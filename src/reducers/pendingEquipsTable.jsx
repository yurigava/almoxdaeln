import update from 'immutability-helper';

const initialState =
{
  pendingEquips: []
}

const pendingEquipsTable = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PENDING_EQUIPS':
      return (
        update(state, {pendingEquips: {$set: action.pendingEquips}})
      )

    default:
      return state
  }
}

export default pendingEquipsTable
