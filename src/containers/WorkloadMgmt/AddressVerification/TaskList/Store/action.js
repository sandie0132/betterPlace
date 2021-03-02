import * as actionTypes from './actionTypes';
import axios from 'axios';
// import _ from 'lodash';

import Sockette from "sockette";
import Cookies from 'universal-cookie';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;
const BGV_ADDRESS = process.env.REACT_APP_BGV_ADDRESS_VERIFICATION;
const SOCKET_CONNECTION_URL = process.env.REACT_APP_SOCKET_CONNECTION_URL;
const PROCESS_ACTION = process.env.REACT_APP_PROCESS_WORKLOAD_TASKS;


export const initState = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.INIT_STATE
        })
    };
};

//search in taskListFooter
export const searchExecutive = (searchKey) => {
    return dispatch => {
        dispatch({
            type: actionTypes.SEARCH_AGENCY_EXECUTIVE_LOADING
        })
        let url = BGV_ADDRESS + `/agencydashboard/employee/search?key=${searchKey}`;
        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.SEARCH_AGENCY_EXECUTIVE_SUCCESS,
                        searchExecutiveResults: response.data
                    })
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.SEARCH_AGENCY_EXECUTIVE_ERROR,
                    error: errMsg
                });
            })

    }
}

//assign and unassign tasks - footer
export const postAssignment = (payload, actionType, selectAll, filterParams, cardType) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.POST_ASSIGNMENT_LOADING
        })
        let url = BGV_ADDRESS + `/${cardType}/assign`;
        if (selectAll) {
            url += `?${filterParams}&selectAll=true`;
        }
        axios.post(url, payload)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.POST_ASSIGNMENT_SUCCESS,
                        postAssignmentData: response.data,
                        actionType: actionType
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.POST_ASSIGNMENT_ERROR,
                    error: errMsg
                });
            });
    };
};

//download tasks - header
export const downloadTasks = (allSelected, targetUrl, payload) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.DOWNLOAD_AGENCY_TASKS_LOADING
        })
        let url = '';
        let postData = {};
        if (allSelected) {
            url = BGV_ADDRESS + `/physical/download` + targetUrl + `&selectAll=true`;
            postData = {}
        }
        else {
            url = BGV_ADDRESS + `/physical/download`;
            postData = payload;
        }
        axios.post(url, postData, { responseType: 'blob' })

            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data], { type: response.data.type }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'address_physical_tasks.csv');
                document.body.appendChild(link);
                link.click();

                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.DOWNLOAD_AGENCY_TASKS_SUCCESS,
                    })
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.DOWNLOAD_AGENCY_TASKS_ERROR,
                    error: errMsg
                });
            });
    };
};

export const downloadPostalTasks = (allSelected, targetUrl, payload) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.DOWNLOAD_POSTAL_TASKS_LOADING
        })
        let url = '';
        let postData = {};
        if (allSelected) {
            url = BGV_ADDRESS + `/postal/excel/download` + targetUrl + `&selectAll=true`;
            postData = {};
        }
        else {
            url = BGV_ADDRESS + '/postal/excel/download';
            postData = payload;
        }
        axios.post(url, postData, { responseType: 'blob' })
            // .then(response => response.blob())
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data], { type: response.data.type }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'postal_tasks.csv');
                document.body.appendChild(link);
                link.click();

                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.DOWNLOAD_POSTAL_TASKS_SUCCESS,
                    })
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response && error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.DOWNLOAD_POSTAL_TASKS_ERROR,
                    error: errMsg
                });
            });
    }
}

//upload excel
export const uploadExcelTasks = (data) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.EXCEL_UPLOAD_TASKS_LOADING,
            percentCompleted: 0
        })
        let url = BGV_ADDRESS + '/postal/excel/upload';
        let config = {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: function (progressEvent) {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);

                dispatch({
                    type: actionTypes.EXCEL_UPLOAD_TASKS_LOADING,
                    percentCompleted: percentCompleted
                })
            }
        };
        axios.post(url, data, config)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.EXCEL_UPLOAD_TASKS_SUCCESS,
                        uploadResponse: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response && error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.EXCEL_UPLOAD_TASKS_ERROR,
                    error: errMsg
                });
            });
    };
}

