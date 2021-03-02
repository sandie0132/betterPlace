import * as actionTypes from './actionTypes';
import _ from 'lodash';
import axios from 'axios';

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


export const uploadFile = (type, data, docType) => {
    return (dispatch, getState) => {
        let config = { headers: { 'Content-Type': 'multipart/form-data'} }
        dispatch({
            type: actionTypes.UPLOAD_FILE_LOADING,
            docType: docType
        })
        let url = CUST_MGMT + `/file/upload?`
        if (type) {
            url += 'folder=' + type
        }
        axios.post(url, data, config)
            .then(response => {
                if (response.status === 200 || response.status === 201) {

                    let aadharFile = _.cloneDeep(getState().empMgmt.empOnboard.additionalDetails.empDocuments.aadharFile)
                    let panFile = _.cloneDeep(getState().empMgmt.empOnboard.additionalDetails.empDocuments.panFile)
                    let dlFile = _.cloneDeep(getState().empMgmt.empOnboard.additionalDetails.empDocuments.dlFile)
                    let voterFile = _.cloneDeep(getState().empMgmt.empOnboard.additionalDetails.empDocuments.voterFile)
                    let passportFile = _.cloneDeep(getState().empMgmt.empOnboard.additionalDetails.empDocuments.passportFile)
                    let consentFile = _.cloneDeep(getState().empMgmt.empOnboard.additionalDetails.empDocuments.consentFile)
                    let rcFile = _.cloneDeep(getState().empMgmt.empOnboard.additionalDetails.empDocuments.rcFile)
                    let uploadURL = _.cloneDeep(response.data.downloadURL)

                    if (docType === 'panData') {
                        panFile = [...uploadURL, ...panFile];
                    }
                    else if (docType === 'dlData') {
                        dlFile = [...uploadURL, ...dlFile];
                    }
                    else if (docType === 'aadharData') {
                        aadharFile = [...uploadURL, ...aadharFile];
                    }
                    else if (docType === 'voterData') {
                        voterFile = [...uploadURL, ...voterFile];
                    }
                    else if (docType === 'passportData') {
                        passportFile = [...uploadURL, ...passportFile];
                    }
                    else if (docType === 'consentData') {
                        consentFile = [...uploadURL, ...consentFile];
                    }
                    else if (docType === 'rcData') {
                        rcFile = [...uploadURL, ...rcFile];
                    }

                    dispatch({
                        type: actionTypes.UPLOAD_FILE_SUCCESS,
                        aadharFile: aadharFile,
                        panFile: panFile,
                        dlFile: dlFile,
                        voterFile: voterFile,
                        passportFile: passportFile,
                        consentFile: consentFile,
                        rcFile: rcFile,
                        docType: docType
                    })
                }
            })
            .catch(error => {
                console.log(error);
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.UPLOAD_FILE_ERROR,
                    error: errMsg,
                    docType: docType
                });
            });
    }
}




export const deleteFile = (dataId, type, fileName, targetURL, docType) => {
    return (dispatch, getState) => {
        dispatch({
            type: actionTypes.DELETE_FILE_LOADING,
            docType: docType

        })
        let url = CUST_MGMT + `/file/remove?`;
        if (type) {
            url += 'folder=' + type;
        }
        if (dataId) {
            url += '&uuid=' + dataId;
        }
        if (fileName) {
            url += '&fileName=' + fileName;
        }
        axios.delete(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.DELETE_FILE_SUCCESS,
                        deleteUrl: targetURL,
                        docType: docType,

                    })
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.DELETE_FILE_ERROR,
                    error: errMsg,
                    docType: docType
                });
            })
    }
}

export const downloadFile = (type, fileId, docType) => {
    let fileName = fileId.split('/');
    fileName = fileName[fileName.length - 1];
    
    return dispatch => {
        dispatch({
            type: actionTypes.DOWNLOAD_FILE_LOADING,
            docType: docType
        })

        let url = CUST_MGMT + `/file/download/${type}/${fileName}`;
        ///customer-mgmt/file/download/DOCUMENT/_SAMIR_SARKAR_summary_report1588756386941.pdf

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
                        docType: docType
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
                    docType: docType,
                    error: errMsg
                });
            });
    };
}