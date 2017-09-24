import { connect } from 'react-redux'
import ReadEquipsReserve from '../components/ReadEquipsReserve.jsx'
import {
  setInfoNumber,
  setBarcodeValue,
  removeBarcode,
  addBarcode,
  incrementMissingReserve,
  decrementMissingReserve,
  setBarcodeErrorText,
  getEquipTipo,
  clearBarcodes,
  resetMissingReserve,
  setBarcodeTipo,
} from '../actions/prepareReserve.js'
import { getTipos } from '../actions/equipTypeSelect.js'
import { serverUrl } from '../main.jsx'

const mapStateToProps = (state) => {
  return {
    reserveEquips: state.prepareReserve.reserveEquips,
    barCodes: state.prepareReserve.barCodes,
    tipos: state.equipTypeSelect.tipos,
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
    setBarcodeErrorText: (index, errorText) => {
      dispatch(setBarcodeErrorText(index, errorText))
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
  }
}

const ReadEquipsReserveContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReadEquipsReserve)

export default ReadEquipsReserveContainer
