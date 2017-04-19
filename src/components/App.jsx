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
    this.state = {drawerOpen: false,
                  currentRole: 'loggedOut'};
    this.handleToggle = this.handleToggle.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.renderChildren = this.renderChildren.bind(this);
    this.handleLoginAlmoxarife = this.handleLoginAlmoxarife.bind(this);
    this.handleLoginProfessor = this.handleLoginProfessor.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleLogoutButton = this.handleLogoutButton.bind(this);
  }

	componentWillMount() {
    axios.get(this.props.route.url + "/", {withCredentials:true})
    .then((response) => {
			if (response.data != "loggedOut") {
        this.setState(update(this.state, {currentRole: {$set: response.data}}));
			}
    })
    .catch((error) => {
      this.setState(update(this.state, {currentRole: {$set: 'loggedOut'}}));
    });
  }

  handleClose() {
    this.setState(update(this.state, {drawerOpen: {$set: false}}));
  }

  handleToggle() {
    this.setState(update(this.state, {drawerOpen: {$set: !this.state.drawerOpen}}));
  }

  handleLoginAlmoxarife() {
    this.setState(update(this.state, {currentRole: {$set: 'almoxarife'}}));
    this.context.router.push('/equips');
  }

  handleLoginProfessor() {
    this.setState(update(this.state, {currentRole: {$set: 'professor'}}));
    this.context.router.push('/equips');
  }

  handleLogout() {
    this.setState(update(this.state, {currentRole: {$set: 'loggedOut'}}));
    this.context.router.push('/login');
  }

  handleLogoutButton() {
    this.setState(update(this.state, {
        currentRole: {$set: 'loggedOut'},
        drawerOpen: {$set: false}
    }));
    axios.get(this.props.route.url + "/logout", {withCredentials:true});
    this.context.router.push('/login');
  }

  renderChildren() {
    return React.Children.map(this.props.children, child => {
      if (child.type === InputAuthentication)
        return React.cloneElement(child, {
          handleLoginAlmoxarife: this.handleLoginAlmoxarife,
          handleLoginProfessor: this.handleLoginProfessor
        });
      else
        return child;
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
          onTouchTap={this.handleLogoutButton}
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
            open={this.state.drawerOpen}
            onRequestChange={(drawerOpen) => this.setState(update(this.state, {drawerOpen: {$set: drawerOpen}}))}
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

App.contextTypes = {
  router: React.PropTypes.func.isRequired
};
