import update from 'immutability-helper';

const initialState =
{
  errorCauseEquipNumbers: [],
  errorCode: "",
  isYesNoMessage: false,
}

const studentLend = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_STUDENT_LEND_ERROR_DESCRIPTION':
      return (
        update(state, {
          errorCauseEquipNumbers: {$set: action.equipNumbers},
          errorCode: {$set: action.errorCode},
        })
      )

    case 'SET_STUDENT_LEND_IS_YES_NO_MESSAGE':
      return (
        update(state, {
          isYesNoMessage: {$set: action.isYesNoMessage},
        })
      )

    default:
      return state
  }
}

export default studentLend
