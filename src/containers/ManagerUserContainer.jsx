import { connect } from 'react-redux'
import ManagerUser from '../components/ManagerUser.jsx'
import {
  getUsers,
  addUserRole,
  removeUserRole,
  setUser,
  setRole,
  insertUsers,
  setError,
} from '../actions/managerUser.js'
import {
  setSubmissionMessage,
  setIsYesNoMessage,
  setDataSubmitted,
} from '../actions/appUi.js'
import { serverUrl } from '../main.jsx'

const mapStateToProps = (state) => {
  return {
    isInputDisabled: state.appUi.isInputDisabled,
    submissionMessage: state.appUi.submissionMessage,
    allUser: state.addReserve.allUser,
    isYesNoMessage: state.appUi.isYesNoMessage,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUsers: () => {
      dispatch(getUsers(serverUrl))
    },
    addUserRole: () => {
      dispatch(addUserRole())
    },
    removeUserRole: (index) => {
      dispatch(removeUserRole(index))
    },
    clearSubmissionMessage: () => {
      dispatch(setSubmissionMessage(""))
    },
    setUser: (index, user) => {
      dispatch(setUser(index, user))
    },
    setRole: (index, role) => {
      dispatch(setRole(index, role))
    },
    setError: (error) => {
      dispatch(setSubmissionMessage(error))
    },
    setDataSubmitted: (submitted) => {
      dispatch(setDataSubmitted(submitted))
    },
    setIsYesNoMessage: (isYesNoMessage) => {
      dispatch(setIsYesNoMessage(isYesNoMessage))
    },
  }
}

const ManagerUserContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ManagerUser)

export default ManagerUserContainer
