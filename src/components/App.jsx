import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import {List, ListItem, makeSelectable} from 'material-ui/List';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import { Link } from 'react-router';

const SelectableList = makeSelectable(List);

const style = {
  container: {
    position: 'absolute',
    left: '50%',
    'marginLeft': '-25px'
  },
  refresh: {
    display: 'inline-block',
    position: 'relative',
    pointerEvents: 'none',
    zIndex: 5
  },
};

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.onChangeList = this.onChangeList.bind(this);
  }

  onChangeList(event, value)
  {
    this.props.router.push(value);
    this.props.onDrawerLinkClick();
  }

  render() {
    const index = this.props.visibleLinks.findIndex(page => this.props.location.pathname.includes(page.link));
    const title = index >= 0 ? "Almoxarifado DAELN - " + this.props.visibleLinks[index].linkText : "Almoxarifado DAELN";
    return (
      <div>
        <div>
          <Drawer
            docked={false}
            width={300}
            open={this.props.isDrawerOpen}
            onRequestChange={(drawerOpen) => this.props.onDrawerRequestChange(drawerOpen)}
          >
            <SelectableList
              value={this.props.location.pathname}
              onChange={this.onChangeList}
            >
              {
                this.props.visibleLinks.map(visibleLink =>
                  <ListItem
                    key={visibleLink.linkText}
                    primaryText={visibleLink.linkText}
                    value={"/"+visibleLink.link}
                  />
                )
              }
            </SelectableList>
          </Drawer>
        </div>
        <div>
          <AppBar
            title={title}
            titleStyle={{'textAlign': 'left'}}
            onLeftIconButtonTouchTap={() => this.props.onDrawerLinkClick()}
          />
          <center>
            <div style={style.container}>
              <RefreshIndicator
                size={50}
                left={0}
                top={40}
                status={this.props.loadingStatus}
                style={style.refresh}
              />
            </div>
            {this.props.children}
          </center>
        </div>
      </div>
    )
  }
}

App.propTypes = {
  isDrawerOpen: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  loadingStatus: PropTypes.string.isRequired,
  onDrawerRequestChange: PropTypes.func.isRequired,
  onDrawerLinkClick: PropTypes.func.isRequired,
  visibleLinks: PropTypes.arrayOf(PropTypes.shape({
    link: PropTypes.string.isRequired,
    linkText: PropTypes.string.isRequired
  }).isRequired).isRequired
}
