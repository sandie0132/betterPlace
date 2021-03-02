import { combineReducers } from 'redux';
import _ from 'lodash';

import { updateObject } from "../../EmpMgmtStore/utility";
import * as actionTypes from './actionTypes';
import * as initData from './StaticDataInitData'

import empBasicRegistrationReducer from '../EmpBasicRegistration/Store/reducer';
import empAdditionalDetailsReducer from '../EmpAdditionalDetails/Store/reducer';
import empDetailsReducer from '../EmpDetails/Store/reducer';
// import empCompanyDocumentsReducer from '../EmpCompanyDocuments/Store/reducer';

const initialState = {
    getStaticDataState: 'LOADING',
    getEmpDataState: 'INIT',
    postEmpDataState: 'INIT',
    putEmpDataState: 'INIT',
    empDocGenerateState: 'INIT',

    getEmpProfilePicState: 'INIT',
    getEmpDefaultRoleState: 'INIT',
    getEmpReportingManagerState: 'INIT',

    getEmpMissingInfoState: 'INIT',
    getBgvDataState: 'INIT',

    staticData: _.cloneDeep(initData.staticData),
    empData: {},
    empProfilePic: null,
    empDefaultRole: null,
    empDefaultLocation: null,
    empReportingManager: null,
    bgvData: null,
    empMissingInfo: null,

    uploadDocumentState: "INIT",
    percentCompleted: 0,
    documentURL: '',
    downloadDocumentState: "INIT",


    sectionStatus: {
        basicDetails: {
            status: 'todo',
            subSectionStatus: null
        },
        additionalDetails: {
            status: 'todo',
            subSectionStatus: null
        },
        employeeDetails: {
            status: 'todo',
            subSectionStatus: null
        },
        companyDocuments: {
            status: 'todo',
            subSectionStatus: null
        },
        governmentDocuments: {
            status: 'todo',
            subSectionStatus: null
        }
    },

    error: null
}

//INIT STATE REDUCERS
const initState = () => {
    return initialState;
}

//GET STATIC DATA REDUCERS
const getStaticDataLoading = (state) => {
    return updateObject(state, {
        getStaticDataState: 'LOADING'
    });
}

const getStaticDataSuccess = (state, action) => {
    return updateObject(state, {
        getStaticDataState: 'SUCCESS',
        staticData: action.staticData,
        error: null
    });
};

const getStaticDataError = (state, action) => {
    return updateObject(state, {
        getStaticDataState: 'ERROR',
        error: action.error,
    });
};

//GET EMP DATA REDUCERS
const getEmpDataLoading = (state) => {
    return updateObject(state, {
        getEmpDataState: 'LOADING'
    });
}

const getEmpDataSuccess = (state, action) => {
    return updateObject(state, {
        getEmpDataState: 'SUCCESS',
        empData: action.data,
        error: null
    });
};

const getEmpDataError = (state, action) => {
    return updateObject(state, {
        getEmpDataState: 'ERROR',
        error: action.error,
    });
};

//PUT EMP DATA REDUCERS
const putEmpDataLoading = (state) => {
    return updateObject(state, {
        putEmpDataState: 'LOADING'
    });
}

const putEmpDataSuccess = (state, action) => {
    return updateObject(state, {
        putEmpDataState: 'SUCCESS',
        empData: action.data,
        error: null
    });
};

const putEmpDataError = (state, action) => {
    return updateObject(state, {
        putEmpDataState: 'ERROR',
        error: action.error,
    });
};

//GET EMP PIC REDUCERS
const getEmpPicLoading = (state) => {
    return updateObject(state, {
        getEmpProfilePicState: 'LOADING'
    });
}

const getEmpPicSuccess = (state, action) => {
    return updateObject(state, {
        getEmpProfilePicState: 'SUCCESS',
        empProfilePic: action.empProfilePic,
        error: null
    });
};

const getEmpPicError = (state, action) => {
    return updateObject(state, {
        getEmpProfilePicState: 'ERROR',
        error: action.error,
    });
};

//REMOVE EMPLOYEE PROFILE PIC
const removeEmpProfilePic = (state) => {
    return updateObject(state, {
        empProfilePic: null
    });
}

//GET EMP DEFAULT ROLE REDUCERS
const getEmpDefRoleLoading = (state) => {
    return updateObject(state, {
        getEmpDefaultRoleState: 'LOADING'
    });
}

const getEmpDefRoleSuccess = (state, action) => {
    return updateObject(state, {
        getEmpDefaultRoleState: 'SUCCESS',
        empDefaultRole: action.empDefaultRole,
        empDefaultLocation: action.empDefaultLocation,
        error: null
    });
};

