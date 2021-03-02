import * as actionTypes from './actionTypes';
import axios from 'axios';
import _ from 'lodash';

const IDENTITY = process.env.REACT_APP_IDENTITY_URL;
const PLATFORM = process.env.REACT_APP_PLATFORM_API_URL;
const CUSTOMER_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

//Init State Action Dispatch
export const initAccessMgmtState = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.INIT_STATE
        })
    };
};

//Get List of Orgs ACction Dispatch
export const getListOfOrgs = (orgIdsList) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_LIST_OF_ORGS_LOADING
        })
        let url = CUSTOMER_MGMT + '/org?';
        _.forEach(orgIdsList, function(orgId, index){
            if(index === orgIdsList.length - 1) url = url + `orgId=${orgId}`;
            else url = url + 'orgId='+ orgId + '&';
        })
        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_LIST_OF_ORGS_SUCCESS,
                        orgList: response.data,
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_LIST_OF_ORGS_ERROR,
                    error: errMsg
                });
            });
    };
};

//Get Org Details Action Dispatch
export const getOrgDetails = (orgId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_ORG_DETAILS_LOADING
        })
        axios.get(CUSTOMER_MGMT+'/org/' + orgId)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_ORG_DETAILS_SUCCESS,
                        orgDetails: response.data,
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_ORG_DETAILS_ERROR,
                    error: errMsg
                });
            });
    };
};

//Get Permissions Action Dispatch
export const getPermissions = (scope) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_PERMISSION_LIST_LOADING
        })
        let url = IDENTITY+'/permission?channel=PORTAL';
        if(scope !== undefined){
            url = IDENTITY+'/permission?channel=PORTAL&scope='+scope;
        }
        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_PERMISSION_LIST_SUCCESS,
                        permissionData: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                dispatch({
                    type: actionTypes.GET_PERMISSION_LIST_ERROR,
                    error: errMsg
                });
            });
    };
};

//Get Policy Action Dispatch
export const getPolicy = (tagId, orgId) => {
    let url = IDENTITY+'/policy?tagId='+tagId;
    if(orgId !== undefined){
        url = IDENTITY+'/policy?tagId='+tagId+'&orgId='+orgId;
    }
    return dispatch => {
        dispatch({
            type: actionTypes.GET_POLICY_LOADING
        })
        axios.get(url)
        .then(response => {
            if (response.status === 200 || response.status === 201) {
                dispatch({
                    type: actionTypes.GET_POLICY_SUCCESS,
                    policyData: response.data
                });
            }
        })
        .catch(error => {
            let errMsg  = error;
            dispatch({
                type: actionTypes.GET_POLICY_ERROR,
                error: errMsg
            });
        });
    }
}

//Get Tags With Policy
export const getTagWithPolicy = (orgId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.POST_TAG_W_POLICY_LOADING
        })
        axios.get(IDENTITY+`/policy/tags/${orgId}`)
        .then(response => {
            if (response.status === 200 || response.status === 201) {
                if(response.data.length !== 0){
                    dispatch(getTagsInfo(response.data));
                }
                dispatch({
                    type: actionTypes.POST_TAG_W_POLICY_SUCCESS,
                });
            }
        })
        .catch(error => {
            let errMsg  = error;
            dispatch({
                type: actionTypes.POST_TAG_W_POLICY_ERROR,
                error: errMsg
            });
        });
    }
}

//Get TAG Info From TagId's
export const getTagsInfo  = (tagIdList) => {
    return dispatch => {
        dispatch({
            type: actionTypes.POST_TAG_INFO_W_POLICY_LOADING
        })
        let url = CUSTOMER_MGMT + '/tag';
        let tagIdArray = [] ;
        _.forEach(tagIdList, function(tagId){
            // if(index === tagIdList.length - 1) url = url + `tagId=${tagId}`;
            // // else url = url + `tagId=${tagId}` + '&';
            // else url = url + 'tagId=' + tagId + '&';
            tagIdArray.push(tagId);
        })
        axios.post(url,tagIdArray)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.POST_TAG_INFO_W_POLICY_SUCCESS,
                        configuredTags: response.data,
                    });
                   
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }else {
                    errMsg = error.message
                }
                dispatch({
                    type: actionTypes.POST_TAG_INFO_W_POLICY_ERROR,
                    error: errMsg
                });
            });
    };
};

//Post Policy Action Dispatch
export const postPolicy = (data, tag, orgId, category) => {
    return dispatch => {
        dispatch({
            type: actionTypes.POST_POLICY_LOADING
        })
        axios.post(IDENTITY+'/policy', data)
            .then(response => {
                if(!tag.hasAccess){
                    // const updatedTag = {
                    //     ...tag,
                    //     hasAccess: true
                    // }
                    //dispatch(updateTagAccess(tag.uuid, updatedTag, orgId, category));
                    dispatch(getTagWithPolicy(orgId))
                }
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.POST_POLICY_SUCCESS,
                        policyData: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                dispatch({
                    type: actionTypes.POST_POLICY_ERROR,
                    error: errMsg
                });
            });
    }
}

export const getEnabledPlatformServices = (orgId) => {
    return dispatch => {
        dispatch({
            type : actionTypes.GET_ENABLED_PLATFORM_SERVICES_LOADING
        })
        axios.get(PLATFORM + '/services/'+orgId)
        .then(response => {
            if(response.status === 200 || response.status === 201)
            {
                dispatch({
                    type : actionTypes.GET_ENABLED_PLATFORM_SERVICES_SUCCESS,
                    enabledServices : response.data
                })
            }
        })
        .catch(error => {
            let errMsg  = error;
                if(error.response && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
            dispatch({
                type: actionTypes.GET_ENABLED_PLATFORM_SERVICES_ERROR,
                error: errMsg
            });
        })
    }
}

//Search orgs
export const searchOrgList = (searchParam) => {
    return dispatch => {
        dispatch({
            type : actionTypes.GET_ORG_LIST_LOADING
        })
        axios.get(CUSTOMER_MGMT+'/org/search?key=' + searchParam)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_ORG_LIST_SUCCESS,
                        searchList: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_ORG_LIST_ERROR,
                    error: errMsg
                });
            });
    };
};

//Clear Search List
export const clearSearch = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.CLEAR_SEARCH_LIST
        })
    };
};

// delete policy 
export const deletePolicy = (tagId,orgId) => {
    return (dispatch,getState) => {
        dispatch({
            type: actionTypes.DELETE_POLICY_LOADING
        })
        axios.delete(IDENTITY+`/policy?tagId=`+tagId+`&orgId=`+orgId)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    let updatedPolicy = getState().orgMgmt.orgAccessData.configuredTags ;
                    updatedPolicy = updatedPolicy.filter((Item) => {
                        if(Item.uuid === tagId)
                        {
                            return null;
                        }
                        else return Item;
                    });
                    dispatch({
                        type: actionTypes.DELETE_POLICY_SUCCESS,
                        configuredTags:updatedPolicy
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.DELETE_POLICY_ERROR,
                    error: errMsg
                })
            });
    };
};

// update policy 
export const updatePolicyByTagId = (payload,policyId) => {
    return (dispatch,getState) => {
        dispatch({
            type: actionTypes.UPDATE_POLICY_BY_TAGID_LOADING
        })
        axios.put(IDENTITY+`/policy/${policyId}`,payload)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.UPDATE_POLICY_BY_TAGID_SUCCESS,
                        orgList:payload
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.UPDATE_POLICY_BY_TAGID_ERROR,
                    error: errMsg
                })
            });
    };
};