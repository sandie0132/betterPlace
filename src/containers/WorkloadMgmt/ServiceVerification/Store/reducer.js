import * as actionTypes from './actionTypes';
import { updateObject } from './utility';
// import { addImage } from './action';

const initialState = {
    getDocumentTasksState: 'INIT',
    postDocumentTasksState: 'INIT',
    getInProgressTasksState: 'INIT',
    getCompletedTasksState: 'INIT',
    putWorkloadTransferState: 'INIT',
    getUserInfoState : "INIT",
    documentTasksList: [],
    searchData: [],
    searchCompletedData: [],
    error: null,
    currentDataId:null,
    Comments: [],
    getCommentsState: 'INIT',
    userInfo : '',
    postSmsEmailState : "INIT",
    getDownloadTaskPocState: 'INIT',
    getExcelCountState : 'INIT',
    excelCount : null,

    getTagInfoState: 'INIT',
    tagList: [],
    getExcelDownloadTasksState: 'INIT',
    getExcelErrorDownloadTasksState : 'INIT',
    getExcelUploadTasksState: 'INIT',
    excelTasksCountState: 'INIT',
    excelPostalTasksCountState : 'INIT',
    percentCompleted : 0,
    pvcTasksCount : {count:0},
    postalTasksCount : {count:0},
    postalUploadId : '',
    processUploadedTasksState : 'INIT',
    processedData : {},
    addressAgencyCount : "",
    addressAgencyCountState : 'INIT'
}

const initState = (state) => {
    return updateObject ( state, {
        processUploadedTasksState : 'INIT',
        processedData : {},
        postalUploadId : '',
        getExcelErrorDownloadTasksState : 'INIT',
        getExcelUploadTasksState: 'INIT',
    });
}

//GET DOCUMENT TASK REDUCERS
const getDocumentTasksListLoading = (state) => {
    return updateObject(state, {
        getDocumentTasksState: 'LOADING'
    });
}

const getDocumentTasksListSuccess = (state, action) => {
    return updateObject(state, {
        getDocumentTasksState: 'SUCCESS',
        documentTasksList: action.documentTasksList,
        error: null,
        currentDataId:action.currentDataId
    });
};

const getDocumentTasksListError = (state, action) => {
    return updateObject(state, {
        getDocumentTasksState: 'ERROR',
        error: action.error,
    });
};

//POST DOCUMENT TASKS REDUCERS
const postDocumentTasksLoading = (state) => {
    return updateObject(state, {
        postDocumentTasksState: 'LOADING'
    });
}

const postDocumentTasksSuccess = (state, action) => {
    return updateObject(state, {
        postDocumentTasksState: 'SUCCESS',
        error: null,
        currentDataId:action.currentDataId
    });
};

const postDocumentTasksError = (state, action) => {
    return updateObject(state, {
        postDocumentTasksState: 'ERROR',
        error: action.error,
    });
};

//POST SMS EMAIL REDUCERS
const postSmsEmailLoading = (state) => {
    return updateObject(state, {
        postSmsEmailState: 'LOADING'
    });
}

const postSmsEmailSuccess = (state, action) => {
    return updateObject(state, {
        postSmsEmailState: 'SUCCESS',
        error: null
    });
};

const postSmsEmailError = (state, action) => {
    return updateObject(state, {
        postSmsEmailState: 'ERROR',
        error: action.error
    });
};

const getInProgressTasksLoading = (state) => {
    return updateObject(state, {
        getInProgressTasksState: 'LOADING'
    })
}

const getInProgressTasksSuccess = (state, action) => {
    return updateObject(state, {
        getInProgressTasksState: 'SUCCESS',
        searchData: action.searchData,
        error: null
    })
}

const getInProgressTasksError = (state, action) => {
    return updateObject(state, {
        getInProgressTasksState: 'ERROR',
        error: action.error
    })
}

const getCompletedTasksLoading = (state) => {
    return updateObject(state, {
        getCompletedTasksState: 'LOADING'
    })
}

const getCompletedTasksSuccess = (state, action) => {
    return updateObject(state, {
        getCompletedTasksState: 'SUCCESS',
        searchCompletedData: action.searchCompletedData,
        error: null
    })
}

