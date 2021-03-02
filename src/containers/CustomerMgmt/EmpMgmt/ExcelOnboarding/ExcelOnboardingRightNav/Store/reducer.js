import * as actionTypes from './actionTypes';
import { updateObject } from '../../../EmpMgmtStore/utility';

const initialState = {
    getTimelineDataState: 'INIT',
    timeLineData: null,

    getUserDetailsState: 'INIT',
    userDetails: null,

    tagDataState: 'INIT',
    tagData: null,

    timelineFileData: null,
    timelineFileState: 'INIT'
}

const initState = () => {
    return initialState;
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

const getTimelineDataLoading = (state, action) => {
    return updateObject(state, {
        getTimelineDataState: 'LOADING'
    })
}

const getTimelineDataSuccess = (state, action) => {
    return updateObject(state, {
        getTimelineDataState: 'SUCCESS',
        timeLineData: action.timelineData.data
    })
}

const getTimelineDataError = (state, action) => {
    return updateObject(state, {
        getTimelineDataState: 'ERROR',
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

const getTimelineFileLoading = (state, action) => {
    return updateObject(state, {
        error: null,
        timelineFileState: 'LOADING'
    })
}

const getTimelineFileSuccess = (state, action) => {
    return updateObject(state, {
        error: null,
        timelineFileState: 'SUCCESS',
        timelineFileData: action.tagData
    })
}

const getTimelineFileError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        timelineFileState: 'ERROR'
    })
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_STATE: return initState();

        case actionTypes.GET_USER_DETAILS_LOADING: return getUserDetailsLoading(state, action);
        case actionTypes.GET_USER_DETAILS_SUCCESS: return getUserDetailsSuccess(state, action);
        case actionTypes.GET_USER_DETAILS_ERROR: return getUserDetailsError(state, action);

        case actionTypes.TIMELINE_DATA_LOADING: return getTimelineDataLoading(state, action);
        case actionTypes.TIMELINE_DATA_SUCCESS: return getTimelineDataSuccess(state, action);
        case actionTypes.TIMELINE_DATA_ERROR: return getTimelineDataError(state, action);

        case actionTypes.GET_TAG_NAME_LOADING: return getTagNameLoading(state, action);
        case actionTypes.GET_TAG_NAME_SUCCESS: return getTagNameSuccess(state, action);
        case actionTypes.GET_TAG_NAME_ERROR: return getTagNameError(state, action);

        case actionTypes.TIMELINE_FILE_DOWNLOAD_LOADING: return getTimelineFileLoading(state, action);
        case actionTypes.TIMELINE_FILE_DOWNLOAD_SUCCESS: return getTimelineFileSuccess(state, action);
        case actionTypes.TIMELINE_FILE_DOWNLOAD_ERROR: return getTimelineFileError(state, action);

        default: return state;
    }
};

export default reducer;