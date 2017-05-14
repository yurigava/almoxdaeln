import { connect } from 'react-redux'
import Professor from '../components/Professor.jsx'
import { toggleValueProfessor } from '../actions/index.js'

const mapStateToProps = (state) => {
  return {
    valueProfessor: state.professor.valueProfessor
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onChangeValueProfessor: () => {
      dispatch(toggleValueProfessor())
    }
  }
}

const professorContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Professor)

export default professorContainer
