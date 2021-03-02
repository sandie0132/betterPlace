import * as actionTypes from './actionTypes';
import axios from 'axios';

const BGV = process.env.REACT_APP_BGV_CONFIG_URL;

export const getServiceData = (orgId) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_SERVICE_DATA_LOADING
        })
        let url = BGV +'/opsconfig/' + orgId;
        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_SERVICE_DATA_SUCCESS,
                        data: response.data,
                        id : response.data._id
                    });
                    dispatch({
                        type: 'SET_OPS_CONFIG_STATUS',
                        servicesConfigured: response.data.servicesEnabled !== undefined,
                        tatMappingConfigured: response.data.tatMappedServices !== undefined,
                        priceMappingConfigured: response.data.priceMappedServices !== undefined,
                    })
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_SERVICE_DATA_ERROR,
                    error: errMsg
                });
            });
    };
};

export const postTatData = (data, orgId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.POST_TAT_DATA_LOADING
        })
        let url = BGV +'/opsconfig/' + orgId;
        axios.post(url,data)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.POST_TAT_DATA_SUCCESS,
                        data: response.data,
                        id : response.data._id
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.POST_TAT_DATA_ERROR,
                    error: errMsg
                })
            });
    };
};

// export const putTatData = (data, orgId) => {
//     return (dispatch) => {
//         dispatch({
//             type: actionTypes.PUT_TAT_DATA_LOADING
//         })
//         let url = BGV +'/ops/priceconfig/' + orgId;
//         axios.put(url, data)
//             .then(response => {
//                 if (response.status === 200 || response.status === 201) {
//                     dispatch({
//                         type: actionTypes.PUT_TAT_DATA_SUCCESS,
//                         data: response.data
//                     });
//                 }
//             })
//             .catch(error => {
//                 let errMsg  = error;
//                 if(error.response.data && error.response.data.errorMessage){
//                     errMsg= error.response.data.errorMessage;
//                 }
//                 dispatch({
//                     type: actionTypes.PUT_TAT_DATA_ERROR,
//                     error: errMsg
//                 })
//             });
//     };
// };

// export const getSelectedServices = (orgId) => {
//     return (dispatch) => {
//         dispatch({
//             type: actionTypes.GET_SELECTED_SERVICE_DATA_LOADING
//         })
//         let url = BGV +'/ops/service/' + orgId;
//         axios.get(url)
//             .then(response => {
//                 if (response.status === 200 || response.status === 201) {
//                     dispatch({
//                         type: actionTypes.GET_SELECTED_SERVICE_DATA_SUCCESS,
//                         selectedServiceData: response.data,
//                     });
//                 }
//             })
//             .catch(error => {
//                 let errMsg  = error;
//                 if(error.response && error.response.data.errorMessage){
//                     errMsg= error.response.data.errorMessage;
//                 }
//                 dispatch({
//                     type: actionTypes.GET_SELECTED_SERVICE_DATA_ERROR,
//                     error: errMsg
//                 });
//             });
//     };
// };

export const getInitState = () => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_INIT_STATE
        })
    }
}