const getCompletedTasksError = (state, action) => {
    return updateObject(state, {
        getCompletedTasksState: 'ERROR',
        error: action.error
    })
}

const putWorkloadTransferDataLoading = (state) => {
    return updateObject(state, {
        putWorkloadTransferState: 'LOADING'
    })
}

const putWorkloadTransferDataSuccess = (state, action) => {
    return updateObject(state, {
        putWorkloadTransferState: 'SUCCESS',
        error: null
    })
}

const putWorkloadTransferDataError = (state, action) => {
    return updateObject(state, {
        putWorkloadTransferState: 'ERROR',
        error: action.error
    })
}

const getUserInfoLoading = (state) => {
    return updateObject(state, {
        getUserInfoState: 'LOADING'
    })
}

const getUserInfoSuccess = (state, action) => {
    return updateObject(state, {
        getUserInfoState: 'SUCCESS',
        userInfo: action.userInfo,
        error: null
    })
}

const getUserInfoError = (state, action) => {
    return updateObject(state, {
        getUserInfoState: 'ERROR',
        error: action.error
    })
}

const getCommentsLoading = (state) => {
    return updateObject(state, {
        getCommentsState: 'LOADING'
    })
}

const getCommentsSuccess = (state, action) => {
    return updateObject(state, {
        getCommentsState: 'SUCCESS',
        Comments: action.comments,
        error: null
    })
}

const getCommentsError = (state, action) => {
    return updateObject(state, {
        getCommentsState: 'ERROR',
        error: action.error
    })
}

const getDownloadTaskPocLoading = (state) => {
    return updateObject(state, {
        getDownloadTaskPocState: 'LOADING'
    })
}

const getDownloadTaskPocSuccess = (state, action) => {
    return updateObject(state, {
        getDownloadTaskPocState: 'SUCCESS',
        error: null
    })
}

const getDownloadTaskPocError = (state, action) => {
    return updateObject(state, {
        getDownloadTaskPocState: 'ERROR',
        error: action.error
    })
}

const getExcelCountLoading = (state) => {
    return updateObject(state, {
        getExcelCountState: 'LOADING'
    })
}

const getExcelCountSuccess = (state, action) => {
    return updateObject(state, {
        getExcelCountState: 'SUCCESS',
        excelCount : action.data,
        error: null
    })
}

const getExcelCountError = (state, action) => {
    return updateObject(state, {
        getExcelCountState: 'ERROR',
        error: action.error
    })
}

const getTagInfoDataLoading = (state) => {
    return updateObject(state, {
        getTagInfoState: 'LOADING'
    });
}

const getTagInfoDataSuccess = (state, action) => {
    return updateObject(state, {
        getTagInfoState: 'SUCCESS',
        tagList: action.tagList,
        error: null
    });
};

const getTagInfoDataError = (state, action) => {
    return updateObject(state, {
        getTagInfoState: 'ERROR',
        error: action.error,
    });
};

const getExcelDownloadTasksLoading = (state) => {
    return updateObject(state, {
        getExcelDownloadTasksState: 'LOADING'
    })
}

const getExcelDownloadTasksSuccess = (state, action) => {
    return updateObject(state, {
        getExcelDownloadTasksState: 'SUCCESS',
        error: null
    })
}

const getExcelDownloadTasksError = (state, action) => {
    return updateObject(state, {
        getExcelDownloadTasksState: 'ERROR',
        error: action.error
    })
}

const excelTasksCountLoading = (state) => {
    return updateObject(state, {
        excelTasksCountState: 'LOADING'
    })
}

const excelTasksCountSuccess = (state, action) => {
    if(action.cardType === "police" ) {
        return updateObject(state, {
            excelTasksCountState: 'SUCCESS',
            pvcTasksCount : action.data,
            error: null
        })
    } else if (action.cardType === "postal address"){
        return updateObject(state, {
            excelPostalTasksCountState : 'SUCCESS',
            postalTasksCount : action.data
        })
    }
}

const excelTasksCountError = (state, action) => {
    return updateObject(state, {
        excelTasksCountState: 'ERROR',
        error: action.error
    })
}

