import { connect } from 'react-redux'
import Template from '../components/Template.jsx'
import {
} from '../actions/template.js'
import { serverUrl } from '../main.jsx'

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

const TemplateContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Template)

export default TemplateContainer
