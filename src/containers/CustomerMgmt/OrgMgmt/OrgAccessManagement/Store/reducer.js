import { updateObject } from '../../OrgMgmtStore/utility';
import * as actionTypes from './actionTypes';

const initialState = {
    orgDetailsState: 'INIT',
    getPermissionState: 'INIT',
    getOrgListState: 'INIT',
    getPolicyState: 'INIT',
    postPolicyState: 'INIT',
    updateTagAccessState: 'INIT',
    updatePolicyByTagIdState: 'INIT',
    deletePolicyState: 'INIT',
    permissionData: [],
    deletedOrgId: null,
    orgList: [],
    policyData: {},
    orgDetails: {},
    error: null,
    getEnabledPlatformServicesState: 'INIT',
    enabledServices: [],
    postTagPolicyState: 'INIT',
    TagPolicyData:[],
    postTagWithInfoState:'INIT',
    configuredTags :[],
    searchList : [],
    searchListState:'INIT',
    deleteOrgPolicyState:'INIT'

}

//Init State
const initState = () => {
    return initialState;
}

//Get List of Orgs Reducers
const getListOfOrgsLoading = (state, action) => {
    return updateObject(state, {
        getOrgListState: 'LOADING'
    });
};

const getListOfOrgsSuccess = (state, action) => {
    return updateObject(state, {
        orgList: action.orgList,
        getOrgListState: 'SUCCESS'
    });
};

const getListOfOrgsError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        orgList: [],
        getOrgListState: 'ERROR'
    });
};

//Get Org Details Reducers
const getOrgDetailsLoading = (state, action) => {
    return updateObject(state, {
        orgDetailsState: 'LOADING'
    });
};

const getOrgDetailsSuccess = (state, action) => {
    return updateObject(state, {
        orgDetails: action.orgDetails,
        orgDetailsState: 'SUCCESS'
    });
};

const getOrgDetailsError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        orgDetails: {},
        orgDetailsState: 'ERROR'
    });
};

//Get Permissions Reducers
const getPermissionLoading = ( state ) => {
    return updateObject( state, {
        getPermissionState: 'LOADING',
    });
};

const getPermissionSuccess = ( state, action ) => {
    return updateObject( state, {
        getPermissionState: 'SUCCESS',
        permissionData: action.permissionData,
        error: null
    });
};

const getPermissionError = ( state, action ) => {
    return updateObject( state, {
        getPermissionState: 'ERROR',
        error: action.error
    });
};

//Get Policy Reducer
const getPolicyLoading = ( state, action) => {
    return updateObject( state, {
        getPolicyState: 'LOADING'
    })
}

const getPolicySuccess = ( state, action) => {
    return updateObject( state, {
        getPolicyState: 'SUCCESS',
        policyData: action.policyData
    })
}

const getPolicyError = ( state, action) => {
    return updateObject( state, {
        getPolicyState: 'ERROR'
    })
}

//Post Policy Reducers
const postPolicyLoading = ( state, action ) => {
    return updateObject( state, {
        postPolicyState: 'LOADING',
    });
};

const postPolicySuccess = ( state,action ) => {
    return updateObject( state, {
        postPolicyState: 'SUCCESS',
        policyData:[action.policyData],
        error: null
    });
};

const postPolicyError = ( state, action ) => {
    return updateObject( state, {
        postPolicyState: 'ERROR',
        error: action.error
    });
};

//Get Enabled Service List Reducers
const getEnabledPlatformServicesLoading = (state,action) => {
    return updateObject( state, {
        getEnabledPlatformServicesState:'LOADING',
        error : null
    });
}

const getEnabledPlatformServicesSuccess = (state,action) => {
    return updateObject( state, {
        getEnabledPlatformServicesState:'SUCCESS',
        enabledServices  : action.enabledServices,
        error : null
    });
}

const getEnabledPlatformServicesError = (state,action) => {
    return updateObject( state, {
        getEnabledPlatformServicesState:'ERROR',
        error : action.error
    });
}

//Post Tag Policy Reducers
const postTagPolicyLoading = ( state ) => {
    return updateObject( state, {
        postTagPolicyState: 'LOADING',
    });
};

