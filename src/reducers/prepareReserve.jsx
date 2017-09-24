import update from 'immutability-helper';

const emptyBarCode = {
  value: "",
  equipTipo: null,
  isLoading: false,
  errorCode: "",
  id: 0
};

const initialState =
{
  infoNumber: 0,
  reserves: [],
  barCodes: [emptyBarCode],
  reserveEquips: [],
  requisicao: null
}

let barCodeIndex;

const prepareReserve = (state = initialState, action) => {
  if(action.id !== undefined)
    barCodeIndex = state.barCodes.findIndex(barCode => barCode.id == action.id)

  const newBarCode = update(emptyBarCode, {
    id: {$set: state.barCodes[state.barCodes.length-1].id + 1}
  })

  switch (action.type) {
    case 'PREPARE_RESERVE_SET_RESERVES':
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
            [barCodeIndex]: {
              value: {$set: action.value}
            }
          }
        })
      )

    case 'PREPARE_RESERVE_SET_BARCODE_TIPO':
      return (
        update(state, {
          barCodes: {
            [barCodeIndex]: {
              equipTipo: {$set: action.equipTipo},
            }
          }
        })
      )

    case 'PREPARE_RESERVE_SET_BARCODE_LOADING':
      return (
        update(state, {
          barCodes: {
            [barCodeIndex]: {
              isLoading: {$set: action.isLoading}
            }
          }
        })
      )

    case 'PREPARE_RESERVE_SET_BARCODE_ERROR_CODE':
      return (
        update(state, {
          barCodes: {
            [barCodeIndex]: {
              errorCode: {$set: action.errorCode}
            }
          }
        })
      )

    case 'PREPARE_RESERVE_REMOVE_BARCODE':
      return (
        update(state, {
          barCodes: {$splice: [[barCodeIndex, 1]]}
        })
      )

    case 'PREPARE_RESERVE_ADD_BARCODE':
      return (
        update(state, {
          barCodes: {$push: [newBarCode]}
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
              current: {$apply: value => value + 1}
            }
          }
        })
      )

    case 'PREPARE_RESERVE_DECREMENT_RESERVE_EQUIP':
      return (
        update(state, {
          reserveEquips: {
            [action.index]: {
              current: {$apply: value => value - 1}
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
          barCodes: {$set: [emptyBarCode]},
          requisicao: {$set: action.requisicao}
        })
      )

    default:
      return state
  }
}

export default prepareReserve
