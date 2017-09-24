import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import CheckCircle from 'material-ui/svg-icons/action/check-circle';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import AlertWarning from 'material-ui/svg-icons/alert/warning'
import RefreshIndicator from 'material-ui/RefreshIndicator';
import Sticky from 'react-stickynode';
import Paper from 'material-ui/Paper';
import update from 'immutability-helper';

const getReserveEquipColor = (value) => {
  let color = "#000000";
  if(value.current > value.total)
    color = "#ff0000";
  else if(value.current == value.total)
    color = "#118811";
  return color;
}

const getReserveEquipSymbol = (value) => {
  if(value.current == value.total) {
    return (<CheckCircle
      style={{height: '15px', verticalAlign: 'middle'}}
      color="#118811"
      viewBox= "2 2 23 23"
    />)
  }
  if(value.current > value.total) {
    return (<AlertWarning
      style={{height: '15px', verticalAlign: 'middle'}}
      color="#ff0000"
      viewBox= "2 2 23 23"
    />)
  }

  return;
}

export default class ReadEquipsReserve extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fieldValueOnFocus: "",
      fieldErrorTextOnFocus: "",
      fieldTipoOnFocus: null,
    }
    this.findTipoById = this.findTipoById.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleAddBarCode = this.handleAddBarCode.bind(this);
    this.handleRemoveBarCode = this.handleRemoveBarCode.bind(this);
    this.clearAllFields = this.clearAllFields.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  componentDidMount() {
    if(this.props.tipos.length === 0)
      this.props.getTipos();
  }

  componentWillUpdate(nextProps) {
    if(nextProps.barCodes === this.props.barCodes || nextProps.barCodes.length != this.props.barCodes.length)
      return;

    this.props.barCodes.forEach((barCode, barCodeIndex) => {
      if(nextProps.barCodes[barCodeIndex] == null)
        return;
      const newTipo = nextProps.barCodes[barCodeIndex].equipTipo;
      if(barCode.equipTipo === newTipo)
        return;

      let prevTipoIndexReserve = null;
      let newTipoIndexReserve = null;
      if(barCode.equipTipo != null)
        prevTipoIndexReserve = this.props.reserveEquips.findIndex(reserveEquip =>
            reserveEquip.tipo == barCode.equipTipo)
      if(newTipo != null)
        newTipoIndexReserve = this.props.reserveEquips.findIndex(reserveEquip =>
            reserveEquip.tipo == newTipo)

      if(newTipoIndexReserve != null) {
        if(newTipoIndexReserve < 0)
          this.props.setBarcodeErrorText(barCodeIndex, "Equipamento não faz parte do pedido");
        else {
          if(this.props.barCodes.filter(repBar => repBar.value == barCode.value).length > 1)//equip already exists in array
            this.props.setBarcodeErrorText(barCodeIndex, "Equipamento já está presente no pedido");
          else
            this.props.incrementMissingReserve(newTipoIndexReserve);
        }
      }

      if(prevTipoIndexReserve != null && prevTipoIndexReserve >= 0
          && barCode.errorText == "" && nextProps.barCodes[barCodeIndex].errorText == "")
        this.props.decrementMissingReserve(prevTipoIndexReserve);
    })
  }

  findTipoById(tipoId) {
    return this.props.tipos.find(tipo =>
        tipoId == tipo.id_tipo
    )
  }

  handleTextFieldChange(event) {
    const value = event.currentTarget.value;
    const index = Number(event.currentTarget.name);
    const newValue = (value.match("[0-9]+") || []).pop() || '';
    this.props.setBarcodeValue(index, newValue);
  }

  handleKeyPress(event) {
    if(event.key === 'Enter' && event.currentTarget.value != "") {
      this.handleAddBarCode(event);
    }
  }

  handleAddBarCode(event) {
    const indexOfEmptyField = this.props.barCodes.findIndex(equip =>
      equip.value == ""
    )
    if(indexOfEmptyField < 0)
      this.props.addBarcode();
    else
      this.refs["textField"+indexOfEmptyField].focus();
  }

  handleRemoveBarCode(event) {
    const index = Number(event.currentTarget.name);
    if(this.props.barCodes.length > 1) {
      const removedEquipTipo = this.props.barCodes[index].equipTipo;
      const removedEquipValue = this.props.barCodes[index].value;
      if(removedEquipTipo != null) {
        if(this.props.barCodes.filter(repBar => repBar.value == removedEquipValue).length == 1) {//not repeated equip
          const equipTipoIndexReserve = this.props.reserveEquips.findIndex(reserveEquip =>
              reserveEquip.tipo == removedEquipTipo)
          if(equipTipoIndexReserve >= 0)
            this.props.decrementMissingReserve(equipTipoIndexReserve);
        }
        else {
          const otherEquipIndex = this.props.barCodes.findIndex((repBarCode, repIndex)  =>
              repBarCode.value == removedEquipValue && index != repIndex
          )
          this.props.setBarcodeErrorText(otherEquipIndex, "")
        }
      }
      this.props.removeBarcode(index);
    }
    else {
      this.props.setBarcodeValue(index, "");
      this.props.clearBarcodeTipo(index);
    }
  }

  handleFocus(event) {
    const index = Number(event.currentTarget.name);
    this.props.setBarcodeErrorText(index, "");
    this.props.clearBarcodeTipo(index);
    this.setState(update(this.state, {
      fieldValueOnFocus: {$set: this.props.barCodes[index].value},
      fieldErrorTextOnFocus: {$set: this.props.barCodes[index].errorText},
      fieldTipoOnFocus: {$set: this.props.barCodes[index].equipTipo}
    }));
  }

  handleBlur(event) {
    const index = Number(event.currentTarget.name);
    if(!this.props.barCodes[index].value) {
      this.props.clearBarcodeTipo(index);
      return;
    }

    const value = this.props.barCodes[index].value;
    if(this.state.fieldValueOnFocus != value)
      this.props.getEquipTipo(index, Number(value));
    else if(this.state.fieldErrorTextOnFocus != "") {
      this.props.setBarcodeErrorText(index, this.state.fieldErrorTextOnFocus);
      this.props.setBarcodeTipo(index, this.state.fieldTipoOnFocus);
    }
  }

  clearAllFields(event) {
    this.props.clearBarcodes();
    for (let index = 0; index<this.props.reserveEquips.length; index++) {
      this.props.resetMissingReserve(index);
    }
  }

  render () {

    let reserveInfo;
    if(this.props.tipos.length === 0 || this.props.reserveEquips.length === 0) {
      reserveInfo = <RefreshIndicator
            size={40}
            left={0}
            top={0}
            status='loading'
             style={{marginLeft: '50%', position: 'relative', background: 'white', pointerEvents: 'none'}}
          />
    }
    else {
      reserveInfo = this.props.reserveEquips.map((value, index) => (
        <Row
          key={index}
          start="xs"
          middle="xs"
          style={{
            background: index%2 ? 'white' : '#CCF1F6',
            fontFamily: 'Roboto,sans-serif',
            fontSize: '16px',
            color: getReserveEquipColor(value)
          }}
        >
          <Col xs={9} sm={9} md={10}>
            {this.findTipoById(value.tipo).Familia.familia + " " + this.findTipoById(value.tipo).tipo
              + (value.current > value.total ? " (" + (value.current - value.total) + " em Excesso)" : "")}
          </Col>
          <Col xs={3} sm={3} md={2}>
            <Row center="xs" middle="xs">
              <Col>
                <div
                  style={{
                    display: 'inline-block',
                    width: '42.55px',
                    marginTop: '5px',
                    marginBottom: '5px',
                  }}
                >
                  <div
                    style={{
                      textAlign: 'center',
                      marginLeft: value.current < 10 && value.total >=10 ? '9px' : '',
                      marginRight: value.current >=10 && value.total < 10 ? '9px' : ''
                    }}
                  >
                    {value.current + "/" + value.total}
                  </div>
                </div>
              </Col>
              <Col style={{width: '24px'}}>
                {getReserveEquipSymbol(value)}
              </Col>
            </Row>
          </Col>
        </Row>
      ))
    }


    return (
      <div>
        <Grid fluid >
          <Row around="xs" start="xs">
            <Col xs={12} sm={7} md={6}>
              <Sticky enabled={true} innerZ={3} >
                <Row style={{height: '15px', 'background': 'white'}}/>
                <Row
                  style={{'background': 'white', fontFamily: 'Roboto,sans-serif', fontSize: '16px'}}
                  start="xs"
                  bottom="xs"
                >
                  <Col xs={8} sm={9}>
                    <b>
                      Equipamentos pedidos
                    </b>
                  </Col>
                  <Col xs={4} sm={3}>
                    <b>
                      Separados/Total
                    </b>
                  </Col>
                </Row>
                {reserveInfo}
                <Row
                  middle="xs"
                  center="xs"
                  style={{'background': 'white', height: '55px'}}
                >
                  <Col >
                    <RaisedButton
                      name="add"
                      type="button"
                      label="Adicionar"
                      primary={true}
                      onTouchTap={this.handleAddBarCode}
                    />
                  </Col>
                  <Col xs={1}/>
                  <Col >
                    <RaisedButton
                      name="clear"
                      type="button"
                      label="Limpar tudo"
                      primary={true}
                      onTouchTap={this.clearAllFields}
                    />
                  </Col>
                </Row>

              </Sticky>
            </Col>
            <Col xs={12} sm={5} md={6}>
              {this.props.barCodes.map((barCode, index) => (
                <Row key={index} bottom="xs" center="xs" style={{position: "relative"}}>
                  <Col xs={10}>
                    <RefreshIndicator
                      size={50}
                      left={0}
                      top={20}
                      status={barCode.isLoading ? 'loading' : 'hide'}
                      style={{marginLeft: '40%', position: 'absolute', pointerEvents: 'none'}}
                    />
                    {barCode.equipTipo && barCode.errorText == '' ?
                      <Paper
                        zDepth={2}
                        rounded={false}
                        style={{marginTop: '14px', height: '58px', display: 'flex', alignItems: 'center'}}
                      >
                        <text style={{marginLeft: '19.5px'}}>
                          {"  " + barCode.value + " - " + this.findTipoById(barCode.equipTipo).Familia.familia + " "
                              + this.findTipoById(barCode.equipTipo).tipo}
                        </text>
                      </Paper>
                      :
                      <TextField
                        autoFocus
                        ref={"textField" + index}
                        name={index.toString()}
                        hintText={"Patrimônio do Equipamento"}
                        floatingLabelText={barCode.equipTipo ?
                            this.findTipoById(barCode.equipTipo).Familia.familia + " "
                            + this.findTipoById(barCode.equipTipo).tipo : "Equipamento"}
                        value={barCode.value}
                        onChange={this.handleTextFieldChange}
                        onBlur={this.handleBlur}
                        onFocus={this.handleFocus}
                        onKeyPress={this.handleKeyPress}
                        errorText={barCode.errorText}
                        floatingLabelStyle={{color: 'grey'}}
                        disabled={barCode.isLoading}
                        fullWidth={true}
                        style={{display: 'inherit'}}
                      />
                    }
                  </Col>
                  <Col xs={2}>
                    <FloatingActionButton
                      mini={true}
                      type="button"
                      name={index}
                      backgroundColor="#ff0000"
                      disabled={barCode.isLoading}
                      onTouchTap={this.handleRemoveBarCode}
                      zDepth={1}
                    >
                      {(this.props.barCodes.length < 2) ? <NavigationClose /> : <ActionDelete/>}
                    </FloatingActionButton>
                  </Col>
                </Row>
              ))}
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

ReadEquipsReserve.propTypes = {
  setInfoNumber: PropTypes.func.isRequired,
  setBarcodeValue: PropTypes.func.isRequired,
  clearBarcodeTipo: PropTypes.func.isRequired,
  setBarcodeTipo: PropTypes.func.isRequired,
  removeBarcode: PropTypes.func.isRequired,
  addBarcode: PropTypes.func.isRequired,
  clearBarcodes: PropTypes.func.isRequired,
  incrementMissingReserve: PropTypes.func.isRequired,
  decrementMissingReserve: PropTypes.func.isRequired,
  resetMissingReserve: PropTypes.func.isRequired,
  setBarcodeErrorText: PropTypes.func.isRequired,
  getEquipTipo: PropTypes.func.isRequired,
  getTipos: PropTypes.func.isRequired,
  barCodes: PropTypes.array,
  reserveEquips: PropTypes.array,
  tipos: PropTypes.array,
};
