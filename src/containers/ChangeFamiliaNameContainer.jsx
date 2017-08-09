import { connect } from 'react-redux'
import ChangeFamiliaName from '../components/ChangeFamiliaName.jsx'
import {
  updateFamiliaName
} from '../actions/changeFamiliaName.js'
import { getFamilias } from '../actions/equipTypeSelect.js'
import { setSubmissionMessage } from '../actions/appUi.js'
import { serverUrl } from '../main.jsx'

const mapStateToProps = (state) => {
  return {
    familias: state.equipTypeSelect.familias,
    isInputDisabled: state.appUi.isInputDisabled,
    submissionMessage: state.appUi.submissionMessage,
    isDataSubmitted: state.appUi.isDataSubmitted,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getFamilias: () => {
      dispatch(getFamilias(serverUrl))
    },
    clearSubmissionMessage: () => {
      dispatch(setSubmissionMessage(""))
    },
    updateFamiliaName: (familiaIndex, familiaNewName) => {
      dispatch(updateFamiliaName(serverUrl, familiaIndex, familiaNewName))
    }
  }
}

const ChangeFamiliaNameContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangeFamiliaName)

export default ChangeFamiliaNameContainer
