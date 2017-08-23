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
import {Table, TableBody, TableRow, TableHeader, TableHeaderColumn, TableRowColumn} from 'material-ui/Table';

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
    this.funcSetInfoNumber = this.funcSetInfoNumber.bind(this);
    this.handleChangeQuantidade = this.handleChangeQuantidade.bind(this);
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
    }));

    let NewIndexinfoNumber = this.state.indexinfoNumber + 1;
    this.setState(update(this.state, {
      indexinfoNumber: { $set: NewIndexinfoNumber }
    }));
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

  handleChangeQuantidade(event, key, payload) {
    const index = Number(event.currentTarget.name);
    const quantidade = key+1;
    this.props.setQuantidade(index, quantidade);
  }

  componentWillReceiveProps(nextProps) {
    var quantidadeRecebida = 0;
    if(nextProps.quantidade !== this.props.quantidade && nextProps.quantidade !== null || nextProps.name !== this.props.name) {
      let index = this.findEquipIndex(nextProps.name, this.state.equipReservados);
      quantidadeRecebida = nextProps.quantidade;

      var tamanhoFamilia = 0;
      var tipoNotNULLDisponivel = 0;
      var tipoNotNULLReservado = 0;
      var tipoNotNULLRecebido = 0;
      var tipoNULLDisponivel = 0;
      var tipoNULLReservado = 0;
      var tipoDisponivel = 0;
      var tipoReservado = 0;
      var tipoNULLENotDisponivel = 0;
      var maxRecebido = false;
      var equips = this.state.equipReservados;
      //console.log("equips.length: " + equips.length);

      for(var j = 0; j < equips.length; j++) {
        //console.log("j: " + j);
        if(equips[index].familia === equips[j].familia && (equips[j].tipo === undefined || equips[j].tipo === null)) {
          tipoNULLReservado = tipoNULLReservado + equips[j].value;
          console.log("NullReservado: " + tipoNULLReservado);
          if(index === j && maxRecebido === false) {
            tipoNULLDisponivel = tipoNULLDisponivel + quantidadeRecebida;
            maxRecebido = true;
            console.log("NullDisponivel["+index+"]: " + tipoNULLDisponivel + " quantidadeRecebida: " + quantidadeRecebida);
          }
          if(maxRecebido === false) {
            tipoNULLDisponivel = tipoNULLDisponivel + equips[j].maxQuantidade;
            maxRecebido = true;
            console.log("NullDisponivel["+index+"]: " + tipoNULLDisponivel + " maxQuantidade["+j+"]: " + equips[j].maxQuantidade);
          }
        }
        else if(equips[index].familia === equips[j].familia) {
          tipoNotNULLReservado = tipoNotNULLReservado + equips[j].value;
          console.log("Reservado["+j+"]: " + equips[j].value);
          if(index === j) {
            //tipoNotNULLDisponivel = tipoNotNULLDisponivel + quantidadeRecebida;
            tipoNotNULLRecebido = quantidadeRecebida;
            console.log("Recebido["+index+"]: " + tipoNotNULLRecebido);
          }
          else {
            //tipoNotNULLDisponivel = tipoNotNULLDisponivel + equips[j].maxQuantidade;
            console.log("com tipo e não atual: " + equips[j].maxQuantidade);
            //console.log("Disponivel["+index+"]: " + tipoNotNULLDisponivel + " maxQuantidade["+j+"]: " + equips[j].maxQuantidade);
          }
        }
      }
      tipoReservado = Number(tipoNotNULLReservado) + Number(tipoNULLReservado);
      tipoDisponivel = Number(tipoNotNULLDisponivel) + Number(tipoNULLDisponivel);
      //tipoNULLENotDisponivel = Number(tipoNULLENotDisponivel) - Number(tipoReservado);
      console.log("tipoDisponivel: " + tipoDisponivel + " tipoReservado: " + tipoReservado);
      if(equips[index].tipo === null || equips[index].tipo === undefined) {
        tamanhoFamilia = tipoDisponivel - tipoReservado;
        //tipoDisponivel <= 0 ? tamanhoFamilia = quantidadeRecebida : tamanhoFamilia = tipoDisponivel
      }
      else {
        if(maxRecebido === false) {
          tamanhoFamilia = tipoNotNULLRecebido;
        }
        else {
          tipoNotNULLRecebido < tipoDisponivel - tipoReservado ? tamanhoFamilia = tipoNotNULLRecebido : tamanhoFamilia = tipoDisponivel - tipoReservado
        }
      }

      tamanhoFamilia < 0 ? tamanhoFamilia = 0 : tamanhoFamilia = tamanhoFamilia

      this.setState(update(this.state, {
        equipReservados: {
          [index]: {
            maxQuantidade: { $set: tamanhoFamilia }
          }
        }
      }));
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
    const index = Number(event.currentTarget.name);
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

    if(Number(this.state.equipReservados.length) <= 0) {
      this.props.setError("Por favor, insira ao menos uma familia e sua quantidade.");
      this.handleNewEquipment(event);
      return;
    }

    if(this.state.equipReservados[0].familia === "" || this.state.equipReservados[0].value === 0 || this.state.equipReservados[0].value === "" || this.state.equipReservados[0].value === null) {
      this.props.setError("Por favor, insira ao menos uma familia e sua quantidade.");
      this.setState(update(this.state, {
        equipReservados: {
          [0]: {
            isMissingFamilia: { $set: true }
          }
        }
      }));
      return;
    }

    //if(this.state.equipReservados.length) {
      for(var i=1; i<this.state.equipReservados.length; i++) {
        //console.log("i: " + i);
        if((this.state.equipReservados[i].familia !== "" || this.state.equipReservados[i].familia !== undefined) && (this.state.equipReservados[i].value === "")) {
          this.props.setError("Por favor, insira a quantidade faltante do equipamento.");
          return;
        }
      }
    //}

    for(var i = 0; i < this.state.equipReservados.length; i++) {
      //console.log("i " + i);
      for(var j = 1 + i; j < this.state.equipReservados.length; j++) {
        //console.log("j " + j);
        if(this.state.equipReservados[i].familia === this.state.equipReservados[j].familia && (this.state.equipReservados[i].tipo === null || this.state.equipReservados[i].tipo === undefined) && (this.state.equipReservados[j].tipo == null || this.state.equipReservados[j].tipo === undefined)) {
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
    const index = Number(name);
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
    }));
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
                    setInfoNumber={this.funcSetInfoNumber}
                    isMissingTipo={false}
                    isMissingFamilia={false}
                    isInputDisabled={equipReservado.isInputDisabled}
                  />
                </Col>
                <Col xs={9} md={3}>
                  <SelectField
                    name={index}
                    labelStyle={{position: 'absolute'}}
                    floatingLabelText="Quantidade"
                    value={equipReservado.quantidade}
                    onChange={this.handleChangeQuantidade}
                    disabled={this.props.isInputDisabled}
                    floatingLabelStyle={{color: 'grey', left: '0px'}}
                    disabled={equipReservado.tipo === null || this.props.isInputDisabled}
                    fullWidth={true}
                    autoWidth={true}
                  >
                    {[...Array(equipReservado.maxQuantidade)].map((i) => (
                      <MenuItem
                        key={i}
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
                    onTouchTap={this.handleRemoveEquipment}
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
                  primary={false}
                  onTouchTap={this.handleNewEquipment}
                />
              </Col>
              <Col xs={1}/>
              <Col>
                <RaisedButton
                  name="submit"
                  type="button"
                  label="Enviar"
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
  setInfoNumber: PropTypes.func,
  isInputDisabled: PropTypes.bool.isRequired,
  isMissingTipo: PropTypes.bool.isRequired,
  isMissingFamilia: PropTypes.bool.isRequired,
  isDataSubmitted: PropTypes.bool.isRequired,
  submissionMessage: PropTypes.string.isRequired,
  infoNumber: PropTypes.number.isRequired,
  quantidadeReserve: PropTypes.func.isRequired,
  quantidade: PropTypes.number,
  name: PropTypes.string,
  usuario: PropTypes.string,
  equipInfos: PropTypes.array,
};
