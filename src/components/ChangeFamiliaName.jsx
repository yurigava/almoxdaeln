import React, { PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import update from 'immutability-helper';

const style = {
  verticalAlign: 'bottom',
  margin: 5,
};

const infos = [
  'Selecione uma Família de Equipamentos',
  'Digite o novo nome da Família'
];

const initialState = {
  isMissingFamiliaNewName: false,
  isMissingFamilia: false,
  familiaNewName: "",
  familia: null,
  info: 0
}

export default class ChangeFamiliaName extends React.Component {

  constructor(props) {
    super(props);
    this.state = initialState;
    this.handleFamiliaChange = this.handleFamiliaChange.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentDidMount() {
    if(this.props.familias.length === 0)
      this.props.getFamilias();
  }

  handleCloseDialog() {
    if(this.props.isDataSubmitted) {
      this.state = initialState;
      this.props.getFamilias();
    }
    this.props.clearSubmissionMessage();
  }

  handleFamiliaChange(event, index, familia) {
    if(familia == this.props.familia)
      return;
    this.setState(update(this.state, {
      familia: {$set: familia},
      info: {$set: 1}
    }))
  }

  handleTextFieldChange(event) {
    const value = event.currentTarget.value;
    this.setState(update(this.state, {
      familiaNewName: {$set: value},
    }))
  }

  handleFormSubmit(event) {
    if(this.state.familia === null) {
      this.setState(update(this.state, {
        isMissingFamilia: {$set: true},
      }))
      return;
    }
    if(this.state.familiaNewName === "") {
      this.setState(update(this.state, {
        isMissingFamiliaNewName: {$set: true},
      }))
      return;
    }
    this.props.updateFamiliaName(this.state.familia, this.state.familiaNewName)
  }

  render () {
    const infoNumber = infos[this.state.info];

    const actions = [
     <FlatButton
       label="OK"
       primary={true}
       onTouchTap={this.handleCloseDialog}
     />,
    ];

    return (
      <div>
				<Dialog
          actions={actions}
          modal={false}
          open={this.props.submissionMessage !== ""}
          onRequestClose={this.handleCloseDialog}
          autoScrollBodyContent={true}
        >
          {this.props.submissionMessage}
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
          <SelectField
            style={style}
            floatingLabelText="Família a ser alterada"
            value={this.state.familia}
            onChange={this.handleFamiliaChange}
            disabled={this.props.isInputDisabled}
            autoWidth={true}
            errorText={(this.state.isMissingFamilia && this.state.familia === null) ?
              "Campo Família não pode ser deixado em branco" : ""}
            floatingLabelStyle={{color: 'grey', left: '0px'}}
          >
            {this.props.familias.map((familia) => (
              <MenuItem key={familia.id_familia} value={familia.id_familia} primaryText={familia.familia} />
            ))}
          </SelectField>
          &nbsp;
          <TextField
            style={style}
            name="familia"
            hintText="Novo nome para a Família"
            floatingLabelText="Família"
            value={this.state.familiaNewName}
            disabled={this.props.isInputDisabled}
            onChange={this.handleTextFieldChange}
            errorText={(this.state.isMissingFamiliaNewName && this.state.familiaNewName === "") ?
              "Campo Família não pode ser deixado em branco" : ""}
            floatingLabelStyle={{color: 'grey'}}
          />
          <br/>
          <br/>
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

ChangeFamiliaName.propTypes = {
  getFamilias: PropTypes.func.isRequired,
  updateFamiliaName: PropTypes.func.isRequired,
  clearSubmissionMessage: PropTypes.func.isRequired,
  familias: PropTypes.array.isRequired,
  isInputDisabled: PropTypes.bool.isRequired,
  submissionMessage: PropTypes.string.isRequired,
  isDataSubmitted: PropTypes.bool.isRequired,
};
