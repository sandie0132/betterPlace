import * as actionTypes from './actionTypes';
import { updateObject } from '../../../OrgMgmtStore/utility';

const initialState = {
    getDataState: 'INIT',
    postDataState: 'INIT',
    putDataState: 'INIT',
    getSelectedDataState : 'INIT',
    selectedServiceData : [],
    data: [],
    error: null,
    servicesId : null,
    getEnabledPlatformServicesState : "INIT",
    postEnabledPlatformServicesState: "INIT",
    putEnabledPlatformServicesState: "INIT",
    EnabledPlatformServices : {},
    enabledID : ''
}

const getInitState = (state) => {
    return initialState;
}

const getServiceDataLoading = (state) => {
    return updateObject(state, {
        getDataState: 'LOADING'
    });
}

const getServiceDataSuccess = (state, action) => {
    return updateObject(state, {
        getDataState: 'SUCCESS',
        data: action.data,
        error: null,
        servicesId: action.id
    });
};

const getServiceDataError = (state, action) => {
    return updateObject(state, {
        getDataState: 'ERROR',
        error: action.error,
    });
};

const postDataLoading = (state) => {
    return updateObject(state, {
        postDataState: 'LOADING'
    });
}

const postDataSuccess = (state, action) => {
    return updateObject(state, {
        postDataState: 'SUCCESS',
        data: action.data,
        error: null,
        servicesId: action.id
    });
};

const postDataError = (state, action) => {
    return updateObject(state, {
        postDataState: 'ERROR',
        error: action.error,
    });
};

const putTatDataLoading = (state) => {
    return updateObject(state, {
        putDataState: 'LOADING'
    });
}

const putTatDataSuccess = (state, action) => {
    return updateObject(state, {
        putDataState: 'SUCCESS',
        data: action.data,
        error: null
    });
};

const putTatDataError = (state, action) => {
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
        selectedServiceData: action.selectedServiceData,
        error: null,
    });
};

const getSelectedServiceDataError = (state, action) => {
    return updateObject(state, {
        getSelectedDataState: 'ERROR',
        error: action.error,
    });
};

const getEnabledPlatformServicesLoading = (state,action) => {
    return updateObject( state, {
        getEnabledPlatformServicesState:'LOADING',
        error : null
    });
}

const getEnabledPlatformServicesSuccess = (state,action) => {
    return updateObject( state, {
        getEnabledPlatformServicesState:'SUCCESS',
        EnabledPlatformServices : action.enabled,
        enabledID : action._id,
        error : null
    });
}

const getEnabledPlatformServicesError = (state,action) => {
    return updateObject( state, {
        getEnabledPlatformServicesState:'ERROR',
        error : action.error
    });
}

const postEnabledPlatformServicesLoading = (state,action) => {
    return updateObject( state, {
        postEnabledPlatformServicesState:'LOADING',
        error : null
    });
}

const postEnabledPlatformServicesSuccess = (state,action) => {
    return updateObject( state, {
        postEnabledPlatformServicesState:'SUCCESS',
        error : null
    });
}

const postEnabledPlatformServicesError = (state,action) => {
    return updateObject( state, {
        postEnabledPlatformServicesState:'ERROR',
        error : action.error
    });
}

const putEnabledPlatformServicesLoading = (state,action) => {
    return updateObject( state, {
        putEnabledPlatformServicesState:'LOADING',
        error : null
    });
}

const putEnabledPlatformServicesSuccess = (state,action) => {
    return updateObject( state, {
        putEnabledPlatformServicesState:'SUCCESS',
        error : null
    });
}

const putEnabledPlatformServicesError = (state,action) => {
    return updateObject( state, {
        putEnabledPlatformServicesState:'ERROR',
        error : action.error
    });
}

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case actionTypes.GET_INIT_STATE : return getInitState(state);
        
        case actionTypes.GET_SERVICE_DATA_LOADING: return getServiceDataLoading(state, action);
        case actionTypes.GET_SERVICE_DATA_SUCCESS: return getServiceDataSuccess(state, action);
        case actionTypes.GET_SERVICE_DATA_ERROR: return getServiceDataError(state, action);
        
        case actionTypes.POST_TAT_DATA_LOADING: return postDataLoading(state, action);
        case actionTypes.POST_TAT_DATA_SUCCESS: return postDataSuccess(state, action);
        case actionTypes.POST_TAT_DATA_ERROR: return postDataError(state, action);

        case actionTypes.PUT_TAT_DATA_LOADING: return putTatDataLoading(state, action);
        case actionTypes.PUT_TAT_DATA_SUCCESS: return putTatDataSuccess(state, action);
        case actionTypes.PUT_TAT_DATA_ERROR: return putTatDataError(state, action);

        case actionTypes.GET_SELECTED_SERVICE_DATA_LOADING: return getSelectedServiceDataLoading(state, action);
        case actionTypes.GET_SELECTED_SERVICE_DATA_SUCCESS: return getSelectedServiceDataSuccess(state, action);
        case actionTypes.GET_SELECTED_SERVICE_DATA_ERROR: return getSelectedServiceDataError(state, action);

        //get enabled platform services
        case actionTypes.GET_ENABLED_PLATFORM_SERVICES_LOADING:return getEnabledPlatformServicesLoading(state,action);
        case actionTypes.GET_ENABLED_PLATFORM_SERVICES_SUCCESS:return getEnabledPlatformServicesSuccess(state,action);
        case actionTypes.GET_ENABLED_PLATFORM_SERVICES_ERROR:return getEnabledPlatformServicesError(state,action);

        // post enabled Platform Services
        case actionTypes.POST_ENABLED_PLATFORM_SERVICES_LOADING:return postEnabledPlatformServicesLoading(state,action);
        case actionTypes.POST_ENABLED_PLATFORM_SERVICES_SUCCESS:return postEnabledPlatformServicesSuccess(state,action);
        case actionTypes.POST_ENABLED_PLATFORM_SERVICES_ERROR:return postEnabledPlatformServicesError(state,action);

        // put enabled Platform Services
        case actionTypes.PUT_ENABLED_PLATFORM_SERVICES_LOADING:return putEnabledPlatformServicesLoading(state,action);
        case actionTypes.PUT_ENABLED_PLATFORM_SERVICES_SUCCESS:return putEnabledPlatformServicesSuccess(state,action);
        case actionTypes.PUT_ENABLED_PLATFORM_SERVICES_ERROR:return putEnabledPlatformServicesError(state,action);

        default: return state;
    }
};

export default reducer;