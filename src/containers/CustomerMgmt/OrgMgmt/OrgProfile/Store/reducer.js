import * as actionTypes from './actionTypes';
import { updateObject } from '../../OrgMgmtStore/utility';

const initialState = {
    getDataState: 'INIT',
    data: null,
    getOrgLogoState: 'INIT',
    getAllPlatformServicesState: 'INIT',
    getEnabledPlatformServicesState: 'INIT',
    postEnabledPlatformServicesState: 'INIT',
    putEnabledPlatformServicesState: 'INIT',
    servicesId: null,
    PlatformProducts: [],
    PlatformServices: [],
    PlatformPlatformServices: [],
    EnabledServices: [],
    EnabledProducts: [],
    EnabledPlatformServices: [],
    logoUrl: null,
    error: null,
    deleteBgvConfigState: 'INIT',
    deleteOpsConfigState: 'INIT',

    getBGVSelectedDataState: 'INIT',
    getBGVSelectedData: null,
    getOpsSelectedDataState: 'INIT',
    getOpsSelectedData: null,

    getClientNotificationState: 'INIT',
    getClientNotification: {}
}

const initState = () => {
    return initState;
}


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

const getOrgLogoSucess = (state, action) => {
    return updateObject(state, {
        logoUrl: action.logoUrl,
        error: null,
        getOrgLogoState: 'SUCCESS'
    });
};

const getOrgLogoError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        getOrgLogoState: 'ERROR'
    });
};

const getOrgLogoLoading = (state, action) => {
    return updateObject(state, {
        getOrgLogoState: 'LOADING'
    });
};

const getAllPlatformServicesLoading = (state, action) => {
    return updateObject(state, {
        getAllPlatformServicesState: 'LOADING',
        error: null
    });
}

const getAllPlatformServicesSuccess = (state, action) => {
    return updateObject(state, {
        getAllPlatformServicesState: 'SUCCESS',
        platformData: action.platformData,
        PlatformServices: action.platformServices,
        PlatformProducts: action.platformProducts,
        PlatformPlatformServices: action.platformPlatformServices,
        error: null
    });
}

const getAllPlatformServicesError = (state, action) => {
    return updateObject(state, {
        getAllPlatformServicesState: 'ERROR',
        error: action.error
    });
}

const getEnabledPlatformServicesLoading = (state, action) => {
    return updateObject(state, {
        getEnabledPlatformServicesState: 'LOADING',
        error: null
    });
}

const getEnabledPlatformServicesSuccess = (state, action) => {
    return updateObject(state, {
        getEnabledPlatformServicesState: 'SUCCESS',
        EnabledServices: action.enabledServices,
        EnabledProducts: action.enabledProducts,
        EnabledPlatformServices: action.enabledPlatformServices,
        servicesId: action._id,
        enabledData: action.enabledData,
        enabledPlatformService: action.enabledPlatformService,
        error: null
    });
}

const getEnabledPlatformServicesError = (state, action) => {
    return updateObject(state, {
        getEnabledPlatformServicesState: 'ERROR',
        error: action.error
    });
}

const postEnabledPlatformServicesLoading = (state, action) => {
    return updateObject(state, {
        postEnabledPlatformServicesState: 'LOADING',
        error: null
    });
}

const postEnabledPlatformServicesSuccess = (state, action) => {
    return updateObject(state, {
        postEnabledPlatformServicesState: 'SUCCESS',
        enabledData: action.enabledData,
        error: null
    });
}

const postEnabledPlatformServicesError = (state, action) => {
    return updateObject(state, {
        postEnabledPlatformServicesState: 'ERROR',
        error: action.error
    });
}

const putEnabledPlatformServicesLoading = (state, action) => {
    return updateObject(state, {
        putEnabledPlatformServicesState: 'LOADING',
        error: null
    });
}

const putEnabledPlatformServicesSuccess = (state, action) => {
    return updateObject(state, {
        putEnabledPlatformServicesState: 'SUCCESS',
        error: null
    });
}

const putEnabledPlatformServicesError = (state, action) => {
    return updateObject(state, {
        putEnabledPlatformServicesState: 'ERROR',
        error: action.error
    });
}

const deleteBgvConfigLoading = (state, action) => {
    return updateObject(state, {
        deleteBgvConfigState: 'LOADING',
        error: null
    });
}

const deleteBgvConfigSuccess = (state, action) => {
    return updateObject(state, {
        deleteBgvConfigState: 'SUCCESS',
        error: null
    });
}

const deleteBgvConfigError = (state, action) => {
    return updateObject(state, {
        deleteBgvConfigState: 'ERROR',
        error: action.error
    });
}

const deleteOpsConfigLoading = (state, action) => {
    return updateObject(state, {
        deleteOpsConfigState: 'LOADING',
        error: null
    });
}

const deleteOpsConfigSuccess = (state, action) => {
    return updateObject(state, {
        deleteOpsConfigState: 'SUCCESS',
        error: null
    });
}

const deleteOpsConfigError = (state, action) => {
    return updateObject(state, {
        deleteOpsConfigState: 'ERROR',
        error: action.error
    });
}

const getBGVSelectedServiceDataLoading = (state) => {
    return updateObject(state, {
        getBGVSelectedDataState: 'LOADING'
    });
}

const getBGVSelectedServiceDataSuccess = (state, action) => {
    return updateObject(state, {
        getBGVSelectedDataState: 'SUCCESS',
        getBGVSelectedData: action.data,
        error: null
    });
};

const getBGVSelectedServiceDataError = (state, action) => {
    return updateObject(state, {
        getBGVSelectedDataState: 'ERROR',
        error: action.error,
    });
};

