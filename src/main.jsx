import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import appContainer from './containers/appContainer.jsx';
import loginContainer from './containers/loginContainer.jsx'
import studentsContainer from './containers/studentsContainer.jsx';
import EquipTable from './components/EquipTable.jsx';
import Students from './components/Students.jsx';
import { Router, Route, hashHistory, IndexRedirect } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import almoxApp from './reducers/index.jsx'
import { changeRole, setLogout } from './actions/index.js'

const url = 'http://192.168.0.69:8081';
let store = createStore(almoxApp, applyMiddleware(thunkMiddleware));

main();

function logUserOut(nextState, replace)
{
    store.dispatch(setLogout());
    replace({ nextPathname: nextState.location.pathname }, '/login', nextState.location.query);
}

function verifyPermission(nextState, replace)
{
  let { login } = store.getState();
  let { appUi } = store.getState();
  let { students } = store.getState();
  let pageData = appUi.pagesList.filter(page => "/"+page.info.link === nextState.location.pathname);
  if (pageData[0].allowedRoles.includes(login.userRole)) {
  } 
  else {
    //Manda para página de notAllowed
    replace({ nextPathname: nextState.location.pathname }, '/login', nextState.location.query);
  }
}

function verifyLoggedState(nextState, replace, callback)
{
  let { login } = store.getState();
  let { appUi } = store.getState();
  let { students } = store.getState();
  if (!login || !login.userRole) {
    axios.get(url+'/getRole', {withCredentials:true})
    .then((response) => {
      store.dispatch(changeRole(response.data));
      //Lógica pra página inicial de cada papel
      //replace({ nextPathname: nextState.location.pathname }, '/'+appUi.linksById[appUi.visibleLinks[0]], nextState.location.query)
      console.log("Async response: " + response.data)
      callback();
    })
    .catch((error) => {
      store.dispatch(changeRole('loggedOut'));
      console.log("Async response: error")
      callback();
    });
  }
  else if (login.userRole !== 'loggedOut') {
    console.log("User logged in as: " + login.userRole)
    callback();
  }
  else {
    console.log("User LoggedOut")
    callback();
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
            <Route path="/login" component={loginContainer} onEnter={verifyLoggedState}/>
            <Route path="/equips" component={EquipTable} url={url} onEnter={verifyPermission}/>
            <Route path="/students" component={Students} url={url} onEnter={verifyPermission}/>
          </Route>
        </Router>
      </Provider>
    </MuiThemeProvider>
    , app);
}
