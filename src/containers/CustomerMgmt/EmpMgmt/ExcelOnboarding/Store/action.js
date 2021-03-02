import axios from 'axios';
import * as actionTypes from './actionTypes';
import Sockette from "sockette";
import Cookies from 'universal-cookie';
import _ from 'lodash';

const SOCKET_CONNECTION_URL = process.env.REACT_APP_SOCKET_CONNECTION_URL;
const EXCEL_UPLOAD_URL = process.env.REACT_APP_EXCEL_UPLOAD;
const PROCESS_ACTION = process.env.REACT_APP_PROCESS_ACTION;
const SCAN_ACTION = process.env.REACT_APP_SCAN_ACTION;
const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

export const initState = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.INIT_STATE
        })
    };
};

export const getUserDetails = (orgId, fileId) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_USER_DETAILS_LOADING,
        })
        let url = EXCEL_UPLOAD_URL + '/user/' + fileId + '/info/' + orgId;
        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_USER_DETAILS_SUCCESS,
                        userDetails: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_USER_DETAILS_ERROR,
                    error: errMsg
                });
            });
    };
}

export const uploadFile = (data, orgId, fileName) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.UPLOAD_FILE_LOADING,
            percentCompleted: 0
        })
        let url = EXCEL_UPLOAD_URL + '/excel/upload/' + orgId;
        if (fileName) {
            url += '?fileName=' + fileName;
        }
        let config = {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: function (progressEvent) {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);

                dispatch({
                    type: actionTypes.UPLOAD_FILE_LOADING,
                    percentCompleted: percentCompleted
                })
            }
        };
        axios.post(url, data, config)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.UPLOAD_FILE_SUCCESS,
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
                    type: actionTypes.UPLOAD_FILE_ERROR,
                    error: errMsg
                });
            });
    };
};

//scan socket data
export const getSocketData = (connectionId) => {
    const cookies = new Cookies();
    let access_token = cookies.get('access_token');

    return (dispatch) => {
        if (!access_token) {
            let apiUrl = CUST_MGMT + '/user';
            axios.get(apiUrl)
                .then(response => {
                    if (response.status === 200 || response.status === 201) {
                        access_token = cookies.get('access_token');
                        let ws = new Sockette(SOCKET_CONNECTION_URL + SCAN_ACTION, {
                            timeout: 2000e3,
                            maxAttempts: 1,
                            onopen: e => {
                                console.log("scanning - open connection")
                                ws.json({
                                    action: SCAN_ACTION,
                                    id: connectionId,
                                    authorization: 'Bearer ' + access_token
                                });
                            },
                            onmessage: e => {
                                let data = e.data
                                if (data && JSON.parse(data).message) {
                                    dispatch({
                                        type: actionTypes.SOCKET_CONNECTION_ERROR,
                                        scannedRowCount: 0,
                                        totalRows: 0
                                    })
                                }
                                if (data && JSON.parse(data)) {
                                    let updatedData = JSON.parse(data)
                                    let scannedRowCount = updatedData.scannedRowCount
                                    let totalRows = updatedData.totalRows
                                    if (updatedData.status === 'failed') {
                                        dispatch({
                                            type: actionTypes.SOCKET_CONNECTION_ERROR,
                                            dataCount: updatedData,
                                            scannedError: updatedData.errorMessage
                                        })
                                    }
                                    else {
                                        dispatch({
                                            type: actionTypes.SOCKET_CONNECTION_SUCCESS,
                                            scannedRowCount: scannedRowCount,
                                            totalRows: totalRows,
                                            dataCount: updatedData
                                        })
                                    }
                                }
                            },
                            onreconnect: e => console.log("Reconnecting..."),
                            onmaximum: e => console.log("Stop Attempting!"),
                            onclose: e => console.log("ScanSocket Closed!"),
                            onerror: e => {
                                console.log("scanning - error case", e)
                                dispatch({
                                    type: actionTypes.SOCKET_CONNECTION_ERROR,
                                    scannedRowCount: 0,
                                    totalRows: 0
                                })
                            }
                        }
                        );
                        dispatch({
                            type: actionTypes.SCAN_SOCKET_CONNECTION_CLOSED,
                            scanSocket: ws
                        })
                    }
                })
        }
        else {
            let ws = new Sockette(SOCKET_CONNECTION_URL + SCAN_ACTION, {
                timeout: 2000e3,
                maxAttempts: 1,
                onopen: e => {
                    ws.json({
                        action: SCAN_ACTION,
                        id: connectionId,
                        authorization: 'Bearer ' + access_token
                    });
                },
                onmessage: e => {
                    let data = e.data
                    if (data && JSON.parse(data).message) {
                        dispatch({
                            type: actionTypes.SOCKET_CONNECTION_ERROR,
                            scannedRowCount: 0,
                            totalRows: 0
                        })
                    }
                    if (data && JSON.parse(data)) {
                        let updatedData = JSON.parse(data)
                        let scannedRowCount = updatedData.scannedRowCount
                        let totalRows = updatedData.totalRows

                        if (updatedData.status === 'failed') {
                            dispatch({
                                type: actionTypes.SOCKET_CONNECTION_ERROR,
                                dataCount: updatedData,
                                scannedError: updatedData.errorMessage
                            })
                        }
                        else {
                            dispatch({
                                type: actionTypes.SOCKET_CONNECTION_SUCCESS,
                                scannedRowCount: scannedRowCount,
                                totalRows: totalRows,
                                dataCount: updatedData
                            })
                        }
                    }
                },
                onreconnect: e => console.log("Reconnecting..."),
                onmaximum: e => console.log("Stop Attempting!"),
                onclose: e => console.log("ScanSocket Closed!", e),
                onerror: e => {
                    console.log("scanning - error case", e)
                    dispatch({
                        type: actionTypes.SOCKET_CONNECTION_ERROR,
                        scannedRowCount: 0,
                        totalRows: 0
                    })
                }
            }
            );
            dispatch({
                type: actionTypes.SCAN_SOCKET_CONNECTION_CLOSED,
                scanSocket: ws
            })
        }
    }
}

