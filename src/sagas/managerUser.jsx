import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import axios from 'axios'

function *getUsers(action) {
  yield put({ type: 'SET_LOADING', isLoading: true });
  try {
    const response = yield call(
      axios.post,
      action.serverUrl + '/api/getUsers',
      {withCredentials:true}
    );
    if(response.data.code === "SUCCESS") {
      yield put({ type: 'MANAGER_USER_SET_ALL_USER', users: response.data.users });
    }
    else {
      yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
      yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Erro na lista de usuários"});
      yield put({ type: 'MANAGER_USER_SET_ALL_USER', users: response.data.users});
    }
  }
  catch (e) {
    yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
    yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Falha ao comunicar com o servidor"});
  }
  yield put({ type: 'SET_LOADING', isLoading: false });
}

function *managerUserSagas() {
    yield takeEvery('MANAGER_USER_GET_USER', getUsers);
}

export default managerUserSagas;
