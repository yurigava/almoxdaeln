import React from 'react';
import ReactDOM from 'react-dom';
import Equips from './components/table.jsx';

main();

function main() {
  const app = document.createElement('div');
  document.body.appendChild(app);
  ReactDOM.render(<Equips url="/api/equips" />, app);
}

