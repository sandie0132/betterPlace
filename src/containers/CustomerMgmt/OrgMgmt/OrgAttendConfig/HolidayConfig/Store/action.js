/* eslint-disable max-len */
import axios from 'axios';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import forEach from 'lodash/forEach';
import * as actionTypes from './actionTypes';
import { getAttendanceConfig } from '../../Store/action';

const ATTENDANCE_URL = process.env.REACT_APP_BGV_ATTENDANCE_CONFIG_URL;
const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

// init
export const initState = () => (dispatch) => {
  dispatch({
    type: actionTypes.INIT_STATE,
  });
};

// Get Tag Info Action Dispatch
export const getTagInfo = (tagIdList, sharedTag) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_TAG_INFO_LOADING,
  });
  let url = `${CUST_MGMT}/tag?`;
  if (sharedTag) {
    url = `${CUST_MGMT}/shared/tag?`;
  }
  forEach(tagIdList, (tagId, index) => {
    if (index === tagIdList.length - 1) url += `tagId=${tagId}`;
    else url = `${url}tagId=${tagId}&`;
  });
  axios.get(url)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_TAG_INFO_SUCCESS,
          tagList: response.data,
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
        type: actionTypes.GET_TAG_INFO_ERROR,
        error: errMsg,
      });
    });
};

export const postHolidayConfig = (orgId, config, { history, dest, search }, query) => (dispatch) => {
  dispatch({
    type: actionTypes.POST_HOLIDAY_CONFIGURATION_LOADING,
  });

  let url = `${ATTENDANCE_URL}/org/${orgId}/holiday-config`;
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
          type: actionTypes.POST_HOLIDAY_CONFIGURATION_SUCCESS,
          data: response.data,
        });
        dispatch(getAttendanceConfig(orgId, query));
        history.push({ pathname: dest, search, state: { status: 'success', action: 'configured' } });
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
        type: actionTypes.POST_HOLIDAY_CONFIGURATION_ERROR,
        error: errMsg,
      });
    });
};

export const getHolidayConfigById = (orgId, holidayId, query) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_HOLIDAY_CONFIGURATION_BY_ID_LOADING,
  });

  let url = `${ATTENDANCE_URL}/org/${orgId}/holiday-config/${holidayId}`;
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
          type: actionTypes.GET_HOLIDAY_CONFIGURATION_BY_ID_SUCCESS,
          data: response.data,
        });
        const { includeTags, excludeTags } = response.data;
        const tagList = [...includeTags, ...excludeTags];
        if (!isEmpty(tagList)) {
          dispatch(getTagInfo(tagList, !isEmpty(query)));
        }
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
        type: actionTypes.GET_HOLIDAY_CONFIGURATION_BY_ID_ERROR,
        error: errMsg,
      });
    });
};

export const putHolidayConfig = (orgId, holidayId, config, { history, dest, search }, query) => (dispatch) => {
  dispatch({
    type: actionTypes.PUT_HOLIDAY_CONFIGURATION_LOADING,
  });
  let url = `${ATTENDANCE_URL}/org/${orgId}/holiday-config/${holidayId}`;
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
  axios.put(url, config)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.PUT_HOLIDAY_CONFIGURATION_SUCCESS,
          data: response.data,
        });
        history.push({ pathname: dest, search, state: { status: 'success', action: 'updated' } });
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
        type: actionTypes.PUT_HOLIDAY_CONFIGURATION_ERROR,
        error: errMsg,
      });
    });
};

export const deleteHolidayConfig = (orgId, holidayId, { history, dest, search }, query) => (dispatch) => {
  dispatch({
    type: actionTypes.DELETE_HOLIDAY_CONFIGURATION_LOADING,
  });

  let url = `${ATTENDANCE_URL}/org/${orgId}/holiday-config/${holidayId}`;
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
  axios.delete(url)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.DELETE_HOLIDAY_CONFIGURATION_SUCCESS,
        });
        history.push({ pathname: dest, search, state: { status: 'success', action: 'deleted' } });
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
        type: actionTypes.DELETE_HOLIDAY_CONFIGURATION_ERROR,
        error: errMsg,
      });
    });
};

export const getHolidayConfigList = (orgId, year, tags, fetchInputTags, query) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_HOLIDAY_CONFIGURATION_LOADING,
  });

  let url = `${ATTENDANCE_URL}/org/${orgId}/holiday-config?year=${year}`;
  if (!isEmpty(tags)) {
    url += `&tags=${tags}`;
  }
  if (!isEmpty(query)) {
    const urlSearchParams = new URLSearchParams();
    forEach(query, (val, param) => {
      if (!isEmpty(val)) {
        urlSearchParams.set(param, val);
      }
    });
    if (!isEmpty(urlSearchParams.toString())) {
      url = `${url}&${urlSearchParams}`;
    }
  }
  axios.get(url)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_HOLIDAY_CONFIGURATION_SUCCESS,
          data: response.data,
        });
        let tagArr = [];
        response.data.forEach((holiday) => {
          if (!isEmpty(holiday.includeTags)) {
            tagArr = [...holiday.includeTags, ...tagArr];
          }
          if (!isEmpty(holiday.excludeTags)) {
            tagArr = [...holiday.excludeTags, ...tagArr];
          }
        });
        if (fetchInputTags && !isEmpty(tags)) {
          const inputTags = tags.split(',');
          tagArr = [...inputTags, ...tagArr];
        }
        if (!isEmpty(tagArr)) {
          dispatch(getTagInfo(tagArr, !isEmpty(query)));
        }
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
        type: actionTypes.GET_HOLIDAY_CONFIGURATION_ERROR,
        error: errMsg,
      });
    });
};
