import React, {Component} from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
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
    this.state = { values: '', values1: '', name: '', shareholders: [{ name: '' }] };
    this.handleChange = this.handleChange.bind(this);
    this.handleChange1 = this.handleChange1.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddShareholder = this.handleAddShareholder.bind(this);
    this.handleShareholderNameChange = this.handleShareholderNameChange.bind(this);
    this.handleRemoveShareholder = this.handleRemoveShareholder.bind(this);
  }

  handleShareholderNameChange(event) {
    //return this.state.shareholders.map((it) => ( alert(it.name)));
    
    const name = event.target.name;
    const value = event.target.value;
    this.setState(update(this.state, {[name]: {$set: value}}));
    //const shareholders = [this.state];
    //const newShareholders = update(shareholders, {$push: [idx]}); // => [1, 2, 3, 4]
    //alert("oi");
    //this.setState(update(this.state, {shareholders: {$set: [newShareholders]}}));  
  }

  handleSubmit(event) {
    const { name, shareholders } = this.state;
    alert(`Incorporated: ${name} with ${shareholders.length} shareholders`);
  }

  handleAddShareholder() {
    //this.setState(update(this.state, {shareholders: {$set: newShareholders}}));  
    this.setState({
      shareholders: this.state.shareholders.concat([{ name: '' }])
    });
  }

  handleRemoveShareholder(event) {
    alert(event);
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
        
        <br/>
        <br/>

        <form onSubmit={e => {
                e.preventDefault()
                this.handleSubmit()
              }}
            >
          {/* ... */}

          {this.state.shareholders.map((shareholder, idx) => (
            <div className="shareholder">
              <TextField
                name="Family"
                hintText="Equipamento"
                floatingLabelText={`Shareholder #${idx + 1} name`} 
                value={shareholder.name}
                onChange={this.handleShareholderNameChange}
              />
              <RaisedButton
                label="-"
                primary={true}
                //type="submit"
                //onClick={this.handleRemoveShareholder(idx)}
                onClick={this.handleRemoveShareholder}
              />
            </div>
          ))}
          <RaisedButton
            label="Add Shareholder"
            primary={true}
            //type="submit"
            onClick={this.handleAddShareholder}
          />
          &nbsp;&nbsp;&nbsp;
          <RaisedButton
            label="Incorporate"
            primary={true}
            type="submit"
          />
        </form>
      </div>
    );
  }
}

