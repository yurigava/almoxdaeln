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
import Divider from 'material-ui/Divider';

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

const shouldDisableDate = (day) => {
  return (day.getDay() == 0);
}

export default class AddReserve extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      timeReserve: "",
      dateReserve: "",
      materia: "",
      indexinfoNumber: 0,
      error: "",
      flag: true
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
  }

  handleChangeDate(event, date) {
    this.setState(update(this.state, {
      dateReserve: { $set: date }
    }));

    if(this.state.dateReserve !== date && this.state.dateReserve !== ""  && this.props.equipInfos[0].familia !== null) {
      this.state = {
        timeReserve: this.state.timeReserve,
        materia: this.state.materia
      }
      this.props.clearEquips();
      this.props.setError("Equipamentos Resetados devido troca da data.");
      return;
    }

    let NewIndexinfoNumber = this.state.indexinfoNumber + 1;
    this.setState(update(this.state, {
      indexinfoNumber: { $set: NewIndexinfoNumber }
    }));
  }

  handleChangeTime(event, value) {
    this.setState(update(this.state, {
      timeReserve: { $set: value }
    }));
    if(this.state.timeReserve !== value && this.state.timeReserve !== "" && this.props.equipInfos[0].familia !== null) {
      this.state = {
        dateReserve: this.state.dateReserve,
        materia: this.state.materia
      }
      this.props.clearEquips();
      this.props.setError("Equipamentos Resetados devido troca do turno.");
      return;
    }
  }

  handleChangeMateria(event) {
    this.setState(update(this.state, {
      materia: { $set: event.target.value }
    }));
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
    //alert("name: " + name + " key: " + key + " event: " + event + " payload: " + payload);
    //var index = Number(name);
    //var quantidade = key+1;
    this.props.setQuantidade(Number(name), key+1);
  }

  componentWillReceiveProps(nextProps) {
    var equips = 0;
    for(var i=0; i<this.props.equipInfos.length ; i++) {
      if(nextProps.equipInfos[i].availableEquips !== this.props.equipInfos[i].availableEquips && nextProps.equipInfos[i].availableEquips !== null && this.state.flag === false) {
        for(var j=0; j<this.props.equipInfos.length ; j++) {
          equips = equips + this.props.equipInfos[j].quantidade
          //alert("quant["+j+"]: "+ nextProps.equipInfos[j].quantidade + " equips: " + equips);
        }
        equips = nextProps.equipInfos[i].availableEquips - equips;
        alert("equips["+i+"]: " + equips + " ava: " + nextProps.equipInfos[i].availableEquips);
        
        //equips >= 0 ? this.props.setAvailable(i, equips) : this.props.setAvailable(i, 0); this.props.setError("OI")
        if(equips > 0) {
          this.props.setAvailable(i, equips);
        }
        else{
          this.props.setAvailable(i, 0);
          this.props.setError("Não há equipamento disponível no momento");
        }
        
        this.setState(update(this.state, {
          flag: { $set: true }
        }));
      }
    }
  }

  handleCloseDialog() {
    if(this.props.isDataSubmitted) {
      this.state = {
        materia: "",
        dateReserve: "",
        timeReserve: ""
      }
      this.props.clearEquips();
    }
    this.props.clearSubmissionMessage();
  }

  handleTextFieldChange(event) {
    const value = event.currentTarget.value;
    //const index = Number(event.currentTarget.name);
    //let newErrorText = this.state.equipReservados[index].errorText;
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
    this.props.addEquip();
  }

  handleRemoveEquipment(name, event) {
    if(this.props.equipInfos.length <= 1) {
      this.props.setError("Não é possível remover esse campo.");
      return;
    }
    else {
      this.props.removeEquip(Number(name));
    }
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

    if(Number(this.props.equipInfos.length) <= 0) {
      this.props.setError("Por favor, insira ao menos uma familia e sua quantidade.");
      this.handleNewEquipment(event);
      return;
    }

    if(this.props.equipInfos[0].familia === "" || this.props.equipInfos[0].value === 0 || this.props.equipInfos[0].value === "" || this.props.equipInfos[0].value === null) {
      this.props.setError("Por favor, insira ao menos uma familia e sua quantidade.");
      this.setState(update(this.state, {
      }));
      return;
    }

    //if(this.props.equipInfos.length) {
      for(var i=1; i<this.props.equipInfos.length; i++) {
        //console.log("i: " + i);
        if((this.props.equipInfos[i].familia !== "" || this.props.equipInfos[i].familia !== undefined) && (this.props.equipInfos[i].value === "")) {
          this.props.setError("Por favor, insira a quantidade faltante do equipamento.");
          return;
        }
      }
    //}

    for(var i = 0; i < this.props.equipInfos.length; i++) {
      //console.log("i " + i);
      for(var j = 1 + i; j < this.props.equipInfos.length; j++) {
        //console.log("j " + j);
        if(this.props.equipInfos[i].familia === this.props.equipInfos[j].familia && (this.props.equipInfos[i].tipo === null || this.props.equipInfos[i].tipo === undefined) && (this.props.equipInfos[j].tipo == null || this.props.equipInfos[j].tipo === undefined)) {
          this.props.setError("Familia de equipamento duplicado.");
          //this.props.clearEquips();
          return;
        }
      }
    }

    let sendDateReserve = this.state.dateReserve;
    sendDateReserve = (sendDateReserve.getFullYear() + '-' + ("0" + (sendDateReserve.getMonth()+1)).slice(-2) + '-' + ("0" + sendDateReserve.getDate()).slice(-2));

    var equips = [];
    this.props.equipInfos.forEach( pat => {
      equips.push({
        familia: pat.familia,
        tipo: pat.tipo,
        quantidade: pat.quantidade
      });
    });
    equips.forEach( pat => {
      console.log("familia " + pat.familia + " tipo " + pat.tipo + " quantidade " + pat.quantidade);
    });

    this.props.insertReserve(this.props.usuario, sendDateReserve, this.state.timeReserve, this.state.materia, equips);
  }

  funcSetSelectedFamilia(name, familia) {
    if(this.state.dateReserve === null || this.state.dateReserve === undefined || this.state.dateReserve === "" ) {
      this.props.setError("Por favor, insira data da reserva.");
      return;
    }
    if(this.state.timeReserve === null || this.state.timeReserve === undefined || this.state.timeReserve === "" ) {
      this.props.setError("Por favor, insira o turno da reserva.");
      return;
    }

    this.props.setSelectedFamilia(name, familia);

    let sendDateReserve = this.state.dateReserve;
    sendDateReserve = (sendDateReserve.getFullYear() + '-' + ("0" + (sendDateReserve.getMonth()+1)).slice(-2) + '-' + ("0" + sendDateReserve.getDate()).slice(-2));

    this.props.quantidadeReserve(familia, null, name, sendDateReserve, this.state.timeReserve);
    
    this.setState(update(this.state, {
      flag: { $set: false }
    }));
  }

  funcSetSelectedTipo(name, tipo) {
    var duplicado = false;
    for(var i = 0; i < this.props.equipInfos.length; i++) {
      //&& tipo !== ""
      //alert("this.props.equipInfos[i].tipo: " + this.props.equipInfos[i].tipo + " tipo: " + tipo);
      if(this.props.equipInfos[i].tipo === tipo && tipo !== null) {
        this.props.setError("Tipo de equipamento duplicado.");
        duplicado = true;
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

    duplicado === false ? this.props.setSelectedTipo(name, tipo) : this.props.setSelectedTipo(name, null)

    let sendDateReserve = this.state.dateReserve;
    sendDateReserve = (sendDateReserve.getFullYear() + '-' + ("0" + (sendDateReserve.getMonth()+1)).slice(-2) + '-' + ("0" + sendDateReserve.getDate()).slice(-2));

    if(tipo === null) {
      //this.props.quantidadeReserve(this.props.equipInfos[index].familia, null, name);
    }
    else{
      this.props.quantidadeReserve(this.props.equipInfos[name].familia, tipo, name, sendDateReserve, this.state.timeReserve);
    }
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
          <Grid fluid >
            <Row bottom="xs" around="xs" center="xs" >
              <Col xs={12} sm={6} md={4} >
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
                  mode='landscape'
                  fullWidth={true}
                />
              </Col>
              <Col xs={12} sm={6} md={4} >
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
              <Col xs={12} md={4} >
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
              <Row
                bottom="xs"
                around="xs"
                center="xs"
                key={index}
              >
                <br/>
                <Divider inset={true} />
                <br/>
                <Col xs={12} md={8} >
                  <EquipTypeSelectorContainer
                    name={index}
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
                <Col xs={9} md={3}>
                  <SelectField
                    name={index}
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
                <Col xs={3} md={1}>
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
                  disabled={this.props.equipInfos[0].quantidade === null ? true : false}
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
                  disabled={this.props.equipInfos[0].quantidade === null ? true : false}
                  primary={true}
                  onTouchTap={this.handleFormSubmit}
                />
              </Col>
            </Row>
          </Grid>
        </form>
      </div>
    );
  }
}

AddReserve.propTypes = {
  setError: PropTypes.func.isRequired,
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
  submissionMessage: PropTypes.string.isRequired,
  infoNumber: PropTypes.number.isRequired,
  quantidadeReserve: PropTypes.func.isRequired,
  //quantidade: PropTypes.number,
  //name: PropTypes.string,
  usuario: PropTypes.string,
  equipInfos: PropTypes.array,
  setQuantidade: PropTypes.func.isRequired,
  addEquip: PropTypes.func.isRequired,
  removeEquip: PropTypes.func.isRequired,
  setAvailable: PropTypes.func.isRequired,
};
