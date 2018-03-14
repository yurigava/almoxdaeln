import { connect } from 'react-redux'
import VerifyReturnedReserve from '../components/VerifyReturnedReserve.jsx'
import { registerReturnedEquips } from '../actions/returnReserve.js'
import {
  setSubmissionMessage,
  setIsYesNoMessage,
} from '../actions/appUi.js'
import { serverUrl } from '../main.jsx'

const mapStateToProps = (state) => {
  return {
    usuario: state.login.usuario,
    dialogMessage: state.appUi.submissionMessage,
    isYesNoMessage: state.appUi.isYesNoMessage,
    isDataSubmitted: state.appUi.isDataSubmitted,
    lentEquips: state.returnReserve.lentEquips,
    reserveId: state.returnReserve.reserveId,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    registerReturnedEquips: (idReserve, equips, usuario) => {
      dispatch(registerReturnedEquips(serverUrl, idReserve, equips, usuario))
    },
    setIsYesNoMessage: (isYesNo) => {
      dispatch(setIsYesNoMessage(isYesNo))
    },
    setSubmissionMessage: (message) => {
      dispatch(setSubmissionMessage(message))
    },
  }
}

const VerifyReturnedReserveContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(VerifyReturnedReserve)

export default VerifyReturnedReserveContainer
