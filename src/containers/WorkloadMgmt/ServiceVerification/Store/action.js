import * as actionTypes from './actionTypes';
import axios from 'axios';
import Sockette from "sockette";
import Cookies from 'universal-cookie';
import _ from 'lodash';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;
const WORKLOAD_MGMT = process.env.REACT_APP_WORKLOAD_MGMT_URL;
const BGV_OTHER = process.env.REACT_APP_BGV_OTHER_VERIFICATION_URL;
const BGV_CONFIG = process.env.REACT_APP_BGV_CONFIG_URL;
const BGV_LEGAL = process.env.REACT_APP_BGV_LEGAL_VERIFICATION;
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

export const getDocumentTasks = (tasktype, servicetype, agencyType) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_DOCUMENTS_TASKS_LOADING
        })
        let url = WORKLOAD_MGMT + "/tasks/" + tasktype + "/" + servicetype;
        if(servicetype === "physical_address"){
            url = url + "?agencyType=" + agencyType;
        }
        axios.get(url)
        .then(response => {
            if(response.status === 200 || response.status === 201)
            {
                dispatch({
                    type: actionTypes.GET_DOCUMENTS_TASKS_SUCCESS,
                    documentTasksList : response.data
                })
            }
        })
        .catch(error => {
            let errMsg  = error;
            if(error.response && error.response.data.errorMessage){
                errMsg= error.response.data.errorMessage;
            }
            dispatch({
                type: actionTypes.GET_DOCUMENTS_TASKS_ERROR,
                error: errMsg
            });
        });
    }
}

export const postDocumentTasks = (data, service, requestId, addressViewType) => {
    let url = WORKLOAD_MGMT + "/task/complete/" + service+"/"+requestId;
    if(service === "physical_address") url = url + "?agencyType=" + addressViewType; 
    return dispatch => {
        dispatch({
            type: actionTypes.POST_DOCUMENTS_TASKS_LOADING
        })
        axios.post(url,data)
        .then(response => {
            if(response.status === 200 || response.status === 201)
            {
                dispatch({
                    type: actionTypes.POST_DOCUMENTS_TASKS_SUCCESS,

                })
            }
        })
        .catch(error => {
            let errMsg  = error;
            if(error.response && error.response.data.errorMessage){
                errMsg= error.response.data.errorMessage;
            }
            dispatch({
                type: actionTypes.POST_DOCUMENTS_TASKS_ERROR,
                error: errMsg
            });
        });
    }
}

export const putSmsOrEmail = (data,verificationType,refId) => {
    return dispatch => {
        dispatch({
            type : actionTypes.POST_SMS_EMAIL_LOADING
        })
        axios.put(BGV_OTHER+"/sendNotification/"+verificationType+"/"+refId, data)
        .then(response => {
            if(response.status === 200 || response.status === 201)
            {
                dispatch({
                    type: actionTypes.POST_SMS_EMAIL_SUCCESS
                })
            }
        })
        .catch(error => {
            let errMsg  = error;
            if(error.response && error.response.data.errorMessage){
                errMsg= error.response.data.errorMessage;
            }
            dispatch({
                type: actionTypes.POST_SMS_EMAIL_ERROR,
                error: errMsg
            });
        })
    }
}

export const searchInProgressTasks = (service, key, searchOption) => {
    const category = searchOption === 'by profile' ? 'profile' : 'phoneNumber';
    return dispatch => {
        dispatch({
            type : actionTypes.GET_IN_PROGRESS_TASKS_LOADING
        })
        let url = WORKLOAD_MGMT + "/taskprogress/"+ service+ "/search?key="+ key +`&category=${category}`;
        axios.get(url)
        .then(response => {
            if(response.status === 200 || response.status === 201){
                dispatch({
                    type : actionTypes.GET_IN_PROGRESS_TASKS_SUCCESS,
                    searchData : response.data
                })
            }
        })
        .catch(error => {
            let errMsg  = error;
            if(error.response && error.response.data.errorMessage){
                errMsg= error.response.data.errorMessage;
            }
            dispatch({
                type: actionTypes.GET_IN_PROGRESS_TASKS_ERROR,
                error: errMsg
            });    
        })
    }
}

