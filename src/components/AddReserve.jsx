import React, { PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import update from 'immutability-helper';
import EquipTypeSelectorContainer from '../containers/EquipTypeSelectorContainer.jsx';
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

const style_equip = {
  verticalAlign: 'bottom', 
};

const style_inline = {
  display: "inline-block",
  //width: '8%',
  //margin: '0 ',
  //border: 'solid #FF9800',
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
      equipReservados: [
        {index: 0, name: "equip0", value: "", errorText: "", familia: 0, tipo: 0, isMissingTipo: true, isMissingFamilia: true, isInputDisabled: false}
      ],
      timeReserve: "",
      dateReserve: "",
      indexinfoNumber: 0
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
    this.funcSetSelectedFamilia = this.funcSetSelectedFamilia.bind(this);
    this.funcSetSelectedTipo = this.funcSetSelectedTipo.bind(this);
    this.funcSetInfoNumber = this.funcSetInfoNumber.bind(this);
    this.formatDate = this.formatDate.bind(this);
  }

  formatDate(date){    
    return (("0" + date.getDate()).slice(-2) + '/' + ("0" + (date.getMonth()+1)).slice(-2) + '/' + date.getFullYear());    
  }

  handleChangeDate(event, date) {    
    this.setState(update(this.state, {
      dateReserve: { $set: date }
      }
    ));
    //alert(this.state.dateReserve);
    let NewIndexinfoNumber = this.state.indexinfoNumber + 1;
    this.setState(update(this.state, {
      indexinfoNumber: { $set: NewIndexinfoNumber }
      }
    ));
  }

  handleChangeTime(event, date) { 
    this.setState(update(this.state, {
      timeReserve: { $set: date }
      }
    ));
    //alert(this.state.timeReserve);
    let NewIndexinfoNumber = this.state.indexinfoNumber + 1;
    this.setState(update(this.state, {
      indexinfoNumber: { $set: NewIndexinfoNumber }
    }
    ));
  }

  handleCloseDialog() {
    if(this.props.isDataSubmitted) {
      this.props.setSelectedTipo("", null);
      this.props.setSelectedFamilia("", null);
      this.props.setinfoNumber(0);
      this.props.clearMissingFieldsError();
      this.state = {
        equipReservados: [
          {index: "", name: "equip0", value: "", errorText: "", familia: "", tipo: "", isMissingTipo: true, isMissingFamilia: true, isInputDisabled: false}
        ]
      }
    }
    else if(this.props.errorCauseEquipNumber !== "") {
      let message = "";
      if(this.props.errorCode === "ER_WARN_DATA_OUT_OF_RANGE")
        message = "Código Excedeu o limite de tamanho";
      else if(this.props.errorCode === "ER_DUP_ENTRY")
        message = "Equipamento já registrado";
      const index = this.state.equipReservados.findIndex(equipReservado =>
        this.props.errorCauseEquipNumber == equipReservado.value
      );
      this.setState(update(this.state, {
        equipReservados: {
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
    const index = this.findEquipIndex(event.currentTarget.name, this.state.equipReservados);
    const newValue = (value.match("[0-9]+") || []).pop() || '';
    let newErrorText = this.state.equipReservados[index].errorText;
    if(newValue != this.state.equipReservados[index].value)
      newErrorText = "";
    this.setState(update(this.state, {
      equipReservados: {
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
    for (var i = 0; i < this.state.equipReservados.length; i++) {
      if(this.state.equipReservados[i].value === "") {
        hasEmptyFields = true;
        newState = update(newState, {
          equipReservados: { [i]: { errorText: {
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
    const equipReservados = this.state.equipReservados
    let nextIndex = 0
    if(equipReservados.length > 0)
      nextIndex = equipReservados[equipReservados.length-1].index+1
    this.setState(update(this.state, {
      equipReservados: {
        $push: [
          {
            index: nextIndex,
            name: "equip"+nextIndex,
            value: "",
            errorText: "",
            isMissingFamilia: true,
            isMissingTipo: true,
            isInputDisabled: false,
          }
        ]
      }
    }));
  }

  handleRemoveEquipment(event) {
    const index = this.findEquipIndex(event.currentTarget.name, this.state.equipReservados);
    this.setState(update(this.state, {
      equipReservados: {
        $splice: [[index, 1]]
      }
    }));
  }

  handleFormSubmit(event) {
    let sendDateReserve = this.state.dateReserve;
    let sendTimeReserve = this.state.timeReserve;
    this.state.timeReserve.setSeconds(0);
    //sendDateReserve = (("0" + sendDateReserve.getDate()).slice(-2) + '-' + ("0" + (sendDateReserve.getMonth()+1)).slice(-2) + '-' + sendDateReserve.getFullYear());
    sendDateReserve = (sendDateReserve.getFullYear() + '-' + ("0" + (sendDateReserve.getMonth()+1)).slice(-2) + '-' + ("0" + sendDateReserve.getDate()).slice(-2));
    sendTimeReserve = (("0" + sendTimeReserve.getHours()).slice(-2) + ':' + ("0" + sendTimeReserve.getMinutes()).slice(-2) + ':' + ("0" + sendTimeReserve.getSeconds()).slice(-2));
    let dateTimeReserve = (sendDateReserve + ' ' + sendTimeReserve);
        
    //alert('reserva: ' + dateTimeReserve);
    //let equipReservados = this.state.equipReservados.filter(pat => pat.value !== "").map(pat => Number(pat.value));
    let quantidade = this.state.equipReservados.filter(pat => pat.value !== "").map(pat => Number(pat.value));
    let familia = this.state.equipReservados.filter(pat => pat.familia !== "").map(pat => Number(pat.familia));
    let tipo = this.state.equipReservados.filter(pat => pat.tipo !== "").map(pat => Number(pat.tipo));

    let aux = [];
    aux = this.state.equipReservados.filter(pat => pat.value !== "" & pat.familia !== "").map( pat => [ pat.familia, pat.tipo, pat.value ] );

    alert(aux);
    this.props.insertReserve(quantidade, dateTimeReserve, familia);
  }

  funcSetSelectedFamilia(name, familia) {
    const index = this.findEquipIndex(name, this.state.equipReservados);
    const newValue = familia;
    let newErrorText = this.state.equipReservados[index].errorText;
    if(newValue != this.state.equipReservados[index].familia)
      newErrorText = "";
    this.setState(update(this.state, {
      equipReservados: {
        [index]: {
          familia: { $set: newValue },
          errorText: { $set: newErrorText },
          isMissingFamilia: { $set: false }
        }
      }
    })); 
  }

  funcSetSelectedTipo(name, tipo) {
    const index = this.findEquipIndex(name, this.state.equipReservados);
    const newValue = tipo;
    let newErrorText = this.state.equipReservados[index].errorText;
    if(newValue != this.state.equipReservados[index].tipo)
      newErrorText = "";
    this.setState(update(this.state, {
      equipReservados: {
        [index]: {
          tipo: { $set: newValue },
          errorText: { $set: newErrorText },
          isMissingTipo: { $set: false }
        }
      }
    })); 
  }

  funcSetInfoNumber(infoNumber) {
    let NewIndexinfoNumber = this.state.indexinfoNumber + infoNumber;
    //alert(NewIndexinfoNumber);
    this.setState(update(this.state, {
      indexinfoNumber: { $set: NewIndexinfoNumber }
      }
    ));
    //alert(this.state.indexinfoNumber);
  }

  findEquipIndex(name, equipReservados) {
    return equipReservados.findIndex(equipReservado =>
      name == equipReservado.name
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
    
    const Text_info = infos[this.state.indexinfoNumber];

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
          {Text_info}
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
          <br/>
          {this.state.equipReservados.map((equipReservado) => (
            <div key={equipReservado.index}>
            <EquipTypeSelectorContainer
              name={"equip"+equipReservado.index}
              tipo={equipReservado.tipo}
              familia={equipReservado.familia}
              setSelectedFamilia={this.funcSetSelectedFamilia}
              setSelectedTipo={this.funcSetSelectedTipo}
              setInfoNumber={this.funcSetInfoNumber}
              isMissingTipo={equipReservado.isMissingTipo}
              isMissingFamilia={equipReservado.isMissingFamilia}
              isInputDisabled={equipReservado.isInputDisabled}
            />
            &nbsp;
              <TextField
                autoFocus
                name={"equip"+equipReservado.index}
                hintText="Patrimônio do Equipamento"
                floatingLabelText={"Equipamento "+equipReservado.index}
                value={equipReservado.value}
                onChange={this.handleTextFieldChange}
                onKeyPress={this.handleKeyPress}
                errorText={equipReservado.errorText}
                floatingLabelStyle={{color: 'grey'}}
                style={style_inline}
              />
              <FloatingActionButton
                mini={true}
                type="button"
                name={"equip"+equipReservado.index}
                backgroundColor="#ff0000"
                onTouchTap={this.handleRemoveEquipment}
                zDepth={1}
                style={style_inline}
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
  insertReserve: PropTypes.func.isRequired,
  clearSubmissionMessage: PropTypes.func.isRequired,
  clearEquipNumberError: PropTypes.func.isRequired,
  clearMissingFieldsError: PropTypes.func.isRequired,
  setSelectedTipo: PropTypes.func.isRequired,
  setSelectedFamilia: PropTypes.func.isRequired,
  setInfoNumber: PropTypes.func,
  isInputDisabled: PropTypes.bool.isRequired,
  tipo: PropTypes.number,
  familia: PropTypes.number,
  isMissingTipo: PropTypes.bool.isRequired,
  isMissingFamilia: PropTypes.bool.isRequired,
  isDataSubmitted: PropTypes.bool.isRequired,
  submissionMessage: PropTypes.string.isRequired,
  errorCauseEquipNumber: PropTypes.string.isRequired,
  errorCode: PropTypes.string.isRequired,
  infoNumber: PropTypes.number.isRequired,
};
