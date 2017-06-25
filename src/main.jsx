import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import appContainer from './containers/appContainer.jsx';
import loginContainer from './containers/loginContainer.jsx'
import addEquipContainer from './containers/addEquipContainer.jsx'
import EquipTable from './components/EquipTable.jsx';
import { Router, Route, hashHistory, IndexRedirect } from 'react-router';
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

export const serverUrl = 'http://192.168.0.69:8081';

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
    almoxApp,
    applyMiddleware(sagaMiddleware),
    applyMiddleware(logger)
);

sagaMiddleware.run(loginSagas)
sagaMiddleware.run(addEquipSagas)

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
  let pageData = appUi.pagesList.filter(page => "/"+page.info.link === nextState.location.pathname);
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
          <Route path="/" component={appContainer}>
            <IndexRedirect to="/login" />
            <Route path="/logout" onEnter={logUserOut}/>
            <Route path="/login" component={loginContainer} />
            <Route path="/addEquips" component={addEquipContainer} onEnter={verifyPermission}/>
            <Route path="/equips" component={EquipTable} url={serverUrl} onEnter={verifyPermission}/>
          </Route>
        </Router>
      </Provider>
    </MuiThemeProvider>
    , app);
}
