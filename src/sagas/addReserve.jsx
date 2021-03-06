import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import axios from 'axios'

function *testeQuantidade(serverUrl, equips, date, turno) {
  try {
    const response = yield call(
      axios.post,
      serverUrl + '/api/testeProfessorReserve',
      {
        equips: equips,
        date: date,
        turno: turno
      },
      {withCredentials:true}
    );
    switch(response.data.code) {
      case "ok":
        return 1;

      case "nok":
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
        yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Não há equipamento disponível no momento"});
        return -1;

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

function *insertOrGetRequisicao(serverUrl, usuario, date, turno, materia) {
  try {
    const response = yield call(
      axios.post,
      serverUrl + '/api/getRequisicaoProfessorId',
      {
        usuario: usuario,
        date: date,
        turno: turno,
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
  const equipsUnique = Array.from(new Set(action.equips));

  const idRequisicao = yield call(
    insertOrGetRequisicao,
    action.serverUrl,
    action.usuario,
    action.date,
    action.turno,
    action.materia,
  );
  if(idRequisicao < 1) {
    yield put({ type: 'SET_LOADING', isLoading: false });
    yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
    yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Requisição não inserida"});
    return;
  }
  try {
    const response = yield call(
      axios.post,
      action.serverUrl + '/api/professorReserve',
      {
        requisicao: idRequisicao,
        equips: equipsUnique
      },
      {withCredentials:true}
    );

    if(response.data === "ok") {
      let singular = "O equipamento foi reservado com sucesso.";
      let plural = "Os equipamentos foram reservados com sucesso.";
      yield put({ type: 'SET_DATA_SUBMITTED', submitted: true });
      yield put({ type: 'SET_SUBMISSION_MESSAGE', message: equipsUnique.length > 1 ? plural : singular});
    }
    else {
      yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
      yield put({
        type: 'SET_SUBMISSION_MESSAGE', message: "Ocorreu um erro inesperado. Código: " + response.data.code
      });
    }
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
      axios.post,
      action.serverUrl + '/api/quantidadeReserve',
      {
        familia: action.familia,
        tipo: action.tipo,
        name: action.name
      },
      {withCredentials:true}
    );
    if(response.data.code === "SUCCESS") {
      yield put({ type: 'RESERVE_SET_AVAILABLEQUIPS', availableEquips: response.data.quantidade, index: response.data.name });
    }
    else {
      yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
      yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Não há equipamento disponível no momento"});
      yield put({ type: 'RESERVE_SET_AVAILABLEQUIPS', availableEquips: response.data.quantidade, index: response.data.name });
    }
  }
  catch (e) {
    yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
    yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Falha ao comunicar com o servidor"});
  }
  yield put({ type: 'SET_LOADING', isLoading: false });
}

function *getLastReq(action) {
  yield put({ type: 'SET_LOADING', isLoading: true });
  try {
    const response = yield call(
      axios.post,
      action.serverUrl + '/api/getLastReq',
      {
        usuario: action.usuario,
      },
      {withCredentials:true}
    );
    if(response.data.code === "SUCCESS") {
      yield put({ type: 'RESERVE_SET_LAST_REQ', equipamentos: response.data.equipamentos , requisicoes: response.data.requisicoes });
    }
    else if(response.data.code === "NOTHING") {
      yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
      yield put({ type: 'RESERVE_CLEAR_SET_LAST_REQ', equipamentos: response.data.equipamentos, requisicoes: response.data.requisicoes });
    }
    else {
      yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
      yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Erro na requisição"});
      yield put({ type: 'RESERVE_SET_LAST_REQ', equipamentos: response.data.equipamentos, requisicoes: response.data.requisicoes});
    }
  }
  catch (e) {
    yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
    yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Falha ao comunicar com o servidor"});
  }
  yield put({ type: 'SET_LOADING', isLoading: false });
}

function *addReserveSagas() {
    yield takeEvery('INSERT_RESERVE', insertReserve);
    yield takeEvery('QUANTIDADE_RESERVE', quantidadeReserve);
    yield takeEvery('RESERVE_GET_LAST_REQ', getLastReq);
}

export default addReserveSagas;
