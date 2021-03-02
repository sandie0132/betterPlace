import * as actionTypes from './actionTypes';
import axios from 'axios';

const BGV_OTHER_VERIFICATION = process.env.REACT_APP_BGV_OTHER_VERIFICATION_URL;


export const refIdValidity = (refId,type) => {
    return dispatch => {
        dispatch({
            type: actionTypes.REFID_VALIDATE_LOADING
        })
        axios.get(BGV_OTHER_VERIFICATION+"/"+type+'/validateRequest?refId='+refId)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.REFID_VALIDATE_SUCCESS,
                        data: response.data,
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.REFID_VALIDATE_ERROR,
                    error: errMsg
                });
            });
    };
};

export const getRefIdDetails = (refId,type) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_REFID_DETAILS_LOADING
        })
        axios.get(BGV_OTHER_VERIFICATION+ '/verifications/'+type+'/details/'+refId)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                   
                    dispatch({
                        type: actionTypes.GET_REFID_DETAILS_SUCCESS,
                        data: response.data,
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_REFID_DETAILS_ERROR,
                    error: errMsg
                });
            });
    };
};

export const putRefIdDetails = (refId,type,submitData) => {
    return dispatch => {
        dispatch({
            type: actionTypes.PUT_REFID_DETAILS_LOADING
        })
        axios.put(BGV_OTHER_VERIFICATION+ '/verifications/'+type+'/'+refId, submitData)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.PUT_REFID_DETAILS_SUCCESS,
                        
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.PUT_REFID_DETAILS_ERROR,
                    error: errMsg
                });
            });
    };
};


// export const getTagName = (tagId) => {
//     return dispatch => {
//         dispatch({
//             type: actionTypes.GET_TAG_NAME_LOADING
//         })

//         let url = CUST_MGMT + '/tag?';
//         _.forEach(tagId, function (id, index) {
//             if (index === tagId.length - 1) url = url + `tagId=${id}`;
//             else url = url + 'tagId=' + id + '&';
//         })

//         axios.get(url)
//             .then(response => {
//                 if (response.status === 200 || response.status === 201) {
//                     dispatch({
//                         type: actionTypes.GET_TAG_NAME_SUCCESS,
//                         tagData: response.data
//                     });
//                 }
//             })
//             .catch(error => {
//                 let errMsg = error;
//                 if (error.response.data && error.response.data.errorMessage) {
//                     errMsg = error.response.data.errorMessage;
//                 } else {
//                     errMsg = error.message
//                 }
//                 dispatch({
//                     type: actionTypes.GET_TAG_NAME_ERROR,
//                     error: errMsg
//                 });
//             });
//     };
// };