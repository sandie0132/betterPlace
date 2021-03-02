import * as actionTypes from './actionTypes';
import axios from 'axios';
import _ from 'lodash';

const BGV_ADDRESS = process.env.REACT_APP_BGV_ADDRESS_VERIFICATION;

export const getAddressPic = (type, filePath, otherType) => {
    return (dispatch, getState) => {
        const addressLoadingQueue = _.cloneDeep(getState().imageStore.addressLoadingQueue);
        // const addressImages = _.cloneDeep(getState().imageStore.addressImages);
                const updatedaddressLoadingQueue = [type, ...addressLoadingQueue];
                dispatch({
                    type: actionTypes.GET_ADDRESS_PIC_LOADING,
                    addressLoadingQueue: updatedaddressLoadingQueue,
                })
                let apiUrl = BGV_ADDRESS+"/physical/image/download/"+filePath;
                axios.get(apiUrl, {responseType: 'arraybuffer' })
                    .then(response => {
                        if (response.status === 200 || response.status === 201) {
                            let blob = new Blob([response.data], {type: response.headers['content-type']});
                            let image = URL.createObjectURL(blob);
                            let updatedImageStore = _.cloneDeep(getState().imageStore.addressImages);
                            let updatedLoadingList = _.cloneDeep(getState().imageStore.addressLoadingQueue);
                            updatedImageStore[type] = {
                                'image': image,
                                'filePath': filePath,
                                'otherType' : otherType
                            }
                            let updatedImageLoadingList = _.filter(updatedLoadingList, function(entry) {
                                return entry !== type;
                            });
                            dispatch({
                                type: actionTypes.GET_ADDRESS_PIC_SUCCESS,
                                addressImages: updatedImageStore,
                                addressLoadingQueue: updatedImageLoadingList,
                                imageType : type
                            });
                        }
                    })
                    .catch(error => {
                        let errMsg = error;
                        if (error.response && error.response.data.errorMessage) {
                            errMsg = error.response.data.errorMessage;
                        }
                        dispatch({
                            type: actionTypes.GET_ADDRESS_PIC_ERROR,
                            error: errMsg
                        });
                    });
    };
}

export const uploadPhysicalAddressUrl = (type, data, urlType, actionLabel, serviceRequestId, otherType) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.UPLOAD_PHYSICAL_ADDRESS_LOADING,
            percentCompleted: 0,
            urlType : urlType,
            otherType : otherType
        })
        let downloadURL = []
        let url = BGV_ADDRESS + "/physical/image/upload/physical-address-agency-images/ops?serviceRequestId=" + serviceRequestId + '&addressComponent=' + urlType.replace(/ /g,'_');

        axios.post(url, data, {
            onUploadProgress: function (progressEvent) {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                dispatch({
                    type: actionTypes.UPLOAD_PHYSICAL_ADDRESS_LOADING,
                    percentCompleted: percentCompleted,
                    urlType : urlType,
                    otherType : otherType
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
                        actionLabel : actionLabel,
                        otherType : otherType
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