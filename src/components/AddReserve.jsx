import React from 'react';
import PropTypes from 'prop-types';
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
import { Grid, Row, Col } from 'react-flexbox-grid';
import DatePicker from 'material-ui/DatePicker';
import Paper from 'material-ui/Paper';
import axios from 'axios';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

const infos = [
  'Selecione uma Família de Equipamentos',
  'Selecione um Tipo de Equipamento',
  'Digite a quantidade de Equipamento(os) a ser(em) reservado(os)',
  'Selecione o dia para reservar os Equipamentos',
  'Selecione o turno para reservar os Equipamentos',
  'Digite a matéria em que será usada os Equipamentos',
  'Selecione uma das Requisições!',
];

const TurnoReserve = [
  'Manhã',
  'Tarde',
  'Noite'
];

const shouldDisableDate = (day) => {
  return (day.getDay() == 0);
}

let headerProps = {
  enableSelectAll: false,
  displaySelectAll: false,
  adjustForCheckbox: false
};

let headers = [
  {name: "Patrimônio", key: "patrimonio"},
  {name: "Família", key: "familia"},
  {name: "Tipo", key: "tipo"},
  {name: "Estado", key: "estado"}
];

export default class AddReserve extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      timeReserve: "",
      dateReserve: "",
      materia: "",
      flagStopAvailable: true,
      //flagStopQuantity: true,
      changeDateTime: false,
      flagMateria: true,
      flagQuantity: -1,
      data: [],
    }
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
    this.handleChangeQuantidade = this.handleChangeQuantidade.bind(this);
    this.handleForcedSubmit = this.handleForcedSubmit.bind(this);
    this.findTipoById = this.findTipoById.bind(this);
    this.findFamiliaById = this.findFamiliaById.bind(this);
    this.loadDataFromServer = this.loadDataFromServer.bind(this);
    this.handleEditPaper = this.handleEditPaper.bind(this);
    this.handleSelectReq = this.handleSelectReq.bind(this);
  }

  handleChangeDate(event, date) {
    this.setState(update(this.state, {
      dateReserve: { $set: date }
    }));

    this.props.setInfoNumber(4);
  }

  handleChangeTime(event, value) {
    this.setState(update(this.state, {
      timeReserve: { $set: value }
    }));

    this.props.setInfoNumber(5);
  }

  handleChangeMateria(event) {
    this.setState(update(this.state, {
      materia: { $set: event.target.value }
    }));

    if(this.state.materia !== null) {
      this.props.setInfoNumber(0);
    }
  }

  handleKeyPressMateria(event) {
    if(event.key === 'Enter' || event.key === 'TABKEY' ) {
      
    }
  }

  handleChangeQuantidade(name, event, key, payload) {
    var ultimoEquip = name;
    var flag = true;
    for(var i = 0; i < ultimoEquip; i++) {
      //alert("name: " + ultimoEquip + " i: " + i);
      if(this.props.equipInfos[ultimoEquip].familia === this.props.equipInfos[i].familia && this.props.equipInfos[ultimoEquip].tipo === null && this.props.equipInfos[i].tipo === null & i !== ultimoEquip) {
        flag = false;
        this.props.setError("Não é possível selecionar 2 famílias iguais!");
        this.props.setIsYesNoMessage(false);
        return;
      }
    }
    if (flag) {
      this.props.setQuantidade(name, key+1);
      this.setState(update(this.state, {
        //flagStopQuantity: { $set: false },
        flagQuantity: { $set: -1 },
        flagStop: { $set: false }
      }));
    }
  }

  componentDidMount() {
    this.props.clearEquips();
    this.props.setDataSubmitted(false);
    this.props.setInfoNumber(3);
    if(this.props.tipos.length === 0)
      this.props.getTipos();
    if(this.props.familias.length === 0)
      this.props.getFamilias();
  }

  componentWillReceiveProps(nextProps) {
    var equips = 0;
    var maxEquips = 0;
    var tipoNulo = false;

    if(nextProps.equipInfos === this.props.equipInfos || nextProps.equipInfos.length != this.props.equipInfos.length)
      return;

    //if(nextProps.lastReq != this.props.lastReq) {
      
    //}

    for(var i=0; i<this.props.equipInfos.length ; i++) {
      if(nextProps.equipInfos[i].availableEquips !== this.props.equipInfos[i].availableEquips && nextProps.equipInfos[i].availableEquips !== null && this.state.flagStopAvailable === false) {
        for(var j=0; j<this.props.equipInfos.length ; j++) {
          if(this.props.equipInfos[j].familia === this.props.equipInfos[i].familia) {
            equips = equips + this.props.equipInfos[j].quantidade;
            //alert("quant["+j+"]: "+ this.props.equipInfos[j].quantidade + " equips: " + equips );

            if(tipoNulo === false) {
              this.props.equipInfos[j].tipo === null ? maxEquips = maxEquips + nextProps.equipInfos[j].availableEquips : maxEquips = maxEquips + this.props.equipInfos[j].quantidade;
            }
          }
          if(this.props.equipInfos[j].tipo === null && (this.props.equipInfos[j].familia === this.props.equipInfos[i].familia)) {
            tipoNulo = true;
          }
        }

        if(tipoNulo === true) {
          if(nextProps.equipInfos[i].tipo !== null) {
            var news = maxEquips - equips;
            //alert("TIPOnews["+i+"]: " + news + " availableEquips: " + nextProps.equipInfos[i].availableEquips + " maxEquips: " + maxEquips);
            news >= nextProps.equipInfos[i].availableEquips ? this.props.setAvailable(i, nextProps.equipInfos[i].availableEquips) : this.props.setAvailable(i, news);
          }
          else{
            var news = nextProps.equipInfos[i].availableEquips - equips;
            //alert("news["+i+"]: " + news + " availableEquips: " + nextProps.equipInfos[i].availableEquips + " maxEquips: " + maxEquips: );
            this.props.setAvailable(i, news);
          }
        }

        if(news > 0) {

        }
        else{
          this.props.setAvailable(i, 0);
          this.props.setError("Não há equipamento disponível no momento");
          this.props.setIsYesNoMessage(false);
        }

        this.setState(update(this.state, {
          flagStopAvailable: { $set: true }
        }));
      }
      //else if(nextProps.equipInfos[i].quantidade !== this.props.equipInfos[i].quantidade && this.state.flagStopQuantity === false) {
      else if(nextProps.equipInfos[i].quantidade !== this.props.equipInfos[i].quantidade && this.state.flagStop === false) {
        for(var j=0; j<this.props.equipInfos.length ; j++) {
          if(this.props.equipInfos[j].familia === this.props.equipInfos[i].familia) {
            equips = equips + nextProps.equipInfos[j].quantidade;
            alert("quant["+j+"]: "+ nextProps.equipInfos[j].quantidade + " equips: " + equips );

            if(tipoNulo === false) {
              this.props.equipInfos[j].tipo === null ? maxEquips = maxEquips + nextProps.equipInfos[j].availableEquips : maxEquips = maxEquips + this.props.equipInfos[j].quantidade;
            }
          }
          if(this.props.equipInfos[j].tipo === null && (this.props.equipInfos[j].familia === this.props.equipInfos[i].familia)) {
            tipoNulo = true;
          }
        }

        if(tipoNulo === true) {
          if(nextProps.equipInfos[i].tipo !== null) {
            var news = maxEquips - equips;
            alert("TIPOnews["+i+"]: " + news + " availableEquips: " + nextProps.equipInfos[i].availableEquips + " maxEquips: " + maxEquips);
            //news >= nextProps.equipInfos[i].availableEquips ? this.props.setAvailable(i, nextProps.equipInfos[i].availableEquips) : this.props.setAvailable(i, news);
            if(news < 0) {
              equips = 0;
              for(var j=0; j<this.props.equipInfos.length ; j++) {
                equips = equips + nextProps.equipInfos[j].quantidade;
                if(i !== j) {
                  //if(nextProps.equipInfos[j].quantidade >= equips) {
                  //  this.props.setQuantidade(j,null);
                  //  alert("apaga["+j+"]");
                  //}
                  if(nextProps.equipInfos[j].tipo !== null) {
                    var news = maxEquips - equips;
                    alert("TIPO["+j+"]: " + news + " availableEquips: " + nextProps.equipInfos[j].availableEquips + " maxEquips: " + maxEquips + " equips: " + equips);
                    if(news + nextProps.equipInfos[j].quantidade <= 0) {
                      this.props.setQuantidade(j,null);
                      alert("apaga["+j+"]");
                      this.props.setAvailable(i, 0);
                      this.props.setError("Não há equipamento disponível no momento");
                      this.props.setIsYesNoMessage(false);
                    }
                    else if(nextProps.equipInfos[j].quantidade + news < nextProps.equipInfos[j].quantidade) {
                      this.props.setQuantidade(j,null);
                      alert("apagatipo["+j+"]");
                      news + nextProps.equipInfos[j].quantidade >= nextProps.equipInfos[j].availableEquips ? this.props.setAvailable(j, nextProps.equipInfos[j].availableEquips) : this.props.setAvailable(j, news + nextProps.equipInfos[j].quantidade);
                    }
                  }
                  else{
                    var news = nextProps.equipInfos[j].availableEquips - equips;
                    alert("FAMILIA["+j+"]: " + news + " availableEquips: " + nextProps.equipInfos[j].availableEquips + " maxEquips: " + maxEquips + " equips: " + equips);
                    this.props.setAvailable(j, news);
                  }
                }
              }
            }
          }
          else{
            var news = nextProps.equipInfos[i].availableEquips - equips;
            alert("news["+i+"]: " + news + " availableEquips: " + nextProps.equipInfos[i].availableEquips + " maxEquips: " + maxEquips);
            news < 0 ? alert("menor") : alert("maior")
            //this.props.setAvailable(i, news);
            if(news < 0) {
              equips = 0;
              for(var j=0; j<this.props.equipInfos.length ; j++) {
                equips = equips + nextProps.equipInfos[j].quantidade;
                if(i !== j) {
                  //if(nextProps.equipInfos[j].quantidade >= equips) {
                  //  this.props.setQuantidade(j,null);
                  //  alert("apaga["+j+"]");
                  //}
                  if(nextProps.equipInfos[j].tipo !== null) {
                    var news = maxEquips - equips;
                    alert("TIPO["+j+"]: " + news + " availableEquips: " + nextProps.equipInfos[j].availableEquips + " maxEquips: " + maxEquips + " equips: " + equips);
                    if(news + nextProps.equipInfos[j].quantidade <= 0) {
                      this.props.setQuantidade(j,null);
                      alert("apaga["+j+"]");
                      this.props.setAvailable(j, 0);
                      this.props.setError("Não há equipamento disponível no momento");
                      this.props.setIsYesNoMessage(false);
                    }
                    else if(nextProps.equipInfos[j].quantidade + news < nextProps.equipInfos[j].quantidade) {
                      this.props.setQuantidade(j,null);
                      alert("apagatipo["+j+"]");
                      news + nextProps.equipInfos[j].quantidade >= nextProps.equipInfos[j].availableEquips ? this.props.setAvailable(j, nextProps.equipInfos[j].availableEquips) : this.props.setAvailable(j, news + nextProps.equipInfos[j].quantidade);
                    }
                  }
                  else{
                    var news = nextProps.equipInfos[j].availableEquips - equips;
                    alert("FAMILIA["+j+"]: " + news + " availableEquips: " + nextProps.equipInfos[j].availableEquips + " maxEquips: " + maxEquips + " equips: " + equips);
                    this.props.setAvailable(j, news);
                  }
                }
              }
            }
          }
        }

        this.setState(update(this.state, {
          //flagStopQuantity: { $set: true },
          flagStop: { $set: true },
          flagStopAvailable: { $set: true },
          flagQuantity: { $set: -1 }
        }));
      }
    }
  }

  handleForcedSubmit() {
    if(this.state.changeDateTime) {
      this.state = {
        materia: this.state.materia,
        dateReserve: this.state.dateReserve,
        timeReserve: this.state.timeReserve
      }
      this.props.clearEquips();
      this.props.setDataSubmitted(false);
      this.props.clearSubmissionMessage();
    }
    else {
      let sendDateReserve = this.state.dateReserve;
      sendDateReserve = (sendDateReserve.getFullYear() + '-' + ("0" + (sendDateReserve.getMonth()+1)).slice(-2) + '-' + ("0" + sendDateReserve.getDate()).slice(-2));

      var equips = [];
      this.props.equipInfos.forEach( pat => {
        if(pat.familia !== null) {
          equips.push({
            familia: pat.familia,
            tipo: pat.tipo,
            quantidade: pat.quantidade
          });
        }
      });
      equips.forEach( pat => {
        console.log("familia " + pat.familia + " tipo " + pat.tipo + " quantidade " + pat.quantidade);
      });

      this.props.insertReserve(this.props.usuario, sendDateReserve, this.state.timeReserve, this.state.materia, equips);
      this.props.setIsYesNoMessage(false);
    }
  }

  handleCloseDialog() {
    //alert(this.props.isDataSubmitted);
    if(this.state.changeDateTime) {
      this.setState(update(this.state, {
        changeDateTime: { $set: false }
      }));
      this.props.setIsYesNoMessage(false);
      this.props.clearSubmissionMessage();
    }
    else {
      if(this.props.isDataSubmitted) {
        this.state = {
          materia: "",
          dateReserve: "",
          timeReserve: ""
        }
        this.props.clearEquips();
        this.props.setDataSubmitted(false);
      }
      this.props.clearSubmissionMessage();
    }
  }

  handleTextFieldChange(event) {
    const value = event.currentTarget.value;
    if(newValue != this.props.equipInfos[index].value)
      newErrorText = "";
    this.setState(update(this.state, {
    }));
  }

  handleKeyPress(event) {
    if(event.key === 'Enter') {
      this.handleNewEquipment(event);
    }
  }

  handleNewEquipment(event) {
    //if(this.props.equipInfos[this.props.equipInfos.length-1].familia !== null && this.props.equipInfos[this.props.equipInfos.length-1].quantidade !== null) {
    this.props.addEquip();
    this.props.setInfoNumber(0);
  }

  handleRemoveEquipment(name, event) {
    if(this.props.equipInfos.length <= 1) {
      this.props.setError("Não é possível remover esse campo.");
      this.props.clearEquips();
      this.props.setIsYesNoMessage(false);
      return;
    }
    else {
      this.props.removeEquip(name);
      this.setState(update(this.state, {
        flagQuantity: { $set: -1 }
      }));
    }
  }

  handleFormSubmit(event) {
    let message;
    this.props.equipInfos.forEach(equip => {
      message = message + equip.familia + " - " + equip.tipo + " " + equip.quantidade + "\\n";
      //message = message + equip.familia + " - " + equip.tipo === null ? "" : equip.tipo + " " + equip.quantidade + "\\n";
    });
    //alert(message);

    if(this.state.dateReserve === null || this.state.dateReserve === undefined || this.state.dateReserve === "" ) {
      this.props.setError("Por favor, insira data da reserva.");
      this.props.setIsYesNoMessage(false);
      return;
    }
    if(this.state.timeReserve === null || this.state.timeReserve === undefined || this.state.timeReserve === "" ) {
      this.props.setError("Por favor, insira o turno da reserva.");
      this.props.setIsYesNoMessage(false);
      return;
    }

    for(var i = 0; i < this.props.equipInfos.length; i++) {
      //console.log("i " + i);
      for(var j = 1 + i; j < this.props.equipInfos.length; j++) {
        //console.log("j " + j);
        if(this.props.equipInfos[i].familia === this.props.equipInfos[j].familia && (this.props.equipInfos[i].tipo === null || this.props.equipInfos[i].tipo === undefined) && (this.props.equipInfos[j].tipo == null || this.props.equipInfos[j].tipo === undefined)) {
          this.props.setError("Familia de equipamento duplicado. Irá ser deletado o último equipamento duplicado!");
          this.props.setIsYesNoMessage(false);
          this.props.removeEquip(j);
          return;
        }
      }
    }

    for(var i=1; i<this.props.equipInfos.length; i++) {
      //console.log("i: " + i);
      if(this.props.equipInfos[i].familia !== null && this.props.equipInfos[i].quantidade <= 0) {
        this.props.setError("Por favor, insira a quantidade faltante do equipamento.");
        this.props.setIsYesNoMessage(false);
        return;
      }
    }

    this.props.setError("Deseja reservar os equipamentos?");
    this.props.setIsYesNoMessage(true);
    //return;
  }

  funcSetSelectedFamilia(name, familia) {
    this.props.setSelectedFamilia(name, familia);

    this.props.quantidadeReserve(familia, null, name);
    this.props.setQuantidade(name, null);

    this.setState(update(this.state, {
      flagStopAvailable: { $set: false }
    }));
  }

  funcSetSelectedTipo(name, tipo) {
    var duplicado = false;
    for(var i = 0; i < this.props.equipInfos.length; i++) {
      //&& tipo !== ""
      //alert("this.props.equipInfos[i].tipo: " + this.props.equipInfos[i].tipo + " tipo: " + tipo);
      if(this.props.equipInfos[i].tipo === tipo && tipo !== null && name != i) {
        this.props.setError("Equipamento removido devido duplicidade.");
        this.props.removeEquip(name);
        //alert("duplicado: " + name + " com i: " + i);
        this.props.setIsYesNoMessage(false);
        duplicado = true;
        return;
      }
    }

    //duplicado === false ? this.props.setSelectedTipo(name, tipo) : this.props.setSelectedTipo(name, null)
    duplicado === false ? this.props.setSelectedTipo(name, tipo) : tipo = null

    if(tipo === null) {
      //this.props.quantidadeReserve(this.props.equipInfos[index].familia, null, name);
    }
    else{

      this.props.quantidadeReserve(this.props.equipInfos[name].familia, tipo, name);
      this.props.setQuantidade(name, null);

      this.setState(update(this.state, {
        flagStopAvailable: { $set: false }
      }));
    }
  }

  findTipoById(tipoId) {
		if(tipoId === null)
			return null;
    return this.props.tipos.find(tipo =>
        tipoId == tipo.id_tipo
    )
  }

  findFamiliaById(familiaId) {
    return this.props.familias.find(familia =>
			familiaId == familia.id_familia
    )
  }
  

  loadDataFromServer() {
    this.props.getLastReq(this.props.usuario);
    this.props.setInfoNumber(6);
  }

  handleEditPaper(index) {
    //alert("oi");
    this.setState(update(this.state, {
      flagQuantity: { $set: index }
    }));
    //this.props.setQuantidade(index, null);
  }

  handleSelectReq(index) {
    var equips = [];
    //var i = 0;
    this.props.reqEquips.forEach( equip => {
      if(equip.id === index) {
        //this.props.setSelectedFamilia(i, equip.familia);
        //this.props.setSelectedTipo(i, equip.tipo);
        //this.props.setQuantidade(i, equip.quantidade);
        //i++;
        equips.push({
          familia: equip.familia,
          tipo: equip.tipo,
          quantidade: equip.quantidade
        });
      }
    });
    //alert(index + " " + equips.length);
    this.props.clearEquips();
    for(var i=0; i<=equips.length-1 ; i++) {
      //alert("familia[" + i + "]:" + equips[i].familia + " tipo " + equips[i].tipo + " quantidade " + equips[i].quantidade);
      this.props.setSelectedFamilia(i, equips[i].familia);
      this.props.setSelectedTipo(i, equips[i].tipo);
      this.props.setQuantidade(i, equips[i].quantidade);
      //this.props.setAvailable(i, equips[i].quantidade);
      //i == equips.length ? alert("finalizou") : alert(i); this.props.addEquip()
      this.props.addEquip();
      this.props.setInfoNumber(3);
    }
    this.props.removeEquip(i);
    this.setState(update(this.state, {
      flagQuantity: { $set: -1 },
      flagStopAvailable:  { $set: true }
    }));
  }

  render () {
    let actions
    if(this.props.isYesNoMessage) {
      actions = [
        <FlatButton
          label="SIM"
          primary={false}
          onTouchTap={this.handleForcedSubmit}
        />,
        <FlatButton
          label="NÃO"
          primary={true}
          onTouchTap={this.handleCloseDialog}
        />,
      ];
    }
    else {
      actions = [
      <FlatButton
        label="OK"
        primary={true}
        onTouchTap={this.handleCloseDialog}
      />,
      ];
    }
    const Text_info = infos[this.props.infoNumber];
    
    let submissionMessage = this.props.submissionMessage;
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
          <Grid fluid >
            <Row bottom="xs" around="xs" center="xs" >
              <Col xs={12} sm={4} md={4} >
                <DatePicker
                  value={this.state.dateReserve !== '' ? this.state.dateReserve : null}
                  floatingLabelText="Data"
                  floatingLabelStyle={{color: 'grey', left: '0px'}}
                  hintText="Selecione a data da Reserva"
                  hintStyle={{color: 'grey', left: '0px'}}
                  cancelLabel="Cancelar"
                  autoOk={true}
                  onChange={this.handleChangeDate}
                  disabled={this.props.isInputDisabled}
                  firstDayOfWeek={0}
                  DateTimeFormat={Intl.DateTimeFormat}
                  locale='pt-BR'
                  shouldDisableDate={shouldDisableDate}
                  minDate={new Date(Date.now() + 1*24*60*60*1000)}
                  fullWidth={true}
                />
              </Col>
              <Col xs={12} sm={4} md={4} >
                <SelectField
                  floatingLabelText="Turno"
                  labelStyle={{position: 'absolute'}}
                  value={TurnoReserve[this.state.timeReserve]}
                  disabled={this.props.isInputDisabled}
                  onChange={this.handleChangeTime}
                  disabled={this.props.isInputDisabled}
                  floatingLabelStyle={{color: 'grey', left: '0px'}}
                  inputStyle={{left: '0px'}}
                  fullWidth={true}
                  autoWidth={true}
                >
                  {TurnoReserve.map((hora) => (
                    <MenuItem
                      key={hora}
                      value={hora}
                      primaryText={hora}
                    />
                  ))}
                </SelectField>
              </Col>
              <Col xs={12} sm={4} md={4} >
                <TextField
                  hintText={"Matéria"}
                  floatingLabelText={"Digite a matéria da aula"}
                  value={this.state.materia}
                  onChange={this.handleChangeMateria}
                  onKeyPress={this.handleKeyPressMateria}
                  floatingLabelStyle={{color: 'grey'}}
                  fullWidth={true}
                />
              </Col>
            </Row>
            {this.props.equipInfos.map((equipReservado, index) => (
              <Row bottom="xs" around="xs" center="xs" key={index} >
                <Col xs={11} sm={11} md={11} >
                  {equipReservado.familia !== null && equipReservado.quantidade !== null && this.state.flagQuantity !== index ?
                    <div>
                      <Row bottom="xs" around="xs" center="xs" key={index} >
                        <Col xs={11} sm={11} md={11} >
                          <Paper
                            onClick = {() => this.handleEditPaper(index)}
                            zDepth={2}
                            rounded={false}
                            style={{marginTop: '10px', height: '50px', display: 'flex', alignItems: 'center'}}
                          >
                            <text style={{marginLeft: '15.5px'}}>
                              {" " + this.findFamiliaById(equipReservado.familia).familia + " " + (this.findTipoById(equipReservado.tipo) !== null ? " " + this.findTipoById(equipReservado.tipo).tipo : "") + " - " + equipReservado.quantidade}
                              
                            </text>
                          </Paper>
                        </Col>
                      </Row>
                    </div>
                  :
                    <Row bottom="xs" around="xs" center="xs" key={index} >
                      <Col xs={12} sm={9} md={9} >
                        <EquipTypeSelectorContainer
                          name={index.toString()}
                          tipo={equipReservado.tipo}
                          familia={equipReservado.familia}
                          setSelectedFamilia={this.funcSetSelectedFamilia}
                          setSelectedTipo={this.funcSetSelectedTipo}
                          setInfoNumber={this.props.setInfoNumber}
                          isMissingTipo={false}
                          isMissingFamilia={false}
                          isInputDisabled={this.props.isInputDisabled}
                        />
                      </Col>
                      <Col xs={12} sm={3} md={3}>
                        <SelectField
                          //name={index}
                          labelStyle={{position: 'absolute'}}
                          floatingLabelText="Quantidade"
                          value={equipReservado.quantidade}
                          onChange={this.handleChangeQuantidade.bind(null,index)}
                          floatingLabelStyle={{color: 'grey', left: '0px'}}
                          disabled={equipReservado.availableEquips <= 0 || this.props.isInputDisabled}
                          fullWidth={true}
                          autoWidth={true}
                        >
                          {[...Array(equipReservado.availableEquips)].map((x, i) => (
                            <MenuItem
                              key={i === null || i === undefined || i >= 0 ? i+1 : 0}
                              value={i === null || i === undefined || i >= 0 ? i+1 : 0}
                              primaryText={i === null || i === undefined || i >= 0 ? i+1 : 0}
                            />
                          ))}
                        </SelectField>
                      </Col>
                    </Row>
                  }
                </Col>
                <Col xs={1} sm={1} md={1}>
                  <FloatingActionButton
                    mini={true}
                    type="button"
                    name={index}
                    backgroundColor="#ff0000"
                    onTouchTap={this.handleRemoveEquipment.bind(null,index)}
                    zDepth={1}
                  >
                    <ActionDelete />
                  </FloatingActionButton>
                </Col>
              </Row>
            ))}
            <Row
              bottom="xs"
              center="xs"
              style={{height: '55px'}}
            >
              <Col>
                <RaisedButton
                  name="add"
                  type="button"
                  label="Adicionar"
                  disabled={this.props.equipInfos[this.props.equipInfos.length-1].quantidade === null ? true : false}
                  primary={true}
                  onTouchTap={this.handleNewEquipment}
                />
              </Col>
              <Col xs={1}/>
              <Col>
                <RaisedButton
                  name="submit"
                  type="button"
                  label="Enviar"
                  disabled={this.props.equipInfos[this.props.equipInfos.length-1].quantidade === null ? true : false}
                  primary={true}
                  onTouchTap={this.handleFormSubmit}
                />
              </Col>
            </Row>
            
            <Row bottom="xs" around="xs" center="xs" >
              <Col xs={12} sm={12} md={12} >
                <RaisedButton
                  label="Requisições"
                  primary={true}
                  onClick={this.loadDataFromServer}

                />
              </Col>
            </Row>
            
            <Col xs={1}/>
            {this.props.lastReq.map((equipReservado, index) => (
              <Row bottom="xs" around="xs" center="xs" key={index} >
                <Col xs={11} sm={11} md={11} >
                  {this.props.lastReq.length <= 1 ?
                  <div>
                    {"Nenhuma requisição antiga!"}
                  </div>
                    :
                    <div>
                      <Row bottom="xs" around="xs" center="xs" key={index} >
                        <Col xs={12} sm={12} md={12} >
                          <Paper
                            onClick = {() => this.handleSelectReq(equipReservado.id)}
                            zDepth={2}
                            rounded={false}
                            style={{marginTop: '10px', height: '50px', display: 'flex', alignItems: 'center'}}
                            transitionEnabled={false}
                          >
                            <text style={{marginLeft: '15.5px'}}>
                              {" " + equipReservado.dataDeUso + " / " + equipReservado.turno + " / " + equipReservado.materia}
                              
                            </text>
                          </Paper>
                        </Col>
                      </Row>
                    </div>
                    }
                    </Col>
                  </Row>
                ))}
          </Grid>
        </form>
      </div>
    );
  }
}

