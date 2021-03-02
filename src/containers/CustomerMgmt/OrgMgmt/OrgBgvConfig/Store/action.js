import * as actionTypes from './actionTypes';
import axios from 'axios';

const BGV = process.env.REACT_APP_BGV_CONFIG_URL;

//Init State Action Dispatch
export const initState = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.INIT_STATE
        })
    };
};

//Get Services Action Dispatch
export const getServices = () => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_ALL_SERVICES_DATA_LOADING
        })
        let url = BGV +'/services';

        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_ALL_SERVICES_DATA_SUCCESS,
                        servicesData: response.data[0].services
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }else {
                    errMsg = error.message
                }
                dispatch({
                    type: actionTypes.GET_ALL_SERVICES_DATA_ERROR,
                    error: errMsg
                });
            });
    };
};