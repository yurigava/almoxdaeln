import update from 'immutability-helper';

const initialState =
{
  reserves: []
}

const provideReserve = (state = initialState, action) => {
  switch (action.type) {
    case 'PROVIDE_RESERVE_SET_RESERVES':
      return (
        update(state, {reserves: {$set: action.reserves}})
      )

    default:
      return state
  }
}

export default provideReserve
