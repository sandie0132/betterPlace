import { updateObject } from '../../../OrgMgmtStore/utility';
import * as actionTypes from './actionTypes';

const initialState = {
    getServicesState: 'INIT',
    postBgvStatusState: 'INIT',
    getCustomBgvStatusState:'INIT',
    services: null,
    bgvStatus: null,
    customBgvStatus:null,
    error: null
}


const initState = () => {
    return initialState;
}

const getServicesLoading = (state) => {
    return updateObject(state, {
        getServicesState: 'LOADING'
    });
}

const getServicesSuccess = (state, action) => {
    return updateObject(state, {
        getServicesState: 'SUCCESS',
        services: action.services,
        error: null
    });
};

const getServicesError = (state, action) => {
    return updateObject(state, {
        getServicesState: 'ERROR',
        error: action.error,
    });
};

const postBgvStatusLoading = (state) => {
    return updateObject(state, {
        postBgvStatusState: 'LOADING'
    });
}

const postBgvStatusSuccess = (state, action) => {
    return updateObject(state, {
        postBgvStatusState: 'SUCCESS',
        bgvStatus: action.bgvStatus,
        error: null
    });
};

const postBgvStatusError = (state, action) => {
    return updateObject(state, {
        postBgvStatusState: 'ERROR',
        error: action.error,
    });
};


const getCustomBgvStatusLoading = (state) => {
    return updateObject(state, {
        getCustomBgvStatusState: 'LOADING'
    });
}

const getCustomBgvStatusSuccess = (state, action) => {
    return updateObject(state, {
        getCustomBgvStatusState: 'SUCCESS',
        customBgvStatus: action.customBgvStatus,
        error: null
    });
};

const getCustomBgvStatusError = (state, action) => {
    return updateObject(state, {
        getCustomBgvStatusState: 'ERROR',
        error: action.error,
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case actionTypes.INIT_STATE: return initState();

        case actionTypes.GET_SERVICES_LOADING: return getServicesLoading(state, action);
        case actionTypes.GET_SERVICES_SUCCESS: return getServicesSuccess(state, action);
        case actionTypes.GET_SERVICES_ERROR: return getServicesError(state, action);

        case actionTypes.POST_BGV_STATUS_LOADING: return postBgvStatusLoading(state, action);
        case actionTypes.POST_BGV_STATUS_SUCCESS: return postBgvStatusSuccess(state, action);
        case actionTypes.POST_BGV_STATUS_ERROR: return postBgvStatusError(state, action);

        case actionTypes.GET_CUSTOM_BGV_STATUS_LOADING: return getCustomBgvStatusLoading(state, action);
        case actionTypes.GET_CUSTOM_BGV_STATUS_SUCCESS: return getCustomBgvStatusSuccess(state, action);
        case actionTypes.GET_CUSTOM_BGV_STATUS_ERROR: return getCustomBgvStatusError(state, action);

        default: return state;
    }
}

export default reducer;