import axios from 'axios';
import { isEmpty } from 'lodash';
import * as actionTypes from './actionTypes';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

// Init State Action Dispatch
export const initState = () => (dispatch) => {
  dispatch({
    type: actionTypes.INIT_STATE,
  });
};

// Get DataList Action Dispatch
export const getTagList = (orgId, category, type, key, name, vendorId, clientId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_TAG_LIST_LOADING,
  });
  let apiURL = CUST_MGMT;
  if (!isEmpty(vendorId)) {
    if (category && !type) {
      apiURL = `${apiURL}/org/${orgId}/shared/tags/search?vendorId=${vendorId}&category=${category}&key=${key}`;
    } else if (category && type) {
      apiURL = `${apiURL}/org/${orgId}/shared/tags/search?vendorId=${vendorId}&category=${category}&type=${type}&key=${key}`;
    } else if (!category && type) {
      apiURL = `${apiURL}/org/${orgId}/shared/tags/search?vendorId=${vendorId}&type=${type}&key=${key}`;
    } else {
      apiURL = `${apiURL}/org/${orgId}/shared/tags/search?vendorId=${vendorId}&key=${key}`;
    }
  } else if (!isEmpty(clientId)) {
    if (category && !type) {
      apiURL = `${apiURL}/org/${orgId}/shared/tags/search?clientId=${clientId}&category=${category}&key=${key}`;
    } else if (category && type) {
      apiURL = `${apiURL}/org/${orgId}/shared/tags/search?clientId=${clientId}&category=${category}&type=${type}&key=${key}`;
    } else if (!category && type) {
      apiURL = `${apiURL}/org/${orgId}/shared/tags/search?clientId=${clientId}&type=${type}&key=${key}`;
    } else {
      apiURL = `${apiURL}/org/${orgId}/shared/tags/search?clientId=${clientId}&key=${key}`;
    }
  } else if (category && !type) {
    apiURL = `${apiURL}/org/${orgId}/tags/search?category=${category}&key=${key}`;
  } else if (category && type) {
    apiURL = `${apiURL}/org/${orgId}/tags/search?category=${category}&type=${type}&key=${key}`;
  } else if (!category && type) {
    apiURL = `${apiURL}/org/${orgId}/tags/search?&type=${type}&key=${key}`;
  } else {
    apiURL = `${apiURL}/org/${orgId}/tags/search?key=${key}`;
  }

  axios.get(apiURL)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_TAG_LIST_SUCCESS,
          name,
          tagList: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_TAG_LIST_ERROR,
        error: errMsg,
      });
    });
};
