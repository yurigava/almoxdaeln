import React, { PropTypes } from 'react';
import UserEquipControlContainer from '../containers/UserEquipControlContainer.jsx'
import update from 'immutability-helper';

export default class StudentLend extends React.Component {

  constructor(props) {
    super(props);
    this.selectEquipErrorMessage = this.selectEquipErrorMessage.bind(this);
  }

  selectEquipErrorMessage(errorCode) {
    if(errorCode === "ER_NOT_FOUND")
      return "Equipamento Não Registrado";
    else if(errorCode === "ER_NOT_AVAILABLE")
      return "Equipamento Não Disponível";
  }

  render () {
    return (
      <div>
        <UserEquipControlContainer
          selectEquipErrorMessage={this.selectEquipErrorMessage}
          submitForm={this.props.insertStudentLend}
          clearErrorDescription={this.props.clearErrorDescription}
          errorCauseEquipNumbers={this.props.errorCauseEquipNumbers}
          errorCode={this.props.errorCode}
        />
      </div>
    )
  }
}

StudentLend.propTypes = {
  clearErrorDescription: PropTypes.func.isRequired,
  insertStudentLend: PropTypes.func.isRequired,
  errorCauseEquipNumbers: PropTypes.array.isRequired,
  errorCode: PropTypes.string.isRequired,
};
