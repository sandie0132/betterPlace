import * as actionTypes from './actionTypes';
import axios from 'axios';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;
const PLATFORM = process.env.REACT_APP_PLATFORM_API_URL;
const BGV_CONFIG = process.env.REACT_APP_BGV_CONFIG_URL;

export const initState = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.INIT_STATE
        })
    };
};

export const getDataById = (orgId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_DATA_LOADING
        })
        axios.get(CUST_MGMT+'/org/' + orgId)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_DATA_SUCCESS,
                        data: response.data,
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_DATA_ERROR,
                    error: errMsg
                });
            });
    };
};

export const onFilesAdded = (orgId, data) => {

    let config= { headers: {'Content-Type': 'multipart/form-data' }}
    return dispatch => { 
        dispatch({
            type: actionTypes.GET_ORGLOGO_LOADING
        })
    axios.post(CUST_MGMT+'/org/'+orgId+'/file/upload', data,config)
        .then(response => {

            dispatch({
                type: actionTypes.GET_ORGLOGO_SUCCESS,
                logoUrl: response.data.downloadURL
            });
        })
        .catch(error => {
            let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
            dispatch({
                type: actionTypes.GET_ORGLOGO_ERROR,
                error: errMsg
            });
        })
    }
}

export const getAllPlatformServices = () => {
    return dispatch => {
        dispatch({
            type : actionTypes.GET_ALL_PLATFORM_SERVICES_LOADING
        })
        axios.get(PLATFORM + '/services')
        .then(response => {
            if(response.status === 200 || response.status === 201)
            {
                dispatch({
                    type : actionTypes.GET_ALL_PLATFORM_SERVICES_SUCCESS,
                    platformData: response.data,
                    platformServices : response.data[0].services,
                    platformProducts : response.data[0].products,
                    platformPlatformServices : response.data[0].platformServices,
                })
            }
        })
        .catch(error => {
            let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
            dispatch({
                type: actionTypes.GET_ALL_PLATFORM_SERVICES_ERROR,
                error: errMsg
            });
        })
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
                    enabledServices : response.data.services,
                    enabledProducts : response.data.products,
                    enabledPlatformServices : response.data.platformServices,
                    _id : response.data._id,
                    enabledData: response.data,
                    enabledPlatformService: response.data.platformServices,
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

export const postEnabledPlatformServices = (data, Id) => {
    return dispatch => {
        dispatch({
            type: actionTypes.POST_ENABLED_PLATFORM_SERVICES_LOADING
        })
        axios.post(PLATFORM + '/services/' + Id, data)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.POST_ENABLED_PLATFORM_SERVICES_SUCCESS,
                        enabledData: response.data
                    })
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.POST_ENABLED_PLATFORM_SERVICES_ERROR,
                    error: errMsg
                });
            })
    }
}

export const putEnabledPlatformServices = (data, orgId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.PUT_ENABLED_PLATFORM_SERVICES_LOADING
        })
        axios.put(PLATFORM + '/services/' + orgId, data)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.PUT_ENABLED_PLATFORM_SERVICES_SUCCESS,
                    })
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.PUT_ENABLED_PLATFORM_SERVICES_ERROR,
                    error: errMsg
                });
            })
    }
}

export const deleteBgvConfig = (orgId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.DELETE_BGV_CONFIG_LOADING
        })
        axios.delete(BGV_CONFIG + '/config/' + orgId)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.DELETE_BGV_CONFIG_SUCCESS,
                    })
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.DELETE_BGV_CONFIG_ERROR,
                    error: errMsg
                });
            })
    }
}

export const deleteOpsConfig = (orgId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.DELETE_OPS_CONFIG_LOADING
        })
        axios.delete(BGV_CONFIG + '/opsconfig/' + orgId)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.DELETE_OPS_CONFIG_SUCCESS,
                    })
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.DELETE_OPS_CONFIG_ERROR,
                    error: errMsg
                });
            })
    }
}

export const getSelectedOpsData = (orgId) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_OPS_SELECTED_SERVICE_DATA_LOADING
        })
        let url = BGV_CONFIG +'/opsconfig/' + orgId;
        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_OPS_SELECTED_SERVICE_DATA_SUCCESS,
                        data: response.data,
                    });
                    // dispatch({
                    //     type: 'SET_OPS_CONFIG_STATUS',
                    //     servicesConfigured: response.data.servicesEnabled !== undefined,
                    //     tatMappingConfigured: response.data.tatMappedServices !== undefined,
                    //     priceMappingConfigured: response.data.priceMappedServices !== undefined,
                    // })
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_OPS_SELECTED_SERVICE_DATA_ERROR,
                    error: errMsg
                });
            });
    };
};

export const getSelectedBGVData = (orgId) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_BGV_SELECTED_SERVICE_DATA_LOADING
        })
        let url = BGV_CONFIG +'/config/' + orgId;
        axios.get(url)
            .then(response => {
                // let checkLevelRules=null, sectionLevelRules=null, profileLevelRules=null;
                // if(!_.isEmpty(response.data.statusManagement)){
                //     if(!_.isEmpty(response.data.statusManagement.checkLevelRules)){
                //         checkLevelRules= response.data.statusManagement.checkLevelRules;
                //     }

                //     if(!_.isEmpty(response.data.statusManagement.sectionLevelRules)){
                //         sectionLevelRules= response.data.statusManagement.sectionLevelRules;
                //     }

                //     if(!_.isEmpty(response.data.statusManagement.profileLevelRules)){
                //         profileLevelRules= response.data.statusManagement.profileLevelRules;
                //     }
                // }

                // let isStatusMgmtConfigured = (!_.isEmpty(checkLevelRules)) &&
                //                             (!_.isEmpty(sectionLevelRules)) && 
                //                             (!_.isEmpty(profileLevelRules))
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_BGV_SELECTED_SERVICE_DATA_SUCCESS,
                        data: response.data,
                        Id : response.data._id
                    });
                    // dispatch({
                    //     type: 'SET_BGV_CONFIG_STATUS',
                    //     servicesConfigured: response.data.servicesEnabled !== undefined,
                    //     tagMappingConfigured: response.data.tagMappedServices !== undefined,
                    //     tatMappingConfigured: response.data.tatMappedServices !== undefined,
                    //     clientSpocConfigured: response.data.clientSpocs !== undefined,
                    //     betterPlaceSpocConfigured: response.data.betterplaceSpocs !== undefined,
                    //     statusMgmtConfigured: isStatusMgmtConfigured
                    // })
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }else {
                    errMsg = error.message
                }
                dispatch({
                    type: actionTypes.GET_BGV_SELECTED_SERVICE_DATA_ERROR,
                    error: errMsg
                });
            });
    };
};

export const getNotification = (orgId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_CLIENT_NOTIFICATION_LOADING,
            orgId: orgId
        })
        axios.get(PLATFORM + `/notifications/${orgId}?name=VENDOR_CLIENT_REQUEST_APPROVAL`)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_CLIENT_NOTIFICATION_SUCCESS,
                        notificationData: response.data,
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_CLIENT_NOTIFICATION_ERROR,
                    error: errMsg
                });
            });
    };
};