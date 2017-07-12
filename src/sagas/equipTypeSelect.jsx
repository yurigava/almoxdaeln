import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import axios from 'axios'

function *getTipos(action) {
  yield put({ type: 'SET_LOADING', isLoading: true });
  try {
    const response = yield call(
      axios.get,
      action.serverUrl + '/api/getTipos',
      {withCredentials:true}
    );
    yield put({ type: 'SET_TIPOS', tipos: response.data });
  }
  catch (e) { }
  yield put({ type: 'SET_LOADING', isLoading: false });
}

function *getFamilias(action) {
  yield put({ type: 'SET_LOADING', isLoading: true });
  try {
    const response = yield call(
      axios.get,
      action.serverUrl + '/api/getFamilias',
      {withCredentials:true}
    );
    yield put({ type: 'SET_FAMILIAS', familias: response.data });
  }
  catch (e) { }
  yield put({ type: 'SET_LOADING', isLoading: false });
}

function *equipTypeSelectSagas() {
    yield takeEvery('GET_TIPOS', getTipos);
    yield takeEvery('GET_FAMILIAS', getFamilias);
}

export default equipTypeSelectSagas;
