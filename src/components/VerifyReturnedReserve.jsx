import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import { Grid, Row, Col } from 'react-flexbox-grid';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import InformationTable from './InformationTable.jsx';
import update from 'immutability-helper';

const headers = [
  "Equipamento",
  "Quantidade",
  "Patrimônio(s) Faltante(s)"
]

const initialRead = {value: "", errorText: ""}

const infoText = "Clique em OK para aceitar ou clique em um item para conferência"

const findNotContainedAinB = (A, B) => {
  var missingElements = [];
  A.forEach(function(elem) {
    if(!B.includes(elem))
      missingElements.push(elem);
  });
  return missingElements;
}

export default class VerifyReturnedReserve extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      readEquipsByTipo: {},
      readingEquips: [],
      readingFamily: null,
    }
    this.handleSelectedTipo = this.handleSelectedTipo.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleAcceptAll = this.handleAcceptAll.bind(this);
    this.handleReadEquipsClose = this.handleReadEquipsClose.bind(this);
    this.handleCancelEquipRead = this.handleCancelEquipRead.bind(this);
    this.handleClearEquip = this.handleClearEquip.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleRegisterReturnedEquips = this.handleRegisterReturnedEquips.bind(this);
  }

  handleSelectedTipo(name) {
    let readEquips;
    if(this.state.readEquipsByTipo[name] === undefined) {
      const quant = this.props.lentEquips.find(equip => equip.name == name).count;
      readEquips = Array(quant).fill(initialRead);
    }
    else {
      readEquips = this.state.readEquipsByTipo[name].map(equip => {
        if(equip != "" && !this.props.lentEquips.find(equip => equip.name == name).equips
            .includes(Number(equip)))
          return {value: equip, errorText: "Equipamento Incorreto"};
        else
          return {value: equip, errorText: ""};
      });
    }
    this.setState(update(this.state, {
      readingEquips: {$set: readEquips},
      readingFamily: {$set: name}
    }));
  }

  handleKeyPress(event) {
    if(event.key === 'Enter') {
      const indexOfEmptyField = this.state.readingEquips.findIndex(equip =>
        equip.value == ""
      )
        if(indexOfEmptyField >= 0)
          this.refs["textField"+indexOfEmptyField].focus();
    }
  }

  handleTextFieldChange(event) {
    const value = event.currentTarget.value;
    const index = Number(event.currentTarget.name);
    const newValue = (value.match("[0-9]+") || []).pop() || '';
    let newErrorText = this.state.readingEquips[index].errorText;
    if(newValue != this.state.readingEquips[index].value)
      newErrorText = "";
    this.setState(update(this.state, {
      readingEquips: {
        [index]: {
          value: { $set: newValue },
          errorText: { $set: newErrorText }
        }
      }
    }));
  }

  handleClearEquip(event) {
    const index = Number(event.currentTarget.name);
    this.setState(update(this.state, {
      readingEquips: {
        [index]: {
          value: { $set: "" },
          errorText: { $set: "" },
        }
      }
    }));
  }

  handleCloseDialog() {
    if(this.props.isDataSubmitted)
      this.props.router.push("/returnReserve");
    this.props.setSubmissionMessage("");
  }

  handleAcceptAll() {
    const missingEquips = this.props.lentEquips.map(lentEquip => {
      if(this.state.readEquipsByTipo[lentEquip.name] !== undefined)
        return findNotContainedAinB(lentEquip.equips,
            this.state.readEquipsByTipo[lentEquip.name].map(equip => Number(equip)));
      else
        return [];
    });
    this.props.setIsYesNoMessage(true);
    if(missingEquips.filter(elem => elem.length > 0) > 0)
      this.props.setSubmissionMessage("Existem equipamentos faltantes. Registrar mesmo assim?");
    else
      this.props.setSubmissionMessage("O pedido foi conferido?");
  }

  handleReadEquipsClose() {
    if(this.state.readingEquips.filter(equip => equip.value != "").length > 0
        || this.state.readEquipsByTipo[this.state.readingFamily] !== undefined)
      this.setState(update(this.state, {
        readEquipsByTipo: {
          [this.state.readingFamily]: {$set: this.state.readingEquips.map(equip => equip.value)}
        },
        readingFamily: {$set: null}
      }));
    else {
      this.setState(update(this.state, {
        readingFamily: {$set: null}
      }));
    }
  }

  handleCancelEquipRead() {
    this.setState(update(this.state, {
      readingFamily: {$set: null}
    }));
  }

  handleBlur(event) {
    const index = Number(event.currentTarget.name);
    if(this.state.readingEquips[index].value != ""
          && !this.props.lentEquips.find(equip => equip.name == this.state.readingFamily).equips
          .includes(Number(this.state.readingEquips[index].value))) {
      this.setState(update(this.state, {
        readingEquips: {
          [index]: {
            errorText: { $set: "Equipamento incorreto" },
          }
        }
      }));
    }
  }

  handleRegisterReturnedEquips() {
    let equipsToRegister = [];
    this.props.lentEquips.forEach(lentEquip => {
      if(this.state.readEquipsByTipo[lentEquip.name] === undefined)
        equipsToRegister = equipsToRegister.concat(lentEquip.equips);
      else
        equipsToRegister = equipsToRegister.concat(this.state.readEquipsByTipo[lentEquip.name]
              .filter(equip => lentEquip.equips.includes(Number(equip))).map(equip => Number(equip)));
    });
    this.props.registerReturnedEquips(this.props.reserveId, equipsToRegister, usuario);
  }

  render () {
    let actions;
    actions = [
      <FlatButton
        label="CANCELAR"
        primary={false}
        onTouchTap={this.handleCancelEquipRead}
      />,
      <FlatButton
        label="OK"
        primary={true}
        onTouchTap={this.handleReadEquipsClose}
      />,
    ];

    return (
      <div>
        <Grid fluid >
          <Dialog
            actions={actions}
            modal={false}
            open={this.state.readingFamily != null}
            onRequestClose={this.handleReadEquipsClose}
            autoScrollBodyContent={true}
          >
            {this.state.readingEquips.map((patrimonio, index) => (
              <Row key={index} bottom="xs" center="xs" >
                <Col xs={10} sm={7}>
                  <TextField
                    ref={"textField" + index}
                    name={index.toString()}
                    hintText="Patrimônio do Equipamento"
                    floatingLabelText={this.state.readingFamily}
                    value={patrimonio.value}
                    onChange={this.handleTextFieldChange}
                    onKeyPress={this.handleKeyPress}
                    errorText={patrimonio.errorText}
                    floatingLabelStyle={{color: 'grey'}}
                    onBlur={this.handleBlur}
                    fullWidth={true}
                  />
                </Col>
                <Col xs={2} sm={1} md={1}>
                  <FloatingActionButton
                    mini={true}
                    type="button"
                    name={index}
                    backgroundColor="#ff0000"
                    onTouchTap={this.handleClearEquip}
                    zDepth={1}
                  >
                    <NavigationClose />
                  </FloatingActionButton>
                </Col>
              </Row>
            ))}
          </Dialog>
        </Grid>
        <div
          style={{
            'fontFamily': 'Roboto,sans-serif'
          }}
        >
          {infoText}
        </div>
        <InformationTable
          handleCloseDialog={this.handleCloseDialog}
          callbackOnYesDialog={this.handleRegisterReturnedEquips}
          handleSelectedLine={this.handleSelectedTipo}
          selectedLineIndexToSend={0}
          isYesNoMessage={this.props.isYesNoMessage}
          informationLines={
            this.props.lentEquips.map(lentEquip => [lentEquip.name, lentEquip.count,
                this.state.readEquipsByTipo[lentEquip.name] === undefined ?
                "" :
                findNotContainedAinB(lentEquip.equips,
                    this.state.readEquipsByTipo[lentEquip.name].map(equip => Number(equip))).join(', ')])
          }
          headerNames={headers}
          dialogMessage={this.props.dialogMessage}
        />
        <Grid fluid>
          <Row
            bottom="xs"
            center="xs"
            style={{'background': 'white', height: '55px'}}
          >
            <Col >
              <RaisedButton
                name="submit"
                type="button"
                label="Marcar como Conferido"
                primary={true}
                onTouchTap={this.handleAcceptAll}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

VerifyReturnedReserve.propTypes = {
  registerReturnedEquips: PropTypes.func.isRequired,
  setSubmissionMessage: PropTypes.func.isRequired,
  setIsYesNoMessage: PropTypes.func.isRequired,
  dialogMessage: PropTypes.string.isRequired,
  isYesNoMessage: PropTypes.bool.isRequired,
  isDataSubmitted: PropTypes.bool.isRequired,
  lentEquips: PropTypes.array.isRequired,
  usuario: PropTypes.string.isRequired,
  reserveId: PropTypes.number
};
