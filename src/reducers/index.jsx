import { combineReducers } from 'redux'
import login from './login.jsx'
import appUi from './appUi.jsx'
import students from './students.jsx'
//import visibilityFilter from './visibilityFilter'

const almoxApp = combineReducers({
  login,
  appUi
  //students
})

export default almoxApp
