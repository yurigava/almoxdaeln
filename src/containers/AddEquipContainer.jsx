import { connect } from 'react-redux'
import AddEquip from '../components/AddEquip.jsx'
import {
  setSelectedTipo,
  setSelectedFamilia,
  insertEquips,
  setErrorDescription,
  setMissingFieldsError,
  setInfoNumber,
} from '../actions/addEquip.js'
import { setSubmissionMessage } from '../actions/appUi.js'
import { serverUrl } from '../main.jsx'

const mapStateToProps = (state) => {
  return {
    isInputDisabled: state.appUi.isInputDisabled,
    submissionMessage: state.appUi.submissionMessage,
    isYesNoMessage: state.appUi.isYesNoMessage,
    isDataSubmitted: state.appUi.isDataSubmitted,
    usuario: state.login.userRole,
    isMissingTipo: state.addEquip.isMissingTipo,
    isMissingFamilia: state.addEquip.isMissingFamilia,
    tipo: state.addEquip.selectedTipo,
    familia: state.addEquip.selectedFamilia,
    errorCauseEquipNumbers: state.addEquip.errorCauseEquipNumbers,
    errorCode: state.addEquip.errorCode,
    infoNumber: state.addEquip.infoNumber,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    insertEquips: (usuario, patrimonios, id_tipo, changeExistent) => {
      dispatch(insertEquips(serverUrl, usuario, patrimonios, id_tipo, changeExistent))
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
    setInfoNumber: (infoNumber) => {
      dispatch(setInfoNumber(infoNumber))
    }
  }
}

const AddEquipContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddEquip)

export default AddEquipContainer
