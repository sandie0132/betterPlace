import * as actionTypes from './actionTypes';
import { updateObject } from '../../EmpMgmtStore/utility';

const initialState = {
    checkExcelStatusState: 'INIT',
    checkExcelStatus: {},

    uploadFileState: 'INIT',
    downloadURL: [],
    error: null,
    percentCompleted: 0,
    uploadResponse: null,
    scannedRowCount: '-',
    totalRows: '--',
    socketConnectionState: 'INIT',

    dataCount: null,

    stopProcessState: 'INIT',
    stopProcessData: null,

    processDataCount: 0,

    processSocketConnectionState: 'INIT',
    processCount: null,
    processError: null,

    scanSocket: null,
    processSocket: null,

    processDataStatusState: 'INIT',
    processDataStatus: null,

    bgvInitiateState: 'INIT',
    bgvInitiateData: null,
    bgvInitiateError: null,

    bgvReinitiateState: 'INIT',
    bgvReinitiateData: null,
    bgvReinitiateError: null,

    downloadErrorFileState: 'INIT',
    downloadExcelStatus: 'INIT',

    getUserDetailsState: 'INIT',
    userDetails: null,

    changeStatusState: 'INIT'
}


const initState = () => {
    return initialState;
}

const uploadFileLoading = (state, action) => {
    return updateObject(state, {
        uploadFileState: 'LOADING',
        percentCompleted: action.percentCompleted
    });
};

const uploadFileSuccess = (state, action) => {
    return updateObject(state, {
        uploadFileState: 'SUCCESS',
        uploadResponse: action.uploadResponse,
        error: null
    });
};

const uploadFileError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        uploadFileState: 'ERROR'
    })
}

const socketConnectionSuccess = (state, action) => {
    return updateObject(state, {
        socketConnectionState: 'SUCCESS',
        scannedRowCount: action.scannedRowCount,
        totalRows: action.totalRows,
        dataCount: action.dataCount
    })
}

const socketConnectionError = (state, action) => {
    return updateObject(state, {
        socketConnectionState: 'ERROR',
        scannedError: action.scannedError,
        dataCount: action.dataCount
    })
}

const scanSocketConnectionClosed = (state, action) => {
    return updateObject(state, {
        scanSocket: action.scanSocket
    })
}

const processDataStatusLoading = (state, action) => {
    return updateObject(state, {
        processDataStatusState: 'LOADING'
    })
}

const processDataStatusSuccess = (state, action) => {
    return updateObject(state, {
        processDataStatusState: 'SUCCESS',
        processDataStatus: action.processDataStatus
    })
}

const processDataStatusError = (state, action) => {
    return updateObject(state, {
        processDataStatusState: 'ERROR',
        error: action.error
    })
}

const processSocketConnectionSuccess = (state, action) => {
    return updateObject(state, {
        processSocketConnectionState: 'SUCCESS',
        processDataCount: action.processData,
        error: action.error
    })
}

const processSocketConnectionError = (state, action) => {
    return updateObject(state, {
        processSocketConnectionState: 'ERROR',
        processError: action.processError
    })
}

const processSocketConnectionClosed = (state, action) => {
    return updateObject(state, {
        processSocket: action.processSocket
    })
}

const bgvInitiateLoading = (state, action) => {
    return updateObject(state, {
        bgvInitiateState: 'LOADING'
    })
}

const bgvInitiateSuccess = (state, action) => {
    return updateObject(state, {
        bgvInitiateState: 'SUCCESS',
        bgvInitiateData: action.bgvInitiateData
    })
}

const bgvInitiateError = (state, action) => {
    return updateObject(state, {
        bgvInitiateState: 'ERROR',
        bgvInitiateError: action.error
    })
}

const bgvReinitiateLoading = (state, action) => {
    return updateObject(state, {
        bgvReinitiateState: 'LOADING'
    })
}

