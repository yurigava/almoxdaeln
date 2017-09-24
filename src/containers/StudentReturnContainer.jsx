import { connect } from 'react-redux'
import StudentReturn from '../components/StudentReturn.jsx'
import {
  setErrorDescription,
  insertStudentReturn,
} from '../actions/studentReturn.js'
import { setIsYesNoMessage } from '../actions/appUi.js'
import { serverUrl } from '../main.jsx'

const mapStateToProps = (state) => {
  return {
    errorCauseEquipNumbers: state.studentReturn.errorCauseEquipNumbers,
    errorCode: state.studentReturn.errorCode,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    insertStudentReturn: (usuario, patrimonios) => {
      dispatch(insertStudentReturn(serverUrl, usuario, patrimonios))
    },
    setIsYesNoMessage: (isYesNoMessage) => {
      dispatch(setIsYesNoMessage(isYesNoMessage))
    },
    clearErrorDescription: () => {
      dispatch(setErrorDescription([], ""))
    }
  }
}

const studentReturnContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentReturn)

export default studentReturnContainer
