import { combineReducers } from 'redux';
import * as actionTypes from './actionTypes';
import { updateObject } from './utility';
import _ from 'lodash';

import ServiceVerificationReducer from '../ServiceVerification/Store/reducer';
import courtVerificationReducer from '../ServiceVerification/TaskSearchCloseReview/TaskCloseReview/CourtVerification/Store/reducer';
import addressVerificationReducer from '../AddressVerification/Store/reducer';

const initialState = {
    cardComments: [],
    downloadURL: [],
    crcUrl: [],
    crcUrlState: "INIT",
    cardCommentsState: 'INIT',
    deleteDocumentState: 'INIT',
    deleteDocumentType: "",
    addDocumentState: 'INIT',
    addDocumentType: "",
    dataId: '',
    addressUrl: {},
    addAddressUrlState: 'INIT',
    deleteAddressUrlState: 'INIT',
    percentCompleted: 0,
    uploadUrlType: '',
    downloadAttachmentState: 'INIT',
    deleteUrlType: '',
    isOtherType : '',
    error: null
}

const getCardMessagesLoading = (state) => {
    return updateObject(state, {
        cardCommentsState: 'LOADING'
    })
}

const getCardMessagesSuccess = (state, action) => {
    return updateObject(state, {
        cardCommentsState: 'SUCCESS',
        cardComments: action.cardComments
    })
}

const getCardMessagesError = (state, action) => {
    return updateObject(state, {
        cardCommentsState: 'ERROR',
        error: action.error
    })
}

const addImageLoading = (state, action) => {
    return updateObject(state, {
        addDocumentState: 'LOADING',
        addDocumentType: action.uploadType,
        dataId: action.dataId
    });
};

const addImageSuccess = (state, action) => {
    let currentDownloadUrl = [...state.downloadURL]
    _.forEach(action.downloadURL, function (value, key) {
        currentDownloadUrl.push(value)
    })
    return updateObject(state, {
        downloadURL: currentDownloadUrl,
        error: null,
        addDocumentState: 'SUCCESS',
        addDocumentType: action.uploadType,
        dataId: action.dataId
    });
};

const addImageError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        addDocumentState: 'ERROR'
    })
}

const deleteImageLoading = (state, action) => {
    return updateObject(state, {
        deleteDocumentState: 'LOADING',
        deleteDocumentType: action.deleteType
    })
}

const deleteImageSuccess = (state, action) => {
    return updateObject(state, {
        dataList: action.dataList,
        downloadURL: action.downloadURL,
        error: null,
        deleteDocumentState: 'SUCCESS',
        deleteDocumentType: action.deleteType
    })
}

const deleteImageError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        deleteDocumentState: 'ERROR'
    })
}

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

const downloadAttachmentLoading = (state, action) => {
    return updateObject(state, {
        downloadAttachmentState: 'LOADING'
    })
}

const downloadAttachmentSuccess = (state, action) => {
    return updateObject(state, {
        error: null,
        downloadAttachmentState: 'SUCCESS',
    })
}

const downloadAttachmentError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        downloadAttachmentState: 'ERROR'
    })
}

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case actionTypes.GET_CARD_COMMENTS_ERROR: return getCardMessagesError(state, action);
        case actionTypes.GET_CARD_COMMENTS_SUCCESS: return getCardMessagesSuccess(state, action);
        case actionTypes.GET_CARD_COMMENTS_LOADING: return getCardMessagesLoading(state, action);

        default: return state;
    }
};

const attachmentReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_STATE: return initialState;

        case actionTypes.ADD_IMAGE_LOADING: return addImageLoading(state, action);
        case actionTypes.ADD_IMAGE_SUCCESS: return addImageSuccess(state, action);
        case actionTypes.ADD_IMAGE_ERROR: return addImageError(state, action);

        case actionTypes.DELETE_IMAGE_LOADING: return deleteImageLoading(state, action);
        case actionTypes.DELETE_IMAGE_SUCCESS: return deleteImageSuccess(state, action);
        case actionTypes.DELETE_IMAGE_ERROR: return deleteImageError(state, action);

        case actionTypes.UPLOAD_PHYSICAL_ADDRESS_LOADING: return addAddressUrlLoading(state, action);
        case actionTypes.UPLOAD_PHYSICAL_ADDRESS_SUCCESS: return addAddressUrlSuccess(state, action);
        case actionTypes.UPLOAD_PHYSICAL_ADDRESS_ERROR: return addAddressUrlError(state, action);

        case actionTypes.DELETE_PHYSICAL_ADDRESS_LOADING: return deleteAddressUrlLoading(state, action);
        case actionTypes.DELETE_PHYSICAL_ADDRESS_SUCCESS: return deleteAddressUrlSuccess(state, action);
        case actionTypes.DELETE_PHYSICAL_ADDRESS_ERROR: return deleteAddressUrlError(state, action);

        case actionTypes.DOWNLOAD_ATTACHMENT_LOADING: return downloadAttachmentLoading(state, action);
        case actionTypes.DOWNLOAD_ATTACHMENT_SUCCESS: return downloadAttachmentSuccess(state, action);
        case actionTypes.DOWNLOAD_ATTACHMENT_ERROR: return downloadAttachmentError(state, action);

        default: return state;
    }
};


const workloadReducer = combineReducers({
    attachmentUrl: attachmentReducer,
    staticData: reducer,
    DocVerification: ServiceVerificationReducer,
    courtVerification: courtVerificationReducer,
    addressVerification: addressVerificationReducer
});

export default workloadReducer;