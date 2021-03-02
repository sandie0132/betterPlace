/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
import axios from 'axios';
import _ from 'lodash';
import * as actionTypes from './actionTypes';

import { getNotificationList } from '../../../Notifications/Store/action';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;
const PLATFORM_URL = process.env.REACT_APP_PLATFORM_API_URL;
const BGV_VERIFY = process.env.REACT_APP_BGV_VERIFICATION_URL;

// Init State Action Dispatch
export const initState = () => (dispatch) => {
  dispatch({
    type: actionTypes.INIT_STATE,
  });
};

// Get Vendor Mgmt filters payload
export const getFilterPayloadData = (payload) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_FILTER_PAYLOAD_STATE,
    filterPayload: payload,
  });
};

// Get DataCount Action Dispatch
export const getListPaginationCount = (targetUrl, orgId) => {
  let updatedUrl = targetUrl.split('?');
  if (!_.isEmpty(updatedUrl[1])) { // if date same, appending time along date in targetUrl
    updatedUrl = updatedUrl[1].split('&');
    let createdFrom = ''; let
      createdTo = '';
    updatedUrl.forEach((item) => {
      if (item.substring(0, 9) === 'createdTo') {
        createdTo = item.substring(10, item.length);
      } else if (item.substring(0, 11) === 'createdFrom') {
        createdFrom = item.substring(12, item.length);
      }
    });

    if (createdFrom === createdTo) {
      createdFrom = `${createdFrom} 00:00:00`;
      createdTo = `${createdTo} 23:59:59`;
      updatedUrl.forEach((item, index) => {
        if (item.substring(0, 9) === 'createdTo') {
          updatedUrl[index] = `createdTo=${createdTo}`;
        }
        if (item.substring(0, 11) === 'createdFrom') {
          updatedUrl[index] = `createdFrom=${createdFrom}`;
        }
      });
    }

    updatedUrl = updatedUrl.join('&');
    targetUrl = `?${updatedUrl}`;
  }

  return (dispatch) => {
    dispatch({
      type: actionTypes.GET_LIST_COUNT_LOADING,
    });
    let apiUrl = `${CUST_MGMT}/org/${orgId}/employee${targetUrl}&isCount=true`;
    if (targetUrl.length === 0) {
      apiUrl = `${CUST_MGMT}/org/${orgId}/employee?isCount=true`;
    }
    axios.get(apiUrl)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          let count = 0;
          let isListEmpty = false;
          if (response.data.count !== undefined) {
            count = response.data.count;
            if (apiUrl === `${CUST_MGMT}/org/${orgId}/employee?isCount=true`) {
              if (count === 0) {
                isListEmpty = true;
              }
            }
          }
          dispatch({
            type: actionTypes.GET_LIST_COUNT_SUCCESS,
            dataCount: count,
            isListEmpty,
          });
        }
      })
      .catch((error) => {
        let errMsg = error;
        if (error.response.data && error.response.data.errorMessage) {
          errMsg = error.response.data.errorMessage;
        }
        dispatch({
          type: actionTypes.GET_LIST_COUNT_ERROR,
          error: errMsg,
        });
      });
  };
};

// Get DataList Action Dispatch
export const getEmployeeList = (targetUrl, pageSize, orgId) => {
  let updatedUrl = targetUrl.split('?');
  if (!_.isEmpty(updatedUrl[1])) { // if date same, appending time along date in targetUrl
    updatedUrl = updatedUrl[1].split('&');
    let createdFrom = ''; let
      createdTo = '';
    updatedUrl.forEach((item) => {
      if (item.substring(0, 9) === 'createdTo') {
        createdTo = item.substring(10, item.length);
      } else if (item.substring(0, 11) === 'createdFrom') {
        createdFrom = item.substring(12, item.length);
      }
    });

    if (createdFrom === createdTo) {
      createdFrom = `${createdFrom} 00:00:00`;
      createdTo = `${createdTo} 23:59:59`;
      updatedUrl.forEach((item, index) => {
        if (item.substring(0, 9) === 'createdTo') {
          updatedUrl[index] = `createdTo=${createdTo}`;
        }
        if (item.substring(0, 11) === 'createdFrom') {
          updatedUrl[index] = `createdFrom=${createdFrom}`;
        }
      });
    }

    updatedUrl = updatedUrl.join('&');
    targetUrl = `?${updatedUrl}`;
  }
  let apiUrl = `${CUST_MGMT}/org/${orgId}/employee${targetUrl}`;
  if (pageSize) {
    apiUrl = `${apiUrl}&pageSize=${pageSize}`;
  }
  return (dispatch) => {
    dispatch({
      type: actionTypes.GET_EMPLOYEE_LIST_LOADING,
    });
    axios.get(apiUrl)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch({
            type: actionTypes.GET_EMPLOYEE_LIST_SUCCESS,
            employeeList: response.data,
          });
        }
      })
      .catch((error) => {
        let errMsg = error;
        if (error.response.data && error.response.data.errorMessage) {
          errMsg = error.response.data.errorMessage;
        }
        dispatch({
          type: actionTypes.GET_EMPLOYEE_LIST_ERROR,
          error: errMsg,
        });
      });
  };
};

