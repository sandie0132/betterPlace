import _ from 'lodash';
import * as actionTypes from './actionTypes';
import axios from 'axios';
import * as initData from './StaticDataInitData'

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;
const PLATFORM_SERVICES = process.env.REACT_APP_PLATFORM_API_URL;
const BGV_CONFIG = process.env.REACT_APP_BGV_CONFIG_URL
//Init State Action Dispatch
export const initState = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.INIT_STATE
        })
    };
};

//Get StaticDataList Action Dispatch
export const getStaticDataList = () => {
    const data = initData.data;
    let empMgmtStaticData = { ...initData.empMgmtStaticData };
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_DATA_LIST_LOADING
        })
        axios.post(PLATFORM_SERVICES + `/staticdata`, data)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    _.forEach(response.data, function (object) {
                        _.forEach(object, function (value, key) {
                            empMgmtStaticData[key] = value;
                        })
                    })
                    dispatch({
                        type: actionTypes.GET_DATA_LIST_SUCCESS,
                        staticData: empMgmtStaticData
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_DATA_LIST_ERROR,
                    error: errMsg
                });
            });
    };
};


//Get Org Details Action Dispatch
export const getOrgDetails = (orgId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_ORG_DATA_LOADING
        })
        axios.get(CUST_MGMT + '/org/' + orgId)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch(getOrgServicesConfigured(orgId));
                    dispatch({
                        type: actionTypes.GET_ORG_DATA_SUCCESS,
                        orgData: response.data,
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response && error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_ORG_DATA_ERROR,
                    error: errMsg
                });
            });
    };
};

// Get Org Services Config Action Dispatch
export const getOrgServicesConfigured = (orgId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_SERVICES_ENABLED_LOADING
        })
        axios.get(PLATFORM_SERVICES + '/services/' + orgId)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    
                    dispatch({
                        type: actionTypes.GET_SERVICES_ENABLED_SUCCESS,
                        servicesEnabled: response.data,
                    })
                    _.forEach(response.data.products, (prod) => {
                        if (prod.product === "BGV") {
                            dispatch(getBGVConfig(orgId));
                        }
                    })
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_SERVICES_ENABLED_ERROR,
                    error: errMsg
                });
            })
    }
}

// Get Org Onboard Config Action Dispatch
export const getOnboardConfig = (orgId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_ORG_ONBOARD_CONFIG_LOADING
        })
        axios.get(CUST_MGMT + `/onboard/config/${orgId}`)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_ORG_ONBOARD_CONFIG_SUCCESS,
                        orgOnboardConfig: response.data
                    });
                }
            })
            .catch(error => {
                dispatch({
                    type: actionTypes.GET_ORG_ONBOARD_CONFIG_ERROR,
                    error: error
                });
            });
    };
}

// Get Org BGV Config Action Dispatch
export const getBGVConfig = (orgId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_ORG_BGV_CONFIG_LOADING
        })
        axios.get(BGV_CONFIG + `/config/${orgId}`)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_ORG_BGV_CONFIG_SUCCESS,
                        bgvConfigData: response.data
                    });
                    
                }
            })
            .catch(error => {
                dispatch({
                    type: actionTypes.GET_ORG_BGV_CONFIG_ERROR,
                    error: error
                });
            });
    };
}