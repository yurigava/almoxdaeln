import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import axios from 'axios'

function *insertOrGetRequisicao(serverUrl, usuario, date, materia) {
  try {
    const response = yield call(
      axios.post,
      serverUrl + '/api/getRequisicaoProfessorId',
      {
        usuario: usuario,
        date: date,
        materia: materia
      },
      {withCredentials:true}
    );
    switch(response.data.code) {
      case "SUCCESS":
        return response.data.idRequisicao;

      default:
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
        yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Ocorreu um erro desconhecido: "+ response.data.code});
        return -1;
    }
  }
  catch(e) {
    yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
    yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Falha ao comunicar com o servidor"});
    return -1;
  }
}

function *insertReserve(action) {
  yield put({ type: 'SET_LOADING', isLoading: true });
  const idRequisicao = yield call(
    insertOrGetRequisicao,
    action.serverUrl,
    action.usuario,
    action.date,
    action.materia,
  );
  if(idRequisicao < 1) {
    yield put({ type: 'SET_LOADING', isLoading: false });
    return;
  }
  try {
    const equipsUnique = Array.from(new Set(action.equips));
    const response = yield call(
      axios.post,
      action.serverUrl + '/api/professorReserve',
      {
        requisicao: idRequisicao,
        equips: equipsUnique
      },
      {withCredentials:true}
    );
  }

  catch(e) {
    yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
    yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Falha ao comunicar com o servidor"});
  }
  yield put({ type: 'SET_LOADING', isLoading: false });
}

function *quantidadeReserve(action) {
  yield put({ type: 'SET_LOADING', isLoading: true });
  
  try {
    const response = yield call(
      axios.get,
      action.serverUrl + '/api/quantidadeReserve',
      action.familia,
      {withCredentials:true}
    );
    yield put({ type: 'SET_QUANTIDADE', quantidade: response.data });
  }
  catch (e) { }
  yield put({ type: 'SET_LOADING', isLoading: false });
}

function *addReserveSagas() {
    yield takeEvery('INSERT_RESERVE', insertReserve);
    yield takeEvery('QUANTIDADE_RESERVE', quantidadeReserve);
}

export default addReserveSagas;