// Get DataCount Action Dispatch
export const searchDataCount = (targetUrl, searchKey, orgId, category) => (dispatch) => {
  dispatch({
    type: actionTypes.SEARCH_EMP_COUNT_LOADING,
  });
  let apiUrl = `${CUST_MGMT}/org/${orgId}/employee/search${targetUrl}&isCount=true&key=${searchKey}&category=${category}`;
  if (targetUrl.length === 0) {
    apiUrl = `${CUST_MGMT}/org/${orgId}/employee/search?isCount=true&key=${searchKey}&category=${category}`;
  }
  axios.get(apiUrl)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        let count = 0;
        if (response.data.count !== undefined) {
          count = response.data.count;
        }
        dispatch({
          type: actionTypes.SEARCH_EMP_COUNT_SUCCESS,
          dataCount: count,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.SEARCH_EMP_COUNT_ERROR,
        error: errMsg,
      });
    });
};

// Get DataList Action Dispatch
export const searchEmployee = (targetUrl, searchKey, pageSize, orgId, type) => {
  let apiUrl = `${CUST_MGMT}/org/${orgId}/employee/search?key=${searchKey}&category=${type}`;
  if (!(targetUrl.length === 0)) {
    apiUrl = `${CUST_MGMT}/org/${orgId}/employee/search${targetUrl}&key=${searchKey}&category=${type}`;
  }
  if (pageSize) {
    apiUrl = `${apiUrl}&pageSize=${pageSize}`;
  }
  return (dispatch) => {
    dispatch({
      type: actionTypes.SEARCH_EMPLOYEE_LOADING,
    });
    axios.get(apiUrl)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch({
            type: actionTypes.SEARCH_EMPLOYEE_SUCCESS,
            employeeList: response.data,
          });
        }
      })
      .catch((error) => {
        let errMsg = error;
        if (error.response.data && error.response.data.errorMessage) {
          errMsg = error.response.data.errorMessage;
        }
        dispatch({
          type: actionTypes.SEARCH_EMPLOYEE_ERROR,
          error: errMsg,
        });
      });
  };
};

// Post bulk action download excel
export const employeeBulkActions = (
  orgId, action, reqType, query, payload, selectAll,
) => (dispatch) => {
  dispatch({
    actionName: action,
    type: actionTypes.POST_BULK_ACTION_EMPLOYEES_LOADING,
  });

  let url = `${PLATFORM_URL}/org/${orgId}/employee/bulk-actions?${query}&action=${action}&reqType=${reqType}`;
  const finalPayload = _.cloneDeep(payload);
  if (_.isEmpty(query)) url = `${PLATFORM_URL}/org/${orgId}/employee/bulk-actions?action=${action}&reqType=${reqType}`;
  if (selectAll === true) {
    finalPayload.data.empIds = [];
  }
  axios.post(url, finalPayload)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.POST_BULK_ACTION_EMPLOYEES_SUCCESS,
        });
        dispatch(getNotificationList(orgId));
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.POST_BULK_ACTION_EMPLOYEES_ERROR,
        error: errMsg,
      });
    });
};

export const getTagInfo = (tagIdList) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_TAG_INFO_LOADING,
  });
  let url = `${CUST_MGMT}/tag?`;
  _.forEach(tagIdList, (tagId, index) => {
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
      if (error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      } else {
        errMsg = error.message;
      }
      dispatch({
        type: actionTypes.GET_TAG_INFO_ERROR,
        error: errMsg,
      });
    });
};

export const getTagName = (tagIdList) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_FILTER_TAG_MAP_LIST_LOADING,
  });
  let url = `${CUST_MGMT}/tag?`;
  _.forEach(tagIdList, (tagId, index) => {
    if (index === tagIdList.length - 1) url += `tagId=${tagId}`;
    else url = `${url}tagId=${tagId}&`;
  });
  axios.get(url)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_FILTER_TAG_MAP_LIST_SUCCESS,
          TagInfoData: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      } else {
        errMsg = error.message;
      }
      dispatch({
        type: actionTypes.GET_FILTER_TAG_MAP_LIST_ERROR,
        error: errMsg,
      });
    });
};

// deployment related apis below
export const clientSearch = (orgId, key, clientId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_CLIENT_SEARCH_LOADING,
  });
  let url = `${CUST_MGMT}/orgId/${orgId}/client/search?key=${key}`;
  if (clientId) {
    url += `&clientId=${clientId}`;
  }
  axios.get(url)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_CLIENT_SEARCH_SUCCESS,
          clientSearchResult: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      } else {
        errMsg = error.message;
      }
      dispatch({
        type: actionTypes.GET_CLIENT_SEARCH_ERROR,
        error: errMsg,
      });
    });
};

