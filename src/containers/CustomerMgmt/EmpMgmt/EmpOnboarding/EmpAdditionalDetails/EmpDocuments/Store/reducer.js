import * as actionTypes from './actionTypes';
import { updateObject } from '../../../../EmpMgmtStore/utility';

const initialState = {
    getDataState: 'INIT',
    postDataState: 'INIT',
    putDataState: 'INIT',
    deleteDataState: 'INIT',
    uploadFileState: 'INIT',
    deleteFileState: 'INIT',
    empId: null,
    data: [],
    deleteUrl: null,

    aadharFile: [],
    panFile: [],
    dlFile: [],
    voterFile: [],
    passportFile: [],
    consentFile: [],
    rcFile: [],

    error: null,

    uploadPanState: 'INIT',
    uploadAadhaarState: 'INIT',
    uploadVoterState: 'INIT',
    uploadDlState: 'INIT',
    uploadConsentState: 'INIT',
    uploadPassportState: 'INIT',
    uploadRcState: 'INIT',


    downloadPanFileState: 'INIT',
    downloadAadharFileState: 'INIT',
    downloadVoterFileState: 'INIT',
    downloadDlFileState: 'INIT',
    downloadRcFileState: 'INIT',
    downloadPassportFileState: 'INIT',
    downloadConsentFileState: 'INIT'
}

const initState = () => {
    return initialState;
}


const resetError = (state, action) => {
    return updateObject(state, {
        error: null
    });
}

const resetDownloadUrl = (state) => {
    return updateObject(state, {
        aadharFile: [],
        panFile: [],
        dlFile: [],
        voterFile: [],
        passportFile: [],
        consentFile: [],
        rcFile: []
    });
}

//RESET DELETE_URL REDUCER
const resetDeleteUrl = (state) => {
    return updateObject(state, {
        deleteUrl: null
    });
}


//UPLOAD FILE REDUCERS

const uploadFileLoading = (state, action) => {
    if (action.docType === 'panData') {
        return updateObject(state, {
            uploadPanState: 'LOADING'
        });
    }
    else if (action.docType === 'aadharData') {
        return updateObject(state, {
            uploadAadhaarState: 'LOADING'
        });
    }
    else if (action.docType === 'voterData') {
        return updateObject(state, {
            uploadVoterState: 'LOADING'
        });
    }
    else if (action.docType === 'dlData') {
        return updateObject(state, {
            uploadDlState: 'LOADING'
        });
    }
    else if (action.docType === 'rcData') {
        return updateObject(state, {
            uploadRcState: 'LOADING'
        });
    }
    else if (action.docType === 'passportData') {
        return updateObject(state, {
            uploadPassportState: 'LOADING'
        });
    }
    else {
        return updateObject(state, {
            uploadConsentState: 'LOADING'
        });
    }
};

const uploadFileSuccess = (state, action) => {
    if (action.docType === 'panData') {
        return updateObject(state, {
            uploadPanState: 'SUCCESS',
            panFile: action.panFile,
            panError: null
        });
    }
    else if (action.docType === 'aadharData') {
        return updateObject(state, {
            uploadAadhaarState: 'SUCCESS',
            aadharFile: action.aadharFile,
            aadharError: null
        });
    }
    else if (action.docType === 'voterData') {
        return updateObject(state, {
            uploadVoterState: 'SUCCESS',
            voterFile: action.voterFile,
            voterError: null
        });
    }
    else if (action.docType === 'dlData') {
        return updateObject(state, {
            uploadDlState: 'SUCCESS',
            dlFile: action.dlFile,
            dlError: null
        });
    }
    else if (action.docType === 'rcData') {
        return updateObject(state, {
            uploadRcState: 'SUCCESS',
            rcFile: action.rcFile,
            rcError: null
        });
    }
    else if (action.docType === 'passportData') {
        return updateObject(state, {
            uploadPassportState: 'SUCCESS',
            passportFile: action.passportFile,
            passportError: null
        });
    }
    else {
        return updateObject(state, {
            uploadConsentState: 'SUCCESS',
            consentFile: action.consentFile,
            consentError: null
        });
    }
};



const uploadFileError = (state, action) => {
    if (action.docType === 'panData') {
        return updateObject(state, {
            uploadPanState: 'ERROR',
            panError: action.error
        });
    }
    else if (action.docType === 'aadharData') {
        return updateObject(state, {
            uploadAadhaarState: 'ERROR',
            aadharError: action.error
        });
    }
    else if (action.docType === 'voterData') {
        return updateObject(state, {
            uploadVoterState: 'ERROR',
            voterError: action.error
        });
    }
    else if (action.docType === 'dlData') {
        return updateObject(state, {
            uploadDlState: 'ERROR',
            dlError: action.error
        });
    }
    else if (action.docType === 'passportData') {
        return updateObject(state, {
            uploadPassportState: 'ERROR',
            passportError: action.error
        });
    }
    else {
        return updateObject(state, {
            uploadConsentState: 'ERROR',
            consentError: action.error
        });
    }
}



