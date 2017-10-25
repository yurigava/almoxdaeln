import update from 'immutability-helper';

const initialState =
{
  lentEquips: [],
  reserves: [],
  reserveId: null,
}

const returnReserve = (state = initialState, action) => {
  switch (action.type) {
    case 'RETURN_RESERVE_SET_RESERVES':
      return (
        update(state, {reserves: {$set: action.reserves}})
      )

    case 'RETURN_RESERVE_SET_RESERVE_DETAILS':
      return (
        update(state, {lentEquips: {$set: action.lentEquips}})
      )

    case 'RETURN_RESERVE_SET_RESERVE_ID':
      return (
        update(state, {reserveId: {$set: action.reserveId}})
      )

    default:
      return state
  }
}

export default returnReserve
