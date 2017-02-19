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
    return {
        data: []};
  },
    
  render () {
    return (
      <div className="equipTable">
        <h1>Equipamentos</h1>
        <Table data={this.state.data}/>
        <div>
          <button onClick={this.loadDataFromServer}> Recarregar </button>
        </div>
            /*<Control/>*/
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
          <th>Estado </th>
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
        <td><center> {this.props.id} </center></td>
        <td><center> {this.props.state} </center></td>
        <td><center> {this.props.type} </center></td>
      </tr>
    );
  }
});

var Hello = React.createClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});

var Control = React.createClass({
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
    return {
    data: []};
  },
    
  
  handleChange: function(evt) {
    this.setState({
      value: evt.target.value
    });
  },
  
  reset: function() {
    this.setState({
      value: "Você é bem gata"
    });
  },
  
  alertValue: function() {
    alert(this.state.value);
  },
  
  render: function() {
    return (
      <div>
        <input value={this.state.value} onChange={this.handleChange} />
        <button onClick={this.loadDataFromServer}> Reset </button>
        <button onClick={this.alertValue}>Alert Value</button>
      </div>
    );
  }
});

ReactDOM.render(
  <Equips url="/api/equips"/>,
  //<Control url="/opa/control"/>,
  document.getElementById('content')
);