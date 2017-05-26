import React from 'react';
import axios from 'axios';
import Field from './Field.jsx';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import update from 'immutability-helper';

let aux = [];

let headerProps = {
  enableSelectAll: false,
  displaySelectAll: false,
  adjustForCheckbox: false
};

let headers = [
  {name: "Patrimônio", key: "pat"},
  {name: "Família", key: "familia"},
  {name: "Tipo", key: "tipo"},
  {name: "Estado", key: "estado"},
];

export default class EquipTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], sortBy: ''
    };
  }

  loadDataFromServer() {
    axios.get(this.props.route.url + "/api/equips")
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

  renderHeaders(){
    let header= headers.map( (h) => {
      return <SortableHeader
                name={h.name}
                key={h.key}
                onClicked={()=>this.updateSortBy(h.key)}
                isSortColumn={this.state.sortBy == h.key}
              />
    });
    return <TableRow>{header}</TableRow>;
  }

  updateSortBy(sortBy){
    // multiple clicks on the same column reverse the sort order
    if( sortBy == this.state.sortBy ){
      this.setState( {data: [...this.state.data.reverse()]} );
      return;
    }

    let data = [...this.state.data];
    data.sort( (a,b) => {
      if (a[sortBy] < b[sortBy])
        return -1;
      if(a[sortBy] > b[sortBy])
        return 1;
      return 0;
    });

    this.setState({data, sortBy});
  }


  render () {
    if(super.finishedReq == false)
    {
      return(<div/>)
    }
    return (
      <div>
        <Table
          height='300px'
          fixedHeader={true}
          selectable={false}
          multiSelectable={false}
        >
          <TableHeader {...headerProps}>
            {this.renderHeaders()}
          </TableHeader>

          <TableBody
            displayRowCheckbox={false}
            showRowHover={true}
            stripedRows={true}
          >
            {this.state.data.map( (row) => (
              <TableRow key={row.eq_id}>
                <TableRowColumn>{row.patrimonio}</TableRowColumn>
                <TableRowColumn>{row.Tipo.Familia.familia}</TableRowColumn>
                <TableRowColumn>{row.Tipo.tipo}</TableRowColumn>
                <TableRowColumn>{row.Estado.estado}</TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <RaisedButton label="Recarregar" primary={true} onClick={this.loadDataFromServer.bind(this)}/>
      </div>
    );
  }
}

function SortableHeader(props){
  let style = {
    cursor: "pointer"
  }
  if(props.isSortColumn){
    style.fontWeight = "bold";
    style.color = "black";
  }

  return (
    <TableHeaderColumn>
      <div style={style} onClick={() => props.onClicked()}>{props.name}</div>
    </TableHeaderColumn>
  );
}
