import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


main();

function main() {
  injectTapEventPlugin();
  const app = document.createElement('div');
  document.body.appendChild(app);
  ReactDOM.render(
    <MuiThemeProvider>
      <App url="http://192.168.0.105:8081" />
    </MuiThemeProvider>
    , app);
}
import injectTapEventPlugin from 'react-tap-event-plugin';
