import axios from 'axios';

import * as actionTypes from './actionTypes';
import * as AuthConst from '../helpers/AuthConstants';

//Init AuthState Action Dispatch
export const initAuth = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.INIT_AUTH
        })
    };
};

//Get UserInfo Action Dispatch
export const getUserInfo = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_USER_INFO_LOADING
        })
        axios.get(`${AuthConst.identity}/user/info`)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_USER_INFO_SUCCESS,
                        user: response.data.user,
                        policies: response.data.policies
                    });
                }
            })
            .catch(error => {
                dispatch({
                    type: actionTypes.GET_USER_INFO_ERROR,
                    error: error
                });
            });
    };
};

//Logout Action Dispatch
export const logout = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.LOGOUT_LOADING
        })
        axios.get(`${AuthConst.identity}/logout`)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.LOGOUT_SUCCESS
                    });
                }
            })
            .catch(error => {
                dispatch({
                    type: actionTypes.LOGOUT_ERROR,
                    error: error
                });
            });
    };
};