const getOpsSelectedServiceDataLoading = (state) => {
    return updateObject(state, {
        getOpsSelectedDataState: 'LOADING'
    });
}

const getOpsSelectedServiceDataSuccess = (state, action) => {
    return updateObject(state, {
        getOpsSelectedDataState: 'SUCCESS',
        getOpsSelectedData: action.data,
        error: null
    });
};

const getOpsSelectedServiceDataError = (state, action) => {
    return updateObject(state, {
        getOpsSelectedDataState: 'ERROR',
        error: action.error,
    });
};

const getClientNotificationLoading = (state) => {
    return updateObject(state, {
        getClientNotificationState: 'LOADING'
    });
}
const getClientNotificationSuccess = (state, action) => {
    return updateObject(state, {
        getClientNotificationState: 'SUCCESS',
        getClientNotification: action.notificationData,
        error: null
    });
};

const getClientNotificationError = (state, action) => {
    return updateObject(state, {
        getClientNotificationState: 'ERROR',
        error: action.error,
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_STATE: return initState();

        case actionTypes.GET_DATA_LOADING: return getDataLoading(state, action);
        case actionTypes.GET_DATA_SUCCESS: return getDataSuccess(state, action);
        case actionTypes.GET_DATA_ERROR: return getDataError(state, action);

        case actionTypes.GET_ORGLOGO_LOADING: return getOrgLogoLoading(state, action);
        case actionTypes.GET_ORGLOGO_SUCCESS: return getOrgLogoSucess(state, action);
        case actionTypes.GET_ORGLOGO_ERROR: return getOrgLogoError(state, action);
        // get All Platform Services
        case actionTypes.GET_ALL_PLATFORM_SERVICES_LOADING: return getAllPlatformServicesLoading(state, action);
        case actionTypes.GET_ALL_PLATFORM_SERVICES_SUCCESS: return getAllPlatformServicesSuccess(state, action);
        case actionTypes.GET_ALL_PLATFORM_SERVICES_ERROR: return getAllPlatformServicesError(state, action);
        // get Enabled Platform Services
        case actionTypes.GET_ENABLED_PLATFORM_SERVICES_LOADING: return getEnabledPlatformServicesLoading(state, action);
        case actionTypes.GET_ENABLED_PLATFORM_SERVICES_SUCCESS: return getEnabledPlatformServicesSuccess(state, action);
        case actionTypes.GET_ENABLED_PLATFORM_SERVICES_ERROR: return getEnabledPlatformServicesError(state, action);
        // post enabled Platform Services
        case actionTypes.POST_ENABLED_PLATFORM_SERVICES_LOADING: return postEnabledPlatformServicesLoading(state, action);
        case actionTypes.POST_ENABLED_PLATFORM_SERVICES_SUCCESS: return postEnabledPlatformServicesSuccess(state, action);
        case actionTypes.POST_ENABLED_PLATFORM_SERVICES_ERROR: return postEnabledPlatformServicesError(state, action);
        // put enabled Platform Services
        case actionTypes.PUT_ENABLED_PLATFORM_SERVICES_LOADING: return putEnabledPlatformServicesLoading(state, action);
        case actionTypes.PUT_ENABLED_PLATFORM_SERVICES_SUCCESS: return putEnabledPlatformServicesSuccess(state, action);
        case actionTypes.PUT_ENABLED_PLATFORM_SERVICES_ERROR: return putEnabledPlatformServicesError(state, action);
        //delete bgv config
        case actionTypes.DELETE_BGV_CONFIG_LOADING: return deleteBgvConfigLoading(state, action);
        case actionTypes.DELETE_BGV_CONFIG_SUCCESS: return deleteBgvConfigSuccess(state, action);
        case actionTypes.DELETE_BGV_CONFIG_ERROR: return deleteBgvConfigError(state, action);
        //delete ops config
        case actionTypes.DELETE_OPS_CONFIG_LOADING: return deleteOpsConfigLoading(state, action);
        case actionTypes.DELETE_OPS_CONFIG_SUCCESS: return deleteOpsConfigSuccess(state, action);
        case actionTypes.DELETE_OPS_CONFIG_ERROR: return deleteOpsConfigError(state, action);
        //bgv config data
        case actionTypes.GET_BGV_SELECTED_SERVICE_DATA_LOADING: return getBGVSelectedServiceDataLoading(state, action);
        case actionTypes.GET_BGV_SELECTED_SERVICE_DATA_SUCCESS: return getBGVSelectedServiceDataSuccess(state, action);
        case actionTypes.GET_BGV_SELECTED_SERVICE_DATA_ERROR: return getBGVSelectedServiceDataError(state, action);
        //ops config data
        case actionTypes.GET_OPS_SELECTED_SERVICE_DATA_LOADING: return getOpsSelectedServiceDataLoading(state, action);
        case actionTypes.GET_OPS_SELECTED_SERVICE_DATA_SUCCESS: return getOpsSelectedServiceDataSuccess(state, action);
        case actionTypes.GET_OPS_SELECTED_SERVICE_DATA_ERROR: return getOpsSelectedServiceDataError(state, action);
        case actionTypes.GET_CLIENT_NOTIFICATION_LOADING: return getClientNotificationLoading(state, action);
        case actionTypes.GET_CLIENT_NOTIFICATION_SUCCESS: return getClientNotificationSuccess(state, action);
        case actionTypes.GET_CLIENT_NOTIFICATION_ERROR: return getClientNotificationError(state, action);

        default: return state;
    }
};

export default reducer;