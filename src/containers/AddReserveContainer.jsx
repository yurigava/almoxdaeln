import { connect } from 'react-redux'
import AddReserve from '../components/AddReserve.jsx'
import {
  setSelectedTipo,
  setSelectedFamilia,
  insertReserve,
  setErrorDescription,
  setMissingFieldsError,
  setInfoText,
} from '../actions/AddReserve.js'
import {
  setSubmissionMessage,
} from '../actions/appUi.js'
import { serverUrl } from '../main.jsx'

const mapStateToProps = (state) => {
  return {
    isInputDisabled: state.appUi.isInputDisabled,
    submissionMessage: state.appUi.submissionMessage,
    isDataSubmitted: state.appUi.isDataSubmitted,
    isMissingTipo: state.AddReserve.isMissingTipo,
    isMissingFamilia: state.AddReserve.isMissingFamilia,
    tipo: state.AddReserve.selectedTipo,
    familia: state.AddReserve.selectedFamilia,
    errorCauseEquipNumber: state.AddReserve.errorCauseEquipNumber,
    errorCode: state.AddReserve.errorCode,
    infoText: state.AddReserve.infoText,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    insertReserve: (patrimonios, id_tipo, date) => {
      dispatch(insertReserve(serverUrl, patrimonios, id_tipo, date))
    },
    clearSubmissionMessage: () => {
      dispatch(setSubmissionMessage(""))
    },
    clearEquipNumberError: () => {
      dispatch(setErrorDescription("", ""))
    },
    clearMissingFieldsError: () => {
      dispatch(setMissingFieldsError(false, false))
    },
    setSelectedTipo: (name, tipo) => {
      dispatch(setSelectedTipo(tipo))
    },
    setSelectedFamilia: (name, familia) => {
      dispatch(setSelectedFamilia(familia))
    },
    setInfoText: (infoText) => {
      dispatch(setInfoText(infoText))
    }
  }
}

const AddReserveContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddReserve)

export default AddReserveContainer
