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

function *insertEquips(action) {
  if(action.patrimonios === [] || action.id_tipo === "" || action.id_familia === "" || action.patrimonios[0].value === "")
    return
  yield put({ type: 'SET_LOADING', isLoading: true });
  try {
    const response = yield call(
      axios.post,
      action.serverUrl + '/api/insertEquips',
      {
        patrimonios: action.patrimonios.map(pat => pat.value !== "").map(pat => pat.value),
        id_tipo:     action.id_tipo,
        id_familia:  action.id_familia
      },
      {withCredentials:true}
    );
  }
  catch (e) {
  }
  yield put({ type: 'SET_LOADING', isLoading: false });
}

function *addEquipSagas() {
    yield takeEvery('GET_TIPOS', getTipos);
    yield takeEvery('GET_FAMILIAS', getFamilias);
    yield takeEvery('INSERT_EQUIPS', insertEquips);
}

export default addEquipSagas;
