import * as actionTypes from './actionTypes';
import _ from 'lodash';
import axios from 'axios';

const BGV = process.env.REACT_APP_BGV_CONFIG_URL;
const CUSTOMER_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;
// const PLATFORM = process.env.REACT_APP_PLATFORM_API_URL;

export const initState = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.INIT_CONFIG_TAG_MAP_LIST
        })
    };
};

//Get ConfigTagMapList Action Dispatch
export const getConfigTagMapList = (orgId, from, to, viaUrl) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_CONFIG_TAG_MAP_LIST_LOADING
        })
        let url = BGV+ '/config/'+ orgId;
        if(!_.isEmpty(from) && !_.isEmpty(to)){
            url = `${BGV}/config/from/${from}/to/${to}/shared_config`;
        }
        if(!_.isEmpty(viaUrl)){
            url += `?${viaUrl}`;
        }
        axios.get(url)
            .then(response => {
                let checkLevelRules=null, sectionLevelRules=null, profileLevelRules=null;
                if(!_.isEmpty(response.data.statusManagement)){
                    if(!_.isEmpty(response.data.statusManagement.checkLevelRules)){
                        checkLevelRules= response.data.statusManagement.checkLevelRules;
                    }

                    if(!_.isEmpty(response.data.statusManagement.sectionLevelRules)){
                        sectionLevelRules= response.data.statusManagement.sectionLevelRules;
                    }

                    if(!_.isEmpty(response.data.statusManagement.profileLevelRules)){
                        profileLevelRules= response.data.statusManagement.profileLevelRules;
                    }
                }

                let isStatusMgmtConfigured = (!_.isEmpty(checkLevelRules)) &&
                                            (!_.isEmpty(sectionLevelRules)) && 
                                            (!_.isEmpty(profileLevelRules))
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_CONFIG_TAG_MAP_LIST_SUCCESS,
                        TagMapList: response.data
                    });
                    dispatch({
                        type: 'SET_BGV_CONFIG_STATUS',
                        servicesConfigured: response.data.servicesEnabled !== undefined,
                        tagMappingConfigured: response.data.tagMappedServices !== undefined,
                        tatMappingConfigured: response.data.tatMappedServices !== undefined,
                        clientSpocConfigured: response.data.clientSpocs !== undefined,
                        betterPlaceSpocConfigured: response.data.betterplaceSpocs !== undefined,
                        statusMgmtConfigured: isStatusMgmtConfigured
                    })
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
                    type: actionTypes.GET_CONFIG_TAG_MAP_LIST_ERROR,
                    error: errMsg
                });
            });
    };
};

//Post ConfigTagMapList Action Dispatch
export const PostConfigTagMapList = (orgId, from, to, TagMapList, viaUrl) => {
    return dispatch => {
        dispatch({
            type: actionTypes.POST_CONFIG_TAG_MAP_LIST_LOADING
        })
        let url = BGV + '/config/'+ orgId;
        if(!_.isEmpty(from) && !_.isEmpty(to)){
            url = `${BGV}/config/from/${from}/to/${to}/share_config`;
        }
        if(!_.isEmpty(viaUrl)){
            url += `?${viaUrl}`;
        }
        axios.post(url, TagMapList)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    
                    dispatch({
                        type: actionTypes.POST_CONFIG_TAG_MAP_LIST_SUCCESS,
                        TagMapList: response.data,
                    });
                }
            })
            .catch(error => {
                let errMsg  = error.message;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }else {
                    errMsg = error.message
                }
                dispatch({
                    type: actionTypes.POST_CONFIG_TAG_MAP_LIST_ERROR,
                    error: errMsg
                });
            });
    };
};


