import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

let value = null;

export default class Field extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      valor1: '',
      valor2: ''
    };
  }

  handleClick1(event, index, value) {
    this.setState(...state, {valor1: value});
  }

  handleClick2(event, index, value) {
    this.setState(...state, {valor2: value});
  }

  render() {
    return (
      <div>
        <SelectField
        floatingLabelText="Equipamento:"
        value={this.state.value1}
        onChange={this.handleClick1}
        >
          <MenuItem value={1} primaryText="Osciloscopio" />
          <MenuItem value={2} primaryText="Multimetro" />
          <MenuItem value={3} primaryText="Gerador de Funçao" />
        </SelectField>
        oi
        <SelectField
        floatingLabelText="Teste:"
        value={this.state.value1}
        onChange={this.handleClick2}
        >
          <MenuItem value={1} primaryText="teste" />
          <MenuItem value={2} primaryText="teste2" />
          <MenuItem value={3} primaryText="Gerador de Função" />
        </SelectField>
      </div>
    )
  }
}
