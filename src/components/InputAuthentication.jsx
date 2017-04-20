import React from 'react';
import axios from 'axios';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import update from 'immutability-helper';

export default class InputAuthentication extends React.Component {

constructor(props) {
    super(props);
    this.state = {login: '',
                  password: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState(update(this.state, {[name]: {$set: value}}));
  }

  handleSubmit(event) {
    axios.post(this.props.route.url + "/login", {
      login: this.state.login,
      password: this.state.password
    }, {withCredentials:true})
    .then((response) => {
      if(response.data === 'almoxarife')
        this.props.handleLoginAlmoxarife()
      if(response.data === 'professor')
        this.props.handleLoginProfessor()
    })
    .catch((error) => {
      alert(error);//erro de resposta
    });
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <center>
          <form onSubmit={this.handleSubmit}>
            <TextField
              name="login"
              hintText="Código do Usuário"
              floatingLabelText="Login"
              value={this.state.login}
              onChange={this.handleChange}
            /><br/>

            <TextField
              name="password"
              floatingLabelText="Senha"
              type="password"
              value={this.state.password}
              onChange={this.handleChange}
            /><br/>

            <RaisedButton
              label="Enviar"
              primary={true}
              type="submit"
            />
          </form>
        </center>
      </div>
    );
  }
}
