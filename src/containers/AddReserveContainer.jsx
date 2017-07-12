import { connect } from 'react-redux'
import AddReserve from '../components/AddReserve.jsx'
import {
  setSelectedTipo,
  setSelectedFamilia,
  insertEquips,
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
    isDataSubmitted: state.AddReserve.isDataSubmitted,
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
    insertEquips: (patrimonios, id_tipo, date) => {
      dispatch(insertEquips(serverUrl, patrimonios, id_tipo, date))
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
    setSelectedTipo: (tipo) => {
      dispatch(setSelectedTipo(tipo))
    },
    setSelectedFamilia: (familia) => {
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
