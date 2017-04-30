import { combineReducers } from 'redux'
import login from './login.jsx'
import appUi from './appUi.jsx'
//import visibilityFilter from './visibilityFilter'

const almoxApp = combineReducers({
  login,
  appUi
})

export default almoxApp
