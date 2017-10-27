import { connect } from 'react-redux'
import PendingEquipsTable from '../components/PendingEquipsTable.jsx'
import { getPendingEquips } from '../actions/pendingEquipsTable.js'
import {
  setSubmissionMessage,
  setIsYesNoMessage,
} from '../actions/appUi.js'
import { serverUrl } from '../main.jsx'

const mapStateToProps = (state) => {
  return {
    dialogMessage: state.appUi.submissionMessage,
    isYesNoMessage: state.appUi.isYesNoMessage,
    pendingEquips: state.pendingEquipsTable.pendingEquips,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getPendingEquips: () => {
      dispatch(getPendingEquips(serverUrl))
    },
    setIsYesNoMessage: (isYesNo) => {
      dispatch(setIsYesNoMessage(isYesNo))
    },
    setSubmissionMessage: (message) => {
      dispatch(setSubmissionMessage(message))
    }
  }
}

const PendingEquipsTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PendingEquipsTable)

export default PendingEquipsTableContainer
