import * as initData from '../PhysicalAddressInitData';
import * as actionTypes from './actionTypes';
import axios from 'axios';
import _ from 'lodash';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;
const PLATFORM_SERVICES = process.env.REACT_APP_PLATFORM_API_URL;
const BGV_ADDRESS = process.env.REACT_APP_BGV_ADDRESS_VERIFICATION;
const WORKLOAD_MGMT = process.env.REACT_APP_WORKLOAD_MGMT_URL;

export const initState = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.INIT_STATE
        })
    };
};

export const sendNotificationData = (color, name) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_INDIVIDUAL_TASK_NOTIFICATION,
            color: color,
            name: name
        })
    }
}

export const getIndividualTask = (serviceRequestId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_INDIVIDUAL_TASK_LOADING
        })
        let url = BGV_ADDRESS + `/physical/task/details/${serviceRequestId}`;
        axios.get(url)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.GET_INDIVIDUAL_TASK_SUCCESS,
                        phyAddress: response.data
                    })
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_INDIVIDUAL_TASK_ERROR,
                    error: errMsg
                });
            })
    }
}

export const getTagName = (tagId) => {
    return dispatch => {
        dispatch({
            type: actionTypes.GET_TAG_NAME_LOADING
        })

        let url = CUST_MGMT + `/tag?tagId=${tagId}`;

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

export const postAgencyPhysicalAddress = (payload, serviceRequestId, isQc) => {
    return dispatch => {
        dispatch({
            type: actionTypes.POST_INDIVIDUAL_TASK_LOADING
        })
        let url = '';
        if (isQc) {
            url = WORKLOAD_MGMT + "/task/complete/physical_address/" + serviceRequestId;
        } else {
            url = BGV_ADDRESS + `/physical/task/close/${serviceRequestId}`;
        }
        axios.post(url, payload)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch({
                        type: actionTypes.POST_INDIVIDUAL_TASK_SUCCESS,
                        phyAddress: response.data
                    })
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.POST_INDIVIDUAL_TASK_ERROR,
                    error: errMsg
                });
            })
    }
}

export const getTaskClosureStaticData = () => {
    const data = initData.data;
    let taskClosureStaticData = {};

    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_TASK_CLOSURE_STATIC_DATA_LOADING
        })
        axios.post(PLATFORM_SERVICES + `/staticdata`, data)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    _.forEach(response.data, function (object) {
                        _.forEach(object, function (value, key) {
                            taskClosureStaticData[key] = value;
                        })
                    })
                    dispatch({
                        type: actionTypes.GET_TASK_CLOSURE_STATIC_DATA_SUCCESS,
                        staticData: taskClosureStaticData
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_TASK_CLOSURE_STATIC_DATA_ERROR,
                    error: errMsg
                });
            });
    };
};

export const getAddressPic = (type, filePath, otherType) => {

    // console.log(type);

    return (dispatch, getState) => {
        const addressLoadingQueue = _.cloneDeep(getState().imageStore.addressLoadingQueue);
        // const addressImages = _.cloneDeep(getState().imageStore.addressImages);
        const updatedaddressLoadingQueue = [type, ...addressLoadingQueue];
        // console.log("updatedaddressLoadingQueue", updatedaddressLoadingQueue);

        dispatch({
            type: actionTypes.GET_ADDRESS_PIC_LOADING,
            addressLoadingQueue: updatedaddressLoadingQueue,
        })
        let apiUrl = BGV_ADDRESS + "/physical/image/download/" + filePath;
        axios.get(apiUrl, { responseType: 'arraybuffer' })
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    let blob = new Blob([response.data], { type: response.headers['content-type'] });
                    let image = URL.createObjectURL(blob);
                    let updatedImageStore = _.cloneDeep(getState().imageStore.addressImages);
                    let updatedLoadingList = _.cloneDeep(getState().imageStore.addressLoadingQueue);
                    updatedImageStore[type] = {
                        'image': image,
                        'filePath': filePath,
                        'otherType': otherType
                    }
                    let updatedImageLoadingList = _.filter(updatedLoadingList, function (entry) {
                        return entry !== type;
                    });
                    // console.log("updatedImageLoadingList",updatedImageLoadingList);

                    dispatch({
                        type: actionTypes.GET_ADDRESS_PIC_SUCCESS,
                        addressImages: updatedImageStore,
                        addressLoadingQueue: updatedImageLoadingList,
                        imageType: type
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

export const uploadPhysicalAddressUrl = (type, data, urlType, actionLabel, serviceRequestId) => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.UPLOAD_PHYSICAL_ADDRESS_LOADING,
            percentCompleted: 0,
            urlType: urlType
        })
        let downloadURL = []
        let url = BGV_ADDRESS + "/physical/image/upload/physical-address-agency-images/ops?serviceRequestId=" + serviceRequestId + '&addressComponent=' + urlType.replace(/ /g, '_');

        axios.post(url, data, {
            onUploadProgress: function (progressEvent) {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                dispatch({
                    type: actionTypes.UPLOAD_PHYSICAL_ADDRESS_LOADING,
                    percentCompleted: percentCompleted,
                    urlType: urlType,
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
                        urlType: urlType,
                        percentCompleted: 100,
                        actionLabel: actionLabel
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
                    _.forEach(downloadURL, function (key, value) {
                        if (value !== urlType && value !== action) {
                            updatedDownloadUrl = {
                                ...updatedDownloadUrl,
                                [value]: key
                            }
                        }
                    })
                    dispatch({
                        type: actionTypes.DELETE_PHYSICAL_ADDRESS_SUCCESS,
                        downloadURL: updatedDownloadUrl,
                        deleteType: type,
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

export const ImagesInitState = () => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_ADDRESS_IMAGES_INTI_STATE,
        })
    }
}