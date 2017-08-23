import React, { PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import update from 'immutability-helper';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import EquipTypeSelectorContainer from '../containers/EquipTypeSelectorContainer.jsx';
import DatePicker from 'material-ui/DatePicker';
import {Doughnut, HorizontalBar, Bar} from 'react-chartjs-2';

const style = {
  verticalAlign: 'bottom',
  margin: 1,
  display: "inline-block",
  color: 'black',
};

const style_bar = {
  verticalAlign: 'bottom',
  margin: 1,
  display: "inline-block",
  color: 'black',
  width: '10',
};

export default class EquipsGraphics extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dateInit: "",
      dateFinal: "",
      width: 15,      
      style_bar: 
        { verticalAlign: 'center', margin: 1, display: "inline-block", color: 'black', barPercentage: 50 }
    }
    this.props.clearMissingFieldsError();
    this.formatDate = this.formatDate.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleChangeDateInit = this.handleChangeDateInit.bind(this);
    this.handleChangeDateFinal = this.handleChangeDateFinal.bind(this);
    this.raiseWidth = this.raiseWidth.bind(this);
    this.lowerWidth = this.lowerWidth.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    //console.log("atual: " + this.props.width + " prox: " + nextProps.width);
    this.setState(update(this.state, {
      style_bar: {
          barPercentage: { $set: nextProps.width},
        },
        width: { $set: nextProps.width}
    }));

    if(nextProps.quantidade !== this.props.quantidade && nextProps.quantidade !== null) {
      console.log("quantidade: " + nextProps.quantidade);
    }

    if(nextProps.referencia !== this.props.referencia && nextProps.referencia !== null) {
      console.log("referencia: " + nextProps.referencia);
    }

    if(nextProps.familia !== this.props.familia && nextProps.familia !== null) {
      console.log("familia: " + nextProps.familia);
    }
    //console.log("this.props.quantidade: " + this.props.quantidade + " nextProps.quantidade: " + nextProps.quantidade);
  }

  formatDate(date) {
    return (("0" + date.getDate()).slice(-2) + '/' + ("0" + (date.getMonth()+1)).slice(-2) + '/' + date.getFullYear());
  }

  handleChangeDateInit(event, date) {
    //console.log("init: " + date + " final: " + this.state.dateFinal);
    if(this.state.dateFinal !== "" && this.state.dateFinal < date) {
      this.setState(update(this.state, {
        dateInit: { $set: date },
        dateFinal: { $set: "" },
      }));
    }
    else {
      this.setState(update(this.state, {
        dateInit: { $set: date }
      }));
    }
  }

  handleChangeDateFinal(event, date) {
    this.setState(update(this.state, {
      dateFinal: { $set: date }
    }));

    var dateInicial = (this.state.dateInit.getFullYear() + '-' + ("0" + (this.state.dateInit.getMonth()+1)).slice(-2) + '-' + ("0" + this.state.dateInit.getDate()).slice(-2));
    var dateFinal = (date.getFullYear() + '-' + ("0" + (date.getMonth()+1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2));
    console.log("Inicial: " + dateInicial + " Final: " + dateFinal);
    //(("0" + date.getDate()).slice(-2) + '-' + ("0" + (date.getMonth()+1)).slice(-2) + '-' + date.getFullYear());
    this.props.quantidadeEquipsGraph(this.props.familia, this.props.tipo, dateInicial, dateFinal);
  }

  handleCloseDialog() {    
    if(this.props.isDataSubmitted) {
      this.props.setSelectedTipo("", null);
      this.props.setSelectedFamilia("", null);
      this.props.setInfoNumber(0);
      this.props.clearMissingFieldsError();
    }
    this.props.clearMissingFieldsError();
    this.props.clearSubmissionMessage();
  }

  raiseWidth() {
    if(this.props.width < 10)
      this.props.raiseLowerWidth(this.props.width, 0.2);
  }

  lowerWidth() {
    if(this.props.width > 0)
      this.props.raiseLowerWidth(this.props.width, -0.2);
  }

  barData() {
    var equips = [];
  }

  render () {
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
        >
          {this.props.submissionMessage}
        </Dialog>
        <br/>

        <EquipTypeSelectorContainer 
          tipo={this.props.tipo}
          familia={this.props.familia}
          setSelectedFamilia={this.props.setSelectedFamilia}
          setSelectedTipo={this.props.setSelectedTipo}
          isMissingTipo={this.props.isMissingTipo}
          isMissingFamilia={this.props.isMissingFamilia}
          setInfoNumber={this.props.setInfoNumber}
          isInputDisabled={this.props.isInputDisabled}
        />

        <DatePicker
          hintText="Selecione a data inicial"
          value={this.state.dateInit !== '' ? this.state.dateInit : null}
          onChange={this.handleChangeDateInit}
          autoOk={true}
          formatDate={this.formatDate}
          //minDate={new Date(Date.now() + 1*24*60*60*1000)}
          style={style}
          inputStyle={{ textAlign: 'center' }}
        />
        &nbsp;
        <DatePicker
          hintText="Selecione a data final"
          value={this.state.dateFinal !== '' ? this.state.dateFinal : null}
          onChange={this.handleChangeDateFinal}
          autoOk={true}
          formatDate={this.formatDate}
          //minDate={this.state.dateInit}
          minDate={this.state.dateInit !== '' ? this.state.dateInit : null}
          style={style}
          inputStyle={{ textAlign: 'center' }}
        />
        <br/>
        <div 
          style={{
            //width:this.state.width + '%'
            //width:this.props.width + '%',
            width: '80%'
            //maxWidth: '1000'
          }}
          >
          <Bar
            data={{
              labels: ['Manhã', 'Tarde', 'Noite'],
              datasets: [
                {
                  label: 'My First dataset',
                  backgroundColor: 'rgba(255,99,132,0.2)',
                  borderColor: 'rgba(255,99,132,1)',
                  borderWidth: 1,
                  hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                  hoverBorderColor: 'rgba(255,99,132,1)',
                  data: [this.props.quantidade]
                },
                {
                  label: 'Line Dataset',
                  data: [ this.props.referencia, this.props.referencia, this.props.referencia ],
                  // Changes this dataset to become a line
                  type: 'line'
                }
              ]
            }}
            options={{
              //maintainAspectRatio: false
            }}
            //style={style}
            />
        </div>

        <RaisedButton
          name="raise"
          type="button"
          style={style}
          label="Aumentar"
          primary={true}
          onTouchTap={this.raiseWidth}
        />
        &nbsp;
        <RaisedButton
          name="lower"
          type="button"
          style={style}
          label="Diminuir"
          primary={true}
          onTouchTap={this.lowerWidth}
        />
        <br/>
        {this.props.width}
        <br/>
        {"max : " + this.props.quantidade + " - Referência: " + this.props.referencia}
      </div>
    );
  }
}

EquipsGraphics.propTypes = {
  clearSubmissionMessage: PropTypes.func.isRequired,
  clearMissingFieldsError: PropTypes.func.isRequired,
  setSelectedTipo: PropTypes.func.isRequired,
  setSelectedFamilia: PropTypes.func.isRequired,
  tipo: PropTypes.number,
  familia: PropTypes.number,
  isMissingFamilia: PropTypes.bool.isRequired,
  isMissingTipo: PropTypes.bool.isRequired,
  isInputDisabled: PropTypes.bool.isRequired,
  submissionMessage: PropTypes.string.isRequired,
  setInfoNumber: PropTypes.func.isRequired,
  infoNumber: PropTypes.number.isRequired,
  raiseLowerWidth: PropTypes.func,
  width: PropTypes.number,
  quantidadeEquipsGraph: PropTypes.func.isRequired,
  quantidade: PropTypes.number,
  referencia: PropTypes.number
};
