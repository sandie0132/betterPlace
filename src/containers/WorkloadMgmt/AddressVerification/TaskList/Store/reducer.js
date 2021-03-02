import * as actionTypes from './actionTypes';
import { updateObject } from '../../../Store/utility';

const initialState = {
    searchExecutiveResults: [],
    searchExecutiveResultsState: 'INIT',

    postAssignmentState: 'INIT',
    postAssignmentData: null,

    downloadAgencyTasksState: 'INIT',

    excelUploadTasksState: 'INIT',
    percentCompleted: '',
    postalUploadId: '',
    processUploadedTasksState: 'INIT',
    processedData: {},
    excelErrorDownloadTasksState: 'INIT',

    agencyTasksList: [],
    getAgencyTasksListState: 'INIT',
    error: null
}

const initState = () => {
    return initialState;
}

const resetError = (state) => {
    return updateObject(state, {
        error: null
    })
}

const searchExecutiveResultsLoading = (state, action) => {
    return updateObject(state, {
        searchExecutiveResultsState: 'LOADING'
    });
};

const searchExecutiveResultsSuccess = (state, action) => {
    return updateObject(state, {
        searchExecutiveResultsState: 'SUCCESS',
        searchExecutiveResults: action.searchExecutiveResults,
        error: null
    });
};

const searchExecutiveResultsError = (state, action) => {
    return updateObject(state, {
        searchExecutiveResultsState: 'ERROR',
        error: action.error
    });
};

const postAssignmentLoading = (state) => {
    return updateObject(state, {
        postAssignmentState: 'LOADING'
    });
}

const postAssignmentSuccess = (state, action) => {
    return updateObject(state, {
        postAssignmentState: 'SUCCESS',
        postAssignmentData: action.postAssignmentData,
        error: null,
        actionType: action.actionType
    });
};

const postAssignmentError = (state, action) => {
    return updateObject(state, {
        postAssignmentState: 'ERROR',
        error: action.error,
    });
};

const downloadAgencyTaskLoading = (state) => {
    return updateObject(state, {
        downloadAgencyTasksState: 'LOADING'
    });
}

const downloadAgencyTaskSuccess = (state, action) => {
    return updateObject(state, {
        downloadAgencyTasksState: 'SUCCESS',
        error: null
    });
};

const downloadAgencyTaskError = (state, action) => {
    return updateObject(state, {
        downloadAgencyTasksState: 'ERROR',
        error: action.error
    });
};

const downloadPostalTaskLoading = (state) => {
    return updateObject(state, {
        downloadAgencyTasksState: 'LOADING'
    });
}

const downloadPostalTaskSuccess = (state, action) => {
    return updateObject(state, {
        downloadAgencyTasksState: 'SUCCESS',
        error: null
    });
};

const downloadPostalTaskError = (state, action) => {
    return updateObject(state, {
        downloadAgencyTasksState: 'ERROR',
        error: action.error
    });
};

const excelUploadTasksLoading = (state, action) => {
    return updateObject(state, {
        excelUploadTasksState: 'LOADING',
        percentCompleted: action.percentCompleted
    })
}

const excelUploadTasksSuccess = (state, action) => {
    return updateObject(state, {
        excelUploadTasksState: 'SUCCESS',
        postalUploadId: action.uploadResponse.data.uploadId,
        error: null
    })
}

const excelUploadTasksError = (state, action) => {
    return updateObject(state, {
        excelUploadTasksState: 'ERROR',
        error: action.error
    })
}

const processUploadedTasksLoading = (state, action) => {
    return updateObject(state, {
        processUploadedTasksState: 'LOADING',
        percentCompleted: action.percentCompleted
    })
}

const processUploadedTasksSuccess = (state, action) => {
    return updateObject(state, {
        processUploadedTasksState: 'SUCCESS',
        processedData: action.processData,
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
        excelErrorDownloadTasksState: 'LOADING'
    })
}

const getExcelErrorDownloadTasksSuccess = (state, action) => {
    return updateObject(state, {
        excelErrorDownloadTasksState: 'SUCCESS',
        error: null
    })
}

const getExcelErrorDownloadTasksError = (state, action) => {
    return updateObject(state, {
        excelErrorDownloadTasksState: 'ERROR',
        error: action.error
    })
}

