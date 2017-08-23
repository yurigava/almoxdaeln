import update from 'immutability-helper';

const initialState =
{
  selectedTipo: null,
  selectedFamilia: null,
  isMissingTipo: false,
  isMissingFamilia: false,
  errorCauseEquipNumbers: "",
  infoNumber: 0,
  errorCode: "",
  width: 0.2,
  quantidade: 0,
  referencia: 0,
}

const equipsGraphics = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_EQUIPGRAPH_ERROR_DESCRIPTION':
      return (
        update(state, {
          errorCauseEquipNumbers: {$set: action.equipNumber},
          errorCode: {$set: action.errorCode},
        })
      )

    case 'SET_MISSING_FIELDS_ERROR_EQUIPGRAPH':
      return (
        update(state, {
          isMissingFamilia: {$set: action.isMissingFamilia},
          isMissingTipo: {$set: action.isMissingTipo}
        })
      )

    case 'EQUIPGRAPH_SET_SELECTED_FAMILIA':
      return (
          update(state, {
            selectedFamilia: {$set: action.familia}
          })
      )

    case 'EQUIPGRAPH_SET_SELECTED_TIPO':
      return (
          update(state, {
            selectedTipo: {$set: action.tipo}
          })
      )
          
    case 'EQUIPGRAPH_SET_INFO_NUMBER':
      return (
          update(state, {
            infoNumber: {$set: action.infoNumber}
          })
      )

    case 'RAISE_LOWER_WIDTH_EQUIPGRAPH':
      return (
          update(state, {
            width: {$set: (action.widthActual + action.width) }
          })
      )

    case 'SET_QUANTIDADE_EQUIPGRAPH':
      return (
        update(state, {
          quantidade: {$set: action.quantidade},
          referencia: {$set: action.referencia}
        })
      )

    default:
      return state
  }
}

export default equipsGraphics
