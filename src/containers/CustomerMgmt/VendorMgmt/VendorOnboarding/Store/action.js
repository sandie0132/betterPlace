import axios from 'axios';
import * as actionTypes from './actionTypes';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

export const initState = () => (dispatch) => {
  dispatch({
    type: actionTypes.GET_INIT_STATE,
  });
};

export const getOrgData = (docNumber, docType, docCard) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_ORG_DATA,
    docNumber,
    docType,
    docCard,
  });
};

export const handleShowModal = (value) => (dispatch) => {
  dispatch({
    type: actionTypes.SHOW_MODAL_TYPE,
    showModal: value,
  });
};

export const checkOrg = (docNumber, docType, docCard) => (dispatch) => {
  dispatch({
    type: actionTypes.CHECK_ORG_DATA_LOADING,
  });

  let url = `${CUST_MGMT}/org/search?`;
  if (docNumber) {
    url += `docNumber=${docNumber}`;
  }
  axios.get(url)
    .then((response) => {
      dispatch({
        type: actionTypes.CHECK_ORG_DATA_SUCCESS,
        orgData: response.data,
        docNumber,
        docType,
        docCard,
        showModal: true,
      });
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      } else {
        errMsg = error.message;
      }
      dispatch({
        type: actionTypes.CHECK_ORG_DATA_ERROR,
        error: errMsg,
      });
    });
};

export const searchVendor = (key, orgId) => (dispatch) => {
  dispatch({
    type: actionTypes.SEARCH_VENDOR_LOADING,
  });

  const url = `${CUST_MGMT}/org/search?key=${key}`;

  axios.get(url)
    .then((response) => {
      dispatch({
        type: actionTypes.SEARCH_VENDOR_SUCCESS,
        orgData: response.data.filter((org) => org.uuid !== orgId),
      });
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      } else {
        errMsg = error.message;
      }
      dispatch({
        type: actionTypes.SEARCH_VENDOR_ERROR,
        error: errMsg,
      });
    });
};

export const addOrgData = (org) => (dispatch) => {
  dispatch({
    type: actionTypes.ADD_ORG_DATA_SUCCESS,
    orgData: org,
    vendorName: org.name,
    showModal: true,
  });
};

export const clearOrg = () => (dispatch) => {
  dispatch({
    type: actionTypes.ADD_ORG_DATA_LOADING,
  });
};
