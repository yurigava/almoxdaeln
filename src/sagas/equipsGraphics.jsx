import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import axios from 'axios'

function *example(action) {
  yield put({ type: 'SET_LOADING', isLoading: true });
  yield put({ type: 'SET_LOADING', isLoading: false });
}

function *equipsGraphicsSagas() {
    yield takeEvery('TEMPLATE', example);
}

export default equipsGraphicsSagas;
