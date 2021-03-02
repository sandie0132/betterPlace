import * as actionTypes from './actionTypes';
import axios from 'axios';
import _ from 'lodash';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;
const BGV_ADDRESS = process.env.REACT_APP_BGV_ADDRESS_VERIFICATION;

export const getProfilePic = (empId, filePath) => {
    return (dispatch, getState) => {
        const loadingQueue = _.cloneDeep(getState().imageStore.loadingQueue);
        const images = _.cloneDeep(getState().imageStore.images);
        
        if(!_.includes(loadingQueue, empId)){
            if(!(images[empId] && images[empId]['filePath'] === filePath)){
              
                const updatedLoadingQueue = [empId, ...loadingQueue];
                dispatch({
                    type: actionTypes.GET_PROFILE_PIC_LOADING,
                    loadingQueue: updatedLoadingQueue
                })

                let apiUrl = CUST_MGMT+'/'+filePath;
                axios.get(apiUrl , {responseType: 'arraybuffer' })
                    .then(response => {
                        if (response.status === 200 || response.status === 201) {
                            let blob = new Blob([response.data], {type: response.headers['content-type']});
                            let image = URL.createObjectURL(blob);
                            let updatedImageStore = _.cloneDeep(getState().imageStore.images);
                            let updatedLoadingList = _.cloneDeep(getState().imageStore.loadingQueue);
                            updatedImageStore[empId] = {
                                'image': image,
                                'filePath': filePath
                            }
                            let updatedImageLoadingList = _.filter(updatedLoadingList, function(entry) {
                                return entry !== empId;
                            });
                            dispatch({
                                type: actionTypes.GET_PROFILE_PIC_SUCCESS,
                                images: updatedImageStore,
                                loadingQueue: updatedImageLoadingList,
                            });
                        }
                    })
                    .catch(error => {
                        let errMsg = error;
                        if (error.response && error.response.data.errorMessage) {
                            errMsg = error.response.data.errorMessage;
                        }
                        dispatch({
                            type: actionTypes.GET_PROFILE_PIC_ERROR,
                            error: errMsg
                        });
                    });
            }
        }
    };
}

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

export const ImagesInitState = () => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_ADDRESS_IMAGES_INTI_STATE,
        })
    }
}

export const initState = () => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.INIT_STATE,
        })
    }
}