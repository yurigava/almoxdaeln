import { connect } from 'react-redux'
import InputAuthentication from '../components/InputAuthentication.jsx'
import { submitLogin, getUserRole } from '../actions/login.js'
import { serverUrl } from '../main.jsx'

const mapStateToProps = (state) => {
  return {
    isInputDisabled: state.appUi.isInputDisabled,
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
    getUserRole: () => {
      dispatch(getUserRole(serverUrl))
    }
  }
}

const loginContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(InputAuthentication)

export default loginContainer
