import * as actionTypes from './actionTypes';
import { updateObject } from './utility';

const initialState = {
  getEmpDataState: 'INIT',
  getOrgDataState: 'INIT',
  getRoleTagDataState: 'INIT',
  getLocationTagDataState: 'INIT',
  downloadPdfState: 'INIT',
  downloadAttachmentState: 'INIT',
  empData: {},
  currentOrgId: null,
  orgData: {},
  roleTag: null,
  locationTag: null,
  globaldbPdf: null,
  crcCurPdf: null,
  crcPerPdf: null,
  pdfurl: null,
  zipFile: null,
  error: null,
  downloadSummaryPdfState: 'INIT',
  summaryPdf: null,
};

// INIT DATA REDUCERS
const initState = () => initialState;

const clearRoleTagInfo = (state) => updateObject(state, {
  getRoleTagDataState: 'INIT',
  roleTag: null,
});

// GET DATA REDUCERS
const getEmpDataLoading = (state) => updateObject(state, {
  getEmpDataState: 'LOADING',
});

const getEmpDataSuccess = (state, action) => updateObject(state, {
  getEmpDataState: 'SUCCESS',
  empData: action.empData,
  currentOrgId: action.currentOrgId,
  error: null,
});

const getEmpDataError = (state, action) => updateObject(state, {
  getEmpDataState: 'ERROR',
  error: action.error,
});

// GET ORG DATA REDUCERS
const getOrgDataLoading = (state) => updateObject(state, {
  getOrgDataState: 'LOADING',
});

const getOrgDataSuccess = (state, action) => updateObject(state, {
  getOrgDataState: 'SUCCESS',
  orgData: action.orgData,
  error: null,
});

const getOrgDataError = (state, action) => updateObject(state, {
  getOrgDataState: 'ERROR',
  error: action.error,
});

// GET TAG DATA REDUCERS
const getRoleTagDataLoading = (state) => updateObject(state, {
  getRoleTagDataState: 'LOADING',
});

const getRoleTagDataSuccess = (state, action) => updateObject(state, {
  getRoleTagDataState: 'SUCCESS',
  roleTag: action.roleTag,
  error: null,
});

const getRoleTagDataError = (state, action) => updateObject(state, {
  getRoleTagDataState: 'ERROR',
  error: action.error,
});

const getLocationTagDataLoading = (state) => updateObject(state, {
  getLocationTagDataState: 'LOADING',
});

const getLocationTagDataSuccess = (state, action) => updateObject(state, {
  getLocationTagDataState: 'SUCCESS',
  locationTag: action.locationTag,
  error: null,
});

const getLocationTagDataError = (state, action) => updateObject(state, {
  getLocationTagDataState: 'ERROR',
  error: action.error,
});

// DOWNLOAD PDF POC
const downloadZipLoading = (state) => updateObject(state, {
  downloadPdfState: 'LOADING',
});

const downloadZipSuccess = (state, action) => updateObject(state, {
  downloadPdfState: 'SUCCESS',
  zipFile: action.zipFile,
  error: null,
});

const downloadZipError = (state, action) => updateObject(state, {
  downloadPdfState: 'ERROR',
  error: action.error,
});

// download summary pdf report
const downloadSummaryPdfLoading = (state) => updateObject(state, {
  downloadSummaryPdfState: 'LOADING',
});

const downloadSummaryPdfSuccess = (state, action) => updateObject(state, {
  downloadSummaryPdfState: 'SUCCESS',
  summaryPdf: action.summaryPdf,
  error: null,
});

const downloadSummaryPdfError = (state, action) => updateObject(state, {
  downloadSummaryPdfState: 'ERROR',
  error: action.error,
});

const downloadAttachmentLoading = (state) => updateObject(state, {
  downloadAttachmentState: 'LOADING',
});

const downloadAttachmentSuccess = (state) => updateObject(state, {
  downloadAttachmentState: 'SUCCESS',
});

const downloadAttachmentError = (state, action) => updateObject(state, {
  downloadAttachmentState: 'ERROR',
  error: action.error,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INIT_STATE: return initState();

    case actionTypes.CLEAR_ROLE_TAG_INFO: return clearRoleTagInfo(state);

    case actionTypes.GET_EMP_DATA_LOADING: return getEmpDataLoading(state);
    case actionTypes.GET_EMP_DATA_SUCCESS: return getEmpDataSuccess(state, action);
    case actionTypes.GET_EMP_DATA_ERROR: return getEmpDataError(state, action);

    case actionTypes.GET_ORG_DATA_LOADING: return getOrgDataLoading(state);
    case actionTypes.GET_ORG_DATA_SUCCESS: return getOrgDataSuccess(state, action);
    case actionTypes.GET_ORG_DATA_ERROR: return getOrgDataError(state, action);

    case actionTypes.GET_ROLE_TAG_DATA_LOADING: return getRoleTagDataLoading(state);
    case actionTypes.GET_ROLE_TAG_DATA_SUCCESS: return getRoleTagDataSuccess(state, action);
    case actionTypes.GET_ROLE_TAG_DATA_ERROR: return getRoleTagDataError(state, action);

    case actionTypes.GET_LOCATION_TAG_DATA_LOADING: return getLocationTagDataLoading(state);
    case actionTypes.GET_LOCATION_TAG_DATA_SUCCESS: return getLocationTagDataSuccess(state, action);
    case actionTypes.GET_LOCATION_TAG_DATA_ERROR: return getLocationTagDataError(state, action);

    case actionTypes.DOWNLOAD_ZIP_PDF_LOADING: return downloadZipLoading(state);
    case actionTypes.DOWNLOAD_ZIP_PDF_SUCCESS: return downloadZipSuccess(state, action);
    case actionTypes.DOWNLOAD_ZIP_PDF_ERROR: return downloadZipError(state, action);

    case actionTypes.DOWNLOAD_SUMMARY_PDF_LOADING: return downloadSummaryPdfLoading(state);
    case actionTypes.DOWNLOAD_SUMMARY_PDF_SUCCESS: return downloadSummaryPdfSuccess(state, action);
    case actionTypes.DOWNLOAD_SUMMARY_PDF_ERROR: return downloadSummaryPdfError(state, action);

    case actionTypes.DOWNLOAD_ATTACHMENT_LOADING: return downloadAttachmentLoading(state);
    case actionTypes.DOWNLOAD_ATTACHMENT_SUCCESS: return downloadAttachmentSuccess(state, action);
    case actionTypes.DOWNLOAD_ATTACHMENT_ERROR: return downloadAttachmentError(state, action);

    default: return state;
  }
};

export default reducer;
