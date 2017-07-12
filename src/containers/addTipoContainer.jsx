import { connect } from 'react-redux'
import AddTipo from '../components/AddTipo.jsx'
import { insertTipo } from '../actions/addTipo.js'
import {
  getFamilias,
  getTipos,
} from '../actions/equipTypeSelect.js'
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
    getTipos: () => {
      dispatch(getTipos(serverUrl))
    },
    clearSubmissionMessage: () => {
      dispatch(setSubmissionMessage(""))
    },
    insertTipo: (tipo, familia) => {
      dispatch(insertTipo(serverUrl, tipo, familia))
    }
  }
}

const addTipoContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddTipo)

export default addTipoContainer
