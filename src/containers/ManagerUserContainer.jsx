import { connect } from 'react-redux'
import ManagerUser from '../components/ManagerUser.jsx'
import {
} from '../actions/managerUser.js'
import { serverUrl } from '../main.jsx'

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

const ManagerUserContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ManagerUser)

export default ManagerUserContainer
