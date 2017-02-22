import  React from 'react';
import axios from 'axios';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import update from 'immutability-helper';

let tableData = [];

export default class EquipTable extends React.Component {
	constructor(props) {
		super(props);
    this.state = {
      fixedHeader: true,
      stripedRows: true,
      showRowHover: true,
      selectable: false,
      multiSelectable: false,
      enableSelectAll: false,
      deselectOnClickaway: false,
      showCheckboxes: false,
      height: '300px',
      data: []
    };
  }

  loadDataFromServer() {
		axios.get(this.props.url)
			.then((response) => {
        this.setState(update(this.state, {data: {$set: response.data}}));
			})
			.catch((error) => {
        if(error.response)
          this.setState(update(this.state, {data: {$set: error.response.data}}));
        else
          this.setState(update(this.state, {
            data: {0: {state: {$set: error.toString()}}}
          }));
			});
  }

  render () {
    return (
      <div>
        <Table
          height={this.state.height}
          fixedHeader={this.state.fixedHeader}
          selectable={this.state.selectable}
          multiSelectable={this.state.multiSelectable}
        >
          <TableHeader
            displaySelectAll={this.state.showCheckboxes}
            adjustForCheckbox={this.state.showCheckboxes}
            enableSelectAll={this.state.enableSelectAll}
          >
            <TableRow>
              <TableHeaderColumn tooltip="Código de Barras do equipamento">ID</TableHeaderColumn>
              <TableHeaderColumn tooltip="Número do patrimônio do Equipamento">Patrimônio</TableHeaderColumn>
              <TableHeaderColumn tooltip="Nome do Equipamento">Nome</TableHeaderColumn>
              <TableHeaderColumn tooltip="Estado do Equipamento">Estado</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={true}
            stripedRows={true}
          >
            {this.state.data.map( (row) => (
              <TableRow key={row.eq_id}>
                <TableRowColumn>{row.eq_id}</TableRowColumn>
                <TableRowColumn>{row.pat}</TableRowColumn>
                <TableRowColumn>{row.state}</TableRowColumn>
                <TableRowColumn>{row.type}</TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <RaisedButton label="Recarregar" primary={true} onClick={this.loadDataFromServer.bind(this)}/>
      </div>
    );
  }
}

EquipTable.propTypes = {
  url: React.PropTypes.string.isRequired
};
