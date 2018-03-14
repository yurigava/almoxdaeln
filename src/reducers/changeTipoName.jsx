import update from 'immutability-helper';

const initialState =
{
  tipo: null,
  familia: null,
}

const changeTipoName = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CHANGE_TIPO_NAME_FAMILIA':
      return (
        update(state, {familia: {$set: action.familia}})
      )

    case 'SET_CHANGE_TIPO_NAME_TIPO':
      return (
        update(state, {tipo: {$set: action.tipo}})
      )

    default:
      return state
  }
}

export default changeTipoName
