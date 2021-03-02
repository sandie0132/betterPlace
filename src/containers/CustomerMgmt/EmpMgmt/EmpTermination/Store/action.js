import * as actionTypes from './actionTypes';
import axios from 'axios';
import _ from 'lodash';

import {getNotificationList} from '../../../Notifications/Store/action';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;
const PLATFORM_URL = process.env.REACT_APP_PLATFORM_API_URL;

export const terminateEntity = (orgId, data)=>{
    let selectedEmp = data.entityList.length;
    return (dispatch)=>{
        dispatch({
            type: actionTypes.ENTITY_TERMINATE_LOADING
        })

        let url = CUST_MGMT + '/org/' + orgId + '/employee/terminate' 
        axios.put(url, data)
            .then(response => {
                dispatch({
                    type: actionTypes.ENTITY_TERMINATE_SUCCESS,
                    data: response.data,
                    selectedEmp: selectedEmp
                })
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response && error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.ENTITY_TERMINATE_ERROR,
                    error: errMsg
                });
            });
    }
}

export const bulkTerminateEntity = (orgId, targetUrl, selectAll, data)=>{
    let selectedEmp = data.empIds.length;
    let payload = {
        "product": "ONBOARD",
        "data": data
    }
    let url = PLATFORM_URL+`/org/${orgId}/employee/bulk-actions?${targetUrl}&action=EMPLOYEE_TERMINATE&reqType=PROCESS_DATA`;
    if(_.isEmpty(targetUrl)){
        url = PLATFORM_URL+`/org/${orgId}/employee/bulk-actions?action=EMPLOYEE_TERMINATE&reqType=PROCESS_DATA`;
    }
    if(selectAll === true){
        // url = url + "&selectAll=true";
        payload["data"]["empIds"] = []
    }
    return (dispatch)=>{
        dispatch({
            type: actionTypes.ENTITY_TERMINATE_LOADING
        })
        axios.post(url, payload)
            .then(response => {
                dispatch({
                    type: actionTypes.ENTITY_TERMINATE_SUCCESS,
                    data: response.data,
                    selectedEmp: selectedEmp
                })
                dispatch(getNotificationList(orgId));
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response && error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.ENTITY_TERMINATE_ERROR,
                    error: errMsg
                });
            });
    }
}

export const saveEntityData = (data) =>{
    return (dispatch)=>{
        dispatch({ 
            type: actionTypes.SAVE_ENTITY_DATA,
            data: data
        })
    }
}

export const entityDataReset = () =>{
    return (dispatch) =>{
        dispatch({
            type: actionTypes.GET_TERMINATE_INIT_STATE
        })
    }
}