import axios from 'axios';
import * as actionTypes from './actionTypes';


const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;


//Init State Action Dispatch
export const initState = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.INIT_STATE
        })
    };
};


export const documentProcess = (orgId, documentType, payload) => {
    return dispatch => {

        dispatch({
            type: actionTypes.DOCUMENT_PROCESS_LOADING,
        });

        axios.post(CUST_MGMT + "/onboard/config/" + orgId + "/process/" + documentType, payload)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.DOCUMENT_PROCESS_SUCCESS,
                    });

                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                } else {
                    errMsg = error.message
                }
                dispatch({
                    type: actionTypes.DOCUMENT_PROCESS_ERROR,
                    error: errMsg
                });
            });

    }
};
