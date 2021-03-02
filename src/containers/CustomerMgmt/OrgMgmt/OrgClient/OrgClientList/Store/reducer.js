import * as actionTypes from './actionTypes';
import {updateObject} from '.././../../OrgMgmtStore/utility';

const initialState = {
    getClientListState: 'INIT',
    clientList: []
};

const initState = () => {
    return initState;
}

const getDataListLoading = (state, action) => {
    return updateObject(state, {
        getClientListState: 'LOADING',
        error: null
    });
};

const getDataListSuccess = (state, action) => {
    return updateObject(state, {
        clientList: action.clientList,
        error: null,
        getClientListState: 'SUCCESS'
    });
};

const getDataListError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        clientList: [],
        getClientListState: 'ERROR'
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_STATE: return initState(state, action);

        case actionTypes.GET_CLIENT_LIST_LOADING: return getDataListLoading(state, action);
        case actionTypes.GET_CLIENT_LIST_SUCCESS: return getDataListSuccess(state, action);
        case actionTypes.GET_CLIENT_LIST_ERROR: return getDataListError(state, action);

        default: return state;
    }
};

export default reducer;