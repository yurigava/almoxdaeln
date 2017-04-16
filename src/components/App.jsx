import React from 'react';
import axios from 'axios';
import AddEquip from './AddEquip.jsx';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import update from 'immutability-helper';
import { Link } from 'react-router'
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import InputAuthentication from './InputAuthentication.jsx';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false,
                  currentRole: 'loggedOut'};
    this.handleToggle = this.handleToggle.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.renderChildren = this.renderChildren.bind(this);
    this.handleRole = this.handleRole.bind(this);
  }

  handleClose() {
    this.setState(update(this.state, {open: {$set: false}}));
  }

  handleToggle() {
    this.setState(update(this.state, {open: {$set: !this.state.open}}));
  }

  handleRole(role) {
    this.setState(update(this.state, {currentRole: {$set: role}}));
    if(role === 'loggedOut')
      this.props.router.push('/login')
    else if(role === 'almoxarife')
      this.props.router.push('/equips')
  }

  renderChildren() {
    return React.Children.map(this.props.children, child => {
      if (child.type === InputAuthentication)
        return React.cloneElement(child, {
          handleRole: this.handleRole
        })
      else
        return child
    })
  }

  render() {
    let drawerLinks = null;
    if(this.state.currentRole === 'loggedOut')
    {
      drawerLinks = <MenuItem
        onTouchTap={this.handleClose}
        containerElement={<Link to="/login" />}
        primaryText="Login"
      />;
    }
    else if(this.state.currentRole === 'almoxarife')
    {
      drawerLinks = (<div>
        <MenuItem
          onTouchTap={this.handleClose}
          containerElement={<Link to="/equips" />}
          primaryText="Equipamentos"
        />
        <MenuItem
          onTouchTap={this.handleClose}
          containerElement={<Link to="/login" />}
          primaryText="Logout"
        />
      </div>);
    }

    return (
      <div>
        <div>
          <Drawer
            docked={false}
            width={300}
            open={this.state.open}
            onRequestChange={(open) => this.setState(update(this.state, {open: {$set: open}}))}
          >
            {drawerLinks}
          </Drawer>
        </div>
        <div>
          <AppBar
            title="Almoxarifado DAELN"
            onLeftIconButtonTouchTap={this.handleToggle}
          />
          <center>
            <div>
              {this.renderChildren()}
            </div>
          </center>
        </div>
      </div>
    );
  }
}
