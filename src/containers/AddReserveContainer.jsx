import { connect } from 'react-redux'
import AddReserve from '../components/AddReserve.jsx'
import {
  setSelectedTipo,
  setSelectedFamilia,
  insertReserve,
  quantidadeReserve,
  setMissingFieldsError,
  setinfoNumber,
  setError,
  clearEquips,
  setQuantidade,
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
    equipInfos: state.addReserve.equipInfos,
    infoNumber: state.addReserve.infoNumber,
    usuario: state.login.usuario,
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
    clearEquips: () => {
      dispatch(clearEquips())
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
