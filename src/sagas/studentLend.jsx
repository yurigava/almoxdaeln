import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import axios from 'axios'

function *insertStudentLend(action) {
  yield put({ type: 'SET_LOADING', isLoading: true });
  try {
    const patrioniosUnique = Array.from(new Set(action.patrimonios));
    const response = yield call(
      axios.post,
      action.serverUrl + '/api/studentLend',
      {
        observacao: null,
        usuario: action.usuario,
        patrimonios: patrioniosUnique,
        shouldAddToRequest: action.shouldAddToRequest,
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
    switch(response.data.code) {
      case "SUCCESS":
        let message
        if(response.data.registeredEquips.length > 1)
          message = "Empréstimo efetuado com sucesso.\\nOs seguintes equipamentos foram emprestados:\\n";
        else
          message = "Empréstimo efetuado com sucesso.\\nO seguinte equipamento foi emprestado:\\n";
        response.data.registeredEquips.forEach(equip => {
          message = message + equip.pat + " - " + equip.familia + " " + equip.tipo + "\\n";
        });
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: true });
        yield put({ type: 'SET_SUBMISSION_MESSAGE', message: message});
        yield put({ type: 'SET_IS_YES_NO_MESSAGE', isYesNoMessage: false });
        break;

      case "WAR_ALREADY_LENT":
        if(response.data.alreadyLentEquips.length > 1)
          message = "AVISO: Este usuário ainda não devolveu os seguintes equipamentos:\\n" ;
        else
          message = "AVISO: Este usuário ainda não devolveu o seguinte equipamento:\\n";
        response.data.alreadyLentEquips.forEach(equip => {
          message = message + equip.pat + " - " + equip.familia + " " + equip.tipo + "\\n";
        });
        message = message + "Deseja emprestar mesmo assim?";
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
        yield put({ type: 'SET_SUBMISSION_MESSAGE', message: message});
        yield put({ type: 'SET_IS_YES_NO_MESSAGE', isYesNoMessage: true });
        break;

      case "ER_NOT_FOUND":
        singular = "ERRO: O Equipamento pedido não está registrado.";
        plural = "ERRO: O pedido contém Equipamentos não registrados." ;
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
        yield put({ type: 'SET_SUBMISSION_MESSAGE', message: patrioniosUnique.length > 1 ? plural : singular});
        yield put({
          type: 'SET_STUDENT_LEND_ERROR_DESCRIPTION',
          equipNumbers: response.data.notFound,
          errorCode: response.data.code
        });
        yield put({ type: 'SET_IS_YES_NO_MESSAGE', isYesNoMessage: false });
        break;

      case "ER_NOT_AVAILABLE":
        singular = "ERRO: O Equipamento pedido não está disponível.";
        plural = "ERRO: O pedido contém Equipamentos não disponíveis.";
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
        yield put({ type: 'SET_SUBMISSION_MESSAGE', message: patrioniosUnique.length > 1 ? plural : singular});
        yield put({
          type: 'SET_STUDENT_LEND_ERROR_DESCRIPTION',
          equipNumbers: response.data.notAvailable,
          errorCode: response.data.code
        });
        yield put({ type: 'SET_IS_YES_NO_MESSAGE', isYesNoMessage: false });
        break;

      default:
        yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
        yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Ocorreu um erro deconhecido, código: " + response.data.code });
        yield put({ type: 'SET_IS_YES_NO_MESSAGE', isYesNoMessage: false });
        break;
    }
  }
  catch(e) {
    yield put({ type: 'SET_DATA_SUBMITTED', submitted: false });
    yield put({ type: 'SET_SUBMISSION_MESSAGE', message: "Falha ao comunicar com o servidor"});
    yield put({ type: 'SET_IS_YES_NO_MESSAGE', isYesNoMessage: false });
  }
  yield put({ type: 'SET_LOADING', isLoading: false });
}

function *studentLendSagas() {
    yield takeEvery('INSERT_STUDENT_LEND', insertStudentLend);
}

export default studentLendSagas;
