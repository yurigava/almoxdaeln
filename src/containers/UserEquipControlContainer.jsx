import { connect } from 'react-redux'
import UserEquipControl from '../components/UserEquipControl.jsx'
import {
  setSubmissionMessage,
  setDataSubmitted
} from '../actions/appUi.js'

const mapStateToProps = (state, ownProps) => {
  return {
    submissionMessage: state.appUi.submissionMessage,
    isDataSubmitted: state.appUi.isDataSubmitted,
    isInputDisabled: state.appUi.isInputDisabled,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setSubmissionMessage: (message) => {
      dispatch(setSubmissionMessage(message))
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
