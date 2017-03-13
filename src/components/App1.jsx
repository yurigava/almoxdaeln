import React from 'react';
import axios from 'axios';
import AddEquip from './AddEquip.jsx';
import EquipTable from './EquipTable.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import update from 'immutability-helper';


function WarningBanner(props) {
  if (!props.warn) {
    return null;
  }

  return (
    <div className="warning">
      <EquipTable url="http://localhost:8081/api/equips"/>
      <br/><br/>
    </div>
  );
}

function WarningBanner1(props) {
  if (!props.warn1) {
    return null;
  }

  return (
    <div className="warning">
      <AddEquip url="http://localhost:8081/api/equips"/>
      <br/><br/>
    </div>
  );
}

export default class App1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showWarning: false}
    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.state1 = {showWarning1: false}
    this.handleToggleClick1 = this.handleToggleClick1.bind(this);
  }
  
  handleToggleClick() {
    this.setState(prevState => ({
      showWarning: !prevState.showWarning
    }));
  }
  
  handleToggleClick1() {
    this.setState(prevState => ({
      showWarning1: !prevState.showWarning1
    }));
  }

  render() {
    return (
      <div>
      <center>
        <WarningBanner warn={this.state.showWarning} />
        
        <RaisedButton label="Carregar Tabela" primary={true} 
        onClick={this.handleToggleClick}>
        </RaisedButton>
        <br/>
        <br/>
        
        <WarningBanner1 warn1={this.state.showWarning1} />
        <RaisedButton label="Adicionar Equipamento" primary={true} 
        onClick={this.handleToggleClick1}>
        </RaisedButton>
        
        </center>
      </div>
    );
  }
}