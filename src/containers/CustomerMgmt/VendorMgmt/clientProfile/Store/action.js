import axios from 'axios';
import * as actionTypes from './actionTypes';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;
const PLATFORM_SERVICES = process.env.REACT_APP_PLATFORM_API_URL;

export const getVendorOrgDataById = (orgId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_VENDOR_DATA_BY_ID_LOADING,
    orgId,
  });
  axios.get(`${CUST_MGMT}/org/${orgId}`)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_VENDOR_DATA_BY_ID_SUCCESS,
          data: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_VENDOR_DATA_BY_ID_ERROR,
        error: errMsg,
      });
    });
};

export const getClientData = (vendorId, clientId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_CLIENT_DATA_BY_ID_LOADING,
  });
  const url = `${CUST_MGMT}/org/${vendorId}/client/${clientId}`;

  axios.get(url)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_CLIENT_DATA_BY_ID_SUCCESS,
          data: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_CLIENT_DATA_BY_ID_ERROR,
        error: errMsg,
      });
    });
};

export const getNotification = (orgId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_CLIENT_NOTIFICATION_LOADING,
    orgId,
  });
  axios.get(`${PLATFORM_SERVICES}/notifications/${orgId}?name=VENDOR_CLIENT_REQUEST_APPROVAL`)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_CLIENT_NOTIFICATION_SUCCESS,
          notificationData: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_CLIENT_NOTIFICATION_ERROR,
        error: errMsg,
      });
    });
};

export const putNotification = (payload, orgId, clientId) => (dispatch) => {
  dispatch({
    type: actionTypes.PUT_CLIENT_NOTIFICATION_LOADING,
    orgId,
  });
  axios.put(`${CUST_MGMT}/org/${orgId}/client/${clientId}`, payload)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.PUT_CLIENT_NOTIFICATION_SUCCESS,
          putNotification: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.PUT_CLIENT_NOTIFICATION_ERROR,
        error: errMsg,
      });
    });
};
