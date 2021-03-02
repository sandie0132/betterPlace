import * as actionTypes from './actionTypes';
import axios from 'axios';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

export const getVendorTags = (orgId, vendorId, category) => {
    return dispatch => {
        dispatch ({
            type: actionTypes.GET_VENDOR_TAGS_LOADING
        })

        //let url = CUST_MGMT + '/vendor/'+ orgId + '/tag'  ;
        let url = CUST_MGMT + '/vendor/' + vendorId + '/tag?category=' + category +'&orgId=' + orgId ;
       
        axios.get(url)
        .then(response => {
            dispatch({
                type: actionTypes.GET_VENDOR_TAGS_SUCCESS,
                vendorTags: response.data
            })
        })
        .catch(error=>{
            dispatch({
                type: actionTypes.GET_VENDOR_TAGS_ERROR,
                error: error
            })
        })
    }
}

export const getOrgNameById = (orgId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_ORG_NAME_LOADING
        })
        axios.get(CUST_MGMT+'/org/' + orgId)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_ORG_NAME_SUCCESS,
                        orgName: response.data,
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_ORG_NAME_ERROR,
                    error: errMsg
                });
            });
    };
};

export const getVendorData = (clientId, vendorId) => {
    return (dispatch) => {
        dispatch({
        type: actionTypes.GET_VENDOR_DATA_LOADING
    })
    let url = CUST_MGMT + '/vendor/'+ clientId;
    if(clientId){
        url += '?clientId='+vendorId;
    }
    axios.get(url)
        .then(response => {
            if (response.status === 200 || response.status === 201) {
                dispatch({
                    type: actionTypes.GET_VENDOR_DATA_SUCCESS,
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
                type: actionTypes.GET_VENDOR_DATA_ERROR,
                error: errMsg
            });
        });
    };
}