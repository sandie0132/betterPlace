import axios from 'axios';
import * as actionTypes from './actionTypes';

const EXCEL_UPLOAD_URL = process.env.REACT_APP_EXCEL_UPLOAD;
const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

export const initState = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.INIT_STATE
        })
    };
};

export const getTimelineData = (orgId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.TIMELINE_DATA_LOADING
        })

        let url = EXCEL_UPLOAD_URL + '/history/' + orgId;
        axios.get(url).then(response => {
            if (response.status === 200 || response.status === 201) {
                dispatch({
                    type: actionTypes.TIMELINE_DATA_SUCCESS,
                    timelineData: response.data
                });
            }
        }).catch(error => {
            // let errMsg = error;
            // if (error.response.data && error.response.data.errorMessage) {
            //     errMsg = error.response.data.errorMessage;
            // }
            dispatch({
                type: actionTypes.TIMELINE_DATA_ERROR,
                error: error
            });
        });

    }
};

export const getUserDetails = (orgId, userId) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_USER_DETAILS_LOADING,
        })
        let url = EXCEL_UPLOAD_URL + '/user/' + userId + '/info/' + orgId;
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

export const getDownloadFile = (fileId, orgId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.TIMELINE_FILE_DOWNLOAD_LOADING
        })

        let url = CUST_MGMT + `/excel/org/${orgId}/timeline/${fileId}/download`;
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
                        type: actionTypes.TIMELINE_FILE_DOWNLOAD_SUCCESS,
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
                    type: actionTypes.TIMELINE_FILE_DOWNLOAD_ERROR,
                    error: errMsg
                });
            });
    };
}