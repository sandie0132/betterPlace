import * as actionTypes from './actionTypes';
import axios from 'axios';
import _ from 'lodash';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

export const getEmpList = (orgId, query) => {
    return dispatch => {
        dispatch({
            type : actionTypes.GET_EMP_STATUS_LIST_LOADING,
        })

        let url = CUST_MGMT+'/org/' + orgId +"/employee?pageSize=" + 18 + query;
        
          
        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_EMP_STATUS_LIST_SUCCESS,
                        empList: response.data,
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_EMP_STATUS_LIST_ERROR,
                    error: errMsg,
                });
            });
    }
}

export const getEmpListPageCount = (orgId, query) => {
    return dispatch => {
        dispatch({
            type : actionTypes.GET_EMP_STATUS_LIST_PAGE_COUNT_LOADING,
        })

        let url = CUST_MGMT+'/org/' + orgId+"/employee?isCount=true" + query;
          
        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_EMP_STATUS_LIST_PAGE_COUNT_SUCCESS,
                        empListPaginationCount: response.data["count"],
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_EMP_STATUS_LIST_PAGE_COUNT_ERROR,
                    error: errMsg,
                });
            });
    }
}

export const getInitState = () => {
    return dispatch => {
        dispatch({
            type : actionTypes.GET_INIT_STATE
        })
    }
}

export const getTagInfo = (tagIdList) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_TAG_INFO_LOADING
        })
        let url = CUST_MGMT + '/tag?';
        _.forEach(tagIdList, function(tagId, index){
            if(index === tagIdList.length - 1) url = url + `tagId=${tagId}`;
            else url = url + 'tagId='+ tagId + '&';
        })
        axios.get(url)
            .then(response => {                
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_TAG_INFO_SUCCESS,
                        tagList: response.data,
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }else {
                    errMsg = error.message
                }
                dispatch({
                    type: actionTypes.GET_TAG_INFO_ERROR,
                    error: errMsg
                });
            });
    };
};