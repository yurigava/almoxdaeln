import update from 'immutability-helper';

const emptyEquipInfos = {
  tipo: null,
  familia: null,
  quantidade: null,
  availableEquips: null
};

const initialState =
{
  infoNumber: 0,
  equipInfos: [emptyEquipInfos]
}

const addReserve = (state = initialState, action) => {
  switch (action.type) {
    case 'RESERVE_SET_QUANTIDADE':
      return (
        update(state, {
          equipInfos: {
            [action.index]: {
              quantidade: {$set: action.quantidade}
            }
          }
        })
      )

    case 'RESERVE_SET_AVAILABLEQUIPS':
      return (
        update(state, {
          equipInfos: {
            [action.index]: {
              availableEquips: {$set: action.availableEquips}
            }
          }
        })
      )

    case 'RESERVE_CLEAR_EQUIPS':
      return (
        update(state, {
          equipInfos: {$set: [emptyEquipInfos]}
        })
      )

    case 'RESERVE_REMOVE_EQUIP':
      return (
        update(state, {
          equipInfos: {$splice: [[action.index, 1]]}
          //equipInfos: {$splice: [action.index, 1]}
        })
      )

    case 'RESERVE_ADD_EQUIP':
        return (
          update(state, {
            equipInfos: {$push: [emptyEquipInfos]}
          })
        )

    case 'RESERVE_SET_SELECTED_FAMILIA':
      return (
        update(state, {
          equipInfos: {
            [action.index]: {
              familia: {$set: action.familia}
            }
          }
        })
      )

    case 'RESERVE_SET_SELECTED_TIPO':
      return (
        update(state, {
          equipInfos: {
            [action.index]: {
              tipo: {$set: action.tipo}
            }
          }
        })
      )

    case 'RESERVE_SET_INFO_NUMBER':
      return (
        update(state, {
          infoNumber: {$set: action.infoNumber}
        })
      )

    default:
      return state
  }
}

export default addReserve
