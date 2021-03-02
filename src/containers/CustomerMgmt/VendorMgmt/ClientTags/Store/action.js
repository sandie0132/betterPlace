import axios from 'axios';
import _ from 'lodash';
import * as actionTypes from './actionTypes';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

export const initState = () => (dispatch) => {
  dispatch({
    type: actionTypes.INIT_CLIENT_TAGS_STATE,
  });
};

export const getOrgNameById = (orgId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_ORG_NAME_LOADING,
  });
  axios.get(`${CUST_MGMT}/org/${orgId}`)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_ORG_NAME_SUCCESS,
          orgName: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_ORG_NAME_ERROR,
        error: errMsg,
      });
    });
};

export const getClientData = (orgId, clientId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_CLIENT_DATA_LOADING,
  });
  axios.get(`${CUST_MGMT}/org/${orgId}/client/${clientId}`)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_CLIENT_DATA_SUCCESS,
          clientData: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_CLIENT_DATA_ERROR,
        error: errMsg,
      });
    });
};

export const getClientTagsCount = (
  orgId, clientId, category, pageSize, targetUrl, orgOptionId,
) => (dispatch) => {
  const payload = {
    clientId: orgOptionId || clientId,
    tagIds: [],
  };

  dispatch({
    type: actionTypes.GET_CLIENT_TAGS_COUNT_LOADING,
  });

  let url = `${CUST_MGMT}/org/${clientId}/vendor/${orgId}/shared_tags`;

  if (!_.isEmpty(targetUrl) && targetUrl.includes('pageNumber') && pageSize) {
    url += `${targetUrl}&pageSize=${pageSize}&category=${category}&isCount=true`;
  } else if (!_.isEmpty(targetUrl)) {
    url += `${targetUrl}&category=${category}&isCount=true`;
  } else if (_.isEmpty(targetUrl)) {
    url += `?category=${category}&isCount=true`;
  }

  axios.post(url, payload)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_CLIENT_TAGS_COUNT_SUCCESS,
          clientTagsCount: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_CLIENT_TAGS_COUNT_ERROR,
        error: errMsg,
      });
    });
};

export const getClientTags = (
  orgId, clientId, category, pageSize, targetUrl, orgOptionId,
) => (dispatch) => {
  const payload = {
    clientId: orgOptionId || clientId,
    tagIds: [],
  };
  dispatch({
    type: actionTypes.GET_CLIENT_TAGS_LOADING,
  });
  let url = `${CUST_MGMT}/org/${clientId}/vendor/${orgId}/shared_tags`;

  if (!_.isEmpty(targetUrl) && targetUrl.includes('pageNumber') && pageSize) {
    url += `${targetUrl}&pageSize=${pageSize}`;
  } else if (!_.isEmpty(targetUrl)) {
    url += `${targetUrl}`;
  }

  if (!_.isEmpty(category) && !_.isEmpty(targetUrl)) {
    url += `&category=${category}`;
  } else if (!_.isEmpty(category) && _.isEmpty(targetUrl)) {
    url += `?category=${category}`;
  }

  axios.post(url, payload)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_CLIENT_TAGS_SUCCESS,
          clientTags: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_CLIENT_TAGS_ERROR,
        error: errMsg,
      });
    });
};

export const getSelectedFiltersCount = (
  orgId, clientId, category, pageSize, targetUrl, payload,
) => (dispatch) => {
  dispatch({
    type: actionTypes.POST_SELECTED_FILTERS_TAG_COUNT_LOADING,
  });
  let url = `${CUST_MGMT}/org/${clientId}/vendor/${orgId}/shared_tags`;

  if (!_.isEmpty(targetUrl)) {
    url += `${targetUrl}&category=${category}&isCount=true`;
  } else if (_.isEmpty(targetUrl)) {
    url += `?category=${category}&isCount=true`;
  }

  axios.post(url, payload)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.POST_SELECTED_FILTERS_TAG_COUNT_SUCCESS,
          selectedFilterTagCount: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.POST_SELECTED_FILTERS_TAG_COUNT_ERROR,
        error: errMsg,
      });
    });
};

export const getSelectedFilters = (
  orgId, clientId, category, pageSize, targetUrl, orgOptionId, selectedFiltersId,
) => (dispatch) => {
  const payload = {
    clientId: orgOptionId === '' ? clientId : orgOptionId,
    tagIds: selectedFiltersId,
  };
  dispatch({
    type: actionTypes.POST_SELECTED_FILTERS_TAG_DETAILS_LOADING,
  });
  let url = `${CUST_MGMT}/org/${clientId}/vendor/${orgId}/shared_tags`;

  if (!_.isEmpty(targetUrl) && targetUrl.includes('pageNumber') && pageSize) {
    url += `${targetUrl}&pageSize=${pageSize}&category=${category}`;
  } else if (!_.isEmpty(targetUrl)) {
    url += `${targetUrl}&category=${category}`;
  } else if (_.isEmpty(targetUrl)) {
    url += `?category=${category}`;
  }

  axios.post(url, payload)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.POST_SELECTED_FILTERS_TAG_DETAILS_SUCCESS,
          selectedFilterTagDetails: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.POST_SELECTED_FILTERS_TAG_DETAILS_ERROR,
        error: errMsg,
      });
    });
};
