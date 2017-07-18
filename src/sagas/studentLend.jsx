import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import axios from 'axios'

function *insertOrGetRequisicao(serverUrl, usuario) {
  try {
    const response = yield call(
      axios.post,
      serverUrl + '/api/getRequisicaoStudentId',
      {
        usuario: usuario,
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

function *insertStudentLend(action) {
  yield put({ type: 'SET_LOADING', isLoading: true });
  const idRequisicao = yield call(
    insertOrGetRequisicao,
    action.serverUrl,
    action.usuario
  );
  if(idRequisicao < 1) {
    yield put({ type: 'SET_LOADING', isLoading: false });
    return;
  }
  try {
    const response = yield call(
      axios.post,
      action.serverUrl + '/api/studentLend',
      {
        requisicao: idRequisicao,
        patrimonios: Array.from(new Set(action.patrimonios))
      },
      {withCredentials:true}
    );
    let singular
    let plural
    switch(response.data.code) {
      case "SUCCESS":
        let message = "Empréstimo efetuado com sucesso.\\nOs seguintes equipamentos foram emprestados:\\n";
        response.data.lentEquips.forEach(equip => {
          message = message + equip.familia + " " + equip.tipo + "\\n";
        });
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: true });
        yield put({ type: 'SET_SUBMISSION_MESSAGE', message: message});
        break;

      case "ER_NOT_FOUND":
        singular = "ERRO: O Equipamento pedido não está registrado.";
        plural = "ERRO: O pedido contém Equipamentos não registrados." ;
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
        yield put({ type: 'SET_SUBMISSION_MESSAGE', message: response.data.notFound.length > 1 ? plural : singular});
        yield put({
          type: 'SET_STUDENT_LEND_ERROR_DESCRIPTION',
          equipNumbers: response.data.notFound,
          errorCode: response.data.code
        });
        break;

      case "ER_NOT_AVAILABLE":
        singular = "ERRO: O Equipamento pedido não está disponível.";
        plural = "ERRO: O pedido contém Equipamentos não disponíveis.";
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
        yield put({ type: 'SET_SUBMISSION_MESSAGE', message: response.data.notAvailable.length > 1 ? plural : singular});
        yield put({
          type: 'SET_STUDENT_LEND_ERROR_DESCRIPTION',
          equipNumbers: response.data.notAvailable,
          errorCode: response.data.code
        });
        break;

      default:
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
        yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Ocorreu um erro deconhecido, código: " + response.data.code });
        break;
    }
  }
  catch(e) {
    yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
    yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Falha ao comunicar com o servidor"});
  }
  yield put({ type: 'SET_LOADING', isLoading: false });
}

function *studentLendSagas() {
    yield takeEvery('INSERT_STUDENT_LEND', insertStudentLend);
}

export default studentLendSagas;
