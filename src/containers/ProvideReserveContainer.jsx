import { connect } from 'react-redux'
import ProvideReserve from '../components/ProvideReserve.jsx'
import {
  getPreparedReserves,
  registerDeliveredReserve
} from '../actions/provideReserve.js'
import {
  setSubmissionMessage,
  setIsYesNoMessage,
  setDataSubmitted
} from '../actions/appUi.js'
import { serverUrl } from '../main.jsx'

const mapStateToProps = (state) => {
  return {
    reserves: state.provideReserve.reserves,
    dialogMessage: state.appUi.submissionMessage,
    isYesNoMessage: state.appUi.isYesNoMessage,
    isDataSubmitted: state.appUi.isDataSubmitted
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getReserves: () => {
      dispatch(getPreparedReserves(serverUrl))
    },
    setSubmissionMessage: (message) => {
      dispatch(setSubmissionMessage(message))
    },
    setIsYesNoMessage: (isYesNo) => {
      dispatch(setIsYesNoMessage(isYesNo))
    },
    registerDeliveredReserve: (id) => {
      dispatch(registerDeliveredReserve(serverUrl, id))
    },
    clearDataSent: () => {
      dispatch(setDataSubmitted(false))
    },
  }
}

const ProvideReserveContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProvideReserve)

export default ProvideReserveContainer
