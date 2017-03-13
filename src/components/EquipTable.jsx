import React from 'react';
import axios from 'axios';
import Field from './Field.jsx';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import update from 'immutability-helper';

let tableData = [];
let aux = [];

export default class EquipTable extends React.Component {
	constructor(props) {
		super(props);
    this.state = {
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
        <Field/>
        </div>
    );
  }
}

EquipTable.propTypes = {
  url: React.PropTypes.string.isRequired
};
