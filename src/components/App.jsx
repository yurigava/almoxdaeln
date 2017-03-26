import React from 'react';
import axios from 'axios';
import AddEquip from './AddEquip.jsx';
import EquipTable from './EquipTable.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import update from 'immutability-helper';

export default class App extends React.Component {
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
            
                <EquipTable url={this.props.url + "/api/equips"} />
            
        </center>
      </div>
    );
  }
}

App.propTypes = {
  url: React.PropTypes.string.isRequired
};
