import { connect } from 'react-redux'
import ReadEquipsReserve from '../components/ReadEquipsReserve.jsx'
import {
  setInfoNumber,
  setBarcodeValue,
  removeBarcode,
  addBarcode,
  incrementMissingReserve,
  decrementMissingReserve,
  setBarcodeErrorCode,
  getEquipTipo,
  clearBarcodes,
  resetMissingReserve,
  setBarcodeTipo,
  insertStudentLend,
  registerReservedEquips,
  getCarrinhos
} from '../actions/prepareReserve.js'
import { getTipos, getFamilias } from '../actions/equipTypeSelect.js'
import {
  setIsYesNoMessage,
  setSubmissionMessage
} from '../actions/appUi.js'
import { serverUrl } from '../main.jsx'

const mapStateToProps = (state) => {
  return {
    reserveEquips: state.prepareReserve.reserveEquips,
    barCodes: state.prepareReserve.barCodes,
    tipos: state.equipTypeSelect.tipos,
    familias: state.equipTypeSelect.familias,
    isYesNoMessage: state.appUi.isYesNoMessage,
    dialogMessage: state.appUi.submissionMessage,
    isDataSubmitted: state.appUi.isDataSubmitted,
    requisicao: state.prepareReserve.requisicao,
    carrinhoErrorText: state.prepareReserve.carrinhoErrorText,
    availableCarrinhos: state.prepareReserve.availableCarrinhos,
    usuario: state.login.usuario
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setInfoNumber: (infoNumber) => {
      dispatch(setInfoNumber(infoNumber))
    },
    setBarcodeValue: (id, value) => {
      dispatch(setBarcodeValue(id, value))
    },
    removeBarcode: (id) => {
      dispatch(removeBarcode(id))
    },
    addBarcode: () => {
      dispatch(addBarcode())
    },
    clearBarcodes: () => {
      dispatch(clearBarcodes())
    },
    incrementMissingReserve: (index) => {
      dispatch(incrementMissingReserve(index))
    },
    decrementMissingReserve: (index) => {
      dispatch(decrementMissingReserve(index))
    },
    resetMissingReserve: (index) => {
      dispatch(resetMissingReserve(index))
    },
    setBarcodeErrorCode: (id, errorCode) => {
      dispatch(setBarcodeErrorCode(id, errorCode))
    },
    clearBarcodeTipo: (id) => {
      dispatch(setBarcodeTipo(id, null))
    },
    setBarcodeTipo: (id, tipo) => {
      dispatch(setBarcodeTipo(id, tipo))
    },
    getEquipTipo: (id, barCode) => {
      dispatch(getEquipTipo(serverUrl, id, barCode))
    },
    getTipos: () => {
      dispatch(getTipos(serverUrl))
    },
    getFamilias: () => {
      dispatch(getFamilias(serverUrl))
    },
    registerReservedEquips: (requisicao, usuario, patrimonios) => {
      dispatch(registerReservedEquips(serverUrl, requisicao, usuario, patrimonios))
    },
    getCarrinhos: () => {
      dispatch(getCarrinhos(serverUrl))
    },
    setIsYesNoMessage: (isYesNoMessage) => {
      dispatch(setIsYesNoMessage(isYesNoMessage))
    },
    setSubmissionMessage: (message) => {
      dispatch(setSubmissionMessage(message))
    }
  }
}

const ReadEquipsReserveContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReadEquipsReserve)

export default ReadEquipsReserveContainer
