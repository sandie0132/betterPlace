import * as actionTypes from './actionTypes';
import { updateObject } from '../../OrgMgmtStore/utility';

const initialState = {
    getDataState: 'INIT',
    getOrgLogoState: 'INIT',
    postPutDataState: 'INIT',
    orgDeleteSuccess: false,
    data: {},
    logoUrl: null,
    error: null
}

const initState = () => {
    return initialState;
}

const resetError = (state, action) => {
    return updateObject(state, {
        error: null
    });
}

//GET DATA REDUCERS
const getDataLoading = (state) => {
    return updateObject(state, {
        getDataState: 'LOADING'
    });
}

const getDataSuccess = (state, action) => {
    return updateObject(state, {
        getDataState: 'SUCCESS',
        data: action.data,
        error: null
    });
};

const getDataError = (state, action) => {
    return updateObject(state, {
        getDataState: 'ERROR',
        error: action.error,
    });
};

//POST DATA REDUCERS
const postDataLoading = (state) => {
    return updateObject(state, {
        postPutDataState: 'LOADING'
    });
}

const postDataSuccess = (state, action) => {
    return updateObject(state, {
        postPutDataState: 'SUCCESS',
        data: action.data,
        error: null
    });
};

const postDataError = (state, action) => {
    return updateObject(state, {
        postPutDataState: 'ERROR',
        error: action.error,
    });
};

const putDataLoading = (state) => {
    return updateObject(state, {
        postPutDataState: 'LOADING'
    });
}

const putDataSuccess = (state, action) => {
    return updateObject(state, {
        postPutDataState: 'SUCCESS',
        data: action.data,
        error: null
    });
};

const putDataError = (state, action) => {
    return updateObject(state, {
        postPutDataState: 'ERROR',
        error: action.error,
    });
};

//DELETE DATA REDUCERS
const deleteDataLoading = (state) => {
    return updateObject(state, {
        deleteDataState: 'LOADING'
    });
}

const deleteDataSuccess = (state, action) => {
    return updateObject(state, {
        deleteDataState: 'SUCCESS',
        error: null,
        orgDeleteSuccess: true
    });
};

const deleteDataError = (state, action) => {
    return updateObject(state, {
        deleteDataState: 'ERROR',
        error: action.error,
    });
};

const getOrgLogoSucess = ( state, action ) => {
    return updateObject( state, {
        logoUrl: action.logoUrl,
        error: null,
        getOrgLogoState:'SUCCESS'
    });
};

const getOrgLogoError = ( state, action ) => {
    return updateObject( state, {
        error : action.error,
        getOrgLogoState:'ERROR'
    });
};

const getOrgLogoLoading = ( state, action ) => {
    return updateObject( state, {
        getOrgLogoState:'LOADING'
    });
};


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_STATE: return initState();
        case actionTypes.RESET_ERROR : return resetError(state, action);

        case actionTypes.GET_DATA_LOADING: return getDataLoading(state, action);
        case actionTypes.GET_DATA_SUCCESS: return getDataSuccess(state, action);
        case actionTypes.GET_DATA_ERROR: return getDataError(state, action);

        case actionTypes.POST_DATA_LOADING: return postDataLoading(state, action);
        case actionTypes.POST_DATA_SUCCESS: return postDataSuccess(state, action);
        case actionTypes.POST_DATA_ERROR: return postDataError(state, action);

        case actionTypes.PUT_DATA_LOADING: return putDataLoading(state, action);
        case actionTypes.PUT_DATA_SUCCESS: return putDataSuccess(state, action);
        case actionTypes.PUT_DATA_ERROR: return putDataError(state, action);

        case actionTypes.DELETE_DATA_LOADING: return deleteDataLoading(state, action);
        case actionTypes.DELETE_DATA_SUCCESS: return deleteDataSuccess(state, action);
        case actionTypes.DELETE_DATA_ERROR: return deleteDataError(state, action);

        case actionTypes.GET_ORGLOGO_LOADING:return getOrgLogoLoading(state,action);
        case actionTypes.GET_ORGLOGO_SUCCESS:return getOrgLogoSucess(state,action);
        case actionTypes.GET_ORGLOGO_ERROR:return getOrgLogoError(state,action);

        default: return state;
    }
};

export default reducer;
