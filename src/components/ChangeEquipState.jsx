import React, { PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import update from 'immutability-helper';

const style = {
  verticalAlign: 'bottom',
  margin: 5,
};

const initialState = {
  estado: null,
  patrimonio: "",
  observacao: "",
  isMissingEstado: false,
  isMissingPatrimonio: false,
}

export default class ChangeEquipState extends React.Component {

  constructor(props) {
    super(props);
    this.state = initialState;
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleEstadoChange = this.handleEstadoChange.bind(this);
  }

  componentDidMount() {
    if(this.props.estados.length === 0)
      this.props.getEstados();
  }

  handleTextFieldChange(event) {
    const value = event.currentTarget.value;
    const name = event.currentTarget.name;
    const newValue = name == "patrimonio" ? (value.match("[0-9]+") || []).pop() || '' : value;
    this.setState(update(this.state, {
      [name]: {
        $set: newValue
      }
    }));
  }

  handleFormSubmit(event) {
    if(this.state.estado === null || this.state.patrimonio === "") {
      this.setState(update(this.state, {
        isMissingEstado: {$set: true},
        isMissingPatrimonio: {$set: true}
      }));
      return;
    }
    else {
      this.props.updateEquipState(this.props.usuario, Number(this.state.patrimonio), this.state.estado, this.state.observacao)
    }
  }

  handleCloseDialog() {
    if(this.props.isDataSubmitted) {
      this.state = initialState;
      this.props.clearDataSent();
    }
    this.props.setSubmissionMessage("");
  }

  handleEstadoChange(event, index, estado) {
    this.setState(update(this.state, {
      estado: {$set: estado}
    }))
  }

  render () {

    const actions = [
     <FlatButton
       label="OK"
       primary={true}
       onTouchTap={this.handleCloseDialog}
     />,
    ];

    const infoText = "Digite ou escaneie o código do aparelho, e selecione o estado para o qual mudá-lo.";

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
          <TextField
            autoFocus
            style={style}
            name={"patrimonio"}
            hintText={"Patrimônio do Equipamento"}
            floatingLabelText={"Equipamento"}
            value={this.state.patrimonio}
            onChange={this.handleTextFieldChange}
            errorText={(this.state.isMissingPatrimonio && this.state.patrimonio === "") ?
              "Campo Patrimônio não pode ser deixado em branco" : ""}
            floatingLabelStyle={{color: 'grey'}}
            disabled={this.props.isInputDisabled}
          />
          &nbsp;
          <SelectField
            style={style}
            floatingLabelText="Estado"
            value={this.state.estado}
            onChange={this.handleEstadoChange}
            disabled={this.props.isInputDisabled}
            autoWidth={true}
            errorText={(this.state.isMissingEstado && this.state.estado === null) ?
              "Campo Estado não pode ser deixado em branco" : ""}
            floatingLabelStyle={{left: '0px', color: 'grey'}}
          >
            {this.props.estados.map((estado) => (
              <MenuItem key={estado.id_estado} value={estado.id_estado} primaryText={estado.estado} />
            ))}
          </SelectField>
          <br/>
          <TextField
            style={style}
            name={"observacao"}
            hintText={"Motivo da mudança de estado"}
            floatingLabelText={"Observação"}
            value={this.state.observacao}
            onChange={this.handleTextFieldChange}
            floatingLabelStyle={{left: '0px', color: 'grey'}}
            multiLine={true}
            disabled={this.props.isInputDisabled}
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

ChangeEquipState.propTypes = {
  setSubmissionMessage: PropTypes.func.isRequired,
  updateEquipState: PropTypes.func.isRequired,
  getEstados: PropTypes.func.isRequired,
  submissionMessage: PropTypes.string.isRequired,
  usuario: PropTypes.string.isRequired,
  isDataSubmitted: PropTypes.bool.isRequired,
  isInputDisabled: PropTypes.bool.isRequired,
  estados: PropTypes.array.isRequired,
};