const getPostalUploadInitData = () => {
    return updateObject({
        postalUploadId: '',
        processUploadedTasksState: 'INIT',
        processedData: {},
        excelErrorDownloadTasksState: 'INIT'
    })
}

//agency list for postal and physical
const getAgencyListLoading = (state, action) => {
    return updateObject(state, {
        getAgencyTasksListState: 'LOADING'
    });
};

const getAgencyListSuccess = (state, action) => {
    return updateObject(state, {
        getAgencyTasksListState: 'SUCCESS',
        postalAgencyList: action.postalAgencyList,
        physicalAgencyList: action.physicalAgencyList,
        agencyTasksList: action.agencyList,
        error: null
    });
};

const getAgencyListError = (state, action) => {
    return updateObject(state, {
        getAgencyTasksListState: 'ERROR',
        error: action.error
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_STATE: return initState();

        case actionTypes.RESET_ERROR: return resetError(state, action);

        case actionTypes.SEARCH_AGENCY_EXECUTIVE_LOADING: return searchExecutiveResultsLoading(state, action);
        case actionTypes.SEARCH_AGENCY_EXECUTIVE_SUCCESS: return searchExecutiveResultsSuccess(state, action);
        case actionTypes.SEARCH_AGENCY_EXECUTIVE_ERROR: return searchExecutiveResultsError(state, action);

        case actionTypes.POST_ASSIGNMENT_LOADING: return postAssignmentLoading(state, action);
        case actionTypes.POST_ASSIGNMENT_SUCCESS: return postAssignmentSuccess(state, action);
        case actionTypes.POST_ASSIGNMENT_ERROR: return postAssignmentError(state, action);

        case actionTypes.DOWNLOAD_AGENCY_TASKS_LOADING: return downloadAgencyTaskLoading(state, action);
        case actionTypes.DOWNLOAD_AGENCY_TASKS_SUCCESS: return downloadAgencyTaskSuccess(state, action);
        case actionTypes.DOWNLOAD_AGENCY_TASKS_ERROR: return downloadAgencyTaskError(state, action);

        case actionTypes.DOWNLOAD_POSTAL_TASKS_LOADING: return downloadPostalTaskLoading(state, action);
        case actionTypes.DOWNLOAD_POSTAL_TASKS_SUCCESS: return downloadPostalTaskSuccess(state, action);
        case actionTypes.DOWNLOAD_POSTAL_TASKS_ERROR: return downloadPostalTaskError(state, action);

        case actionTypes.EXCEL_UPLOAD_TASKS_LOADING: return excelUploadTasksLoading(state, action);
        case actionTypes.EXCEL_UPLOAD_TASKS_SUCCESS: return excelUploadTasksSuccess(state, action);
        case actionTypes.EXCEL_UPLOAD_TASKS_ERROR: return excelUploadTasksError(state, action);

        case actionTypes.PROCESS_UPLOADED_TASKS_LOADING: return processUploadedTasksLoading(state, action);
        case actionTypes.PROCESS_UPLOADED_TASKS_SUCCESS: return processUploadedTasksSuccess(state, action);
        case actionTypes.PROCESS_UPLOADED_TASKS_ERROR: return processUploadedTasksError(state, action);

        case actionTypes.EXCEL_ERROR_DOWNLOAD_TASKS_LOADING: return getExcelErrorDownloadTasksLoading(state, action);
        case actionTypes.EXCEL_ERROR_DOWNLOAD_TASKS_SUCCESS: return getExcelErrorDownloadTasksSuccess(state, action);
        case actionTypes.EXCEL_ERROR_DOWNLOAD_TASKS_ERROR: return getExcelErrorDownloadTasksError(state, action);

        case actionTypes.GET_AGENCY_TASK_LIST_LOADING: return getAgencyListLoading(state, action);
        case actionTypes.GET_AGENCY_TASK_LIST_SUCCESS: return getAgencyListSuccess(state, action);
        case actionTypes.GET_AGENCY_TASK_LIST_ERROR: return getAgencyListError(state, action);

        case actionTypes.GET_POSTAL_UPLOAD_INIT_DATA: return getPostalUploadInitData();

        default: return state;
    }
};

export default reducer;