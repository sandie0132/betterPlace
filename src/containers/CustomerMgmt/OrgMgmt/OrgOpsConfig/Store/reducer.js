import {combineReducers} from 'redux';
import OpsPriceReducer from '../OpsPricing/Store/reducer';
import opsServicesReducer from '../OpsSelectService/Store/reducer';
import opsTatReducer from '../OpsTatMapping/Store/reducer';
import { updateObject } from '../../OrgMgmtStore/utility';
import * as actionTypes from './actionTypes';

const initialState = {
    servicesConfigured: false,
    tatMappingConfigured: false,
    priceMappingConfigured: false
}

const initState = () => {
    return initialState;
}

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

const setOpsConfigStatus = (state, action) => {
    return updateObject(state, {
        servicesConfigured: action.servicesConfigured,
        tatMappingConfigured: action.tatMappingConfigured,
        priceMappingConfigured: action.priceMappingConfigured,
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case actionTypes.INIT_STATE: return initState();

        case actionTypes.SET_OPS_CONFIG_STATUS: return setOpsConfigStatus(state, action);

        case actionTypes.GET_ALL_SERVICES_DATA_LOADING: return getServicesDataLoading(state, action);
        case actionTypes.GET_ALL_SERVICES_DATA_SUCCESS: return getServicesDataSuccess(state, action);
        case actionTypes.GET_ALL_SERVICES_DATA_ERROR: return getServicesDataError(state, action);

        default: return state;
    }
};

const opsConfigReducer = combineReducers({
    opsPricing : OpsPriceReducer,
    opsServices : opsServicesReducer,
    opsTat : opsTatReducer,
    configStatus: reducer
})

export default opsConfigReducer;