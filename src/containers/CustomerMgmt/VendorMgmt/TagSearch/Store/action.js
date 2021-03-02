/* eslint-disable no-lonely-if */
import axios from 'axios';
import * as actionTypes from './actionTypes';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

// Init State Action Dispatch
export const initState = () => (dispatch) => {
  dispatch({
    type: actionTypes.INIT_STATE,
  });
};

// Get DataList Action Dispatch
export const getTagList = (
  orgId, category, type, key, name, clientId, isSelected, vendorId, deployModal,
) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_TAG_LIST_LOADING,
  });
  let apiURL = CUST_MGMT;

  // below !isSelected -> not being used anywhere because tags search in assignment is from ui
  // if (!isSelected) {
  //   if (category && !type) {
  //     apiURL = `${apiURL}/org/${orgId}/client/${clientId}/tags/search?
  // category=${category}&key=${key}`;
  //   } else if (category && type) {
  //     apiURL = `${apiURL}/org/${orgId}/client/${clientId}/tags/search?
  // category=${category}&type=${type}&key=${key}`;
  //   } else if (!category && type) {
  //     apiURL = `${apiURL}/org/${orgId}/client/${clientId}/tags/search?&type=${type}&key=${key}`;
  //   } else {
  //     apiURL = `${apiURL}/org/${orgId}/client/${clientId}/tags/search?key=${key}`;
  //   }
  // } else
  // {
  if (category && !type) {
    apiURL = `${apiURL}/org/${orgId}/vendor/${vendorId}/tags/search?category=${category}&clientId=${clientId}&key=${key}`;
  } else if (category && type) {
    apiURL = `${apiURL}/org/${orgId}/vendor/${vendorId}/tags/search?category=${category}&clientId=${clientId}&type=${type}&key=${key}`;
  } else if (!category && type) {
    apiURL = `${apiURL}/org/${orgId}/vendor/${vendorId}/tags/search?&type=${type}&clientId=${clientId}&key=${key}`;
  } else {
    apiURL = `${apiURL}/org/${orgId}/vendor/${vendorId}/tags/search?key=${key}&clientId=${clientId}`;
  }
  // }

  if (deployModal) {
    apiURL += '&isSelected=true';
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
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_TAG_LIST_ERROR,
        error: errMsg,
      });
    });
};
