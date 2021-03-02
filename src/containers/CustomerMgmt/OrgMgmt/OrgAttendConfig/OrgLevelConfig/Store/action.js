import axios from 'axios';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import forEach from 'lodash/forEach';
import * as actionTypes from './actionTypes';
import { getAttendanceConfig } from '../../Store/action';

const ATTENDANCE_URL = process.env.REACT_APP_BGV_ATTENDANCE_CONFIG_URL;
const CUST_URL = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

export const getOrgLevelConfigHistory = (orgId, query) => (dispatch) => {
  let url = `${ATTENDANCE_URL}/org/${orgId}/org-level-config/history`;

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
          type: actionTypes.ORG_ATTD_CONFIG_HISTORY,
          data: response.data,
        });
      }
    })
    .catch((error) => {
      const errMsg = get(error, 'response.data.errorMessage', error.message);
      dispatch({
        type: actionTypes.ORG_ATTD_CONFIG_HISTORY_ERR,
        error: errMsg,
      });
    });
};

export const postAttendenceConfig = (orgId, config, query) => (dispatch) => {
  dispatch({
    type: actionTypes.POST_ORG_ATTENDANCE_CONFIG_LOADING,
  });

  let url = `${ATTENDANCE_URL}/org/${orgId}/org-level-config`;

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
  axios.post(url, config)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.POST_ORG_ATTENDANCE_CONFIG_SUCCESS,
          data: response.data,
        });
        dispatch(getAttendanceConfig(orgId, query));
        dispatch(getOrgLevelConfigHistory(orgId, query));
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (get(error, 'response.data.errorMessage', null)) {
        errMsg = get(error, 'response.data.errorMessage', null);
      } else {
        errMsg = error.message;
      }
      dispatch({
        type: actionTypes.POST_ORG_ATTENDANCE_CONFIG_ERROR,
        error: errMsg,
      });
    });
};

export const getOrgLevelConfig = (orgId, query) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_ORG_ATTENDANCE_CONFIG_LOADING,
  });

  let url = `${ATTENDANCE_URL}/org/${orgId}/org-level-config`;

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
          type: actionTypes.GET_ORG_ATTENDANCE_CONFIG_SUCCESS,
          data: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (get(error, 'response.data.errorMessage', null)) {
        errMsg = get(error, 'response.data.errorMessage', null);
      } else {
        errMsg = error.message;
      }
      dispatch({
        type: actionTypes.GET_ORG_ATTENDANCE_CONFIG_ERROR,
        error: errMsg,
      });
    });
};

export const getEditedUser = (id) => (dispatch, getState) => {
  const url = `${CUST_URL}/user-info/${id}`;
  const state = getState();
  const editedVal = get(state, `orgMgmt.orgAttendConfig.orgLevelConfig.attendanceConfigHistoryEditedBy${id}`, null);
  if (!editedVal) {
    axios.get(url)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch({
            type: actionTypes.ORG_HISTORY_EDITED_BY,
            data: response.data,
            id,
          });
        }
      })
      .catch((error) => {
        const errMsg = get(error, 'response.data.errorMessage', error.message);
        dispatch({
          type: actionTypes.ORG_HISTORY_EDITED_BY_ERR,
          error: errMsg,
        });
      });
  }
};
