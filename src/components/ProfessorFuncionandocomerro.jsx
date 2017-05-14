import React, {Component} from 'react';
import axios from 'axios';
import update from 'immutability-helper';

import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';


export default class FieldStudents extends Component {
  constructor(props) {
    super(props);
    this.state = { controlledDate: null, time: null, name: '', shareholders: [{ name: '' }] };
    this.handleDate = this.handleDate.bind(this);
    this.handleTime = this.handleTime.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddShareholder = this.handleAddShareholder.bind(this);
    this.handleShareholderNameChange = this.handleShareholderNameChange.bind(this);
    this.handleRemoveShareholder = this.handleRemoveShareholder.bind(this);
  }

  handleDate(event, date) {
    this.setState(update(this.state, {controlledDate: {$set: date}}));  
  }

  handleTime(event, date) {
    this.setState(update(this.state, {time: {$set: date}}));  
  };

  handleShareholderNameChange(event) {  

    //const shareholders = [];
    const value = event.target.value;
    this.setState(update(this.state, {[shareholders]: {$set: value}}));
    //alert(event.target.value);
    
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
    alert(this.state.shareholders.name);
  }

  render() {
    return (
      <div>
        <DatePicker
          hintText="Insira data"
          value={this.state.controlledDate}
          onChange={this.handleDate}
        />

        <TimePicker
          format="24hr"
          hintText="Insira hora"
          value={this.state.time}
          onChange={this.handleTime}
          autoOk={true}
        />

          <form onSubmit={e => {
                  e.preventDefault()
                  this.handleSubmit()
                }}
              >
            {/* ... */}

            {this.state.shareholders.map((shareholder, idx) => (
              <div>        
                <TextField
                  name="Family"
                  hintText="Equipamento"
                  floatingLabelText={`Family #${idx + 1} name`} 
                  value={shareholder.name}
                  onChange={this.handleShareholderNameChange}
                />
                  &nbsp;&nbsp;&nbsp;

                  <TextField
                  name="Type"
                  hintText="Equipamento"
                  floatingLabelText={`Type #${idx + 1} name`} 
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
            <br/>
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