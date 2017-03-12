import  React from 'react';
import axios from 'axios';
import * as Table from 'reactabular-table';
import * as sort from 'sortabular';
import RaisedButton from 'material-ui/RaisedButton';
import update from 'immutability-helper';

let tableData = [];

export default class EquipTable extends React.Component {
	constructor(props) {
		super(props);
    this.state = {
      results: [],
      fields: [],
      sortingColumns: null
    };
  }

  loadDataFromServer() {
		axios.get(this.props.url)
			.then((response) => {
        this.setState(update(this.state, {results: {$set: response.data.results}},
                            {fields: {$set: response.data.fields}}));
			})
			.catch((error) => {
        if(error.response)
          this.setState(update(this.state, {results: {$set: error.response.data.results}}));
        else
          this.setState(update(this.state, {
            data: {0: {state: {$set: error.toString()}}}
          }));
			});
  }

  render () {
    return (
      <div>
        <Table.Provider
          className="table"
          className="pure-table pure-table-striped"
          columns={[
            {property: "eq_id", header: {label: "Código de Barras"}},
            {property: "pat", header: {label: "Número de Patrimônio"}},
            {property: "type", header: {label: "Equipamento"}},
            {property: "state", header: {label: "Estado"}}]}
          >
          <Table.Header />
          <Table.Body rowKey="eq_id" rows={this.state.results} />
        </Table.Provider>
        <RaisedButton label="Recarregar" primary={true} onClick={this.loadDataFromServer.bind(this)}/>
      </div>
    );
  }
}

EquipTable.propTypes = {
  url: React.PropTypes.string.isRequired
};
