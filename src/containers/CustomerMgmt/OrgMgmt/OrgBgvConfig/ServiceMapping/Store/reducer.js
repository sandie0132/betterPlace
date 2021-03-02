import * as actionTypes from './actionTypes';
import { updateObject } from '../../../OrgMgmtStore/utility';

const initialState = {
    TagMapList: [],
    TagInfoData :[],
    postTagInfoState:'INIT',
    getConfigTagMapListState: 'INIT',
    postConfigTagMapListState: 'INIT',
    putConfigTagMapListState:'INIT',
    getEnabledPlatformServicesState : "INIT",
    postEnabledPlatformServicesState: "INIT",
    putEnabledPlatformServicesState: "INIT",
    EnabledPlatformServices : {},
    error: null,
    enabledID : ''
};

const initState = () => {
    return initialState;
}

//GET TAGLIST REDUCERS
const getConfigTagMapListLoading = (state) => {
    return updateObject(state, {
        getConfigTagMapListState: 'LOADING'
    });
}

const getConfigTagMapListSuccess = (state, action) => {
    return updateObject(state, {
        getConfigTagMapListState: 'SUCCESS',
        TagMapList: action.TagMapList,
        error: null
    });
};

const getConfigTagMapListError = (state, action) => {
    return updateObject(state, {
        getConfigTagMapListState: 'ERROR',
        error: action.error,
    });
};

//POST TAGLIST REDUCERS
const postConfigTagMapListLoading = (state) => {
    return updateObject(state, {
        postConfigTagMapListState: 'LOADING'
    });
}

const postConfigTagMapListSuccess = (state, action) => {
    return updateObject(state, {
        postConfigTagMapListState: 'SUCCESS',
        TagMapList: action.TagMapList,
        error: null
    });
};

const postConfigTagMapListError = (state, action) => {
    return updateObject(state, {
        postConfigTagMapListState: 'ERROR',
        error: action.error,
    });
};

//POST TAGLIST REDUCERS
const putConfigTagMapListLoading = (state) => {
    return updateObject(state, {
        putConfigTagMapListState: 'LOADING'
    });
}

const putConfigTagMapListSuccess = (state, action) => {
    return updateObject(state, {
        putConfigTagMapListState: 'SUCCESS',
        TagMapList: action.TagMapList,
        error: null
    });
};

const putConfigTagMapListError = (state, action) => {
    return updateObject(state, {
        putConfigTagMapListState: 'ERROR',
        error: action.error,
    });
};

//POST TAGINFODATA REDUCERS
const postTagInfoDataLoading = (state) => {
    return updateObject(state, {
        postTagInfoState: 'LOADING'
    });
}

const postTagInfoDataSuccess = (state, action) => {
    return updateObject(state, {
        postTagInfoState: 'SUCCESS',
        TagInfoData: action.TagInfoData,
        error: null
    });
};

const postTagInfoDataError = (state, action) => {
    return updateObject(state, {
        postTagInfoState: 'ERROR',
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
        case actionTypes.INIT_CONFIG_TAG_MAP_LIST: return initState();

        case actionTypes.GET_CONFIG_TAG_MAP_LIST_LOADING: return getConfigTagMapListLoading(state, action);
        case actionTypes.GET_CONFIG_TAG_MAP_LIST_SUCCESS: return getConfigTagMapListSuccess(state, action);
        case actionTypes.GET_CONFIG_TAG_MAP_LIST_ERROR: return getConfigTagMapListError(state, action);

        case actionTypes.POST_CONFIG_TAG_MAP_LIST_LOADING: return postConfigTagMapListLoading(state, action);
        case actionTypes.POST_CONFIG_TAG_MAP_LIST_SUCCESS: return postConfigTagMapListSuccess(state, action);
        case actionTypes.POST_CONFIG_TAG_MAP_LIST_ERROR: return postConfigTagMapListError(state, action);

        case actionTypes.PUT_CONFIG_TAG_MAP_LIST_LOADING: return putConfigTagMapListLoading(state, action);
        case actionTypes.PUT_CONFIG_TAG_MAP_LIST_SUCCESS: return putConfigTagMapListSuccess(state, action);
        case actionTypes.PUT_CONFIG_TAG_MAP_LIST_ERROR: return putConfigTagMapListError(state, action);

        case actionTypes.POST_TAG_INFO_DATA_LOADING: return postTagInfoDataLoading(state, action);
        case actionTypes.POST_TAG_INFO_DATA_SUCCESS: return postTagInfoDataSuccess(state, action);
        case actionTypes.POST_TAG_INFO_DATA_ERROR: return postTagInfoDataError(state, action);

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