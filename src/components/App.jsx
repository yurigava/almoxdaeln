import React from 'react';
import axios from 'axios';
import EquipTable from './EquipTable.jsx';

export default class App extends React.Component {
  render() {
    return (
      <EquipTable url="http://localhost:8081/api/equips"/>
    );
  }
}
