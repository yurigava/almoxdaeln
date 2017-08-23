import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import axios from 'axios'

function *quantidadeEquipsGraph(action) {
  yield put({ type: 'SET_LOADING', isLoading: true });
  try {
    const response = yield call(
      axios.post,
      action.serverUrl + '/api/quantidadeEquipsGraph',
      {
        familia: action.familia,
        tipo: action.tipo,
        dataInicial: action.dataInicial,
        dataFinal: action.dataFinal,
      },
      {withCredentials:true}
    );
    if(response.data.code === "SUCCESS") {
      yield put({ type: 'SET_QUANTIDADE_EQUIPGRAPH', quantidade: response.data.quantidade, referencia: response.data.referencia });
    }
    else {
      yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
      yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Não há equipamento disponível no momento"});
      yield put({ type: 'SET_QUANTIDADE_EQUIPGRAPH', quantidade: response.data.quantidade, referencia: response.data.referencia });
    } 
  }
  catch (e) {
    yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
    yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Falha ao comunicar com o servidor"});
  }
  yield put({ type: 'SET_LOADING', isLoading: false });
}

function *equipsGraphicsSagas() {
    yield takeEvery('QUANTIDADE_EQUIPGRAPH', quantidadeEquipsGraph);
}

export default equipsGraphicsSagas;
