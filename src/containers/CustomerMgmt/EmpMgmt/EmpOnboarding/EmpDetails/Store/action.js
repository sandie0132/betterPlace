import axios from 'axios';
import _ from 'lodash';
import * as actionTypes from './actionTypes';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

// Init State Action Dispatch
export const initState = () => (dispatch) => {
  dispatch({
    type: actionTypes.INIT_STATE,
  });
};

/// SET reports to data to reducer
export const setReportsToData = (reportsToData) => (dispatch) => {
  dispatch({
    type: actionTypes.SET_REPORTS_TO_DATA,
    reportsToData,
  });
};

// get org data of report to employee
export const getOrgData = (orgId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_ORG_DATA_LOADING,
  });
  axios.get(`${CUST_MGMT}/org/${orgId}`)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_ORG_DATA_SUCCESS,
          orgData: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_ORG_DATA_ERROR,
        error: errMsg,
      });
    });
};

// get info of report to employee
export const getReportsToData = (empId, orgId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_REPORTS_TO_DATA_LOADING,
  });
  axios.get(`${CUST_MGMT}/org/${orgId}/employee/${empId}`)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_REPORTS_TO_DATA_SUCCESS,
          reportsToData: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_REPORTS_TO_DATA_ERROR,
        error: errMsg,
      });
    });
};

// Get Data Action Dispatch
export const getData = (empId, orgId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_DATA_LOADING,
  });
  axios.get(`${CUST_MGMT}/org/${orgId}/employee/${empId}`)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_DATA_SUCCESS,
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
        type: actionTypes.GET_DATA_ERROR,
        error: errMsg,
      });
    });
};

export const getEntityType = (empId, orgId) => (dispatch) => {
  axios.get(`${CUST_MGMT}/org/${orgId}/employee/${empId}`)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_ENTITY_TYPE,
          entityType: response.data.entityType,
        });
      }
    });
  // .catch(error => {
  //     dispatch({
  //         error: error
  //     });
  // });
};

// Put Data Action Dispatch
export const putData = (empId, data, orgId) => (dispatch) => {
  dispatch({
    type: actionTypes.PUT_DATA_LOADING,
  });
  axios.put(`${CUST_MGMT}/org/${orgId}/employee/${empId}`, data)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.PUT_DATA_SUCCESS,
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
        type: actionTypes.PUT_DATA_ERROR,
        error: errMsg,
      });
    });
};

// Get Tag Info Action Dispatch
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

// Get reportsTo Tag info

export const getReportsToTagInfo = (tagIdList) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_REPORTS_TO_TAG_INFO_LOADING,
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
          type: actionTypes.GET_REPORTS_TO_TAG_INFO_SUCCESS,
          reportsToTagInfo: response.data,
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
        type: actionTypes.GET_REPORTS_TO_TAG_INFO_ERROR,
        error: errMsg,
      });
    });
};

export const getOrgListDetails = (orgIdlist) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_ORG_LIST_INFO_LOADING,
  });
  const payload = { orgIds: orgIdlist };
  const url = `${CUST_MGMT}/org-list`;
  axios.post(url, payload)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        const orgNameMapping = {};
        const { data } = response;
        data.forEach((org) => {
          orgNameMapping[org.uuid] = org.name;
        });
        dispatch({
          type: actionTypes.GET_ORG_LIST_INFO_SUCCESS,
          orgNameMapping,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_ORG_LIST_INFO_ERROR,
        error: errMsg,
      });
    });
};

export const getDeploymentHistory = (orgId, empId, empData, type, status) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_DEPLOYMENT_HISTORY_LOADING,
  });
  let url = `${CUST_MGMT}/orgId/${orgId}/empId/${empId}/employee/job`;
  if (!_.isEmpty(type)) {
    url += `?type=${type}`;
  }
  if (!_.isEmpty(status) && status !== 'ALL') {
    url += !_.isEmpty(type) ? '&' : '?';
    url += `status=${status}`;
  }
  axios.get(url)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        const { data } = response;
        let deploymentHistory = [empData];
        const orgIds = [];
        if (!_.isEmpty(data.profileData)) {
          deploymentHistory = [...deploymentHistory, ...data.profileData];
          deploymentHistory.forEach((each) => {
            if (!orgIds.includes(each.orgId)) orgIds.push(each.orgId);
            if (each.source_org && !orgIds.includes(each.source_org)) orgIds.push(each.source_org);
            if (each.origin_org && !orgIds.includes(each.origin_org)) orgIds.push(each.origin_org);
          });
          dispatch(getOrgListDetails(orgIds));
        }
        dispatch({
          type: actionTypes.GET_DEPLOYMENT_HISTORY_SUCCESS,
          deploymentHistory,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_DEPLOYMENT_HISTORY_ERROR,
        error: errMsg,
      });
    });
};

// shared tags api
export const getSharedTagsInfo = (tagIdList) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_SHARED_TAG_INFO_LOADING,
  });
  let url = `${CUST_MGMT}/tag?`;
  _.forEach(tagIdList, (tagId, index) => {
    if (index === tagIdList.length - 1) url += `tagId=${tagId}`;
    else url = `${url}tagId=${tagId}&`;
  });
  axios.get(url)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        const { data } = response;
        const updatedData = {};
        data.forEach((each) => {
          const updatedObj = !_.isEmpty(updatedData[each.orgId]) ? {
            ...updatedData[each.orgId],
            [each.category]: each.name,
          } : { [each.category]: each.name };
          updatedData[each.orgId] = updatedObj;
        });
        dispatch({
          type: actionTypes.GET_SHARED_TAG_INFO_SUCCESS,
          sharedTagsInfo: updatedData,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_CONTRACTOR_DETAILS_ERROR,
        error: errMsg,
      });
    });
};

// contractor details get api
export const getContractorDetails = (orgId, empId, clientType, clientId, superClientId) => (
  dispatch,
) => {
  dispatch({
    type: actionTypes.GET_CONTRACTOR_DETAILS_LOADING,
  });
  let url = `${CUST_MGMT}/org/${orgId}/sourceEmpId/${empId}/contractorDetails`;
  if (!_.isEmpty(clientType) && !_.isEmpty(clientId)) {
    url += `?clientType=${clientType}&clientId=${clientId}`;
  }
  if (!_.isEmpty(superClientId)) {
    url += `&superClientId=${superClientId}`;
  }
  axios.get(url)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_CONTRACTOR_DETAILS_SUCCESS,
          getContractorData: { ...response.data, clientId, superClientId },
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_CONTRACTOR_DETAILS_ERROR,
        error: errMsg,
      });
    });
};

// contractor details put api
export const putContractorDetails = (orgId, empId, clientType, clientId, superClientId, data) => (
  dispatch,
) => {
  dispatch({
    type: actionTypes.PUT_CONTRACTOR_DETAILS_LOADING,
  });
  let url = `${CUST_MGMT}/org/${orgId}/sourceEmpId/${empId}/contractorDetails`;
  if (!_.isEmpty(clientType) && !_.isEmpty(clientId)) {
    url += `?clientType=${clientType}&clientId=${clientId}`;
  }
  if (!_.isEmpty(superClientId)) {
    url += `&superClientId=${superClientId}`;
  }
  axios.put(url, data)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.PUT_CONTRACTOR_DETAILS_SUCCESS,
          putContractorData: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.PUT_CONTRACTOR_DETAILS_ERROR,
        error: errMsg,
      });
    });
};
