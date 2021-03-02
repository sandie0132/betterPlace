/* eslint-disable max-len */
/* eslint-disable no-shadow */
import axios from 'axios';
import _ from 'lodash';
import * as actionTypes from './actionTypes';

const BGV_VERIFICATION = process.env.REACT_APP_BGV_VERIFICATION_URL;
const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;
const WORKLOAD_MGMT = process.env.REACT_APP_WORKLOAD_MGMT_URL;
const BGV_REPORT_PDF = process.env.REACT_APP_BGV_REPORT_PDF;
const BGV_ADDRESS_VERIFICATION = process.env.REACT_APP_BGV_ADDRESS_VERIFICATION;

// Init State Action Dispatch
export const initState = () => (dispatch) => {
  dispatch({
    type: actionTypes.INIT_STATE,
  });
};

// Get Org Data
export const getOrgData = (orgId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_ORG_DATA_LOADING,
  });
  const apiUrl = `${CUST_MGMT}/org/${orgId}`;
  axios.get(apiUrl)
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
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_ORG_DATA_ERROR,
        error: errMsg,
      });
    });
};

// Get DataList Action Dispatch
export const getEmpData = (empId, orgId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_EMP_DATA_LOADING,
  });
  const apiURL = `${BGV_VERIFICATION}/org/${orgId}/employee/${empId}/report`;
  axios.get(apiURL)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_EMP_DATA_SUCCESS,
          empData: response.data,
          currentOrgId: response.data.orgId,
        });

        dispatch(getOrgData(response.data.orgId));
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

// Get Tag Data
export const getRoleTagData = (tagId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_ROLE_TAG_DATA_LOADING,
  });
  let url = `${CUST_MGMT}/tag?`;
  _.forEach(tagId, (id, index) => {
    if (index === tagId.length - 1) url += `tagId=${id}`;
    else url = `${url}tagId=${id}&`;
  });
  let roleTag = null;
  axios.get(url)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        roleTag = response.data;
        dispatch({
          type: actionTypes.GET_ROLE_TAG_DATA_SUCCESS,
          roleTag,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_ROLE_TAG_DATA_ERROR,
        error: errMsg,
      });
    });
};

// Get Tag Data
export const getLocationTagData = (tagId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_LOCATION_TAG_DATA_LOADING,
  });
  let url = `${CUST_MGMT}/tag?`;
  _.forEach(tagId, (id, index) => {
    if (index === tagId.length - 1) url += `tagId=${id}`;
    else url = `${url}tagId=${id}&`;
  });
  let locationTag = null;
  axios.get(url)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        locationTag = response.data;
        dispatch({
          type: actionTypes.GET_LOCATION_TAG_DATA_SUCCESS,
          locationTag,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_LOCATION_TAG_DATA_ERROR,
        error: errMsg,
      });
    });
};

// download attachments from modal
export const downloadAttachment = (url, verificationPreference) => (dispatch) => {
  dispatch({
    type: actionTypes.DOWNLOAD_ATTACHMENT_LOADING,
  });

  const apiUrl = verificationPreference === 'PHYSICAL'
    ? `${BGV_ADDRESS_VERIFICATION}/physical/image/download/${url}` : `${WORKLOAD_MGMT}/${url}`;

  axios.get((apiUrl), {
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
          type: actionTypes.DOWNLOAD_ATTACHMENT_SUCCESS,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.DOWNLOAD_ATTACHMENT_ERROR,
        error: errMsg,
      });
    });
};

// download Zip
export const downloadZip = (orgId, empId, fileName) => (dispatch) => {
  dispatch({
    type: actionTypes.DOWNLOAD_ZIP_PDF_LOADING,
  });
  const url = `${BGV_VERIFICATION}/org/${orgId}/employee/${empId}/report/download`;
  axios.get((url), {
    responseType: 'blob',
  })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data], { type: response.data.type }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.DOWNLOAD_ZIP_PDF_SUCCESS,
          zipFile: new Blob([response.data], { type: response.data.type }),
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.DOWNLOAD_ZIP_PDF_ERROR,
        error: errMsg,
      });
    });
};

// download summary pdf poc
export const downloadPdf = (orgId, empId, fileName, orgFrom, orgTo, orgVia) => (dispatch) => {
  dispatch({
    type: actionTypes.DOWNLOAD_SUMMARY_PDF_LOADING,
  });
  let url = `${BGV_REPORT_PDF}/org/${orgId}/employee/${empId}/report/pdf`;
  if (!_.isEmpty(orgFrom) && !_.isEmpty(orgTo)) {
    url += `?org_from=${orgFrom}&org_to=${orgTo}`;
  }
  if (!_.isEmpty(orgVia)) {
    url += `&org_via=${orgVia}`;
  }
  axios.get((url), {
    responseType: 'blob',
  })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data], { type: response.data.type }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.DOWNLOAD_SUMMARY_PDF_SUCCESS,
          summaryPdf: new Blob([response.data], { type: response.data.type }),
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.DOWNLOAD_SUMMARY_PDF_ERROR,
        error: errMsg,
      });
    });
};

export const clearRoleTagInfo = () => (dispatch) => {
  dispatch({
    type: actionTypes.CLEAR_ROLE_TAG_INFO,
  });
};
