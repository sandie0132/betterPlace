import * as actionTypes from './actionTypes';
import axios from 'axios';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

export const getInitState = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_INIT_STATE
        })
    };
}

export const searchEmployee = (orgId, inputString) => {
    return dispatch => {
        dispatch({
            type: actionTypes.SEARCH_EMPLOYEE_LOADING
        })
        let url = CUST_MGMT + '/org/' + orgId + '/employee/search?key=' + inputString;
        axios.get(url)
            .then(response => {
                dispatch({
                    type: actionTypes.SEARCH_EMPLOYEE_SUCCESS,
                    data: response.data
                })
            })
            .catch(error => {
                dispatch({
                    type: actionTypes.SEARCH_EMPLOYEE_ERROR,
                    error: error
                })
            })
    }
}