AddReserve.propTypes = {
  submissionMessage: PropTypes.string.isRequired,
  insertReserve: PropTypes.func.isRequired,
  clearSubmissionMessage: PropTypes.func.isRequired,
  setSelectedTipo: PropTypes.func.isRequired,
  setSelectedFamilia: PropTypes.func.isRequired,
  clearEquips: PropTypes.func.isRequired,
  setInfoNumber: PropTypes.func.isRequired,
  isInputDisabled: PropTypes.bool.isRequired,
  //isMissingTipo: PropTypes.bool.isRequired,
  //isMissingFamilia: PropTypes.bool.isRequired,
  isDataSubmitted: PropTypes.bool.isRequired,
  setDataSubmitted: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  infoNumber: PropTypes.number.isRequired,
  quantidadeReserve: PropTypes.func.isRequired,
  usuario: PropTypes.string,
  equipInfos: PropTypes.array,
  getFamilias: PropTypes.func.isRequired,
  getTipos: PropTypes.func.isRequired,
  familias: PropTypes.array.isRequired,
  tipos: PropTypes.array,
  setQuantidade: PropTypes.func.isRequired,
  addEquip: PropTypes.func.isRequired,
  removeEquip: PropTypes.func.isRequired,
  setAvailable: PropTypes.func.isRequired,
  setIsYesNoMessage: PropTypes.func.isRequired,
  isYesNoMessage: PropTypes.bool,
  lastReq: PropTypes.array,
  reqEquips: PropTypes.array,
  getLastReq: PropTypes.func.isRequired,
};
