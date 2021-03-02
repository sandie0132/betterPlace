import * as actionTypes from './actionTypes';
import { updateObject } from '../../../OrgMgmtStore/utility';

const initialState = {
    getSelectedDataState : "INIT",
    getStatusDataState : "INIT",
    postCheckLevelDataState : "INIT",
    postSectionLevelDataState : "INIT",
    postProfileLevelDataState : "INIT",
    checkLevelConfigured : false,
    sectionLevelConfigured : false,
    profileLevelConfigured : false,
    selectedServiceData : [],
    statusData : [],
    statusId : null,
    error : null
}

const getInitialState = (state) => {
    
    return initialState;
}

// const getSelectedServiceDataLoading = (state) => {
//     return updateObject(state, {
//         getSelectedDataState: 'LOADING'
//     });
// }

// const getSelectedServiceDataSuccess = (state, action) => {
//     return updateObject(state, {
//         getSelectedDataState: 'SUCCESS',
//         selectedServiceData: action.data,
//         error: null,
//     });
// };

// const getSelectedServiceDataError = (state, action) => {
//     return updateObject(state, {
//         getSelectedDataState: 'ERROR',
//         error: action.error,
//     });
// };

const postDataLoading = (state,action) => {
    if(action.level === "check_level")
    {
        return updateObject(state, {
            postCheckLevelDataState: 'LOADING'
        });
    }
    else if (action.level === "section_level")
    {
        return updateObject(state, {
            postSectionLevelDataState: 'LOADING'
        });
    }
    else if (action.level === "profile_level")
    {
        return updateObject(state, {
            postProfileLevelDataState: 'LOADING'
        });
    }
}

const postDataSuccess = (state, action) => {
    if(action.level === "check_level")
    {
        return updateObject(state, {
            postCheckLevelDataState: 'SUCCESS',
            error : null
        });
    }
    else if (action.level === "section_level")
    {
        return updateObject(state, {
            postSectionLevelDataState: 'SUCCESS',
            error : null
        });
    }
    else if (action.level === "profile_level")
    {
        return updateObject(state, {
            postProfileLevelDataState: 'SUCCESS',
            error : null
        });
    }
};

const postDataError = (state, action) => {
    if(action.level === "check_level")
    {
        return updateObject(state, {
            postCheckLevelDataState: 'ERROR',
            error : action.error
        });
    }
    else if (action.level === "section_level")
    {
        return updateObject(state, {
            postSectionLevelDataState: 'ERROR',
            error : action.error
        });
    }
    else if (action.level === "profile_level")
    {
        return updateObject(state, {
            postProfileLevelDataState: 'ERROR',
            error : action.error
        });
    }
};

// const putCheckLevelDataLoading = (state) => {
//     return updateObject(state, {
//         putCheckLevelDataState: 'LOADING'
//     });
// }

// const putCheckLevelDataSuccess = (state, action) => {
//     return updateObject(state, {
//         putCheckLevelDataState: 'SUCCESS',
//         error: null,
//     });
// };

// const putCheckLevelDataError = (state, action) => {
//     return updateObject(state, {
//         putCheckLevelDataState: 'ERROR',
//         error: action.error,
//     });
// };

// const putSectionLevelDataLoading = (state) => {
//     return updateObject(state, {
//         putSectionLevelDataState: 'LOADING'
//     });
// }

// const putSectionLevelDataSuccess = (state, action) => {
//     return updateObject(state, {
//         putSectionLevelDataState: 'SUCCESS',
//         error: null,
//     });
// };

// const putSectionLevelDataError = (state, action) => {
//     return updateObject(state, {
//         putSectionLevelDataState: 'ERROR',
//         error: action.error,
//     });
// };


// const putProfileLevelDataLoading = (state) => {
//     return updateObject(state, {
//         putProfileLevelDataState: 'LOADING'
//     });
// }

// const putProfileLevelDataSuccess = (state, action) => {
//     return updateObject(state, {
//         putProfileLevelDataState: 'SUCCESS',
//         error: null,
//     });
// };

// const putProfileLevelDataError = (state, action) => {
//     return updateObject(state, {
//         putProfileLevelDataState: 'ERROR',
//         error: action.error,
//     });
// };

const getStatusDataLoading = (state) => {
    return updateObject(state, {
        getStatusDataState: 'LOADING'
    });
}

const getStatusDataSuccess = (state, action) => {
    return updateObject(state, {
        getStatusDataState: 'SUCCESS',
        statusData: action.data,
        statusId : action.Id,
        error: null,
        checkLevelConfigured : action.checkLevelConfigured,
        sectionLevelConfigured : action.sectionLevelConfigured,
        profileLevelConfigured : action.profileLevelConfigured
    });
};

const getStatusDataError = (state, action) => {
    return updateObject(state, {
        getStatusDataState: 'ERROR',
        error: action.error,
    });
};


const resetError = (state) => {
    return updateObject(state,{
        error : null
    })
}

const reducer = (state = initialState, action) => {
   switch (action.type) {

        // case actionTypes.GET_SELECTED_SERVICE_DATA_LOADING: return getSelectedServiceDataLoading(state, action);
        // case actionTypes.GET_SELECTED_SERVICE_DATA_SUCCESS: return getSelectedServiceDataSuccess(state, action);
        // case actionTypes.GET_SELECTED_SERVICE_DATA_ERROR: return getSelectedServiceDataError(state, action);

        case actionTypes.POST_STATUS_DATA_LOADING: return postDataLoading(state, action);
        case actionTypes.POST_STATUS_DATA_SUCCESS: return postDataSuccess(state, action);
        case actionTypes.POST_STATUS_DATA_ERROR: return postDataError(state, action);

        // case actionTypes.PUT_CHECK_LEVEL_DATA_LOADING: return putCheckLevelDataLoading(state, action);
        // case actionTypes.PUT_CHECK_LEVEL_DATA_SUCCESS: return putCheckLevelDataSuccess(state, action);
        // case actionTypes.PUT_CHECK_LEVEL_DATA_ERROR: return putCheckLevelDataError(state, action);

        // case actionTypes.PUT_SECTION_LEVEL_DATA_LOADING: return putSectionLevelDataLoading(state, action);
        // case actionTypes.PUT_SECTION_LEVEL_DATA_SUCCESS: return putSectionLevelDataSuccess(state, action);
        // case actionTypes.PUT_SECTION_LEVEL_DATA_ERROR: return putSectionLevelDataError(state, action);

        // case actionTypes.PUT_PROFILE_LEVEL_DATA_LOADING: return putProfileLevelDataLoading(state, action);
        // case actionTypes.PUT_PROFILE_LEVEL_DATA_SUCCESS: return putProfileLevelDataSuccess(state, action);
        // case actionTypes.PUT_PROFILE_LEVEL_DATA_ERROR: return putProfileLevelDataError(state, action);

        case actionTypes.GET_STATUS_DATA_LOADING: return getStatusDataLoading(state, action);
        case actionTypes.GET_STATUS_DATA_SUCCESS: return getStatusDataSuccess(state, action);
        case actionTypes.GET_STATUS_DATA_ERROR: return getStatusDataError(state, action);

        case actionTypes.GET_INIT_STATE: return getInitialState(state);
        
        case actionTypes.RESET_ERROR : return resetError(state);
        // case actionTypes.SET_STATUSMGMT_TOPNAV: return setStatusMgmtTopNav(state,action);

        default: return state;
    }
};

export default reducer;