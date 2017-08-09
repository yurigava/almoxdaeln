import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import axios from 'axios'

function *updateFamiliaName(action) {
  yield put({ type: 'SET_LOADING', isLoading: true });
  try {
    const response = yield call(
      axios.post,
      action.serverUrl + '/api/updateFamilia',
      {
        familiaNewName: action.familiaNewName,
        familia: action.familiaIndex
      },
      {withCredentials:true}
    );
    if(!response) {
      yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
      yield put({
        type: 'SET_SUBMISSION_MESSAGE', message: "Falha ao comunicar com o servidor."
      });
      yield put({ type: 'SET_LOADING', isLoading: false });
      return;
    }
    switch(response.data.code) {
      case "SUCCESS":
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: true });
        yield put({ type:'SET_SUBMISSION_MESSAGE', message: "Família '" + response.data.oldName + "."
          + "' foi alterada com sucesso para: '" + action.familiaNewName + "'." });
        break;

      case "ER_NOT_FOUND":
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
        yield put({ type:'SET_SUBMISSION_MESSAGE', message: "ERRO: Família não encontrada. Por favor, recarregue a página."});
        break;

      case "ER_DUP_ENTRY":
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
        yield put({ type:'SET_SUBMISSION_MESSAGE', message: "ERRO: A Família '" + action.familiaNewName +
          "' já existe no banco de dados." });
        break;

      default:
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
        yield put({
          type: 'SET_SUBMISSION_MESSAGE', message: "Ocorreu um erro inesperado. Código: " + response.data.code
        });
        break;
    }
  }
  catch (e) {
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
        yield put({
          type: 'SET_SUBMISSION_MESSAGE', message: "Falha ao comunicar com o servidor."
        });
  }
  yield put({ type: 'SET_LOADING', isLoading: false });
}

function *changeFamiliaNameSagas() {
    yield takeEvery('UPDATE_FAMILIA_NAME', updateFamiliaName);
}

export default changeFamiliaNameSagas;
