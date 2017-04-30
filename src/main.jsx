import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import appContainer from './containers/appContainer.jsx';
import loginContainer from './containers/loginContainer.jsx'
import EquipTable from './components/EquipTable.jsx';
import { Router, Route, hashHistory, IndexRedirect } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import almoxApp from './reducers/index.jsx'

const url = '192.168.0.69:8081';

main();

function verifyPermission(nextState, replace, callback)
{
  axios.get(url + nextState.location.pathname, {withCredentials:true})
  .then((response) => {
    if (response.data !== 'ok') {
      replace({ nextPathname: nextState.location.pathname }, '/login')
    }
    callback();
  })
  .catch((error) => {
    replace({ nextPathname: nextState.location.pathname }, '/login')
    callback();
  });
}

function verifyLoggedState(store)
{
  return (nextState, replace, callback) => {
    let { login } = store.getState();
    let { appUi } = store.getState();
    if (!login || !login.userRole) {
      axios.get('http://192.168.0.69:8081/getRole', {withCredentials:true})
      .then((response) => {
        //Lógica pra página inicial de cada papel
        //replace({ nextPathname: nextState.location.pathname }, '/', nextState.location.query)
        callback();
      })
      .catch((error) => {
        callback();
      });
    }
    else if (login.userRole !== 'loggedOut') {
      replace(
        { nextPathname: nextState.location.pathname }, '/'+appUi.linksById[appUi.visibleLinks[0]].link, nextState.location.query
      );
      callback();
    }
    else {
      callback();
    }
  };
}

function main() {
  injectTapEventPlugin();
  let store = createStore(almoxApp, applyMiddleware(thunkMiddleware));
  const app = document.createElement('div');
  document.body.appendChild(app);
  ReactDOM.render(
    <MuiThemeProvider>
      <Provider store={store}>
        <Router history={hashHistory}>
          <Route path="/" component={appContainer}>
            <IndexRedirect to="/login" />
            <Route path="/login" component={loginContainer}/>
            <Route path="/equips" component={EquipTable} url={url}/>
          </Route>
        </Router>
      </Provider>
    </MuiThemeProvider>
    , app);
}
