import * as actionTypes from './actionTypes';
import { updateObject } from '../../OrgMgmtStore/utility';

const initialState = {
    getDataListState: 'INIT',
    orgDeleteSuccess: false,
    starredCount: 0,
    paginatorCount: 0,
    paginationCount: {
        all: 0,
        active: 0,
        deactive: 0
    },
    orgListPaginationCountState: 'INIT',
    orgListPaginationDataState: 'INIT',
    starredOrgIds: [],
    paginationData: [],
    pageNumber: 1,
    getStarredOrgListState: 'INIT',
    postStarredOrgListState: 'INIT',
    deleteStarredOrgState: 'INIT',
    orgList: [],
    error: null,
    paginatorConfig: {
        page: 1,
        pageLength: 9,
        totalPages: 0,
        from: null,
        to: null,
        prevPageDisabled: false,
        nextPageDisabled: false
    }
};

const initState = () => {
    return initState;
}

const getDataListLoading = (state, action) => {
    return updateObject(state, {
        getDataListState: 'LOADING'
    });
};

const getDataListSuccess = (state, action) => {
    return updateObject(state, {
        orgList: action.orgList,
        orgDeleteSuccess: false,
        error: null,
        getDataListState: 'SUCCESS'
    });
};

const getDataListError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        orgList: [],
        getDataListState: 'ERROR'
    });
};

const setPaginatorCount = (state, action) => {
    return updateObject(state, {
        paginatorCount: action.paginatorCount,
    });
};

const setPageNumber = (state, action) => {
    return updateObject(state, {
        pageNumber: action.pageNumber,
    });
}

const updatePaginator = (state, action) => {
    return updateObject(state, {
        paginatorConfig: action.paginatorConfig,
    });
};

const getOrgListPaginationCountLoading = (state, action) => {
    return updateObject(state, {
        orgListPaginationCountState: 'LOADING'
    });
};

const getOrgListPaginationCountSuccess = (state, action) => {
    return updateObject(state, {
        paginationCount: action.paginationCount,
        orgListPaginationCountState: 'SUCCESS'
    });
};

const getOrgListPaginationCountError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        orgListPaginationCountState: 'ERROR'
    });
};

//Pagination Data
const getOrgListPaginationDataLoading = (state, action) => {
    return updateObject(state, {
        orgListPaginationDataState: 'LOADING'
    });
};

const getOrgListPaginationDataSuccess = (state, action) => {
    return updateObject(state, {
        paginationData: action.paginationData,
        error: null,
        orgListPaginationDataState: 'SUCCESS'
    });
};

const getOrgListPaginationDataError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        orgListPaginationDataState: 'ERROR'
    });
};

const getStarredOrgListLoading = (state, action) => {
    return updateObject(state, {
        getStarredOrgListState: 'LOADING'
    });
};

const getStarredOrgListSuccess = (state, action) => {
    return updateObject(state, {
        error: null,
        getStarredOrgListState: 'SUCCESS',
        starredCount: action.starredCount,
        paginationData: action.paginationData,
        starredOrgIds: action.starredOrgIds
    });
};

const getStarredOrgListError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        getStarredOrgListState: 'ERROR'
    });
};

const postStarredOrgListLoading = (state, action) => {
    return updateObject(state, {
        postStarredOrgListState: 'LOADING'
    });
};

const postStarredOrgListSuccess = (state, action) => {
    return updateObject(state, {
        error: null,
        starredCount: action.starredCount,
        paginationData: action.paginationData,
        starredOrgIds: action.starredOrgIds,
        postStarredOrgListState: 'SUCCESS'
    });
};

const postStarredOrgListError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        postStarredOrgListState: 'ERROR'
    });
};

const deleteStarredOrgLoading = (state, action) => {
    return updateObject(state, {
        deleteStarredOrgState: 'LOADING'
    });
};

const deleteStarredOrgSuccess = (state, action) => {
    return updateObject(state, {
        error: null,
        deleteStarredOrgState: 'SUCCESS',
        starredCount: action.starredCount,
        paginationData: action.paginationData,
        starredOrgIds: action.starredOrgIds,
    });
};

const deleteStarredOrgError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        deleteStarredOrgState: 'ERROR'
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_STATE: return initState(state, action);

        case actionTypes.GET_DATA_LIST_LOADING: return getDataListLoading(state, action);
        case actionTypes.GET_DATA_LIST_SUCCESS: return getDataListSuccess(state, action);
        case actionTypes.GET_DATA_LIST_ERROR: return getDataListError(state, action);

        case actionTypes.SET_PAGINATOR_COUNT: return setPaginatorCount(state, action);
        case actionTypes.SET_PAGE_NUMBER: return setPageNumber(state, action);
        case actionTypes.UPDATE_PAGINATOR: return updatePaginator(state, action);

        case actionTypes.GET_ORG_LIST_PAGINATION_DATA_SUCCESS: return getOrgListPaginationDataSuccess(state, action);
        case actionTypes.GET_ORG_LIST_PAGINATION_DATA_ERROR: return getOrgListPaginationDataError(state, action);
        case actionTypes.GET_ORG_LIST_PAGINATION_DATA_LOADING: return getOrgListPaginationDataLoading(state, action);

        case actionTypes.GET_ORG_LIST_PAGINATION_COUNT_SUCCESS: return getOrgListPaginationCountSuccess(state, action);
        case actionTypes.GET_ORG_LIST_PAGINATION_COUNT_ERROR: return getOrgListPaginationCountError(state, action);
        case actionTypes.GET_ORG_LIST_PAGINATION_COUNT_LOADING: return getOrgListPaginationCountLoading(state, action);

        case actionTypes.GET_STARRED_ORG_LIST_LOADING: return getStarredOrgListLoading(state, action);
        case actionTypes.GET_STARRED_ORG_LIST_SUCCESS: return getStarredOrgListSuccess(state, action);
        case actionTypes.GET_STARRED_ORG_LIST_ERROR: return getStarredOrgListError(state, action);

        case actionTypes.POST_STARRED_ORG_LOADING: return postStarredOrgListLoading(state, action);
        case actionTypes.POST_STARRED_ORG_SUCCESS: return postStarredOrgListSuccess(state, action);
        case actionTypes.POST_STARRED_ORG_ERROR: return postStarredOrgListError(state, action);

        case actionTypes.DELETE_STARRED_ORG_LOADING: return deleteStarredOrgLoading(state, action);
        case actionTypes.DELETE_STARRED_ORG_SUCCESS: return deleteStarredOrgSuccess(state, action);
        case actionTypes.DELETE_STARRED_ORG_ERROR: return deleteStarredOrgError(state, action);

        default: return state;
    }
};

export default reducer;