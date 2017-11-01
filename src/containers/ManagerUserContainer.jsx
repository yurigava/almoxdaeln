import { connect } from 'react-redux'
import ManagerUser from '../components/ManagerUser.jsx'
import {
  getUser,
  addUserRole,
  removeUserRole,
  setUser,
  setRole,
  insertUserRole,
  setError,
  clearUserRole,
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
    isDataSubmitted: state.appUi.isDataSubmitted,
    isYesNoMessage: state.appUi.isYesNoMessage,
    usuario: state.login.usuario,
    allUsers: state.managerUser.allUsers,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUser: (usuario) => {
      dispatch(getUser(serverUrl, usuario))
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
    clearUserRole: () => {
      dispatch(clearUserRole())
    },
    insertUserRole: (userRoles, usuario) => {
      dispatch(insertUserRole(serverUrl, userRoles, usuario))
    },
  }
}

const ManagerUserContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ManagerUser)

export default ManagerUserContainer
