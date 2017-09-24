import update from 'immutability-helper';

const emptyBarCode = {
  value: "",
  equipTipo: null,
  isLoading: false,
  errorCode: "",
  oldIndex: -1,
  isPaper: false
};

const initialState =
{
  infoNumber: 0,
  reserves: [],
  barCodes: [emptyBarCode],
  reserveEquips: [],
  requisicao: null
}

let auxOldIndex = -1;

const prepareReserve = (state = initialState, action) => {
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
            [action.index]: {
              value: {$set: action.value}
            }
          }
        })
      )

    case 'PREPARE_RESERVE_SET_BARCODE_TIPO':
      auxOldIndex = state.barCodes.findIndex(barCode => barCode.oldIndex == action.index);
      if(auxOldIndex < 0) {
        return (
          update(state, {
            barCodes: {
              [action.index]: {
                equipTipo: {$set: action.equipTipo},
                isLoading: {$set: false}
              }
            }
          })
        )
      }
      else {
        return (
          update(state, {
            barCodes: {
              [auxOldIndex]: {
                equipTipo: {$set: action.equipTipo},
                isLoading: {$set: false}
              }
            }
          })
        )
      }

    case 'PREPARE_RESERVE_SET_BARCODE_LOADING':
      auxOldIndex = state.barCodes.findIndex(barCode => barCode.oldIndex == action.index);
      if(auxOldIndex < 0) {
        return (
          update(state, {
            barCodes: {
              [action.index]: {
                isLoading: {$set: action.isLoading}
              }
            }
          })
        )
      }
      else {
        return (
          update(state, {
            barCodes: {
              [auxOldIndex]: {
                isLoading: {$set: action.isLoading}
              }
            }
          })
        )
      }

    case 'PREPARE_RESERVE_SET_BARCODE_ERROR_CODE':
      return (
        update(state, {
          barCodes: {
            [action.index]: {
              errorCode: {$set: action.errorCode}
            }
          }
        })
      )

    case 'PREPARE_RESERVE_RESET_OLD_INDEX':
      return(
        update(state, {
          barCodes: {
            [action.index]: {
              oldIndex: {$set: -1}
            }
          }
        })
      )

    case 'PREPARE_RESERVE_SET_IS_PAPER':
      return(
        update(state, {
          barCodes: {
            [action.index]: {
              isPaper: {$set: action.isPaper}
            }
          }
        })
      )

    case 'PREPARE_RESERVE_REMOVE_BARCODE':
      return (
        update(state, {
          barCodes: {
            $apply: barCodes => {
              barCodes.forEach((barCode, index) => {
                if(index > action.index)
                  barCode.oldIndex = index
              })
              return barCodes.filter((barCode, index) => index != action.index)
            }
          }
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
