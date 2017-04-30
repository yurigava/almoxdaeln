import React, { PropTypes } from 'react';
import axios from 'axios';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import update from 'immutability-helper';

const InputAuthentication = ({login, password, onLoginSubmit, onPasswordChange, onLoginChange}) => (
  <div>
    <center>
      <form onSubmit={e => {
          e.preventDefault()
          onLoginSubmit()
        }}
      >
        <TextField
          name="login"
          hintText="Código do Usuário"
          floatingLabelText="Login"
          value={login}
          onChange={e => onLoginChange(e.target.value)}
        /><br/>

        <TextField
          name="password"
          floatingLabelText="Senha"
          type="password"
          value={password}
          onChange={e => onPasswordChange(e.target.value)}
        /><br/>

        <RaisedButton
          label="Enviar"
          primary={true}
          type="submit"
        />
      </form>
    </center>
  </div>
)

InputAuthentication.propTypes = {
  login: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  onLoginSubmit: PropTypes.func.isRequired,
  onPasswordChange: PropTypes.func.isRequired,
  onLoginChange: PropTypes.func.isRequired
}

export default InputAuthentication
