import { connect } from 'react-redux'
import AddReserve from '../components/AddReserve.jsx'
import {
  setSelectedTipo,
  setSelectedFamilia,
  insertReserve,
  quantidadeReserve,
  setMissingFieldsError,
  setInfoNumber,
  setError,
  clearEquips,
  setQuantidade,
  addEquip,
  removeEquip,
  setAvailable,
} from '../actions/addReserve.js'
import {
  setSubmissionMessage,
  setIsYesNoMessage,
} from '../actions/appUi.js'
import { serverUrl } from '../main.jsx'

const mapStateToProps = (state) => {
  return {
    isInputDisabled: state.appUi.isInputDisabled,
    submissionMessage: state.appUi.submissionMessage,
    //isMissingFamilia: state.addReserve.isMissingFamilia,
    //isMissingTipo: state.addReserve.isMissingTipo,
    isDataSubmitted: state.appUi.isDataSubmitted,
    equipInfos: state.addReserve.equipInfos,
    infoNumber: state.addReserve.infoNumber,
    usuario: state.login.usuario,
    isYesNoMessage: state.appUi.isYesNoMessage,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    insertReserve: (usuario, date, turno, materia, equips) => {
      dispatch(insertReserve(serverUrl, usuario, date, turno, materia, equips))
    },
    quantidadeReserve: (familia, tipo, name, date, turno) => {
      dispatch(quantidadeReserve(serverUrl, familia, tipo, name, date, turno))
    },
    clearSubmissionMessage: () => {
      dispatch(setSubmissionMessage(""))
    },
    setSelectedTipo: (index, tipo) => {
      dispatch(setSelectedTipo(index, tipo))
    },
    setSelectedFamilia: (index, familia) => {
      dispatch(setSelectedFamilia(index, familia))
    },
    setQuantidade: (index, quantidade) => {
      dispatch(setQuantidade(index, quantidade))
    },
    setAvailable: (index, availableEquips) => {
      dispatch(setAvailable(index, availableEquips))
    },
    clearEquips: () => {
      dispatch(clearEquips())
    },
    addEquip: () => {
      dispatch(addEquip())
    },
    removeEquip: (index) => {
      dispatch(removeEquip(index))
    },
    setInfoNumber: (infoNumber) => {
      dispatch(setInfoNumber(infoNumber))
    },
    setError: (error) => {
      dispatch(setSubmissionMessage(error))
    },
    setIsYesNoMessage: (isYesNoMessage) => {
      dispatch(setIsYesNoMessage(isYesNoMessage))
    }
  }
}

const AddReserveContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddReserve)

export default AddReserveContainer
