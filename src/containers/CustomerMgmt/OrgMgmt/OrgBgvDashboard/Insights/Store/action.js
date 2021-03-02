import * as actionTypes from './actionTypes';
import axios from 'axios';

const BGV_CONFIG = process.env.REACT_APP_BGV_CONFIG_URL;
const BGV_VERIFICATION = process.env.REACT_APP_BGV_VERIFICATION_URL;

//Init State Action Dispatch
export const initState = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.INIT_STATE
        })
    };
};

export const getServicesConfigured = (orgId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_SERVICES_LOADING
        })
        axios.get(BGV_CONFIG + '/config/' + orgId)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_SERVICES_SUCCESS,
                        services: response.data,
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_SERVICES_ERROR,
                    error: errMsg
                });
            });
    };
};

export const postBgvStatus = (orgId, tagId) => {

    return dispatch => {
        dispatch({
            type: actionTypes.POST_BGV_STATUS_LOADING
        })
        let url;
        if (tagId){
            url = BGV_VERIFICATION + '/reports/' + orgId + '?tagId=' + tagId
        }
        else url = BGV_VERIFICATION + '/reports/' + orgId
        axios.post(url, {})
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.POST_BGV_STATUS_SUCCESS,
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
                    type: actionTypes.POST_BGV_STATUS_ERROR,
                    error: errMsg
                });
            });
    };
};

export const getCustomBgvStatus = (orgId, tagId, duration) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_CUSTOM_BGV_STATUS_LOADING
        })
        let url;
        if (duration && !tagId) {
            url = BGV_VERIFICATION + '/custom/reports/' + orgId + '?from=' + duration.dateFrom + "&to=" + duration.dateTo;
        }
        
        else if (tagId && duration) {
            url = BGV_VERIFICATION + '/custom/reports/' + orgId + '?tagId=' + tagId + "&from=" + duration.dateFrom + "&to=" + duration.dateTo;
        }
        // else url = BGV_VERIFICATION + '/reports/' + orgId
        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_CUSTOM_BGV_STATUS_SUCCESS,
                        customBgvStatus: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_CUSTOM_BGV_STATUS_ERROR,
                    error: errMsg
                });
            });
    };
};