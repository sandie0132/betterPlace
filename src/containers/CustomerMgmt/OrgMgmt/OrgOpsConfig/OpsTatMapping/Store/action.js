import * as actionTypes from './actionTypes';
import axios from 'axios';

const BGV = process.env.REACT_APP_BGV_CONFIG_URL;
const PLATFORM = process.env.REACT_APP_PLATFORM_API_URL;

export const getServiceData = (orgId) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_SERVICE_DATA_LOADING
        })
        let url = BGV +'/opsconfig/' + orgId;
        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_SERVICE_DATA_SUCCESS,
                        data: response.data,
                        id : response.data._id
                    });
                    dispatch({
                        type: 'SET_OPS_CONFIG_STATUS',
                        servicesConfigured: response.data.servicesEnabled !== undefined,
                        tatMappingConfigured: response.data.tatMappedServices !== undefined,
                        priceMappingConfigured: response.data.priceMappedServices !== undefined,
                    })
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_SERVICE_DATA_ERROR,
                    error: errMsg
                });
            });
    };
};

export const postTatData = (data, orgId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.POST_TAT_DATA_LOADING
        })
        let url = BGV +'/opsconfig/' + orgId;
        axios.post(url,data)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.POST_TAT_DATA_SUCCESS,
                        data: response.data,
                        id : response.data._id
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.POST_TAT_DATA_ERROR,
                    error: errMsg
                })
            });
    };
};

export const getInitState = () => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_INIT_STATE
        })
    }
}

//getEnabledPlatformServices
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
                    enabled : response.data,
                    _id : response.data._id
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

export const postEnabledPlatformServices = (data,Id) => {
    return dispatch => {
        dispatch({
            type : actionTypes.POST_ENABLED_PLATFORM_SERVICES_LOADING
        })
        axios.post(PLATFORM + '/services/'+Id,data)
        .then(response => {
            if(response.status === 200 || response.status === 201)
            {
                dispatch({
                    type : actionTypes.POST_ENABLED_PLATFORM_SERVICES_SUCCESS,
                })
            }
        })
        .catch(error => {
            let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
            dispatch({
                type: actionTypes.POST_ENABLED_PLATFORM_SERVICES_ERROR,
                error: errMsg
            });
        })
    }
}

export const putEnabledPlatformServices = (data,Id) => {
    return dispatch => {
        dispatch({
            type : actionTypes.PUT_ENABLED_PLATFORM_SERVICES_LOADING
        })
        axios.put(PLATFORM + '/services/'+Id,data)
        .then(response => {
            if(response.status === 200 || response.status === 201)
            {
                dispatch({
                    type : actionTypes.PUT_ENABLED_PLATFORM_SERVICES_SUCCESS
                })
            }
        })
        .catch(error => {
            let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
            dispatch({
                type: actionTypes.PUT_ENABLED_PLATFORM_SERVICES_ERROR,
                error: errMsg
            });
        })
    }
}