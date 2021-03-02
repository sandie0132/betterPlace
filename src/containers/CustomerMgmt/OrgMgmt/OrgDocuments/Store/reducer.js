import * as actionTypes from './actionTypes';
import { updateObject } from '../../OrgMgmtStore/utility';

const initialState = {
    getDataState: 'INIT',
    postDataState: 'INIT',
    putDataState: 'INIT',
    deleteDataState: 'INIT',
    uploadFileState: 'INIT',
    deleteFileState: 'INIT',
    downloadURL: [],
    deleteUrl: null,
    dataList: [],
    error: null,
    currentDataId: null,
    downloadFileState: 'INIT'
}

const initState = () => {
    return initialState;
}

//RESET DOWNLOAD_URL REDUCER
const resetDownloadUrl = (state) => {
    return updateObject(state, {
        downloadURL: []
    });
}

//RESET DELETE_URL REDUCER
const resetDeleteUrl = (state) => {
    return updateObject(state, {
        deleteUrl: null
    });
}

//GET DATA REDUCERS
const getDataListLoading = (state) => {
        return updateObject(state, {
        getDataState: 'LOADING'
    });
}

const getDataListSuccess = (state, action) => {
    return updateObject(state, {
        getDataState: 'SUCCESS',
        dataList: action.dataList,
        error: null,
        currentDataId: null
    });
};

const getDataListError = (state, action) => {
    return updateObject(state, {
        getDataState: 'ERROR',
        error: action.error,
    });
};

//POST DATA REDUCERS
const postDataLoading = (state) => {
    return updateObject(state, {
        postDataState: 'LOADING',
        currentDataId: null
    });
}

const postDataSuccess = (state, action) => {
    return updateObject(state, {
        postDataState: 'SUCCESS',
        dataList: action.dataList,
        error: null,
        currentDataId: action.currentDataId
    });
};

const postDataError = (state, action) => {
    return updateObject(state, {
        postDataState: 'ERROR',
        error: action.error
    });
};

//PUT DATA REDUCERS
const putDataLoading = (state) => {
    return updateObject(state, {
        putDataState: 'LOADING',
        currentDataId: null
    });
}

const putDataSuccess = (state, action) => {
    return updateObject(state, {
        putDataState: 'SUCCESS',
        dataList: action.dataList,
        error: null,
        currentDataId: action.currentDataId
    });
};

const putDataError = (state, action) => {
    return updateObject(state, {
        putDataState: 'ERROR',
        error: action.error,
    });
};

//DELETE DATA REDUCERS
const deleteDataLoading = (state) => {
    return updateObject(state, {
        deleteDataState: 'LOADING',
        currentDataId: null
    });
}

const deleteDataSuccess = (state, action) => {
    return updateObject(state, {
        deleteDataState: 'SUCCESS',
        dataList: action.dataList,
        error: null,
        currentDataId: null
    });
};

const deleteDataError = (state, action) => {
    return updateObject(state, {
        deleteDataState: 'ERROR',
        error: action.error,
        currentDataId : action.currentDataId
    });
};

//UPLOAD FILE REDUCERS
const uploadFileLoading = (state, action) => {
    return updateObject(state, {
        uploadFileState: 'LOADING',
        currentDataId: null
    });
};

const uploadFileSuccess = (state, action) => {
    return updateObject(state, {
        uploadFileState: 'SUCCESS',
        downloadURL: action.downloadURL,
        currentDataId: action.currentDataId,
        error: null
    });
};

const uploadFileError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        uploadFileState: 'ERROR'
    })
}

//DELET FILE REDUCERS
const deleteFileLoading = (state, action) => {
    return updateObject(state, {
        deleteFileState: 'LOADING',
        currentDataId: null
    })
}

const deleteFileSuccess = (state, action) => {
    return updateObject(state, {
        deleteFileState: 'SUCCESS',
        deleteUrl: action.deleteUrl,
        currentDataId: action.currentDataId,
        error: null
    })
}

const deleteFileError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        deleteFileState: 'ERROR'
    })
}

const resetError = (state, action) => {
    return updateObject(state, {
        error: null
    })
}

const downloadFileLoading = (state, action) => {
    return updateObject(state, {
        downloadFileState: 'LOADING'
    })
}

const downloadFileSuccess = (state, action) => {
    return updateObject(state, {
        downloadFileState: 'SUCCESS'
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
        case actionTypes.RESET_ERROR: return resetError(state, action);

        case actionTypes.RESET_DOWNLOAD_URL_LIST: return resetDownloadUrl(state);
        case actionTypes.RESET_DELETE_URL: return resetDeleteUrl(state);

        case actionTypes.GET_DATA_LIST_LOADING: return getDataListLoading(state, action);
        case actionTypes.GET_DATA_LIST_SUCCESS: return getDataListSuccess(state, action);
        case actionTypes.GET_DATA_LIST_ERROR: return getDataListError(state, action);

        case actionTypes.POST_DATA_LOADING: return postDataLoading(state, action);
        case actionTypes.POST_DATA_SUCCESS: return postDataSuccess(state, action);
        case actionTypes.POST_DATA_ERROR: return postDataError(state, action);

        case actionTypes.PUT_DATA_LOADING: return putDataLoading(state, action);
        case actionTypes.PUT_DATA_SUCCESS: return putDataSuccess(state, action);
        case actionTypes.PUT_DATA_ERROR: return putDataError(state, action);

        case actionTypes.DELETE_DATA_LOADING: return deleteDataLoading(state, action);
        case actionTypes.DELETE_DATA_SUCCESS: return deleteDataSuccess(state, action);
        case actionTypes.DELETE_DATA_ERROR: return deleteDataError(state, action);

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