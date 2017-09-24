import update from 'immutability-helper';

const initialState =
{
  infoNumber: 0,
  reserves: [],
}

const prepareReserve = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_RESERVES':
      let newInfo = state.infoNumber;
      if(action.reserves.length > 0)
        newInfo = 1;
      return (
        update(state, {
          reserves: {$set: action.reserves},
          infoNumber: {$set: newInfo}
        })
      )

    case 'SET_INFONUMBER':
      return (
        update(state, {infoNumber: {$set: action.infoNumber}})
      )

    default:
      return state
  }
}

export default prepareReserve