const bgvReinitiateSuccess = (state, action) => {
    return updateObject(state, {
        bgvReinitiateState: 'SUCCESS',
        bgvReinitiateData: action.bgvReinitiateData
    })
}

const bgvReinitiateError = (state, action) => {
    return updateObject(state, {
        bgvReinitiateState: 'ERROR',
        bgvReinitiateError: action.error
    })
}

const stopProcessLoading = (state, action) => {
    return updateObject(state, {
        stopProcessState: 'LOADING',
    });
};

const stopProcessSuccess = (state, action) => {
    return updateObject(state, {
        stopProcessState: 'SUCCESS',
        stopProcessData: action.stopProcessResponse,
        error: null
    });
};

const stopProcessError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        stopProcessState: 'ERROR'
    })
}

const getUserDetailsLoading = (state, action) => {
    return updateObject(state, {
        getUserDetailsState: 'LOADING'
    });
};

const getUserDetailsSuccess = (state, action) => {
    return updateObject(state, {
        getUserDetailsState: 'SUCCESS',
        userDetails: action.userDetails,
        error: null
    });
};

const getUserDetailsError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        getUserDetailsState: 'ERROR'
    })
}

const checkExcelStatusLoading = (state, action) => {
    return updateObject(state, {
        checkExcelStatusState: 'LOADING'
    });
};

const checkExcelStatusSuccess = (state, action) => {
    return updateObject(state, {
        checkExcelStatusState: 'SUCCESS',
        checkExcelStatus: action.checkExcelStatus.data,
        error: null
    })
}

const checkExcelStatusError = (state, action) => {
    return updateObject(state, {
        checkExcelStatusState: 'ERROR',
        error: action.error
    });
};

const resetExcelData = (state, action) => {
    return updateObject(state, {
        checkExcelStatusState: 'SUCCESS',
        checkExcelStatus: action.checkExcelStatus.data,
        error: null
    })
}

// const downloadExcelStatusLoading = (state, action) => {
//     return updateObject(state, {
//         downloadExcelStatus: 'LOADING'
//     })
// }

// const downloadExcelStatusSuccess = (state, action) => {
//     return updateObject(state, {
//         downloadExcelStatus: 'SUCCESS',
//         error: null
//     })
// }

// const downloadExcelStatusError = (state, action) => {
//     return updateObject(state, {
//         downloadExcelStatus: 'ERROR',
//         error: action.error
//     })
// }

const downloadErrorFileLoading = (state, action) => {
    return updateObject(state, {
        downloadErrorFileState: 'LOADING'
    })
}

const downloadErrorFileSuccess = (state, action) => {
    return updateObject(state, {
        downloadErrorFileState: 'SUCCESS',
        error: null
    })
}

const downloadErrorFileError = (state, action) => {
    return updateObject(state, {
        downloadErrorFileState: 'ERROR',
        error: action.error
    })
}

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

const changeStatusLoading = (state, action) => {
    return updateObject(state, {
        error: null,
        changeStatusState: 'LOADING'
    })
}

const changeStatusSuccess = (state, action) => {
    return updateObject(state, {
        error: null,
        changeStatusState: 'SUCCESS',
    })
}

