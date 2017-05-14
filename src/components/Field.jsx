import React, {Component} from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import axios from 'axios';
import update from 'immutability-helper';

const family = [
  'Osciloscópio',
  'Gerador de função',
  'Multímetro'
];

const types = [
  'Analógico',
  'Digital',
  'Yuri Garcia Vaz',
];

export default class Field extends Component {
  constructor(props) {
    super(props);
    this.state = { values: '', values1: ''  };
    this.handleChange = this.handleChange.bind(this);
    this.handleChange1 = this.handleChange1.bind(this);
  }

  loadDataFromServer() {
    axios.get(this.props.url + "/professor/api/professor")
    .then((response) => {
      //this.setState(update(this.state, {data: {$set: response.data}}));
      alert("entrou");
    })
    .catch((error) => {
      if(error.response)
        //this.setState(update(this.state, {data: {$set: error.response.data}}));
        alert("erro");
      else
        this.setState(update(this.state, {
          data: {0: {state: {$set: error.toString()}}}
      }));
    });
  }

  handleChange(event, index, values) {
    this.setState(update(this.state, {values: {$set: values}}));  
    //alert(values: index.values);
  }

  handleChange1(event, index, values1) {
    this.setState(update(this.state, {values1: {$set: values1}}));  
    //alert(values1: index.values1);
  }

  menuItems(values) {
    return family.map((name) => (
      <MenuItem
        key={name}
        insetChildren={false}
        checked={values && values.indexOf(name) > -1}
        value={name}
        primaryText={name}
      />
    ));
  }

   menuItems1(values1) {
    return types.map((name1) => (
      <MenuItem
        key={name1}
        insetChildren={false}
        checked={values1 && values1.indexOf(name1) > -1}
        value={name1}
        primaryText={name1}
      />
    ));
  }

  render() {
    const {values} = this.state;
    const {values1} = this.state;
    return (
      <div>
        <SelectField
          multiple={false}
          hintText="Select a Family"
          value={values}
          //selectionRenderer={this.loadDataFromServer.bind(this)}
          //onChange={this.loadDataFromServer.bind(this)}   
          onChange={this.handleChange}       
        >
          {this.menuItems(values)}
        </SelectField>

        &nbsp;&nbsp;&nbsp;

        <SelectField
          multiple={false}
          hintText="Select a Type"
          value={values1}
          onChange={this.handleChange1}
        >
          {this.menuItems1(values1)}
        </SelectField>
      </div>
    );
  }
}

