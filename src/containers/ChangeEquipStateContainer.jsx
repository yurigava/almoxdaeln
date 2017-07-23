import { connect } from 'react-redux'
import ChangeEquipState from '../components/ChangeEquipState.jsx'
import {
  setDataSubmitted,
  setSubmissionMessage,
} from '../actions/appUi.js'
import {
  updateEquipState,
  getEstados
} from '../actions/changeEquipState.js'
import { serverUrl } from '../main.jsx'

const mapStateToProps = (state) => {
  return {
    submissionMessage: state.appUi.submissionMessage,
    usuario: state.login.userRole,
    isDataSubmitted: state.appUi.isDataSubmitted,
    isInputDisabled: state.appUi.isInputDisabled,
    estados: state.changeEquipState.estados,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setSubmissionMessage: (message) => {
      dispatch(setSubmissionMessage(message))
    },
    updateEquipState: (usuario, patrimonio, estado, observacao) => {
      dispatch(updateEquipState(serverUrl, usuario, patrimonio, estado, observacao))
    },
    getEstados: () => {
      dispatch(getEstados(serverUrl))
    },
    clearDataSent: () => {
      dispatch(setDataSubmitted(false))
    }
  }
}

const changeEquipStateContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangeEquipState)

export default changeEquipStateContainer
