import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid';
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
      dateFinal: ""
    }
    this.props.clearMissingFieldsError();
    this.formatDate = this.formatDate.bind(this);
    this.handleChangeDateInit = this.handleChangeDateInit.bind(this);
    this.handleChangeDateFinal = this.handleChangeDateFinal.bind(this);
  }

  componentDidMount() {
    this.props.setSelectedTipo("", null);
    this.props.setSelectedFamilia("", null);
    this.props.setQuantidadeEquipGraph([0,0,0], 0);
  }


  componentWillReceiveProps(nextProps) {
    if(nextProps.quantidade !== this.props.quantidade && nextProps.quantidade !== null) {
      console.log("quantidade: " + nextProps.quantidade);
    }

    if(nextProps.referencia !== this.props.referencia && nextProps.referencia !== null) {
      console.log("referencia: " + nextProps.referencia);
    }

    if(nextProps.familia !== this.props.familia && nextProps.familia !== null || nextProps.tipo !== this.props.tipo && nextProps.tipo !== null) {
      console.log("familia: " + this.props.familia + " familia: " + nextProps.familia);
      console.log("tipo: " + this.props.tipo + " tipo: " + nextProps.tipo);
      if(this.state.dateInit !== "" && this.state.dateFinal !== "") {
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

    if(this.props.familia !== null) {
      var dateInicial = (this.state.dateInit.getFullYear() + '-' + ("0" + (this.state.dateInit.getMonth()+1)).slice(-2) + '-' + ("0" + this.state.dateInit.getDate()).slice(-2));
      var dateFinal = (date.getFullYear() + '-' + ("0" + (date.getMonth()+1)).slice(-2) + '-' + ("0" + date.getDate()).slice(-2));
      //console.log("Inicial: " + dateInicial + " Final: " + dateFinal);

      this.props.quantidadeEquipsGraph(this.props.familia, this.props.tipo, dateInicial, dateFinal);
    }
  }

  render () {
    return (
      <div>
        <Grid fluid >
          <Row bottom="xs" around="xs" center="xs" >
            <Col xs={0} sm={2} md={3}/>
            <Col xs={12} sm={8} md={6} >
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
            </Col>
            <Col xs={0} sm={2} md={3}/>
          </Row>
          <Row bottom="xs" around="xs" center="xs" >
            <Col xs={0} sm={2} md={3}/>
            <Col xs={12} sm={4} md={3}>
              <DatePicker
                hintText="Selecione a data inicial"
                value={this.state.dateInit !== '' ? this.state.dateInit : null}
                onChange={this.handleChangeDateInit}
                autoOk={true}
                formatDate={this.formatDate}
                maxDate={new Date(Date.now())}
                firstDayOfWeek={0}
                cancelLabel="Cancelar"
                locale='pt-BR'
                autoWidth={true}
                fullWidth={true}
                //style={style}
                inputStyle={{ textAlign: 'center' }}
              />
            </Col>
            <Col xs={12} sm={4} md={3}>
              <DatePicker
                hintText="Selecione a data final"
                value={this.state.dateFinal !== '' ? this.state.dateFinal : null}
                onChange={this.handleChangeDateFinal}
                autoOk={true}
                formatDate={this.formatDate}
                disabled={this.state.dateInit !== '' ? false : true}
                minDate={this.state.dateInit !== '' ? this.state.dateInit : null}
                maxDate={new Date(Date.now())}
                firstDayOfWeek={0}
                locale='pt-BR'
                autoWidth={true}
                fullWidth={true}
                //style={style}
                inputStyle={{ textAlign: 'center' }}
              />
            </Col>
            <Col xs={0} sm={2} md={3}/>
          </Row>

          <Col xs={0} sm={2} md={3}/>
          {"Máximo Emprestado Manhã: " + this.props.quantidade[0] + " / Máximo Emprestado Tarde: " + this.props.quantidade[1] + " / Máximo Emprestado Noite: " + this.props.quantidade[2] + " - Máxima Referência: " + this.props.referencia}
          <Col xs={0} sm={2} md={3}/>

          <div
            style={{
              width: '60%'
            }}
            >
            <Row center="xs, sm, md" >
              <Col xs={12} sm={12} md={12}>
                <Bar
                  type= { 'bar' }
                  data={{
                    labels: ['Manhã', 'Tarde', 'Noite'],
                    datasets: [
                      {
                        label: 'Máximo Emprestado',
                        data: this.props.quantidade,
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
                />
              </Col>
            </Row>
          </div>
        </Grid>
      </div>
    );
  }
}

EquipsGraphics.propTypes = {
  clearMissingFieldsError: PropTypes.func.isRequired,
  setSelectedTipo: PropTypes.func.isRequired,
  setSelectedFamilia: PropTypes.func.isRequired,
  setQuantidadeEquipGraph: PropTypes.func.isRequired,
  tipo: PropTypes.number,
  familia: PropTypes.number,
  isMissingFamilia: PropTypes.bool.isRequired,
  isMissingTipo: PropTypes.bool.isRequired,
  isInputDisabled: PropTypes.bool.isRequired,
  submissionMessage: PropTypes.string.isRequired,
  setInfoNumber: PropTypes.func.isRequired,
  infoNumber: PropTypes.number.isRequired,
  quantidadeEquipsGraph: PropTypes.func.isRequired,
  getFamilias: PropTypes.func.isRequired,
  getTipos: PropTypes.func.isRequired,
  quantidade: PropTypes.array,
  referencia: PropTypes.number
};
