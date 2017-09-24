import { connect } from 'react-redux'
import StudentLend from '../components/StudentLend.jsx'
import {
  insertStudentLend,
  setErrorDescription
} from '../actions/studentLend.js'
import { setIsYesNoMessage } from '../actions/appUi.js'
import { serverUrl } from '../main.jsx'

const mapStateToProps = (state) => {
  return {
    errorCauseEquipNumbers: state.studentLend.errorCauseEquipNumbers,
    errorCode: state.studentLend.errorCode,
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
