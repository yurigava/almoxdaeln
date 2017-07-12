import update from 'immutability-helper';

const initialState =
{
  selectedTipo: null,
  selectedFamilia: null,
  isMissingTipo: false,
  isMissingFamilia: false,
  errorCauseEquipNumber: "",
  errorCode: "",
  infoNumber: 0,
  quantidade: ""
}

const addReserve = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_QUANTIDADE':
      return (
        update(state, {
          quantidade: {$set: action.quantidade},
          name: {$set: action.name}
        })
      )

    case 'SET_RESERVE_ERROR_DESCRIPTION':
      return (
        update(state, {
          errorCauseEquipNumber: {$set: action.equipNumber},
          errorCode: {$set: action.errorCode},
        })
      )

    case 'SET_MISSING_FIELDS_ERROR_RESERVE':
      return (
        update(state, {
          isMissingTipo: {$set: action.isMissingTipo},
          isMissingFamilia: {$set: action.isMissingFamilia}
        })
      )
    
    case 'SET_MISSING_DATETIME_ERROR_RESERVE':
      return (
        update(state, {
          isMissingDateTime: {$set: action.isMissingDateTime}
        })
      )

    case 'ADD_RESERVE_SET_SELECTED_FAMILIA':
      return (
          update(state, {
            selectedFamilia: {$set: action.familia}
          })
      )

    case 'ADD_RESERVE_SET_SELECTED_TIPO':
      return (
          update(state, {
            selectedTipo: {$set: action.tipo}
          })
      )

    case 'ADD_RESERVE_SET_INFO_NUMBER':
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
