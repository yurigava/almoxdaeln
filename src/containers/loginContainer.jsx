import { connect } from 'react-redux'
import InputAuthentication from '../components/InputAuthentication.jsx'
import { changeLogin, changePassword, submitLogin } from '../actions/index.js'

const mapStateToProps = (state) => {
  return {
    isInputDisabled: state.login.isInputDisabled,
    errorTextLogin: state.login.errorLogin,
    errorTextPassword: state.login.errorPassword
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoginSubmit: (login, password, push) => {
      dispatch(submitLogin(login, password, push))
    }
  }
}

const loginContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(InputAuthentication)

export default loginContainer
