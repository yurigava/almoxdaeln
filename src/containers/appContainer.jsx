import { connect } from 'react-redux'
import App from '../components/App.jsx'
import { setDrawerState, toggleDrawerState, checkLogout } from '../actions/index.js'


const mapStateToProps = (state) => {
  return {
    visibleLinks: state.appUi.visibleLinks.map(l =>
      state.appUi.linksById[l]
      ),
    isDrawerOpen: state.appUi.isDrawerOpen,
    loadingStatus: state.appUi.loadingStatus
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onDrawerRequestChange: (drawerOpen) => {
      dispatch(setDrawerState(drawerOpen))
    },
    onDrawerLinkClick: (clickedLink) => {
      dispatch(checkLogout(clickedLink))
    }
  }
}

const appContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default appContainer
