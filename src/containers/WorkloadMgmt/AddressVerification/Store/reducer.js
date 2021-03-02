import { combineReducers } from 'redux';
import * as actionTypes from './actionTypes';
import { updateObject } from './utility';
import * as initData from '../../Store/StaticDataInitData';
import taskListReducer from '../TaskList/Store/reducer';
import physicalAddressReducer from '../PhysicalAddress/Store/reducer';
import postalAddressReducer from '../PostalAddress/Store/reducer';
import uploadMultipleReducer from '../PhysicalAddress/AgenyTaskClosure/UploadPictureMultiple/Store/reducer';

const initialState = {
    searchResults: [],
    searchResultsState: 'INIT',

    getTasksCount: 0,
    getTasksCountState: 'INIT',

    getAgencyTasks: [],
    getAgencyTasksState: 'INIT',

    getStaticDataState: 'INIT',
    staticData: { ...initData.data },

    getDistrictStaticDataState: 'INIT',
    getDistrictStaticData: null,
    getCityStaticDataState: 'INIT',
    getCityStaticData: null,
    getPincodeStaticDataState: 'INIT',
    getPincodeStaticData: null,

    clientStaticData: null,
    clientStaticState: 'INIT',

    filterCountState: 'INIT',
    filterCount: null,

    reassignDataState: 'INIT',
    reassignData: null,
    agencyName: '',

    agencyList: [],
    getAgencyListState: 'INIT',
    error: null
}
//init state
const initState = (state) => {
    return initialState;
}
//reset error
const resetError = (state) => {
    return updateObject(state, {
        error: null
    })
}

//search results
const searchResultsLoading = (state, action) => {
    return updateObject(state, {
        searchResultsState: 'LOADING'
    });
};

const searchResultsSuccess = (state, action) => {
    return updateObject(state, {
        searchResultsState: 'SUCCESS',
        searchResults: action.searchResults,
        error: null
    });
};

const searchResultsError = (state, action) => {
    return updateObject(state, {
        searchResultsState: 'ERROR',
        error: action.error
    });
};
//task list count
const getTasksCountLoading = (state, action) => {
    return updateObject(state, {
        getTasksCountState: 'LOADING'
    });
};

const getTasksCountSuccess = (state, action) => {
    return updateObject(state, {
        getTasksCountState: 'SUCCESS',
        getTasksCount: action.tasksCount,
        error: null
    });
};

const getTasksCountError = (state, action) => {
    return updateObject(state, {
        getTasksCountState: 'ERROR',
        error: action.error
    });
};
//tasks list data
const getAgencyTasksLoading = (state, action) => {
    return updateObject(state, {
        getAgencyTasksState: 'LOADING'
    });
};

const getAgencyTasksSuccess = (state, action) => {
    return updateObject(state, {
        getAgencyTasksState: 'SUCCESS',
        getAgencyTasks: action.agencyTasksList,
        // getTasksCount: action.tasksCount,
        error: null
    });
};

const getAgencyTasksError = (state, action) => {
    return updateObject(state, {
        getAgencyTasksState: 'ERROR',
        error: action.error
    });
};
//static data
const getStaticDataLoading = (state, action) => {
    return updateObject(state, {
        getStaticDataState: 'LOADING'
    });
};

const getStaticDataSuccess = (state, action) => {
    return updateObject(state, {
        getStaticDataState: 'SUCCESS',
        staticData: action.staticData,
        error: null
    });
};

const getStaticDataError = (state, action) => {
    return updateObject(state, {
        getStaticDataState: 'ERROR',
        error: action.error
    });
};
//district static data
const getDistrictStaticDataLoading = (state, action) => {
    return updateObject(state, {
        getDistrictStaticDataState: 'LOADING'
    });
};

const getDistrictStaticDataSuccess = (state, action) => {
    return updateObject(state, {
        getDistrictStaticDataState: 'SUCCESS',
        getDistrictStaticData: action.districtData,
        error: null
    });
};

const getDistrictStaticDataError = (state, action) => {
    return updateObject(state, {
        getDistrictStaticDataState: 'ERROR',
        error: action.error
    });
};
//city static data
const getCityStaticDataLoading = (state, action) => {
    return updateObject(state, {
        getCityStaticDataState: 'LOADING'
    });
};

const getCityStaticDataSuccess = (state, action) => {
    return updateObject(state, {
        getCityStaticDataState: 'SUCCESS',
        getCityStaticData: action.cityStaticData,
        error: null
    });
};

const getCityStaticDataError = (state, action) => {
    return updateObject(state, {
        getCityStaticDataState: 'ERROR',
        error: action.error
    });
};
//pincodes static data
const getPincodeStaticDataLoading = (state, action) => {
    return updateObject(state, {
        getPincodeStaticDataState: 'LOADING'
    });
};

const getPincodeStaticDataSuccess = (state, action) => {
    return updateObject(state, {
        getPincodeStaticDataState: 'SUCCESS',
        getPincodeStaticData: action.pincodeStaticData,
        error: null
    });
};

const getPincodeStaticDataError = (state, action) => {
    return updateObject(state, {
        getPincodeStaticDataState: 'ERROR',
        error: action.error
    });
};
//agency list for postal and physical
const getAgencyListLoading = (state, action) => {
    return updateObject(state, {
        getAgencyListState: 'LOADING'
    });
};

const getAgencyListSuccess = (state, action) => {
    let agencyUpdatedList = [{ label: "unassigned", value: "UNASSIGNED" }];
    agencyUpdatedList = agencyUpdatedList.concat(action.agencyList);
    return updateObject(state, {
        getAgencyListState: 'SUCCESS',
        agencyList: agencyUpdatedList,
        error: null
    });
};

