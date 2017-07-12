import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import axios from 'axios'

function *insertReserve(action) {
  if(action.id_tipo === null || action.date === null) {
    yield put({
      type: 'SET_MISSING_FIELDS_ERROR_RESERVE',
      isMissingTipo: action.id_tipo === null,
      isMissingFamilia: true,
      //isMissingDate: true,
    });
    return;
  }
  if(action.patrimonios.length == 0 || action.patrimonios[0].value === "") {
    yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
    yield put({
      type: 'SET_SUBMISSION_MESSAGE',
      message: "Insira pelo menos um Equipamento."
    });
    return;
  }
  //let patrimonios = Array.from(new Set(action.patrimonios));
  let patrimonios = action.patrimonios.filter(pat => pat.value !== "").map(pat => pat.value)
  yield put({ type: 'SET_LOADING', isLoading: true });
  let response = null
  try {
    response = yield call(
      axios.post,
      action.serverUrl + '/api/insertReserve',
      {
        patrimonios: patrimonios,
        id_tipo:     action.id_tipo,
        date:        action.date,
      },
      {withCredentials:true}
    );
    if(response.data === "ok") {
      let singular = "O equipamento foi reservado com sucesso.";
      let plural = "Os equipamentos foram reservados com sucesso.";
      yield put({ type: 'SET_DATA_SUBMITTED', submitted: true });
      yield put({ type: 'SET_SUBMISSION_MESSAGE', message: patrimonios.length > 1 ? plural : singular});
    }
    else if(response.data.code === "ER_DUP_ENTRY") {
      let singular = "O equipamento já está reservado.";
      let plural = "Algum dos equipamentos já está reservado.";
      yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
      yield put({ type: 'SET_SUBMISSION_MESSAGE', message: patrimonios.length > 1 ? plural : singular});
      yield put({
        type: 'SET_RESERVE_ERROR_DESCRIPTION',
        equipNumber: response.data.instance.patrimonio,
        errorCode: response.data.code
      });
    }
    else if(response.data.code === "ER_WARN_DATA_OUT_OF_RANGE") {
      yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
      yield put({
        type: 'SET_SUBMISSION_MESSAGE',
        message: "Alguma das reservas dos equipamentos excederam o limite de quantidade."
      });
      yield put({
        type: 'SET_RESERVE_ERROR_DESCRIPTION',
        equipNumber: response.data.instance.patrimonio,
        errorCode: response.data.code
      });
    }
    else {
      yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
      yield put({
        type: 'SET_SUBMISSION_MESSAGE', message: "Ocorreu um erro inesperado. Código: " + response.code
      });
      yield put({
        type: 'SET_RESERVE_ERROR_DESCRIPTION',
        equipNumber: response.data.instance.patrimonio,
        errorCode: response.data.code
      });
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
}

export default addReserveSagas;
