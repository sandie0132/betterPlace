import * as actionTypes from './actionTypes';
import { updateObject } from '../../EmpMgmtStore/utility';

const initialState = {
  getEmpDataState: 'INIT',
  empData: {
    employeeId: '',
    location: '',
    function: '',
    organisation: {
      name: '',
    },
    person: {
      profilePicUrl: '',
      firstName: '',
      lastName: '',
      gender: '',
      fatherName: '',
      motherName: '',
      maritalStatus: '',
      religion: '',
      nationality: '',
    },
  },

  contactList: {
    emails: [{
      contact: '',
    }],
    mobileNumbers: [{
      contact: '',
    }],
  },
  addressList: [{
    // addressLine1:'',
    // addressLine2:'',
    doorNo: '',
    landmark: '',
    street: '',
    locality: '',
    poName: '',
    pincode: '',
    city: '',
    district: '',
    state: '',
    addressType: '',
  }],
  historyList: [{
    designation: '',
    employeeId: '',
    organisation: '',
    date: '',
    joinedFrom: '',
    downloadURL: [],
  }],
  educationList: [{
    course: '',
    educationType: '',
    school_college: '',
    from: '',
    to: '',
    passedYear: '',
    cgpa_percentage: '',
    board_university: '',
    downloadURL: [],
  }],
  healthList: {
    bloodGroup: '',
    height: '',
    weight: '',
    identificationMark: '',
    heightUnit: '',
    weightUnit: '',
  },
  skillsList: [
    {
      name: '',
    },
  ],
  preferenceList: [{
    name: '',
  }],
  languageList: [{
    language: '',
  }],
  familyList: [{
    dob: '',
    name: '',
    mobile: '',
    relationship: '',
  }],
  socialList: [{
    platform: '',
    profileUrl: '',
  }],
  serviceStatus: null,
  verificationStatus: null,
  serviceStatusState: 'INIT',
  error: null,
  empMissingData: [],
  empInsufficientInfo: [],
  empMissingDataWithStatus: {},
  getEmpMissingDataState: 'INIT',
  tagData: '',
  tagDataState: 'INIT',
  downloadFileState: 'INIT',

  vendorClientInfoState: 'INIT',
  vendorClientInfo: {},
  getEmpLeaveQuotaState: 'INIT',
  empLeaveQuota: null,
  clientsExists: false,
  orgNameMapping: {},
};

const initState = () => initialState;

// GET EMP DATA REDUCERS
const getEmpDataLoading = (state) => updateObject(state, {
  getEmpDataState: 'LOADING',
});

const getEmpDataSuccess = (state, action) => updateObject(state, {
  getEmpDataState: 'SUCCESS',
  empData: action.empData,
  error: null,
});

const getEmpDataError = (state, action) => updateObject(state, {
  getEmpDataState: 'ERROR',
  error: action.error,
});

// GET EMP BGV DATA REDUCERS
const getEmpBGVDataLoading = (state) => updateObject(state, {
  serviceStatusState: 'LOADING',
});

const getEmpBGVDataSuccess = (state, action) => updateObject(state, {
  serviceStatusState: 'SUCCESS',
  serviceStatus: action.serviceStatus,
  verificationStatus: action.verificationStatus,
  error: null,
});

const getEmpBGVDataError = (state, action) => updateObject(state, {
  serviceStatusState: 'ERROR',
  error: action.error,
});

// GET EMP MISSING DATA REDUCERS
const getEmpMissingDataLoading = (state) => updateObject(state, {
  getEmpMissingDataState: 'LOADING',
});

const getEmpMissingDataSuccess = (state, action) => {
  const empMissingInfoDetails = action.empMissingDataWithStatus;
  const inSufficientInfo = [];
  const missingInfo = [];

  Object.entries(empMissingInfoDetails).forEach((keys) => {
    keys[1].forEach((key) => {
      if (key && key.status === 'insufficient_info') {
        inSufficientInfo.push(keys[0]);
      }
      if (key && key.status === 'missing_info') {
        missingInfo.push(keys[0]);
      }
    });
  });
  return updateObject(state, {
    getEmpMissingDataState: 'SUCCESS',
    empMissingData: missingInfo,
    empInsufficientInfo: inSufficientInfo,
    empMissingDataWithStatus: action.empMissingDataWithStatus,
    error: null,
  });
};

const getEmpMissingDataError = (state, action) => updateObject(state, {
  getEmpMissingDataState: 'ERROR',
  error: action.error,
});

const getTagNameLoading = (state) => updateObject(state, {
  error: null,
  tagDataState: 'LOADING',
});

const getTagNameSuccess = (state, action) => updateObject(state, {
  error: null,
  tagDataState: 'SUCCESS',
  tagData: action.tagData,
});

