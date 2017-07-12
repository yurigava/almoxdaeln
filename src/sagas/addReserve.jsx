import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import axios from 'axios'

function *testeQuantidade(serverUrl, equips) {
  try {
    const response = yield call(
      axios.post,
      serverUrl + '/api/testeProfessorReserve',
      {
        equips: equips
      },
      {withCredentials:true}
    );
    switch(response.data.code) {
      case "ok":
        break;
      
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
  const equipsUnique = Array.from(new Set(action.equips));

  const testeOK = yield call(
    testeQuantidade,
    action.serverUrl,
    action.equips,    
  );

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
    //const equipsUnique = Array.from(new Set(action.equips));
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
      //let plural = "Os equipamentos foram reservado com sucesso.";
      yield put({ type: 'SET_DATA_SUBMITTED', submitted: true });
      yield put({ type: 'SET_SUBMISSION_MESSAGE', message: singular});
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
      yield put({ type: 'SET_QUANTIDADE', quantidade: response.data.quantidade, name: response.data.name });
    }
    else {
      yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Não há equipamento disponível no momento"});
      yield put({ type: 'SET_QUANTIDADE', quantidade: response.data.quantidade, name: response.data.name });
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
}

export default addReserveSagas;
