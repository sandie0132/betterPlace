import axios from 'axios';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import forEach from 'lodash/forEach';
import {
  ORG_CONFIG_LOADING, ORG_CONFIG_SUCCESS, ORG_CONFIG_ERROR, INIT_STATE,
} from './actionTypes';

const ATTENDANCE_URL = process.env.REACT_APP_BGV_ATTENDANCE_CONFIG_URL;

// Init State Action Dispatch
export const initState = () => (dispatch) => {
  dispatch({
    type: INIT_STATE,
  });
};

export const getAttendanceConfig = (orgId, query) => (dispatch) => {
  dispatch({
    type: ORG_CONFIG_LOADING,
  });
  let url = `${ATTENDANCE_URL}/org/${orgId}/attendance-config`;
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
          type: ORG_CONFIG_SUCCESS,
          data: response.data,
        });
      }
    }).catch((error) => {
      const errMsg = get(error, 'response.data.errorMessage', error);
      dispatch({
        type: ORG_CONFIG_ERROR,
        error: errMsg,
      });
    });
};
