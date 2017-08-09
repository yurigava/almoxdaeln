import { connect } from 'react-redux'
import StudentLend from '../components/StudentLend.jsx'
import {
  insertStudentLend,
  setIsYesNoMessage,
  setErrorDescription
} from '../actions/studentLend.js'
import { serverUrl } from '../main.jsx'

const mapStateToProps = (state) => {
  return {
    errorCauseEquipNumbers: state.studentLend.errorCauseEquipNumbers,
    errorCode: state.studentLend.errorCode,
    isYesNoMessage: state.studentLend.isYesNoMessage,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    insertStudentLendShouldAdd: (usuario, patrimonios) => {
      dispatch(insertStudentLend(serverUrl, usuario, patrimonios, true))
    },
    insertStudentLendShouldNotAdd: (usuario, patrimonios) => {
      dispatch(insertStudentLend(serverUrl, usuario, patrimonios, false))
    },
    setIsYesNoMessage: (isYesNoMessage) => {
      dispatch(setIsYesNoMessage(isYesNoMessage))
    },
    clearErrorDescription: () => {
      dispatch(setErrorDescription([], ""))
    }
  }
}

const StudentLendContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentLend)

export default StudentLendContainer
