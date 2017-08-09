import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import axios from 'axios'

function *updateTipoName(action) {
  yield put({ type: 'SET_LOADING', isLoading: true });
  try {
    const response = yield call(
      axios.post,
      action.serverUrl + '/api/updateTipo',
      {
        tipoNewName: action.tipoNewName,
        id_familia: action.familiaIndex,
        id_tipo: action.tipoIndex
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
        yield put({ type:'SET_SUBMISSION_MESSAGE', message: "'" + response.data.familia + " " + response.data.oldName
          + "' alterado com sucesso para: '" + response.data.familia + " " + action.tipoNewName + "'." });
        break;

      case "ER_NOT_FOUND":
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
        yield put({ type:'SET_SUBMISSION_MESSAGE', message: "ERRO: Tipo não encontrado. Por favor, recarregue a página."});
        break;

      case "ER_DUP_ENTRY":
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
        yield put({ type:'SET_SUBMISSION_MESSAGE', message: "ERRO: O Tipo '" + action.familiaNewName +
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

function *changeTipoNameSagas() {
    yield takeEvery('UPDATE_TIPO_NAME', updateTipoName);
}

export default changeTipoNameSagas;
