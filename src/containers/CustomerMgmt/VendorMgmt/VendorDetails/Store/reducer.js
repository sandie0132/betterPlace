import * as actionTypes from './actionTypes';
import updateObject from '../../VendorMgmtStore/utility';

const initialState = {
  error: null,
  orgData: '',
  postDataState: 'INIT',
  data: '',
  agreementState: 'INIT',
  agreementUrl: [],
  deleteAgreementState: 'INIT',
  getVendorDataState: 'INIT',
  getVendorData: '',
  vendorContactsList: [],
  vendorContactsListState: 'INIT',
  getOrgName: '',
  getOrgNameState: 'INIT',
  downloadFileState: 'INIT',
  putVendorDataState: 'INIT',
};

const initState = () => initialState;

const getDataLoading = (state) => updateObject(state, {
  getVendorDataState: 'LOADING',
  error: null,
});

const getDataSuccess = (state, action) => updateObject(state, {
  getVendorDataState: 'SUCCESS',
  getVendorData: action.data,
  error: null,
});

const getDataError = (state, action) => updateObject(state, {
  getVendorDataState: 'ERROR',
  error: action.error,
});

const postDataLoading = (state) => updateObject(state, {
  postDataState: 'LOADING',
  error: null,
});

const postDataSuccess = (state, action) => updateObject(state, {
  postDataState: 'SUCCESS',
  getVendorData: action.data,
  error: null,
});

const postDataError = (state, action) => updateObject(state, {
  postDataState: 'ERROR',
  error: action.error,
});

const agreementLoading = (state) => updateObject(state, {
  agreementState: 'LOADING',
  error: null,
});

const agreementSuccess = (state, action) => updateObject(state, {
  agreementState: 'SUCCESS',
  agreementUrl: action.agreementUrl,
  error: null,
});

const agreementError = (state, action) => updateObject(state, {
  agreementState: 'ERROR',
  error: action.error,
});

const deleteAgreementLoading = (state) => updateObject(state, {
  deleteAgreementState: 'LOADING',
  error: null,
});

const deleteAgreementSuccess = (state) => updateObject(state, {
  deleteAgreementState: 'SUCCESS',
  error: null,
});

const deleteAgreementError = (state, action) => updateObject(state, {
  deleteAgreementState: 'ERROR',
  error: action.error,
});

const getOrgNameLoading = (state) => updateObject(state, {
  getOrgNameState: 'LOADING',
  error: null,
});

const getOrgNameSuccess = (state, action) => updateObject(state, {
  getOrgNameState: 'SUCCESS',
  getOrgName: action.orgName,
  error: null,
});

const getOrgNameError = (state, action) => updateObject(state, {
  getOrgNameState: 'ERROR',
  error: action.error,
});

const resetError = (state) => updateObject(state, {
  error: null,
});

// download uploaded files
const downloadFileLoading = (state) => updateObject(state, {
  downloadFileState: 'LOADING',
});

const downloadFileSuccess = (state) => updateObject(state, {
  downloadFileState: 'SUCCESS',
});

const downloadFileError = (state) => updateObject(state, {
  downloadFileState: 'ERROR',
});

const putVendorDataLoading = (state) => updateObject(state, {
  putVendorDataState: 'LOADING',
  error: null,
});

const putVendorDataSuccess = (state, action) => updateObject(state, {
  putVendorDataState: 'SUCCESS',
  getVendorData: action.data,
  error: null,
});

const putVendorDataError = (state, action) => updateObject(state, {
  putVendorDataState: 'ERROR',
  error: action.error,
});

const getVendorContactsLoading = (state) => updateObject(state, {
  vendorContactsListState: 'LOADING',
  error: null,
});

const getVendorContactsSuccess = (state, action) => updateObject(state, {
  vendorContactsListState: 'SUCCESS',
  vendorContactsList: action.vendorContactsList,
  error: null,
});

const getVendorContactsError = (state, action) => updateObject(state, {
  vendorContactsListState: 'ERROR',
  error: action.error,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_INIT_STATE: return initState();
    case actionTypes.RESET_ERROR: return resetError(state, action);

    case actionTypes.GET_DATA_LOADING: return getDataLoading(state, action);
    case actionTypes.GET_DATA_SUCCESS: return getDataSuccess(state, action);
    case actionTypes.GET_DATA_ERROR: return getDataError(state, action);

    case actionTypes.POST_DATA_LOADING: return postDataLoading(state, action);
    case actionTypes.POST_DATA_SUCCESS: return postDataSuccess(state, action);
    case actionTypes.POST_DATA_ERROR: return postDataError(state, action);

    case actionTypes.GET_AGREEMENT_LOADING: return agreementLoading(state, action);
    case actionTypes.GET_AGREEMENT_SUCCESS: return agreementSuccess(state, action);
    case actionTypes.GET_AGREEMENT_ERROR: return agreementError(state, action);

    case actionTypes.DELETE_AGREEMENT_LOADING: return deleteAgreementLoading(state, action);
    case actionTypes.DELETE_AGREEMENT_SUCCESS: return deleteAgreementSuccess(state, action);
    case actionTypes.DELETE_AGREEMENT_ERROR: return deleteAgreementError(state, action);

    case actionTypes.GET_ORG_NAME_LOADING: return getOrgNameLoading(state);
    case actionTypes.GET_ORG_NAME_SUCCESS: return getOrgNameSuccess(state, action);
    case actionTypes.GET_ORG_NAME_ERROR: return getOrgNameError(state, action);

    case actionTypes.DOWNLOAD_FILE_LOADING: return downloadFileLoading(state, action);
    case actionTypes.DOWNLOAD_FILE_SUCCESS: return downloadFileSuccess(state, action);
    case actionTypes.DOWNLOAD_FILE_ERROR: return downloadFileError(state, action);

    case actionTypes.PUT_VENDOR_DATA_LOADING: return putVendorDataLoading(state, action);
    case actionTypes.PUT_VENDOR_DATA_SUCCESS: return putVendorDataSuccess(state, action);
    case actionTypes.PUT_VENDOR_DATA_ERROR: return putVendorDataError(state, action);

    case actionTypes.GET_VENDOR_CONTACTS_LOADING: return getVendorContactsLoading(state, action);
    case actionTypes.GET_VENDOR_CONTACTS_SUCCESS: return getVendorContactsSuccess(state, action);
    case actionTypes.GET_VENDOR_CONTACTS_ERROR: return getVendorContactsError(state, action);

    default: return state;
  }
};

export default reducer;
