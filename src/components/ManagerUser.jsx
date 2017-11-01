import React from 'react';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import update from 'immutability-helper';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import { Grid, Row, Col } from 'react-flexbox-grid';
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
  'Administrador',
  'Almoxarifado',
];

export default class ManagerUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeReserve: "",
    }
    this.handleForcedSubmit = this.handleForcedSubmit.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
  }

  handleForcedSubmit(event) {
  }
    
  handleCloseDialog(event) {
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

        <Grid fluid >
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
        </Grid>
      </div>
    )
  }
}

ManagerUser.propTypes = {
};