const getEmpDefRoleError = (state, action) => {
    return updateObject(state, {
        getEmpDefaultRoleState: 'ERROR',
        error: action.error,
    });
};

//GET EMP REPORTING MANAGER REDUCERS
const getEmpReportingManagerLoading = (state) => {
    return updateObject(state, {
        getEmpReportingManagerState: 'LOADING'
    });
}

const getEmpReportingManagerSuccess = (state, action) => {
    return updateObject(state, {
        getEmpReportingManagerState: 'SUCCESS',
        empReportingManager: action.empReportingManager,
        error: null
    });
};

const getEmpReportingManagerError = (state, action) => {
    return updateObject(state, {
        getEmpReportingManagerState: 'ERROR',
        error: action.error,
    });
};

//UPDATE SECTION STATUS REDUCER
const updateSectionStatus = (state, action) => {
    return updateObject(state, {
        sectionStatus: action.sectionStatus,
    });
};


//GET EMP BGV DATA REDUCRES
const getEmpBgvDataLoading = (state) => {
    return updateObject(state, {
        getBgvDataState: 'LOADING'
    });
}

const getEmpBgvDataSuccess = (state, action) => {
    return updateObject(state, {
        getBgvDataState: 'SUCCESS',
        bgvData: action.bgvData,
        error: null
    });
};

const getEmpBgvDataError = (state, action) => {
    return updateObject(state, {
        getBgvDataState: 'ERROR',
        error: action.error,
    });
};


//GET EMP MISSING INFO REDUCRES
const getEmpMissingInfoLoading = (state) => {
    return updateObject(state, {
        getEmpMissingInfoState: 'LOADING'
    });
}

const getEmpMissingInfoSuccess = (state, action) => {
    return updateObject(state, {
        getEmpMissingInfoState: 'SUCCESS',
        empMissingInfo: action.empMissingInfo,
        error: null
    });
};

const getEmpMissingInfoError = (state, action) => {
    return updateObject(state, {
        getEmpMissingInfoState: 'ERROR',
        error: action.error,
    });
};

// DOCUMENT GENERATE REDUCERS
const generateDocumentLoading = (state) => {
    return updateObject(state, {
        empDocGenerateState: 'LOADING'
    });
}

const generateDocumentSuccess = (state, action) => {
    return updateObject(state, {
        empDocGenerateState: 'SUCCESS',
        empData: action.data
    });
};

const generateDocumentError = (state, action) => {
    return updateObject(state, {
        empDocGenerateState: 'ERROR',
        error: action.error,
    });
};

// DOCUMENT SAVE REDUCERS
const saveDocumentLoading = (state) => {
    return updateObject(state, {
        empDocSaveState: 'LOADING'
    });
}

const saveDocumentSuccess = (state, action) => {
    return updateObject(state, {
        empDocSaveState: 'SUCCESS',
       // empData: action.data
    });
};

const saveDocumentError = (state, action) => {
    return updateObject(state, {
        empDocSaveState: 'ERROR',
        error: action.error,
    });
};

// UPLOAD DOCUMENTS REDUCERS
const uploadDocumentLoading = (state, action) => {
    return updateObject(state, {
        uploadDocumentState: 'LOADING',
        percentCompleted: action.percentCompleted
    });
}

const uploadDocumentSuccess = (state, action) => {
    return updateObject(state, {
        uploadDocumentState: 'SUCCESS',
        documentURL: action.downloadURL
    });
}

const uploadDocumentError = (state, action) => {
    return updateObject(state, {
        uploadDocumentState: 'ERROR',
        error: action.error
    });
}

// DOWNLOAD DOCUMENTS REDUCERS
const downloadDocumentLoading = (state, action) => {
    return updateObject(state, {
        downloadDocumentState: 'LOADING'
    });
}

const downloadDocumentSuccess = (state, action) => {
    return updateObject(state, {
        downloadDocumentState: 'SUCCESS',
    });
}

