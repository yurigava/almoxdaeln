import { connect } from 'react-redux'
import App from '../components/App.jsx'
import { setDrawerState, toggleDrawerState, checkLogout } from '../actions/index.js'


const mapStateToProps = (state) => {
  return {
    visibleLinks: state.appUi.pagesList.filter(page =>
      page.allowedRoles.includes(state.login.userRole))
    .map(selectedPage =>
      selectedPage.info
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
    onDrawerLinkClick: () => {
      dispatch(toggleDrawerState())
    }
  }
}

const appContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default appContainer