export const searchCompletedTasks = (service, key, searchOption) => {
    const category = searchOption === 'by profile' ? 'profile' : 'phoneNumber';
    return dispatch => {
        dispatch({
            type : actionTypes.GET_COMPLETED_TASKS_LOADING
        })
        let url = WORKLOAD_MGMT + "/taskcompleted/"+ service+ "/search?key="+ key+`&category=${category}`;
        axios.get(url)
        .then(response => {
            if(response.status === 200 || response.status === 201){
                dispatch({
                    type : actionTypes.GET_COMPLETED_TASKS_SUCCESS,
                    searchCompletedData : response.data
                })
            }
        })
        .catch(error => {
            let errMsg  = error;
            if(error.response && error.response.data.errorMessage){
                errMsg= error.response.data.errorMessage;
            }
            dispatch({
                type: actionTypes.GET_COMPLETED_TASKS_ERROR,
                error: errMsg
            });    
        })
    }
}

export const WorkLoadTransfer = (service,serviceRequestId) => {
    return dispatch => {
        dispatch({
            type : actionTypes.PUT_WORKLOAD_TRANSFERDATA_LOADING
        })
        let url = WORKLOAD_MGMT + "/taskprogress/"+service+"/transfer?serviceRequestId="+serviceRequestId;
        axios.put(url)
        .then(response => {
            if(response.status === 200 || response.status === 201){
                dispatch({
                    type : actionTypes.PUT_WORKLOAD_TRANSFERDATA_SUCCESS
                })
            }
        })
        .catch(error => {
            let errMsg  = error;
            if(error.response && error.response.data.errorMessage){
                errMsg= error.response.data.errorMessage;
            }
            dispatch({
                type: actionTypes.PUT_WORKLOAD_TRANSFERDATA_ERROR,
                error: errMsg
            });    
        })
    }
}

export const getUserInfo = (userId) => {
    return dispatch => {
        dispatch({
            type : actionTypes.GET_USER_NAME_LOADING
        })
        axios.get(WORKLOAD_MGMT + "/userInfo/"+userId)
        .then(response => {
            if(response.status === 200 || response.status === 201){
                dispatch({
                    type : actionTypes.GET_USER_NAME_SUCCESS,
                    userInfo : response.data
                })
            }
        })
        .catch(error => {
            let errMsg  = error;
            if(error.response && error.response.data.errorMessage){
                errMsg= error.response.data.errorMessage;
            }
            dispatch({
                type: actionTypes.GET_USER_NAME_ERROR,
                error: errMsg
            });    
        })
    }
}

export const getComments = (orgId,serviceType) => {
    return dispatch => {
        dispatch({
            type : actionTypes.GET_COMMENTS_LOADING
        })
        axios.get(BGV_CONFIG + "/config/comments/"+orgId+"?serviceType="+serviceType)
        .then(response => {
            if(response.status === 200 || response.status === 201){
                dispatch({
                    type : actionTypes.GET_COMMENTS_SUCCESS,
                    comments : response.data
                })
            }
        })
        .catch(error => {
            let errMsg  = error;
            if(error.response && error.response.data.errorMessage){
                errMsg= error.response.data.errorMessage;
            }
            dispatch({
                type: actionTypes.GET_COMMENTS_ERROR,
                error: errMsg
            });    
        })
    }
}

