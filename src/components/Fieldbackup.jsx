import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

let value = null;

var Field = React.createClass({

getInitialState: function() {
    return {message: 'Hello!'};
  },
 
 handleClick: function() {
    alert(this.state.message);
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
                    <MenuItem value={null} primaryText="Gerador de Funçao" />
                    </SelectField>
                </div>
            );
        }
});
export default Field;