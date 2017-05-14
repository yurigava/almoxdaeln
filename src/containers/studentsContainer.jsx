import { connect } from 'react-redux'
import Students from '../components/Students.jsx'
import { toggleValueStudents } from '../actions/index.js'

const mapStateToProps = (state) => {
  return {
    valueStudents: state.students.valueStudents
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onChangeValueStudents: () => {
      dispatch(toggleValueStudents())
    }
  }
}

const studentsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Students)

export default studentsContainer
