import * as actionTypes from './actionTypes';
import { updateObject } from '../../../CustomerMgmt/OrgMgmt/OrgMgmtStore/utility';

const initialState = {
    getDocumentsState: 'INIT',
    DocumentsList: {},
    // getAgencyTasksCount: 0,
    // getAgencyTasksCountState: 'INIT',

    postalCountState: 'INIT',
    postalCount: 0,
    physicalCountState: 'INIT',
    physicalCount: 0
}

const initState = () => {
    return initialState;
}

const getDocumentsLoading = (state) => {
    return updateObject(state, {
        getDocumentsState: 'LOADING',
        error: null
    })
}

const getDocumentsError = (state, action) => {
    return updateObject(state, {
        getDocumentsState: 'ERROR',
        error: action.error
    })
}

const getDocumentsSuccess = (state, action) => {
    return updateObject(state, {
        getDocumentsState: 'SUCCESS',
        error: null,
        DocumentsList: action.documents
    })
}

// const getAgencyTasksCountLoading = (state, action) => {
//     return updateObject(state, {
//         getAgencyTasksCountState: 'LOADING'
//     });
// };

// const getAgencyTasksCountSuccess = (state, action) => {
//     return updateObject(state, {
//         getAgencyTasksCountState: 'SUCCESS',
//         getAgencyTasksCount: action.tasksCount,
//         error: null
//     });
// };

// const getAgencyTasksCountError = (state, action) => {
//     return updateObject(state, {
//         getAgencyTasksCountState: 'ERROR',
//         error: action.error
//     });
// };

const getPhysicalCountLoading = (state) => {
    return updateObject(state, {
        physicalCountState: 'LOADING'
    });
}

const getPhysicalCountSuccess = (state, action) => {
    return updateObject(state, {
        physicalCountState: 'SUCCESS',
        physicalCount: action.physicalCount,
        error: null
    });
};

const getPhysicalCountError = (state, action) => {
    return updateObject(state, {
        physicalCountState: 'ERROR',
        error: action.error
    });
};

const getPostalCountLoading = (state) => {
    return updateObject(state, {
        postalCountState: 'LOADING'
    });
}

const getPostalCountSuccess = (state, action) => {
    return updateObject(state, {
        postalCountState: 'SUCCESS',
        postalCount: action.postalCount,
        error: null
    });
};

const getPostalCountError = (state, action) => {
    return updateObject(state, {
        postalCountState: 'ERROR',
        error: action.error
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_STATE: return initState();

        case actionTypes.GET_DOCUMENTS_LOADING: return getDocumentsLoading(state);
        case actionTypes.GET_DOCUMENTS_ERROR: return getDocumentsError(state, action);
        case actionTypes.GET_DOCUMENTS_SUCCESS: return getDocumentsSuccess(state, action);

        // case actionTypes.GET_AGENCY_TASKS_COUNT_LOADING: return getAgencyTasksCountLoading(state, action);
        // case actionTypes.GET_AGENCY_TASKS_COUNT_SUCCESS: return getAgencyTasksCountSuccess(state, action);
        // case actionTypes.GET_AGENCY_TASKS_COUNT_ERROR: return getAgencyTasksCountError(state, action);

        case actionTypes.GET_POSTAL_COUNT_LOADING: return getPostalCountLoading(state, action);
        case actionTypes.GET_POSTAL_COUNT_SUCCESS: return getPostalCountSuccess(state, action);
        case actionTypes.GET_POSTAL_COUNT_ERROR: return getPostalCountError(state, action);

        case actionTypes.GET_PHYSICAL_COUNT_LOADING: return getPhysicalCountLoading(state, action);
        case actionTypes.GET_PHYSICAL_COUNT_SUCCESS: return getPhysicalCountSuccess(state, action);
        case actionTypes.GET_PHYSICAL_COUNT_ERROR: return getPhysicalCountError(state, action);

        default: return state;
    }
}

export default reducer;