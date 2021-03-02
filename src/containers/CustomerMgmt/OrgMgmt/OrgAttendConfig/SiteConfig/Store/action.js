import axios from 'axios';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { getAttendanceConfig } from '../../Store/action';
import * as actionTypes from './actionTypes';

const ATTENDANCE_URL = process.env.REACT_APP_BGV_ATTENDANCE_CONFIG_URL;
const CUSTOMER_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

// init
export const initState = () => (dispatch) => {
  dispatch({
    type: actionTypes.INIT_STATE,
  });
};

// post site config
export const postAttendSiteConfig = (
  orgId, configData, { redirectUrl, history }, siteName, query,
) => (dispatch) => {
  dispatch({
    type: actionTypes.POST_ATTEND_SITE_CONFIG_LOADING,
  });

  let url = `${ATTENDANCE_URL}/org/${orgId}/site-config`;
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

  axios.post(url, configData)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.POST_ATTEND_SITE_CONFIG_SUCCESS,
          data: response.data,
          prevSiteName: siteName,
        });
        dispatch(getAttendanceConfig(orgId, query));
        history.push(redirectUrl);
      }
    })
    .catch((error) => {
      const errMsg = get(error, 'response.data.errorMessage', error.message);
      dispatch({
        type: actionTypes.POST_ATTEND_SITE_CONFIG_ERROR,
        error: errMsg,
      });
    });
};

// put site config
export const putAttendSiteConfig = (orgId, configData, siteId, query) => (dispatch) => {
  dispatch({
    type: actionTypes.PUT_ATTEND_SITE_CONFIG_LOADING,
  });

  let url = `${ATTENDANCE_URL}/org/${orgId}/site-config/${siteId}`;
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

  axios.put(url, configData)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.PUT_ATTEND_SITE_CONFIG_SUCCESS,
          data: response.data,
        });
      }
    })
    .catch((error) => {
      const errMsg = get(error, 'response.data.errorMessage', error.message);
      dispatch({
        type: actionTypes.PUT_ATTEND_SITE_CONFIG_ERROR,
        error: errMsg,
      });
    });
};

// get site config
export const getAttendSiteConfig = (orgId, siteId, query) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_ATTEND_SITE_CONFIG_LOADING,
  });

  let url = `${ATTENDANCE_URL}/org/${orgId}/site-config/${siteId}`;

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
          type: actionTypes.GET_ATTEND_SITE_CONFIG_SUCCESS,
          data: response.data,
        });
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

// delete site config
export const deleteAttendSiteConfig = (
  orgId, siteId, { history, redirectUrl }, siteName, query,
) => (dispatch) => {
  dispatch({
    type: actionTypes.DELETE_ATTEND_SITE_CONFIG_LOADING,
  });

  let url = `${ATTENDANCE_URL}/org/${orgId}/site-config/${siteId}`;

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
          type: actionTypes.DELETE_ATTEND_SITE_CONFIG_SUCCESS,
          data: response.data,
          prevSiteName: siteName,
        });
        history.push(redirectUrl);
      }
    })
    .catch((error) => {
      const errMsg = get(error, 'response.data.errorMessage', error.message);
      dispatch({
        type: actionTypes.DELETE_ATTEND_SITE_CONFIG_ERROR,
        error: errMsg,
      });
    });
};

// get tag name Action Dispatch
export const getTagInfo = (tagIdList, sharedTag) => (dispatch) => {
  dispatch({
    type: actionTypes.POST_TAG_INFO_DATA_LOADING,
  });
  let url = `${CUSTOMER_MGMT}/tag?`;
  if (sharedTag) {
    url = `${CUSTOMER_MGMT}/shared/tag?`;
  }
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

// get site config count
export const getAttendSiteConfigCount = (orgId, targetUrl) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_ATTEND_SITE_CONFIG_COUNT_LOADING,
  });

  let url = `${ATTENDANCE_URL}/org/${orgId}/site-config`;
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
          if (url === `${ATTENDANCE_URL}/org/${orgId}/site-config?isCount=true`) {
            if (count === 0) {
              noSitesConfigured = true;
            }
          }
        }
        dispatch({
          type: actionTypes.GET_ATTEND_SITE_CONFIG_COUNT_SUCCESS,
          dataCount: count,
          noSitesConfigured,
        });
      }
    })
    .catch((error) => {
      const errMsg = get(error, 'response.data.errorMessage', error.message);
      dispatch({
        type: actionTypes.GET_ATTEND_SITE_CONFIG_COUNT_ERROR,
        error: errMsg,
      });
    });
};

// get site config list
export const getAttendSiteConfigList = (orgId, targetUrl, pageSize) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_ATTEND_SITE_CONFIG_LIST_LOADING,
  });

  let url = `${ATTENDANCE_URL}/org/${orgId}/site-config`;
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
          type: actionTypes.GET_ATTEND_SITE_CONFIG_LIST_SUCCESS,
          siteConfigList: response.data,
        });
      }
    })
    .catch((error) => {
      const errMsg = get(error, 'response.data.errorMessage', error.message);
      dispatch({
        type: actionTypes.GET_ATTEND_SITE_CONFIG_LIST_ERROR,
        error: errMsg,
      });
    });
};
