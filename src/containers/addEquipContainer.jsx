import { connect } from 'react-redux'
import AddEquip from '../components/AddEquip.jsx'
import { insertEquips,
  getTipos,
  getFamilias,
  setSubmissionMessage,
  setErrorDescription,
  setMissingFieldsError } from '../actions/addEquip.js'
import { serverUrl } from '../main.jsx'

const mapStateToProps = (state) => {
  return {
    tipos: state.addEquip.tipos,
    familias: state.addEquip.familias,
    isInputDisabled: state.login.isInputDisabled,
    isDataSubmitted: state.addEquip.isDataSubmitted,
    submissionMessage: state.addEquip.submissionMessage,
    isMissingTipo: state.addEquip.isMissingTipo,
    isMissingFamilia: state.addEquip.isMissingFamilia,
    errorCauseEquipNumber: state.addEquip.errorCauseEquipNumber,
    errorCode: state.addEquip.errorCode
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getTipos: () => {
      dispatch(getTipos(serverUrl))
    },
    getFamilias: () => {
      dispatch(getFamilias(serverUrl))
    },
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
    }
  }
}

const addEquipContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddEquip)

export default addEquipContainer
