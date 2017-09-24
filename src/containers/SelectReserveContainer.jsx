import { connect } from 'react-redux'
import SelectReserve from '../components/SelectReserve.jsx'
import {
  getReserves,
  setReserves,
  setInfoNumber,
  getReserveDetails,
} from '../actions/prepareReserve.js'
import { setSubmissionMessage } from '../actions/appUi.js'
import { serverUrl } from '../main.jsx'

const mapStateToProps = (state) => {
  return {
    isInputDisabled: state.appUi.isInputDisabled,
    submissionMessage: state.appUi.submissionMessage,
    reserves: state.prepareReserve.reserves,
    infoNumber: state.prepareReserve.infoNumber,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getReserves: (date, shift) => {
      dispatch(getReserves(serverUrl, date, shift))
    },
    clearReserves: () => {
      dispatch(setReserves([]))
    },
    getReserveDetails: (reserveId) => {
      dispatch(getReserveDetails(serverUrl, reserveId))
    },
    clearSubmissionMessage: () => {
      dispatch(setSubmissionMessage(""))
    },
    setInfoNumber: (infoNumber) => {
      dispatch(setInfoNumber(infoNumber))
    }
  }
}

const SelectReserveContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectReserve)

export default SelectReserveContainer
