import * as actionTypes from './actionTypes';
import { updateObject } from '../../../OrgMgmtStore/utility';

const initialState = {
    data: null,
    getSelectedDataState:'INIT',
    postDataState: 'INIT',
    putDataState: 'INIT',
    error: null,
    servicesId : null,
    servicesData: [],
    selectedServiceData:[],
    getDataServiceState:'INIT',
    getAgencyListState : "INIT",
    AgencyList : []
}

const getInitState = (state) => {
    return initialState;
}

const postServiceDataLoading = (state) => {
    return updateObject(state, {
        postDataState: 'LOADING'
    });
}

const postServiceDataSuccess = (state, action) => {
    return updateObject(state, {
        data : action.data,
        postDataState: 'SUCCESS',
        error: null,
        servicesId : action.Id
    });
};

const postServiceDataError = (state, action) => {
    return updateObject(state, {
        postDataState: 'ERROR',
        error: action.error,
    });
};

const putServiceDataLoading = (state) => {
    return updateObject(state, {
        putDataState: 'LOADING'
    });
}

const putServiceDataSuccess = (state, action) => {
    return updateObject(state, {
        putDataState: 'SUCCESS',
        data: action.data,
        error: null
    });
};

const putServiceDataError = (state, action) => {
    return updateObject(state, {
        putDataState: 'ERROR',
        error: action.error,
    });
};

const getSelectedServiceDataLoading = (state) => {
    return updateObject(state, {
        getSelectedDataState: 'LOADING'
    });
}

const getSelectedServiceDataSuccess = (state, action) => {
    return updateObject(state, {
        getSelectedDataState: 'SUCCESS',
        selectedServiceData: action.data,
        error: null,
        servicesId : action.Id
    });
};

const getSelectedServiceDataError = (state, action) => {
    return updateObject(state, {
        getSelectedDataState: 'ERROR',
        error: action.error,
    });
};

const getServicesDataLoading = (state) => {
    return updateObject(state, {
        getDataServiceState: 'LOADING'
    });
}

const getServicesDataSuccess = (state, action) => {
    return updateObject(state, {
        getDataServiceState: 'SUCCESS',
        servicesData: action.servicesData,
        error: null
    });
};

const getServicesDataError = (state, action) => {
    return updateObject(state, {
        getDataServiceState: 'ERROR',
        error: action.error,
    });
};

const getAgencyListLoading = (state) => {
    return updateObject(state, {
        getAgencyListState: 'LOADING'
    });
}

const getAgencyListSuccess = (state, action) => {
    return updateObject(state, {
        getAgencyListState: 'SUCCESS',
        AgencyList: action.agencyList,
        error: null
    });
};

const getAgencyListError = (state, action) => {
    return updateObject(state, {
        getAgencyListState: 'ERROR',
        error: action.error,
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case actionTypes.GET_INIT_STATE : return getInitState(state);
        
        case actionTypes.POST_SERVICE_DATA_LOADING: return postServiceDataLoading(state, action);
        case actionTypes.POST_SERVICE_DATA_SUCCESS: return postServiceDataSuccess(state, action);
        case actionTypes.POST_SERVICE_DATA_ERROR: return postServiceDataError(state, action);

        case actionTypes.PUT_SERVICE_DATA_LOADING: return putServiceDataLoading(state, action);
        case actionTypes.PUT_SERVICE_DATA_SUCCESS: return putServiceDataSuccess(state, action);
        case actionTypes.PUT_SERVICE_DATA_ERROR: return putServiceDataError(state, action);

        case actionTypes.GET_SELECTED_SERVICE_DATA_LOADING: return getSelectedServiceDataLoading(state, action);
        case actionTypes.GET_SELECTED_SERVICE_DATA_SUCCESS: return getSelectedServiceDataSuccess(state, action);
        case actionTypes.GET_SELECTED_SERVICE_DATA_ERROR: return getSelectedServiceDataError(state, action);

        case actionTypes.GET_ALL_SERVICES_DATA_LOADING: return getServicesDataLoading(state, action);
        case actionTypes.GET_ALL_SERVICES_DATA_SUCCESS: return getServicesDataSuccess(state, action);
        case actionTypes.GET_ALL_SERVICES_DATA_ERROR: return getServicesDataError(state, action);

        case actionTypes.GET_AGENCY_LIST_LOADING: return getAgencyListLoading(state, action);
        case actionTypes.GET_AGENCY_LIST_SUCCESS: return getAgencyListSuccess(state, action);
        case actionTypes.GET_AGENCY_LIST_ERROR: return getAgencyListError(state, action);

        default: return state;
    }
};

export default reducer;