import { combineReducers } from 'redux'
import login from './login.jsx'
import appUi from './appUi.jsx'
import addEquip from './addEquip.jsx'
import equipTypeSelect from './equipTypeSelect.jsx'
import addFamilia from './addFamilia.jsx'
import studentLend from './studentLend.jsx'
import studentReturn from './studentReturn.jsx'
import changeEquipState from './changeEquipState.jsx'
//import visibilityFilter from './visibilityFilter'

const almoxApp = combineReducers({
  login,
  appUi,
  addEquip,
  equipTypeSelect,
  addFamilia,
  studentLend,
  studentReturn,
  changeEquipState,
})

export default almoxApp
