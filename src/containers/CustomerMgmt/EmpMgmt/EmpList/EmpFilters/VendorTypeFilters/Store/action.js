import axios from 'axios';
import * as actionTypes from './actionTypes';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

export const getInitData = () => (dispatch) => {
  dispatch({
    type: actionTypes.INIT_VENDOR_FILTERS,
  });
};

export const searchVendorAndClient = (orgId, searchKey, category) => (dispatch) => {
  dispatch({
    type: category === 'vendor' ? actionTypes.SEARCH_VENDOR_LIST_LOADING : actionTypes.SEARCH_CLIENT_LIST_LOADING,
  });

  axios.get(`${CUST_MGMT}/org/${orgId}/associated-orgs?type=${category}&key=${searchKey}`)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        if (category === 'vendor') {
          dispatch({
            type: actionTypes.SEARCH_VENDOR_LIST_SUCCESS,
            searchedVendorList: response.data,
          });
        } else {
          dispatch({
            type: actionTypes.SEARCH_CLIENT_LIST_SUCCESS,
            searchedClientList: response.data,
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
        type: category === 'vendor' ? actionTypes.SEARCH_VENDOR_LIST_ERROR : actionTypes.SEARCH_CLIENT_LIST_ERROR,
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
