import * as actionTypes from './actionTypes';
import { updateObject } from '../../../OrgMgmtStore/utility';

const initialState = {
    getEmpStatusListState: "INIT",
    getAllEmpListState: "INIT",
    empListAll: [],
    empStatusList: [],
    allError: null,
    error: null,
    empListPageCount: null,
    empListPageCountState: 'INIT',
    getTagInfoState: 'INIT',
    tagList: []
}


const getInitState = () => {
    return initialState;
}

const getempStatusListLoading = (state, action) => {

    return updateObject(state, {
        getEmpStatusListState: 'LOADING'
    })
}

const getempStatusListSuccess = (state, action) => {
    return updateObject(state, {
        getEmpStatusListState: 'SUCCESS',
        empStatusList: action.empList,
        error: null
    });
};

const getempStatusListError = (state, action) => {
    return updateObject(state, {
        getEmpStatusListState: 'ERROR',
        error: action.error,
    });
};

const getempStatusListPageCountLoading = (state, action) => {

    return updateObject(state, {
        empListPageCountState: 'LOADING'
    })
}

const getempStatusListPageCountSuccess = (state, action) => {
    return updateObject(state, {
        empListPageCountState: 'SUCCESS',
        empListPageCount: action.empListPaginationCount,
        error: null
    });
};

const getempStatusListPageCountError = (state, action) => {
    return updateObject(state, {
        empListPageCountState: 'ERROR',
        error: action.error,
    });
};

const getTagInfoDataLoading = (state) => {
    return updateObject(state, {
        getTagInfoState: 'LOADING'
    });
}

const getTagInfoDataSuccess = (state, action) => {
    return updateObject(state, {
        getTagInfoState: 'SUCCESS',
        tagList: action.tagList,
        error: null
    });
};

const getTagInfoDataError = (state, action) => {
    return updateObject(state, {
        getTagInfoState: 'ERROR',
        error: action.error,
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case actionTypes.GET_EMP_STATUS_LIST_LOADING: return getempStatusListLoading(state, action);
        case actionTypes.GET_EMP_STATUS_LIST_SUCCESS: return getempStatusListSuccess(state, action);
        case actionTypes.GET_EMP_STATUS_LIST_ERROR: return getempStatusListError(state, action);

        case actionTypes.GET_EMP_STATUS_LIST_PAGE_COUNT_LOADING: return getempStatusListPageCountLoading(state, action);
        case actionTypes.GET_EMP_STATUS_LIST_PAGE_COUNT_SUCCESS: return getempStatusListPageCountSuccess(state, action);
        case actionTypes.GET_EMP_STATUS_LIST_PAGE_COUNT_ERROR: return getempStatusListPageCountError(state, action);

        case actionTypes.GET_TAG_INFO_LOADING: return getTagInfoDataLoading(state, action);
        case actionTypes.GET_TAG_INFO_SUCCESS: return getTagInfoDataSuccess(state, action);
        case actionTypes.GET_TAG_INFO_ERROR: return getTagInfoDataError(state, action);

        case actionTypes.GET_INIT_STATE: return getInitState();

        default: return state;
    }
}

export default reducer;