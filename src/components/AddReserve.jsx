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
      flagStopAvailable: true,
      changeDateTime: false,
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
  }

  handleChangeDate(event, date) {
    this.setState(update(this.state, {
      dateReserve: { $set: date }
    }));

    let NewIndexinfoNumber = this.state.indexinfoNumber + 1;
    this.setState(update(this.state, {
      indexinfoNumber: { $set: NewIndexinfoNumber }
    }));
  }

  handleChangeTime(event, value) {
    this.setState(update(this.state, {
      timeReserve: { $set: value }
    }));
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
    //alert("name: " + (name+1) + " length: " + this.props.equipInfos.length);
    if(name + 1 !== this.props.equipInfos.length && this.props.equipInfos[name+1].familia !== null) {
      this.setState(update(this.state, {
        changeDateTime: { $set: true }
      }));
      this.props.setError("Para alterar esse campo, é necessário resetar os equipamentos! deseja executar essa ação?");
      this.props.setIsYesNoMessage(true);
      return;
    }
    else{
      this.props.setQuantidade(name, key+1);
    }
  }

  componentDidMount() {
    this.props.clearEquips();
    this.props.setDataSubmitted(false);
  }

  componentWillReceiveProps(nextProps) {
    var equips = 0;
    var maxEquips = 0;
    var tipoNulo = false;

    if(nextProps.equipInfos === this.props.equipInfos || nextProps.equipInfos.length != this.props.equipInfos.length)
      return;

    for(var i=0; i<this.props.equipInfos.length ; i++) {
      if(nextProps.equipInfos[i].availableEquips !== this.props.equipInfos[i].availableEquips && nextProps.equipInfos[i].availableEquips !== null && this.state.flagStopAvailable === false) {
        for(var j=0; j<this.props.equipInfos.length ; j++) {
          if(this.props.equipInfos[j].familia === this.props.equipInfos[i].familia) {
            equips = equips + this.props.equipInfos[j].quantidade;
            //alert("quant["+j+"]: "+ this.props.equipInfos[j].quantidade + " equips: " + equips + " max: " + max);

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
            //alert("news["+i+"]: " + news + " availableEquips: " + nextProps.equipInfos[i].availableEquips + " max: " + max);
            this.props.setAvailable(i, news);
          }
        }
        else {
          var news = nextProps.equipInfos[i].availableEquips;
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
    this.props.addEquip();
  }

  handleRemoveEquipment(name, event) {
    if(this.props.equipInfos.length <= 1) {
      this.props.setError("Não é possível remover esse campo.");
      this.props.setIsYesNoMessage(false);
      return;
    }
    else {
      this.props.removeEquip(name);
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
      if(this.props.equipInfos[i].tipo === tipo && tipo !== null) {
        this.props.setError("Tipo de equipamento duplicado.");
        this.props.setIsYesNoMessage(false);
        duplicado = true;
        return;
      }
    }

    duplicado === false ? this.props.setSelectedTipo(name, tipo) : this.props.setSelectedTipo(name, null)

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
    const Text_info = infos[this.state.indexinfoNumber];
    
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
  submissionMessage: PropTypes.func.isRequired,
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
  setError: PropTypes.string.isRequired,
  infoNumber: PropTypes.number.isRequired,
  quantidadeReserve: PropTypes.func.isRequired,
  usuario: PropTypes.string,
  equipInfos: PropTypes.array,
  setQuantidade: PropTypes.func.isRequired,
  addEquip: PropTypes.func.isRequired,
  removeEquip: PropTypes.func.isRequired,
  setAvailable: PropTypes.func.isRequired,
  setIsYesNoMessage: PropTypes.func.isRequired,
  isYesNoMessage: PropTypes.bool,
};