export const stopProcess = (orgId, fileId) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.STOP_PROCESS_LOADING,
        })
        let url = EXCEL_UPLOAD_URL + '/cancel/' + orgId + '/' + fileId;
        axios.put(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.STOP_PROCESS_SUCCESS,
                        stopProcessResponse: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.STOP_PROCESS_ERROR,
                    error: errMsg
                });
            });
    };
}

//post api for process data status
export const processDataStatus = (orgId, fileId) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.PROCESS_DATA_STATUS_LOADING,
        })
        let url = EXCEL_UPLOAD_URL + `/org/${orgId}/process/${fileId}`;
        axios.post(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.PROCESS_DATA_STATUS_SUCCESS,
                        processDataStatus: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.PROCESS_DATA_STATUS_ERROR,
                    error: errMsg
                });
            });
    };
}

//socket for process data
export const processData = (orgId, fileId) => {
    const cookies = new Cookies();
    let access_token = cookies.get('access_token');

    return (dispatch) => {
        let data = JSON.stringify({
            id: fileId,
            orgId: orgId
        });

        if (!access_token) {
            let apiUrl = CUST_MGMT + '/user';
            axios.get(apiUrl)
                .then(response => {
                    if (response.status === 200 || response.status === 201) {
                        access_token = cookies.get('access_token');
                        let ws = new Sockette(SOCKET_CONNECTION_URL + PROCESS_ACTION, {
                            timeout: 2000e3,
                            maxAttempts: 1,
                            onopen: () => {
                                ws.json({
                                    action: PROCESS_ACTION,
                                    data: data,
                                    authorization: 'Bearer ' + access_token
                                });
                            },
                            onmessage: e => {
                                let data = e.data
                                if (data && JSON.parse(data).message) {
                                    dispatch({
                                        type: actionTypes.PROCESS_SOCKET_CONNECTION_ERROR,
                                        processError: 'internal server error'
                                    })
                                }
                                if (data && JSON.parse(data).data) {
                                    data = JSON.parse(data).data
                                    dispatch({
                                        type: actionTypes.PROCESS_SOCKET_CONNECTION_SUCCESS,
                                        processData: data,
                                        error: !_.isEmpty(data) ? (data.onboardErrorCount > 0 || data.terminateErrorCount > 0 || data.updateErrorCount > 0 ? data : null) : null
                                    })
                                }
                            },
                            onreconnect: e => console.log("Reconnecting...", e),
                            onmaximum: e => console.log("Stop Attempting!", e),
                            onclose: e => console.log("ProcessSocket Closed!", e),
                            onerror: e => {
                                dispatch({
                                    type: actionTypes.PROCESS_SOCKET_CONNECTION_ERROR,
                                    processError: 'failed due to network issue'
                                })
                            }
                        }
                        );
                        dispatch({
                            type: actionTypes.PROCESS_SOCKET_CONNECTION_CLOSED,
                            processSocket: ws
                        })
                    }
                })
        }
        else {
            let ws = new Sockette(SOCKET_CONNECTION_URL + PROCESS_ACTION, {
                timeout: 2000e3,
                maxAttempts: 1,
                onopen: () => {
                    ws.json({
                        action: PROCESS_ACTION,
                        data: data,
                        authorization: 'Bearer ' + access_token
                    });
                },
                onmessage: e => {
                    let data = e.data
                    if (data && JSON.parse(data).message) {
                        dispatch({
                            type: actionTypes.PROCESS_SOCKET_CONNECTION_ERROR,
                            processError: 'internal server error'
                        })
                    }
                    if (data && JSON.parse(data).data) {
                        console.log("connection", data)
                        data = JSON.parse(data).data
                        dispatch({
                            type: actionTypes.PROCESS_SOCKET_CONNECTION_SUCCESS,
                            processData: data,
                            error: !_.isEmpty(data) ? (data.onboardErrorCount > 0 || data.terminateErrorCount > 0 || data.updateErrorCount > 0 ? data : null) : null
                        })
                    }
                },
                onreconnect: e => console.log("Reconnecting...", e),
                onmaximum: e => console.log("Stop Attempting!", e),
                onclose: e => console.log("ProcessSocket Closed!", e),
                onerror: e => {
                    dispatch({
                        type: actionTypes.PROCESS_SOCKET_CONNECTION_ERROR,
                        processError: 'failed due to network issue'
                    })
                }
            }
            );
            dispatch({
                type: actionTypes.PROCESS_SOCKET_CONNECTION_CLOSED,
                processSocket: ws
            })
        }
    }
}

