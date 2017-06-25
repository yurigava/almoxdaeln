import { connect } from 'react-redux'
import AddEquip from '../components/AddEquip.jsx'
import { insertEquips, getTipos, getFamilias } from '../actions/addEquip.js'
import { serverUrl } from '../main.jsx'

const mapStateToProps = (state) => {
  return {
    tipos: state.addEquip.tipos,
    familias: state.addEquip.familias,
    isInputDisabled: state.login.isInputDisabled
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getTipos: () => {
      dispatch(getTipos(serverUrl))
    },
    getFamilias: () => {
      dispatch(getFamilias(serverUrl))
    },
    insertEquips: (patrimonios, id_tipo, id_familia) => {
      dispatch(insertEquips(serverUrl, patrimonios, id_tipo, id_familia))
    }
  }
}

const addEquipContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddEquip)

export default addEquipContainer
