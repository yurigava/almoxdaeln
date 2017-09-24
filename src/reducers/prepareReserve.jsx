import update from 'immutability-helper';

const emptyBarCode = {
  value: "",
  equipTipo: null,
  isLoading: false,
  errorText: "",
};

const initialState =
{
  infoNumber: 0,
  reserves: [],
  barCodes: [emptyBarCode],
  reserveEquips: [],
  usuario: ""
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

    case 'PREPARE_RESERVE_SET_INFONUMBER':
      return (
        update(state, {infoNumber: {$set: action.infoNumber}})
      )

    case 'PREPARE_RESERVE_SET_BARCODE_VALUE':
      return (
        update(state, {
          barCodes: {
            [action.index]: {
              value: {$set: action.value}
            }
          }
        })
      )

    case 'PREPARE_RESERVE_SET_BARCODE_TIPO':
      return (
        update(state, {
          barCodes: {
            [action.index]: {
              equipTipo: {$set: action.equipTipo},
            }
          }
        })
      )

    case 'PREPARE_RESERVE_SET_BARCODE_LOADING':
      return (
        update(state, {
          barCodes: {
            [action.index]: {
              isLoading: {$set: action.isLoading}
            }
          }
        })
      )

    case 'PREPARE_RESERVE_SET_BARCODE_ERROR_TEXT':
      return (
        update(state, {
          barCodes: {
            [action.index]: {
              errorText: {$set: action.errorText}
            }
          }
        })
      )

    case 'PREPARE_RESERVE_REMOVE_BARCODE':
      return (
        update(state, {
          barCodes: {$splice: [[action.index, 1]]}
        })
      )

    case 'PREPARE_RESERVE_ADD_BARCODE':
      return (
        update(state, {
          barCodes: {$push: [emptyBarCode]}
        })
      )

    case 'PREPARE_RESERVE_CLEAR_BARCODES':
      return(
        update(state, {
          barCodes: {$set: [emptyBarCode]}
        })
      )

    case 'PREPARE_RESERVE_INCREMENT_RESERVE_EQUIP':
      return (
        update(state, {
          reserveEquips: {
            [action.index]: {
              current: {$set: state.reserveEquips[action.index].current + 1}
            }
          }
        })
      )

    case 'PREPARE_RESERVE_DECREMENT_RESERVE_EQUIP':
      return (
        update(state, {
          reserveEquips: {
            [action.index]: {
              current: {$set: state.reserveEquips[action.index].current - 1}
            }
          }
        })
      )

    case 'PREPARE_RESERVE_RESET_RESERVE_EQUIP':
      return (
        update(state, {
          reserveEquips: {
            [action.index]: {
              current: {$set: 0}
            }
          }
        })
      )

    case 'PREPARE_RESERVE_SET_RESERVE_EQUIPS':
      return (
        update(state, {
          reserveEquips: {$set: action.reserveEquips},
          usuario: {$set: action.usuario}
        })
      )

    default:
      return state
  }
}

export default prepareReserve
