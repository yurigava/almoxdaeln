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
  setDataSubmitted,
} from '../actions/appUi.js'
import {
  getFamilias,
  getTipos,
} from '../actions/equipTypeSelect.js'
import { serverUrl } from '../main.jsx'

const mapStateToProps = (state) => {
  return {
    isInputDisabled: state.appUi.isInputDisabled,
    submissionMessage: state.appUi.submissionMessage,
    familias: state.equipTypeSelect.familias,
    tipos: state.equipTypeSelect.tipos,
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
    quantidadeReserve: (familia, tipo, name) => {
      dispatch(quantidadeReserve(serverUrl, familia, tipo, name))
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
    setDataSubmitted: (submitted) => {
      dispatch(setDataSubmitted(submitted))
    },
    setIsYesNoMessage: (isYesNoMessage) => {
      dispatch(setIsYesNoMessage(isYesNoMessage))
    },
    getFamilias: () => {
      dispatch(getFamilias(serverUrl))
    },
    getTipos: () => {
      dispatch(getTipos(serverUrl))
    }
  }
}

const AddReserveContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddReserve)

export default AddReserveContainer
