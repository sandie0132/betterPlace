import * as actionTypes from './actionTypes';
import { updateObject } from '../../OrgMgmtStore/utility';

const initialState = {
    getDataState: 'INIT',
    postDataState: 'INIT',
    putDataState: 'INIT',
    deleteDataState: 'INIT',
    dataList: [],
    error: null,
    currentDataId: null
}

const initState = () => {
    return initialState;
}

//GET DATA REDUCERS
const getDataListLoading = (state) => {
    return updateObject(state, {
        getDataState: 'LOADING'
    });
}

const getDataListSuccess = (state, action) => {
    return updateObject(state, {
        getDataState: 'SUCCESS',
        dataList: action.dataList,
        error: null,
        currentDataId: action.currentDataId
    });
};

const getDataListError = (state, action) => {
    return updateObject(state, {
        getDataState: 'ERROR',
        error: action.error,
    });
};

//POST DATA REDUCERS
const postDataLoading = (state) => {
    return updateObject(state, {
        postDataState: 'LOADING'
    });
}

const postDataSuccess = (state, action) => {
    return updateObject(state, {
        postDataState: 'SUCCESS',
        dataList: action.dataList,
        error: null,
        currentDataId: action.currentDataId
    });
};

const postDataError = (state, action) => {
    return updateObject(state, {
        postDataState: 'ERROR',
        error: action.error,
    });
};

//PUT DATA REDUCERS
const putDataLoading = (state) => {
    return updateObject(state, {
        putDataState: 'LOADING'
    });
}

const putDataSuccess = (state, action) => {
    return updateObject(state, {
        putDataState: 'SUCCESS',
        dataList: action.dataList,
        error: null,
        currentDataId: action.currentDataId
    });
};

const putDataError = (state, action) => {
    return updateObject(state, {
        putDataState: 'ERROR',
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
        dataList: action.dataList,
        error: null,
        currentDataId: action.currentDataId
    });
};

const deleteDataError = (state, action) => {
    return updateObject(state, {
        deleteDataState: 'ERROR',
        error: action.error,
        currentDataId: action.currentDataId
    });
};

const resetError = (state, action) => {
    return updateObject(state, {
        error: null
    })
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_STATE: return initState();
        case actionTypes.RESET_ERROR: return resetError(state, action);

        case actionTypes.GET_DATA_LIST_LOADING: return getDataListLoading(state, action);
        case actionTypes.GET_DATA_LIST_SUCCESS: return getDataListSuccess(state, action);
        case actionTypes.GET_DATA_LIST_ERROR: return getDataListError(state, action);

        case actionTypes.POST_DATA_LOADING: return postDataLoading(state, action);
        case actionTypes.POST_DATA_SUCCESS: return postDataSuccess(state, action);
        case actionTypes.POST_DATA_ERROR: return postDataError(state, action);

        case actionTypes.PUT_DATA_LOADING: return putDataLoading(state, action);
        case actionTypes.PUT_DATA_SUCCESS: return putDataSuccess(state, action);
        case actionTypes.PUT_DATA_ERROR: return putDataError(state, action);

        case actionTypes.DELETE_DATA_LOADING: return deleteDataLoading(state, action);
        case actionTypes.DELETE_DATA_SUCCESS: return deleteDataSuccess(state, action);
        case actionTypes.DELETE_DATA_ERROR: return deleteDataError(state, action);

        default: return state;
    }
};

export default reducer;