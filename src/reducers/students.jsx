import update from 'immutability-helper';

const initialState =
{
  valueStudents: false
}

const students = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_STUDENTS':
      return (
        update(state, {valueStudents: {$set: !state.valueStudents}})
      )

    default:
      return state
  }
}

export default students
