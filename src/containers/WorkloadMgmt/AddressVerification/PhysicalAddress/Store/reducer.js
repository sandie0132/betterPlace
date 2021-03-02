import * as actionTypes from './actionTypes';
import { updateObject } from '../../Store/utility';
import * as initData from '../PhysicalAddressInitData';
import _ from 'lodash';

const initialState = {
    getIndividualTask: null,
    getIndividualTaskState: 'INIT',
    postIndividualTaskState: 'INIT',
    tagData: '',
    tagDataState: 'INIT',
    getTaskClosureStaticDataState: 'INIT',
    taskClosureStaticData: { ...initData.data },
    getAddressPictureState: 'INIT',
    addressImages: {},
    addressLoadingQueue: [],
    imageType: '',
    addressUrl: {},
    addAddressUrlState: 'INIT',
    deleteAddressUrlState: 'INIT',
    percentCompleted: 0,
    uploadUrlType: '',
    downloadAttachmentState: 'INIT',
    deleteUrlType: '',
    physicalSuccessData: {},
    error: null
}

const initState = (state) => {
    return initialState;
}

const getNotificationData = (state, action) => {
    return updateObject(state, {
        physicalSuccessData: {
            color: action.color,
            name: action.name
        }
    })
}

const getTaskClosureStaticDataLoading = (state, action) => {
    return updateObject(state, {
        getTaskClosureStaticDataState: 'LOADING'
    });
};

const getTaskClosureStaticDataSuccess = (state, action) => {
    return updateObject(state, {
        getTaskClosureStaticDataState: 'SUCCESS',
        taskClosureStaticData: action.staticData,
        error: null
    });
};

const getTaskClosureStaticDataError = (state, action) => {
    return updateObject(state, {
        getTaskClosureStaticDataState: 'ERROR',
        error: action.error
    });
};

const getIndividualTaskLoading = (state, action) => {
    return updateObject(state, {
        getIndividualTaskState: 'LOADING'
    });
};

const getIndividualTaskSuccess = (state, action) => {
    return updateObject(state, {
        getIndividualTaskState: 'SUCCESS',
        getIndividualTask: action.phyAddress,
        error: null
    });
};

const getIndividualTaskError = (state, action) => {
    return updateObject(state, {
        getIndividualTaskState: 'ERROR',
        error: action.error
    });
};

const getTagNameLoading = (state, action) => {
    return updateObject(state, {
        error: null,
        tagDataState: 'LOADING'
    })
}

const getTagNameSuccess = (state, action) => {
    return updateObject(state, {
        error: null,
        tagDataState: 'SUCCESS',
        tagData: action.tagData
    })
}

const getTagNameError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        tagDataState: 'ERROR'
    })
}

const postIndividualTaskLoading = (state, action) => {
    return updateObject(state, {
        postIndividualTaskState: 'LOADING'
    });
};

const postIndividualTaskSuccess = (state, action) => {
    return updateObject(state, {
        postIndividualTaskState: 'SUCCESS',
        error: null
    });
};

const postIndividualTaskError = (state, action) => {
    return updateObject(state, {
        postIndividualTaskState: 'ERROR',
        error: action.error
    });
};

const getAddressPicLoading = (state, action) => {
    return updateObject(state, {
        getAddressPictureState: 'LOADING',
        addressLoadingQueue: action.addressLoadingQueue,
    });
}

const getAddressPicSuccess = (state, action) => {
    return updateObject(state, {
        getAddressPictureState: 'SUCCESS',
        addressLoadingQueue: action.addressLoadingQueue,
        addressImages: action.addressImages,
        imageType: action.imageType,
        error: null
    });
};

const getAddressPicError = (state, action) => {
    return updateObject(state, {
        getAddressPictureState: 'ERROR',
        error: action.error,
    });
};

const addAddressUrlLoading = (state, action) => {
    return updateObject(state, {
        addAddressUrlState: 'LOADING',
        percentCompleted: action.percentCompleted,
        uploadUrlType: action.urlType
    });
};

const addAddressUrlSuccess = (state, action) => {
    let currentDownloadUrl = { ...state.addressUrl };
    _.forEach(action.downloadURL, function (value) {
        currentDownloadUrl = {
            ...currentDownloadUrl,
            [action.urlType]: value,
            [action.actionLabel]: 'approved'
        }
    })
    return updateObject(state, {
        addressUrl: currentDownloadUrl,
        error: null,
        addAddressUrlState: 'SUCCESS',
        percentCompleted: action.percentCompleted,
        uploadUrlType: action.urlType
    });
};

const addAddressUrlError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        addAddressUrlState: 'ERROR',
        uploadUrlType: ''
    })
}

