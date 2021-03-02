/* eslint-disable max-len */
import * as actionTypes from './actionTypes';
import { updateObject } from './utility';

const initialState = {
  getNotificationState: 'INIT',
  closeNotificationState: 'INIT',
  downloadCustMgmtFileState: 'INIT',
  downloadBgvReportFileState: 'INIT',
  reInitiateAllState: 'INIT',
  downloadReinitiateListState: 'INIT',
  updateVendorApprovalReqState: 'INIT',

  notificationList: [],
};

// INIT STATE
const getInitState = () => initialState;

// GET NOTIFICATION LIST
const getNotificationLoading = (state) => updateObject(state, {
  getNotificationState: 'LOADING',
});

const getNotificationSuccess = (state, action) => updateObject(state, {
  getNotificationState: 'SUCCESS',
  notificationList: action.notificationList,
});

const getNotificationError = (state, action) => updateObject(state, {
  getNotificationState: 'ERROR',
  error: action.error,
});

// CLOSE NOTIFICATIONS
const notificationCloseLoading = (state) => updateObject(state, {
  closeNotificationState: 'LOADING',
});

const notificationCloseSuccess = (state) => updateObject(state, {
  closeNotificationState: 'SUCCESS',
  error: null,
});

const notificationCloseError = (state, action) => updateObject(state, {
  closeNotificationState: 'ERROR',
  error: action.error,
});

// DOWNLOAD CUST MGMT FILES
const downloadCustMgmtFileLoading = (state) => updateObject(state, {
  downloadCustMgmtFileState: 'LOADING',
});

const downloadCustMgmtFileSuccess = (state) => updateObject(state, {
  downloadCustMgmtFileState: 'SUCCESS',
  error: null,
});

const downloadCustMgmtFileError = (state, action) => updateObject(state, {
  downloadCustMgmtFileState: 'ERROR',
  error: action.error,
});

// DOWNLOAD BGV REPORT FILES
const downloadBgvReportFileLoading = (state) => updateObject(state, {
  downloadBgvReportFileState: 'LOADING',
});

const downloadBgvReportFileSuccess = (state) => updateObject(state, {
  downloadBgvReportFileState: 'SUCCESS',
  error: null,
});

const downloadBgvReportFileError = (state, action) => updateObject(state, {
  downloadBgvReportFileState: 'ERROR',
  error: action.error,
});

// REINITIATE EMPLOYEES
const postReInitiateAllLoading = (state) => updateObject(state, {
  reInitiateAllState: 'LOADING',
});

const postReInitiateAllSuccess = (state) => updateObject(state, {
  reInitiateAllState: 'SUCCESS',
  error: null,
});

const postReInitiateAllError = (state, action) => updateObject(state, {
  reInitiateAllState: 'ERROR',
  error: action.error,
});

// DOWNLOAD RE-INITIATE EXCEL
const downloadReinitiateListLoading = (state) => updateObject(state, {
  downloadReinitiateListState: 'LOADING',
});

const downloadReinitiateListSuccess = (state) => updateObject(state, {
  downloadReinitiateListState: 'SUCCESS',
  error: null,
});

const downloadReinitiateListError = (state, action) => updateObject(state, {
  downloadReinitiateListState: 'ERROR',
  error: action.error,
});

// UPDATE_VENDOR_APPROVAL_REQ
const updateVendorApprovalReqLoading = (state) => updateObject(state, {
  updateVendorApprovalReqState: 'LOADING',
});

const updateVendorApprovalReqSuccess = (state) => updateObject(state, {
  updateVendorApprovalReqState: 'SUCCESS',
  error: null,
});

const updateVendorApprovalReqError = (state, action) => updateObject(state, {
  updateVendorApprovalReqState: 'ERROR',
  error: action.error,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INIT_STATE: return getInitState();

    case actionTypes.GET_NOTIFICATION_LIST_LOADING:
      return getNotificationLoading(state, action);
    case actionTypes.GET_NOTIFICATION_LIST_SUCCESS:
      return getNotificationSuccess(state, action);
    case actionTypes.GET_NOTIFICATION_LIST_ERROR:
      return getNotificationError(state, action);

    case actionTypes.NOTIFICATION_CLOSE_LOADING:
      return notificationCloseLoading(state, action);
    case actionTypes.NOTIFICATION_CLOSE_SUCCESS:
      return notificationCloseSuccess(state, action);
    case actionTypes.NOTIFICATION_CLOSE_ERROR:
      return notificationCloseError(state, action);

    case actionTypes.NOTIFICATION_DOWNLOAD_CUST_MGMT_FILE_LOADING:
      return downloadCustMgmtFileLoading(state, action);
    case actionTypes.NOTIFICATION_DOWNLOAD_CUST_MGMT_FILE_SUCCESS:
      return downloadCustMgmtFileSuccess(state, action);
    case actionTypes.NOTIFICATION_DOWNLOAD_CUST_MGMT_FILE_ERROR:
      return downloadCustMgmtFileError(state, action);

    case actionTypes.NOTIFICATION_DOWNLOAD_BGV_REPORT_FILE_LOADING:
      return downloadBgvReportFileLoading(state, action);
    case actionTypes.NOTIFICATION_DOWNLOAD_BGV_REPORT_FILE_SUCCESS:
      return downloadBgvReportFileSuccess(state, action);
    case actionTypes.NOTIFICATION_DOWNLOAD_BGV_REPORT_FILE_ERROR:
      return downloadBgvReportFileError(state, action);

    case actionTypes.POST_REINITIATE_ALL_LOADING:
      return postReInitiateAllLoading(state, action);
    case actionTypes.POST_REINITIATE_ALL_SUCCESS:
      return postReInitiateAllSuccess(state, action);
    case actionTypes.POST_REINITIATE_ALL_ERROR:
      return postReInitiateAllError(state, action);

    case actionTypes.DOWNLOAD_REINITIATE_LIST_LOADING:
      return downloadReinitiateListLoading(state, action);
    case actionTypes.DOWNLOAD_REINITIATE_LIST_SUCCESS:
      return downloadReinitiateListSuccess(state, action);
    case actionTypes.DOWNLOAD_REINITIATE_LIST_ERROR:
      return downloadReinitiateListError(state, action);

    case actionTypes.UPDATE_VENDOR_APPROVAL_REQ_LOADING:
      return updateVendorApprovalReqLoading(state, action);
    case actionTypes.UPDATE_VENDOR_APPROVAL_REQ_SUCCESS:
      return updateVendorApprovalReqSuccess(state, action);
    case actionTypes.UPDATE_VENDOR_APPROVAL_REQ_ERROR:
      return updateVendorApprovalReqError(state, action);

    default: return state;
  }
};

export default reducer;
