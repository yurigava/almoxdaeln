import { connect } from 'react-redux'
import AddFamilia from '../components/AddFamilia.jsx'
import { insertTipo } from '../actions/addTipo.js'
import { setSubmissionMessage } from '../actions/appUi.js'
import {
  setCreatedFamiliaNumber,
  insertFamilia,
} from '../actions/addFamilia.js'
import {
  getTipos,
  getFamilias
} from '../actions/equipTypeSelect.js'
import { serverUrl } from '../main.jsx'

const mapStateToProps = (state) => {
  return {
    submissionMessage: state.appUi.submissionMessage,
    isInputDisabled: state.appUi.isInputDisabled,
    createdFamiliaNumber: state.addFamilia.createdFamiliaNumber,
    isDataSubmitted: state.appUi.isDataSubmitted,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCreatedFamiliaNumber: (familiaNumber) => {
      dispatch(setCreatedFamiliaNumber(familiaNumber))
    },
    insertTipo: (tipo, familia) => {
      dispatch(insertTipo(serverUrl, tipo, familia))
    },
    insertFamilia: (familia) => {
      dispatch(insertFamilia(serverUrl, familia))
    },
    clearSubmissionMessage: () => {
      dispatch(setSubmissionMessage(""))
    },
    getTipos: () => {
      dispatch(getTipos(serverUrl))
    },
    getFamilias: () => {
      dispatch(getFamilias(serverUrl))
    }
  }
}

const addFamiliaContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddFamilia)

export default addFamiliaContainer
