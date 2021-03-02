import * as actionTypes from './actionTypes';
import { updateObject } from '../../../../Store/utility';
// import * as initData from '../../PhysicalAddressInitData';
import _ from 'lodash';

const initialState = {
    getAddressPictureState: 'INIT',
    addressImages: {},
    addressLoadingQueue: [],
    imageType : '',
    addressUrl: {},
    addAddressUrlState: 'INIT',
    deleteAddressUrlState: 'INIT',
    percentCompleted: 0,
    uploadUrlType: '',
    downloadAttachmentState: 'INIT',
    deleteUrlType: '',
    otherType : '',
    error: null
}

// const initState = (state) => {
//     return initialState;
// }

const getAddressPicLoading = (state, action) => {
    return updateObject(state, {
        getAddressPictureState: 'LOADING',
        addressLoadingQueue: action.addressLoadingQueue,
    });
}

const getAddressPicSuccess = (state, action) => {
    return updateObject(state, {
        getAddressPictureState:'SUCCESS',
        addressLoadingQueue: action.addressLoadingQueue,
        addressImages: action.addressImages,
        imageType : action.imageType,
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
        uploadUrlType: action.urlType,
        otherType : action.otherType
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
        uploadUrlType: action.urlType,
        otherType : action.otherType
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

const reducer = (state = initialState, action) => {
    switch (action.type) {

        // case actionTypes.INIT_STATE: return initState();

        case actionTypes.GET_ADDRESS_PIC_LOADING: return getAddressPicLoading(state, action);
        case actionTypes.GET_ADDRESS_PIC_SUCCESS: return getAddressPicSuccess(state, action);
        case actionTypes.GET_ADDRESS_PIC_ERROR: return getAddressPicError(state, action);

        case actionTypes.UPLOAD_PHYSICAL_ADDRESS_LOADING: return addAddressUrlLoading(state, action);
        case actionTypes.UPLOAD_PHYSICAL_ADDRESS_SUCCESS: return addAddressUrlSuccess(state, action);
        case actionTypes.UPLOAD_PHYSICAL_ADDRESS_ERROR: return addAddressUrlError(state, action);

        case actionTypes.DELETE_PHYSICAL_ADDRESS_LOADING: return deleteAddressUrlLoading(state, action);
        case actionTypes.DELETE_PHYSICAL_ADDRESS_SUCCESS: return deleteAddressUrlSuccess(state, action);
        case actionTypes.DELETE_PHYSICAL_ADDRESS_ERROR: return deleteAddressUrlError(state, action);

        default: return state;

    }
}

export default reducer;