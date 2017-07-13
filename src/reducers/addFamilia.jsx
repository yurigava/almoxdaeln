import update from 'immutability-helper';

const initialState =
{
  createdFamiliaNumber: null,
}

const addFamilia = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CREATED_FAMILIA_NUMBER':
      return (
        update(state, {createdFamiliaNumber: {$set: action.familiaNumber}})
      )

    default:
      return state
  }
}

export default addFamilia
