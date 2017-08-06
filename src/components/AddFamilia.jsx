import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import update from 'immutability-helper';

const style = {
  verticalAlign: 'bottom',
  margin: 5,
};

const infos = [
  'Digite o nome da Família a ser inserida',
  'Digite o nome de um Tipo de Equipamento pertencente à Família'
];

const initialState = {
  isFamiliaDisabled: false,
  isMissingTipo: false,
  isMissingFamilia: false,
  tipo: "",
  familia: "",
  info: 0,
  familiaError: "",
  tipoError: "",
  isTipoSent: false,
};

export default class AddFamilia extends React.Component {

  constructor(props) {
    super(props);
    this.state = initialState;
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps)
  {
    if(nextProps.createdFamiliaNumber !== null && !this.state.isTipoSent) {
      this.props.insertTipo(this.state.tipo, nextProps.createdFamiliaNumber);
      this.setState(update(this.state, {
        isTipoSent: {$set: true}
      }));
    }
  }

  handleTextFieldChange(event) {
    const name = event.currentTarget.name;
    const value = event.currentTarget.value;
    let info = this.state.info
    if(name == "familia") {
      if(value == "")
        info = 0;
      else
        info = 1;
      if(this.state.familiaError !== "") {
        this.setState(update(this.state, {
          familiaError: {$set: ""}
        }));
      }
    }
    this.setState(update(this.state, {
      [name]: {$set: value},
      info: {$set: info},
    }))
  }

  handleCloseDialog() {
    if(this.props.isDataSubmitted) {
      this.state = initialState;
      this.props.setCreatedFamiliaNumber(null);
      this.props.getTipos();
      this.props.getFamilias();
    }
    else if(this.props.createdFamiliaNumber !== null) {
      this.setState(update(this.state, {
        isFamiliaDisabled: {$set: true},
        tipoError: {$set: "Tipo Incorreto"}
      }))
    }
    else {
      this.setState(update(this.state, {
        familiaError: {$set: "Família duplicada"}
      }));
    }
    this.props.clearSubmissionMessage();
  }

  handleFormSubmit(event) {
    if(this.state.familia === "") {
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
    if(this.props.createdFamiliaNumber === null)
      this.props.insertFamilia(this.state.familia);
    else
      this.props.insertTipo(this.state.tipo, this.props.createdFamiliaNumber)
  }

  render () {
    const infoNumber = infos[this.state.info];

    const actions = [
     <FlatButton
       label="OK"
       primary={true}
       onTouchTap={this.handleCloseDialog}
     />,
    ];

    let submissionMessage = this.props.submissionMessage;
    if(this.props.isDataSubmitted && this.props.createdFamiliaNumber !== null)
      submissionMessage = "Nova Família '" + this.state.familia + "', com tipo '" + this.state.tipo + "' criada com sucesso."

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
        <div
          style={{
            'fontFamily': 'Roboto,sans-serif'
          }}
        >
          {infoNumber}
        </div>
        <form onSubmit=
          {
            e => {
              e.preventDefault()
            }
          }
        >
          <TextField
            style={style}
            name="familia"
            hintText="Nome da Nova Família"
            floatingLabelText="Família"
            value={this.state.familia}
            disabled={(this.props.isInputDisabled && this.state.isFamiliaDisabled)}
            onChange={this.handleTextFieldChange}
            errorText={(this.state.isMissingFamilia && this.state.familia === "") ?
              "Campo Família não pode ser deixado em branco" : this.state.familiaError}
            floatingLabelStyle={{color: 'grey'}}
          />
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
              "Campo Tipo não pode ser deixado em branco" : this.state.tipoError}
            floatingLabelStyle={{color: 'grey'}}
          />
          <br/>
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

AddFamilia.propTypes = {
  setCreatedFamiliaNumber: PropTypes.func.isRequired,
  clearSubmissionMessage: PropTypes.func.isRequired,
  insertTipo: PropTypes.func.isRequired,
  insertFamilia: PropTypes.func.isRequired,
  getTipos: PropTypes.func.isRequired,
  getFamilias: PropTypes.func.isRequired,
  submissionMessage: PropTypes.string.isRequired,
  isInputDisabled: PropTypes.bool.isRequired,
  createdFamiliaNumber: PropTypes.number,
  isDataSubmitted: PropTypes.bool.isRequired,
};
