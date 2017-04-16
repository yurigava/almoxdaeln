import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import EquipTable from './components/EquipTable.jsx';
import InputAuthentication from './components/InputAuthentication.jsx';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const url = "http://localhost:8081";

main();

function main() {
  injectTapEventPlugin();
  const app = document.createElement('div');
  document.body.appendChild(app);
  ReactDOM.render(
    <MuiThemeProvider>
      <Router history={hashHistory}>
        <Route path="/" component={App}>
          <Route path="/login" component={InputAuthentication} url={url}/>
          <Route path="/equips" component={EquipTable} url={url}/>
        </Route>
      </Router>
    </MuiThemeProvider>
    , app);
}
import injectTapEventPlugin from 'react-tap-event-plugin';
