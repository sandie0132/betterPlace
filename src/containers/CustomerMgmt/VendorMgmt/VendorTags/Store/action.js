/* eslint-disable no-underscore-dangle */
import axios from 'axios';
import _ from 'lodash';
import * as actionTypes from './actionTypes';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

export const initState = () => (dispatch) => {
  dispatch({
    type: actionTypes.INIT_VENDOR_TAGS_STATE,
  });
};

export const getVendorTagsCount = (
  orgId, vendorId, category, pageSize, targetUrl, orgOptionId,
) => (dispatch) => {
  const payload = {
    clientId: orgOptionId === '' ? orgId : orgOptionId,
    tagIds: [],
  };
  dispatch({
    type: actionTypes.GET_VENDOR_TAGS_COUNT_LOADING,
  });
  let url = `${CUST_MGMT}/org/${orgId}/vendor/${vendorId}/shared_tags`;

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
          type: actionTypes.GET_VENDOR_TAGS_COUNT_SUCCESS,
          vendorTagsCount: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_VENDOR_TAGS_COUNT_ERROR,
        error: errMsg,
      });
    });
};

export const getVendorTags = (
  orgId, vendorId, category, pageSize, targetUrl, orgOptionId,
) => (dispatch) => {
  const payload = {
    clientId: orgOptionId === '' ? orgId : orgOptionId,
    tagIds: [],
  };
  dispatch({
    type: actionTypes.GET_VENDOR_TAGS_LOADING,
  });
  let url = `${CUST_MGMT}/org/${orgId}/vendor/${vendorId}/shared_tags`;

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
          type: actionTypes.GET_VENDOR_TAGS_SUCCESS,
          vendorTags: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_VENDOR_TAGS_ERROR,
        error: errMsg,
      });
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

export const getSelectedClientName = (orgId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_SELECTED_CLIENT_LOADING,
  });
  axios.get(`${CUST_MGMT}/org/${orgId}`)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_SELECTED_CLIENT_SUCCESS,
          selectedClient: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_SELECTED_CLIENT_ERROR,
        error: errMsg,
      });
    });
};

export const getVendorData = (clientId, vendorId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_VENDOR_DATA_LOADING,
  });
  axios.get(`${CUST_MGMT}/org/${clientId}/vendor/${vendorId}`)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_VENDOR_DATA_SUCCESS,
          vendorData: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_VENDOR_DATA_ERROR,
        error: errMsg,
      });
    });
};

export const getClientList = (orgId, orgDetails) => (dispatch) => {
  const orgData = {
    attachments: [],
    brandColor: orgDetails.brandColor ? orgDetails.brandColor : '#8697A8',
    functions: [],
    legalName: orgDetails.legalName,
    locations: [],
    orgId: orgDetails.uuid ? orgDetails.uuid : orgDetails.orgId,
    name: orgDetails.name ? orgDetails.name : orgDetails.orgName,
    status: 'active',
    vendorId: '',
    _id: orgDetails._id,
  };
  dispatch({
    type: actionTypes.GET_CLIENT_LIST_LOADING,
  });
  axios.get(`${CUST_MGMT}/org/${orgId}/client`)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_CLIENT_LIST_SUCCESS,
          clientList: !_.isEmpty(response.data) ? [orgData, ...response.data] : [orgData],
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_CLIENT_LIST_ERROR,
        error: errMsg,
      });
    });
};

export const postUnassignTags = (
  orgId, vendorId, payload, allTagsSelected, category,
) => (dispatch) => {
  dispatch({
    type: actionTypes.POST_UNASSIGN_VENDOR_TAGS_LOADING,
  });

  let url = `${CUST_MGMT}/org/${orgId}/vendor/${vendorId}/share_tags/unassign?category=${category}`;
  if (allTagsSelected) {
    url += '&selectAll=true';
  }
  axios.post(url, payload)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.POST_UNASSIGN_VENDOR_TAGS_SUCCESS,
          unassignData: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.POST_UNASSIGN_VENDOR_TAGS_ERROR,
        error: errMsg,
      });
    });
};

export const getSelectedFiltersCount = (
  orgId, vendorId, category, pageSize, targetUrl, payload,
) => (dispatch) => {
  dispatch({
    type: actionTypes.POST_SELECTED_FILTERS_TAG_COUNT_LOADING,
  });
  let url = `${CUST_MGMT}/org/${orgId}/vendor/${vendorId}/shared_tags`;

  // if (!_.isEmpty(targetUrl) && targetUrl.includes('pageNumber') && pageSize) {
  //   url += `${targetUrl}&pageSize=${pageSize}&category=${category}&isCount=true`;
  // } else
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
  orgId, vendorId, category, pageSize, targetUrl, orgOptionId, selectedFiltersId,
) => (dispatch) => {
  const payload = {
    clientId: orgOptionId === '' ? orgId : orgOptionId,
    tagIds: selectedFiltersId,
  };
  dispatch({
    type: actionTypes.POST_SELECTED_FILTERS_TAG_DETAILS_LOADING,
  });
  let url = `${CUST_MGMT}/org/${orgId}/vendor/${vendorId}/shared_tags`;

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
