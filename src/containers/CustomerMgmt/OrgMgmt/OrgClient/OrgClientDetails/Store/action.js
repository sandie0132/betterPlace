import * as actionTypes from './actionTypes';
import axios from 'axios';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

export const initState = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.INIT_STATE
        })
    };
};

export const clientData = (clientId, orgId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_CLIENT_DATA_LOADING
        })
        let url = CUST_MGMT+'/client/'+clientId;

        if(orgId) {
            url += "?vendorId="+ orgId;
        }

        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_CLIENT_DATA_SUCCESS,
                        clientData: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_CLIENT_DATA_ERROR,
                    error: errMsg
                });
            });
    };
};

export const getOrgName = (orgId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_ORG_NAME_LOADING
        })
        axios.get(CUST_MGMT+'/org/' + orgId)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_ORG_NAME_SUCCESS,
                        orgName: response.data,
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_ORG_NAME_ERROR,
                    error: errMsg
                });
            });
    };
};