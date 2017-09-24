import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import AppContainer from './containers/AppContainer.jsx';
import LoginContainer from './containers/LoginContainer.jsx'
import AddEquipContainer from './containers/AddEquipContainer.jsx'
import AddTipoContainer from './containers/AddTipoContainer.jsx'
import AddFamiliaContainer from './containers/AddFamiliaContainer.jsx'
import StudentLendContainer from './containers/StudentLendContainer.jsx'
import StudentReturnContainer from './containers/StudentReturnContainer.jsx'
import ChangeEquipStateContainer from './containers/ChangeEquipStateContainer.jsx'
import ChangeFamiliaNameContainer from './containers/ChangeFamiliaNameContainer.jsx'
import ChangeTipoNameContainer from './containers/ChangeTipoNameContainer.jsx'
import AddReserveContainer from './containers/AddReserveContainer.jsx';
import SelectReserveContainer from './containers/SelectReserveContainer.jsx';
import ReadEquipsReserve from './components/ReadEquipsReserve.jsx';
import EquipTable from './components/EquipTable.jsx';
import { Router, Route, hashHistory, IndexRedirect, IndexRoute } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { createStore, applyMiddleware } from 'redux'
import 'babel-polyfill'
import createSagaMiddleware from 'redux-saga'
import logger from 'redux-logger'
import { Provider } from 'react-redux'
import almoxApp from './reducers/index.jsx'
import { changeRole, setLogout } from './actions/login.js'
import loginSagas from './sagas/login.jsx'
import addEquipSagas from './sagas/addEquip.jsx'
import addTipoSagas from './sagas/addTipo.jsx'
import addFamiliaSagas from './sagas/addFamilia.jsx'
import studentLendSagas from './sagas/studentLend.jsx'
import studentReturnSagas from './sagas/studentReturn.jsx'
import changeEquipStateSagas from './sagas/changeEquipState.jsx'
import changeFamiliaNameSagas from './sagas/changeFamiliaName.jsx'
import changeTipoNameSagas from './sagas/changeTipoName.jsx'
import addReserveSagas from './sagas/addReserve.jsx'
import equipTypeSelectSagas from './sagas/equipTypeSelect.jsx'
import prepareReserve from './sagas/prepareReserve.jsx'

export const serverUrl = 'http://192.168.0.69:8081';

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
    almoxApp,
    applyMiddleware(sagaMiddleware),
    applyMiddleware(logger)
);

sagaMiddleware.run(loginSagas)
sagaMiddleware.run(addEquipSagas)
sagaMiddleware.run(addTipoSagas)
sagaMiddleware.run(addFamiliaSagas)
sagaMiddleware.run(studentLendSagas)
sagaMiddleware.run(studentReturnSagas)
sagaMiddleware.run(changeEquipStateSagas)
sagaMiddleware.run(changeFamiliaNameSagas)
sagaMiddleware.run(changeTipoNameSagas)
sagaMiddleware.run(addReserveSagas)
sagaMiddleware.run(equipTypeSelectSagas)
sagaMiddleware.run(prepareReserve)

main();

function logUserOut(nextState, replace)
{
    store.dispatch(setLogout(serverUrl));
    replace({ nextPathname: nextState.location.pathname }, '/login', nextState.location.query);
}

function verifyPermission(nextState, replace)
{
  let { login } = store.getState();
  let { appUi } = store.getState();
  let pageData = appUi.pagesList.filter(page => nextState.location.pathname.includes(page.info.link));
  if(!pageData[0].allowedRoles.includes(login.userRole))
  {
    //Manda para página de notAllowed
    replace({ nextPathname: nextState.location.pathname }, '/login', nextState.location.query);
  }
}

function main() {
  injectTapEventPlugin();
  const app = document.createElement('div');
  document.body.appendChild(app);
  ReactDOM.render(
    <MuiThemeProvider>
      <Provider store={store}>
        <Router history={hashHistory}>
          <Route path="/" component={AppContainer}>
            <IndexRedirect to="/login" />
            <Route path="/logout" onEnter={logUserOut}/>
            <Route path="/login" component={LoginContainer}/>
            <Route path="/changeFamiliaName" component={ChangeFamiliaNameContainer} onEnter={verifyPermission}/>
            <Route path="/changeTipoName" component={ChangeTipoNameContainer} onEnter={verifyPermission}/>
            <Route path="/changeEquipState" component={ChangeEquipStateContainer} onEnter={verifyPermission}/>
            <Route path="/studentReturn" component={StudentReturnContainer} onEnter={verifyPermission}/>
            <Route path="/studentLend" component={StudentLendContainer} onEnter={verifyPermission}/>
            <Route path="/addFamilia" component={AddFamiliaContainer} onEnter={verifyPermission}/>
            <Route path="/addTipo" component={AddTipoContainer} onEnter={verifyPermission}/>
            <Route path="/addEquips" component={AddEquipContainer} onEnter={verifyPermission}/>
            <Route path="/equips" component={EquipTable} url={serverUrl} onEnter={verifyPermission}/>
            <Route path="/addReserve" component={AddReserveContainer} onEnter={verifyPermission}/>
            <Route path="/prepareReserve" onEnter={verifyPermission}>
              <IndexRoute component={SelectReserveContainer}/>
              <Route path="/prepareReserve/readEquips" component={ReadEquipsReserve}/>
            </Route>
          </Route>
        </Router>
      </Provider>
    </MuiThemeProvider>
    , app);
}
