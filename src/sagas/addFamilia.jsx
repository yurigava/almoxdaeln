import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import axios from 'axios'

function *insertFamilia(action) {
  yield put({ type: 'SET_LOADING', isLoading: true });
  try {
    const response = yield call(
      axios.post,
      action.serverUrl + '/api/insertFamilia',
      {
        familia: action.familia,
      },
      {withCredentials:true}
    );
    if(response.data.code === "SUCCESS") {
      yield put({ type: 'SET_CREATED_FAMILIA_NUMBER', familiaNumber: response.data.id_familia });
    }
    else if(response.data.code === "ER_DUP_ENTRY") {
      yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
      yield put({
        type:'SET_SUBMISSION_MESSAGE',
        message: "ERRO: A Família '" + action.familia + "' já existe no banco de dados"
      });
    }
    else {
      yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
      yield put({
        type: 'SET_SUBMISSION_MESSAGE', message: "Ocorreu um erro inesperado. Código: " + response.code
      });
    }
  }
  catch (e) {
    console.log(e);
  }
  yield put({ type: 'SET_LOADING', isLoading: false });
}

function *addFamiliaSagas() {
    yield takeEvery('INSERT_FAMILIA', insertFamilia);
}

export default addFamiliaSagas;