const getAgencyListError = (state, action) => {
    return updateObject(state, {
        getAgencyListState: 'ERROR',
        error: action.error
    });
};
//client static data
const clientStaticLoading = (state) => {
    return updateObject(state, {
        clientStaticState: 'LOADING'
    });
}

const clientStaticSuccess = (state, action) => {
    return updateObject(state, {
        clientStaticState: 'SUCCESS',
        clientStaticData: action.clientStaticData,
        error: null
    });
};

const clientStaticError = (state, action) => {
    return updateObject(state, {
        clientStaticState: 'ERROR',
        error: action.error
    });
};
//task filter count
const getFilterCountLoading = (state) => {
    return updateObject(state, {
        filterCountState: 'LOADING'
    });
}

const getFilterCountSuccess = (state, action) => {
    return updateObject(state, {
        filterCountState: 'SUCCESS',
        filterCount: action.filterCount,
        error: null
    });
};

const getFilterCountError = (state, action) => {
    return updateObject(state, {
        filterCountState: 'ERROR',
        error: action.error
    });
};

//reassign flow
const postReassignLoading = (state) => {
    return updateObject(state, {
        reassignDataState: 'LOADING'
    });
}

const postReassignSuccess = (state, action) => {
    return updateObject(state, {
        reassignDataState: 'SUCCESS',
        reassignData: action.reassignData,
        error: null
    });
};

const postReassignError = (state, action) => {
    return updateObject(state, {
        reassignDataState: 'ERROR',
        error: action.error
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case actionTypes.INIT_STATE: return initState();

        case actionTypes.RESET_ERROR: return resetError(state, action);

        case actionTypes.SEARCH_AGENCY_CANDIDATE_LOADING: return searchResultsLoading(state, action);
        case actionTypes.SEARCH_AGENCY_CANDIDATE_SUCCESS: return searchResultsSuccess(state, action);
        case actionTypes.SEARCH_AGENCY_CANDIDATE_ERROR: return searchResultsError(state, action);

        case actionTypes.GET_TASKS_COUNT_LOADING: return getTasksCountLoading(state, action);
        case actionTypes.GET_TASKS_COUNT_SUCCESS: return getTasksCountSuccess(state, action);
        case actionTypes.GET_TASKS_COUNT_ERROR: return getTasksCountError(state, action);

        case actionTypes.GET_AGENCY_TASKS_LOADING: return getAgencyTasksLoading(state, action);
        case actionTypes.GET_AGENCY_TASKS_SUCCESS: return getAgencyTasksSuccess(state, action);
        case actionTypes.GET_AGENCY_TASKS_ERROR: return getAgencyTasksError(state, action);

        case actionTypes.GET_STATIC_DATA_LOADING: return getStaticDataLoading(state, action);
        case actionTypes.GET_STATIC_DATA_SUCCESS: return getStaticDataSuccess(state, action);
        case actionTypes.GET_STATIC_DATA_ERROR: return getStaticDataError(state, action);

        case actionTypes.GET_DISTRICT_STATIC_DATA_LOADING: return getDistrictStaticDataLoading(state, action);
        case actionTypes.GET_DISTRICT_STATIC_DATA_SUCCESS: return getDistrictStaticDataSuccess(state, action);
        case actionTypes.GET_DISTRICT_STATIC_DATA_ERROR: return getDistrictStaticDataError(state, action);

        case actionTypes.GET_CITY_STATIC_DATA_LOADING: return getCityStaticDataLoading(state, action);
        case actionTypes.GET_CITY_STATIC_DATA_SUCCESS: return getCityStaticDataSuccess(state, action);
        case actionTypes.GET_CITY_STATIC_DATA_ERROR: return getCityStaticDataError(state, action);

        case actionTypes.GET_PINCODE_STATIC_DATA_LOADING: return getPincodeStaticDataLoading(state, action);
        case actionTypes.GET_PINCODE_STATIC_DATA_SUCCESS: return getPincodeStaticDataSuccess(state, action);
        case actionTypes.GET_PINCODE_STATIC_DATA_ERROR: return getPincodeStaticDataError(state, action);

        case actionTypes.GET_AGENCY_LIST_LOADING: return getAgencyListLoading(state, action);
        case actionTypes.GET_AGENCY_LIST_SUCCESS: return getAgencyListSuccess(state, action);
        case actionTypes.GET_AGENCY_LIST_ERROR: return getAgencyListError(state, action);

        case actionTypes.GET_CLIENT_STATIC_DATA_LOADING: return clientStaticLoading(state, action);
        case actionTypes.GET_CLIENT_STATIC_DATA_SUCCESS: return clientStaticSuccess(state, action);
        case actionTypes.GET_CLIENT_STATIC_DATA_ERROR: return clientStaticError(state, action);

        case actionTypes.GET_FILTER_COUNT_LOADING: return getFilterCountLoading(state, action);
        case actionTypes.GET_FILTER_COUNT_SUCCESS: return getFilterCountSuccess(state, action);
        case actionTypes.GET_FILTER_COUNT_ERROR: return getFilterCountError(state, action);

        case actionTypes.POST_REASSIGN_LOADING: return postReassignLoading(state, action);
        case actionTypes.POST_REASSIGN_SUCCESS: return postReassignSuccess(state, action);
        case actionTypes.POST_REASSIGN_ERROR: return postReassignError(state, action);

        default: return state;
    }
}

const addressVerification = combineReducers({
    taskList: taskListReducer,
    physicalAddress: physicalAddressReducer,
    postalAddress: postalAddressReducer,
    address: reducer,
    multipleUploadReducer: uploadMultipleReducer
});

export default addressVerification;