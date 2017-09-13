import React, { PropTypes } from 'react';
import { Grid } from 'react-flexbox-grid';
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
        <Grid fluid >
          <UserEquipControlContainer
            selectEquipErrorMessage={this.selectEquipErrorMessage}
            setIsYesNoMessage={this.props.setIsYesNoMessage}
            submitForm={this.props.insertStudentLendShouldNotAdd}
            submitFormAfterConfirm={this.props.insertStudentLendShouldAdd}
            clearErrorDescription={this.props.clearErrorDescription}
            errorCauseEquipNumbers={this.props.errorCauseEquipNumbers}
            errorCode={this.props.errorCode}
          />
        </Grid>
      </div>
    )
  }
}

StudentLend.propTypes = {
  clearErrorDescription: PropTypes.func.isRequired,
  insertStudentLendShouldAdd: PropTypes.func.isRequired,
  insertStudentLendShouldNotAdd: PropTypes.func.isRequired,
  setIsYesNoMessage: PropTypes.func.isRequired,
  errorCauseEquipNumbers: PropTypes.array.isRequired,
  errorCode: PropTypes.string.isRequired,
};