const deleteAddressUrlLoading = (state, action) => {
    return updateObject(state, {
        deleteAddressUrlState: 'LOADING',
        deleteUrlType: action.urlType
    });
};

const deleteAddressUrlSuccess = (state, action) => {
    return updateObject(state, {
        addressUrl: action.downloadURL,
        error: null,
        deleteAddressUrlState: 'SUCCESS',
        deleteUrlType: action.urlType
    });
};

const deleteAddressUrlError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        addAddressUrlState: 'ERROR'
    })
}

// const downloadAttachmentLoading = (state, action) => {
//     return updateObject(state, {
//         downloadAttachmentState: 'LOADING'
//     })
// }

// const downloadAttachmentSuccess = (state, action) => {
//     return updateObject(state, {
//         error: null,
//         downloadAttachmentState: 'SUCCESS',
//     })
// }

// const downloadAttachmentError = (state, action) => {
//     return updateObject(state, {
//         error: action.error,
//         downloadAttachmentState: 'ERROR'
//     })
// }

const getAddressImagesInitState = (state) => {
    return updateObject(state, {
        addressUrl: {},
        addAddressUrlState: 'INIT',
        deleteAddressUrlState: 'INIT',
        uploadUrlType: '',
        deleteUrlType: '',
    })
}


const reducer = (state = initialState, action) => {
    switch (action.type) {

        case actionTypes.INIT_STATE: return initState();

        case actionTypes.GET_TASK_CLOSURE_STATIC_DATA_LOADING: return getTaskClosureStaticDataLoading(state, action);
        case actionTypes.GET_TASK_CLOSURE_STATIC_DATA_SUCCESS: return getTaskClosureStaticDataSuccess(state, action);
        case actionTypes.GET_TASK_CLOSURE_STATIC_DATA_ERROR: return getTaskClosureStaticDataError(state, action);

        case actionTypes.GET_INDIVIDUAL_TASK_LOADING: return getIndividualTaskLoading(state, action);
        case actionTypes.GET_INDIVIDUAL_TASK_SUCCESS: return getIndividualTaskSuccess(state, action);
        case actionTypes.GET_INDIVIDUAL_TASK_ERROR: return getIndividualTaskError(state, action);

        case actionTypes.GET_TAG_NAME_LOADING: return getTagNameLoading(state, action);
        case actionTypes.GET_TAG_NAME_SUCCESS: return getTagNameSuccess(state, action);
        case actionTypes.GET_TAG_NAME_ERROR: return getTagNameError(state, action);

        case actionTypes.POST_INDIVIDUAL_TASK_LOADING: return postIndividualTaskLoading(state, action);
        case actionTypes.POST_INDIVIDUAL_TASK_SUCCESS: return postIndividualTaskSuccess(state, action);
        case actionTypes.POST_INDIVIDUAL_TASK_ERROR: return postIndividualTaskError(state, action);

        case actionTypes.GET_ADDRESS_PIC_LOADING: return getAddressPicLoading(state, action);
        case actionTypes.GET_ADDRESS_PIC_SUCCESS: return getAddressPicSuccess(state, action);
        case actionTypes.GET_ADDRESS_PIC_ERROR: return getAddressPicError(state, action);

        case actionTypes.UPLOAD_PHYSICAL_ADDRESS_LOADING: return addAddressUrlLoading(state, action);
        case actionTypes.UPLOAD_PHYSICAL_ADDRESS_SUCCESS: return addAddressUrlSuccess(state, action);
        case actionTypes.UPLOAD_PHYSICAL_ADDRESS_ERROR: return addAddressUrlError(state, action);

        case actionTypes.DELETE_PHYSICAL_ADDRESS_LOADING: return deleteAddressUrlLoading(state, action);
        case actionTypes.DELETE_PHYSICAL_ADDRESS_SUCCESS: return deleteAddressUrlSuccess(state, action);
        case actionTypes.DELETE_PHYSICAL_ADDRESS_ERROR: return deleteAddressUrlError(state, action);

        // case actionTypes.DOWNLOAD_ATTACHMENT_LOADING: return downloadAttachmentLoading(state, action);
        // case actionTypes.DOWNLOAD_ATTACHMENT_SUCCESS: return downloadAttachmentSuccess(state, action);
        // case actionTypes.DOWNLOAD_ATTACHMENT_ERROR: return downloadAttachmentError(state, action);

        case actionTypes.GET_INDIVIDUAL_TASK_NOTIFICATION: return getNotificationData(state, action);

        case actionTypes.GET_ADDRESS_IMAGES_INTI_STATE: return getAddressImagesInitState(state);

        default: return state;

    }
}

export default reducer;