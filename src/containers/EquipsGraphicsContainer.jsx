import { connect } from 'react-redux'
import EquipsGraphics from '../components/EquipsGraphics.jsx'
import {
  setMissingFieldsError,
  setSelectedTipo,
  setSelectedFamilia,
  setInfoNumber,
  raiseLowerWidth,
  quantidadeEquipsGraph,
  setQuantidadeEquipGraph,
} from '../actions/equipsGraphics.js'
import {
  setSubmissionMessage,
} from '../actions/appUi.js'
import { serverUrl } from '../main.jsx'

const mapStateToProps = (state) => {
  return {
    tipo: state.equipsGraphics.selectedTipo,
    familia: state.equipsGraphics.selectedFamilia,
    isMissingFamilia: state.equipsGraphics.isMissingFamilia,
    isMissingTipo: state.equipsGraphics.isMissingTipo,
    submissionMessage: state.appUi.submissionMessage,
    infoNumber: state.equipsGraphics.infoNumber,
    width: state.equipsGraphics.width,
    quantidade: state.equipsGraphics.quantidade,
    referencia: state.equipsGraphics.referencia,
    isInputDisabled: state.appUi.isInputDisabled,
    //errorCode: state.equipsGraphics.errorCode,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    clearMissingFieldsError: () => {
      dispatch(setMissingFieldsError(false, false))
    },
    setSelectedTipo: (name, tipo) => {
      dispatch(setSelectedTipo(tipo))
    },
    setSelectedFamilia: (name, familia) => {
      dispatch(setSelectedFamilia(familia))
    },
    setInfoNumber: (infoNumber) => {
      dispatch(setInfoNumber(infoNumber))
    },
    raiseLowerWidth: (widthActual, width) => {
      dispatch(raiseLowerWidth(widthActual, width))
    },
    quantidadeEquipsGraph: (familia, tipo, dataInicial, dataFinal) => {
      dispatch(quantidadeEquipsGraph(serverUrl, familia, tipo, dataInicial, dataFinal))
    },
    setQuantidadeEquipGraph: (quantidade, referencia) => {
      dispatch(setQuantidadeEquipGraph(quantidade, referencia))
    },
    getTipos: () => {
      dispatch(getTipos(serverUrl))
    },
    getFamilias: () => {
      dispatch(getFamilias(serverUrl))
    }
  }
}

const EquipsGraphicsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EquipsGraphics)

export default EquipsGraphicsContainer
