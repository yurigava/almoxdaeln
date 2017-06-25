import { connect } from 'react-redux'
import App from '../components/App.jsx'
import { setDrawerState, toggleDrawerState } from '../actions/appUi.js'

const getVisibleLinks = (appUi, login) => {
  return (
      appUi.pagesList.filter(page =>
        page.allowedRoles.includes(login.userRole)
      )
      .map(selectedPage =>
        selectedPage.info
      )
  )
}

const mapStateToProps = (state) => {
  return {
    visibleLinks: getVisibleLinks(state.appUi, state.login),
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
