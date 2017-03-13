import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import App1 from './components/App1.jsx';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

main1();

function main() {
  injectTapEventPlugin();
  const app = document.createElement('div');
  document.body.appendChild(app);
  ReactDOM.render(
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>
    , app);
}

function main1() {
  const aux = 1;
  if(aux === 1)
  {
  injectTapEventPlugin();
  const app1 = document.createElement('div');
  document.body.appendChild(app1);
  ReactDOM.render(
    <MuiThemeProvider>
      <App1 />
    </MuiThemeProvider>
    , app1);
    }
  
  else
  {
  injectTapEventPlugin();
  const app = document.createElement('div');
  document.body.appendChild(app);
  ReactDOM.render(
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>
    , app);
    }
}
