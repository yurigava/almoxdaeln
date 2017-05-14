import React, { PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import update from 'immutability-helper';
import FieldStudents from './FieldStudents.jsx'

//let value = null;

export default class Students extends React.Component {
  render() {
    return (
      <div>
        <FieldStudents/>
      </div>
    );
  }
}