import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import axios from 'axios'

function *getReserves(action) {
  yield put({ type: 'SET_LOADING', isLoading: true });
  try {
    const response = yield call(
      axios.post,
      action.serverUrl + '/api/getPreparedReserves',
      {
        stateToGet: 4
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
        break;
    }
  }
  catch (e) {
    yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Falha ao comunicar com o servidor: " + e.toString()});
    yield put({ type: 'SET_IS_YES_NO_MESSAGE', isYesNoMessage: false});
  }
  yield put({ type: 'SET_LOADING', isLoading: false });
}

function *registerDelivered(action) {
  yield put({ type: 'SET_LOADING', isLoading: true });
  try {
    const response = yield call(
      axios.post,
      action.serverUrl + '/api/registerDeliveredReserve',
      {
        requisicao: action.id
      },
      {withCredentials:true}
    );

    switch(response.data.code) {
      case "SUCCESS":
        yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Entrega registrada com sucesso."});
        yield put({ type: 'SET_IS_YES_NO_MESSAGE', isYesNoMessage: false});
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: true});
        break;

      default:
        yield put({
          type: 'SET_SUBMISSION_MESSAGE', message: "Ocorreu um erro inesperado. Código: " + response.data.code
        });
        yield put({ type: 'SET_IS_YES_NO_MESSAGE', isYesNoMessage: false});
        break;
    }
  }
  catch (e) {
    yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Falha ao comunicar com o servidor: " + e.toString()});
    yield put({ type: 'SET_IS_YES_NO_MESSAGE', isYesNoMessage: false});
  }
  yield put({ type: 'SET_LOADING', isLoading: false });
}

function *provideReserveSagas() {
    yield takeEvery('PROVIDE_RESERVE_GET_RESERVES', getReserves);
    yield takeEvery('PROVIDE_RESERVE_REGISTER_DELIVERED', registerDelivered);
}
export default provideReserveSagas;
