import * as actionTypes from './actionTypes';
import { updateObject } from '../../../../EmpMgmtStore/utility';

const initialState = {
    getClientListState: 'INIT',
    postDeployEmpState:'INIT',
    clientList: [],
    client: ''
}

const initState = () => {
    return initState;
}

const getClientListLoading = (state, action) => {
    return updateObject(state, {
        getClientListState: 'LOADING'
    });
};

const getClientListSuccess = (state, action) => {
    return updateObject(state, {
        getClientListState: 'SUCCESS',
        clientList: action.clientList,
        error: null,
    });
};

const getClientListError = (state, action) => {
    return updateObject(state, {
        getClientListState: 'ERROR',
        error: action.error,
        clientList: []
    });
};

//post deploy emp to tag
const postDeployEmpLoading = (state, action) => {
    return updateObject(state, {
        postDeployEmpState: 'LOADING'
    });
};

const postDeployEmpSuccess= (state, action) => {
    return updateObject(state, {
        postDeployEmpState: 'SUCCESS',
        clientData: action.clientData,
        error: null,
    });
};

const postDeployEmpError = (state, action) => {
    return updateObject(state, {
        postDeployEmpState: 'ERROR',
        error: action.error,
    });
};


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_STATE: return initState(state, action);

        case actionTypes.GET_CLIENT_LIST_LOADING: return getClientListLoading(state, action);
        case actionTypes.GET_CLIENT_LIST_SUCCESS: return getClientListSuccess(state, action);
        case actionTypes.GET_CLIENT_LIST_ERROR: return getClientListError(state, action);

        case actionTypes.POST_DEPLOY_EMP_LOADING: return postDeployEmpLoading(state, action);
        case actionTypes.POST_DEPLOY_EMP_SUCCESS: return postDeployEmpSuccess(state, action);
        case actionTypes.POST_DEPLOY_EMP_ERROR: return postDeployEmpError(state, action);

        default: return state;
    }
};

export default reducer;
