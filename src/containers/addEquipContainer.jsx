import { connect } from 'react-redux'
import AddEquip from '../components/AddEquip.jsx'
import {
  setSelectedTipo,
  setSelectedFamilia,
  insertEquips,
  setErrorDescription,
  setMissingFieldsError,
  setInfoText,
} from '../actions/addEquip.js'
import {
  setSubmissionMessage,
} from '../actions/appUi.js'
import { serverUrl } from '../main.jsx'

const mapStateToProps = (state) => {
  return {
    isInputDisabled: state.appUi.isInputDisabled,
    submissionMessage: state.appUi.submissionMessage,
    isDataSubmitted: state.appUi.isDataSubmitted,
    isMissingTipo: state.addEquip.isMissingTipo,
    isMissingFamilia: state.addEquip.isMissingFamilia,
    tipo: state.addEquip.selectedTipo,
    familia: state.addEquip.selectedFamilia,
    errorCauseEquipNumber: state.addEquip.errorCauseEquipNumber,
    errorCode: state.addEquip.errorCode,
    infoText: state.addEquip.infoText,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    insertEquips: (patrimonios, id_tipo) => {
      dispatch(insertEquips(serverUrl, patrimonios, id_tipo))
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

const addEquipContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddEquip)

export default addEquipContainer
