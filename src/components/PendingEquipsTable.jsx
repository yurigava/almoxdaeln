import React from 'react';
import PropTypes from 'prop-types';
import InformationTable from './InformationTable.jsx';
import update from 'immutability-helper';

const headers = [
  "Usuário",
  "Quantidade de equipamentos em Débito"
]

export default class PendingEquipsTable extends React.Component {

  constructor(props) {
    super(props);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
  }

  componentWillMount() {
    this.props.getPendingEquips();
  }

  handleCloseDialog() {
    this.props.setSubmissionMessage("");
    this.props.setIsYesNoMessage(false);
  }

  render () {
    return (
      <div>
        <InformationTable
          handleCloseDialog={this.handleCloseDialog}
          callbackOnYesDialog={this.handleRegisterReturnedEquips}
          isYesNoMessage={this.props.isYesNoMessage}
          isRowClickable={false}
          informationLines={ this.props.pendingEquips.map(pendingEquip => [pendingEquip.usuario, pendingEquip.quantidade]) }
          headerNames={headers}
          dialogMessage={this.props.dialogMessage}
        />
      </div>
    )
  }
}

PendingEquipsTable.propTypes = {
  getPendingEquips: PropTypes.func.isRequired,
  setSubmissionMessage: PropTypes.func.isRequired,
  setIsYesNoMessage: PropTypes.func.isRequired,
  dialogMessage: PropTypes.string.isRequired,
  isYesNoMessage: PropTypes.bool.isRequired,
};