// Get data count based on vendor filters
export const getListPaginationCountByVendorFilters = (targetUrl, orgId, payload) => {
  let updatedUrl = targetUrl.split('?');
  if (!_.isEmpty(updatedUrl[1])) { // if date same, appending time along date in targetUrl
    updatedUrl = updatedUrl[1].split('&');
    let createdFrom = ''; let
      createdTo = '';
    updatedUrl.forEach((item) => {
      if (item.substring(0, 9) === 'createdTo') {
        createdTo = item.substring(10, item.length);
      } else if (item.substring(0, 11) === 'createdFrom') {
        createdFrom = item.substring(12, item.length);
      }
    });

    if (createdFrom === createdTo) {
      createdFrom = `${createdFrom} 00:00:00`;
      createdTo = `${createdTo} 23:59:59`;
      updatedUrl.forEach((item, index) => {
        if (item.substring(0, 9) === 'createdTo') {
          updatedUrl[index] = `createdTo=${createdTo}`;
        }
        if (item.substring(0, 11) === 'createdFrom') {
          updatedUrl[index] = `createdFrom=${createdFrom}`;
        }
      });
    }

    updatedUrl = updatedUrl.join('&');
    targetUrl = `?${updatedUrl}`;
  }

  return (dispatch) => {
    dispatch({
      type: actionTypes.GET_LIST_COUNT_LOADING,
    });
    let apiUrl = `${CUST_MGMT}/org/${orgId}/employees${targetUrl}&isCount=true`;
    if (targetUrl.length === 0) {
      apiUrl = `${CUST_MGMT}/org/${orgId}/employees?isCount=true`;
    }
    axios.post(apiUrl, payload)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          let count = 0;
          let isListEmpty = false;
          if (response.data.count !== undefined) {
            count = response.data.count;
            if (apiUrl === `${CUST_MGMT}/org/${orgId}/employees?isCount=true`) {
              if (count === 0) {
                isListEmpty = true;
              }
            }
          }
          dispatch({
            type: actionTypes.GET_LIST_COUNT_SUCCESS,
            dataCount: count,
            isListEmpty,
          });
        }
      })
      .catch((error) => {
        let errMsg = error;
        if (error.response.data && error.response.data.errorMessage) {
          errMsg = error.response.data.errorMessage;
        }
        dispatch({
          type: actionTypes.GET_LIST_COUNT_ERROR,
          error: errMsg,
        });
      });
  };
};

// Get data list/ emp list based on vendor filters
export const getEmployeeListByVendorFilters = (targetUrl, pageSize, orgId, payload) => {
  let updatedUrl = targetUrl.split('?');
  if (!_.isEmpty(updatedUrl[1])) { // if date same, appending time along date in targetUrl
    updatedUrl = updatedUrl[1].split('&');
    let createdFrom = ''; let
      createdTo = '';
    updatedUrl.forEach((item) => {
      if (item.substring(0, 9) === 'createdTo') {
        createdTo = item.substring(10, item.length);
      } else if (item.substring(0, 11) === 'createdFrom') {
        createdFrom = item.substring(12, item.length);
      }
    });

    if (createdFrom === createdTo) {
      createdFrom = `${createdFrom} 00:00:00`;
      createdTo = `${createdTo} 23:59:59`;
      updatedUrl.forEach((item, index) => {
        if (item.substring(0, 9) === 'createdTo') {
          updatedUrl[index] = `createdTo=${createdTo}`;
        }
        if (item.substring(0, 11) === 'createdFrom') {
          updatedUrl[index] = `createdFrom=${createdFrom}`;
        }
      });
    }

    updatedUrl = updatedUrl.join('&');
    targetUrl = `?${updatedUrl}`;
  }
  let apiUrl = `${CUST_MGMT}/org/${orgId}/employees${targetUrl}`;
  if (pageSize) {
    apiUrl = `${apiUrl}&pageSize=${pageSize}`;
  }
  return (dispatch) => {
    dispatch({
      type: actionTypes.GET_EMPLOYEE_LIST_LOADING,
    });
    axios.post(apiUrl, payload)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch({
            type: actionTypes.GET_EMPLOYEE_LIST_SUCCESS,
            employeeList: response.data,
          });
        }
      })
      .catch((error) => {
        let errMsg = error;
        if (error.response.data && error.response.data.errorMessage) {
          errMsg = error.response.data.errorMessage;
        }
        dispatch({
          type: actionTypes.GET_EMPLOYEE_LIST_ERROR,
          error: errMsg,
        });
      });
  };
};

export const getInitiateData = (orgId, payload) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_INITIATE_DATA_LOADING,
  });
  const url = `${BGV_VERIFY}/configured-missing-details/${orgId}`;
  axios.post(url, payload)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_INITIATE_DATA_SUCCESS,
          bgvInitiateData: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_INITIATE_DATA_ERROR,
        error: errMsg,
      });
    });
};

export const getDeployedCount = (orgId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_DEPLOYED_EMPCOUNT_LOADING,
  });
  axios.get(`${CUST_MGMT}/org/${orgId}/deployed/count`)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_DEPLOYED_EMPCOUNT_SUCCESS,
          deployedEmpCount: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_DEPLOYED_EMPCOUNT_ERROR,
        error: errMsg,
      });
    });
};
