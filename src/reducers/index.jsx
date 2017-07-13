import { combineReducers } from 'redux'
import login from './login.jsx'
import appUi from './appUi.jsx'
import addEquip from './addEquip.jsx'
import equipTypeSelect from './equipTypeSelect.jsx'
import addFamilia from './addFamilia.jsx'
//import visibilityFilter from './visibilityFilter'

const almoxApp = combineReducers({
  login,
  appUi,
  addEquip,
  equipTypeSelect,
  addFamilia,
})

export default almoxApp
