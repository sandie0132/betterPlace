import * as actionTypes from './actionTypes';
import axios from 'axios';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

//Init State Action Dispatch
export const initState = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.INIT_STATE
        })
    };
};

//Get DataList Action Dispatch
export const getDataList = (orgId) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_DATA_LIST_LOADING
        })
        axios.get(CUST_MGMT + `/org/${orgId}/contactperson`)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_DATA_LIST_SUCCESS,
                        dataList: response.data,
                        currentDataId: null
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_DATA_LIST_ERROR,
                    error: errMsg
                });
            });
    };
};

//Post Data Action Dispatch
export const postData = (orgId, data) => {
    return (dispatch, getState) => {
        dispatch({
            type: actionTypes.POST_DATA_LOADING
        })
        axios.post(CUST_MGMT + `/org/${orgId}/contactperson`, data)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    const newData = response.data;
                    let updatedDataList = [newData,
                        ...getState().orgMgmt.orgContact.dataList,
                    ]
                    dispatch({
                        type: actionTypes.POST_DATA_SUCCESS,
                        dataList: updatedDataList,
                        currentDataId: response.data.uuid
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.POST_DATA_ERROR,
                    error: errMsg
                })
            });
    };
};

//Put Data Action Dispatch
export const putData = (orgId, dataId, data) => {
    return (dispatch, getState) => {
        dispatch({
            type: actionTypes.PUT_DATA_LOADING
        })
        axios.put(CUST_MGMT + `/org/${orgId}/contactperson/${dataId}`, data)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    let updatedDataList = getState().orgMgmt.orgContact.dataList;
                    updatedDataList = updatedDataList.map((Item) => {
                        if (Item.uuid === dataId) {
                            return (response.data);
                        }
                        return (Item);
                    });
                    dispatch({
                        type: actionTypes.PUT_DATA_SUCCESS,
                        dataList: updatedDataList,
                        currentDataId: response.data.uuid
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.PUT_DATA_ERROR,
                    error: errMsg
                })
            });
    };
};

//Delete Data Action Dispatch
export const deleteData = (orgId, dataId) => {
    return (dispatch, getState) => {
        dispatch({
            type: actionTypes.DELETE_DATA_LOADING
        })
        axios.delete(CUST_MGMT + `/org/${orgId}/contactperson/${dataId}`)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    let updatedDataList = getState().orgMgmt.orgContact.dataList;
                    updatedDataList = updatedDataList.filter((Item) => {
                        if (Item.uuid === dataId) return null;
                        else return Item;
                    });
                    dispatch({
                        type: actionTypes.DELETE_DATA_SUCCESS,
                        dataList: updatedDataList,
                        currentDataId: null
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.DELETE_DATA_ERROR,
                    error: errMsg,
                    currentDataId: dataId
                })
            });
    };
};