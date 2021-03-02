import axios from 'axios';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import { getAttendanceConfig } from '../../Store/action';
import * as actionTypes from './actionTypes';

const ATTENDANCE_URL = process.env.REACT_APP_BGV_ATTENDANCE_CONFIG_URL;
const PLATFORM = process.env.REACT_APP_PLATFORM_API_URL;

export const getInitState = () => (dispatch) => {
  dispatch({
    type: actionTypes.GET_INIT_STATE,
  });
};

export const getContactList = (input) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_BPCONTACT_LIST_LOADING,
  });

  let url = `${PLATFORM}/spoc/search?`;
  if (input) {
    url += `key=${input}`;
  }
  axios.get(url)
    .then((response) => {
      dispatch({
        type: actionTypes.GET_BPCONTACT_LIST_SUCCESS,
        contactList: response.data,
      });
    })
    .catch((error) => {
      const errMsg = get(error, 'response.data.errorMessage', error.message);
      dispatch({
        type: actionTypes.GET_BPCONTACT_LIST_ERROR,
        error: errMsg,
      });
    });
};

export const postSelectedSpocs = (data, orgId, query) => (dispatch) => {
  dispatch({
    type: actionTypes.POST_ATTEND_BP_SPOCS_LOADING,
  });
  let url = `${ATTENDANCE_URL}/org/${orgId}/betterplace-spoc`;
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
  axios.post(url, data)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.POST_ATTEND_BP_SPOCS_SUCCESS,
          // eslint-disable-next-line no-underscore-dangle
          Id: response.data._id,
        });
        dispatch(getAttendanceConfig(orgId));
      }
    })
    .catch((error) => {
      const errMsg = get(error, 'response.data.errorMessage', error.message);
      dispatch({
        type: actionTypes.POST_ATTEND_BP_SPOCS_ERROR,
        error: errMsg,
      });
    });
};

export const getSelectedSpocs = (orgId, query) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_ATTEND_BP_SPOCS_LOADING,
  });
  let url = `${ATTENDANCE_URL}/org/${orgId}/betterplace-spoc`;
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
        dispatch({
          type: actionTypes.GET_ATTEND_BP_SPOCS_SUCCESS,
          selectedSpocs: response.data,
        });
      }
    })
    .catch((error) => {
      const errMsg = get(error, 'response.data.errorMessage', error.message);
      dispatch({
        type: actionTypes.GET_ATTEND_BP_SPOCS_ERROR,
        error: errMsg,
      });
    });
};

export const getEmployeeById = (empId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_BPEMP_LOADING,
  });

  const url = `${PLATFORM}/spoc/details?uuid=${empId}`;
  axios.get(url)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_BPEMP_SUCCESS,
          empDetails: response.data,
        });
      }
    })
    .catch((error) => {
      const errMsg = get(error, 'response.data.errorMessage', error.message);
      dispatch({
        type: actionTypes.GET_BPEMP_ERROR,
        error: errMsg,
      });
    });
};