//DELET FILE REDUCERS
const deleteFileLoading = (state, action) => {
    return updateObject(state, {
        deleteFileState: 'LOADING'
    })
}

const deleteFileSuccess = (state, action) => {
    return updateObject(state, {
        deleteFileState: 'SUCCESS',
        deleteUrl: action.deleteUrl,
        error: null,
        docType: action.docType,
    })
}

const deleteFileError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        deleteFileState: 'ERROR'
    })
}


const downloadFileLoading = (state, action) => {
    if (action.docType === 'panData') {
        return updateObject(state, {
            downloadPanFileState: 'LOADING'
        });
    }
    else if (action.docType === 'aadharData') {
        return updateObject(state, {
            downloadAadharFileState: 'LOADING'
        });
    }
    else if (action.docType === 'voterData') {
        return updateObject(state, {
            downloadVoterFileState: 'LOADING'
        });
    }
    else if (action.docType === 'dlData') {
        return updateObject(state, {
            downloadDlFileState: 'LOADING'
        });
    }
    else if (action.docType === 'rcData') {
        return updateObject(state, {
            downloadRcFileState: 'LOADING'
        });
    }
    else if (action.docType === 'passportData') {
        return updateObject(state, {
            downloadPassportFileState: 'LOADING'
        });
    }
    else {
        return updateObject(state, {
            downloadConsentFileState: 'LOADING'
        });
    }
};

const downloadFileSuccess = (state, action) => {
    if (action.docType === 'panData') {
        return updateObject(state, {
            downloadPanFileState: 'SUCCESS'
        });
    }
    else if (action.docType === 'aadharData') {
        return updateObject(state, {
            downloadAadharFileState: 'SUCCESS'
        });
    }
    else if (action.docType === 'voterData') {
        return updateObject(state, {
            downloadVoterFileState: 'SUCCESS'
        });
    }
    else if (action.docType === 'dlData') {
        return updateObject(state, {
            downloadDlFileState: 'SUCCESS'
        });
    }
    else if (action.docType === 'rcData') {
        return updateObject(state, {
            downloadRcFileState: 'SUCCESS'
        });
    }
    else if (action.docType === 'passportData') {
        return updateObject(state, {
            downloadPassportFileState: 'SUCCESS'
        });
    }
    else {
        return updateObject(state, {
            downloadConsentFileState: 'SUCCESS'
        });
    }
};

const downloadFileError = (state, action) => {
    if (action.docType === 'panData') {
        return updateObject(state, {
            downloadPanFileState: 'ERROR'
        });
    }
    else if (action.docType === 'aadharData') {
        return updateObject(state, {
            downloadAadharFileState: 'ERROR'
        });
    }
    else if (action.docType === 'voterData') {
        return updateObject(state, {
            downloadVoterFileState: 'ERROR'
        });
    }
    else if (action.docType === 'dlData') {
        return updateObject(state, {
            downloadDlFileState: 'ERROR'
        });
    }
    else if (action.docType === 'rcData') {
        return updateObject(state, {
            downloadRcFileState: 'ERROR'
        });
    }
    else if (action.docType === 'passportData') {
        return updateObject(state, {
            downloadPassportFileState: 'ERROR'
        });
    }
    else {
        return updateObject(state, {
            downloadConsentFileState: 'ERROR'
        });
    }
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_STATE: return initState();
        case actionTypes.RESET_ERROR: return resetError(state, action);

        case actionTypes.RESET_DOWNLOAD_URL_LIST: return resetDownloadUrl(state);
        case actionTypes.RESET_DELETE_URL: return resetDeleteUrl(state);

        case actionTypes.UPLOAD_FILE_LOADING: return uploadFileLoading(state, action);
        case actionTypes.UPLOAD_FILE_SUCCESS: return uploadFileSuccess(state, action);
        case actionTypes.UPLOAD_FILE_ERROR: return uploadFileError(state, action);

        case actionTypes.DELETE_FILE_LOADING: return deleteFileLoading(state, action);
        case actionTypes.DELETE_FILE_SUCCESS: return deleteFileSuccess(state, action);
        case actionTypes.DELETE_FILE_ERROR: return deleteFileError(state, action);

        case actionTypes.DOWNLOAD_FILE_LOADING: return downloadFileLoading(state, action);
        case actionTypes.DOWNLOAD_FILE_SUCCESS: return downloadFileSuccess(state, action);
        case actionTypes.DOWNLOAD_FILE_ERROR: return downloadFileError(state, action);

        default: return state;
    }
};

export default reducer;