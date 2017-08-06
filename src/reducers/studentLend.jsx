import update from 'immutability-helper';

const initialState =
{
  errorCauseEquipNumbers: [],
  errorCode: "",
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

    default:
      return state
  }
}

export default studentLend
