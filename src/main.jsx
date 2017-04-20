import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import EquipTable from './components/EquipTable.jsx';
import InputAuthentication from './components/InputAuthentication.jsx'
import { Router, Route, hashHistory, IndexRedirect } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

const url = "http://192.168.0.69:8081";

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

function verifyIfLogged(nextState, replace, callback)
{
  axios.get(url + '/getRole', {withCredentials:true})
  .then((response) => {
    //Lógica pra página inicial de cada papel
    if (response.data === 'almoxarife') {
      //replace({ nextPathname: nextState.location.pathname }, '/equips', nextState.location.query)
    }
    callback();
  })
  .catch((error) => {
    callback();
  });
}

function main() {
  injectTapEventPlugin();
  const app = document.createElement('div');
  document.body.appendChild(app);
  ReactDOM.render(
    <MuiThemeProvider>
      <Router history={hashHistory}>
        <Route path="/" component={App} url={url}>
          <IndexRedirect to="/login" />
          <Route path="/login" component={InputAuthentication} url={url} onEnter={verifyIfLogged}/>
          <Route path="/equips" component={EquipTable} url={url} onEnter={verifyPermission}/>
        </Route>
      </Router>
    </MuiThemeProvider>
    , app);
}
