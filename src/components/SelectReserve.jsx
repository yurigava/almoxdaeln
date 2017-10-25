import React from 'react';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import update from 'immutability-helper';

const shifts = [
  "Manhã",
  "Tarde",
  "Noite",
]

const infos = [
  'Selecione o turno para preparar reservas ou altere a data para visalizar os próximos pedidos.',
  'Clique no pedido que deseja separar.',
  'Nenhum pedido para o dia e turno selecionados.'
];

const shouldDisableDate = (day) => {
  return (day.getDay() == 0);
}

const getNextShift = () => {
  const hoursNow = new Date().getHours();
  if(hoursNow <= 12)//Morning shift prepares evening requests
    return 1;
  if(hoursNow <= 17)//Evening shift prepares night requests
    return 2;
  //Night shift prepares morning requests
    return 0;
}

const getDefaultDate = () => {
  let defaultDate = new Date();
  if(getNextShift() == 0)
    defaultDate.setTime(defaultDate.getTime() + 24*60*60*1000);

  return defaultDate;
}

export default class SelectReserve extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      date: getDefaultDate(),
      shift: getNextShift(),
    }
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleShiftChange = this.handleShiftChange.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleReserveSelect = this.handleReserveSelect.bind(this);
  }

  componentWillMount() {
    const year = this.state.date.getFullYear();
    const month = this.state.date.getMonth()+1;
    const day = this.state.date.getDate();
    this.props.getReserves(year + "-" + month + "-" + day, this.state.shift);
  }

  handleDateChange(event, date) {
    this.setState(update(this.state, {
      date: {$set: date },
      shift: {$set: null}
    }))
    this.props.setInfoNumber(0);
  }

  handleShiftChange(event, index, shift) {
    this.setState(update(this.state, {
      shift: {$set: shift }
    }))
    const year = this.state.date.getFullYear();
    const month = this.state.date.getMonth()+1;
    const day = this.state.date.getDate();
    this.props.getReserves(year + "-" + month + "-" + day, shift);
    this.props.setInfoNumber(2);
  }

  handleCloseDialog() {
    this.props.clearSubmissionMessage();
  }

  handleReserveSelect(id) {
    this.props.setInfoNumber(0);
    this.props.router.push("/prepareReserve/readEquips");
    if(this.props.loadedRequisicao === null || this.props.loadedRequisicao != id) {
      this.props.clearReserves();
      this.props.getReserveDetails(id);
    }
  }

  render () {
    const actions = [
      <FlatButton
        label="OK"
        primary={true}
        onTouchTap={this.handleCloseDialog}
      />,
    ];

    const infoText = infos[this.props.infoNumber];

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
        <Grid fluid >
          <Row bottom="xs" around="xs" center="xs" >
            <Col xs={0} sm={2} md={3}/>
            <Col xs={12} sm={4} md={3} >
              <DatePicker
                value={this.state.date}
                floatingLabelText="Data"
                floatingLabelStyle={{color: 'grey', left: '0px'}}
                cancelLabel="Cancelar"
                autoOk={true}
                onChange={this.handleDateChange}
                disabled={this.props.isInputDisabled}
                firstDayOfWeek={0}
                DateTimeFormat={Intl.DateTimeFormat}
                locale='pt-BR'
                shouldDisableDate={shouldDisableDate}
                minDate={new Date(Date.now())}
                fullWidth={true}
              />
            </Col>
            <Col xs={12} sm={4} md={3} >
              <SelectField
                floatingLabelText="Turno"
                value={this.state.shift}
                onChange={this.handleShiftChange}
                disabled={this.props.isInputDisabled}
                floatingLabelStyle={{color: 'grey', left: '0px'}}
                labelStyle={{position: 'absolute'}}
                autoWidth={true}
                fullWidth={true}
              >
                {shifts.map((shift, index) => (
                  <MenuItem key={index} value={index} primaryText={shift}/>
                ))}
              </SelectField>
            </Col>
            <Col xs={0} sm={2} md={3}/>
          </Row>
        </Grid>

        <Table
          fixedHeader={true}
          selectable={false}
          multiSelectable={false}
        >
          <TableHeader
            enableSelectAll={false}
            displaySelectAll={false}
            adjustForCheckbox={false}
          >
            <TableRow>
              <TableHeaderColumn style={{color: 'black', fontWeight: 'bold', fontSize: '16px'}}>Quantidade</TableHeaderColumn>
              <TableHeaderColumn style={{color: 'black', fontWeight: 'bold', fontSize: '16px'}}>Professor</TableHeaderColumn>
              <TableHeaderColumn style={{color: 'black', fontWeight: 'bold', fontSize: '16px'}}>Matéria</TableHeaderColumn>
            </TableRow>
          </TableHeader>

          <TableBody
            displayRowCheckbox={false}
            showRowHover={true}
            stripedRows={true}
          >
            {this.props.reserves.map( (reserve) => (
              <TableRow
                key={reserve.idReq}
                name={reserve.idReq.toString()}
                style={{cursor: 'pointer'}}
                onTouchTap={() => this.handleReserveSelect(reserve.idReq)}
              >
                <TableRowColumn style={{fontSize: '16px'}}>{reserve.quantidade}</TableRowColumn>
                <TableRowColumn style={{fontSize: '16px'}}>{reserve.user}</TableRowColumn>
                <TableRowColumn style={{fontSize: '16px'}}>{reserve.materia}</TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }
}

SelectReserve.propTypes = {
  getReserves: PropTypes.func.isRequired,
  getReserveDetails: PropTypes.func.isRequired,
  clearReserves: PropTypes.func.isRequired,
  clearSubmissionMessage: PropTypes.func.isRequired,
  setInfoNumber: PropTypes.func.isRequired,
  reserves: PropTypes.array.isRequired,
  isInputDisabled: PropTypes.bool.isRequired,
  infoNumber: PropTypes.number.isRequired,
  submissionMessage: PropTypes.string.isRequired,
  loadedRequisicao: PropTypes.number
};
