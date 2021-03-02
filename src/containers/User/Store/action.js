import * as actionTypes from './actionTypes';
import axios from 'axios';

//post login data
const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

export const getUserDetails = () => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_USER_PROFILE_LOADING
        })
        let apiUrl = CUST_MGMT+'/user';
        axios.get(apiUrl)

            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_USER_PROFILE_SUCCESS,
                        userProfile: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_USER_PROFILE_ERROR,
                    error: errMsg
                });
            });
    };
}