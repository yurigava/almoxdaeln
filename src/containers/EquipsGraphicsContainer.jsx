import { connect } from 'react-redux'
import EquipsGraphics from '../components/EquipsGraphics.jsx'
import {
} from '../actions/equipsGraphics.js'
import { serverUrl } from '../main.jsx'

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

const EquipsGraphicsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EquipsGraphics)

export default EquipsGraphicsContainer
