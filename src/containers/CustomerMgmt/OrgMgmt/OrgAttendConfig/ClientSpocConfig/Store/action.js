import axios from 'axios';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import forEach from 'lodash/forEach';
import { getAttendanceConfig } from '../../Store/action';
import * as actionTypes from './actionTypes';

const CUSTOMER_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;
const ATTENDANCE_URL = process.env.REACT_APP_BGV_ATTENDANCE_CONFIG_URL;

export const getInitState = () => (dispatch) => {
  dispatch({
    type: actionTypes.GET_INIT_STATE,
  });
};

export const getContactsListById = (orgId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_CONTACTS_LIST_LOADING,
  });

  const url = `${CUSTOMER_MGMT}/org/${orgId}/contactperson`;
  axios.get(url)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_CONTACTS_LIST_SUCCESS,
          orgContacts: response.data,
        });
      }
    })
    .catch((error) => {
      const errMsg = get(error, 'response.data.errorMessage', error.message);
      dispatch({
        type: actionTypes.GET_CONTACTS_LIST_ERROR,
        error: errMsg,
      });
    });
};

export const updatePostedSpocs = (updatedPostedSpocs) => (dispatch) => {
  dispatch({
    type: actionTypes.UPDATE_POSTED_SPOCS,
    postSpocs: updatedPostedSpocs,
  });
};

export const postSelectedSpocs = (payloadData, orgId, query) => (dispatch) => {
  dispatch({
    type: actionTypes.POST_CLIENT_SPOCS_LOADING,
  });
  let url = `${ATTENDANCE_URL}/org/${orgId}/client-spoc`;
  if (!isEmpty(query)) {
    const urlSearchParams = new URLSearchParams();
    forEach(query, (val, param) => {
      if (!isEmpty(val)) {
        urlSearchParams.set(param, val);
      }
    });
    if (!isEmpty(urlSearchParams.toString())) {
      url = `${url}?${urlSearchParams}`;
    }
  }
  axios.post(url, payloadData)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.POST_CLIENT_SPOCS_SUCCESS,
        });
        dispatch(getAttendanceConfig(orgId, query));
      }
    })
    .catch((error) => {
      const errMsg = get(error, 'response.data.errorMessage', error.message);
      dispatch({
        type: actionTypes.POST_CLIENT_SPOCS_ERROR,
        error: errMsg,
      });
    });
};

export const getSelectedSpocs = (orgId, query) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_CLIENT_SPOCS_LOADING,
  });
  let url = `${ATTENDANCE_URL}/org/${orgId}/client-spoc`;
  if (!isEmpty(query)) {
    const urlSearchParams = new URLSearchParams();
    forEach(query, (val, param) => {
      if (!isEmpty(val)) {
        urlSearchParams.set(param, val);
      }
    });
    if (!isEmpty(urlSearchParams.toString())) {
      url = `${url}?${urlSearchParams}`;
    }
  }
  axios.get(url)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        const data = response.data.clientSpocs;
        dispatch({
          type: actionTypes.GET_CLIENT_SPOCS_SUCCESS,
          selectedSpocs: data,
          configuredData: response.data,
        });
      }
    })
    .catch((error) => {
      const errMsg = get(error, 'response.data.errorMessage', error.message);
      dispatch({
        type: actionTypes.GET_CLIENT_SPOCS_ERROR,
        error: errMsg,
      });
    });
};
