import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import axios from 'axios'

function *getTipos(action) {
  yield put({ type: 'SET_LOADING', isLoading: true });
  try {
    const response = yield call(
      axios.get,
      action.serverUrl + '/api/getTipos',
      {withCredentials:true}
    );
    yield put({ type: 'SET_TIPOS', tipos: response.data });
  }
  catch (e) { }
  yield put({ type: 'SET_LOADING', isLoading: false });
}

function *getFamilias(action) {
  yield put({ type: 'SET_LOADING', isLoading: true });
  try {
    const response = yield call(
      axios.get,
      action.serverUrl + '/api/getFamilias',
      {withCredentials:true}
    );
    yield put({ type: 'SET_FAMILIAS', familias: response.data });
  }
  catch (e) { }
  yield put({ type: 'SET_LOADING', isLoading: false });
}

function *insertEquips(action) {
  if(action.id_tipo === null) {
    yield put({
      type: 'SET_MISSING_FIELDS_ERROR',
      isMissingTipo: action.id_tipo === null,
      isMissingFamilia: true,
    });
    return;
  }
  if(action.patrimonios.length == 0 || (action.patrimonios.length === 1 && action.patrimonios[0].value === "")) {
    yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
    yield put({
      type: 'SET_SUBMISSION_MESSAGE',
      message: "Insira pelo menos um Equipamento."
    });
    return;
  }
  let patrimonios = Array.from(new Set(action.patrimonios));
  yield put({ type: 'SET_LOADING', isLoading: true });
  let response = null
  try {
    response = yield call(
      axios.post,
      action.serverUrl + '/api/insertEquips',
      {
        patrimonios: patrimonios,
        id_tipo:     action.id_tipo,
      },
      {withCredentials:true}
    );

    let singular;
    let plural;
    switch(response.data.code) {
      case "SUCCESS":
        singular = "O equipamento foi registrado com sucesso.";
        plural = "Os equipamentos foram registrados com sucesso.";
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: true });
        yield put({ type: 'SET_SUBMISSION_MESSAGE', message: patrimonios.length > 1 ? plural : singular});
        break;

      case "ER_DUP_ENTRY":
        singular = "Um equipamento já está registrado.";
        plural = "Alguns dos equipamentos já estão registrados.";
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
        yield put({ type: 'SET_SUBMISSION_MESSAGE', message: response.data.notFound.length > 1 ? plural : singular});
        yield put({
          type: 'SET_INSERT_EQUIP_ERROR_DESCRIPTION',
          equipNumbers: response.data.notFound.map(nf => nf.toString()),
          errorCode: response.data.code
        });
        break;

      case "ER_WARN_DATA_OUT_OF_RANGE":
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
        yield put({
          type: 'SET_SUBMISSION_MESSAGE',
          message: "O código de patrimônio de algum dos equipamentos excedeu o limite de tamanho."
        });
        yield put({
          type: 'SET_INSERT_EQUIP_ERROR_DESCRIPTION',
          equipNumbers: Array.from(response.data.instance.patrimonio),
          errorCode: response.data.code
        });
        break;

      default:
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
        yield put({
          type: 'SET_SUBMISSION_MESSAGE', message: "Ocorreu um erro inesperado. Código: " + response.code
        });
        if(response.data.instance.patrimonio)
          yield put({
            type: 'SET_INSERT_EQUIP_ERROR_DESCRIPTION',
            equipNumber: Array.from(response.data.instance.patrimonio),
            errorCode: response.data.code
          });
        break;
    }
  }
  catch (e) {
    yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
    yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Falha ao comunicar com o servidor"});
  }
  yield put({ type: 'SET_LOADING', isLoading: false });
}

function *addEquipSagas() {
    yield takeEvery('GET_TIPOS', getTipos);
    yield takeEvery('GET_FAMILIAS', getFamilias);
    yield takeEvery('INSERT_EQUIPS', insertEquips);
}

export default addEquipSagas;
