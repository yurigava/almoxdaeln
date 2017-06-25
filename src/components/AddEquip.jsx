import React, { PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import update from 'immutability-helper';

const style = {
  verticalAlign: 'bottom',
  margin: 5,
};

const infos = [
  'Selecione uma Família de Equipamentos',
  'Selecione um Tipo de Equipamento',
  'Escaneie ou digite o código dos equipamentos a serem registrados'
];

const initialState = {
  patrimonios: [
    {index: 0, name: "equip0", value: "", errorText: ""}
  ],
  familia: "",
  tipo: "",
  allowedTipos: [],
  tipoDisabled: true,
  infoText: infos[0]
};

export default class AddEquip extends React.Component {

  constructor(props) {
    super(props);
    this.state = initialState;
    this.props.clearMissingFieldsError();
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleFamiliaChange = this.handleFamiliaChange.bind(this);
    this.handleTipoChange = this.handleTipoChange.bind(this);
    this.handleNewEquipment = this.handleNewEquipment.bind(this);
    this.handleRemoveEquipment = this.handleRemoveEquipment.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
  }

  handleCloseDialog() {
    if(this.props.isDataSubmitted) {
      this.state = initialState;
      this.props.clearMissingFieldsError();
    }
    else if(this.props.errorCauseEquipNumber !== "") {
      let message = "";
      if(this.props.errorCode === "ER_WARN_DATA_OUT_OF_RANGE")
        message = "Código Excedeu o limite de tamanho";
      else if(this.props.errorCode === "ER_DUP_ENTRY")
        message = "Equipamento já registrado";
      const index = this.state.patrimonios.findIndex(patrimonio =>
        this.props.errorCauseEquipNumber == patrimonio.value
      );
      this.setState(update(this.state, {
        patrimonios: {
          [index]: {
            errorText: { $set: message }
          }
        }
      }));
    }
    this.props.clearSubmissionMessage();
  }

  handleTextFieldChange(event) {
    const value = event.target.value;
    const index = this.findEquipIndex(event.target.name, this.state.patrimonios);
    const newValue = (value.match("[0-9]+") || []).pop() || '';
    let newErrorText = this.state.patrimonios[index].errorText;
    if(newValue != this.state.patrimonios[index].value)
      newErrorText = "";
    this.setState(update(this.state, {
      patrimonios: {
        [index]: {
          value: { $set: newValue },
          errorText: { $set: newErrorText }
        }
      }
    }));
  }

  handleKeyPress(event) {
    if(event.key === 'Enter') {
      this.handleNewEquipment(event);
    }
  }

  handleNewEquipment(event) {
    let hasEmptyFields = false
    for (var i = 0; i < this.state.patrimonios.length; i++) {
      if(this.state.patrimonios[i].value === "") {
        hasEmptyFields = true;
        this.setState(update(this.state, {
          patrimonios: { [i]: { errorText: {
               $set: "Preencha este campo antes de criar um novo"
          }}}}));
      }
      else if(this.state.patrimonios[i].errorText !== "") {
        this.setState(update(this.state, {
          patrimonios: { [i]: { errorText: { $set: "" } } }
        }));
      }
    }
    if(hasEmptyFields)
      return;
    const patrimonios = this.state.patrimonios
    let nextIndex = 0
    if(patrimonios.length > 0)
      nextIndex = patrimonios[patrimonios.length-1].index+1
    this.setState(update(this.state, {
      patrimonios: {
        $push: [
          {
            index: nextIndex,
            name: "equip"+nextIndex,
            value: "",
            errorText: ""
          }
        ]
      }
    }));
  }

  handleRemoveEquipment(event) {
    const index = this.findEquipIndex(event.target.name, this.state.patrimonios)
    this.setState(update(this.state, {
      patrimonios: {
        $splice: [[index, 1]]
      }
    }));
  }

  handleTipoChange(event, index, value) {
    this.setState(update(this.state, {
      tipo: {$set: value},
      infoText: {$set: infos[2]}
    }))
  }

  handleFamiliaChange(event, index, value) {
    let tipo = "";
    let info = 1;
    const allowedTipos = this.props.tipos.filter(tipo =>
      tipo.Familias_id_familia === value
    );
    if(allowedTipos.length === 1) {
      info = 2;
      tipo = allowedTipos[0].id_tipo;
    }
    this.setState(update(this.state, {
      familia: {$set: value},
      tipo: {$set: tipo},
      tipoDisabled: {$set: false},
      infoText: {$set: infos[info]},
      allowedTipos: {$set: allowedTipos }
    }))
  }

  handleFormSubmit(event) {
    this.props.insertEquips(this.state.patrimonios, this.state.tipo)
  }

  componentDidMount() {
    if(this.props.familias.length === 0)
    {
      this.props.getFamilias();
      this.props.getTipos();
    }
  }

  findEquipIndex(name, patrimonios) {
    return patrimonios.findIndex(patrimonio =>
      name == patrimonio.name
    )
  }

  render () {
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
          {this.state.infoText}
        </div>
        <form onSubmit=
          {
            e => {
              e.preventDefault()
              console.log("Submit")
            }
          }
        >
          <SelectField
            style={style}
            floatingLabelText="Familia"
            value={this.state.familia}
            onChange={this.handleFamiliaChange}
            disabled={this.props.inputDisabled}
            errorText={(this.props.isMissingFamilia && this.state.familia === "") ?
              "Campo Família não pode ser deixado em branco" : ""}
            floatingLabelStyle={{color: 'grey'}}
          >
            {this.props.familias.map((familia) => (
              <MenuItem key={familia.id_familia} value={familia.id_familia} primaryText={familia.familia} />
            ))}
          </SelectField>
          &nbsp;
          <SelectField
            style={style}
            floatingLabelText="Tipo"
            value={this.state.tipo}
            onChange={this.handleTipoChange}
            disabled={this.state.tipoDisabled || this.props.isInputDisabled}
            errorText={(this.props.isMissingTipo && this.state.tipo === "") ?
              "Campo Tipo não pode ser deixado em branco" : ""}
            floatingLabelStyle={{color: 'grey'}}
          >
            {this.state.allowedTipos.map((tipo) => (
              <MenuItem key={tipo.id_tipo} value={tipo.id_tipo} primaryText={tipo.tipo} />
            ))}
          </SelectField>
          <br/>
          {this.state.patrimonios.map((patrimonio) => (
            <div key={patrimonio.index}>
              <TextField
                autoFocus
                name={"equip"+patrimonio.index}
                hintText="Patrimônio do Equipamento"
                floatingLabelText="Equipamento"
                value={patrimonio.value}
                onChange={this.handleTextFieldChange}
                onKeyPress={this.handleKeyPress}
                errorText={patrimonio.errorText}
                floatingLabelStyle={{color: 'grey'}}
              />
              <FloatingActionButton
                mini={true}
                type="button"
                name={"equip"+patrimonio.index}
                backgroundColor="#ff0000"
                onTouchTap={this.handleRemoveEquipment}
                zDepth={1}
                style={style}
              >
                <ActionDelete />
              </FloatingActionButton>
              <br/>
            </div>
          ))}
          <br/>
          <RaisedButton
            name="add"
            type="button"
            style={style}
            label="Adicionar"
            primary={true}
            onTouchTap={this.handleNewEquipment}
          />
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
    );
  }
}

AddEquip.propTypes = {
  insertEquips: PropTypes.func.isRequired,
  getTipos: PropTypes.func.isRequired,
  getFamilias: PropTypes.func.isRequired,
  clearSubmissionMessage: PropTypes.func.isRequired,
  clearEquipNumberError: PropTypes.func.isRequired,
  clearMissingFieldsError: PropTypes.func.isRequired,
  isInputDisabled: PropTypes.bool.isRequired,
  tipos: PropTypes.array.isRequired,
  familias: PropTypes.array.isRequired,
  isDataSubmitted: PropTypes.bool.isRequired,
  isMissingTipo: PropTypes.bool.isRequired,
  isMissingFamilia: PropTypes.bool.isRequired,
  submissionMessage: PropTypes.string.isRequired,
  errorCauseEquipNumber: PropTypes.string.isRequired,
  errorCode: PropTypes.string.isRequired
};
