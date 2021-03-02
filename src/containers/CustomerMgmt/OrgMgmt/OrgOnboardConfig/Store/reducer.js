import { updateObject } from "./utility";
import * as actionTypes from './actionTypes';
import _ from 'lodash';
import { combineReducers } from 'redux';

import documentMgmtReducer from '../DocumentManagement/Store/reducer';
import governmentDocReducer from "../GovernmentDocument/Store/reducer";

const initialState = {
    postOrgOnboardConfigState: "INIT",
    getOrgOnboardConfigState: "INIT",
    orgOnboardConfig: null,

    getDocumentListState: 'INIT',
    documentList:null,

    sectionStatus: {
        selectDocuments: {
            status: 'todo',
            subSectionStatus: null
        },
        governmentDocuments: {
            status: 'todo',
            subSectionStatus: null
        },
        companyDocuments: {
            status: 'todo',
            subSectionStatus: null
        }
    },
    error: null,

    percentCompleted: 0,
    uploadOrgOnboardDocumentState: "INIT",
    downloadURL: null,
    fileProcessState: "INIT",
    fileProcessedData: null
    
}


//INIT STATE REDUCERS
const initState = () => {

    let initialStates = _.cloneDeep(initialState)
    let initialSectionStatus = {
        selectDocuments: {
            status: 'todo',
            subSectionStatus: null
        },
        governmentDocuments: {
            status: 'todo',
            subSectionStatus: null
        },
        companyDocuments: {
            status: 'todo',
            subSectionStatus: null
        }

    }
    initialStates.sectionStatus = initialSectionStatus;
    return initialStates;
}

//GET ORG ONBOARD CONFIG REDUCERs
const getOrgOnboardConfigLoading = (state) => {
    return updateObject(state, {
        getOrgOnboardConfigState: 'LOADING',
    });
}

const getOrgOnboardConfigSuccess = (state, action) => {
    return updateObject(state, {
        getOrgOnboardConfigState: 'SUCCESS',
        orgOnboardConfig: action.data
    });
}

const getOrgOnboardConfigError = (state, action) => {
    return updateObject(state, {
        getOrgOnboardConfigState: 'ERROR',
        error: action.error
    });
}

//POST ORG ONBOARD CONFIG REDUCERs
const postOrgOnboardConfigLoading = (state) => {
    return updateObject(state, {
        postOrgOnboardConfigState: 'LOADING',
    });
}

const postOrgOnboardConfigSuccess = (state, action) => {
    return updateObject(state, {
        postOrgOnboardConfigState: 'SUCCESS',
        orgOnboardConfig: action.data
    });
}

const postOrgOnboardConfigError = (state, action) => {
    return updateObject(state, {
        postOrgOnboardConfigState: 'ERROR',
        error: action.error
    });
}

//UPDATE SECTION STATUS REDUCER
const updateSectionStatus = (state, action) => {
    return updateObject(state, {
        sectionStatus: action.sectionStatus,
    });
};

//   ////////Consent Reducers

// const uploadOrgOnboardDocumentSucess = (state, action) => {
//     return updateObject(state, {
//         downloadURL: action.downloadURL,
//         error: null,
//         uploadOrgOnboardDocumentState: "SUCCESS"
//     });
// };

// const uploadOrgOnboardDocumentError = (state, action) => {
//     return updateObject(state, {
//         error: action.error,
//         uploadOrgOnboardDocumentState: "ERROR"
//     });
// };

// const uploadOrgOnboardDocumentLoading = (state, action) => {
//     return updateObject(state, {
//         uploadOrgOnboardDocumentState: "LOADING",
//         percentCompleted: action.percentCompleted
//     });
// };


////file processing

// const fileProcessLoading = (state, action ) =>{
//     return updateObject(state, {
//         fileProcessState: "LOADING"
//     })
// };

// const fileProcessSuccess = (state, action ) =>{
//     return updateObject(state, {
//         fileProcessState: "SUCCESS",
//         fileProcessedData: action.data
//     })
// };

// const fileProcessError = (state, action ) =>{
//     return updateObject(state, {
//         fileProcessState: "ERROR",
//         error: action.error
//     })
// };

//GET DOCUMENT LIST REDUCERS
const getDocumentListLoading = (state) => {
    return updateObject(state, {
        getDocumentListState: 'LOADING'
    });
}

const getDocumentListSuccess = (state, action) => {
    return updateObject(state, {
        getDocumentListState: 'SUCCESS',
        documentList: action.data,
        error: null
    });
};

const getDocumentListError = (state, action) => {
    return updateObject(state, {
        getDocumentListState: 'ERROR',
        error: action.error,
    });
};


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_STATE: return initState();

        case actionTypes.UPDATE_SECTION_STATUS: return updateSectionStatus(state, action);

        case actionTypes.GET_ORG_ONBOARD_CONFIG_LOADING: return getOrgOnboardConfigLoading(state);
        case actionTypes.GET_ORG_ONBOARD_CONFIG_SUCCESS: return getOrgOnboardConfigSuccess(state, action);
        case actionTypes.GET_ORG_ONBOARD_CONFIG_ERROR: return getOrgOnboardConfigError(state, action);

        case actionTypes.POST_ORG_ONBOARD_CONFIG_LOADING: return postOrgOnboardConfigLoading(state);
        case actionTypes.POST_ORG_ONBOARD_CONFIG_SUCCESS: return postOrgOnboardConfigSuccess(state, action);
        case actionTypes.POST_ORG_ONBOARD_CONFIG_ERROR: return postOrgOnboardConfigError(state, action);


        // case actionTypes.UPLOAD_ORG_ONBOARD_DOCUMENT_LOADING: return uploadOrgOnboardDocumentLoading(state, action);
        // case actionTypes.UPLOAD_ORG_ONBOARD_DOCUMENT_SUCCESS: return uploadOrgOnboardDocumentSucess(state, action);
        // case actionTypes.UPLOAD_ORG_ONBOARD_DOCUMENT_ERROR: return uploadOrgOnboardDocumentError(state, action);

        // case actionTypes.FILE_PROCESS_LOADING : return fileProcessLoading(state,action);
        // case actionTypes.FILE_PROCESS_SUCCESS : return fileProcessSuccess(state,action);
        // case actionTypes.FILE_PROCESS_ERROR : return fileProcessError(state,action);
        
        case actionTypes.GET_DOCUMENT_LIST_LOADING: return getDocumentListLoading(state, action);
        case actionTypes.GET_DOCUMENT_LIST_SUCCESS: return getDocumentListSuccess(state, action);
        case actionTypes.GET_DOCUMENT_LIST_ERROR: return getDocumentListError(state, action);

        default: return state;
    }
}

const orgOnboardReducer = combineReducers({
    onboardConfig: reducer,
    documents: documentMgmtReducer,
    governmentDocuments : governmentDocReducer
})

export default orgOnboardReducer;