const changeStatusError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        changeStatusState: 'ERROR'
    })
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_STATE: return initState();

        case actionTypes.UPLOAD_FILE_LOADING: return uploadFileLoading(state, action);
        case actionTypes.UPLOAD_FILE_SUCCESS: return uploadFileSuccess(state, action);
        case actionTypes.UPLOAD_FILE_ERROR: return uploadFileError(state, action);

        case actionTypes.SOCKET_CONNECTION_SUCCESS: return socketConnectionSuccess(state, action);
        case actionTypes.SOCKET_CONNECTION_ERROR: return socketConnectionError(state, action);

        case actionTypes.SCAN_SOCKET_CONNECTION_CLOSED: return scanSocketConnectionClosed(state, action);

        case actionTypes.PROCESS_DATA_STATUS_LOADING: return processDataStatusLoading(state, action);
        case actionTypes.PROCESS_DATA_STATUS_SUCCESS: return processDataStatusSuccess(state, action);
        case actionTypes.PROCESS_DATA_STATUS_ERROR: return processDataStatusError(state, action);

        case actionTypes.PROCESS_SOCKET_CONNECTION_SUCCESS: return processSocketConnectionSuccess(state, action);
        case actionTypes.PROCESS_SOCKET_CONNECTION_ERROR: return processSocketConnectionError(state, action);

        case actionTypes.PROCESS_SOCKET_CONNECTION_CLOSED: return processSocketConnectionClosed(state, action);

        case actionTypes.BGV_INITIATE_EXCEL_LOADING: return bgvInitiateLoading(state, action);
        case actionTypes.BGV_INITIATE_EXCEL_SUCCESS: return bgvInitiateSuccess(state, action);
        case actionTypes.BGV_INITIATE_EXCEL_ERROR: return bgvInitiateError(state, action);

        case actionTypes.BGV_REINITIATE_EXCEL_LOADING: return bgvReinitiateLoading(state, action);
        case actionTypes.BGV_REINITIATE_EXCEL_SUCCESS: return bgvReinitiateSuccess(state, action);
        case actionTypes.BGV_REINITIATE_EXCEL_ERROR: return bgvReinitiateError(state, action);

        case actionTypes.STOP_PROCESS_LOADING: return stopProcessLoading(state, action);
        case actionTypes.STOP_PROCESS_SUCCESS: return stopProcessSuccess(state, action);
        case actionTypes.STOP_PROCESS_ERROR: return stopProcessError(state, action);

        case actionTypes.GET_USER_DETAILS_LOADING: return getUserDetailsLoading(state, action);
        case actionTypes.GET_USER_DETAILS_SUCCESS: return getUserDetailsSuccess(state, action);
        case actionTypes.GET_USER_DETAILS_ERROR: return getUserDetailsError(state, action);

        case actionTypes.CHECK_EXCEL_STATUS_LOADING: return checkExcelStatusLoading(state, action);
        case actionTypes.CHECK_EXCEL_STATUS_SUCCESS: return checkExcelStatusSuccess(state, action);
        case actionTypes.CHECK_EXCEL_STATUS_ERROR: return checkExcelStatusError(state, action);

        // case actionTypes.DOWNLOAD_ERROR_EXCEL_STATUS_LOADING: return downloadExcelStatusLoading(state, action);
        // case actionTypes.DOWNLOAD_ERROR_EXCEL_STATUS_SUCCESS: return downloadExcelStatusSuccess(state, action);
        // case actionTypes.DOWNLOAD_ERROR_EXCEL_STATUS_ERROR: return downloadExcelStatusError(state, action);

        case actionTypes.DOWNLOAD_ERROR_EXCEL_LOADING: return downloadErrorFileLoading(state, action);
        case actionTypes.DOWNLOAD_ERROR_EXCEL_SUCCESS: return downloadErrorFileSuccess(state, action);
        case actionTypes.DOWNLOAD_ERROR_EXCEL_ERROR: return downloadErrorFileError(state, action);

        case actionTypes.GET_TAG_NAME_LOADING: return getTagNameLoading(state, action);
        case actionTypes.GET_TAG_NAME_SUCCESS: return getTagNameSuccess(state, action);
        case actionTypes.GET_TAG_NAME_ERROR: return getTagNameError(state, action);

        case actionTypes.CHANGE_STATUS_LOADING: return changeStatusLoading(state, action);
        case actionTypes.CHANGE_STATUS_SUCCESS: return changeStatusSuccess(state, action);
        case actionTypes.CHANGE_STATUS_ERROR: return changeStatusError(state, action);

        case actionTypes.RESET_EXCEL_DATA: return resetExcelData(state, action);

        default: return state;
    }
};

export default reducer;