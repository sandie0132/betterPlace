/* eslint-disable max-len */
import * as actionTypes from './actionTypes';
import updateObject from '../../VendorMgmtStore/utility';

const initialState = {
  getVendorOrgDataState: 'INIT',
  vendorOrgData: {},
  getClientNotificationState: 'INIT',
  getClientNotification: {},
  putClientNotificationState: 'INIT',
  putClientNotification: {},
  getClientDataByIdState: 'INIT',
  clientData: {},
};

const getVendorOrgDataByIdLoading = (state) => updateObject(state, {
  getVendorDataState: 'LOADING',
});
const getVendorOrgDataByIdSuccess = (state, action) => updateObject(state, {
  getVendorDataState: 'SUCCESS',
  vendorOrgData: action.data,
  error: null,
});

const getVendorOrgDataByIdError = (state, action) => updateObject(state, {
  getVendorDataState: 'ERROR',
  error: action.error,
});

const getClientNotificationLoading = (state) => updateObject(state, {
  getClientNotificationState: 'LOADING',
});
const getClientNotificationSuccess = (state, action) => updateObject(state, {
  getClientNotificationState: 'SUCCESS',
  getClientNotification: action.notificationData,
  error: null,
});

const getClientNotificationError = (state, action) => updateObject(state, {
  getClientNotificationState: 'ERROR',
  error: action.error,
});

const putClientNotificationLoading = (state) => updateObject(state, {
  putClientNotificationState: 'LOADING',
});
const putClientNotificationSuccess = (state, action) => {
  const { clientData } = state;
  clientData.status = action.putNotification.status;
  return updateObject(state, {
    putClientNotificationState: 'SUCCESS',
    putClientNotification: action.putNotification,
    clientData,
    error: null,
  });
};

const putClientNotificationError = (state, action) => updateObject(state, {
  putClientNotificationState: 'ERROR',
  error: action.error,
});

// Get client data
const getClientDataByIdLoading = (state) => updateObject(state, {
  getClientDataByIdState: 'LOADING',
  error: null,
});

const getClientDataByIdSuccess = (state, action) => updateObject(state, {
  getClientDataByIdState: 'SUCCESS',
  clientData: action.data,
  error: null,
});

const getClientDataByIdError = (state, action) => updateObject(state, {
  getClientDataByIdState: 'ERROR',
  error: action.error,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_VENDOR_DATA_BY_ID_LOADING: return getVendorOrgDataByIdLoading(state, action);
    case actionTypes.GET_VENDOR_DATA_BY_ID_SUCCESS: return getVendorOrgDataByIdSuccess(state, action);
    case actionTypes.GET_VENDOR_DATA_BY_ID_ERROR: return getVendorOrgDataByIdError(state, action);

    case actionTypes.GET_CLIENT_NOTIFICATION_LOADING: return getClientNotificationLoading(state, action);
    case actionTypes.GET_CLIENT_NOTIFICATION_SUCCESS: return getClientNotificationSuccess(state, action);
    case actionTypes.GET_CLIENT_NOTIFICATION_ERROR: return getClientNotificationError(state, action);

    case actionTypes.PUT_CLIENT_NOTIFICATION_LOADING: return putClientNotificationLoading(state, action);
    case actionTypes.PUT_CLIENT_NOTIFICATION_SUCCESS: return putClientNotificationSuccess(state, action);
    case actionTypes.PUT_CLIENT_NOTIFICATION_ERROR: return putClientNotificationError(state, action);

    case actionTypes.GET_CLIENT_DATA_BY_ID_LOADING: return getClientDataByIdLoading(state, action);
    case actionTypes.GET_CLIENT_DATA_BY_ID_SUCCESS: return getClientDataByIdSuccess(state, action);
    case actionTypes.GET_CLIENT_DATA_BY_ID_ERROR: return getClientDataByIdError(state, action);

    default: return state;
  }
};

export default reducer;
