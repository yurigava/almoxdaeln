import update from 'immutability-helper';

const initialState =
{
  selectedTipo: null,
  selectedFamilia: null,
  isMissingTipo: false,
  isMissingFamilia: false,
  infoNumber: 0,
  quantidade: [],
  referencia: 0,
}

const equipsGraphics = (state = initialState, action) => {
  switch (action.type) {
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
