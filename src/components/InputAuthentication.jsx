import React, { PropTypes } from 'react';
import axios from 'axios';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import update from 'immutability-helper';

export default class InputAuthentication extends React.Component {

  constructor(props) {
    super(props);
    this.state = {login: '',
                  password: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if(this.props.userRole === "")
    {
      this.props.getUserRole();
    }
    if(this.props.userRole !== "" && this.props.userRole !== "loggedOut")
    {
      this.props.router.push('/'+this.props.visibleLinks[0]);
    }
  }

  componentWillReceiveProps() {
    if(this.props.userRole !== "" && this.props.userRole !== "loggedOut")
    {
      this.props.router.push('/'+this.props.visibleLinks[0]);
    }
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState(update(this.state, {[name]: {$set: value}}));
  }

  render() {
    return (
      <div>
        <center>
          <form onSubmit=
            {
              e => {
                e.preventDefault()
                this.props.onLoginSubmit(this.state.login, this.state.password)
              }
            }
          >
            <TextField
              name="login"
              hintText="Código do Usuário"
              floatingLabelText="Login"
              value={this.state.login}
              onChange={this.handleChange}
              disabled={this.props.isInputDisabled}
              errorText={this.props.errorTextLogin}
              floatingLabelStyle={{color: 'grey'}}
            /><br/>

            <TextField
              name="password"
              floatingLabelText="Senha"
              type="password"
              value={this.state.password}
              onChange={this.handleChange}
              disabled={this.props.isInputDisabled}
              errorText={this.props.errorTextPassword}
              floatingLabelStyle={{color: 'grey'}}
            /><br/>
            <br/>
            <RaisedButton
              label="Enviar"
              primary={true}
              type="submit"
            />
          </form>
        </center>
      </div>
    )
  }
}

InputAuthentication.propTypes = {
  onLoginSubmit: PropTypes.func.isRequired,
  getUserRole: PropTypes.func.isRequired,
  isInputDisabled: PropTypes.bool.isRequired,
  errorTextLogin: PropTypes.string.isRequired,
  errorTextPassword: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
  visibleLinks: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
}
