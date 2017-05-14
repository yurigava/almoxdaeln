import { combineReducers } from 'redux'
import login from './login.jsx'
import appUi from './appUi.jsx'
import professor from './professor.jsx'
//import visibilityFilter from './visibilityFilter'

const almoxApp = combineReducers({
  login,
  appUi,
  professor
})

export default almoxApp
