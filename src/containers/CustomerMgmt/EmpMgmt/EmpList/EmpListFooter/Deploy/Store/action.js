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

export const getClientList = (orgId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_CLIENT_LIST_LOADING
        })
        axios.get(CUST_MGMT+'/org/'+orgId+'/client')
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_CLIENT_LIST_SUCCESS,
                        clientList: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_CLIENT_LIST_ERROR,
                    error: errMsg
                });
            });
    };
};

//Post deploy employee
export const postDeployEmp = (orgId, data, clientId) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.POST_DEPLOY_EMP_LOADING
        })
        axios.post(CUST_MGMT+`/org/${orgId}/client/${clientId}/deploy`, data)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.POST_DEPLOY_EMP_SUCCESS,
                        clientData: data
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.POST_DEPLOY_EMP_ERROR,
                    error: errMsg
                });
            });
    };
};