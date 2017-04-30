import React, { PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import { Link } from 'react-router';

const style = {
  container: {
    position: 'relative',
  },
  refresh: {
    display: 'inline-block',
    position: 'relative',
  },
};

const App = ({isDrawerOpen, children, loadingStatus, onDrawerRequestChange, onDrawerLinkClick, visibleLinks}) => (
  <div>
    <div>
      <Drawer
        docked={false}
        width={300}
        open={isDrawerOpen}
        onRequestChange={(drawerOpen) => onDrawerRequestChange(drawerOpen)}
      >
        {visibleLinks.map(visibleLink =>
          <MenuItem
            onTouchTap={onDrawerLinkClick}
            containerElement={<Link to={"/"+visibleLink.link} />}
            primaryText={visibleLink.linkText}
          />
        )}
      </Drawer>
    </div>
    <div>
      <AppBar
        title="Almoxarifado DAELN"
        onLeftIconButtonTouchTap={() => onDrawerLinkClick()}
      />
      <center>
        <div>
          <div style={style.container}>
            <RefreshIndicator
              size={40}
              left={0}
              top={10}
              status={loadingStatus}
              style={style.refresh}
            />
          </div>
          {children}
        </div>
      </center>
    </div>
  </div>
)

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

export default App
