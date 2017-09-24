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
  resetOldIndex,
  setIsPaper,
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
    usuario: state.login.usuario
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setInfoNumber: (infoNumber) => {
      dispatch(setInfoNumber(infoNumber))
    },
    setBarcodeValue: (index, value) => {
      dispatch(setBarcodeValue(index, value))
    },
    removeBarcode: (index) => {
      dispatch(removeBarcode(index))
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
    setBarcodeErrorCode: (index, errorCode) => {
      dispatch(setBarcodeErrorCode(index, errorCode))
    },
    clearBarcodeTipo: (index) => {
      dispatch(setBarcodeTipo(index, null))
    },
    setBarcodeTipo: (index, tipo) => {
      dispatch(setBarcodeTipo(index, tipo))
    },
    getEquipTipo: (index, barCode) => {
      dispatch(getEquipTipo(serverUrl, index, barCode))
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
    resetOldIndex: (index) => {
      dispatch(resetOldIndex(index))
    },
    setIsPaper: (index, isPaper) => {
      dispatch(setIsPaper(index, isPaper))
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
