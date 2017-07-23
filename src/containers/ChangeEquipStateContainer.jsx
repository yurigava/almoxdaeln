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
    updateEquipState: (patrimonio, estado) => {
      dispatch(updateEquipState(serverUrl, patrimonio, estado))
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
