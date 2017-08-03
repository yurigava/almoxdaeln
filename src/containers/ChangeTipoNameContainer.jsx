import { connect } from 'react-redux'
import ChangeTipoName from '../components/ChangeTipoName.jsx'
import { getTipos } from '../actions/equipTypeSelect.js'
import { setSubmissionMessage } from '../actions/appUi.js'
import {
  updateTipoName,
  setFamilia,
  setTipo,
} from '../actions/changeTipoName.js'
import { serverUrl } from '../main.jsx'

const mapStateToProps = (state) => {
  return {
    isInputDisabled: state.appUi.isInputDisabled,
    submissionMessage: state.appUi.submissionMessage,
    isDataSubmitted: state.appUi.isDataSubmitted,
    familia: state.changeTipoName.familia,
    tipo: state.changeTipoName.tipo,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateTipoName: (familiaIndex, tipoIndex, tipoNewName) => {
      dispatch(updateTipoName(serverUrl, familiaIndex, tipoIndex, tipoNewName))
    },
    getTipos: () => {
      dispatch(getTipos(serverUrl))
    },
    clearSubmissionMessage: () => {
      dispatch(setSubmissionMessage(""))
    },
    setFamilia: (name, familia) => {
      dispatch(setFamilia(familia))
    },
    setTipo: (name, tipo) => {
      dispatch(setTipo(tipo))
    },
  }
}

const ChangeTipoNameContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangeTipoName)

export default ChangeTipoNameContainer
