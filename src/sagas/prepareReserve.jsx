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
        shift: action.shift,
        estado: 3
      },
      {withCredentials:true}
    );

    switch(response.data.code) {
      case "SUCCESS":
        yield put({ type: 'PREPARE_RESERVE_SET_RESERVES', reserves: response.data.reserves});
        break;

      default:
        yield put({
          type: 'SET_SUBMISSION_MESSAGE', message: "Ocorreu um erro inesperado. Código: " + response.data.code
          yield put({ type: 'SET_IS_YES_NO_MESSAGE', isYesNoMessage: false});
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

function *getEquipTipo(action) {
  yield put({ type: 'PREPARE_RESERVE_SET_BARCODE_LOADING', index: action.index, isLoading: true });
  try {
    const response = yield call(
      axios.post,
      action.serverUrl + '/api/getEquipTipo',
      {
        patrimonio: action.barCode
      },
      {withCredentials:true}
    );

    switch(response.data.code) {
      case "SUCCESS":
        yield put({ type: 'PREPARE_RESERVE_SET_BARCODE_TIPO',
          index: action.index,
          equipTipo: response.data.equipTipo,
        });
        break;

      case "ER_NOT_FOUND":
        yield put({ type: 'PREPARE_RESERVE_SET_BARCODE_ERROR_CODE',
          index: action.index,
          errorCode: "ER_NOT_FOUND"
        });
        break;

      case "ER_NOT_AVAILABLE":
        yield put({ type: 'PREPARE_RESERVE_SET_BARCODE_ERROR_CODE',
          index: action.index,
          errorCode: "ER_NOT_AVAILABLE"
        });
        yield put({ type: 'PREPARE_RESERVE_SET_BARCODE_TIPO',
          index: action.index,
          equipTipo: response.data.equipTipo,
        });
        break;

      default:
        yield put({
          type: 'PREPARE_RESERVE_SET_BARCODE_ERROR_CODE',
          errorCode: response.data.code
        });
        break;
    }
  }
  catch (e) {
    yield put({
      type: 'PREPARE_RESERVE_SET_BARCODE_ERROR_CODE',
      message: "Erro ao verificar equipamento."
    });
  }
  yield put({ type: 'PREPARE_RESERVE_SET_BARCODE_LOADING', index: action.index, isLoading: false });
}

function *getReserveDetails(action) {
  yield put({ type: 'SET_LOADING', isLoading: true });
  try {
    const response = yield call(
      axios.post,
      action.serverUrl + '/api/getReserveDetails',
      {
        reserveId: action.reserveId
      },
      {withCredentials:true}
    );

    switch(response.data.code) {
      case "SUCCESS":
        yield put({
          type: 'PREPARE_RESERVE_SET_RESERVE_EQUIPS',
          reserveEquips: response.data.reserveEquips,
          requisicao: action.reserveId
        });
        break;

      default:
        yield put({
          type: 'SET_SUBMISSION_MESSAGE', message: "Ocorreu um erro inesperado. Código: " + response.data.code
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

function *registerReservedEquips(action) {
  yield put({ type: 'SET_LOADING', isLoading: true });
  try {
    const response = yield call(
      axios.post,
      action.serverUrl + '/api/registerReservedEquips',
      {
        requisicao: action.requisicao,
        patrimonios: action.patrimonios,
        usuario: action.usuario,
        observacao: null
      },
      {withCredentials:true}
    );
    switch(response.data.code) {
      case "SUCCESS":
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: true });
        yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Equipamentos separados com suscesso." });
        yield put({ type: 'SET_IS_YES_NO_MESSAGE', isYesNoMessage: false });
        break;

      case "ER_NOT_FOUND":
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
        yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Requisição não encontrada" });
        yield put({ type: 'SET_IS_YES_NO_MESSAGE', isYesNoMessage: false });
        break;

      default:
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
        yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Ocorreu um erro deconhecido, código: " + response.data.code });
        yield put({ type: 'SET_IS_YES_NO_MESSAGE', isYesNoMessage: false });
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
    yield takeEvery('GET_RESERVE_DETAILS', getReserveDetails);
    yield takeEvery('GET_EQUIP_TIPO', getEquipTipo);
    yield takeEvery('REGISTER_RESERVED_EQUIPS', registerReservedEquips);
}

export default prepareReserveSagas;
