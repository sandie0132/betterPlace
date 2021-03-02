import * as actionTypes from './actionTypes';
import * as initData from './StaticDataInitData';
import axios from 'axios';
import _ from 'lodash';

// const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;
const WORKLOAD_MGMT = process.env.REACT_APP_WORKLOAD_MGMT_URL
const PLATFORM_SERVICES = process.env.REACT_APP_PLATFORM_API_URL;
const BGV_ADDRESS = process.env.REACT_APP_BGV_ADDRESS_VERIFICATION;

export const initialState = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.INIT_STATE
        })
    }
}

export const getCardMessages = () => {
    let data = initData.data
    return dispatch => {
        dispatch({
            type: actionTypes.GET_CARD_COMMENTS_LOADING
        })
        axios.post(PLATFORM_SERVICES+`/staticdata`, data)
        .then(response => {
            if(response.status === 200 || response.status === 201){
                dispatch({
                    type: actionTypes.GET_CARD_COMMENTS_SUCCESS,
                    cardComments: response.data[0].CARD_COMMENTS
                });
            }
        })
        .catch(error => {
            let errMsg  = error;
                if(error.response.data && error.response.data.errorMessage){
                    errMsg= error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_CARD_COMMENTS_ERROR,
                    error: errMsg
                });
        })
    }
}

export const addImage = (type, data, serviceRequestId, dataId) => {
    return (dispatch, getState) => {
        let config = { headers: { 'Content-Type': 'multipart/form-data'} }
        let downloadURL = []
        dispatch({
            type: actionTypes.ADD_IMAGE_LOADING,
            uploadType : type,
            dataId : dataId
        })
        let url = WORKLOAD_MGMT + "/file/upload?serviceRequestId=" + serviceRequestId;
        if (type) {
            url += '&type=' + type;
        }
        axios.post(url, data, config)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    //let downloadURL = _.cloneDeep(getState().empMgmt.empEducation.downloadURL)
                    let uploadURL = _.cloneDeep(response.data.downloadURL)
                    for (let i = 0; i < uploadURL.length; i++) {
                        downloadURL.push(uploadURL[i]);
                    }
                    dispatch({
                        type: actionTypes.ADD_IMAGE_SUCCESS,
                        downloadURL: downloadURL,
                        uploadType : type,
                        dataId : dataId
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.ADD_IMAGE_ERROR,
                    error: errMsg
                });
            });
    };

};

export const deleteImage = (type, dataId, fileName, targetURL) => {
    return (dispatch, getState) => {
        dispatch({
            type: actionTypes.DELETE_IMAGE_LOADING,
            deleteType:type
        })
        let url = WORKLOAD_MGMT + `/file/delete?`;
        if (type) {
            url += 'type=' + type;
        }
        // if (dataId) {
        //     url += '&uuid=' + dataId;
        // }
        if (fileName) {
            url += '&fileName=' + fileName;
        }
        axios.delete(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    // let updatedDataList = _.cloneDeep(getState().empMgmt.empEducation.dataList);
                    let downloadURL = _.cloneDeep(getState().workloadMgmt.attachmentUrl.downloadURL)
                    // if (dataId) {
                        
                    //     updatedDataList = updatedDataList.map((Item) => {
                    //         if (Item.uuid === dataId) {
                    //             let newItem = _.cloneDeep(Item);
                    //             newItem.downloadURL = Item.downloadURL.filter((url) => {
                    //                 if (url === targetURL) return null;
                    //                 else return url;
                    //             })
                    //             return newItem;
                    //         }
                    //         else return Item;
                    //     });
                    // }
                    // else{
                        
                        downloadURL = downloadURL.filter((url) => {
                            if(url === targetURL) return null;
                            else return url;
                        })
                        
                    // }
                    dispatch({
                        type: actionTypes.DELETE_IMAGE_SUCCESS,
                        // dataList: updatedDataList,
                        downloadURL: downloadURL,
                        deleteType:type
                        // currentDataId: dataId
                    })
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.DELETE_IMAGE_ERROR,
                    error: errMsg
                });
            })
    }
}

export const uploadPhysicalAddressUrl = (type, data, urlType, actionLabel, serviceRequestId) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.UPLOAD_PHYSICAL_ADDRESS_LOADING,
            percentCompleted: 0,
            urlType : urlType
        })
        let downloadURL = []
        let url = BGV_ADDRESS + "/physical/image/upload/physical-address-agency-images/ops?serviceRequestId=" + serviceRequestId + '&addressComponent=' + urlType.replace(' ','_');

        axios.post(url, data, {
            onUploadProgress: function (progressEvent) {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                dispatch({
                    type: actionTypes.UPLOAD_PHYSICAL_ADDRESS_LOADING,
                    percentCompleted: percentCompleted,
                    urlType : urlType,
                })
            }    
        })
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    let uploadURL = _.cloneDeep(response.data.downloadURL)
                    for (let i = 0; i < uploadURL.length; i++) {
                        downloadURL.push(uploadURL[i]);
                    }
                    dispatch({
                        type: actionTypes.UPLOAD_PHYSICAL_ADDRESS_SUCCESS,
                        downloadURL: downloadURL,
                        uploadType : type,
                        urlType : urlType,
                        percentCompleted : 100,
                        actionLabel : actionLabel
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response && error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.UPLOAD_PHYSICAL_ADDRESS_ERROR,
                    error: errMsg
                });
            });
    };

};

export const deletePhysicalAddressUrl = (type, fileName, urlType, action, targetURL) => {
    return (dispatch, getState) => {
        dispatch({
            type: actionTypes.DELETE_PHYSICAL_ADDRESS_LOADING,
            urlType: urlType
        })
        
        let url = BGV_ADDRESS + `/physical/image/delete/${fileName}`
        axios.delete(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    let downloadURL = _.cloneDeep(getState().workloadMgmt.attachmentUrl.addressUrl);
                    let updatedDownloadUrl = {};
                    _.forEach(downloadURL, function(key,value){
                        if(value !== urlType && value !== action){
                            updatedDownloadUrl = {...updatedDownloadUrl,
                                                    [value] : key
                            }
                        }
                    })
                    dispatch({
                        type: actionTypes.DELETE_PHYSICAL_ADDRESS_SUCCESS,
                        downloadURL: updatedDownloadUrl,
                        deleteType:type,
                        urlType: urlType
                    })
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.DELETE_PHYSICAL_ADDRESS_ERROR,
                    error: errMsg
                });
            })
    }
}

export const downloadAttachment = (url) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.DOWNLOAD_ATTACHMENT_LOADING,
        })
        
        axios.get((WORKLOAD_MGMT + "/" + url), {
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
                        type: actionTypes.DOWNLOAD_ATTACHMENT_SUCCESS,
                    })
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.DOWNLOAD_ATTACHMENT_ERROR,
                    error: errMsg
                });
            });
    };
}