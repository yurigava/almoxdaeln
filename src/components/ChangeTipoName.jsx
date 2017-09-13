import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid';
import EquipTypeSelectorContainer from '../containers/EquipTypeSelectorContainer.jsx';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import update from 'immutability-helper';

const style = {
  verticalAlign: 'bottom',
  margin: 5,
};


const infos = [
  'Selecione uma Família de Equipamentos',
  'Selecione um Tipo de Equipamento',
  'Digite o novo nome do Tipo'
];

const initialState = {
  isMissingTipoNewName: false,
  tipoNewName: "",
  isMissingFamilia: false,
  isMissingTipo: false,
  info: 0
}

export default class ChangeTipoName extends React.Component {

  constructor(props) {
    super(props);
    this.state = initialState;
    this.setInfoNumber = this.setInfoNumber.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  setInfoNumber(infoNumber) {
    this.setState(update(this.state, {info: {$set: infoNumber}}));
  }

  handleCloseDialog() {
    if(this.props.isDataSubmitted) {
      this.state = initialState;
      this.props.getTipos();
      this.props.setFamilia(null);
      this.props.setTipo(null);
    }
    this.props.clearSubmissionMessage();
  }

  handleTextFieldChange(event) {
    const value = event.currentTarget.value;
    this.setState(update(this.state, {
      tipoNewName: {$set: value},
    }))
  }


  handleFormSubmit(event) {
    if(this.props.familia === null) {
      this.setState(update(this.state, {
        isMissingFamilia: {$set: true},
      }))
      return;
    }
    if(this.props.tipo === null) {
      this.setState(update(this.state, {
        isMissingTipo: {$set: true},
      }))
      return;
    }
    if(this.state.tipoNewName === "") {
      this.setState(update(this.state, {
        isMissingTipoNewName: {$set: true},
      }))
      return;
    }
    this.props.updateTipoName(this.props.familia, this.props.tipo, this.state.tipoNewName)
  }


  render () {
    const actions = [
     <FlatButton
       label="OK"
       primary={true}
       onTouchTap={this.handleCloseDialog}
     />,
    ];

    const infoText = infos[this.state.info];

    return (
      <div>
				<Dialog
          actions={actions}
          modal={false}
          open={this.props.submissionMessage !== ""}
          onRequestClose={this.handleCloseDialog}
          autoScrollBodyContent={true}
        >
          {this.props.submissionMessage}
        </Dialog>
        <br/>
        <div
          style={{
            'fontFamily': 'Roboto,sans-serif'
          }}
        >
          {infoText}
        </div>
        <form onSubmit=
          {
            e => {
              e.preventDefault()
            }
          }
        >
          <Grid fluid >
            <Row bottom="xs" around="xs" center="xs" >
              <Col xs={0} sm={2} md={3}/>
              <Col xs={12} sm={8} md={6} >
                <EquipTypeSelectorContainer
                  tipo={this.props.tipo}
                  familia={this.props.familia}
                  setInfoNumber={this.setInfoNumber}
                  setSelectedTipo={this.props.setTipo}
                  setSelectedFamilia={this.props.setFamilia}
                  isMissingTipo={this.state.isMissingTipo}
                  isMissingFamilia={this.state.isMissingFamilia}
                  isInputDisabled={this.props.isInputDisabled}
                />
              </Col>
              <Col xs={0} sm={2} md={3}/>
            </Row>
            <Row bottom="xs" around="xs" center="xs" >
              <Col xs={12} sm={4} md={3}>
                <TextField
                  style={style}
                  name="newTipo"
                  hintText="Novo nome para o Tipo"
                  floatingLabelText="Novo Tipo"
                  value={this.state.tipoNewName}
                  disabled={this.props.isInputDisabled}
                  onChange={this.handleTextFieldChange}
                  errorText={(this.state.isMissingTipoNewName && this.state.tipoNewName === "") ?
                    "Campo Novo Tipo não pode ser deixado em branco" : ""}
                  floatingLabelStyle={{color: 'grey', left: '0px'}}
                  fullWidth={true}
                />
              </Col>
            </Row>
            <Row
              bottom="xs"
              center="xs"
              style={{height: '55px'}}
            >
              <Col>
                <RaisedButton
                  name="submit"
                  type="button"
                  style= {style}
                  label="Enviar"
                  primary={true}
                  onTouchTap={this.handleFormSubmit}
                />
              </Col>
            </Row>
          </Grid>
        </form>
      </div>
    )
  }
}

ChangeTipoName.propTypes = {
  updateTipoName: PropTypes.func.isRequired,
  clearSubmissionMessage: PropTypes.func.isRequired,
  getTipos: PropTypes.func.isRequired,
  setFamilia: PropTypes.func.isRequired,
  setTipo: PropTypes.func.isRequired,
  isInputDisabled: PropTypes.bool.isRequired,
  submissionMessage: PropTypes.string.isRequired,
  isDataSubmitted: PropTypes.bool.isRequired,
  tipo: PropTypes.number,
  familia: PropTypes.number,
};
