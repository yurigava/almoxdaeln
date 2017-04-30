import { connect } from 'react-redux'
import InputAuthentication from '../components/InputAuthentication.jsx'
import { changeLogin, changePassword, submitLogin } from '../actions/index.js'

const mapStateToProps = (state) => {
  return {
    login: state.login.login,
    password: state.login.password
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoginSubmit: () => {
      dispatch(submitLogin())
    },
    onPasswordChange: (password) => {
      dispatch(changePassword(password))
    },
    onLoginChange: (login) => {
      dispatch(changeLogin(login))
    }
  }
}

const loginContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(InputAuthentication)

export default loginContainer
