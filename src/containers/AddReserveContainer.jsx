import { connect } from 'react-redux'
import AddReserve from '../components/AddReserve.jsx'
import {
  setSelectedTipo,
  setSelectedFamilia,
  insertReserve,
  quantidadeReserve,
  setErrorDescription,
  setMissingFieldsError,
  setinfoNumber,
} from '../actions/addReserve.js'
import {
  setSubmissionMessage,
} from '../actions/appUi.js'
import { serverUrl } from '../main.jsx'

const mapStateToProps = (state) => {
  return {
    isInputDisabled: state.appUi.isInputDisabled,
    submissionMessage: state.appUi.submissionMessage,
    isDataSubmitted: state.appUi.isDataSubmitted,
    isMissingTipo: state.addReserve.isMissingTipo,
    isMissingFamilia: state.addReserve.isMissingFamilia,
    tipo: state.addReserve.selectedTipo,
    familia: state.addReserve.selectedFamilia,
    errorCauseEquipNumber: state.addReserve.errorCauseEquipNumber,
    errorCode: state.addReserve.errorCode,
    infoNumber: state.addReserve.infoNumber,
    quantidade: state.addReserve.quantidade,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    insertReserve: (date, materia, equips) => {
      dispatch(insertReserve(serverUrl, date, materia, equips))
    },
    quantidadeReserve: () => {
      dispatch(quantidadeReserve(serverUrl))
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
    setinfoNumber: (infoNumber) => {
      dispatch(setinfoNumber(infoNumber))
    }
  }
}

const AddReserveContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddReserve)

export default AddReserveContainer
