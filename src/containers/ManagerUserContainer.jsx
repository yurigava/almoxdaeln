import { connect } from 'react-redux'
import ManagerUser from '../components/ManagerUser.jsx'
import {
  getUsers,
} from '../actions/managerUser.js'
import {
  setSubmissionMessage,
  setIsYesNoMessage,
  setDataSubmitted,
} from '../actions/appUi.js'
import { serverUrl } from '../main.jsx'

const mapStateToProps = (state) => {
  return {
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
  }
}

const ManagerUserContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ManagerUser)

export default ManagerUserContainer