//Edit ConfigTagMapList Action Dispatch
export const PutConfigTagMapList = (orgId, TagMapList) => {
    return dispatch => {
        dispatch({
            type: actionTypes.PUT_CONFIG_TAG_MAP_LIST_LOADING
        })
        let url = BGV + '/config/'+ orgId;
        axios.put(url,TagMapList)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.PUT_CONFIG_TAG_MAP_LIST_SUCCESS,
                        TagMapList: response.data,
                       
                    });
                }
            })
            .catch(error => {
                let errMsg  = error.message;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }else {
                    errMsg = error.message
                }
                dispatch({
                    type: actionTypes.PUT_CONFIG_TAG_MAP_LIST_ERROR,
                    error: errMsg
                });
            });
    };
};
//get tag name Action Dispatch
export const getTagName = (tagIdList, isShared) => {
    return dispatch => {
        dispatch({
            type: actionTypes.POST_TAG_INFO_DATA_LOADING
        })
        let url = CUSTOMER_MGMT + '/tag?';
        if(isShared){
            url = CUSTOMER_MGMT + '/shared/tag?';
        }
        _.forEach(tagIdList, function(tagId, index){
            if(index === tagIdList.length - 1) url = url + `tagId=${tagId}`;
            else url = `${url}tagId=${tagId}&`;
        })
        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.POST_TAG_INFO_DATA_SUCCESS,
                        TagInfoData: response.data,
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
                    type: actionTypes.POST_TAG_INFO_DATA_ERROR,
                    error: errMsg
                });
            });
    };
};

//getEnabledPlatformServices
// export const getEnabledPlatformServices = (orgId) => {
//     return dispatch => {
//         dispatch({
//             type : actionTypes.GET_ENABLED_PLATFORM_SERVICES_LOADING
//         })
//         axios.get(PLATFORM + '/services/'+orgId)
//         .then(response => {
//             if(response.status === 200 || response.status === 201)
//             {
//                 dispatch({
//                     type : actionTypes.GET_ENABLED_PLATFORM_SERVICES_SUCCESS,
//                     enabled : response.data,
//                     _id : response.data._id
//                 })
//             }
//         })
//         .catch(error => {
//             let errMsg  = error;
//                 if(error.response && error.response.data.errorMessage){
//                     errMsg= error.response.data.errorMessage;
//                 }
//             dispatch({
//                 type: actionTypes.GET_ENABLED_PLATFORM_SERVICES_ERROR,
//                 error: errMsg
//             });
//         })
//     }
// }

// export const postEnabledPlatformServices = (data,Id) => {
//     return dispatch => {
//         dispatch({
//             type : actionTypes.POST_ENABLED_PLATFORM_SERVICES_LOADING
//         })
//         axios.post(PLATFORM + '/services/'+Id,data)
//         .then(response => {
//             if(response.status === 200 || response.status === 201)
//             {
//                 dispatch({
//                     type : actionTypes.POST_ENABLED_PLATFORM_SERVICES_SUCCESS,
//                 })
//             }
//         })
//         .catch(error => {
//             let errMsg  = error;
//                 if(error.response.data && error.response.data.errorMessage){
//                     errMsg= error.response.data.errorMessage;
//                 }
//             dispatch({
//                 type: actionTypes.POST_ENABLED_PLATFORM_SERVICES_ERROR,
//                 error: errMsg
//             });
//         })
//     }
// }

// export const putEnabledPlatformServices = (data,Id) => {
//     return dispatch => {
//         dispatch({
//             type : actionTypes.PUT_ENABLED_PLATFORM_SERVICES_LOADING
//         })
//         axios.put(PLATFORM + '/services/'+Id,data)
//         .then(response => {
//             if(response.status === 200 || response.status === 201)
//             {
//                 dispatch({
//                     type : actionTypes.PUT_ENABLED_PLATFORM_SERVICES_SUCCESS
//                 })
//             }
//         })
//         .catch(error => {
//             let errMsg  = error;
//                 if(error.response.data && error.response.data.errorMessage){
//                     errMsg= error.response.data.errorMessage;
//                 }
//             dispatch({
//                 type: actionTypes.PUT_ENABLED_PLATFORM_SERVICES_ERROR,
//                 error: errMsg
//             });
//         })
//     }
// }