import * as actionTypes from './actionTypes';
import axios from 'axios';
import _ from 'lodash';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;
const PLATFORM = process.env.REACT_APP_PLATFORM_API_URL;
const BGV_VERIFICATION = process.env.REACT_APP_BGV_VERIFICATION_URL;
const BGV_CONFIG = process.env.REACT_APP_BGV_CONFIG_URL;

export const getInitState = () => {
    return dispatch => {
        dispatch({
            type : actionTypes.GET_INIT_STATE
        })
    }
}


export const getOrgProfile = (orgId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_ORG_DATA_LOADING
        })
        axios.get(CUST_MGMT+'/org/' + orgId)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_ORG_DATA_SUCCESS,
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
                    type: actionTypes.GET_ORG_DATA_ERROR,
                    error: errMsg
                });
            });
    };
};

export const getOrgConfig = (orgId) => {
    return dispatch => {
        dispatch({
            type : actionTypes.GET_ORG_CONFIG_LOADING
        })
        axios.get(PLATFORM + '/services/'+orgId)
        .then(response => {
            if(response.status === 200 || response.status === 201)
            {
                dispatch({
                    type : actionTypes.GET_ORG_CONFIG_SUCCESS,
                    enabledProducts : response.data.products
                })
            }
        })
        .catch(error => {
            let errMsg  = error;
                if(error.response && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
            dispatch({
                type: actionTypes.GET_ORG_CONFIG_ERROR,
                error: errMsg
            });
        })
    }
}

export const getOrgBgvConfig = (orgId) => {
    return dispatch => {
        dispatch({
            type : actionTypes.GET_ORG_BGV_CONFIG_LOADING
        })
        axios.get(BGV_CONFIG +'/config/' + orgId)
        .then(response => {
            if(response.status === 200 || response.status === 201)
            {
                dispatch({
                    type : actionTypes.GET_ORG_BGV_CONFIG_SUCCESS,
                    bgvConfig : response.data
                })
            }
        })
        .catch(error => {
            let errMsg  = error;
                if(error.response && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
            dispatch({
                type: actionTypes.GET_ORG_BGV_CONFIG_ERROR,
                error: errMsg
            });
        })
    }
}

export const postBgvStatus = (orgId, query) => {
    return dispatch => {
        dispatch({
            type: actionTypes.POST_ORG_BGV_DATA_LOADING
        })
        let url = BGV_VERIFICATION + '/reports/' + orgId;
        if(!_.isEmpty(query)){
            url = url + '?createdFrom=' + query.from + "&createdTo=" + query.to;
        }
        axios.post(url, {})
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.POST_ORG_BGV_DATA_SUCCESS,
                        bgvStatus: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.POST_ORG_BGV_DATA_ERROR,
                    error: errMsg
                });
            });
    };
};

export const getOnboardStats = (orgId, query) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_ORG_ONBOARD_STATS_LOADING
        })
        let url = CUST_MGMT + '/org/' + orgId + '/onboarding-status';
        if (!_.isEmpty(query)){
            _.forEach(query, function(val, param){
                if(_.includes(url, '?')) url = url + '&' + param + '=' + val
                else url = url + '?' + param + '=' + val
            })
        }
        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_ORG_ONBOARD_STATS_SUCCESS,
                        onboardStats: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_ORG_ONBOARD_STATS_ERROR,
                    error: errMsg
                });
            });
    };
};

export const getInsightData = (orgId, category, query) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_ORG_ONBOARD_INSIGHTS_LOADING
        })
        let url = CUST_MGMT + '/org/'+ orgId + '/onboarding-status/'+ category + '/insights';
        if (!_.isEmpty(query)){
            _.forEach(query, function(val, param){
                if(_.includes(url, '?')) url = url + '&' + param + '=' + val
                else url = url + '?' + param + '=' + val
            })
        }
        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_ORG_ONBOARD_INSIGHTS_SUCCESS,
                        onboardInsights: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_ORG_ONBOARD_INSIGHTS_ERROR,
                    error: errMsg
                });
            });
    };
};
