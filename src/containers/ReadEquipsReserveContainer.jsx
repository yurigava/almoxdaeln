import { connect } from 'react-redux'
import ReadEquipsReserve from '../components/ReadEquipsReserve.jsx'
import {
} from '../actions/readEquipsReserve.js'
import { serverUrl } from '../main.jsx'

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

const ReadEquipsReserveContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReadEquipsReserve)

export default ReadEquipsReserveContainer