export const downloadTask = (servicetype) => {
    return dispatch => {
        dispatch({
            type: actionTypes.DOWNLOAD_TASK_POC_LOADING
        })
        axios.get((BGV_OTHER+ '/task/' + servicetype + '/download'), {
                responseType: 'blob'
            })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data] , {type: "text/csv"}));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${servicetype}_tasks.csv`);
                document.body.appendChild(link);
                link.click();

                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.DOWNLOAD_TASK_POC_SUCCESS,
                    })
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.DOWNLOAD_TASK_POC_ERROR,
                    error: errMsg
                });
            })

    }
}

export const getExcelCount = (service) => {
    return dispatch => {
        dispatch({
            type : actionTypes.GET_EXCEL_COUNT_LOADING,
        })
        let url = BGV_OTHER + "/task/"+ service + '/count';
        axios.get(url)
        .then(response => {
            if(response.status === 200 || response.status === 201){
                dispatch({
                    type : actionTypes.GET_EXCEL_COUNT_SUCCESS,
                    data : response.data
                })
            }
        })
        .catch(error => {
            let errMsg  = error;
            if(error.response && error.response.data.errorMessage){
                errMsg= error.response.data.errorMessage;
            }
            dispatch({
                type: actionTypes.GET_EXCEL_COUNT_ERROR,
                error: errMsg
            });    
        })
    }
}

export const getTagInfo = (tagIdList) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_TAG_INFO_LOADING
        })
        let url = CUST_MGMT + `/tag?tagId=${tagIdList}`;
        axios.get(url)
            .then(response => {                
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_TAG_INFO_SUCCESS,
                        tagList: response.data,
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                else {
                    errMsg = error.message
                }
                dispatch({
                    type: actionTypes.GET_TAG_INFO_ERROR,
                    error: errMsg
                });
            });
    };
};

export const downloadExcelTasks = (type, agencyName) => {
    return dispatch => {
        dispatch({
            type: actionTypes.EXCEL_DOWNLOAD_TASKS_LOADING
        })
        let url = "";
        // let responseType = "";
        if(type === "police verification tasks"){
            url = BGV_LEGAL + '/police/address/verification/task/download';
            // responseType = "text/csv"
        }
        else if (type === "postal verification tasks"){
            url = BGV_ADDRESS + '/postal/excel/download?agencyName='+agencyName;
            // responseType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }

        axios.get((url), {
                responseType: 'blob'
            })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data] , { type: response.data.type }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'pvc_tasks.csv');
                document.body.appendChild(link);
                link.click();

                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.EXCEL_DOWNLOAD_TASKS_SUCCESS,
                    })
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.EXCEL_DOWNLOAD_TASKS_ERROR,
                    error: errMsg
                });
            })
    }
}

export const excelTasksCount = (type, agencyName) => {
    return dispatch => {
        dispatch({
            type : actionTypes.EXCEL_TASKS_COUNT_LOADING,
        })
        let url = "";
        if(type === "police") url = BGV_LEGAL + '/police/address/verification/task/count';
        else if( type === "postal address"){
            if(_.isEmpty(agencyName)){
                url = BGV_ADDRESS + '/postal/excel/download/task/count';
            } else {
                url = BGV_ADDRESS + '/postal/excel/download/task/count?agencyName='+agencyName;
            }
        }
        axios.get(url)
        .then(response => {
            if(response.status === 200 || response.status === 201){
                dispatch({
                    type : actionTypes.EXCEL_TASKS_COUNT_SUCCESS,
                    data : response.data,
                    cardType : type
                })
            }
        })
        .catch(error => {
            let errMsg  = error;
            if(error.response && error.response.data.errorMessage){
                errMsg= error.response.data.errorMessage;
            }
            dispatch({
                type: actionTypes.EXCEL_TASKS_COUNT_ERROR,
                error: errMsg
            });    
        })
    }
}

export const uploadExcelTasks = (data, type) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.EXCEL_UPLOAD_TASKS_LOADING,
            percentCompleted: 0
        })
        let url = "";
        if(type === "postal") url = BGV_ADDRESS + '/postal/excel/upload';
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

export const processUploadedTasks = (processId, type) => {
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
        let url =  BGV_ADDRESS + '/postal/excel/error/download?filePath='+errorPath;

        axios.get((url), {
                responseType: 'blob'
            })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data] , { type: response.data.type }));
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

export const getAgencyTypeCount = (agencyType) => {
    return dispatch => {
        dispatch({
            type : actionTypes.ADDRESS_AGENCY_COUNT_LOADING,
        })
        let url = WORKLOAD_MGMT + '/tasks/address/physical_address?agencyType='+agencyType+'&count=true';
        
        axios.get(url)
        .then(response => {
            if(response.status === 200 || response.status === 201){
                dispatch({
                    type : actionTypes.ADDRESS_AGENCY_COUNT_SUCCESS,
                    data : response.data,
                })
            }
        })
        .catch(error => {
            let errMsg  = error;
            if(error.response && error.response.data.errorMessage){
                errMsg= error.response.data.errorMessage;
            }
            dispatch({
                type: actionTypes.ADDRESS_AGENCY_COUNT_ERROR,
                error: errMsg
            });    
        })
    }
}
