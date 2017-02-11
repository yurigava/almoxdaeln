var Equips = React.createClass({
  loadDataFromServer: function() {
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
  },
  getInitialState: function() {
    return {data: []};
  },
  render () {
    return (
      <div className="equipTable">
        <h1>Equipamentos</h1>
        <Table data={this.state.data}/>
        <div>
          <button onClick={this.loadDataFromServer}> Recarregar </button>
        </div>
      </div>
    );
  }
});

var Table = React.createClass({
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
});

var Item = React.createClass({
  render () {
    return (
      <tr>
        <td> {this.props.id} </td>
        <td> {this.props.state} </td>
        <td> {this.props.type} </td>
      </tr>
    );
  }
});

ReactDOM.render(
  <Equips url="/api/equips"/>,
  document.getElementById('content')
);
