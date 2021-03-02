import * as actionTypes from './actionTypes';
import axios from 'axios';
import _ from 'lodash';
import * as initData from '../../Store/StaticDataInitData';

const BGV_ADDRESS = process.env.REACT_APP_BGV_ADDRESS_VERIFICATION;
const PLATFORM_SERVICES = process.env.REACT_APP_PLATFORM_API_URL;

export const initState = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.INIT_STATE
        })
    };
};

//search for tasks - top
export const searchCandidate = (cardType, searchKey, category, targetUrl, pageSize) => {
    return dispatch => {
        dispatch({
            type: actionTypes.SEARCH_AGENCY_CANDIDATE_LOADING
        })
        let url = BGV_ADDRESS + `/${cardType}/tasks/search?category=${category}&key=${searchKey}`;
        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.SEARCH_AGENCY_CANDIDATE_SUCCESS,
                        searchResults: response.data
                    })
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.SEARCH_AGENCY_CANDIDATE_ERROR,
                    error: errMsg
                });
            })
    }
}

// taskList count
export const getTasksCount = (cardType, targetUrl, payload) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_TASKS_COUNT_LOADING,
        })
        let url = BGV_ADDRESS + `/${cardType}/tasks`;
        if (!_.isEmpty(targetUrl)) {
            url += targetUrl + '&isCount=true';
        }
        else {
            url += '?isCount=true'
        }
        axios.post(url, payload)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_TASKS_COUNT_SUCCESS,
                        tasksCount: response.data.count
                    })
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_TASKS_COUNT_ERROR,
                    error: errMsg
                });
            })
    }
}

//taskList data according to pageNumber/filters
export const getTasksList = (cardType, payload, targetUrl, pageSize) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_AGENCY_TASKS_LOADING
        })
        let url = BGV_ADDRESS + `/${cardType}/tasks`;
        if (!_.isEmpty(targetUrl) && targetUrl.includes('pageNumber') && pageSize) {
            url += targetUrl + `&pageSize=${pageSize}`;
        }
        else if (!_.isEmpty(targetUrl)) {
            url += targetUrl;
        }
        axios.post(url, payload)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_AGENCY_TASKS_SUCCESS,
                        agencyTasksList: response.data,
                        tasksCount: response.data ? response.data.length : 0
                    })
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_AGENCY_TASKS_ERROR,
                    error: errMsg
                });
            })
    }
}

//filters - client search + dropdown static data
export const getClientStaticData = (addressType, key) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_CLIENT_STATIC_DATA_LOADING
        })
        let url = BGV_ADDRESS + '/agencydashboard/client?addressType=' + addressType;
        if (!_.isEmpty(key)) {
            url += "&key=" + key;
        }
        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_CLIENT_STATIC_DATA_SUCCESS,
                        clientStaticData: response.data
                    })
                }

            }).catch(error => {
                let errMsg = error;
                if (error.response && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_CLIENT_STATIC_DATA_ERROR,
                    error: errMsg
                });
            })
    }
}

//primary filters
export const getStaticDataList = (cardType) => {
    const data = initData.data;

    let updatedData = [];
    updatedData = cardType === 'postal' ? updatedData.concat(data, "WORKLOAD_MGMT_POSTAL_STATUS")
        : cardType === 'physical' ? updatedData.concat(data, "WORKLOAD_MGMT_PHYSICAL_OPS_STATUS", "WORKLOAD_MGMT_PHYSICAL_UNASSIGNED_STATUS", "WORKLOAD_MGMT_PHYSICAL_VERIFIER_STATUS")
            : data

    let agencyStaticData = { ...updatedData };

    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_STATIC_DATA_LOADING
        })
        axios.post(PLATFORM_SERVICES + `/staticdata`, updatedData)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    _.forEach(response.data, function (object) {
                        _.forEach(object, function (value, key) {
                            agencyStaticData[key] = value;
                        })
                    })
                    dispatch({
                        type: actionTypes.GET_STATIC_DATA_SUCCESS,
                        staticData: agencyStaticData
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_STATIC_DATA_ERROR,
                    error: errMsg
                });
            });
    };
};

//district data
export const getDistrictStaticData = (state) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_DISTRICT_STATIC_DATA_LOADING
        })
        axios.get(PLATFORM_SERVICES + `/staticdata/location/districts?state=${state}`)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_DISTRICT_STATIC_DATA_SUCCESS,
                        districtData: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_DISTRICT_STATIC_DATA_ERROR,
                    error: errMsg
                });
            });
    };
};

export const getCityStaticData = (state, district) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_CITY_STATIC_DATA_LOADING
        })
        axios.get(PLATFORM_SERVICES + `/staticdata/location/taluks?state=${state}&district=${district}`)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_CITY_STATIC_DATA_SUCCESS,
                        cityStaticData: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_CITY_STATIC_DATA_ERROR,
                    error: errMsg
                });
            });
    };
};

export const getPincodeStaticData = (state) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_PINCODE_STATIC_DATA_LOADING
        })
        axios.get(PLATFORM_SERVICES + `/staticdata/location?state=${state}`)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_PINCODE_STATIC_DATA_SUCCESS,
                        pincodeStaticData: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_PINCODE_STATIC_DATA_ERROR,
                    error: errMsg
                });
            });
    };
};

//agencies search + dropdown - primary filters
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

//filters count to be displayed on card
export const getFilterCount = (cardType, agency, status, caseAssignee, userPrivilege, targetUrl, payload) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_FILTER_COUNT_LOADING
        })

        let url = BGV_ADDRESS + `/${cardType}/tasks/count`;
        // if(userPrivilege === 'AGENCY_ADMIN'){
        //     if (!_.isEmpty(caseAssignee)) {
        //         url += `?caseAssignee=${caseAssignee}`
        //     }
        //     let ternary = url.includes('?') ? '&' :'?';
        //     if (!_.isEmpty(status)) {
        //         url += ternary+`caseStatus=${status}`;
        //     }
        // } else {
        //     if (!_.isEmpty(agency) && !_.isEmpty(status)) {
        //         url += `?agency=${agency}&caseStatus=${status}`
        //     }
        //     else if (!_.isEmpty(agency)) {
        //         url += `?agency=${agency}`;
        //     }
        //     else if (!_.isEmpty(status)) {
        //         url += `?caseStatus=${status}`;
        //     }
        // }
        url += targetUrl;
        axios.post(url, payload)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_FILTER_COUNT_SUCCESS,
                        filterCount: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_FILTER_COUNT_ERROR,
                    error: errMsg
                });
            });
    };
};

//reassign flow
export const reassignAgency = (payload, agencyName, actionType, selectedTasks) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.POST_REASSIGN_LOADING
        })

        let url = BGV_ADDRESS + `/reassign`;

        axios.post(url, payload)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    let successTasks = 0;
                    if (!_.isEmpty(response.data)) {
                        successTasks = response.data.actionTakenArray.length + response.data.noActionTakenArray.length
                    }
                    dispatch({
                        type: actionTypes.POST_REASSIGN_SUCCESS,
                        reassignData: {
                            agencyName: agencyName,
                            actionType: actionType,
                            // selectedTasks: selectedTasks ? selectedTasks.length : 0
                            selectedTasks: successTasks,
                            payload: payload
                        }
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response && error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.POST_REASSIGN_ERROR,
                    error: errMsg
                });
            });
    };
}