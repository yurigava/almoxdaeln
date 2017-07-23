import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import axios from 'axios'

function *getEstados(action) {
  yield put({ type: 'SET_LOADING', isLoading: true });
  try {
    const response = yield call(
      axios.get,
      action.serverUrl + '/api/getEstados',
      {withCredentials:true}
    );
    yield put({ type: 'SET_ESTADOS', estados: response.data });
  }
  catch (e) { }
  yield put({ type: 'SET_LOADING', isLoading: false });
}

function *updateEquipState(action) {
  yield put({ type: 'SET_LOADING', isLoading: true });
  try {
    const response = yield call(
      axios.post,
      action.serverUrl + '/api/updateEquipState',
      {
        patrimonio: action.patrimonio,
        estado: action.estado,
      },
      {withCredentials:true}
    );
    switch(response.data.code) {
      case "SUCCESS":
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: true });
        yield put({
          type: 'SET_SUBMISSION_MESSAGE', message: "Estado do equipamento '" + response.data.familia + " "
            + response.data.tipo + "' de Patrimônio: " +  action.patrimonio
            + " foi alterado com sucesso para '" + response.data.estado + "'."
        });
        break;

      case "ER_NOT_FOUND":
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
        yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "ERRO: O Equipamento não existe." });
        break;

      case "ER_SAME_STATE":
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
        yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "ERRO: O Equipamento já está neste estado." });
        break;

      default:
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
        yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "ERRO deconhecido, código: " + response.data.code });
        break;
    }
  }
  catch(e) { }
  yield put({ type: 'SET_LOADING', isLoading: false });
}

function *changeEquipStateSagas() {
    yield takeEvery('GET_ESTADOS', getEstados);
    yield takeEvery('UPDATE_EQUIP_STATE', updateEquipState);
}

export default changeEquipStateSagas;
