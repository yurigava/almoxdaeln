import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import axios from 'axios'

function *getReserves(action) {
  yield put({ type: 'SET_LOADING', isLoading: true });
  try {
    const response = yield call(
      axios.post,
      action.serverUrl + '/api/getReserves',
      {
        date: action.date,
        shift: action.shift
      },
      {withCredentials:true}
    );

    switch(response.data.code) {
      case "SUCCESS":
        yield put({ type: 'SET_RESERVES', reserves: response.data.reserves});
        break;

      default:
        yield put({
          type: 'SET_SUBMISSION_MESSAGE', message: "Ocorreu um erro inesperado. Código: " + response.code
        });
        break;
    }
  }
  catch (e) {
    yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Falha ao comunicar com o servidor: " + e.toString()});
    yield put({ type: 'SET_IS_YES_NO_MESSAGE', isYesNoMessage: false});
  }
  yield put({ type: 'SET_LOADING', isLoading: false });
}

function *prepareReserveSagas() {
    yield takeEvery('GET_RESERVES', getReserves);
    //    yield takeEvery('GET_RESERVE_DETAILS', getReserveDetails);
}

export default prepareReserveSagas;
