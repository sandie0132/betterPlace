import * as actionTypes from './actionTypes';
import axios from 'axios';
// import _ from 'lodash';

const WORKLOAD_MGMT = process.env.REACT_APP_WORKLOAD_MGMT_URL;
const BGV_ADDRESS = process.env.REACT_APP_BGV_ADDRESS_VERIFICATION;

export const initState = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.INIT_STATE
        })
    };
};

export const getDocuments = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_DOCUMENTS_LOADING
        })
        axios.get(WORKLOAD_MGMT+"/tasks/all?count=true")
        .then(response => {
            if(response.status === 200 || response.status === 201)
            {
                dispatch({
                    type: actionTypes.GET_DOCUMENTS_SUCCESS,
                    documents : response.data
                })
            }
        })
        .catch(error => {
            let errMsg  = error;
            if(error.response && error.response.data.errorMessage){
                errMsg= error.response.data.errorMessage;
            }
            dispatch({
                type: actionTypes.GET_DOCUMENTS_ERROR,
                error: errMsg
            });
        });
    }
}
//task count api - removed
// export const getAgencyTasksCount = (cardType) => {
//     return dispatch => {
//         dispatch({
//             type: actionTypes.GET_AGENCY_TASKS_COUNT_LOADING
//         })
//         let url = BGV_ADDRESS + `/agencydashboard/task?isCount=true`;
       
//         axios.get(url)
//             .then(response => {
//                 if (response.status === 200 || response.status === 201) {
//                     dispatch({
//                         type: actionTypes.GET_AGENCY_TASKS_COUNT_SUCCESS,
//                         tasksCount: response.data
//                     })
//                 }
//             })
//             .catch(error => {
//                 let errMsg = error;
//                 if (error.response && error.response.data.errorMessage) {
//                     errMsg = error.response.data.errorMessage;
//                 }
//                 dispatch({
//                     type: actionTypes.GET_AGENCY_TASKS_COUNT_ERROR,
//                     error: errMsg
//                 });
//             })
//     }
// }

export const getPostalCount = () => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_POSTAL_COUNT_LOADING
        })

        let url = BGV_ADDRESS + `/postal/tasks/count?dateRange=LAST_MONTH`;
        axios.post(url, {})
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_POSTAL_COUNT_SUCCESS,
                        postalCount: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_POSTAL_COUNT_ERROR,
                    error: errMsg
                });
            });
    };
};

export const getPhysicalCount = () => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_PHYSICAL_COUNT_LOADING
        })

        let url = BGV_ADDRESS + `/physical/tasks/count?dateRange=LAST_MONTH`;
        axios.post(url, {})
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_PHYSICAL_COUNT_SUCCESS,
                        physicalCount: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_PHYSICAL_COUNT_ERROR,
                    error: errMsg
                });
            });
    };
};