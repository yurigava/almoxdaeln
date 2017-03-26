import React from 'react';
import axios from 'axios';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default class Input_Authentication extends React.Component {

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
    this.setState({
          [name]: value});
  }

  handleSubmit(event) {
    //alert('A name was submitted: ' + this.state.login);
    axios.post(this.props.url + "/login", {
      login: this.state.login,
      password: this.state.password
      })
      .then(function (response) {
      alert('A name was submitted: ' + this.state.login);
      })
      .catch(function (error) {
      alert('error');
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

            <RaisedButton label="Enviar" primary={true}
            type="submit" />
          </form> 
        </center>
      </div>
    );
  }
}

Input_Authentication.propTypes = {
  url: React.PropTypes.string.isRequired
};