export const processUploadedTasks = (processId) => {
    const cookies = new Cookies();
    let access_token = cookies.get('access_token');

    return (dispatch) => {
        if (!access_token) {
            let apiUrl = CUST_MGMT + '/user';
            axios.get(apiUrl)
                .then(response => {
                    if (response.status === 200 || response.status === 201) {
                        access_token = cookies.get('access_token');
                        console.log("process - user api called", access_token)
                        let ws = new Sockette(SOCKET_CONNECTION_URL + PROCESS_ACTION, {
                            timeout: 2000e3,
                            maxAttempts: 1,
                            onopen: () => {
                                ws.json({
                                    action: PROCESS_ACTION,
                                    uploadId: processId,
                                    authorization: 'Bearer ' + access_token
                                });
                            },
                            onmessage: e => {
                                let data = JSON.parse(e.data)
                                console.log("e data", data);

                                if (data && data.errorCode === 400 && data.errorMessage) {
                                    console.log("onmessage - error", data)
                                    dispatch({
                                        type: actionTypes.PROCESS_UPLOADED_TASKS_ERROR,
                                        processError: data.errorMessage
                                    })
                                }
                                else {
                                    dispatch({
                                        type: actionTypes.PROCESS_UPLOADED_TASKS_SUCCESS,
                                        processData: data
                                        // error: !_.isEmpty(data) ? (data.onboardErrorCount > 0 || data.terminateErrorCount > 0 || data.updateErrorCount > 0 ? data : null) : null
                                    })
                                }
                            },
                            onreconnect: e => console.log("Reconnecting...", e),
                            onmaximum: e => console.log("Stop Attempting!", e),
                            onclose: e => console.log("ProcessSocket Closed!", e),
                            onerror: e => {
                                dispatch({
                                    type: actionTypes.PROCESS_UPLOADED_TASKS_ERROR,
                                    processError: 'failed due to network issue'
                                })
                            }
                        }
                        );
                    }
                })
        }
        else {
            console.log("process - else", access_token);

            let ws = new Sockette(SOCKET_CONNECTION_URL + PROCESS_ACTION, {
                timeout: 2000e3,
                maxAttempts: 1,
                onopen: () => {
                    ws.json({
                        action: PROCESS_ACTION,
                        uploadId: processId,
                        authorization: 'Bearer ' + access_token
                    });
                },
                onmessage: e => {
                    console.log("e", e);

                    let data = JSON.parse(e.data)
                    console.log("e data", data);

                    if (data && data.errorCode === 400 && data.errorMessage) {
                        console.log("onmessage - error", data)
                        dispatch({
                            type: actionTypes.PROCESS_UPLOADED_TASKS_ERROR,
                            processError: data.errorMessage
                        })
                    }
                    else {
                        dispatch({
                            type: actionTypes.PROCESS_UPLOADED_TASKS_SUCCESS,
                            processData: data
                            // error: !_.isEmpty(data) ? (data.onboardErrorCount > 0 || data.terminateErrorCount > 0 || data.updateErrorCount > 0 ? data : null) : null
                        })
                    }
                },
                onreconnect: e => console.log("Reconnecting...", e),
                onmaximum: e => console.log("Stop Attempting!", e),
                onclose: e => console.log("ProcessSocket Closed!", e),
                onerror: e => {
                    dispatch({
                        type: actionTypes.PROCESS_UPLOADED_TASKS_ERROR,
                        processError: 'failed due to network issue'
                    })
                }
            }
            );
        }
    }
}

export const downloadPostalErrorExcel = (type, errorPath) => {
    return dispatch => {
        dispatch({
            type: actionTypes.EXCEL_ERROR_DOWNLOAD_TASKS_LOADING
        })
        let url = BGV_ADDRESS + '/postal/excel/error/download?filePath=' + errorPath;

        axios.get((url), {
            responseType: 'blob'
        })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data], { type: response.data.type }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', type);
                document.body.appendChild(link);
                link.click();

                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.EXCEL_ERROR_DOWNLOAD_TASKS_SUCCESS,
                    })
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.EXCEL_ERROR_DOWNLOAD_TASKS_ERROR,
                    error: errMsg
                });
            })
    }
}

export const getPostalUploadInitState = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_POSTAL_UPLOAD_INIT_DATA
        })
    }
}

export const getAgencyList = (agencyType, postalAgencyList, physicalAgencyList) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_AGENCY_TASK_LIST_LOADING
        })

        let url = BGV_ADDRESS + '/agency?agencyType=' + agencyType;
        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    if (agencyType === 'postal') {
                        dispatch({
                            type: actionTypes.GET_AGENCY_TASK_LIST_SUCCESS,
                            postalAgencyList: response.data,
                            physicalAgencyList: physicalAgencyList
                        });
                    }
                    else if (agencyType === 'physical') {
                        dispatch({
                            type: actionTypes.GET_AGENCY_TASK_LIST_SUCCESS,
                            postalAgencyList: postalAgencyList,
                            physicalAgencyList: response.data,
                        });
                    }
                    else {
                        dispatch({
                            type: actionTypes.GET_AGENCY_TASK_LIST_SUCCESS,
                            agencyList: response.data
                        });
                    }
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_AGENCY_TASK_LIST_ERROR,
                    error: errMsg
                });
            });
    };
};