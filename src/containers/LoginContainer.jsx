import { connect } from 'react-redux'
import InputAuthentication from '../components/InputAuthentication.jsx'
import {
  submitLogin,
  getUserRole,
  setUsuario
} from '../actions/login.js'
import { setSubmissionMessage } from '../actions/appUi.js'
import { serverUrl } from '../main.jsx'

const mapStateToProps = (state) => {
  return {
    isInputDisabled: state.appUi.isInputDisabled,
    submissionMessage: state.appUi.submissionMessage,
    errorTextLogin: state.login.errorLogin,
    errorTextPassword: state.login.errorPassword,
    userRole: state.login.userRole,
    visibleLinks:
      state.appUi.pagesList.filter(page =>
        page.allowedRoles.includes(state.login.userRole)
      )
      .map(selectedPage =>
        selectedPage.info.link
      )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoginSubmit: (login, password) => {
      dispatch(submitLogin(serverUrl, login, password))
    },
    clearSubmissionMessage: () => {
      dispatch(setSubmissionMessage(""))
    },
    getUserRole: () => {
      dispatch(getUserRole(serverUrl))
    },
    setUsuario: (usuario) => {
      dispatch(setUsuario(usuario))
    }
  }
}

const LoginContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(InputAuthentication)

export default LoginContainer
