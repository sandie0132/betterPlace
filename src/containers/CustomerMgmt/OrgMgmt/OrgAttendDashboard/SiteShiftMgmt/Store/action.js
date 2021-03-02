import axios from 'axios';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import * as actionTypes from './actionTypes';

const ATTENDANCE_URL = process.env.REACT_APP_BGV_ATTENDANCE_CONFIG_URL;
const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

// init
export const initState = () => (dispatch) => {
  dispatch({
    type: actionTypes.INIT_STATE,
  });
};

// get site config list
export const getAttendSiteList = (orgId, targetUrl, pageSize) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_ATTEND_SITE_LIST_LOADING,
  });

  let url = `${ATTENDANCE_URL}/org/${orgId}/site`;
  if (!isEmpty(targetUrl)) {
    url = `${url}${targetUrl}`;
    if (pageSize) {
      url += `&pageSize=${pageSize}`;
    }
  } else if (pageSize) {
    url += `?pageSize=${pageSize}`;
  }

  axios.get(url)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_ATTEND_SITE_LIST_SUCCESS,
          siteList: response.data,
        });
      }
    })
    .catch((error) => {
      const errMsg = get(error, 'response.data.errorMessage', error.message);
      dispatch({
        type: actionTypes.GET_ATTEND_SITE_LIST_ERROR,
        error: errMsg,
      });
    });
};

// get site config count
export const getAttendSiteCount = (orgId, targetUrl) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_ATTEND_SITE_COUNT_LOADING,
  });

  let url = `${ATTENDANCE_URL}/org/${orgId}/site`;
  if (!isEmpty(targetUrl)) {
    url = `${url}${targetUrl}&isCount=true`;
  } else {
    url = `${url}?isCount=true`;
  }
  axios.get(url)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        let count = 0;
        let noSitesConfigured = false;
        if (response.data.count !== undefined) {
          count = response.data.count;
          if (url === `${ATTENDANCE_URL}/org/${orgId}/site?isCount=true`) {
            if (count === 0) {
              noSitesConfigured = true;
            }
          }
        }
        dispatch({
          type: actionTypes.GET_ATTEND_SITE_COUNT_SUCCESS,
          dataCount: count,
          noSitesConfigured,
        });
      }
    })
    .catch((error) => {
      const errMsg = get(error, 'response.data.errorMessage', error.message);
      dispatch({
        type: actionTypes.GET_ATTEND_SITE_COUNT_ERROR,
        error: errMsg,
      });
    });
};

// get tag name Action Dispatch
export const getTagInfo = (tagIdList) => (dispatch) => {
  dispatch({
    type: actionTypes.POST_TAG_INFO_DATA_LOADING,
  });
  let url = `${CUST_MGMT}/tag?`;
  forEach(tagIdList, (tagId, index) => {
    if (index === tagIdList.length - 1) url += `tagId=${tagId}`;
    else url = `${url}tagId=${tagId}&`;
  });
  axios.get(url)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.POST_TAG_INFO_DATA_SUCCESS,
          tagList: response.data,
        });
      }
    })
    .catch((error) => {
      const errMsg = get(error, 'response.data.errorMessage', error.message);
      dispatch({
        type: actionTypes.POST_TAG_INFO_DATA_ERROR,
        error: errMsg,
      });
    });
};
