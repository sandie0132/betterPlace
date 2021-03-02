import * as actionTypes from './actionTypes';
import axios from 'axios';
const BGV = process.env.REACT_APP_BGV_CONFIG_URL;
const ADDRESS = process.env.REACT_APP_BGV_ADDRESS_VERIFICATION;

// export const putData = (data, orgId) => {
//     return (dispatch) => {
//         dispatch({
//             type: actionTypes.PUT_SERVICE_DATA_LOADING
//         })
//         let url = BGV +'/ops/service/' + orgId;
//         axios.put(url, data)
//             .then(response => {
//                 if (response.status === 200 || response.status === 201) {
//                     dispatch({
//                         type: actionTypes.PUT_SERVICE_DATA_SUCCESS,
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
//                     type: actionTypes.PUT_SERVICE_DATA_ERROR,
//                     error: errMsg
//                 })
//             });
//     };
// };

export const postData = (data, orgId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.POST_SERVICE_DATA_LOADING
        })
        let url = BGV +'/opsconfig/' + orgId;
        axios.post(url,data)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.POST_SERVICE_DATA_SUCCESS,
                        data: response.data,
                        Id : response.data._id
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.POST_SERVICE_DATA_ERROR,
                    error: errMsg
                })
            });
    };
};

export const getSelectedServiceData = (orgId) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_SELECTED_SERVICE_DATA_LOADING
        })
        let url = BGV +'/opsconfig/' + orgId;
        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_SELECTED_SERVICE_DATA_SUCCESS,
                        data: response.data,
                        Id : response.data._id
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
                    type: actionTypes.GET_SELECTED_SERVICE_DATA_ERROR,
                    error: errMsg
                });
            });
    };
};


export const getServices = () => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_ALL_SERVICES_DATA_LOADING
        })
        
        let url = BGV +'/services';
        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_ALL_SERVICES_DATA_SUCCESS,
                        servicesData: response.data[0].opsServices
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_ALL_SERVICES_DATA_ERROR,
                    error: errMsg
                });
            });
    };
};

export const getAgencyList = () => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_AGENCY_LIST_LOADING
        })
        
        let url = ADDRESS +'/agency?agencyType=physical';
        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_AGENCY_LIST_SUCCESS,
                        agencyList : response.data
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_AGENCY_LIST_ERROR,
                    error: errMsg
                });
            });
    };
};

export const getInitState = () => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_INIT_STATE
        })
    }
}