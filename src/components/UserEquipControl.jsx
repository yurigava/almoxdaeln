import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import RaisedButton from 'material-ui/RaisedButton';
import update from 'immutability-helper';

const style = {
  verticalAlign: 'bottom',
  margin: 5,
};

const infos = [
  'Escaneie ou digite o Código do usuário.',
  'Escaneie ou digite o código de um Equipamento',
  'Continue adicionando equipamentos, ou insira o código do usuário novamente para terminar o pedido.'
];

const initialState = {
  infoNumber: 0,
  barCodes: [
    {index: 0, name: "barCode0", value: "", errorText: ""}
  ]
}

export default class UserEquipControl extends React.Component {

  constructor(props) {
    super(props);
    this.state = initialState;
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleNewBarCode = this.handleNewBarCode.bind(this);
    this.handleRemoveEquipment = this.handleRemoveEquipment.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
  }

  handleCloseDialog() {
    if(this.props.isDataSubmitted) {
      this.state = initialState;
      this.props.clearDataSent();
    }
    else if(this.props.errorCauseEquipNumbers.length > 0) {
      let message = this.props.selectEquipErrorMessage(this.props.errorCode);
      let newState = this.state
      this.props.errorCauseEquipNumbers.forEach((equip, indexErrorEquip) => {
        const index = this.state.barCodes.findIndex(barCode =>
          equip == barCode.value
        );
        newState = update(newState, {
          barCodes: {
            [index]: { errorText: { $set: message} }
          }
        });
      });
      this.setState(newState);
    }
    this.props.clearErrorDescription();
    this.props.setSubmissionMessage("");
  }

  handleNewBarCode(event) {
    let hasEmptyFields = false
    let newState = this.state;
    for (var i = 0; i < this.state.barCodes.length; i++) {
      if(this.state.barCodes[i].value === "") {
        hasEmptyFields = true;
        newState = update(newState, {
          barCodes: {
            [i]: {
              errorText: { $set: "Preencha este campo antes de criar um novo" }
            }
          }
        });
      }
    }
    if(hasEmptyFields) {
      this.setState(newState);
      return;
    }
    const barCodes = this.state.barCodes;
    if(barCodes.length > 1 && barCodes[barCodes.length-1].value === barCodes[0].value) {
      barCodes.pop();
      this.setState(update(this.state, {
        barCodes: {$set: barCodes}
      }));
      this.handleFormSubmit(null)
      return;
    }
    let newInfoNumber = 1;
    if(barCodes.length > 1) {
      newInfoNumber = 2;
    }
    let nextIndex = 0
    if(barCodes.length > 0)
      nextIndex = barCodes[barCodes.length-1].index+1
    this.setState(update(this.state, {
      barCodes: {
        $push: [
          {
            index: nextIndex,
            name: "barCode"+nextIndex,
            value: "",
            errorText: ""
          }
        ]
      },
      infoNumber: {$set: newInfoNumber}
    }));
  }

  handleTextFieldChange(event) {
    const value = event.currentTarget.value;
    const index = this.findEquipIndex(event.currentTarget.name, this.state.barCodes);
    const newValue = (value.match("[0-9]+") || []).pop() || '';
    let newErrorText = this.state.barCodes[index].errorText;
    if(newValue != this.state.barCodes[index].value)
      newErrorText = "";
    this.setState(update(this.state, {
      barCodes: {
        [index]: {
          value: { $set: newValue },
          errorText: { $set: newErrorText }
        }
      }
    }));
  }

  handleKeyPress(event) {
    if(event.key === 'Enter') {
      this.handleNewBarCode(event);
    }
  }

  handleRemoveEquipment(event) {
    const index = this.findEquipIndex(event.currentTarget.name, this.state.barCodes);
    if(index === 0) {
      this.props.setSubmissionMessage("Para modificar o usuário do pedido, edite o campo do usuário.");
      return;
    }
    let newInfoNumber = 2;
    if(this.state.barCodes.length < 3)
      newInfoNumber = 0;
    else if(this.state.barCodes.length < 4)
      newInfoNumber = 1;
    this.setState(update(this.state, {
      barCodes: { $splice: [[index, 1]] },
      infoNumber: { $set: newInfoNumber }
    }));
  }

  handleFormSubmit(event) {
    if(this.state.barCodes.length < 2 || this.state.barCodes[0].value === "") {
      this.props.setSubmissionMessage("Erro: Adicione o código do usuário e ao menos um equipamento.");
      this.props.clearDataSent();
      return;
    }
    let usuario = Number(this.state.barCodes[0].value);
    let patrimonios = this.state.barCodes.filter(code => code.value !== "").map(code => Number(code.value));
    if(patrimonios[0] == patrimonios[patrimonios.length - 1])
      patrimonios.pop();
    patrimonios.shift();
    if(patrimonios.length < 1) {
      this.props.setSubmissionMessage("Erro: Adicione ao menos um equipamento.");
      this.props.clearDataSent();
      return;
    }
    this.props.submitForm(usuario, patrimonios)
  }

  findEquipIndex(name, barCodes) {
    return barCodes.findIndex(barCode =>
      name == barCode.name
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

    const infoText = infos[this.state.infoNumber];

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
          {infoText}
        </div>
        <form onSubmit=
          {
            e => {
              e.preventDefault()
            }
          }
        >
          {this.state.barCodes.map((barCode) => (
            <div key={barCode.index}>
              <TextField
                autoFocus
                name={"barCode"+barCode.index}
                hintText={barCode.index === 0 ? "Código do Usuário" : "Patrimônio do Equipamento"}
                floatingLabelText={barCode.index === 0 ? "Usuário" : "Equipamento"}
                value={barCode.value}
                onChange={this.handleTextFieldChange}
                onKeyPress={this.handleKeyPress}
                errorText={barCode.errorText}
                floatingLabelStyle={{color: 'grey'}}
                disabled={this.props.isInputDisabled}
              />
              <FloatingActionButton
                mini={true}
                type="button"
                name={"barCode"+barCode.index}
                backgroundColor="#ff0000"
                onTouchTap={this.handleRemoveEquipment}
                zDepth={1}
                style={style}
              >
                <ActionDelete />
              </FloatingActionButton>
            </div>
          ))}
          <br/>
          <RaisedButton
            name="add"
            type="button"
            style={style}
            label="Adicionar"
            primary={true}
            onTouchTap={this.handleNewBarCode}
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
    )
  }
}

UserEquipControl.propTypes = {
  clearErrorDescription: PropTypes.func.isRequired,
  selectEquipErrorMessage: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
  setSubmissionMessage: PropTypes.func.isRequired,
  clearDataSent: PropTypes.func.isRequired,
  submissionMessage: PropTypes.string.isRequired,
  isDataSubmitted: PropTypes.bool.isRequired,
  isInputDisabled: PropTypes.bool.isRequired,
  errorCauseEquipNumbers: PropTypes.array.isRequired,
  errorCode: PropTypes.string.isRequired,
};
