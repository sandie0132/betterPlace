import * as actionTypes from './actionTypes';
import axios from 'axios';
import _ from 'lodash';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

//Init State Action Dispatch
export const initState = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.INIT_STATE
        })
    };
};

//Upload File Action Dispatch
export const uploadFile = (file, fileUploadIndex) => {
    const type = 'employee_documents';
    return (dispatch) => {
        let config = { headers: { 'Content-Type': 'multipart/form-data' } }
        dispatch({
            type: actionTypes.UPLOAD_FILE_LOADING,
            fileUploadIndex: fileUploadIndex
        })
        let url = CUST_MGMT + `/file/upload?folder=` + type;
        axios.post(url, file, config)
        .then(response => {
            if (response.status === 200 || response.status === 201) {
                let uploadedFileUrl = response.data.downloadURL;
                dispatch({
                    type: actionTypes.UPLOAD_FILE_SUCCESS,
                    uploadedFileUrl: uploadedFileUrl,
                    fileUploadIndex: fileUploadIndex
                });
            }
        })
        .catch(error => {
            let errMsg = error;
            if (error.response.data && error.response.data.errorMessage) {
                errMsg = error.response.data.errorMessage;
            }
            dispatch({
                type: actionTypes.UPLOAD_FILE_ERROR,
                error: errMsg
            });
        });
    };

};

export const downloadFile = (fileUrl) => {
    const type = 'employee_documents';
    let fileName = fileUrl.split('/');
    fileName = fileName[fileName.length - 1];
    return (dispatch, getState) => {
        let updatedDownloadURL = _.cloneDeep(getState().empMgmt.empOnboard.additionalDetails.empEmployment.downloadURL);
        updatedDownloadURL = [...updatedDownloadURL, fileUrl]
        dispatch({
            type: actionTypes.DOWNLOAD_FILE_LOADING,
            downloadURL: updatedDownloadURL
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
                let downloadURL = _.cloneDeep(getState().empMgmt.empOnboard.additionalDetails.empEmployment.downloadURL);
                downloadURL = [...updatedDownloadURL, fileUrl]
                _.remove(downloadURL, function (url) {
                    return url === fileUrl;
                });
                dispatch({
                    type: actionTypes.DOWNLOAD_FILE_SUCCESS,
                    downloadURL: downloadURL
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