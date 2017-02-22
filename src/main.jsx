import React from 'react';
import ReactDOM from 'react-dom';
import EquipTable from './components/equipTable.jsx';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

main();

function main() {
  injectTapEventPlugin();
  const app = document.createElement('div');
  document.body.appendChild(app);
  ReactDOM.render(
    <MuiThemeProvider>
      <EquipTable url="http://localhost:8081/api/equips" />
    </MuiThemeProvider>
    , app);
}
