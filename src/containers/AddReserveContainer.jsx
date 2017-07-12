import { connect } from 'react-redux'
import AddReserve from '../components/AddReserve.jsx'
import {
  setSelectedTipo,
  setSelectedFamilia,
  insertReserve,
  quantidadeReserve,
  setErrorDescription,
  setMissingFieldsError,
  setMissingDateTimeError,
  setinfoNumber,
  setError,
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
    isMissingDateTime: state.addReserve.isMissingTipo,
    isMissingTipo: state.addReserve.isMissingTipo,
    isMissingFamilia: state.addReserve.isMissingFamilia,
    tipo: state.addReserve.selectedTipo,
    familia: state.addReserve.selectedFamilia,
    errorCauseEquipNumber: state.addReserve.errorCauseEquipNumber,
    errorCode: state.addReserve.errorCode,
    infoNumber: state.addReserve.infoNumber,
    quantidade: state.addReserve.quantidade,
    name: state.addReserve.name,
    usuario: state.login.usuario
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    insertReserve: (usuario, date, turno, materia, equips) => {
      dispatch(insertReserve(serverUrl, usuario, date, turno, materia, equips))
    },
    quantidadeReserve: (familia, tipo, name) => {
      dispatch(quantidadeReserve(serverUrl, familia, tipo, name))
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
    clearMissingDateTimeError: () => {
      dispatch(setMissingDateTimeError(false))
    },
    setSelectedTipo: (name, tipo) => {
      dispatch(setSelectedTipo(tipo))
    },
    setSelectedFamilia: (name, familia) => {
      dispatch(setSelectedFamilia(familia))
    },
    setinfoNumber: (infoNumber) => {
      dispatch(setinfoNumber(infoNumber))
    },
    setError: (error) => {
      dispatch(setSubmissionMessage(error))
    }
  }
}

const AddReserveContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddReserve)

export default AddReserveContainer
