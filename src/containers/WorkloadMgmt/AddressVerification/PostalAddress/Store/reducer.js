import * as actionTypes from './actionTypes';
import { updateObject } from '../../Store/utility';
// import * as initData from '../PhysicalAddressInitData';

const initialState = {
    // getIndividualTask: null,
    // getIndividualTaskState: 'INIT',
    // postIndividualTaskState: 'INIT',
    tagData: '',
    tagDataState: 'INIT',
    postalTaskDetails : {},
    postalTaskDetailsState : 'INIT',
    postPostalTaskDetailsState : 'INIT',

    postalSuccessData: {},
    // getTaskClosureStaticDataState : 'INIT',
    // taskClosureStaticData : { ...initData.data }
    getAgencyListState: 'INIT',
    agencyList: [],
    error: null
}

const initState = (state) => {
    return initialState;
}

const getNotificationData = (state, action) => {
    return updateObject(state, {
        postalSuccessData: {
            color: action.color,
            name: action.name
        }
    })
}

// const getTaskClosureStaticDataLoading = (state, action) => {
//     return updateObject(state, {
//         getTaskClosureStaticDataState: 'LOADING'
//     });
// };

// const getTaskClosureStaticDataSuccess = (state, action) => {
//     return updateObject(state, {
//         getTaskClosureStaticDataState: 'SUCCESS',
//         taskClosureStaticData: action.staticData,
//         error: null
//     });
// };

// const getTaskClosureStaticDataError = (state, action) => {
//     return updateObject(state, {
//         getTaskClosureStaticDataState: 'ERROR',
//         error: action.error
//     });
// };

// const getIndividualTaskLoading = (state, action) => {
//     return updateObject(state, {
//         getIndividualTaskState: 'LOADING'
//     });
// };

// const getIndividualTaskSuccess = (state, action) => {
//     return updateObject(state, {
//         getIndividualTaskState: 'SUCCESS',
//         getIndividualTask: action.phyAddress,
//         error: null
//     });
// };

// const getIndividualTaskError = (state, action) => {
//     return updateObject(state, {
//         getIndividualTaskState: 'ERROR',
//         error: action.error
//     });
// };

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

// const postIndividualTaskLoading = (state, action) => {
//     return updateObject(state, {
//         postIndividualTaskState: 'LOADING'
//     });
// };

// const postIndividualTaskSuccess = (state, action) => {
//     return updateObject(state, {
//         postIndividualTaskState: 'SUCCESS',
//         error: null
//     });
// };

// const postIndividualTaskError = (state, action) => {
//     return updateObject(state, {
//         postIndividualTaskState: 'ERROR',
//         error: action.error
//     });
// };

const getPostalTaskDetailsLoading = (state, action) => {
    return updateObject(state, {
        error: null,
        postalTaskDetailsState : 'LOADING'
    })
}

const getPostalTaskDetailsSuccess = (state, action) => {
    return updateObject(state, {
        error: null,
        postalTaskDetailsState : 'SUCCESS',
        postalTaskDetails : action.taskDetails
    })
}

const getPostalTaskDetailsError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        postalTaskDetailsState : 'ERROR'
    })
}

const postPostalTaskDetailsLoading = (state, action) => {
    return updateObject(state, {
        error: null,
        postPostalTaskDetailsState : 'LOADING'
    })
}

const postPostalTaskDetailsSuccess = (state, action) => {
    return updateObject(state, {
        error: null,
        postPostalTaskDetailsState : 'SUCCESS',
    })
}

const postPostalTaskDetailsError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        postPostalTaskDetailsState : 'ERROR'
    })
}

const getAgencyListLoading = (state, action) => {
    return updateObject(state, {
        getAgencyListState: 'LOADING'
    });
};

const getAgencyListSuccess = (state, action) => {
    // let agencyUpdatedList = [];
    // agencyUpdatedList = [...action.agencyList, {label: "unassigned", value: "UNASSIGNED"}];
    return updateObject(state, {
        getAgencyListState: 'SUCCESS',
        agencyList: action.agencyList,
        error: null
    });
};

const getAgencyListError = (state, action) => {
    return updateObject(state, {
        getAgencyListState: 'ERROR',
        error: action.error
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {

        case actionTypes.INIT_STATE: return initState();

        // case actionTypes.GET_TASK_CLOSURE_STATIC_DATA_LOADING: return getTaskClosureStaticDataLoading(state, action);
        // case actionTypes.GET_TASK_CLOSURE_STATIC_DATA_SUCCESS: return getTaskClosureStaticDataSuccess(state, action);
        // case actionTypes.GET_TASK_CLOSURE_STATIC_DATA_ERROR: return getTaskClosureStaticDataError(state, action);

        // case actionTypes.GET_INDIVIDUAL_TASK_LOADING: return getIndividualTaskLoading(state, action);
        // case actionTypes.GET_INDIVIDUAL_TASK_SUCCESS: return getIndividualTaskSuccess(state, action);
        // case actionTypes.GET_INDIVIDUAL_TASK_ERROR: return getIndividualTaskError(state, action);

        case actionTypes.GET_TAG_NAME_LOADING: return getTagNameLoading(state, action);
        case actionTypes.GET_TAG_NAME_SUCCESS: return getTagNameSuccess(state, action);
        case actionTypes.GET_TAG_NAME_ERROR: return getTagNameError(state, action);

        // case actionTypes.POST_INDIVIDUAL_TASK_LOADING: return postIndividualTaskLoading(state, action);
        // case actionTypes.POST_INDIVIDUAL_TASK_SUCCESS: return postIndividualTaskSuccess(state, action);
        // case actionTypes.POST_INDIVIDUAL_TASK_ERROR: return postIndividualTaskError(state, action);

        case actionTypes.GET_INDIVIDUAL_TASK_NOTIFICATION: return getNotificationData(state, action);

        case actionTypes.GET_POSTAL_TASK_DETAILS_LOADING: return getPostalTaskDetailsLoading(state, action);
        case actionTypes.GET_POSTAL_TASK_DETAILS_SUCCESS: return getPostalTaskDetailsSuccess(state, action);
        case actionTypes.GET_POSTAL_TASK_DETAILS_ERROR: return getPostalTaskDetailsError(state, action);

        case actionTypes.POST_POSTAL_TASK_DETAILS_LOADING: return postPostalTaskDetailsLoading(state, action);
        case actionTypes.POST_POSTAL_TASK_DETAILS_SUCCESS: return postPostalTaskDetailsSuccess(state, action);
        case actionTypes.POST_POSTAL_TASK_DETAILS_ERROR: return postPostalTaskDetailsError(state, action);

        case actionTypes.GET_AGENCY_LIST_LOADING: return getAgencyListLoading(state, action);
        case actionTypes.GET_AGENCY_LIST_SUCCESS: return getAgencyListSuccess(state, action);
        case actionTypes.GET_AGENCY_LIST_ERROR: return getAgencyListError(state, action);

        default: return state;

    }
}

export default reducer;