const getExcelUploadTasksLoading = (state, action) => {
    return updateObject(state, {
        getExcelUploadTasksState: 'LOADING',
        percentCompleted : action.percentCompleted
    })
}

const getExcelUploadTasksSuccess = (state, action) => {
    return updateObject(state, {
        getExcelUploadTasksState: 'SUCCESS',
        postalUploadId : action.uploadResponse.data.uploadId,
        error: null
    })
}

const getExcelUploadTasksError = (state, action) => {
    return updateObject(state, {
        getExcelUploadTasksState: 'ERROR',
        error: action.error
    })
}

const processUploadedTasksLoading = (state, action) => {
    return updateObject(state, {
        processUploadedTasksState: 'LOADING',
        percentCompleted : action.percentCompleted
    })
}

const processUploadedTasksSuccess = (state, action) => {
    return updateObject(state, {
        processUploadedTasksState: 'SUCCESS',
        processedData : action.processData,
        error: action.error
    })
}

const processUploadedTasksError = (state, action) => {
    return updateObject(state, {
        processUploadedTasksState: 'ERROR',
        error: action.processError
    })
}

const getExcelErrorDownloadTasksLoading = (state) => {
    return updateObject(state, {
        getExcelErrorDownloadTasksState: 'LOADING'
    })
}

const getExcelErrorDownloadTasksSuccess = (state, action) => {
    return updateObject(state, {
        getExcelErrorDownloadTasksState: 'SUCCESS',
        error: null
    })
}

const getExcelErrorDownloadTasksError = (state, action) => {
    return updateObject(state, {
        getExcelErrorDownloadTasksState: 'ERROR',
        error: action.error
    })
}

const addressAgencyCountLoading = (state) => {
    return updateObject(state, {
        addressAgencyCountState: 'LOADING'
    })
}

const addressAgencyCountSuccess = (state, action) => {
    return updateObject(state, {
        addressAgencyCountState: 'SUCCESS',
        addressAgencyCount : action.data,
        error: null
    })   
}

