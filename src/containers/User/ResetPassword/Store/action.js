import * as actionTypes from './actionTypes';
import axios from 'axios';

const IDENTITY = process.env.REACT_APP_IDENTITY_URL;

//post login data
export const postData = (data) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.RESET_PASSWORD_LOADING
        })
        let apiUrl = IDENTITY+'/resetpassword';
        axios.post(apiUrl,data)
        
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.RESET_PASSWORD_SUCCESS,
                        responseData: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response && error.response.data.errorMessage){
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.RESET_PASSWORD_ERROR,
                    error: errMsg
                });
            });
    };
}