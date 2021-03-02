/* eslint-disable no-shadow */
import axios from 'axios';
import { forEach, get, isEmpty } from 'lodash';
import * as actionTypes from './actionTypes';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;
const BGV_VERIFICATION = process.env.REACT_APP_BGV_VERIFICATION_URL;
// const BGV_REPORT_PDF = process.env.REACT_APP_BGV_REPORT_PDF;
const ATTENDANCE_URL = process.env.REACT_APP_BGV_ATTENDANCE_CONFIG_URL;

// Init State Action Dispatch
export const initState = () => (dispatch) => {
  dispatch({
    type: actionTypes.INIT_STATE,
  });
};

// Get basic and Emp details Dispatch
export const getEmpData = (empId, orgId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_EMP_DATA_LOADING,
  });
  axios.get(`${CUST_MGMT}/org/${orgId}/employee/${empId}`)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_EMP_DATA_SUCCESS,
          empData: response.data,

        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_EMP_DATA_ERROR,
        error: errMsg,
      });
    });
};

// Get basic and Emp details Dispatch
export const getEmpBGVResult = (orgId, empId, orgFrom, orgTo, orgVia) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_EMP_BGV_DATA_LOADING,
  });
  axios.get(`${BGV_VERIFICATION}/org/${orgId}/employee/${empId}/report`)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        const verifyObject = response.data.verifications;
        let serviceStatus = null;
        let verificationStatus;
        forEach(verifyObject, (verify) => {
          // for original org BGV data
          if (isEmpty(orgFrom) && isEmpty(verify.org_from) && verify.orgId === orgId) {
            serviceStatus = verify.bgv;
            verificationStatus = verify.status;
          }
          // for client org BGV data
          if (!isEmpty(orgFrom) && !isEmpty(orgTo) && verify.org_from === orgFrom
              && verify.org_to === orgTo) {
            serviceStatus = verify.bgv;
            verificationStatus = verify.status;
          }
          // for super client org BGV data
          if (!isEmpty(orgFrom) && !isEmpty(orgTo) && !isEmpty(verify.orgVia)
          && verify.org_from === orgFrom && verify.org_to === orgTo && verify.org_via === orgVia) {
            serviceStatus = verify.bgv;
            verificationStatus = verify.status;
          }
        });
        dispatch({
          type: actionTypes.GET_EMP_BGV_DATA_SUCCESS,
          serviceStatus,
          verificationStatus,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_EMP_BGV_DATA_ERROR,
        error: errMsg,
      });
    });
};

export const getEmpMissingData = (orgId, empId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_EMP_MISSING_DATA_LOADING,
  });
  axios.get(`${BGV_VERIFICATION}/missing-info/${orgId}/${empId}`)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_EMP_MISSING_DATA_SUCCESS,
          empMissingDataWithStatus: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_EMP_MISSING_DATA_ERROR,
        error: errMsg,
      });
    });
};

export const getTagName = (tagId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_TAG_NAME_LOADING,
  });

  let url = `${CUST_MGMT}/tag?`;
  forEach(tagId, (id, index) => {
    if (index === tagId.length - 1) url += `tagId=${id}`;
    else url = `${url}tagId=${id}&`;
  });

  axios.get(url)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_TAG_NAME_SUCCESS,
          tagData: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      } else {
        errMsg = error.message;
      }
      dispatch({
        type: actionTypes.GET_TAG_NAME_ERROR,
        error: errMsg,
      });
    });
};

// profileExperience/education file download
export const downloadFile = (type, fileId) => {
  let fileName = fileId.split('/');
  fileName = fileName[fileName.length - 1];

  return (dispatch) => {
    dispatch({
      type: actionTypes.DOWNLOAD_FILE_LOADING,
    });

    const url = `${CUST_MGMT}/file/download/${type}/${fileName}`;

    axios.get((url), {
      responseType: 'blob',
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data], {
          type: response.data.type,
        }));
        const link = document.createElement('a');

        let fileName = response.headers['content-disposition'].split(/foo/);
        fileName = fileName[0].split(' ');
        fileName = fileName[1].split('=');
        fileName = fileName[1].split('.');

        link.href = url;
        link.setAttribute('download', fileName[0]);
        document.body.appendChild(link);
        link.click();

        if (response.status === 200 || response.status === 201) {
          dispatch({
            type: actionTypes.DOWNLOAD_FILE_SUCCESS,
          });
        }
      })
      .catch((error) => {
        let errMsg = error;
        if (error.response && error.response.data && error.response.data.errorMessage) {
          errMsg = error.response.data.errorMessage;
        } else {
          errMsg = error.message;
        }
        dispatch({
          type: actionTypes.DOWNLOAD_FILE_ERROR,
          error: errMsg,
        });
      });
  };
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

// checking if vendor/client orgs exists
export const getVendorClientInfo = (orgId, empId, empData, type, status) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_VENDOR_CLIENT_INFO_LOADING,
  });
  let url = `${CUST_MGMT}/orgId/${orgId}/empId/${empId}/employee/job`;
  if (!isEmpty(type)) {
    url += `?type=${type}`;
  }
  if (!isEmpty(status) && status !== 'ALL') {
    url += !isEmpty(type) ? '&' : '?';
    url += `status=${status}`;
  }
  axios.get(url)
    .then((response) => {
      const { data } = response;
      let vendorClientInfo = [empData];
      const orgIds = [];
      let clientsExists = false;
      if (!isEmpty(data.profileData)) {
        vendorClientInfo = [...vendorClientInfo, ...data.profileData];
        clientsExists = true;
        vendorClientInfo.forEach((each) => {
          if (!orgIds.includes(each.orgId)) orgIds.push(each.orgId);
          if (each.source_org && !orgIds.includes(each.source_org)) orgIds.push(each.source_org);
          if (each.origin_org && !orgIds.includes(each.origin_org)) orgIds.push(each.origin_org);
        });
        dispatch(getOrgListDetails(orgIds));
      }
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_VENDOR_CLIENT_INFO_SUCCESS,
          vendorClientInfo,
          clientsExists,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_VENDOR_CLIENT_INFO_ERROR,
        error: errMsg,
      });
    });
};

export const getEmpLeaveQuota = (orgId, empId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_EMP_LEAVE_QUOTA_LOADING,
  });

  const url = `${ATTENDANCE_URL}/org/${orgId}/emp/${empId}/leave-quota`;
  axios.get(url)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_EMP_LEAVE_QUOTA_SUCCESS,
          data: response.data,
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
        type: actionTypes.GET_EMP_LEAVE_QUOTA_ERROR,
        error: errMsg,
      });
    });
};
