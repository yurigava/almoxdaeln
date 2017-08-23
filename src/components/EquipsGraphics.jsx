import React, { PropTypes } from 'react';
import update from 'immutability-helper';
import RaisedButton from 'material-ui/RaisedButton';
import EquipTypeSelectorContainer from '../containers/EquipTypeSelectorContainer.jsx';
import DatePicker from 'material-ui/DatePicker';
import {Doughnut, HorizontalBar, Bar} from 'react-chartjs-2';

const style = {
  verticalAlign: 'bottom',
  margin: 1,
  display: "inline-block",
  color: 'black',
};

export default class EquipsGraphics extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dateInit: "",
      dateFinal: "",
      width: 75
    }
    this.props.clearMissingFieldsError();
    this.formatDate = this.formatDate.bind(this);
    this.handleChangeDateInit = this.handleChangeDateInit.bind(this);
    this.handleChangeDateFinal = this.handleChangeDateFinal.bind(this);
    this.raiseWidth = this.raiseWidth.bind(this);
    this.lowerWidth = this.lowerWidth.bind(this);
  }

  componentDidMount() {
  }


  componentWillReceiveProps(nextProps) {
    //console.log("atual: " + this.props.width + " prox: " + nextProps.width);
    this.setState(update(this.state, {
        width: { $set: nextProps.width}
    }));

    if(nextProps.quantidadeM !== this.props.quantidadeM && nextProps.quantidadeM !== null) {
      console.log("quantidadeM: " + nextProps.quantidadeM);
    }

    if(nextProps.referencia !== this.props.referencia && nextProps.referencia !== null) {
      console.log("referencia: " + nextProps.referencia);
    }

    if(nextProps.familia !== this.props.familia && nextProps.familia !== null || nextProps.tipo !== this.props.tipo && nextProps.tipo !== null) {
      console.log("familia: " + nextProps.familia + " tipo: " + nextProps.tipo);

      if(this.state.dateInit !== "" && this.state.dateFinal !== "") {
        console.log("passou");
        var dateInicial = (this.state.dateInit.getFullYear() + '-' + ("0" + (this.state.dateInit.getMonth()+1)).slice(-2) + '-' + ("0" + this.state.dateInit.getDate()).slice(-2));
        var dateFinal = (this.state.dateFinal.getFullYear() + '-' + ("0" + (this.state.dateFinal.getMonth()+1)).slice(-2) + '-' + ("0" + this.state.dateFinal.getDate()).slice(-2));
        this.props.quantidadeEquipsGraph(nextProps.familia, nextProps.tipo, dateInicial, dateFinal);
      }

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

      if(date !== "" && this.state.dateFinal !== "") {
        console.log("passou");
        var dateInicial = (date.getFullYear() + '-' + ("0" + (date.getMonth()+1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2));
        var dateFinal = (this.state.dateFinal.getFullYear() + '-' + ("0" + (this.state.dateFinal.getMonth()+1)).slice(-2) + '-' + ("0" + this.state.dateFinal.getDate()).slice(-2));
        this.props.quantidadeEquipsGraph(this.props.familia, this.props.tipo, dateInicial, dateFinal);
      }
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

  raiseWidth() {
    if(this.props.width < 100)
      this.props.raiseLowerWidth(this.props.width, 5);
  }

  lowerWidth() {
    if(this.props.width > 0)
      this.props.raiseLowerWidth(this.props.width, -5);
  }

  render () {
    return (
      <div>
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
        {"Máximo Emprestado Manhã: " + this.props.quantidadeM + " / Máximo Emprestado Tarde: " + this.props.quantidadeT + " / Máximo Emprestado Noite: " + this.props.quantidadeN + " - Máxima Referência: " + this.props.referencia}
        <br/>
        <div 
          style={{
            //width: this.props.width+'%'
            width: this.state.width+'%'
            //width: '75%'
            //maxWidth: '1000'
          }}
          >
          <Bar
            type= { 'bar' }
            data={{
              labels: ['Manhã', 'Tarde', 'Noite'],
              datasets: [
                {
                  label: 'Máximo Emprestado',
                  data: [this.props.quantidadeM, this.props.quantidadeT, this.props.quantidadeN],
                  backgroundColor: 'rgba(255,99,132,0.2)',
                  borderColor: 'rgba(255,99,132,1)',
                  borderWidth: 1,
                  hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                  hoverBorderColor: 'rgba(255,99,132,1)',
                  type: 'bar'
                },
                {
                  label: 'Máximo Disponível',
                  data: [ this.props.referencia, this.props.referencia, this.props.referencia ],
                  backgroundColor: 'rgba(255,99,132,0)',
                  borderColor: 'rgba(25,9,1,1)',
                  borderWidth: 2,
                  type: 'line'
                }
              ]
            }}
            options= {{
              scales: {
                yAxes: [{
                  stacked: true
                }]
              },
              title: {
                display: true,
                text: "Quantidade máxima de equipamentos emprestados",
                fontSize: 25
              }
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
        {this.state.width + '%'}
      </div>
    );
  }
}

EquipsGraphics.propTypes = {
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
  getFamilias: PropTypes.func.isRequired,
  getTipos: PropTypes.func.isRequired,
  quantidadeM: PropTypes.number,
  quantidadeT: PropTypes.number,
  quantidadeN: PropTypes.number,
  referencia: PropTypes.number
};
