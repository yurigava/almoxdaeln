import update from 'immutability-helper';

const initialState =
{
  estados: [],
}

const changeEquipState = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ESTADOS':
      return (
        update(state, {estados: {$set: action.estados}})
      )

    default:
      return state
  }
}

export default changeEquipState
