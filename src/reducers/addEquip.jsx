import update from 'immutability-helper';

const initialState =
{
  tipos: [],
  familias: [],
  isDataSubmitted: false,
  submissionMessage: "",
  isMissingTipo: false,
  isMissingFamilia: false,
  errorCauseEquipNumber: "",
  errorCode: ""
}

const addEquip = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_TIPOS':
      return (
        update(state, {tipos: {$set: action.tipos}})
      )

    case 'SET_FAMILIAS':
      return (
        update(state, {familias: {$set: action.familias}})
      )

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

    default:
      return state
  }
}

export default addEquip
