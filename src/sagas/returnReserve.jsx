import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import axios from 'axios'

function *getReserves(action) {
  yield put({ type: 'SET_LOADING', isLoading: true });
  try {
    const response = yield call(
      axios.post,
      action.serverUrl + '/api/getPreparedReserves',
      {
        stateToGet: 1
      },
      {withCredentials:true}
    );

    switch(response.data.code) {
      case "SUCCESS":
        yield put({ type: 'PROVIDE_RESERVE_SET_RESERVES', reserves: response.data.reserves});
        break;

      default:
        yield put({
          type: 'SET_SUBMISSION_MESSAGE', message: "Ocorreu um erro inesperado. Código: " + response.data.code
        });
        yield put({ type: 'SET_IS_YES_NO_MESSAGE', isYesNoMessage: false});
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: false});
        break;
    }
  }
  catch (e) {
    yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Falha ao comunicar com o servidor: " + e.toString()});
    yield put({ type: 'SET_DATA_SUBMITTED', submitted: false});
    yield put({ type: 'SET_IS_YES_NO_MESSAGE', isYesNoMessage: false});
  }
  yield put({ type: 'SET_LOADING', isLoading: false });
}

function *getReserveDetails(action) {
  yield put({ type: 'SET_LOADING', isLoading: true });
  try {
    const response = yield call(
      axios.post,
      action.serverUrl + '/api/getReturnedReserveDetails',
      {
        reserveId: action.id
      },
      {withCredentials:true}
    );

    switch(response.data.code) {
      case "SUCCESS":
        yield put({ type: 'RETURN_RESERVE_SET_RESERVE_DETAILS', lentEquips: response.data.lentEquips });
        yield put({ type: 'RETURN_RESERVE_SET_RESERVE_ID', reserveId: action.id });
        break;

      default:
        yield put({
          type: 'SET_SUBMISSION_MESSAGE', message: "Ocorreu um erro inesperado. Código: " + response.data.code
        });
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: false});
        yield put({ type: 'SET_IS_YES_NO_MESSAGE', isYesNoMessage: false});
        break;
    }
  }
  catch (e) {
    yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Falha ao comunicar com o servidor: " + e.toString()});
    yield put({ type: 'SET_IS_YES_NO_MESSAGE', isYesNoMessage: false});
    yield put({ type: 'SET_DATA_SUBMITTED', submitted: false});
  }
  yield put({ type: 'SET_LOADING', isLoading: false });
}

function *registerReturnedEquips(action) {
  yield put({ type: 'SET_LOADING', isLoading: true });
  try {
    const response = yield call(
      axios.post,
      action.serverUrl + '/api/registerReturnedReserve',
      {
        reserveId: action.reserveId,
        patrimonios: action.equips,
        observacao: "Verificado por " + action.usuario
      },
      {withCredentials:true}
    );

    switch(response.data.code) {
      case "SUCCESS":
        yield put({
          type: 'SET_SUBMISSION_MESSAGE', message: "Devolução registrada com sucesso."
        });
        yield put({ type: 'SET_IS_YES_NO_MESSAGE', isYesNoMessage: false});
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: true});
        break;

      case "ER_NOT_FOUND":
        yield put({
          type: 'SET_SUBMISSION_MESSAGE', message: "Erro: Reserva não encontrada."
        });
        yield put({ type: 'SET_IS_YES_NO_MESSAGE', isYesNoMessage: false});
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: false});
        break;

      default:
        yield put({
          type: 'SET_SUBMISSION_MESSAGE', message: "Ocorreu um erro inesperado. Código: " + response.data.code
        });
        yield put({ type: 'SET_IS_YES_NO_MESSAGE', isYesNoMessage: false});
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: false});
        break;
    }
  }
  catch (e) {
    yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Falha ao comunicar com o servidor: " + e.toString()});
    yield put({ type: 'SET_IS_YES_NO_MESSAGE', isYesNoMessage: false});
    yield put({ type: 'SET_DATA_SUBMITTED', submitted: false});
  }
  yield put({ type: 'SET_LOADING', isLoading: false });
}

function *returnReserveSagas() {
    yield takeEvery('RETURN_RESERVE_GET_IN_USE_RESERVES', getReserves);
    yield takeEvery('RETURN_RESERVE_GET_RESERVE_DETAILS', getReserveDetails);
    yield takeEvery('RETURN_RESERVE_REGISTER_RETURNED_EQUIPS', registerReturnedEquips);
}

export default returnReserveSagas;