export const checkExcel = (orgId) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.CHECK_EXCEL_STATUS_LOADING,
        })
        let url = EXCEL_UPLOAD_URL + '/status/' + orgId;
        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.CHECK_EXCEL_STATUS_SUCCESS,
                        checkExcelStatus: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response && error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.CHECK_EXCEL_STATUS_ERROR,
                    error: errMsg
                });
            });
    };
}

export const resetExcelData = (userdetails, orgId) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.CHECK_EXCEL_STATUS_LOADING,
        })
        let url = EXCEL_UPLOAD_URL + '/status/' + orgId;
        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.CHECK_EXCEL_STATUS_SUCCESS,
                        checkExcelStatus: { data: {} }
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.CHECK_EXCEL_STATUS_ERROR,
                    error: errMsg
                });
            });
    };
}

// export const downloadExcelStatus = (orgId, fileId) => {
//     return (dispatch) => {
//         dispatch({
//             type: actionTypes.DOWNLOAD_ERROR_EXCEL_STATUS_LOADING,
//         })
//         let url = EXCEL_UPLOAD_URL + '/download/error/status/' + orgId + '/' + fileId;
//         axios.put(url)
//             .then(response => {
//                 if (response.status === 200 || response.status === 201) {
//                     dispatch({
//                         type: actionTypes.DOWNLOAD_ERROR_EXCEL_STATUS_SUCCESS,
//                     });
//                 }
//             })
//             .catch(error => {
//                 let errMsg = error;
//                 if (error.response.data && error.response.data.errorMessage) {
//                     errMsg = error.response.data.errorMessage;
//                 }
//                 dispatch({
//                     type: actionTypes.DOWNLOAD_ERROR_EXCEL_STATUS_ERROR,
//                     error: errMsg
//                 });
//             });
//     };
// }

export const downloadErrorExcel = (orgId, fileName) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.DOWNLOAD_ERROR_EXCEL_LOADING,
        })
        let url = CUST_MGMT + '/excel/org/' + orgId + '/error/download';
        axios.get((url), {
            responseType: 'blob'
        })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data], { type: response.data.type }));
                const link = document.createElement('a');

                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();

                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.DOWNLOAD_ERROR_EXCEL_SUCCESS,
                    })
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.DOWNLOAD_ERROR_EXCEL_ERROR,
                    error: errMsg
                });
            });
    };
}

export const bgvInitiate = (orgId, fileId) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.BGV_INITIATE_EXCEL_LOADING,
        })
        let url = EXCEL_UPLOAD_URL + '/initiate/' + orgId + '?excelId=' + fileId;
        axios.post(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.BGV_INITIATE_EXCEL_SUCCESS,
                        bgvInitiateData: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.BGV_INITIATE_EXCEL_ERROR,
                    error: errMsg
                });
            });
    };
}

export const bgvReinitiate = (orgId, fileId) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.BGV_REINITIATE_EXCEL_LOADING,
        })
        let url = EXCEL_UPLOAD_URL + '/reinitiate/' + orgId + '?excelId=' + fileId;
        axios.post(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.BGV_REINITIATE_EXCEL_SUCCESS,
                        bgvReinitiateData: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.BGV_REINITIATE_EXCEL_ERROR,
                    error: errMsg
                });
            });
    };
}

export const getTagName = (tagId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_TAG_NAME_LOADING
        })

        let url = CUST_MGMT + '/tag?tagId=' + tagId;

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

export const changeStatus = (orgId, fileId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.CHANGE_STATUS_LOADING
        })

        let url = EXCEL_UPLOAD_URL + `/status/${orgId}/done/${fileId}`;

        axios.put(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.CHANGE_STATUS_SUCCESS
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
                    type: actionTypes.CHANGE_STATUS_ERROR,
                    error: errMsg
                });
            });
    };
};