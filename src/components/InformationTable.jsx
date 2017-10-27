import React from 'react';
import Dialog from 'material-ui/Dialog';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

export default class InformationTable extends React.Component {

  constructor(props) {
    super(props);
  }

  render () {
    let actions = [];
    if(this.props.isYesNoMessage) {
      actions = [
        <FlatButton
          label="SIM"
          primary={false}
          onTouchTap={this.props.callbackOnYesDialog}
        />,
        <FlatButton
          label="NÃO"
          primary={true}
          onTouchTap={this.props.handleCloseDialog}
        />,
      ];
    }
    else {
      actions = [
        <FlatButton
          label="OK"
          primary={true}
          onTouchTap={this.props.handleCloseDialog}
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
              {this.props.headerNames.map((headerName, index) => (
                <TableHeaderColumn key={index} style={{color: 'black', fontSize: '18px'}}>{headerName}</TableHeaderColumn>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody
            displayRowCheckbox={false}
            showRowHover={true}
            stripedRows={true}
          >
            {this.props.informationLines.map((informationLine, rowIndex) => (
              <TableRow
                key={rowIndex}
                name={rowIndex}
                style={this.props.isRowClickable ? {cursor: 'pointer'} : {}}
                onTouchTap={this.props.isRowClickable ?
                    () => this.props.handleSelectedLine(informationLine[this.props.selectedLineIndexToSend]) :
                    () => {}
                }
              >
                {informationLine.map((column, index) => (
                  <TableRowColumn key={index} style={{fontSize: '16px'}}>{column}</TableRowColumn>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }
}

InformationTable.propTypes = {
  handleCloseDialog: PropTypes.func.isRequired,
  callbackOnYesDialog: PropTypes.func,
  handleSelectedLine: PropTypes.func,
  selectedLineIndexToSend: PropTypes.number,
  isYesNoMessage: PropTypes.bool,
  informationLines: PropTypes.array.isRequired,
  headerNames: PropTypes.array.isRequired,
  dialogMessage: PropTypes.string.isRequired,
  isRowClickable: PropTypes.bool.isRequired
};
