import _ from 'lodash';
import axios from 'axios';
import * as actionTypes from './actionTypes';
import * as initData from './StaticDataInitData';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;
const PLATFORM_SERVICES = process.env.REACT_APP_PLATFORM_API_URL;

// Init State Action Dispatch
export const initState = () => (dispatch) => {
  dispatch({
    type: actionTypes.INIT_STATE,
  });
};

// Get StaticDataList Action Dispatch
export const getStaticDataList = () => {
  const { data } = initData;
  const orgMgmtStaticData = { ...initData.orgMgmtStaticData };
  return (dispatch) => {
    dispatch({
      type: actionTypes.GET_DATA_LIST_LOADING,
    });
    axios.post(`${PLATFORM_SERVICES}/staticdata`, data)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          _.forEach(response.data, (object) => {
            _.forEach(object, (value, key) => {
              orgMgmtStaticData[key] = value;
            });
          });
          dispatch({
            type: actionTypes.GET_DATA_LIST_SUCCESS,
            staticData: orgMgmtStaticData,
          });
        }
      })
      .catch((error) => {
        let errMsg = error;
        if (error.response.data && error.response.data.errorMessage) {
          errMsg = error.response.data.errorMessage;
        }
        dispatch({
          type: actionTypes.GET_DATA_LIST_ERROR,
          error: errMsg,
        });
      });
  };
};

// Get Org Services Config Action Dispatch
export const getOrgServicesConfigured = (orgId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_SERVICES_ENABLED_LOADING,
  });
  axios.get(`${PLATFORM_SERVICES}/services/${orgId}`)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_SERVICES_ENABLED_SUCCESS,
          servicesEnabled: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_SERVICES_ENABLED_ERROR,
        error: errMsg,
      });
    });
};

// Get Org details
export const getDataById = (orgId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_DATA_LOADING,
    orgId,
  });
  axios.get(`${CUST_MGMT}/org/${orgId}`)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_DATA_SUCCESS,
          data: response.data,
        });
        dispatch(getOrgServicesConfigured(orgId));
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_DATA_ERROR,
        error: errMsg,
      });
    });
};