const postTagPolicySuccess = ( state,action ) => {
    return updateObject( state, {
        postTagPolicyState: 'SUCCESS',
        TagPolicyData : action.TagPolicyData,
        error: null
    });
};

const postTagPolicyError = ( state, action ) => {
    return updateObject( state, {
        postTagPolicyState: 'ERROR',
        error: action.error
    });
};

//Post Tag Policy with Info Reducers
const postTagInfoPolicyLoading = ( state ) => {
    return updateObject( state, {
        postTagWithInfoState: 'LOADING',
    });
};

const postTagInfoPolicySuccess = ( state, action) => {
    return updateObject( state, {
        postTagWithInfoState: 'SUCCESS',
        configuredTags : action.configuredTags,
        error: null
    });
};

const postTagInfoPolicyError = ( state, action ) => {
    return updateObject( state, {
        postTagWithInfoState: 'ERROR',
        error: action.error
    });
};

//Search Org Reducers
const getSearchListLoading = (state, action) => {
    return updateObject(state, {
        searchListState: 'LOADING'
    });
};

const getSearchListSuccess = (state, action) => {
    return updateObject(state, {
        searchList: action.searchList,
        searchListState: 'SUCCESS'
    });
};

const getSearchListError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        searchList: [],
        searchListState: 'ERROR'
    });
};

//Clear Search List
const clearSearch = (state) => {
    return updateObject(state, {
        searchList: []
    });
}

//Delete Org Policy
const deleteOrgPolicyLoading = (state, action) => {
    return updateObject(state, {
        deleteOrgPolicyState: 'LOADING'
    });
};

const deleteOrgPolicySuccess = (state, action) => {
    return updateObject(state, {
        deleteOrgPolicyState: 'SUCCESS',
        deletedOrgId: action.deletedOrgId
    });
};

const deleteOrgPolicyError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        deleteOrgPolicyState: 'ERROR'
    });
};

//Update Tag Access
const updateTagAccessLoading = (state) => {
    return updateObject(state, {
        updateTagAccessState: 'LOADING'
    });
};

const updateTagAccessSuccess = (state, action) => {
    return updateObject(state, {
        updateTagAccessState: 'SUCCESS',
        deletedOrgId: action.deletedOrgId
    });
};

const updateTagAccessError = (state, action) => {
    return updateObject(state, {
        updateTagAccessState: 'ERROR',
        error: action.error,
    });
};

//update policy by tagId
const updatePolicyByTagIdLoading = (state) => {
    return updateObject(state, {
        updatePolicyByTagIdState: 'LOADING'
    });
};

const updatePolicyByTagIdSuccess = (state, action) => {
    return updateObject(state, {
        updatePolicyByTagIdState: 'SUCCESS',
        orgList:action.orgList.org
    });
};

const updatePolicyByTagIdError = (state, action) => {
    return updateObject(state, {
        updatePolicyByTagIdState: 'ERROR',
        error: action.error,
    });
};


// delete policy 

const deletePolicyLoading = (state,action) => {
    return updateObject(state, {
        deletePolicyState: 'LOADING'
    });
}

const deletePolicySuccess = (state, action) => {
    return updateObject(state, {
        deletePolicyState: 'SUCCESS',
        configuredTags: action.configuredTags
    });
};

const deletePolicyError = (state, action) => {
    return updateObject(state, {
        deletePolicyState: 'ERROR',
    });
};

//reset error
const resetError = (state, action) => {
    return updateObject(state, {
        error: null
    });
}

