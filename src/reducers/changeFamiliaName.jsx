import update from 'immutability-helper';

const initialState =
{
}

const changeFamiliaName = (state = initialState, action) => {
  switch (action.type) {
    case 'TEMPLATE':
      return (
        update(state, {changeFamiliaName: {$set: action.changeFamiliaName}})
      )

    default:
      return state
  }
}

export default changeFamiliaName
