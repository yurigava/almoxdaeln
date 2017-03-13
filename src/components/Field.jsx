import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

let value = null;

var Field = React.createClass({

getInitialState: function() {
    return {state: value}
  },

 handleClick: function(event, index, value) {
    this.setState({value})
  },
        render: function() {
            return (
                <div>
                    <SelectField
                    floatingLabelText="Equipamento:"
                    value={this.state.value}
                    onChange={this.handleClick}
                    >
                    <MenuItem value={1} primaryText="Osciloscopio" />
                    <MenuItem value={2} primaryText="Multimetro" />
                    <MenuItem value={3} primaryText="Gerador de Funçao" />
                    <MenuItem value={4} primaryText="Yuri Garcia Vaz" />
                    </SelectField>

                </div>
            );
        }
});
export default Field;