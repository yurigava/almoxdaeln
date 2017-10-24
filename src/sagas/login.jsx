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
      if(!response) {
        yield put({ type: 'SET_LOADING', isLoading: false });
        return;
      }
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
    if(!response) {
      yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Falha ao comunicar com o servidor." });
      yield put({ type: 'SET_LOADING', isLoading: false });
      return;
    }
    yield put({ type: 'SET_LOGIN_STATUS', success: true });
    yield put({ type: 'CHANGE_ROLE', role: response.data.role, usuario: response.data.username });
  } catch (e) {
    if(e.response && (e.response.status === 401 || e.response.status === 400))
      yield put({ type: 'SET_LOGIN_STATUS', success: false });
    else if(!e.response)
      yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Falha ao comunicar com o servidor." });
    else
      yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Ocorreu um erro inesperado: " + e });
  }
  yield put({ type: 'SET_LOADING', isLoading: false });
}

function *getUserRole(action) {
  yield put({ type: 'SET_LOADING', isLoading: true });
  try {
    const response = yield call(
      axios.get,
      action.serverUrl + '/getRole',
      {withCredentials:true}
    );
    if(!response) {
      yield put({ type: 'CHANGE_ROLE', role: "loggedOut" });
      yield put({ type: 'SET_LOADING', isLoading: false });
      return;
    }
    yield put({ type: 'SET_LOGIN_STATUS', success: true });
    yield put({ type: 'CHANGE_ROLE', role: response.data.role, usuario: response.data.username });
  }
  catch (e) {
    console.log(e)
    yield put({ type: 'CHANGE_ROLE', role: "loggedOut" });
  }
  yield put({ type: 'SET_LOADING', isLoading: false });
}

function *loginSagas() {
    yield takeEvery('LOG_USER_OUT', logUserOut);
    yield takeEvery('SUBMIT_LOGIN', submitLogin);
    yield takeLatest('GET_USER_ROLE', getUserRole);
}

export default loginSagas;
