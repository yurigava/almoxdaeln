import update from 'immutability-helper';

const initialState =
{
}

const template = (state = initialState, action) => {
  switch (action.type) {
    case 'TEMPLATE':
      return (
        update(state, {template: {$set: action.template}})
      )

    default:
      return state
  }
}

export default template
