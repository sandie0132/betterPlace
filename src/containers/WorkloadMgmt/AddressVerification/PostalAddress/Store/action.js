// import * as initData from '../PhysicalAddressInitData';
import * as actionTypes from './actionTypes';
import axios from 'axios';
// import _ from 'lodash';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;
// const PLATFORM_SERVICES = process.env.REACT_APP_PLATFORM_API_URL;
const BGV_ADDRESS = process.env.REACT_APP_BGV_ADDRESS_VERIFICATION;
const WORKLOAD_MGMT = process.env.REACT_APP_WORKLOAD_MGMT_URL;

export const initState = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.INIT_STATE
        })
    };
};

export const sendNotificationData = (color, name) => {
    return dispatch => {
        dispatch({ 
            type: actionTypes.GET_INDIVIDUAL_TASK_NOTIFICATION,
            color: color,
            name: name
        })
    }
}

// export const sendNotificationData = (color, name) => {
//     return dispatch => {
//         dispatch({
//             type: actionTypes.GET_INDIVIDUAL_TASK_NOTIFICATION,
//             color: color,
//             name: name
//         })
//     }
// }

// export const getIndividualTask = (serviceRequestId) => {
//     return dispatch => {
//         dispatch({
//             type: actionTypes.GET_INDIVIDUAL_TASK_LOADING
//         })
//         let url = BGV_ADDRESS + `/agencydashboard/task/details/${serviceRequestId}?service=PHYSICAL_ADDRESS`;
//         axios.get(url)
//             .then(response => {
//                 if (response.status === 200 || response.status === 201) {
//                     dispatch({
//                         type: actionTypes.GET_INDIVIDUAL_TASK_SUCCESS,
//                         phyAddress: response.data
//                     })
//                 }
//             })
//             .catch(error => {
//                 let errMsg = error;
//                 if (error.response && error.response.data.errorMessage) {
//                     errMsg = error.response.data.errorMessage;
//                 }
//                 dispatch({
//                     type: actionTypes.GET_INDIVIDUAL_TASK_ERROR,
//                     error: errMsg
//                 });
//             })
//     }
// }

export const getTagName = (tagId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_TAG_NAME_LOADING
        })

        let url = CUST_MGMT + `/tag?tagId=${tagId}`;

        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_TAG_NAME_SUCCESS,
                        tagData: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                } else {
                    errMsg = error.message
                }
                dispatch({
                    type: actionTypes.GET_TAG_NAME_ERROR,
                    error: errMsg
                });
            });
    };
};

// export const postAgencyPhysicalAddress = (payload, serviceRequestId) => {
//     return dispatch => {
//         dispatch({
//             type: actionTypes.POST_INDIVIDUAL_TASK_LOADING
//         })
//         let url = BGV_ADDRESS + `/agencydashboard/task/close/${serviceRequestId}`;
//         axios.post(url, payload)
//             .then(response => {
//                 if (response.status === 200 || response.status === 201) {
//                     dispatch({
//                         type: actionTypes.POST_INDIVIDUAL_TASK_SUCCESS,
//                         phyAddress: response.data
//                     })
//                 }
//             })
//             .catch(error => {
//                 let errMsg = error;
//                 if (error.response && error.response.data.errorMessage) {
//                     errMsg = error.response.data.errorMessage;
//                 }
//                 dispatch({
//                     type: actionTypes.POST_INDIVIDUAL_TASK_ERROR,
//                     error: errMsg
//                 });
//             })
//     }
// }

// export const getTaskClosureStaticData = () => {
//     const data = initData.data;
//     let taskClosureStaticData = {};

//     return (dispatch) => {
//         dispatch({
//             type: actionTypes.GET_TASK_CLOSURE_STATIC_DATA_LOADING
//         })
//         axios.post(PLATFORM_SERVICES + `/staticdata`, data)
//             .then(response => {
//                 if (response.status === 200 || response.status === 201) {
//                     _.forEach(response.data, function (object) {
//                         _.forEach(object, function (value, key) {
//                             taskClosureStaticData[key] = value;
//                         })
//                     })
//                     dispatch({
//                         type: actionTypes.GET_TASK_CLOSURE_STATIC_DATA_SUCCESS,
//                         staticData: taskClosureStaticData
//                     });
//                 }
//             })
//             .catch(error => {
//                 let errMsg = error;
//                 if (error.response.data && error.response.data.errorMessage) {
//                     errMsg = error.response.data.errorMessage;
//                 }
//                 dispatch({
//                     type: actionTypes.GET_TASK_CLOSURE_STATIC_DATA_ERROR,
//                     error: errMsg
//                 });
//             });
//     };
// };

export const getPostalTaskDetails = (serviceRequestId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_POSTAL_TASK_DETAILS_LOADING
        })

        let url = BGV_ADDRESS + `/postal/task/details/` + serviceRequestId;
        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_POSTAL_TASK_DETAILS_SUCCESS,
                        taskDetails: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                } else {
                    errMsg = error.message
                }
                dispatch({
                    type: actionTypes.GET_POSTAL_TASK_DETAILS_ERROR,
                    error: errMsg
                });
            });
    };
};

export const onPostPostalTasks = (data, service, requestId) => {
    let url = WORKLOAD_MGMT + "/task/complete/" + service + "/" + requestId;
    return dispatch => {
        dispatch({
            type: actionTypes.POST_POSTAL_TASK_DETAILS_LOADING
        })
        axios.post(url,data)
        .then(response => {
            if(response.status === 200 || response.status === 201)
            {
                dispatch({
                    type: actionTypes.POST_POSTAL_TASK_DETAILS_SUCCESS,
                })
            }
        })
        .catch(error => {
            let errMsg  = error;
            if(error.response && error.response.data.errorMessage){
                errMsg= error.response.data.errorMessage;
            }
            dispatch({
                type: actionTypes.POST_POSTAL_TASK_DETAILS_ERROR,
                error: errMsg
            });
        });
    }
}

export const getAgencyList = (agencyType) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_AGENCY_LIST_LOADING
        })

        let url = BGV_ADDRESS + '/agency?agencyType=' + agencyType;
        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_AGENCY_LIST_SUCCESS,
                        agencyList: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_AGENCY_LIST_ERROR,
                    error: errMsg
                });
            });
    };
};