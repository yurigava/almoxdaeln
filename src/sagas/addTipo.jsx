import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import axios from 'axios'

function *insertTipo(action) {
  yield put({ type: 'SET_LOADING', isLoading: true });
  try {
    const response = yield call(
      axios.post,
      action.serverUrl + '/api/insertTipo',
      {
        tipo: action.tipo,
        Familias_id_familia: action.familia
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

    if(response.data === "ok") {
      yield put({ type: 'SET_DATA_SUBMITTED', submitted: true });
      yield put({ type:'SET_SUBMISSION_MESSAGE', message: "Novo tipo '" + action.tipo + "' foi adicionado com sucesso." });
    }
    else if(response.data.code === "ER_DUP_ENTRY") {
      yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
      yield put({ type:'SET_SUBMISSION_MESSAGE', message: "ERRO: O Tipo '" + action.tipo + "' já existe no banco de dados" });
    }
    else {
      yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
      yield put({
        type: 'SET_SUBMISSION_MESSAGE', message: "Ocorreu um erro inesperado. Código: " + response.code
      });
    }
  }
  catch (e) {
  }
  yield put({ type: 'SET_LOADING', isLoading: false });
}

function *addTipoSagas() {
    yield takeEvery('INSERT_TIPO', insertTipo);
}

export default addTipoSagas;
