import  React from 'react';
import $ from 'jquery/src/core';

export default class Equips extends React.Component {
  constructor(props) {
    super(props);
    this.state = {data:  []};
  }
  loadDataFromServer() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }
  getInitialState() {
    return {data: []};
  }
  render () {
    return (
      <div className="equipTable">
        <h1>Equipamentos</h1>
        <div>
          <Table data={this.state.data}/>
          <button onClick={this.loadDataFromServer}> Recarregar </button>
        </div>
      </div>
    );
  }
}

Equips.propTypes = {
  url: React.PropTypes.string.isRequired
};

class Table extends React.Component {
  render() {
    var equipNodes = this.props.data.map(function(equip) {
      return (
        <Item id={equip.eq_id} state={equip.state} type={equip.type}/>
      );
    });
    return (
      <table class="center">
        <tr>
          <th>ID</th>
          <th>Estado</th>
          <th>Tipo</th>
        </tr>
        {equipNodes}
      </table>
    );
  }
}

class Item extends React.Component {
  render () {
    return (
      <tr>
        <td> {this.props.id} </td>
        <td> {this.props.state} </td>
        <td> {this.props.type} </td>
      </tr>
    );
  }
}