const downloadDocumentError = (state, action) => {
    return updateObject(state, {
        downloadDocumentState: 'ERROR',
        error: action.error
    });
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_STATE: return initState();

        case actionTypes.GET_STATIC_DATA_LOADING: return getStaticDataLoading(state, action);
        case actionTypes.GET_STATIC_DATA_SUCCESS: return getStaticDataSuccess(state, action);
        case actionTypes.GET_STATIC_DATA_ERROR: return getStaticDataError(state, action);

        case actionTypes.GET_EMPLOYEE_DATA_LOADING: return getEmpDataLoading(state, action);
        case actionTypes.GET_EMPLOYEE_DATA_SUCCESS: return getEmpDataSuccess(state, action);
        case actionTypes.GET_EMPLOYEE_DATA_ERROR: return getEmpDataError(state, action);

        case actionTypes.UPDATE_EMPLOYEE_DATA_LOADING: return putEmpDataLoading(state, action);
        case actionTypes.UPDATE_EMPLOYEE_DATA_SUCCESS: return putEmpDataSuccess(state, action);
        case actionTypes.UPDATE_EMPLOYEE_DATA_ERROR: return putEmpDataError(state, action);

        case actionTypes.GET_EMPLOYEE_PROFILE_PIC_LOADING: return getEmpPicLoading(state, action);
        case actionTypes.GET_EMPLOYEE_PROFILE_PIC_SUCCESS: return getEmpPicSuccess(state, action);
        case actionTypes.GET_EMPLOYEE_PROFILE_PIC_ERROR: return getEmpPicError(state, action);

        case actionTypes.REMOVE_EMPLOYEE_PROFILE_PIC: return removeEmpProfilePic(state, action);

        case actionTypes.GET_EMPLOYEE_DEFAULT_ROLE_LOADING: return getEmpDefRoleLoading(state, action);
        case actionTypes.GET_EMPLOYEE_DEFAULT_ROLE_SUCCESS: return getEmpDefRoleSuccess(state, action);
        case actionTypes.GET_EMPLOYEE_DEFAULT_ROLE_ERROR: return getEmpDefRoleError(state, action);

        case actionTypes.GET_EMPLOYEE_REPORTING_MANAGER_LOADING: return getEmpReportingManagerLoading(state, action);
        case actionTypes.GET_EMPLOYEE_REPORTING_MANAGER_SUCCESS: return getEmpReportingManagerSuccess(state, action);
        case actionTypes.GET_EMPLOYEE_REPORTING_MANAGER_ERROR: return getEmpReportingManagerError(state, action);

        case actionTypes.UPDATE_SECTION_STATUS: return updateSectionStatus(state, action);

        case actionTypes.GET_EMPLOYEE_BGV_DATA_LOADING: return getEmpBgvDataLoading(state, action);
        case actionTypes.GET_EMPLOYEE_BGV_DATA_SUCCESS: return getEmpBgvDataSuccess(state, action);
        case actionTypes.GET_EMPLOYEE_BGV_DATA_ERROR: return getEmpBgvDataError(state, action);

        case actionTypes.GET_EMP_MISSING_INFO_LOADING: return getEmpMissingInfoLoading(state, action);
        case actionTypes.GET_EMP_MISSING_INFO_SUCCESS: return getEmpMissingInfoSuccess(state, action);
        case actionTypes.GET_EMP_MISSING_INFO_ERROR: return getEmpMissingInfoError(state, action);

        case actionTypes.GENERATE_DOCUMENT_LOADING : return generateDocumentLoading(state,action);
        case actionTypes.GENERATE_DOCUMENT_SUCCESS : return generateDocumentSuccess(state,action);
        case actionTypes.GENERATE_DOCUMENT_ERROR : return generateDocumentError(state,action);

        case actionTypes.SAVE_DOCUMENT_LOADING : return saveDocumentLoading(state,action);
        case actionTypes.SAVE_DOCUMENT_SUCCESS : return saveDocumentSuccess(state,action);
        case actionTypes.SAVE_DOCUMENT_ERROR : return saveDocumentError(state,action);

        case actionTypes.UPLOAD_DOCUMENT_LOADING : return uploadDocumentLoading(state,action);
        case actionTypes.UPLOAD_DOCUMENT_SUCCESS : return uploadDocumentSuccess(state,action);
        case actionTypes.UPLOAD_DOCUMENT_ERROR : return uploadDocumentError(state,action);

        case actionTypes.DOWNLOAD_DOCUMENT_LOADING : return downloadDocumentLoading(state,action);
        case actionTypes.DOWNLOAD_DOCUMENT_SUCCESS : return downloadDocumentSuccess(state,action);
        case actionTypes.DOWNLOAD_DOCUMENT_ERROR : return downloadDocumentError(state,action);

        default: return state;
    }
};


//EMP ONBOARD REDUCERS
const empOnboardReducer = combineReducers({
    onboard: reducer,
    basicRegistration: empBasicRegistrationReducer,
    additionalDetails: empAdditionalDetailsReducer,
    empDetails: empDetailsReducer,
    // empCompanyDocuments: empCompanyDocumentsReducer
});

export default empOnboardReducer;