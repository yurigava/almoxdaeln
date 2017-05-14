import React, { PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import update from 'immutability-helper';
import FieldProfessor from './FieldProfessor.jsx'

//let value = null;

export default class Professor extends React.Component {
  render() {
    return (
      <div>
        <FieldProfessor/>
      </div>
    );
  }
}

//Professor.propTypes = {
//  valueProfessor: PropTypes.bool.isRequired,
//  onChangeValueProfessor: PropTypes.func.isRequired
//}