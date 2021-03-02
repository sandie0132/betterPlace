import axios from 'axios';
// import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import * as actionTypes from './actionTypes';

const ATTENDANCE_URL = process.env.REACT_APP_BGV_ATTENDANCE_CONFIG_URL;

// init
export const initState = () => (dispatch) => {
  dispatch({
    type: actionTypes.INIT_STATE,
  });
};

export const postShiftDetails = (orgId, tags, payload, { history, dest }, count) => (dispatch) => {
  dispatch({
    type: actionTypes.POST_SHIFT_DETAILS_BY_ID_LOADING,
  });
  let url = `${ATTENDANCE_URL}/org/${orgId}/shift`;
  if (!isEmpty(tags)) {
    let tagString = '&tags=';
    tags.forEach((tag, index) => {
      if (index === Math.abs(tags.length - 1)) tagString += tag;
      else tagString += `${tag},`;
    });
    url += tagString;
  }
  axios.post(url, payload)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        const { data } = response;
        data.count = count;
        dispatch({
          type: actionTypes.POST_SHIFT_DETAILS_BY_ID_SUCCESS,
          data,
        });
        history.push({ pathname: dest, state: { status: 'success', action: 'created' } });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.POST_SHIFT_DETAILS_BY_ID_ERROR,
        error: errMsg,
      });
    });
};

export const getShiftDetailsById = (orgId, siteId, shiftId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_SHIFT_DETAILS_BY_ID_LOADING,
  });
  const url = `${ATTENDANCE_URL}/org/${orgId}/site/${siteId}/shift/${shiftId}`;
  axios.get(url)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_SHIFT_DETAILS_BY_ID_SUCCESS,
          data: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_SHIFT_DETAILS_BY_ID_ERROR,
        error: errMsg,
      });
    });
};

export const putShiftDetailsById = (orgId, siteId, shiftId, payload) => (dispatch) => {
  dispatch({
    type: actionTypes.PUT_SHIFT_DETAILS_BY_ID_LOADING,
  });
  const url = `${ATTENDANCE_URL}/org/${orgId}/site/${siteId}/shift/${shiftId}`;
  axios.put(url, payload)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.PUT_SHIFT_DETAILS_BY_ID_SUCCESS,
          data: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.PUT_SHIFT_DETAILS_BY_ID_ERROR,
        error: errMsg,
      });
    });
};

export const deleteShiftDetailsById = (orgId, siteId, shiftId, { history, dest }) => (dispatch) => {
  dispatch({
    type: actionTypes.DELETE_SHIFT_DETAILS_BY_ID_LOADING,
  });
  const url = `${ATTENDANCE_URL}/org/${orgId}/site/${siteId}/shift/${shiftId}`;
  axios.delete(url)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.DELETE_SHIFT_DETAILS_BY_ID_SUCCESS,
          data: response.data,
        });
        history.push({ pathname: dest, state: { status: 'success', action: 'deleted' } });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.DELETE_SHIFT_DETAILS_BY_ID_ERROR,
        error: errMsg,
      });
    });
};