const reducer = (state = initialState, action) => {
   
    switch (action.type) {
        case actionTypes.INIT_STATE: return initState(state, action);
        case actionTypes.RESET_ERROR: return  resetError(state, action);

        case actionTypes.GET_LIST_OF_ORGS_LOADING: return getListOfOrgsLoading(state, action);
        case actionTypes.GET_LIST_OF_ORGS_SUCCESS: return getListOfOrgsSuccess(state, action);
        case actionTypes.GET_LIST_OF_ORGS_ERROR: return getListOfOrgsError(state, action);

        case actionTypes.GET_ORG_DETAILS_LOADING: return getOrgDetailsLoading(state, action);
        case actionTypes.GET_ORG_DETAILS_SUCCESS: return getOrgDetailsSuccess(state, action);
        case actionTypes.GET_ORG_DETAILS_ERROR: return getOrgDetailsError(state, action);

        case actionTypes.GET_PERMISSION_LIST_LOADING: return getPermissionLoading(state, action);
        case actionTypes.GET_PERMISSION_LIST_SUCCESS: return getPermissionSuccess(state, action);
        case actionTypes.GET_PERMISSION_LIST_ERROR: return getPermissionError(state, action);

        case actionTypes.GET_POLICY_LOADING: return getPolicyLoading(state, action);
        case actionTypes.GET_POLICY_SUCCESS: return getPolicySuccess(state, action);
        case actionTypes.GET_POLICY_ERROR: return getPolicyError(state, action);

        case actionTypes.POST_POLICY_LOADING: return postPolicyLoading(state, action);
        case actionTypes.POST_POLICY_SUCCESS: return postPolicySuccess(state, action);
        case actionTypes.POST_POLICY_ERROR: return postPolicyError(state, action);

        case actionTypes.GET_ENABLED_PLATFORM_SERVICES_LOADING:return getEnabledPlatformServicesLoading(state,action);
        case actionTypes.GET_ENABLED_PLATFORM_SERVICES_SUCCESS:return getEnabledPlatformServicesSuccess(state,action);
        case actionTypes.GET_ENABLED_PLATFORM_SERVICES_ERROR:return getEnabledPlatformServicesError(state,action);

        case actionTypes.POST_TAG_INFO_W_POLICY_LOADING: return postTagInfoPolicyLoading(state, action);
        case actionTypes.POST_TAG_INFO_W_POLICY_SUCCESS: return postTagInfoPolicySuccess(state, action);
        case actionTypes.POST_TAG_INFO_W_POLICY_ERROR: return postTagInfoPolicyError(state, action);

        case actionTypes.POST_TAG_W_POLICY_LOADING: return postTagPolicyLoading(state, action);
        case actionTypes.POST_TAG_W_POLICY_SUCCESS: return postTagPolicySuccess(state, action);
        case actionTypes.POST_TAG_W_POLICY_ERROR: return postTagPolicyError(state, action);

        case actionTypes.GET_ORG_LIST_LOADING: return getSearchListLoading(state, action);
        case actionTypes.GET_ORG_LIST_SUCCESS: return getSearchListSuccess(state, action);
        case actionTypes.GET_ORG_LIST_ERROR: return getSearchListError(state, action);
        case actionTypes.CLEAR_SEARCH_LIST: return clearSearch(state, action);

        case actionTypes.DELETE_ORG_POLICY_LOADING: return deleteOrgPolicyLoading(state, action);
        case actionTypes.DELETE_ORG_POLICY_SUCCESS: return deleteOrgPolicySuccess(state, action);
        case actionTypes.DELETE_ORG_POLICY_ERROR: return deleteOrgPolicyError(state, action);

        case actionTypes.UPDATE_TAG_ACCESS_LOADING: return updateTagAccessLoading(state, action);
        case actionTypes.UPDATE_TAG_ACCESS_SUCCESS: return updateTagAccessSuccess(state, action);
        case actionTypes.UPDATE_TAG_ACCESS_ERROR: return updateTagAccessError(state, action);

        case actionTypes.UPDATE_POLICY_BY_TAGID_LOADING: return updatePolicyByTagIdLoading(state, action);
        case actionTypes.UPDATE_POLICY_BY_TAGID_SUCCESS: return updatePolicyByTagIdSuccess(state, action);
        case actionTypes.UPDATE_POLICY_BY_TAGID_ERROR: return updatePolicyByTagIdError(state, action);

        case actionTypes.DELETE_POLICY_LOADING: return deletePolicyLoading(state, action);
        case actionTypes.DELETE_POLICY_SUCCESS: return deletePolicySuccess(state, action);
        case actionTypes.DELETE_POLICY_ERROR: return deletePolicyError(state, action);
        
        default: return state;
    }    
};

export default reducer;

