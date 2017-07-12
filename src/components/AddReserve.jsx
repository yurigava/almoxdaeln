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

let DateTimeFormat;

const style = {
  verticalAlign: 'bottom',
  margin: 5,
};

const style_inline = {
  display: "inline-block",  
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
        {index: 0, name: "equip0", value: "", errorText: "", familia: 0, tipo: 0, quantidade: "", isMissingTipo: true, isMissingFamilia: true, isInputDisabled: false}
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
    this.handleChangeTime = this.handleChangeTime.bind(this);
  }

  formatDate(date){
    return (("0" + date.getDate()).slice(-2) + '/' + ("0" + (date.getMonth()+1)).slice(-2) + '/' + date.getFullYear());    
  }

  handleChangeDate(event, date, value) {    
    this.setState(update(this.state, {
      dateReserve: { $set: date }
      }
    ));
    let NewIndexInfoText = this.props.infoText;
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

  handleChangeTime(event, date, value) {        
    this.setState(update(this.state, {
      timeReserve: { $set: date }
      }
    ));
    let NewIndexInfoText = this.state.indexInfoText;
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
      this.props.setSelectedTipo("", null);
      this.props.setSelectedFamilia("", null);
      this.props.setInfoText(0);
      this.props.clearMissingFieldsError();
      this.state = {
        patrimonios: [
          {index: 0, name: "equip0", value: "", errorText: "", familia: 0, tipo: 0, quantidade: "", isMissingTipo: true, isMissingFamilia: true, isInputDisabled: false}
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
    let hasEmptyFields = false;
    let newState = this.state;
    for (var i = 0; i < this.state.patrimonios.length; i++) {
      if(this.state.patrimonios[i].value === "") {
        hasEmptyFields = true;
        newState = update(newState, {
          patrimonios: { [i]: { errorText: {
               $set: "Preencha este campo antes de criar um novo"
          }}}
        });
      }
    }
    if(hasEmptyFields)
    {
      this.setState(newState);
      return;
    }
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
    let sendDateReserve = this.state.dateReserve;
    let sendTimeReserve = this.state.timeReserve;
    this.state.timeReserve.setSeconds(0);
    let timeStamp = new Date();
    sendDateReserve = (("0" + sendDateReserve.getDate()).slice(-2) + '/' + ("0" + (sendDateReserve.getMonth()+1)).slice(-2) + '/' + sendDateReserve.getFullYear());
    sendTimeReserve = (("0" + sendTimeReserve.getHours()).slice(-2) + ':' + ("0" + sendTimeReserve.getMinutes()).slice(-2) + ':' + ("0" + sendTimeReserve.getSeconds()).slice(-2) );
    let dateTimeReserve = (sendDateReserve + ' ' + sendTimeReserve);
        
    alert('reserva: ' + dateTimeReserve);
    alert('atual: ' + timeStamp.toLocaleString());
    this.props.insertEquips(this.state.patrimonios, this.props.tipo, dateTimeReserve);
  }

  funcSetSelectedFamilia(event, familia) {
    const value = event.currentTarget.familia;
    const index = this.findEquipIndex(event.currentTarget.name, this.state.patrimonios);
    const newValue = "";
    let newErrorText = this.state.patrimonios[index].errorText;
    if(newValue != this.state.patrimonios[index].familia)
      newErrorText = "";
    this.setState(update(this.state, {
      patrimonios: {
        [index]: {
          familia: { $set: newValue },
          errorText: { $set: newErrorText }
        }
      }
    }));
    //setSelectedFamilia={this.state.patrimonios}
  }

  funcSetSelectedTipo(event, tipo) {
    const value = event.currentTarget.tipo;
    const index = this.findEquipIndex(event.currentTarget.name, this.state.patrimonios);
    const newValue = "";
    let newErrorText = this.state.patrimonios[index].errorText;
    if(newValue != this.state.patrimonios[index].tipo)
      newErrorText = "";
    this.setState(update(this.state, {
      patrimonios: {
        [index]: {
          tipo: { $set: newValue },
          errorText: { $set: newErrorText }
        }
      }
    }));
    //setSelectedFamilia={this.state.patrimonios}
  }

  funcSetInfoText(event) {
    alert(event.currentTarget.value);
    const value = event.currentTarget.value;
    const index = this.findEquipIndex(event.currentTarget.name, this.state.patrimonios);
    const newValue = "";
    let newErrorText = this.state.patrimonios[index].errorText;
    if(newValue != this.state.patrimonios[index].value)
      newErrorText = "";
    this.setState(update(this.state, {
      patrimonios: {
        [index]: {
          tipo: { $set: newValue },
          errorText: { $set: newErrorText }
        }
      }
    }));
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
            formatDate={this.formatDate}
            style={style_inline}
            inputStyle={{ textAlign: 'center' }}
          />
          &nbsp;
          <TimePicker
            format="24hr"
            hintText="Selecione o horário da Reserva"
            value={this.state.timeReserve}
            onChange={this.handleChangeTime}
            autoOk={true}
            style={style_inline}
            inputStyle={{ textAlign: 'center' }}
          />
          {this.state.patrimonios.map((patrimonio) => (
            <div key={patrimonio.index}>
            <EquipTypeSelectorContainer
              name={"equip"+patrimonio.index}
              //tipo={this.props.tipo}
              //familia={this.props.familia}
              //setSelectedTipo={this.props.setSelectedTipo}
              //setSelectedFamilia={this.props.setSelectedFamilia}
              //setInfoText={this.props.setInfoText}
              //isMissingTipo={this.props.isMissingTipo}
              //isMissingFamilia={this.props.isMissingFamilia}
              //isInputDisabled={this.props.isInputDisabled}

              tipo={patrimonio.tipo}
              familia={patrimonio.familia}
              setSelectedFamilia={this.funcSetSelectedFamilia}
              setSelectedTipo={this.funcSetSelectedTipo}
              //setInfoText={this.funcSetInfoText}
              setInfoText={this.props.setInfoText}
              isMissingTipo={patrimonio.isMissingTipo}
              isMissingFamilia={patrimonio.isMissingFamilia}
              isInputDisabled={patrimonio.isInputDisabled}
              style={style_inline}
            />
            &nbsp;
              <TextField
                autoFocus
                name={"equip"+patrimonio.index}
                hintText="Patrimônio do Equipamento"
                floatingLabelText={"Equipamento "+patrimonio.index}
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
