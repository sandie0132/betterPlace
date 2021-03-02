import * as actionTypes from './actionTypes';
import { updateObject } from '../../../../EmpMgmtStore/utility';

const initialState = {
    uploadFileState: 'INIT',
    downloadFileState: 'INIT',
    uploadedFileUrl: null,
    fileUploadIndex: null,
    downloadURL: [],
    error: null
}

const initState = () => {
    return initialState;
}

//UPLOAD FILE REDUCERS
const uploadFileLoading = (state, action) => {
    return updateObject(state, {
        uploadFileState: 'LOADING',
        fileUploadIndex: action.fileUploadIndex
    });
};

const uploadFileSuccess = (state, action) => {
    return updateObject(state, {
        uploadFileState: 'SUCCESS',
        uploadedFileUrl: action.uploadedFileUrl,
        fileUploadIndex: action.fileUploadIndex,
        error: null
    });
};

const uploadFileError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        uploadFileState: 'ERROR'
    })
}

//DOWNLOAD FILE REDUCER
const downloadFileLoading = (state, action) => {
    return updateObject(state, {
        downloadFileState: 'LOADING',
        downloadURL: action.downloadURL
    })
}

const downloadFileSuccess = (state, action) => {
    return updateObject(state, {
        downloadFileState: 'SUCCESS',
        downloadURL: action.downloadURL
    })
}

const downloadFileError = (state, action) => {
    return updateObject(state, {
        downloadFileState: 'ERROR'
    })
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_STATE: return initState();

        case actionTypes.UPLOAD_FILE_LOADING: return uploadFileLoading(state, action);
        case actionTypes.UPLOAD_FILE_SUCCESS: return uploadFileSuccess(state, action);
        case actionTypes.UPLOAD_FILE_ERROR: return uploadFileError(state, action);

        case actionTypes.DOWNLOAD_FILE_LOADING: return downloadFileLoading(state, action);
        case actionTypes.DOWNLOAD_FILE_SUCCESS: return downloadFileSuccess(state, action);
        case actionTypes.DOWNLOAD_FILE_ERROR: return downloadFileError(state, action);

        default: return state;
    }
};

export default reducer;