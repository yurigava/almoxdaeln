import React, { PropTypes } from 'react';
import axios from 'axios';
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

let DateTimeFormat;

const style = {
  verticalAlign: 'bottom',
  margin: 5,
  display: "inline-block",
};

const style_equip = {
  verticalAlign: 'bottom',
};

const style_inline = {
  display: "inline-block",
  width: '15%',
  //margin: '0 ',
  //border: 'solid #FF9800',
};

const infos = [
  'Selecione o dia para reservar os Equipamentos',
  'Selecione o horário para reservar os Equipamentos',
  'Digite a matéria em que será usada os Equipamentos',
  'Selecione uma Família de Equipamentos',
  'Selecione um Tipo de Equipamento',
  'Digite a quantidade de Equipamento(os) a ser(em) reservado(os)'
];

const TurnoReserve = [
  'Manhã',
  'Tarde',
  'Noite'
];

export default class AddReserve extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      equipReservados: [
        {index: 0, name: "equip0", value: "", errorText: "", familia: null, tipo: null, isMissingTipo: false, isMissingFamilia: false, isInputDisabled: false, maxQuantidade: 0}
      ],
      timeReserve: "",
      dateReserve: "",
      materia: "",
      indexinfoNumber: 0,
      error: ""
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
    this.handleChangeMateria = this.handleChangeMateria.bind(this);
    this.handleKeyPressMateria = this.handleKeyPressMateria.bind(this);
    this.funcSetSelectedFamilia = this.funcSetSelectedFamilia.bind(this);
    this.funcSetSelectedTipo = this.funcSetSelectedTipo.bind(this);
    this.funcSetInfoNumber = this.funcSetInfoNumber.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.handleChangeQuantidade = this.handleChangeQuantidade.bind(this);
  }

  formatDate(date) {
    return (("0" + date.getDate()).slice(-2) + '/' + ("0" + (date.getMonth()+1)).slice(-2) + '/' + date.getFullYear());
  }

  handleChangeDate(event, date) {
    if(this.state.dateReserve !== date && this.state.dateReserve !== "") {
      this.state = {
        timeReserve: this.state.timeReserve,
        materia: this.state.materia,
        equipReservados: [
          {index: 0, name: "equip0", value: "", errorText: "", familia: null, tipo: null, isMissingTipo: false, isMissingFamilia: false, isInputDisabled: false, maxQuantidade: 0}
        ]
      }
      this.props.setError("Equipamentos Resetados devido troca da data.");
    }

    this.setState(update(this.state, {
      dateReserve: { $set: date }
      }
    ));

    let NewIndexinfoNumber = this.state.indexinfoNumber + 1;
    this.setState(update(this.state, {
      indexinfoNumber: { $set: NewIndexinfoNumber }
      }
    ));
  }

  handleChangeTime(event, value) {
    if(this.state.timeReserve !== value && this.state.timeReserve !== "") {
      this.state = {
        dateReserve: this.state.dateReserve,
        materia: this.state.materia,
        equipReservados: [
          {index: 0, name: "equip0", value: "", errorText: "", familia: null, tipo: null, isMissingTipo: false, isMissingFamilia: false, isInputDisabled: false, maxQuantidade: 0}
        ]
      }
      this.props.setError("Equipamentos Resetados devido troca do turno.");
    }
    
    this.setState(update(this.state, {
      timeReserve: { $set: value }
      }
    ));
    //let NewIndexinfoNumber = this.state.indexinfoNumber + 1;
    //this.setState(update(this.state, {
    //  indexinfoNumber: { $set: NewIndexinfoNumber }
    //}
    //));
  }

  handleChangeMateria(event) {
    this.setState(update(this.state, {
      materia: { $set: event.target.value }
      }
    ));
  }

  handleKeyPressMateria(event) {
    if(event.key === 'Enter' || event.key === 'TABKEY' ) {
      let NewIndexinfoNumber = this.state.indexinfoNumber + 1;
      this.setState(update(this.state, {
        indexinfoNumber: { $set: NewIndexinfoNumber }
      }));
    }
  }

  handleChangeQuantidade(name, event, key, payload) {
    console.log("name: " + name);
    console.log("key: " + key);
    const index = this.findEquipIndex(name, this.state.equipReservados);
    const newValue = key+1;
    console.log("index: " + index + " key: " + key);
    this.setState(update(this.state, {
      equipReservados: {
        [index]: {
          value: { $set: newValue }
        }
      }
    }));
  }

  componentWillReceiveProps(nextProps) {
    //console.log("atual: "+ this.props.quantidade +" nova: "+ nextProps.quantidade);
    if(nextProps.quantidade !== this.props.quantidade) {
      console.log( "props: " + this.props.name + " next: " + nextProps.name + " message: " + nextProps.submissionMessage)
      let index = this.findEquipIndex(nextProps.name, this.state.equipReservados);
      this.setState(update(this.state, {
        equipReservados: {
          [index]: {
            maxQuantidade: { $set: nextProps.quantidade }
          }
        }
      }));
    }
  }

  handleCloseDialog() {
    if(this.props.isDataSubmitted) {
      this.props.setSelectedTipo("", null);
      this.props.setSelectedFamilia("", null);
      this.props.clearMissingFieldsError();
      this.state = {
        materia: "",
        dateReserve: "",
        timeReserve: "",
        equipReservados: [
          {index: 0, name: "equip0", value: "", errorText: "", familia: null, tipo: null, isMissingTipo: false, isMissingFamilia: false, isInputDisabled: false, maxQuantidade: 0}
        ]
      }
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
      if(this.state.equipReservados[i].familia === "") {
        hasEmptyFields = true;
        newState = update(newState, {
          equipReservados: { [i]: {
            isMissingFamilia: { $set: true }
          }}
        });
      }
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
            maxQuantidade: 0,
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
    if(this.state.dateReserve === null || this.state.dateReserve === undefined || this.state.dateReserve === "" ) {
      this.props.setError("Por favor, insira data da reserva.");
      return;
    }
    if(this.state.timeReserve === null || this.state.timeReserve === undefined || this.state.timeReserve === "" ) {
      this.props.setError("Por favor, insira o turno da reserva.");
      return;
    }

    if(this.state.equipReservados[0].familia === "" || this.state.equipReservados[0].value === 0 || this.state.equipReservados[0].value === "" || this.state.equipReservados[0].value === null || Number(this.state.equipReservados.length) < 1) {
      this.props.setError("Por favor, insira ao menos uma familia e sua quantidade.");
      this.setState(update(this.state, {
        equipReservados: {
          [0]: {
            isMissingFamilia: { $set: true },
            isMissingTipo: { $set: true }
          }
        }
      }));
      return;
    }

    //if(this.state.equipReservados.length) {
      for(var i=1; i<this.state.equipReservados.length; i++) {
        console.log("i: " + i);
        if((this.state.equipReservados[i].familia !== "" || this.state.equipReservados[i].familia !== undefined) && (this.state.equipReservados[i].value === "")) {
          this.props.setError("Por favor, insira a quantidade faltante do equipamento.");
          return;
        }
      }
    //}

    for(var i = 0; i < this.state.equipReservados.length; i++) {
      console.log("i " + i);
      for(var j = 1 + i; j < this.state.equipReservados.length; j++) {
        console.log("j " + j);
        if(this.state.equipReservados[i].familia === this.state.equipReservados[j].familia && (this.state.equipReservados[i].tipo === null || this.state.equipReservados[i].tipo === undefined) && (this.state.equipReservados[j].tipo == null || this.state.equipReservados[i].tipo === undefined)) {
          this.props.setError("Familia de equipamento duplicado.");
          this.setState(update(this.state, {
            equipReservados: {
              [j]: {
                familia: { $set: null },
                value: { $set: "" },
                maxQuantidade: { $set: "" }
              }
            }
          }));
          return;
        }
      }
    }

    let sendDateReserve = this.state.dateReserve;
    sendDateReserve = (sendDateReserve.getFullYear() + '-' + ("0" + (sendDateReserve.getMonth()+1)).slice(-2) + '-' + ("0" + sendDateReserve.getDate()).slice(-2));

    var equips = [];
      this.state.equipReservados.forEach( pat => {
        equips.push({
          familia: pat.familia,
          tipo: pat.tipo,
          quantidade: pat.value
        });
      });
    equips.forEach( pat => {
      console.log("familia " + pat.familia + " tipo " + pat.tipo + " quantidade " + pat.quantidade);
    });

    this.props.insertReserve(this.props.usuario, sendDateReserve, this.state.timeReserve, this.state.materia, equips);
  }

  funcSetSelectedFamilia(name, familia) {
    const index = this.findEquipIndex(name, this.state.equipReservados);
    const newValue = familia;
    let newErrorText = this.state.equipReservados[index].errorText;
    if(newValue != this.state.equipReservados[index].familia) {
      newErrorText = "";
      this.setState(update(this.state, {
        equipReservados: {
          [index]: {
            tipo: { $set: "" }
          }
        }
      }));
    }
    this.setState(update(this.state, {
      equipReservados: {
        [index]: {
          familia: { $set: newValue },
          errorText: { $set: newErrorText },
          isMissingFamilia: { $set: false },
        }
      }
    }));

    if(this.state.dateReserve === null || this.state.dateReserve === undefined || this.state.dateReserve === "" ) {
      this.props.setError("Por favor, insira data da reserva.");
      return;
    }
    if(this.state.timeReserve === null || this.state.timeReserve === undefined || this.state.timeReserve === "" ) {
      this.props.setError("Por favor, insira o turno da reserva.");
      return;
    }

    let sendDateReserve = this.state.dateReserve;
    sendDateReserve = (sendDateReserve.getFullYear() + '-' + ("0" + (sendDateReserve.getMonth()+1)).slice(-2) + '-' + ("0" + sendDateReserve.getDate()).slice(-2));

    console.log(this.state.equipReservados[index].tipo);
    this.props.quantidadeReserve(newValue, null, name, sendDateReserve, this.state.timeReserve);
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

    for(var i = 0; i < this.state.equipReservados.length; i++) {
      //&& tipo !== ""
      //alert("this.state.equipReservados[i].tipo: " + this.state.equipReservados[i].tipo + " tipo: " + tipo);
      if(this.state.equipReservados[i].tipo === tipo && tipo !== null) {
        this.props.setError("Tipo de equipamento duplicado.");
        this.setState(update(this.state, {
          equipReservados: {
            [index]: {
              tipo: { $set: null }
            }
          }
        }));
        return;
      }
    }

    if(this.state.dateReserve === null || this.state.dateReserve === undefined || this.state.dateReserve === "" ) {
      this.props.setError("Por favor, insira data da reserva.");
      return;
    }
    if(this.state.timeReserve === null || this.state.timeReserve === undefined || this.state.timeReserve === "" ) {
      this.props.setError("Por favor, insira o turno da reserva.");
      return;
    }

    let sendDateReserve = this.state.dateReserve;
    sendDateReserve = (sendDateReserve.getFullYear() + '-' + ("0" + (sendDateReserve.getMonth()+1)).slice(-2) + '-' + ("0" + sendDateReserve.getDate()).slice(-2));

    if(tipo === null) {
      //this.props.quantidadeReserve(this.state.equipReservados[index].familia, null, name);
    }
    else{
      this.props.quantidadeReserve(this.state.equipReservados[index].familia, newValue, name, sendDateReserve, this.state.timeReserve);
    }
  }

  funcSetInfoNumber(infoNumber) {
    //alert(this.state.indexinfoNumber +" , "+ infoNumber);
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
            value={this.state.dateReserve !== '' ? this.state.dateReserve : null}
            onChange={this.handleChangeDate}
            autoOk={true}
            formatDate={this.formatDate}
            minDate={new Date()}
            style={style}
            inputStyle={{ textAlign: 'center' }}
          />
          &nbsp;

          <SelectField
            style={style}
            floatingLabelText="Turno"
            value={TurnoReserve[this.state.timeReserve]}
            onChange={this.handleChangeTime}
            //disabled={this.props.isInputDisabled}
            autoWidth={true}
            //errorText={(this.state.isMissingFamilia && this.state.familia === null) ?
            //  "Campo Família não pode ser deixado em branco" : ""}
            floatingLabelStyle={{color: 'grey', left: '0px'}}
          >
            {TurnoReserve.map((hora) => (
              <MenuItem 
                key={hora} 
                value={hora} 
                primaryText={hora} 
              />
            ))}
          </SelectField>

          &nbsp;
          <TextField
            hintText={"Matéria"}
            floatingLabelText={"Digite a matéria do aula"}
            value={this.state.materia}
            onChange={this.handleChangeMateria}
            //errorText={equipReservado.errorText}
            onKeyPress={this.handleKeyPressMateria}
            //floatingLabelStyle={{color: 'grey'}}
            style={style}
            inputStyle={{ textAlign: 'center' }}
          />
          &nbsp;
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
              <SelectField
                floatingLabelText="Quantidade"
                value={equipReservado.value}
                onChange={this.handleChangeQuantidade.bind(null,"equip"+equipReservado.index)}
                //disabled={this.props.isInputDisabled}
                //autoWidth={true}
                errorText={(equipReservado.value === null) ?
                  "Campo Quantidade não pode ser deixado em branco" : equipReservado.errorText}
                floatingLabelStyle={{color: 'grey'}}
                style={style_inline}
              >
                {[...Array(equipReservado.maxQuantidade)].map((x, i) => (
                  <MenuItem
                    key={i === null || i === undefined || i >= 0 ? i+1 : 0}
                    value={i === null || i === undefined || i >= 0 ? i+1 : 0}
                    primaryText={i === null || i === undefined || i >= 0 ? i+1 : 0}
                  />
                ))}
              </SelectField>
              <FloatingActionButton
                mini={true}
                type="button"
                name={"equip"+equipReservado.index}
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
  setError: PropTypes.func.isRequired,
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
  isMissingDateTime: PropTypes.bool.isRequired,
  isMissingTipo: PropTypes.bool.isRequired,
  isMissingFamilia: PropTypes.bool.isRequired,
  isDataSubmitted: PropTypes.bool.isRequired,
  submissionMessage: PropTypes.string.isRequired,
  errorCauseEquipNumber: PropTypes.string.isRequired,
  errorCode: PropTypes.string.isRequired,
  infoNumber: PropTypes.number.isRequired,
  quantidadeReserve: PropTypes.func.isRequired,
  quantidade: PropTypes.number,
  name: PropTypes.string,
  usuario: PropTypes.string,
};