const getTagNameError = (state, action) => updateObject(state, {
  error: action.error,
  tagDataState: 'ERROR',
});

// download uploaded files
const downloadFileLoading = (state) => updateObject(state, {
  downloadFileState: 'LOADING',
});

const downloadFileSuccess = (state) => updateObject(state, {
  downloadFileState: 'SUCCESS',
});

const downloadFileError = (state, action) => updateObject(state, {
  error: action.error,
  downloadFileState: 'ERROR',
});

// get vendor client orgs info
const vendorClientInfoLoading = (state) => updateObject(state, {
  vendorClientInfoState: 'LOADING',
});

const vendorClientInfoSuccess = (state, action) => updateObject(state, {
  vendorClientInfoState: 'SUCCESS',
  vendorClientInfo: action.vendorClientInfo,
  clientsExists: action.clientsExists,
  error: null,
});

const vendorClientInfoError = (state, action) => updateObject(state, {
  vendorClientInfoState: 'ERROR',
  error: action.error,
});

const getEmpLeaveQuotaLoading = (state) => updateObject(state, {
  getEmpLeaveQuotaState: 'LOADING',
});

const getEmpLeaveQuotaSuccess = (state, action) => updateObject(state, {
  getEmpLeaveQuotaState: 'SUCCESS',
  empLeaveQuota: action.data,
});

const getEmpLeaveQuotaError = (state, action) => updateObject(state, {
  getEmpLeaveQuotaState: 'ERROR',
  error: action.error,
});

const getOrgListLoading = (state) => updateObject(state, {
  getOrgListState: 'LOADING',
});

const getOrgListSuccess = (state, action) => updateObject(state, {
  getOrgListState: 'SUCCESS',
  orgNameMapping: action.orgNameMapping,
  error: null,
});

const getOrgListError = (state, action) => updateObject(state, {
  getOrgListState: 'ERROR',
  error: action.error,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INIT_STATE: return initState();

    case actionTypes.GET_EMP_DATA_LOADING: return getEmpDataLoading(state, action);
    case actionTypes.GET_EMP_DATA_SUCCESS: return getEmpDataSuccess(state, action);
    case actionTypes.GET_EMP_DATA_ERROR: return getEmpDataError(state, action);

    case actionTypes.GET_EMP_BGV_DATA_LOADING: return getEmpBGVDataLoading(state, action);
    case actionTypes.GET_EMP_BGV_DATA_SUCCESS: return getEmpBGVDataSuccess(state, action);
    case actionTypes.GET_EMP_BGV_DATA_ERROR: return getEmpBGVDataError(state, action);

    case actionTypes.GET_EMP_MISSING_DATA_LOADING: return getEmpMissingDataLoading(state, action);
    case actionTypes.GET_EMP_MISSING_DATA_SUCCESS: return getEmpMissingDataSuccess(state, action);
    case actionTypes.GET_EMP_MISSING_DATA_ERROR: return getEmpMissingDataError(state, action);

    case actionTypes.GET_TAG_NAME_LOADING: return getTagNameLoading(state, action);
    case actionTypes.GET_TAG_NAME_SUCCESS: return getTagNameSuccess(state, action);
    case actionTypes.GET_TAG_NAME_ERROR: return getTagNameError(state, action);

    case actionTypes.DOWNLOAD_FILE_LOADING: return downloadFileLoading(state, action);
    case actionTypes.DOWNLOAD_FILE_SUCCESS: return downloadFileSuccess(state, action);
    case actionTypes.DOWNLOAD_FILE_ERROR: return downloadFileError(state, action);

    case actionTypes.GET_VENDOR_CLIENT_INFO_LOADING: return vendorClientInfoLoading(state);
    case actionTypes.GET_VENDOR_CLIENT_INFO_SUCCESS: return vendorClientInfoSuccess(state, action);
    case actionTypes.GET_VENDOR_CLIENT_INFO_ERROR: return vendorClientInfoError(state, action);

    case actionTypes.GET_EMP_LEAVE_QUOTA_LOADING: return getEmpLeaveQuotaLoading(state);
    case actionTypes.GET_EMP_LEAVE_QUOTA_SUCCESS: return getEmpLeaveQuotaSuccess(state, action);
    case actionTypes.GET_EMP_LEAVE_QUOTA_ERROR: return getEmpLeaveQuotaError(state, action);

    case actionTypes.GET_ORG_LIST_INFO_LOADING: return getOrgListLoading(state);
    case actionTypes.GET_ORG_LIST_INFO_SUCCESS: return getOrgListSuccess(state, action);
    case actionTypes.GET_ORG_LIST_INFO_ERROR: return getOrgListError(state, action);

    default: return state;
  }
};

export default reducer;
