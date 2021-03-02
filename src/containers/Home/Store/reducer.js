import * as actionTypes from './actionTypes';
import { updateObject } from './utility';

const initialState = {
    getProfilePictureState: 'INIT',
    images: {},
    loadingQueue: [],
    getAddressPictureState: 'INIT',
    addressImages: {},
    addressLoadingQueue: [],
    imageType : ''
}

const initState = () => {
    return initialState;
}

const getProfilePicLoading = (state, action) => {
    return updateObject(state, {
        getProfilePictureState: 'LOADING',
        loadingQueue: action.loadingQueue
    });
}

const getProfilePicSuccess = (state, action) => {
    return updateObject(state, {
        getProfilePictureState:'SUCCESS',
        loadingQueue: action.loadingQueue,
        images: action.images,
        error: null
    });
};

const getProfilePicError = (state, action) => {
    return updateObject(state, {
        getProfilePictureState: 'ERROR',
        error: action.error,
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

const getAddressImagesInitState = (state) => {
    return updateObject(state, {
        addressImages : {landmarkUrl:{}, doorNumberUrl:{},streetUrl:{},idCardUrl:{}}
    })
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_STATE: return initState();

        case actionTypes.GET_PROFILE_PIC_LOADING: return getProfilePicLoading(state, action);
        case actionTypes.GET_PROFILE_PIC_SUCCESS: return getProfilePicSuccess(state, action);
        case actionTypes.GET_PROFILE_PIC_ERROR: return getProfilePicError(state, action);

        case actionTypes.GET_ADDRESS_PIC_LOADING: return getAddressPicLoading(state, action);
        case actionTypes.GET_ADDRESS_PIC_SUCCESS: return getAddressPicSuccess(state, action);
        case actionTypes.GET_ADDRESS_PIC_ERROR: return getAddressPicError(state, action);

        case actionTypes.GET_ADDRESS_IMAGES_INTI_STATE: return getAddressImagesInitState(state);

        default: return state;
    }
};

export default reducer;