import React, { PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import update from 'immutability-helper';

const style = {
  verticalAlign: 'bottom',
  margin: 5,
};

const infos = [
  'Selecione uma Família de Equipamentos',
  'Digite o nome do novo Tipo de Equipamento'
];

const initialState = {
  isMissingTipo: false,
  isMissingFamilia: false,
  tipo: "",
  familia: null,
  info: 0
}

export default class AddTipo extends React.Component {

  constructor(props) {
    super(props);
    this.state = initialState;
    this.handleFamiliaChange = this.handleFamiliaChange.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentDidMount() {
    if(this.props.familias.length === 0)
      this.props.getFamilias();
      this.props.getTipos();
  }

  handleCloseDialog() {
    if(this.props.isDataSubmitted) {
      this.state = initialState;
      this.props.getTipos();
    }
    this.props.clearSubmissionMessage();
  }

  handleFamiliaChange(event, index, familia) {
    if(familia == this.props.familia)
      return;
    this.setState(update(this.state, {
      familia: {$set: familia},
      info: {$set: 1}
    }))
  }

  handleTextFieldChange(event) {
    const value = event.currentTarget.value;
    this.setState(update(this.state, {
      tipo: {$set: value},
    }))
  }

  handleFormSubmit(event) {
    if(this.state.familia === null) {
      this.setState(update(this.state, {
        isMissingFamilia: {$set: true},
      }))
      return;
    }
    if(this.state.tipo === "") {
      this.setState(update(this.state, {
        isMissingTipo: {$set: true},
      }))
      return;
    }
    this.props.insertTipo(this.state.tipo, this.state.familia)
  }

  render () {
    const infoText = infos[this.state.info];

    const actions = [
     <FlatButton
       label="OK"
       primary={true}
       onTouchTap={this.handleCloseDialog}
     />,
    ];

    return (
      <div>
				<Dialog
          actions={actions}
          modal={false}
          open={this.props.submissionMessage !== ""}
          onRequestClose={this.handleCloseDialog}
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
          <SelectField
            style={style}
            floatingLabelText="Família"
            value={this.state.familia}
            onChange={this.handleFamiliaChange}
            disabled={this.props.isInputDisabled}
            errorText={(this.state.isMissingFamilia && this.state.familia === null) ?
              "Campo Família não pode ser deixado em branco" : ""}
            floatingLabelStyle={{color: 'grey'}}
          >
            {this.props.familias.map((familia) => (
              <MenuItem key={familia.id_familia} value={familia.id_familia} primaryText={familia.familia} />
            ))}
          </SelectField>
          &nbsp;
          <TextField
            style={style}
            name="tipo"
            hintText="Nome do Novo Tipo"
            floatingLabelText="Tipo"
            value={this.state.tipo}
            disabled={this.props.isInputDisabled}
            onChange={this.handleTextFieldChange}
            errorText={(this.state.isMissingTipo && this.state.tipo === "") ?
              "Campo Tipo não pode ser deixado em branco" : ""}
            floatingLabelStyle={{color: 'grey'}}
          />
        <br/>
        <RaisedButton
          name="submit"
          type="button"
          style= {style}
          label="Enviar"
          primary={true}
          onTouchTap={this.handleFormSubmit}
        />
        </form>
      </div>
    )
  }
}

AddTipo.propTypes = {
  getFamilias: PropTypes.func.isRequired,
  getTipos: PropTypes.func.isRequired,
  insertTipo: PropTypes.func.isRequired,
  clearSubmissionMessage: PropTypes.func.isRequired,
  familias: PropTypes.array.isRequired,
  isInputDisabled: PropTypes.bool.isRequired,
  submissionMessage: PropTypes.string.isRequired,
  isDataSubmitted: PropTypes.bool.isRequired,
};
