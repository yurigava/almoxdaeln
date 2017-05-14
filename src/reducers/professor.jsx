import update from 'immutability-helper';

const initialState =
{
  valueProfessor: false
}

const professor = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_PROFESSOR':
      return (
        update(state, {valueProfessor: {$set: !state.valueProfessor}})
      )

    default:
      return state
  }
}

export default professor
