import React from 'react';
import axios from 'axios';
import AddEquip from './AddEquip.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import update from 'immutability-helper';
import { Link } from 'react-router'
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false};
    this.handleToggle = this.handleToggle.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleToggle() {
    this.setState({open: !this.state.open});
  }

  handleClose() {
    this.setState({open: false});
  }

  render() {
    return (
      <div>
        <div>
          <Drawer
            docked={false}
            width={300}
            open={this.state.open}
            onRequestChange={(open) => this.setState({open})}
          >
            <MenuItem
              onTouchTap={this.handleClose}
              containerElement={<Link to="/" />}
              primaryText="Login"
            />
            <MenuItem
              onTouchTap={this.handleClose}
              containerElement={<Link to="/equips" />}
              primaryText="Equipamentos"
            />
          </Drawer>
        </div>
        <div>
          <AppBar
            title="Almoxarifado DAELN"
            onLeftIconButtonTouchTap={this.handleToggle}
          />
          <center>
            <div>
              {this.props.children}
            </div>
          </center>
        </div>
      </div>
    );
  }
}
