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
export const getAssociatedOrgList = (orgId, type, associatedOrgIdUrl) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_ASSOCIATED_ORG_LIST_LOADING,
  });
  let apiURL = `${CUST_MGMT}/org/${orgId}/associated-orgs`;
  if (!isEmpty(type)) {
    apiURL = `${apiURL}?type=${type}`;
  }
  if (!isEmpty(associatedOrgIdUrl)) {
    apiURL = `${apiURL}&${associatedOrgIdUrl}`;
  }
  axios.get(apiURL)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_ASSOCIATED_ORG_LIST_SUCCESS,
          associatedList: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_ASSOCIATED_ORG_LIST_ERROR,
        error: errMsg,
      });
    });
};

export const getSubVendor = (orgId, vendorId, category) => (dispatch) => {
  dispatch({
    type: category === 'vendor' ? actionTypes.GET_SUBVENDOR_LIST_LOADING : actionTypes.GET_SUPERCLIENT_LIST_LOADING,
  });
  let url = `${CUST_MGMT}/org/${orgId}/filter/principal-orgs`;
  if (category === 'vendor') {
    url += `?vendorId=${vendorId}`;
  } else {
    url += `?clientId=${vendorId}`;
  }
  axios.get(url)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        if (category === 'vendor') {
          dispatch({
            type: actionTypes.GET_SUBVENDOR_LIST_SUCCESS,
            subVendorList: response.data,
          });
        } else {
          dispatch({
            type: actionTypes.GET_SUPERCLIENT_LIST_SUCCESS,
            superClientList: response.data,
          });
        }
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: category === 'vendor' ? actionTypes.GET_SUBVENDOR_LIST_ERROR : actionTypes.GET_SUPERCLIENT_LIST_ERROR,
        error: errMsg,
      });
    });
};
