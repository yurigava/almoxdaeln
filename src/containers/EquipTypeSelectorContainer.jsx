import { connect } from 'react-redux'
import EquipTypeSelector from '../components/EquipTypeSelector.jsx'
import {
  getTipos,
  getFamilias
} from '../actions/equipTypeSelect.js'
import { serverUrl } from '../main.jsx'

const mapStateToProps = (state, ownProps) => {
  return {
    tipos: state.equipTypeSelect.tipos,
    familias: state.equipTypeSelect.familias,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getTipos: () => {
      dispatch(getTipos(serverUrl))
    },
    getFamilias: () => {
      dispatch(getFamilias(serverUrl))
    }
  }
}

const EquipTypeSelectorContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EquipTypeSelector)

export default EquipTypeSelectorContainer
