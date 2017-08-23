import update from 'immutability-helper';

const initialState =
{
}

const equipsGraphics = (state = initialState, action) => {
  switch (action.type) {
    case 'TEMPLATE':
      return (
        update(state, {equipsGraphics: {$set: action.equipsGraphics}})
      )

    default:
      return state
  }
}

export default equipsGraphics
