import React, { PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
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

export default class AddEquip extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      patrimonios: [
        {index: 0, name: "equip0", value: "", errorText: ""}
      ],
      familia: "",
      tipo: "",
      allowedTipos: [],
      tipoDisabled: true,
      infoText: infos[0]
    };
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleFamiliaChange = this.handleFamiliaChange.bind(this);
    this.handleTipoChange = this.handleTipoChange.bind(this);
    this.handleNewEquipment = this.handleNewEquipment.bind(this);
    this.handleRemoveEquipment = this.handleRemoveEquipment.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
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
          value: {
            $set: newValue
          },
          errorText: {
            $set: newErrorText
          }
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
    return (
      <div>
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
  isInputDisabled: PropTypes.bool.isRequired,
  tipos: PropTypes.array.isRequired,
  familias: PropTypes.array.isRequired,
  insertEquips: PropTypes.func.isRequired,
  getTipos: PropTypes.func.isRequired,
  getFamilias: PropTypes.func.isRequired
};
