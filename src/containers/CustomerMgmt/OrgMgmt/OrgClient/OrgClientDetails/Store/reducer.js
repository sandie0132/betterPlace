import * as actionTypes from './actionTypes';
import {updateObject} from '.././../../OrgMgmtStore/utility';

const initialState = {
    getClientState: 'INIT',
    clientData: ''
};

const initState = () => {
    return initState;
}

const getDataListLoading = (state, action) => {
    return updateObject(state, {
        getClientState: 'LOADING',
        error: null
    });
};

const getDataListSuccess = (state, action) => {
    return updateObject(state, {
        clientData: action.clientData,
        error: null,
        getClientState: 'SUCCESS'
    });
};

const getDataListError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        getClientState: 'ERROR'
    });
};

const getOrgNameLoading = (state, action) => {
    return updateObject(state, {
        getOrgNameState: 'LOADING',
        error: null
    })
}

const getOrgNameSuccess = (state, action) => {
    return updateObject(state, {
        getOrgNameState: 'SUCCESS',
        getOrgName: action.orgName,
        error: null
    })
}

const getOrgNameError = (state, action) => {
    return updateObject(state, {
        getOrgNameState: 'ERROR',
        error: action.error
    })
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_STATE: return initState(state, action);

        case actionTypes.GET_CLIENT_DATA_LOADING: return getDataListLoading(state, action);
        case actionTypes.GET_CLIENT_DATA_SUCCESS: return getDataListSuccess(state, action);
        case actionTypes.GET_CLIENT_DATA_ERROR: return getDataListError(state, action);

        case actionTypes.GET_ORG_NAME_LOADING: return getOrgNameLoading(state);
        case actionTypes.GET_ORG_NAME_SUCCESS: return getOrgNameSuccess(state, action);
        case actionTypes.GET_ORG_NAME_ERROR: return getOrgNameError(state, action);

        default: return state;
    }
};

export default reducer;