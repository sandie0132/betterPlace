import { updateObject } from "../../../../EmpMgmtStore/utility";
import * as actionTypes from './actionTypes';

const initialState = {
    signatureUploadState: "INIT",
    signaturePreviewUploadState:"INIT",
    signatureDownloadState: "INIT",
    signatureURL: null,
    signaturePreviewURL: null,
    signatureImage: null,
    error: null,
}

const initState = () => {
    return initialState;
};

//////download signature reducers
const downloadSignatureSuccess = (state, action) => {
    return updateObject(state, {
        signatureImage: action.empSignature,
        error: null,
        signatureDownloadState: "SUCCESS"
    });
};

const downloadSignatureError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        signatureDownloadState: "ERROR"
    });
};

const downloadSignatureLoading = (state, action) => {
    return updateObject(state, {
        signatureDownloadState: "LOADING"
    });
};

//////upload signature reducers
const uploadSignatureSuccess = (state, action) => {
    if (action.signatureType === "preview") {
        return updateObject(state, {
            signaturePreviewURL: action.signatureURL,
            error: null,
            signaturePreviewUploadState: "SUCCESS"
        });
    } else {
        return updateObject(state, {
            signatureURL: action.signatureURL,
            error: null,
            signatureUploadState: "SUCCESS"
        });
    }
};

const uploadSignatureError = (state, action) => {
    if (action.signatureType === "preview") {
        return updateObject(state, {
            error: action.error,
            signaturePreviewUploadState: "ERROR"
        });
    } else {
        return updateObject(state, {
            error: action.error,
            signatureUploadState: "ERROR"
        });
    }
};

const uploadSignatureLoading = (state, action) => {
    if (action.signatureType === "preview") {
        return updateObject(state, {
            signaturePreviewUploadState: "LOADING"
        });
    } else {
        return updateObject(state, {
            signatureUploadState: "LOADING"
        });
    }
};




const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_STATE: return initState();

        case actionTypes.DOWNLOAD_SIGNATURE_LOADING: return downloadSignatureLoading(state, action);
        case actionTypes.DOWNLOAD_SIGNATURE_SUCCESS: return downloadSignatureSuccess(state, action);
        case actionTypes.DOWNLOAD_SIGNATURE_ERROR: return downloadSignatureError(state, action);

        case actionTypes.UPLOAD_SIGNATURE_LOADING: return uploadSignatureLoading(state, action);
        case actionTypes.UPLOAD_SIGNATURE_SUCCESS: return uploadSignatureSuccess(state, action);
        case actionTypes.UPLOAD_SIGNATURE_ERROR: return uploadSignatureError(state, action);

        default: return state;
    }
};

export default reducer;

