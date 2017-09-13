import React, { PropTypes } from 'react';
import { Grid } from 'react-flexbox-grid';
import UserEquipControlContainer from '../containers/UserEquipControlContainer.jsx'
import update from 'immutability-helper';

export default class StudentReturn extends React.Component {

  constructor(props) {
    super(props);
    this.selectEquipErrorMessage = this.selectEquipErrorMessage.bind(this);
  }

  selectEquipErrorMessage(errorCode) {
    if(errorCode === "ER_NOT_FOUND")
      return "Equipamento não emprestado para esse usuário";
    else if(errorCode === "ER_NOT_AVAILABLE")
      return "Equipamento Não Disponível";
  }

  setIsYesNoMessage(isYesNoMessage) {
  }

  render () {
    return (
      <div>
        <Grid fluid >
          <UserEquipControlContainer
            selectEquipErrorMessage={this.selectEquipErrorMessage}
            setIsYesNoMessage={this.setIsYesNoMessage}
            submitForm={this.props.insertStudentReturn}
            clearErrorDescription={this.props.clearErrorDescription}
            errorCauseEquipNumbers={this.props.errorCauseEquipNumbers}
            errorCode={this.props.errorCode}
          />
        </Grid>
      </div>
    )
  }
}

StudentReturn.propTypes = {
  clearErrorDescription: PropTypes.func.isRequired,
  insertStudentReturn: PropTypes.func.isRequired,
  errorCauseEquipNumbers: PropTypes.array.isRequired,
  errorCode: PropTypes.string.isRequired,
};
