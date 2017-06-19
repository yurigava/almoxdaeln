import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import axios from 'axios'

function *logUserOut(action) {
    yield put({ type: 'SET_LOADING', isLoading: true });
    yield put({ type: 'CHANGE_ROLE', role: 'loggedOut' });
    try {
      yield call(
        axios.get,
        action.serverUrl + '/logout',
        {withCredentials:true}
      );
    } catch (e) { }
    yield put({ type: 'SET_LOADING', isLoading: false });
}

function *submitLogin(action) {
  yield put({ type: 'SET_LOADING', isLoading: true });
  try {
    const response = yield call(
      axios.post,
      action.serverUrl + '/login',
      { login: action.login, password: action.password },
      {withCredentials:true}
    );
    yield put({ type: 'SET_LOGIN_STATUS', success: true });
    yield put({ type: 'CHANGE_ROLE', role: response.data });
    //push('/'+getState().appUi.pagesList[1].info.link)
  } catch (e) {
    yield put({ type: 'SET_LOGIN_STATUS', success: false });
  }
  yield put({ type: 'SET_LOADING', isLoading: false });
}

function *loginSagas() {
    yield takeEvery('LOG_USER_OUT', logUserOut);
    yield takeEvery('SUBMIT_LOGIN', submitLogin);
}

export default loginSagas;
