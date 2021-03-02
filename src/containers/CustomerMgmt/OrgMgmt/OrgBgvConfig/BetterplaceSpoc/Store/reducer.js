import * as actionTypes from './actionTypes';
import { updateObject } from '../../../OrgMgmtStore/utility';


const initialState = {
    getContactListState: 'INIT',
    getContactList: [],
    error: null,
    postSelectedSpocs: 'INIT',
    getPostedSpocs: 'INIT',
    putSelectedSpocs: 'INIT',
    postedContacts: [],
    configuredData: null,

    empDetails: '',
    empDetailsState: 'INIT',
    tagData: '',
    tagDataState: 'INIT',
    singleEmpData: '',
    singleEmpDataState: 'INIT',
}

const getInitState = (state) => {
    return initialState;
}

const getContactListLoading = (state, action) => {
    return updateObject(state, {
        error: null,
        getContactListState: 'LOADING'
    })
}

const getContactListSuccess = (state, action) => {
    return updateObject(state, {
        error: null,
        getContactList: action.contactList,
        getContactListState: 'SUCCESS'
    })
}

const getContactListError = (state, action) => {
    return updateObject(state, {
        error: action.error,
        getContactListState: 'ERROR'
    })
}

const postSelectedSpocsLoading = (state, action) => {
    return updateObject(state, {
        postSelectedSpocs: 'LOADING'
    })
}

const postSelectedSpocsSuccess = (state, action) => {
    return updateObject(state, {
        error: null,
        postSelectedSpocs: 'SUCCESS'
    })
}

const postSelectedSpocsError = (state, action) => {
    return updateObject(state, {
        postSelectedSpocs: 'ERROR',
        error: action.error
    })
}

const getSelectedSpocsLoading = (state, action) => {
    return updateObject(state, {
        getPostedSpocs: 'LOADING',
    })
}

const getSelectedSpocsSuccess = (state, action) => {
    return updateObject(state, {
        getPostedSpocs: 'SUCCESS',
        error: null,
        postedContacts: action.selectedSpocs,
        configuredData: action.configuredData
    })

}

const getSelectedSpocsError = (state, action) => {
    return updateObject(state, {
        getPostedSpocs: 'ERROR',
        error: action.error
    })
}

const getEmployeeDetailsLoading = (state, action) => {
    return updateObject(state, {
        empDetailsState: 'LOADING',
        error: null
    })
}

const getEmployeeDetailsSuccess = (state, action) => {
    return updateObject(state, {
        empDetailsState: 'SUCCESS',
        empDetails: action.empDetails,
        error: null
    })
}

const getEmployeeDetailsError = (state, action) => {
    return updateObject(state, {
        empDetailsState: 'ERROR',
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

const getSingleEmpDataLoading = (state) => {
    return updateObject(state, {
        singleEmpDataState: 'LOADING'
    });
}

const getSingleEmpDataSuccess = (state, action) => {
    return updateObject(state, {
        singleEmpDataState: 'SUCCESS',
        singleEmpData: action.empData,
        error: null
    });
};

const getSingleEmpDataError = (state, action) => {
    return updateObject(state, {
        singleEmpDataState: 'ERROR',
        error: action.error,
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_INIT_STATE: return getInitState(state);

        case actionTypes.GET_BPCONTACT_LIST_LOADING: return getContactListLoading(state, action);
        case actionTypes.GET_BPCONTACT_LIST_SUCCESS: return getContactListSuccess(state, action);
        case actionTypes.GET_BPCONTACT_LIST_ERROR: return getContactListError(state, action);

        case actionTypes.POST_BPSELECTED_SPOCS_LOADING: return postSelectedSpocsLoading(state, action);
        case actionTypes.POST_BPSELECTED_SPOCS_SUCCESS: return postSelectedSpocsSuccess(state, action);
        case actionTypes.POST_BPSELECTED_SPOCS_ERROR: return postSelectedSpocsError(state, action);

        case actionTypes.GET_BPSELECTED_SPOCS_LOADING: return getSelectedSpocsLoading(state, action);
        case actionTypes.GET_BPSELECTED_SPOCS_SUCCESS: return getSelectedSpocsSuccess(state, action);
        case actionTypes.GET_BPSELECTED_SPOCS_ERROR: return getSelectedSpocsError(state, action);

        case actionTypes.GET_BPEMP_LOADING: return getEmployeeDetailsLoading(state, action);
        case actionTypes.GET_BPEMP_SUCCESS: return getEmployeeDetailsSuccess(state, action);
        case actionTypes.GET_BPEMP_ERROR: return getEmployeeDetailsError(state, action);

        case actionTypes.GET_TAG_NAME_LOADING: return getTagNameLoading(state, action);
        case actionTypes.GET_TAG_NAME_SUCCESS: return getTagNameSuccess(state, action);
        case actionTypes.GET_TAG_NAME_ERROR: return getTagNameError(state, action);

        case actionTypes.GET_BPEMP_DATA_LOADING: return getSingleEmpDataLoading(state, action);
        case actionTypes.GET_BPEMP_DATA_SUCCESS: return getSingleEmpDataSuccess(state, action);
        case actionTypes.GET_BPEMP_DATA_ERROR: return getSingleEmpDataError(state, action);

        default: return state;
    }
}

export default reducer;