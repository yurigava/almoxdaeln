import update from 'immutability-helper';

const initialState =
{
  selectedTipo: null,
  selectedFamilia: null,
  isDataSubmitted: false,
  submissionMessage: "",
  isMissingTipo: false,
  isMissingFamilia: false,
  errorCauseEquipNumber: "",
  errorCode: "",
  infoText: 0
}

const addEquip = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_DATA_SUBMITTED':
      return (
        update(state, {isDataSubmitted: {$set: action.submitted}})
      )

    case 'SET_SUBMISSION_MESSAGE':
      return (
        update(state, {submissionMessage: {$set: action.message}})
      )

    case 'SET_INSERT_ERROR_DESCRIPTION':
      return (
        update(state, {
          errorCauseEquipNumber: {$set: action.equipNumber},
          errorCode: {$set: action.errorCode},
        })
      )

    case 'SET_MISSING_FIELDS_ERROR':
      return (
        update(state, {
          isMissingTipo: {$set: action.isMissingTipo},
          isMissingFamilia: {$set: action.isMissingFamilia}
        })
      )

    case 'ADD_EQUIP_SET_SELECTED_FAMILIA':
      return (
          update(state, {
            selectedFamilia: {$set: action.familia}
          })
      )

    case 'ADD_EQUIP_SET_SELECTED_TIPO':
      return (
          update(state, {
            selectedTipo: {$set: action.tipo}
          })
      )

    case 'ADD_EQUIP_SET_INFO_TEXT':
      return (
          update(state, {
            infoText: {$set: action.infoText}
          })
      )

    default:
      return state
  }
}

export default addEquip
