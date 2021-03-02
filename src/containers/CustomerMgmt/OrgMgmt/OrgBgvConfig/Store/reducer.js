import { combineReducers } from 'redux';
import * as actionTypes from './actionTypes';
import { updateObject } from '../../OrgMgmtStore/utility';
import clientSpocReducer from '../ClientSpoc/Store/reducer';
import orgTatMappingReducer from '../TatMapping/Store/reducer';
import orgBgvConfigSelectServiceReducer from '../SelectService/Store/reducer';
import orgBgvConfigTagMapReducer from '../ServiceMapping/Store/reducer';
import statusMgmtReducer from '../StatusMgmt/Store/reducer';
import orgBgvConfigBpSpoc from '../BetterplaceSpoc/Store/reducer';
const initialState = {

    servicesConfigured: false,
    tagMappingConfigured: false,
    tatMappingConfigured: false,
    clientSpocConfigured: false,
    betterPlaceSpocConfigured: false,
    statusMgmtConfigured: false,
    servicesData: [],
    getServicesDataState:'INIT'
}

// INIT STATE REDUCERS
const initState = () => {
    return initialState;
}

const setBgvConfigStatus = (state, action) => {
    return updateObject(state, {
        servicesConfigured: action.servicesConfigured,
        tagMappingConfigured: action.tagMappingConfigured,
        tatMappingConfigured: action.tatMappingConfigured,
        clientSpocConfigured: action.clientSpocConfigured,
        betterPlaceSpocConfigured: action.betterPlaceSpocConfigured,
        statusMgmtConfigured: action.statusMgmtConfigured
    });
};

const getServicesDataLoading = (state) => {
    return updateObject(state, {
        getServicesDataState: 'LOADING'
    });
}

const getServicesDataSuccess = (state, action) => {
    return updateObject(state, {
        getServicesDataState: 'SUCCESS',
        servicesData: action.servicesData,
        error: null
    });
};

const getServicesDataError = (state, action) => {
    return updateObject(state, {
        getServicesDataState: 'ERROR',
        error: action.error,
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_STATE: return initState();

        case actionTypes.SET_BGV_CONFIG_STATUS: return setBgvConfigStatus(state, action);

        case actionTypes.GET_ALL_SERVICES_DATA_LOADING: return getServicesDataLoading(state, action);
        case actionTypes.GET_ALL_SERVICES_DATA_SUCCESS: return getServicesDataSuccess(state, action);
        case actionTypes.GET_ALL_SERVICES_DATA_ERROR: return getServicesDataError(state, action);

        default: return state;
    }
};

const bgvConfigReducer = combineReducers({
    configStatus: reducer,
    selectService: orgBgvConfigSelectServiceReducer,
    tagMapService: orgBgvConfigTagMapReducer,
    tatMap: orgTatMappingReducer,
    clientSpoc: clientSpocReducer,
    statusMgmt : statusMgmtReducer,
    bpSpoc: orgBgvConfigBpSpoc
})

export default bgvConfigReducer;