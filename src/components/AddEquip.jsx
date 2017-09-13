import React, { PropTypes } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import EquipTypeSelectorContainer from '../containers/EquipTypeSelectorContainer.jsx';
import update from 'immutability-helper';

const style = {
  verticalAlign: 'bottom',
  margin: 5,
};

const infos = [
  'Selecione uma Família de Equipamentos',
  'Selecione um Tipo de Equipamento',
  'Escaneie ou digite o código dos equipamentos a serem registrados'
];

export default class AddEquip extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      patrimonios: [
        {value: "", errorText: ""}
      ]
    }
    this.props.clearMissingFieldsError();
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleNewEquipment = this.handleNewEquipment.bind(this);
    this.handleRemoveEquipment = this.handleRemoveEquipment.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleSubmitChangingType = this.handleSubmitChangingType.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
  }

  handleCloseDialog() {
    if(this.props.isDataSubmitted) {
      this.props.setSelectedTipo("", null);
      this.props.setSelectedFamilia("", null);
      this.props.setInfoNumber(0);
      this.props.clearMissingFieldsError();
      this.state = {
        patrimonios: [
          {value: "", errorText: ""}
        ]
      }
    }
    else if(this.props.errorCauseEquipNumbers.length > 0) {
      let message = "";
      if(this.props.errorCode === "ER_WARN_DATA_OUT_OF_RANGE")
        message = "Código Excedeu o limite de tamanho";
      else if(this.props.errorCode === "WAR_DUP_ENTRY")
        message = "Equipamento já registrado";
      let newState = this.state
      this.props.errorCauseEquipNumbers.forEach((equip, indexErrorEquip) => {
        const index = this.state.patrimonios.findIndex(patrimonio =>
          equip == patrimonio.value
        );
        newState = update(newState, {
          patrimonios: {
            [index]: { errorText: { $set: message} }
          }
        });
      });
      this.setState(newState);
    }
    this.props.clearMissingFieldsError();
    this.props.clearSubmissionMessage();
  }

  handleTextFieldChange(event) {
    const value = event.currentTarget.value;
    const index = Number(event.currentTarget.name);
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
    this.setState(update(this.state, {
      patrimonios: {
        $push: [
          {
            value: "",
            errorText: ""
          }
        ]
      }
    }));
  }

  handleRemoveEquipment(event) {
    const index = Number(event.currentTarget.name);
    this.setState(update(this.state, {
      patrimonios: {
        $splice: [[index, 1]]
      }
    }));
  }

  handleFormSubmit(event) {
    let patrimonios = this.state.patrimonios.filter(pat => pat.value !== "").map(pat => Number(pat.value));
    this.props.insertEquips(this.props.usuario, patrimonios, this.props.tipo, false)
  }

  handleSubmitChangingType(event) {
    let patrimonios = this.state.patrimonios.filter(pat => pat.value !== "").map(pat => Number(pat.value));
    this.props.insertEquips(this.props.usuario, patrimonios, this.props.tipo, true)
  }

  render () {
    let actions = [];
    if(this.props.isYesNoMessage) {
      actions = [
        <FlatButton
          label="SIM"
          primary={false}
          onTouchTap={this.handleSubmitChangingType}
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
;

    const infoNumber = infos[this.props.infoNumber];

    return (
      <div>
				<Dialog
          actions={actions}
          modal={false}
          open={this.props.submissionMessage !== ""}
          onRequestClose={this.handleCloseDialog}
          autoScrollBodyContent={true}
        >
          {this.props.submissionMessage.split(/\\n/).map((item, key) => {
            return <span key={key}>{item}<br/></span>
          })}
        </Dialog>
        <br/>
        <div
          style={{
            'fontFamily': 'Roboto,sans-serif'
          }}
        >
          {infoNumber}
        </div>
        <form onSubmit=
          {
            e => {
              e.preventDefault()
            }
          }
        >
          <Grid fluid >
            <Row bottom="xs" around="xs" center="xs" >
              <Col xs={0} sm={2} md={3}/>
              <Col xs={12} sm={8} md={6} >
                <EquipTypeSelectorContainer
                  tipo={this.props.tipo}
                  familia={this.props.familia}
                  setSelectedTipo={this.props.setSelectedTipo}
                  setSelectedFamilia={this.props.setSelectedFamilia}
                  setInfoNumber={this.props.setInfoNumber}
                  isMissingTipo={this.props.isMissingTipo}
                  isMissingFamilia={this.props.isMissingFamilia}
                  isInputDisabled={this.props.isInputDisabled}
                />
              </Col>
              <Col xs={0} sm={2} md={3}/>
            </Row>
            {this.state.patrimonios.map((patrimonio, index) => (
              <Row key={index} bottom="xs" around="xs" center="xs" >
                <Col xs={0} sm={3} md={4}/>
                <Col xs={10} sm={4} md={3}>
                  <TextField
                    autoFocus
                    name={index.toString()}
                    hintText="Patrimônio do Equipamento"
                    floatingLabelText="Equipamento"
                    value={patrimonio.value}
                    onChange={this.handleTextFieldChange}
                    onKeyPress={this.handleKeyPress}
                    errorText={patrimonio.errorText}
                    floatingLabelStyle={{color: 'grey'}}
                    disabled={this.props.isInputDisabled}
                    fullWidth={true}
                  />
                </Col>
                <Col xs={2} sm={1} md={1}>
                  <FloatingActionButton
                    mini={true}
                    type="button"
                    name={index}
                    backgroundColor="#ff0000"
                    onTouchTap={this.handleRemoveEquipment}
                    zDepth={1}
                    style={style}
                  >
                    <ActionDelete />
                  </FloatingActionButton>
                </Col>
                <Col xs={0} sm={3} md={4}/>
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
                  style={style}
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
                  style= {style}
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

AddEquip.propTypes = {
  insertEquips: PropTypes.func.isRequired,
  clearSubmissionMessage: PropTypes.func.isRequired,
  clearErrorDescription: PropTypes.func,
  clearMissingFieldsError: PropTypes.func.isRequired,
  setSelectedTipo: PropTypes.func.isRequired,
  setSelectedFamilia: PropTypes.func.isRequired,
  setInfoNumber: PropTypes.func.isRequired,
  isInputDisabled: PropTypes.bool.isRequired,
  tipo: PropTypes.number,
  familia: PropTypes.number,
  usuario: PropTypes.string.isRequired,
  isMissingTipo: PropTypes.bool.isRequired,
  isMissingFamilia: PropTypes.bool.isRequired,
  isDataSubmitted: PropTypes.bool.isRequired,
  submissionMessage: PropTypes.string.isRequired,
  errorCauseEquipNumbers: PropTypes.array,
  errorCode: PropTypes.string.isRequired,
  infoNumber: PropTypes.number.isRequired,
};
