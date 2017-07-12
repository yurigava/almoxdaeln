import React, { PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import update from 'immutability-helper';
import EquipTypeSelectorContainer from '../containers/equipTypeSelectorContainer.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';

const style = {
  verticalAlign: 'bottom',
  margin: 5,
};

const style_inline = {
  display: "inline-block"
};

const infos = [
  'Selecione o dia para reservar os Equipamentos',
  'Selecione o horário para reservar os Equipamentos',
  'Selecione uma Família de Equipamentos',
  'Selecione um Tipo de Equipamento',
  'Digite a quantidade de Equipamento(os) a ser(em) reservado(os)'
];

export default class AddReserve extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      patrimonios: [
        {index: 0, name: "equip0", value: "", errorText: ""}
      ],
      timeReserve: null,
      dateReserve: null,
      indexInfoText: 0
    }
    this.props.clearMissingFieldsError();
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleNewEquipment = this.handleNewEquipment.bind(this);
    this.handleRemoveEquipment = this.handleRemoveEquipment.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
  }

  handleChangeDate(event, date, value) {    
    let NewDate = date;
    //alert(NewDate.getDate() + '/' + NewDate.getMonth() + '/' + NewDate.getFullYear());
    this.setState(update(this.state, {
      dateReserve: { $set: NewDate }
      }
    ));
    let NewIndexInfoText;
    if(value !== 1) {
      NewIndexInfoText = this.props.infoText + 1;
    }
    else {
      NewIndexInfoText = this.props.infoText - 1;
    }
    this.setState(update(this.state, {
      indexInfoText: { $set: NewIndexInfoText }
      }
    ));
  }

  handleChangeTime(event, time, value) {    
    let NewTime = time;
    this.setState(update(this.state, {
      timeReserve: { $set: NewTime }
      }
    ));
    let NewIndexInfoText;
    if(value !== 1) {
      NewIndexInfoText = this.props.infoText + 1;
    }
    else {
      NewIndexInfoText = this.props.infoText - 1;
    }
    this.setState(update(this.state, {
      indexInfoText: { $set: NewIndexInfoText }
      }
    ));
  }

  handleCloseDialog() {
    if(this.props.isDataSubmitted) {
      this.props.setSelectedTipo(null);
      this.props.setSelectedFamilia(null);
      this.props.setInfoText(0);
      this.props.clearMissingFieldsError();
      this.state = {
        patrimonios: [
          {index: 0, name: "equip0", value: "", errorText: ""}
        ]
      }
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
    const value = event.currentTarget.value;
    const index = this.findEquipIndex(event.currentTarget.name, this.state.patrimonios);
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
    const index = this.findEquipIndex(event.currentTarget.name, this.state.patrimonios);
    this.setState(update(this.state, {
      patrimonios: {
        $splice: [[index, 1]]
      }
    }));
  }

  handleFormSubmit(event) {
    this.props.insertEquips(this.state.patrimonios, this.props.tipo, this.state.dateReserve);
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
    //const infoText = infos[this.props.infoText];
    const infoText = infos[this.state.indexInfoText];
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
              console.log("Submit")
            }
          }
        >
          <DatePicker
            hintText="Selecione a data da Reserva"
            value={this.state.dateReserve}
            onChange={this.handleChangeDate}
            autoOk={true}
            style={style_inline}
          />
          &nbsp;
          <TimePicker
            format="24hr"
            hintText="Selecione o horário da Reserva"
            value={this.state.timeReserve}
            onChange={this.handleChangeTime}
            autoOk={true}
            style={style_inline}
          />
          <EquipTypeSelectorContainer
            tipo={this.props.tipo}
            familia={this.props.familia}
            setSelectedTipo={this.props.setSelectedTipo}
            setSelectedFamilia={this.props.setSelectedFamilia}
            setInfoText={this.props.setInfoText}
            isMissingTipo={this.props.isMissingTipo}
            isMissingFamilia={this.props.isMissingFamilia}
            isInputDisabled={this.props.isInputDisabled}
            style={style_inline}
          />
          &nbsp;
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
                style={style_inline}
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

AddReserve.propTypes = {
  insertEquips: PropTypes.func.isRequired,
  clearSubmissionMessage: PropTypes.func.isRequired,
  clearEquipNumberError: PropTypes.func.isRequired,
  clearMissingFieldsError: PropTypes.func.isRequired,
  setSelectedTipo: PropTypes.func.isRequired,
  setSelectedFamilia: PropTypes.func.isRequired,
  setInfoText: PropTypes.func.isRequired,
  isInputDisabled: PropTypes.bool.isRequired,
  tipo: PropTypes.number,
  familia: PropTypes.number,
  isMissingTipo: PropTypes.bool.isRequired,
  isMissingFamilia: PropTypes.bool.isRequired,
  isDataSubmitted: PropTypes.bool.isRequired,
  submissionMessage: PropTypes.string.isRequired,
  errorCauseEquipNumber: PropTypes.string.isRequired,
  errorCode: PropTypes.string.isRequired,
  infoText: PropTypes.number.isRequired,
};
