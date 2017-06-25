import update from 'immutability-helper';

const initialState =
{
  tipos: [],
  familias: []
}

const addEquip = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_TIPOS':
      return (
        update(state, {tipos: {$set: action.tipos}})
      )

    case 'SET_FAMILIAS':
      return (
        update(state, {familias: {$set: action.familias}})
      )

    default:
      return state
  }
}

export default addEquip
