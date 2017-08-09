import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import axios from 'axios'

function *insertStudentReturn(action) {
  yield put({ type: 'SET_LOADING', isLoading: true });
  try {
    const patrioniosUnique = Array.from(new Set(action.patrimonios));
    const response = yield call(
      axios.post,
      action.serverUrl + '/api/studentReturn',
      {
        observacao: null,
        usuario: action.usuario,
        patrimonios: patrioniosUnique
      },
      {withCredentials:true}
    );
    if(!response) {
      yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
      yield put({
        type: 'SET_SUBMISSION_MESSAGE', message: "Falha ao comunicar com o servidor."
      });
      yield put({ type: 'SET_LOADING', isLoading: false });
      return;
    }

    let singular
    let plural
    let message
    switch(response.data.code) {
      case "SUCCESS":
        message = "Devolução efetuada com sucesso."
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: true });
        yield put({ type: 'SET_SUBMISSION_MESSAGE', message: message});
        break;

      case "WAR_MISSING_EQUIPS":
        if(response.data.missingEquips.length > 1)
          message = "ATENÇÃO: Devolução incompleta!!\\nOs seguintes equipamentos foram emprestados e não devolvidos:\\n";
        else
          message = "ATENÇÃO: Devolução incompleta!!\\nO seguinte equipamento foi emprestado e não devolvido:\\n";
        response.data.missingEquips.forEach(equip => {
          message = message + equip.pat + " - " + equip.familia + " " + equip.tipo + "\\n";
        });
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: true });
        yield put({ type: 'SET_SUBMISSION_MESSAGE', message: message});
        break;

      case "ER_NOT_FOUND":
        singular = "ERRO: Existem Equipamentos que não fazem parte do pedido deste usuário." ;
        plural = "ERRO: Existe um Equipamento que não faz parte do pedido deste usuário.";
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
        yield put({ type: 'SET_SUBMISSION_MESSAGE', message: response.data.notFound > 1 ? plural : singular});
        yield put({
          type: 'SET_STUDENT_RETURN_ERROR_DESCRIPTION',
          equipNumbers: response.data.notFound,
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

function *studentReturnSagas() {
    yield takeEvery('INSERT_STUDENT_RETURN', insertStudentReturn);
}

export default studentReturnSagas;
