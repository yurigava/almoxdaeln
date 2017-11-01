import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import axios from 'axios'

function *getUser(action) {
  yield put({ type: 'SET_LOADING', isLoading: true });
  try {
    const response = yield call(
      axios.post,
      action.serverUrl + '/api/getUser',
      {
        usuario: action.usuario,
      },
      {withCredentials:true}
    );
    if(response.data.code === "SUCCESS") {
      //yield put({ type: 'RESERVE_SET_LAST_REQ', equipamentos: response.data.equipamentos , requisicoes: response.data.requisicoes });
      yield put({ type: 'MANAGER_USER_SET_ALL_USER', users: response.data.users });
    }
    else {
      //yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
      yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Erro nos usuários"});
      yield put({ type: 'MANAGER_USER_SET_ALL_USER', users: response.data.users });
    }
    //if(response.data.code === "SUCCESS") {
      
      //yield put({ type: 'SET_LOADING', isLoading: false });
    //}
  }
  catch (e) {
    //yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
    yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Falha ao comunicar com o servidor"});
  }
  yield put({ type: 'SET_LOADING', isLoading: false });
}

function *insertUserRole(action) {
  yield put({ type: 'SET_LOADING', isLoading: true });
  try {
    const response = yield call(
      axios.post,
      action.serverUrl + '/api/managerUserInsert',
      {
        userRoles: action.userRoles,
      },
      {withCredentials:true}
    );

    if(response.data.code === "SUCCESS") {
      yield put({ type: 'SET_DATA_SUBMITTED', submitted: true });
      yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Usuários e Permissões Atualizadas com Sucesso!"});
      //yield put({ type: 'MANAGER_USER_SET_ALL_USER', userRoles: response.data.userRoles });
    }
    else {
      yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
      yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Erro nos usuários"});
      //yield put({ type: 'MANAGER_USER_SET_ALL_USER', userRoles: response.data.userRoles });
    }
    //if(response.data.code === "SUCCESS") {
      
      //yield put({ type: 'SET_LOADING', isLoading: false });
    //}
  }
  catch (e) {
    yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
    yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Falha ao comunicar com o servidor"});
  }
  yield put({ type: 'SET_LOADING', isLoading: false });
}

function *managerUserSagas() {
    yield takeEvery('MANAGER_USER_GET_USERS', getUser);
    yield takeEvery('MANAGER_USER_INSERT', insertUserRole);
}

export default managerUserSagas;
