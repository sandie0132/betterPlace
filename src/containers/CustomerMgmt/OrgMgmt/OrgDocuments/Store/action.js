import * as actionTypes from './actionTypes';
import axios from 'axios';
import _ from 'lodash'

//Init State Action Dispatch
const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

//Init State Action Dispatch
export const initState = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.INIT_STATE
        })
    };
};

//Reset DownloadUrlList Action Dispatch
export const resetDownloadUrl = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.RESET_DOWNLOAD_URL_LIST
        })
    };
};

//Reset DeleteUrl Action Dispatch
export const resetDeleteUrl = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.RESET_DELETE_URL
        })
    };
};

//Get DataList Action Dispatch
export const getDataList = (orgId) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_DATA_LIST_LOADING
        })
        axios.get(CUST_MGMT+`/org/${orgId}/document`)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_DATA_LIST_SUCCESS,
                        dataList: response.data,
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_DATA_LIST_ERROR,
                    error: errMsg
                });
            });
    };
};

//Post Data Action Dispatch
export const postData = (orgId, data) => {
    return (dispatch, getState) => {
        dispatch({
            type: actionTypes.POST_DATA_LOADING
        })
        axios.post(CUST_MGMT+`/org/${orgId}/document`, data)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    const newData = response.data;
                    let updatedDataList = [newData,
                        ...getState().orgMgmt.orgDocuments.dataList,
                    ]
                    dispatch({
                        type: actionTypes.POST_DATA_SUCCESS,
                        dataList: updatedDataList,
                        currentDataId:response.data.uuid
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.POST_DATA_ERROR,
                    error: errMsg
                })
            });
    };
};

//Put Data Action Dispatch
export const putData = (orgId, dataId, data) => {
    return (dispatch, getState) => {
        dispatch({
            type: actionTypes.PUT_DATA_LOADING
        })
        axios.put(CUST_MGMT+`/org/${orgId}/document/${dataId}`, data)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    let updatedDataList = getState().orgMgmt.orgDocuments.dataList;
                    updatedDataList = updatedDataList.map((Item) => {
                        if(Item.uuid === dataId){
                            return(response.data);
                        }
                        return(Item);
                    });
                    dispatch({
                        type: actionTypes.PUT_DATA_SUCCESS,
                        dataList: updatedDataList,
                        currentDataId:response.data.uuid

                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.PUT_DATA_ERROR,
                    error: errMsg
                })
            });
    };
};
//Delete Data Action Dispatch
export const deleteData = (orgId, dataId) => {
    return (dispatch, getState) => {
        dispatch({
            type: actionTypes.DELETE_DATA_LOADING
        })
        axios.delete(CUST_MGMT+`/org/${orgId}/document/${dataId}`)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    let updatedDataList = getState().orgMgmt.orgDocuments.dataList;
                    updatedDataList = updatedDataList.filter((Item) => {
                        if(Item.uuid === dataId) return null ;
                        else return Item;
                    });
                    dispatch({
                        type: actionTypes.DELETE_DATA_SUCCESS,
                        dataList: updatedDataList
                    });
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.DELETE_DATA_ERROR,
                    error: errMsg,
                    currentDataId : dataId
                })
            });
    };
};


//Upload File Action Dispatch
export const uploadFile = (type, data, dataId) => {
    return (dispatch, getState) => {
        let config = { headers: { 'Content-Type': 'multipart/form-data'} }
        dispatch({
            type: actionTypes.UPLOAD_FILE_LOADING
        })
        let url = CUST_MGMT+`/file/upload?`;
        if(type) {
            url += '&folder=' + type;
        }
        axios.post(url, data, config)
            .then(response =>{   
                if (response.status === 200 || response.status === 201) {
                    let downloadURL = _.cloneDeep(getState().orgMgmt.orgDocuments.downloadURL)
                    let uploadURL = response.data.downloadURL;
                    downloadURL = [...uploadURL, ...downloadURL];
                    const updatedDataId = dataId === undefined ? null : dataId;
                    dispatch({
                        type: actionTypes.UPLOAD_FILE_SUCCESS,
                        downloadURL: downloadURL,
                        currentDataId: updatedDataId
                    });    
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.UPLOAD_FILE_ERROR,
                    error:errMsg
                });
            });
    };

};


//Upload File Action Dispatch
export const deleteFile = (type, dataId, fileName, targetURL) => {
    return (dispatch ,getState) => {
        dispatch({
            type: actionTypes.DELETE_FILE_LOADING
        })
        let url = CUST_MGMT+`/file/remove?`;
        if(type) {
            url += 'folder=' + type;   
        }
        if(dataId) {
            url += '&uuid=' + dataId;
        }
        if(fileName) {
            url += '&fileName=' + fileName;
        }
        axios.delete(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    const updatedDataId = dataId === undefined ? null : dataId;
                    dispatch({
                        type: actionTypes.DELETE_FILE_SUCCESS,
                        currentDataId: updatedDataId,
                        deleteUrl: targetURL,
                    })
                }
            })
            .catch(error => {
                let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.DELETE_FILE_ERROR,
                    error: errMsg
                });   
            })
    }
}

export const downloadFile = (type, fileId) => {
    let fileName = fileId.split('/');
    fileName = fileName[fileName.length - 1];
    
    return dispatch => {
        dispatch({
            type: actionTypes.DOWNLOAD_FILE_LOADING
        })

        let url = CUST_MGMT + `/file/download/${type}/${fileName}`;

        axios.get((url), {
            responseType: 'blob'
        })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data], { type: response.data.type }));
                const link = document.createElement('a');

                let fileName = response.headers['content-disposition'].split(/foo/);
                fileName = fileName[0].split(' ');
                fileName = fileName[1].split('=');
                fileName = fileName[1].split('.');

                link.href = url;
                link.setAttribute('download', fileName[0]);
                document.body.appendChild(link);
                link.click();

                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.DOWNLOAD_FILE_SUCCESS,
                    })
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
                    type: actionTypes.DOWNLOAD_FILE_ERROR,
                    error: errMsg
                });
            });
    };
}