import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import Sticky from 'react-stickynode';
import update from 'immutability-helper';

const leftArray = [
  {
    equip: "Scope",
    quantidade: 3,
  },
  {
    equip: "Analisador",
    quantidade: 4,
  },
  {
    equip: "Kit",
    quantidade: 5,
  },
];

const initialState = {
  barCodes: [
    {
      value: "",
      errorText: ""
    }
  ]
}

export default class ReadEquipsReserve extends React.Component {

  constructor(props) {
    super(props);
    this.state = initialState;
  }

  render () {
    let equips = [];
    [...Array(10)].forEach((i, index) => (
      equips.push({
        value: "",
        errorText: "",
        isLoading: (index%2 == 0 ? 'loading' : 'hide'),
        errorText: (index%2 == 1 ? 'Equipamento Não encontrado' : '')
      })
    ))

    return (
      <div>
        <Grid fluid >
          <Row around="xs" start="xs">
            <Col xs={12} sm={5}>
              <Sticky enabled={true} innerZ={3} >
                <Row style={{height: '10px'}}/>
                {leftArray.map((value, index) => (
                  <Row key={index}
                    start="xs"
                    style={{'background': 'white', 'fontFamily': 'Roboto,sans-serif'}}
                  >
                    <Col xs={11} sm={10} md={8}>
                      {value.equip}
                    </Col>
                    <Col xs={1}>
                      {value.quantidade}
                    </Col>
                  </Row>
                ))}
              </Sticky>
            </Col>
            <Col xs={12} sm={7}>
              {equips.map((barCode, index) => (
                <Row key={index} middle="xs" bottom="xs" center="xs" style={{position: "relative"}}>
                  <Col xs={10}>
                    <RefreshIndicator
                      size={50}
                      left={0}
                      top={20}
                      status={barCode.isLoading}
                      style={{marginLeft: '40%', position: "absolute"}}
                    />
                    <TextField
                      autoFocus
                      name={index.toString()}
                      hintText={"Patrimônio do Equipamento"}
                      floatingLabelText={"Equipamento"}
                      value={barCode.value}
                      onChange={this.handleTextFieldChange}
                      onKeyPress={this.handleKeyPress}
                      errorText={barCode.errorText}
                      floatingLabelStyle={{color: 'grey'}}
                      disabled={barCode.isLoading == 'loading'}
                      fullWidth={true}
                      style={{display: 'inherit'}}
                    />
                  </Col>
                  <Col xs={2}>
                    <FloatingActionButton
                      mini={true}
                      type="button"
                      name={index}
                      backgroundColor="#ff0000"
                      disabled={barCode.isLoading == 'loading'}
                      onTouchTap={this.handleRemoveEquipment}
                      zDepth={1}
                    >
                      <ActionDelete />
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
};
