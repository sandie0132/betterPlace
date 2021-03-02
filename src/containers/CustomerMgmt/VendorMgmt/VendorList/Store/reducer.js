/* eslint-disable max-len */
import * as actionTypes from './actionTypes';
import updateObject from '../../VendorMgmtStore/utility';

const initialState = {
  getVendorListState: 'INIT',
  vendorList: [],
  getClientNotificationState: 'INIT',
  getClientNotification: {},
  putClientNotificationState: 'INIT',
  putClientNotification: {},
  getVendorClientCountState: 'INIT',
  getVendorClientCount: { vendorCount: 0, clientCount: 0 },
};

const initState = () => initState;

const getDataListLoading = (state) => updateObject(state, {
  getVendorListState: 'LOADING',
  error: null,
});

const getDataListSuccess = (state, action) => updateObject(state, {
  vendorList: action.vendorList,
  error: null,
  getVendorListState: 'SUCCESS',
});

const getDataListError = (state, action) => updateObject(state, {
  error: action.error,
  vendorList: [],
  getVendorListState: 'ERROR',
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
const putClientNotificationSuccess = (state, action) => updateObject(state, {
  putClientNotificationState: 'SUCCESS',
  putClientNotification: action.putNotification,
  error: null,
});

const putClientNotificationError = (state, action) => updateObject(state, {
  putClientNotificationState: 'ERROR',
  error: action.error,
});

const getVendorClientCountLoading = (state) => updateObject(state, {
  getVendorClientCountState: 'LOADING',
});
const getVendorClientCountSuccess = (state, action) => updateObject(state, {
  getVendorClientCountState: 'SUCCESS',
  getVendorClientCount: action.countData,
  error: null,
});

const getVendorClientCountError = (state, action) => updateObject(state, {
  getVendorClientCountState: 'ERROR',
  error: action.error,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INIT_STATE: return initState(state, action);

    case actionTypes.GET_DATA_LIST_LOADING: return getDataListLoading(state, action);
    case actionTypes.GET_DATA_LIST_SUCCESS: return getDataListSuccess(state, action);
    case actionTypes.GET_DATA_LIST_ERROR: return getDataListError(state, action);

    case actionTypes.GET_CLIENT_NOTIFICATION_LOADING: return getClientNotificationLoading(state, action);
    case actionTypes.GET_CLIENT_NOTIFICATION_SUCCESS: return getClientNotificationSuccess(state, action);
    case actionTypes.GET_CLIENT_NOTIFICATION_ERROR: return getClientNotificationError(state, action);

    case actionTypes.PUT_CLIENT_NOTIFICATION_LOADING: return putClientNotificationLoading(state, action);
    case actionTypes.PUT_CLIENT_NOTIFICATION_SUCCESS: return putClientNotificationSuccess(state, action);
    case actionTypes.PUT_CLIENT_NOTIFICATION_ERROR: return putClientNotificationError(state, action);

    case actionTypes.GET_VENDOR_CLIENT_COUNT_LOADING: return getVendorClientCountLoading(state, action);
    case actionTypes.GET_VENDOR_CLIENT_COUNT_SUCCESS: return getVendorClientCountSuccess(state, action);
    case actionTypes.GET_VENDOR_CLIENT_COUNT_ERROR: return getVendorClientCountError(state, action);

    default: return state;
  }
};

export default reducer;
