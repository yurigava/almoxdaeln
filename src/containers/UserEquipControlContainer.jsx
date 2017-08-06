import { connect } from 'react-redux'
import UserEquipControl from '../components/UserEquipControl.jsx'
import {
  setSubmissionMessage,
  setIsYesNoMessage,
  setDataSubmitted
} from '../actions/appUi.js'

const mapStateToProps = (state, ownProps) => {
  return {
    submissionMessage: state.appUi.submissionMessage,
    isDataSubmitted: state.appUi.isDataSubmitted,
    isInputDisabled: state.appUi.isInputDisabled,
    isYesNoMessage: state.appUi.isYesNoMessage,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setSubmissionMessage: (message) => {
      dispatch(setSubmissionMessage(message))
    },
    setIsYesNoMessage: (isYesNoMessage) => {
      dispatch(setIsYesNoMessage(isYesNoMessage))
    },
    clearDataSent: () => {
      dispatch(setDataSubmitted(false))
    }
  }
}

const UserEquipControlContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserEquipControl)

export default UserEquipControlContainer
