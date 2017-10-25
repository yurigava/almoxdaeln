import { connect } from 'react-redux'
import ReturnReserve from '../components/ReturnReserve.jsx'
import {
  getPreparedReserves,
  registerDeliveredReserve,
  getReturnedReserveDetails,
  getInUseReserves
} from '../actions/returnReserve.js'
import {
  setSubmissionMessage,
  setIsYesNoMessage
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
      dispatch(getInUseReserves(serverUrl))
    },
    setSubmissionMessage: (message) => {
      dispatch(setSubmissionMessage(message))
    },
    getReturnedReserveDetails: (id) => {
      dispatch(getReturnedReserveDetails(serverUrl, id))
    },
    setIsYesNoMessage: (isYesNo) => {
      dispatch(setIsYesNoMessage(isYesNo))
    },
  }
}

const ReturnReserveContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReturnReserve)

export default ReturnReserveContainer
