import { updateObject } from '../../OrgMgmtStore/utility';
import * as actionTypes from './actionTypes';

const initialState = {
    getOrgProfileState : "INIT",
    getOrgConfigState: 'INIT',
    getOrgBgvConfigState: 'INIT',
    postOrgBgvStatusState: 'INIT',
    getOrgOnboardStatsState: 'INIT',
    getOrgOnboardInsightsState: 'INIT',
    
    orgData : null,
    enabledProducts: [],
    bgvConfig: null,
    bgvStatus: null,
    onboardStats: null,
    onboardInsights: null
}

//INIT STATE REDUCERS
const getInitState = () => {
    return initialState;
}

//GET ORG PROFILE REDUCERS
const getOrgDataLoading = (state) => {
    return updateObject(state, {
        getOrgProfileState: 'LOADING'
    });
}

const getOrgDataSuccess = (state, action) => {
    return updateObject(state, {
        getOrgProfileState: 'SUCCESS',
        orgData: action.data,
        error: null
    });
};

const getOrgDataError = (state, action) => {
    return updateObject(state, {
        getOrgProfileState: 'ERROR',
        error: action.error,
    });
};

//GET ORG CONFIG REDUCERS
const getOrgConfigLoading = (state) => {
    return updateObject(state, {
        getOrgConfigState: 'LOADING'
    });
}

const getOrgConfigSuccess = (state, action) => {
    return updateObject(state, {
        getOrgConfigState: 'SUCCESS',
        enabledProducts: action.enabledProducts,
        error: null
    });
};

const getOrgConfigError = (state, action) => {
    return updateObject(state, {
        getOrgConfigState: 'ERROR',
        error: action.error,
    });
};

//GET ORG BGV CONFIG REDUCERS
const getOrgBgvConfigLoading = (state) => {
    return updateObject(state, {
        getOrgBgvConfigState: 'LOADING'
    });
}

const getOrgBgvConfigSuccess = (state, action) => {
    return updateObject(state, {
        getOrgBgvConfigState: 'SUCCESS',
        bgvConfig: action.bgvConfig,
        error: null
    });
};

const getOrgBgvConfigError = (state, action) => {
    return updateObject(state, {
        getOrgBgvConfigState: 'ERROR',
        error: action.error,
    });
};

//GET BGV STATUS REDUCERS
const postBgvStatusLoading = (state) => {
    return updateObject(state, {
        postOrgBgvStatusState: 'LOADING'
    });
}

const postBgvStatusSuccess = (state, action) => {
    return updateObject(state, {
        postOrgBgvStatusState: 'SUCCESS',
        bgvStatus: action.bgvStatus,
        error: null
    });
};

const postBgvStatusError = (state, action) => {
    return updateObject(state, {
        postOrgBgvStatusState: 'ERROR',
        error: action.error,
    });
};

//GET ONBOARD STATS REDUCERS
const getOnboardStatsLoading = (state) => {
    return updateObject(state, {
        getOrgOnboardStatsState: 'LOADING'
    });
}

const getOnboardStatsSuccess = (state, action) => {
    return updateObject(state, {
        getOrgOnboardStatsState: 'SUCCESS',
        onboardStats: action.onboardStats,
        error: null
    });
};

const getOnboardStatsError = (state, action) => {
    return updateObject(state, {
        getOrgOnboardStatsState: 'ERROR',
        error: action.error,
    });
};

//GET ONBOARD INSIGHTS REDUCERS
const getOnboardInsightLoading = (state) => {
    return updateObject(state, {
        getOrgOnboardInsightsState: 'LOADING'
    });
}

const getOnboardInsightSuccess = (state, action) => {
    return updateObject(state, {
        getOrgOnboardInsightsState: 'SUCCESS',
        onboardInsights: action.onboardInsights,
        error: null
    });
};

const getOnboardInsightError = (state, action) => {
    return updateObject(state, {
        getOrgOnboardInsightsState: 'ERROR',
        error: action.error,
    });
};

const orgOnboardDashboardReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_INIT_STATE: return getInitState();

        case actionTypes.GET_ORG_DATA_LOADING: return getOrgDataLoading(state, action);
        case actionTypes.GET_ORG_DATA_SUCCESS: return getOrgDataSuccess(state, action);
        case actionTypes.GET_ORG_DATA_ERROR: return getOrgDataError(state, action);

        case actionTypes.GET_ORG_CONFIG_LOADING: return getOrgConfigLoading(state, action);
        case actionTypes.GET_ORG_CONFIG_SUCCESS: return getOrgConfigSuccess(state, action);
        case actionTypes.GET_ORG_CONFIG_ERROR: return getOrgConfigError(state, action);

        case actionTypes.GET_ORG_BGV_CONFIG_LOADING: return getOrgBgvConfigLoading(state, action);
        case actionTypes.GET_ORG_BGV_CONFIG_SUCCESS: return getOrgBgvConfigSuccess(state, action);
        case actionTypes.GET_ORG_BGV_CONFIG_ERROR: return getOrgBgvConfigError(state, action);

        case actionTypes.POST_ORG_BGV_DATA_LOADING: return postBgvStatusLoading(state, action);
        case actionTypes.POST_ORG_BGV_DATA_SUCCESS: return postBgvStatusSuccess(state, action);
        case actionTypes.POST_ORG_BGV_DATA_ERROR: return postBgvStatusError(state, action);

        case actionTypes.GET_ORG_ONBOARD_STATS_LOADING: return getOnboardStatsLoading(state, action);
        case actionTypes.GET_ORG_ONBOARD_STATS_SUCCESS: return getOnboardStatsSuccess(state, action);
        case actionTypes.GET_ORG_ONBOARD_STATS_ERROR: return getOnboardStatsError(state, action);

        case actionTypes.GET_ORG_ONBOARD_INSIGHTS_LOADING: return getOnboardInsightLoading(state, action);
        case actionTypes.GET_ORG_ONBOARD_INSIGHTS_SUCCESS: return getOnboardInsightSuccess(state, action);
        case actionTypes.GET_ORG_ONBOARD_INSIGHTS_ERROR: return getOnboardInsightError(state, action);

        default: return state;
    }
}

export default orgOnboardDashboardReducer;