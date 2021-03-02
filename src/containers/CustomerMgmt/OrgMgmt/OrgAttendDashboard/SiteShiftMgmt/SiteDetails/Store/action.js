import axios from 'axios';
import { isEmpty } from 'lodash';
import get from 'lodash/get';
import moment from 'moment';
import * as actionTypes from './actionTypes';

const ATTENDANCE_URL = process.env.REACT_APP_BGV_ATTENDANCE_CONFIG_URL;
const CUSTOMER_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

export const getTagInfo = (tagIdList) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_TAG_INFO_DATA_LOADING,
  });
  const tagString = `tagId=${tagIdList.join('&')}`;
  const url = `${CUSTOMER_MGMT}/tag?${tagString}`;
  axios.get(url)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_TAG_INFO_DATA_SUCCESS,
          data: response.data[0],
        });
      }
    })
    .catch((error) => {
      const errMsg = get(error, 'response.data.errorMessage', error.message);
      dispatch({
        type: actionTypes.GET_TAG_INFO_DATA_ERROR,
        error: errMsg,
      });
    });
};

export const getSiteShiftList = (orgId, siteId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_SITE_SHIFT_LIST_LOADING,
  });

  const url = `${ATTENDANCE_URL}/org/${orgId}/site/${siteId}/shift`;

  axios.get(url)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        let shiftList = [];
        if (!isEmpty(response.data)) {
          shiftList = response.data.sort((a, b) => moment(`${a.startTime.hours} ${a.startTime.minutes} ${a.startTime.period}`, 'HH:mm A') - moment(`${b.startTime.hours} ${b.startTime.minutes} ${b.startTime.period}`, 'HH:mm A'));
        }
        dispatch({
          type: actionTypes.GET_SITE_SHIFT_LIST_SUCCESS,
          data: shiftList,
        });
      }
    })
    .catch((error) => {
      const errMsg = get(error, 'response.data.errorMessage', error.message);
      dispatch({
        type: actionTypes.GET_SITE_SHIFT_LIST_ERROR,
        error: errMsg,
      });
    });
};

// get site config
export const getAttendSiteDetails = (orgId, siteId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_ATTEND_SITE_CONFIG_LOADING,
  });
  dispatch(getTagInfo([siteId]));

  const url = `${ATTENDANCE_URL}/org/${orgId}/site-config/${siteId}`;

  axios.get(url)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_ATTEND_SITE_CONFIG_SUCCESS,
          data: response.data,
        });
        dispatch(getSiteShiftList(orgId, siteId));
      }
    })
    .catch((error) => {
      const errMsg = get(error, 'response.data.errorMessage', error.message);
      dispatch({
        type: actionTypes.GET_ATTEND_SITE_CONFIG_ERROR,
        error: errMsg,
      });
    });
};
