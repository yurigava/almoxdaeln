import React from 'react';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import update from 'immutability-helper';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Paper from 'material-ui/Paper';

const infos = [
  'Selecione uma Família de Equipamentos',
  'Selecione um Tipo de Equipamento',
  'Digite a quantidade de Equipamento(os) a ser(em) reservado(os)',
  'Selecione o dia para reservar os Equipamentos',
  'Selecione o turno para reservar os Equipamentos',
  'Digite a matéria em que será usada os Equipamentos',
  'Selecione uma das Requisições!',
];

const regra = [
  'Administrador',
  'Almoxarifado',
];

const textRole = [
  'admin',
  'almox',
];

export default class ManagerUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flagUser: -1,
    }
    this.handleForcedSubmit = this.handleForcedSubmit.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleChangeUser = this.handleChangeUser.bind(this);
    this.handleChangeRole = this.handleChangeRole.bind(this);
    this.handleRemoveEquipment = this.handleRemoveEquipment.bind(this);
    this.handleNewEquipment = this.handleNewEquipment.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleEditUserRole = this.handleEditUserRole.bind(this);
  }

  componentDidMount() {
    this.props.clearUserRole();
    this.props.getUser(this.props.usuario);
  }

  componentWillReceiveProps(nextProps) {
    //this.props.allUsers.forEach(function (campo) {
    //  alert("usuario: " + campo.id + " role: " + campo.role);
    //});
  }

  handleChangeUser(event) {
    //alert(event.target.name + " - " + event.target.value);
    this.props.setUser(event.target.name, event.target.value);
  }

  handleChangeRole(name, event, key, payload) {
    //alert(name + " - " + regra[key]);
    this.props.setRole(name, regra[key]);

    this.setState(update(this.state, {
      flagUser: { $set: -1 }
    }));
  }

  handleRemoveEquipment(event) {
    //if(this.props.allUsers.length <= 1) {
      //this.props.setError("Não é possível remover esse campo.");
      //this.props.clearEquips();
      //this.props.setIsYesNoMessage(false);
    //  return;
    //}
    //else {
      this.props.removeUserRole(event);
    //}
  }

  handleNewEquipment(event) {
    //if(this.props.allUsers[this.props.allUsers.length-1].role === null) {
    //  return
    //}
    this.props.addUserRole();
  }

  handleEditUserRole(event) {
    this.setState(update(this.state, {
      flagUser: { $set: event }
    }));
  }

  handleFormSubmit(event) {
    event.preventDefault();
    //if(this.props.allUsers[this.props.allUsers.length-1].id === null) {
    //  return
    //}
  }

  handleForcedSubmit(event) {
    var userRoles = [];
    this.props.allUsers.forEach(campo => {
      if(pat.id !== null) {
        userRoles.push({
          id: campo.id,
          role: campo.role
        });
      }
    });
  }
    
  handleCloseDialog(event) {
  }

  render () {
    let actions
    if(this.props.isYesNoMessage) {
      actions = [
        <FlatButton
          label="SIM"
          primary={false}
          onTouchTap={this.handleForcedSubmit}
        />,
        <FlatButton
          label="NÃO"
          primary={true}
          onTouchTap={this.handleCloseDialog}
        />,
      ];
    }
    else {
      actions = [
      <FlatButton
        label="OK"
        primary={true}
        onTouchTap={this.handleCloseDialog}
      />,
      ];
    }

    let submissionMessage = this.props.submissionMessage;
    return (
      <div>
				<Dialog
          actions={actions}
          modal={false}
          open={this.props.submissionMessage !== ""}
          onRequestClose={this.handleCloseDialog}
          autoScrollBodyContent={true}
        >
          {submissionMessage}
        </Dialog>
        <br/>

        <Grid fluid >
          {this.props.allUsers.map((usuario, index) => (
            <Row bottom="xs" around="xs" center="xs" key={index} >
              <Col xs={11} sm={11} md={11} >
                {usuario.id !== null & usuario.role !== null & this.state.flagUser !== index ?
                  <div>
                    <Row bottom="xs" around="xs" center="xs" key={index} >
                      <Col xs={11} sm={11} md={11} >
                        <Paper
                          zDepth={2}
                          rounded={false}
                          onClick={this.handleEditUserRole.bind(null,index)}
                          style={{marginTop: '10px', height: '50px', display: 'flex', alignItems: 'center'}}
                        >
                          <text style={{marginLeft: '15.5px'}}>
                            {usuario.id + " - " + usuario.role}
                          </text>
                        </Paper>
                      </Col>
                    </Row>
                  </div>
                :
                  <Row bottom="xs" around="xs" center="xs" key={index} >
                    <Col xs={12} sm={9} md={9} >
                      <TextField
                        name={index}
                        hintText={"Usuário"}
                        floatingLabelText={"Digite o nome do Usuário"}
                        value={usuario.id}
                        onChange={this.handleChangeUser}
                        //onChange={this.handleChangeUser.bind(null, index, value)}
                        floatingLabelStyle={{color: 'grey'}}
                        fullWidth={true}
                      />
                    </Col>
                    <Col xs={12} sm={3} md={3}>
                      <SelectField
                        labelStyle={{position: 'absolute'}}
                        floatingLabelText="Regra"
                        value={usuario.role}
                        onChange={this.handleChangeRole.bind(null,index)}
                        floatingLabelStyle={{color: 'grey', left: '0px'}}
                        //disabled={usuario.role !== null}
                        fullWidth={true}
                        autoWidth={true}
                        inputStyle={{left: '0px'}}
                      >
                        {regra.map((hora) => (
                          <MenuItem
                            key={hora}
                            value={hora}
                            primaryText={hora}
                          />
                        ))}
                      </SelectField>
                    </Col>
                  </Row>
                }
              </Col>
              <Col xs={1} sm={1} md={1}>
                <FloatingActionButton
                  mini={true}
                  type="button"
                  //name={index}
                  backgroundColor="#ff0000"
                  onTouchTap={this.handleRemoveEquipment.bind(null,index)}
                  zDepth={1}
                >
                  <ActionDelete />
                </FloatingActionButton>
              </Col>
            </Row>
          ))}

          <Row bottom="xs" center="xs" style={{height: '60px'}} >
            <Col>
              <RaisedButton
                name="add"
                type="button"
                label="Adicionar"
                //disabled={this.props.allUsers[this.props.allUsers.length-1].role === null ? true : false}
                primary={false}
                onTouchTap={this.handleNewEquipment}
              />
            </Col>
            <Col xs={1}/>
            <Col>
              <RaisedButton
                name="submit"
                type="button"
                label="Enviar"
                //disabled={this.props.allUsers[this.props.allUsers.length-1].role === null ? true : false}
                primary={true}
                onTouchTap={this.handleFormSubmit}
              />
            </Col>
          </Row>

        </Grid>
      </div>
    )
  }
}

ManagerUser.propTypes = {
  submissionMessage: PropTypes.string.isRequired,
  clearSubmissionMessage: PropTypes.func.isRequired,
  clearUserRole: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  allUsers: PropTypes.array,
  getUser: PropTypes.func.isRequired,
  addUserRole: PropTypes.func.isRequired,
  removeUserRole: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
  setRole: PropTypes.func.isRequired,
  setIsYesNoMessage: PropTypes.func.isRequired,
  isYesNoMessage: PropTypes.bool,
  setDataSubmitted: PropTypes.func.isRequired,
  usuario: PropTypes.string,
  //insertUser: PropTypes.func.isRequired,
};
