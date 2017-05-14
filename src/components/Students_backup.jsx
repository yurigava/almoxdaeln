import React, { PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import update from 'immutability-helper';

//let value = null;

export default class Students extends React.Component {
  render() {
    return (
      <div>
        <SelectField 
          floatingLabelText="Ready?"
          //value={this.props.valueStudents}
          value={true}
          //onChange={() => this.props.onChangeValueStudents()}
        >
          //<MenuItem value={null} primaryText="" />
          <MenuItem value={false} primaryText="No" />
          <MenuItem value={true} primaryText="Yes" />
        </SelectField>
      </div>
    );
  }
}

//Students.propTypes = {
//  valueStudents: PropTypes.bool.isRequired,
//  onChangeValueStudents: PropTypes.func.isRequired
//}