import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

export default class ProvideReserve extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      callbackOnYesDialog: null,
    }
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleReserveSelect = this.handleReserveSelect.bind(this);
    this.handleReserveConfirm = this.handleReserveConfirm.bind(this);
  }

  componentWillMount() {
    this.props.getReserves()
  }

  handleCloseDialog() {
    if(this.props.isDataSubmitted) {
      this.props.getReserves()
      this.props.clearDataSent();
    }
    this.props.setSubmissionMessage("");
  }

  handleReserveSelect(id, user, carrinhos) {
    let message;
    if(carrinhos.length === 1)
      message = "O Carrinho " + carrinhos + " deve ser entregue.";
    else if(carrinhos.length === 2)
      message = "Os Carrinhos " + carrinhos.join(' e ') + " devem ser entregues.";
    else
      message = "Os Carrinhos " + carrinhos.join(', ') + " devem ser entregues.";
    this.props.setSubmissionMessage("Tem certeza que deseja entregar o pedido para o professor " + user + "\\n" + message);
    this.props.setIsYesNoMessage(true);
    this.setState(update(this.state, {
      callbackOnYesDialog: {$set: () => this.handleReserveConfirm(id)}
    }));
  }

  handleReserveConfirm(id) {
    this.props.registerDeliveredReserve(id);
  }

  render () {
    let actions = [];
    if(this.props.isYesNoMessage) {
      actions = [
        <FlatButton
          label="SIM"
          primary={false}
          onTouchTap={this.state.callbackOnYesDialog}
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

    return (
      <div>
				<Dialog
          actions={actions}
          modal={false}
          open={this.props.dialogMessage !== ""}
          onRequestClose={this.handleCloseDialog}
          autoScrollBodyContent={true}
        >
          {this.props.dialogMessage.split(/\\n/).map((item, key) => {
            return <span key={key}>{item}<br/></span>
          })}
        </Dialog>
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
              <TableHeaderColumn style={{fontSize: '16px'}}>Professor</TableHeaderColumn>
              <TableHeaderColumn style={{fontSize: '16px'}}>Carrinho(s)</TableHeaderColumn>
              <TableHeaderColumn style={{fontSize: '16px'}}>Quantidade</TableHeaderColumn>
              <TableHeaderColumn style={{fontSize: '16px'}}>Matéria</TableHeaderColumn>
            </TableRow>
          </TableHeader>

          <TableBody
            displayRowCheckbox={false}
            showRowHover={true}
            stripedRows={true}
          >
            {this.props.reserves.map((reserve) => (
              <TableRow
                key={reserve.idReq}
                name={reserve.idReq.toString()}
                style={{cursor: 'pointer'}}
                onTouchTap={() => this.handleReserveSelect(reserve.idReq, reserve.user, reserve.carrinhos)}
              >
                <TableRowColumn style={{fontSize: '16px'}}>{reserve.user}</TableRowColumn>
                <TableRowColumn style={{fontSize: '16px'}}> {reserve.carrinhos.join(', ')}</TableRowColumn>
                <TableRowColumn style={{fontSize: '16px'}}>{reserve.quantidade}</TableRowColumn>
                <TableRowColumn style={{fontSize: '16px'}}>{reserve.materia}</TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }
}

ProvideReserve.propTypes = {
  getReserves: PropTypes.func.isRequired,
  setSubmissionMessage: PropTypes.func.isRequired,
  clearDataSent: PropTypes.func.isRequired,
  setIsYesNoMessage: PropTypes.func.isRequired,
  registerDeliveredReserve: PropTypes.func.isRequired,
  reserves: PropTypes.array.isRequired,
  dialogMessage: PropTypes.string.isRequired,
  isYesNoMessage: PropTypes.bool.isRequired,
  isDataSubmitted: PropTypes.bool.isRequired,
};