const addressAgencyCountError = (state, action) => {
    return updateObject(state, {
        addressAgencyCountState: 'ERROR',
        error: action.error
    })
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_STATE: return initState(state);

        case actionTypes.GET_DOCUMENTS_TASKS_LOADING: return getDocumentTasksListLoading(state, action);
        case actionTypes.GET_DOCUMENTS_TASKS_SUCCESS: return getDocumentTasksListSuccess(state, action);
        case actionTypes.GET_DOCUMENTS_TASKS_ERROR: return getDocumentTasksListError(state, action);

        case actionTypes.POST_DOCUMENTS_TASKS_LOADING: return postDocumentTasksLoading(state, action);
        case actionTypes.POST_DOCUMENTS_TASKS_SUCCESS: return postDocumentTasksSuccess(state, action);
        case actionTypes.POST_DOCUMENTS_TASKS_ERROR: return postDocumentTasksError(state, action);

        case actionTypes.POST_SMS_EMAIL_LOADING: return postSmsEmailLoading(state, action);
        case actionTypes.POST_SMS_EMAIL_SUCCESS: return postSmsEmailSuccess(state, action);
        case actionTypes.POST_SMS_EMAIL_ERROR: return postSmsEmailError(state, action);

        case actionTypes.GET_IN_PROGRESS_TASKS_LOADING: return getInProgressTasksLoading(state);
        case actionTypes.GET_IN_PROGRESS_TASKS_SUCCESS: return getInProgressTasksSuccess(state, action);
        case actionTypes.GET_IN_PROGRESS_TASKS_ERROR: return getInProgressTasksError(state, action);

        case actionTypes.GET_COMPLETED_TASKS_LOADING: return getCompletedTasksLoading(state);
        case actionTypes.GET_COMPLETED_TASKS_SUCCESS: return getCompletedTasksSuccess(state, action);
        case actionTypes.GET_COMPLETED_TASKS_ERROR: return getCompletedTasksError(state, action);

        case actionTypes.PUT_WORKLOAD_TRANSFERDATA_LOADING: return putWorkloadTransferDataLoading(state);
        case actionTypes.PUT_WORKLOAD_TRANSFERDATA_SUCCESS: return putWorkloadTransferDataSuccess(state, action);
        case actionTypes.PUT_WORKLOAD_TRANSFERDATA_ERROR: return putWorkloadTransferDataError(state, action);

        case actionTypes.GET_USER_NAME_LOADING: return getUserInfoLoading(state);
        case actionTypes.GET_USER_NAME_SUCCESS: return getUserInfoSuccess(state, action);
        case actionTypes.GET_USER_NAME_ERROR: return getUserInfoError(state, action);

        case actionTypes.GET_COMMENTS_LOADING: return getCommentsLoading(state);
        case actionTypes.GET_COMMENTS_SUCCESS: return getCommentsSuccess(state, action);
        case actionTypes.GET_COMMENTS_ERROR: return getCommentsError(state, action);

        case actionTypes.DOWNLOAD_TASK_POC_LOADING: return getDownloadTaskPocLoading(state, action);
        case actionTypes.DOWNLOAD_TASK_POC_SUCCESS: return getDownloadTaskPocSuccess(state, action);
        case actionTypes.DOWNLOAD_TASK_POC_ERROR: return getDownloadTaskPocError(state, action);

        case actionTypes.GET_EXCEL_COUNT_LOADING: return getExcelCountLoading(state, action);
        case actionTypes.GET_EXCEL_COUNT_SUCCESS: return getExcelCountSuccess(state, action);
        case actionTypes.GET_EXCEL_COUNT_ERROR: return getExcelCountError(state, action);

        case actionTypes.GET_TAG_INFO_LOADING: return getTagInfoDataLoading(state, action);
        case actionTypes.GET_TAG_INFO_SUCCESS: return getTagInfoDataSuccess(state, action);
        case actionTypes.GET_TAG_INFO_ERROR: return getTagInfoDataError(state, action);

        case actionTypes.EXCEL_DOWNLOAD_TASKS_LOADING: return getExcelDownloadTasksLoading(state, action);
        case actionTypes.EXCEL_DOWNLOAD_TASKS_SUCCESS: return getExcelDownloadTasksSuccess(state, action);
        case actionTypes.EXCEL_DOWNLOAD_TASKS_ERROR: return getExcelDownloadTasksError(state, action);

        case actionTypes.EXCEL_TASKS_COUNT_LOADING: return excelTasksCountLoading(state, action);
        case actionTypes.EXCEL_TASKS_COUNT_SUCCESS: return excelTasksCountSuccess(state, action);
        case actionTypes.EXCEL_TASKS_COUNT_ERROR: return excelTasksCountError(state, action);

        case actionTypes.EXCEL_UPLOAD_TASKS_LOADING: return getExcelUploadTasksLoading(state, action);
        case actionTypes.EXCEL_UPLOAD_TASKS_SUCCESS: return getExcelUploadTasksSuccess(state, action);
        case actionTypes.EXCEL_UPLOAD_TASKS_ERROR: return getExcelUploadTasksError(state, action);

        case actionTypes.PROCESS_UPLOADED_TASKS_LOADING: return processUploadedTasksLoading(state, action);
        case actionTypes.PROCESS_UPLOADED_TASKS_SUCCESS: return processUploadedTasksSuccess(state, action);
        case actionTypes.PROCESS_UPLOADED_TASKS_ERROR: return processUploadedTasksError(state, action);

        case actionTypes.EXCEL_ERROR_DOWNLOAD_TASKS_LOADING: return getExcelErrorDownloadTasksLoading(state, action);
        case actionTypes.EXCEL_ERROR_DOWNLOAD_TASKS_SUCCESS: return getExcelErrorDownloadTasksSuccess(state, action);
        case actionTypes.EXCEL_ERROR_DOWNLOAD_TASKS_ERROR: return getExcelErrorDownloadTasksError(state, action);

        case actionTypes.ADDRESS_AGENCY_COUNT_LOADING: return addressAgencyCountLoading(state, action);
        case actionTypes.ADDRESS_AGENCY_COUNT_SUCCESS: return addressAgencyCountSuccess(state, action);
        case actionTypes.ADDRESS_AGENCY_COUNT_ERROR: return addressAgencyCountError(state, action);

        default: return state;
    }
};

export default reducer;