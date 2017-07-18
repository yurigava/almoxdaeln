import { connect } from 'react-redux'
import StudentLend from '../components/StudentLend.jsx'
import {
  insertStudentLend
} from '../actions/studentLend.js'
import {
  setSubmissionMessage,
  setDataSubmitted
} from '../actions/appUi.js'
import { serverUrl } from '../main.jsx'

const mapStateToProps = (state) => {
  return {
    submissionMessage: state.appUi.submissionMessage,
    isDataSubmitted: state.appUi.isDataSubmitted,
    errorCauseEquipNumbers: state.studentLend.errorCauseEquipNumbers,
    errorCode: state.studentLend.errorCode,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    insertStudentLend: (usuario, patrimonios) => {
      dispatch(insertStudentLend(serverUrl, usuario, patrimonios))
    },
    setSubmissionMessage: (message) => {
      dispatch(setSubmissionMessage(message))
    },
    clearDataSent: () => {
      dispatch(setDataSubmitted(false))
    }
  }
}

const StudentLendContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentLend)

export default StudentLendContainer
