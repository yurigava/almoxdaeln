import React from 'react';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
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

export default class AddReserve extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      timeReserve: "",
      dateReserve: "",
      materia: "",
      flagStopAvailable: true,
      changeDateTime: false,
      isPopoverOpened: false,
      anchorEl: null
    }
    this.handleNewEquipment = this.handleNewEquipment.bind(this);
    this.handleRemoveEquipment = this.handleRemoveEquipment.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleChangeMateria = this.handleChangeMateria.bind(this);
    this.funcSetSelectedFamilia = this.funcSetSelectedFamilia.bind(this);
    this.funcSetSelectedTipo = this.funcSetSelectedTipo.bind(this);
    this.handleChangeQuantidade = this.handleChangeQuantidade.bind(this);
    this.handleForcedSubmit = this.handleForcedSubmit.bind(this);
    this.findTipoById = this.findTipoById.bind(this);
    this.findFamiliaById = this.findFamiliaById.bind(this);
    this.handleSelectReq = this.handleSelectReq.bind(this);
    this.openPopover = this.openPopover.bind(this);
    this.handleClosePopover = this.handleClosePopover.bind(this);
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

  componentDidMount() {
    this.props.clearEquips();
    this.props.setDataSubmitted(false);
    this.props.setInfoNumber(3);
    this.props.getLastReq(this.props.usuario);
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

    for(var i=0; i<this.props.equipInfos.length ; i++) {
      if(nextProps.equipInfos[i].availableEquips !== this.props.equipInfos[i].availableEquips && nextProps.equipInfos[i].availableEquips !== null && this.state.flagStopAvailable === false) {
        for(var j=0; j<this.props.equipInfos.length ; j++) {
          if(this.props.equipInfos[j].familia === this.props.equipInfos[i].familia) {
            equips = equips + this.props.equipInfos[j].quantidade;

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
            news >= nextProps.equipInfos[i].availableEquips ? this.props.setAvailable(i, nextProps.equipInfos[i].availableEquips) : this.props.setAvailable(i, news);
          }
          else{
            var news = nextProps.equipInfos[i].availableEquips - equips;
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

      this.props.insertReserve(this.props.usuario, sendDateReserve, this.state.timeReserve, this.state.materia, equips);
      this.props.setIsYesNoMessage(false);
    }
  }

  handleCloseDialog() {
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

  handleKeyPress(event) {
    if(event.key === 'Enter') {
      this.handleNewEquipment(event);
    }
  }

  handleNewEquipment(event) {
    if(this.props.equipInfos[this.props.equipInfos.length-1].quantidade === null) {
      return
    }
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
    }
  }

  handleFormSubmit(event) {
    event.preventDefault();
    if(this.props.equipInfos[this.props.equipInfos.length-1].quantidade === null) {
      return
    }

    let message = null;
    this.props.equipInfos.forEach(equip => {
      message = (message === null ? "" : message) + this.findFamiliaById(equip.familia).familia + " " + (this.findTipoById(equip.tipo) !== null ? " " + this.findTipoById(equip.tipo).tipo : "") + " - " + equip.quantidade + "\n";
    });

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

    this.props.setError("Deseja reservar os equipamentos?");
    this.props.setIsYesNoMessage(true);
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
      if(this.props.equipInfos[i].tipo === tipo && tipo !== null) {
        this.props.setError("Não é possível selecionar dois tipos de famílias iguais!");
        //this.props.setAvailable(name, 0);
        this.props.removeEquip(name);
        this.props.setIsYesNoMessage(false);
        duplicado = true;
        return;
      }
    }

    duplicado === false ? this.props.setSelectedTipo(name, tipo) : tipo = null

    if(tipo === null) {
    }
    else{
      this.props.quantidadeReserve(this.props.equipInfos[name].familia, tipo, name);
      this.props.setQuantidade(name, null);

      this.setState(update(this.state, {
        flagStopAvailable: { $set: false }
      }));
    }
  }

  handleChangeQuantidade(name, event, key, payload) {
    var ultimoEquip = name;
    var flag = true;
    for(var i = 0; i < ultimoEquip; i++) {
      if(this.props.equipInfos[ultimoEquip].familia === this.props.equipInfos[i].familia && this.props.equipInfos[ultimoEquip].tipo === null && this.props.equipInfos[i].tipo === null & i !== ultimoEquip) {
        flag = false;
        this.props.setError("Não é possível selecionar duas famílias iguais sem tipo!");
        this.props.setIsYesNoMessage(false);
        return;
      }
    }
    if (flag) {
      this.props.setQuantidade(name, key+1);
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

  handleSelectReq(index) {
    var equips = [];
    this.props.reqEquips.forEach( equip => {
      if(equip.id === index) {
        equips.push({
          familia: equip.familia,
          tipo: equip.tipo,
          quantidade: equip.quantidade
        });
      }
    });
    this.props.clearEquips();
    for(var i=0; i<=equips.length-1 ; i++) {
      this.props.setSelectedFamilia(i, equips[i].familia);
      this.props.setSelectedTipo(i, equips[i].tipo);
      this.props.setQuantidade(i, equips[i].quantidade);
      this.props.addEquip();
    }
    this.props.setInfoNumber(3);
    this.props.removeEquip(i);
    this.setState(update(this.state, {
      flagStopAvailable:  { $set: true },
      isPopoverOpened: {$set: false}
    }));
  }

  openPopover(event) {
    event.preventDefault();
    this.setState(update(this.state, {
      isPopoverOpened: {$set: true},
      anchorEl: {$set: event.currentTarget},
    }))
  }

  handleClosePopover() {
    this.setState(update(this.state, {
      isPopoverOpened: {$set: false},
    }))
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
                  floatingLabelStyle={{color: 'grey'}}
                  fullWidth={true}
                />
              </Col>
            </Row>
            {this.props.equipInfos.map((equipReservado, index) => (
              <Row bottom="xs" around="xs" center="xs" key={index} >
                <Col xs={11} sm={11} md={11} >
                  {equipReservado.familia !== null && equipReservado.quantidade !== null ?
                    <div>
                      <Row bottom="xs" around="xs" center="xs" key={index} >
                        <Col xs={11} sm={11} md={11} >
                          <Paper
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
                      <Col xs={12} sm={3} md={3}>
                        <SelectField
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
            <Row bottom="xs" center="xs" style={{height: '60px'}} >
              <Col>
                <RaisedButton
                  name="add"
                  type="button"
                  label="Adicionar"
                  disabled={this.props.equipInfos[this.props.equipInfos.length-1].quantidade === null ? true : false}
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
                  disabled={this.props.equipInfos[this.props.equipInfos.length-1].quantidade === null ? true : false}
                  primary={true}
                  onTouchTap={this.handleFormSubmit}
                />
              </Col>
            </Row>

            <Row middle="xs" center="xs" style={{height: '55px'}} >
              <Col>
                <RaisedButton
                  label="Preencher com dados anteriores"
                  primary={false}
                  onClick={this.openPopover}
                  disabled={this.props.lastReq == 0 || this.props.lastReq[0].id === null}
                />
              </Col>
            </Row>

            <Popover
              open={this.state.isPopoverOpened}
              anchorEl={this.state.anchorEl}
              animated={false}
              onRequestClose={this.handleClosePopover}
            >
              <Menu >
                {this.props.lastReq.map((equipReservado, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => this.handleSelectReq(equipReservado.id)}
                    primaryText={" " + equipReservado.dataDeUso + " / " + equipReservado.turno + " / " + equipReservado.materia}
                  />
                ))}
              </Menu>
            </Popover>
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
