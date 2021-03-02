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

//Post Data Action Dispatch
export const postData = (data) => {
    return dispatch => {
        dispatch({
            type: actionTypes.POST_DATA_LOADING
        })
        axios.post(CUST_MGMT+'/org', data)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.POST_DATA_SUCCESS,
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
                    type: actionTypes.POST_DATA_ERROR,
                    error: errMsg
                });
            });
    };
};


//Edit Data Action Dispatch
export const putData = (data) => {
    const id = data.uuid;
    return dispatch => {
        dispatch({
            type: actionTypes.PUT_DATA_LOADING
        })
        axios.put(CUST_MGMT+'/org/' + id, data)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.PUT_DATA_SUCCESS,
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
                    type: actionTypes.PUT_DATA_ERROR,
                    error: errMsg
                });
            });
    };
};

//Get DataById Action Dispatch
export const getDataById = (orgId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_DATA_LOADING
        })
        axios.get(CUST_MGMT+'/org/' + orgId)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_DATA_SUCCESS,
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
                    type: actionTypes.GET_DATA_ERROR,
                    error: errMsg
                });
            });
    };
};

//Delete Data Action Dispatch
export const deleteData = (orgId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.DELETE_DATA_LOADING
        })
        axios.delete(CUST_MGMT+'/org/' + orgId)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.DELETE_DATA_SUCCESS,
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.DELETE_DATA_ERROR,
                    error: errMsg
                });
            });
    };
};

export const onFilesAdded = (orgId, data) => {

    let config= { headers: {'Content-Type': 'multipart/form-data' }}
    return dispatch => { 
        dispatch({
            type: actionTypes.GET_ORGLOGO_LOADING
        })
    axios.post(CUST_MGMT+'/org/'+orgId+'/file/upload', data,config)
        .then(response => {
            dispatch({
                type: actionTypes.GET_ORGLOGO_SUCCESS,
                logoUrl: response.data.downloadURL
            });
        })
        .catch(error => {
            let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
            dispatch({
                type: actionTypes.GET_ORGLOGO_ERROR,
                error: errMsg
            });
        })
    }
}




