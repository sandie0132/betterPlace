import * as actionTypes from './actionTypes';
import axios from 'axios';
import _ from 'lodash';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

export const orgSetId = (idValue, idState, idImage) => {
    return dispatch => {
        dispatch({
            type: actionTypes.ORG_SET_ID_DATA,
            cardtype:idState,
            idNo:idValue,
            idImage:idImage,
            showModal:true
        })
    };
}

export const orgResetId = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.ORG_RESET_ID_DATA
        })
    };
}

export const initState = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_INIT_STATE
        })
    };
}

export const orgDuplicateCheck = (docNumber) => {
    return (dispatch)=>{
        dispatch({
            type: actionTypes.ORG_CHECK_LOADING
        })

        let url = CUST_MGMT + '/org/search?docNumber=' + docNumber;
        axios.get(url)
        .then(response=>{
            const searchData = response.data;
            let dataToBeReturned = null;
            if(!_.isEmpty(searchData)){
                dataToBeReturned = searchData[0];
            }
            dispatch({
                type: actionTypes.ORG_CHECK_SUCCESS,
                OrgData: dataToBeReturned
            })
        })
        .catch(error=>{
            dispatch({
                type: actionTypes.ORG_CHECK_ERROR,
                error: error
            })
        })
    }
}