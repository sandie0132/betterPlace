/* eslint-disable no-shadow */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-use-before-define */
import axios from 'axios';
import _ from 'lodash';

import * as actionTypes from './actionTypes';
import { getSectionStatus } from './utility';
import * as initData from './StaticDataInitData';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;
const BGV_VERIFICATION = process.env.REACT_APP_BGV_VERIFICATION_URL;
const PLATFORM_SERVICES = process.env.REACT_APP_PLATFORM_API_URL;

// Init State Action Dispatch
export const initState = () => (dispatch) => {
  dispatch({
    type: actionTypes.INIT_STATE,
  });
};

// Get Emp Data Action Dispatch
export const getEmpData = (orgId, empId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_EMPLOYEE_DATA_LOADING,
  });
  axios.get(`${CUST_MGMT}/org/${orgId}/employee/${empId}`)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch(updateSectionStatus(response.data));
        if (!_.isEmpty(response.data.profilePicUrl)) {
          dispatch(getEmpProfilePic(response.data.profilePicUrl));
        }
        if (!_.isEmpty(response.data.defaultRole) || !_.isEmpty(response.data.defaultLocation)) {
          dispatch(getEmpDefaultRole(response.data.defaultRole, response.data.defaultLocation));
        }
        if (!_.isEmpty(response.data.reportsTo)) {
          dispatch(getReportingManager(orgId, response.data.reportsTo));
        }
        dispatch({
          type: actionTypes.GET_EMPLOYEE_DATA_SUCCESS,
          data: response.data,
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.GET_EMPLOYEE_DATA_ERROR,
        error,
      });
    });
};

// Put Emp Data Action Dispatch
export const putEmpData = (orgId, empId, data, isGetProfilePicReq,
  isGetDefaultRoleReq, isGetReportingManagerReq) => (dispatch, getState) => {
  dispatch({
    type: actionTypes.UPDATE_EMPLOYEE_DATA_LOADING,
  });
  axios.put(`${CUST_MGMT}/org/${orgId}/employee/${empId}`, data)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch(updateSectionStatus(response.data));

        if (!_.isEmpty(response.data.profilePicUrl) && isGetProfilePicReq) {
          dispatch(getEmpProfilePic(response.data.profilePicUrl));
        } else if (_.isEmpty(response.data.profilePicUrl)) {
          dispatch(removeEmpProfilePic());
        }

        if (!_.isEmpty(response.data.defaultRole) && isGetDefaultRoleReq) {
          dispatch(getEmpDefaultRole(response.data.defaultRole));
        }
        if (!_.isEmpty(response.data.reportsTo) && isGetReportingManagerReq) {
          dispatch(getReportingManager(orgId, response.data.reportsTo));
        }

        if (!_.isEmpty(getState().empMgmt.empOnboard.onboard.empMissingInfo)) {
          dispatch(getEmpMissingInfo(orgId, empId));
          dispatch(getEmpBgvDetails(orgId, empId));
        }
        dispatch({
          type: actionTypes.UPDATE_EMPLOYEE_DATA_SUCCESS,
          data: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.UPDATE_EMPLOYEE_DATA_ERROR,
        error: errMsg,
      });
      if (error.response.data && error.response.data.sectionType) {
        dispatch(updateErrorInSubSection(error.response.data.sectionType));
      }
    });
};

// GET Emp Profile Pic Action Dispatch
export const getEmpProfilePic = (filePath) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_EMPLOYEE_PROFILE_PIC_LOADING,
  });
  const apiUrl = `${CUST_MGMT}/${filePath}`;
  axios.get(apiUrl, { responseType: 'arraybuffer' })
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const image = URL.createObjectURL(blob);
        dispatch({
          type: actionTypes.GET_EMPLOYEE_PROFILE_PIC_SUCCESS,
          empProfilePic: image,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_EMPLOYEE_PROFILE_PIC_ERROR,
        error: errMsg,
      });
    });
};

// Remove Emp Profile Pic Action Dispatch
export const removeEmpProfilePic = () => (dispatch, getState) => {
  if (!_.isEmpty(getState().empMgmt.empOnboard.onboard.empProfilePic)) {
    dispatch({
      type: actionTypes.REMOVE_EMPLOYEE_PROFILE_PIC,
      empProfilePic: null,
    });
  }
};

// Get Emp Default Role Action Dispatch
export const getEmpDefaultRole = (defaultRole, defaultLoc) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_EMPLOYEE_DEFAULT_ROLE_LOADING,
  });
  const url = `${CUST_MGMT}/tag?tagId=${!_.isEmpty(defaultRole) ? defaultRole : defaultLoc}
  ${_.isEmpty(defaultRole) ? '' : (!_.isEmpty(defaultLoc) ? (`&tagId=${defaultLoc}`) : '')}`;
  axios.get(url)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        let empDefaultRole = null;
        let empDefaultLocation = null;
        _.forEach(response.data, (tag) => {
          if (tag.category === 'functional') empDefaultRole = _.cloneDeep(tag);
          if (tag.category === 'geographical') empDefaultLocation = _.cloneDeep(tag);
        });
        dispatch({
          type: actionTypes.GET_EMPLOYEE_DEFAULT_ROLE_SUCCESS,
          empDefaultRole,
          empDefaultLocation,
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
        type: actionTypes.GET_EMPLOYEE_DEFAULT_ROLE_ERROR,
        error: errMsg,
      });
    });
};

// Get Emp Reporting Manager Action Dispatch
export const getReportingManager = (orgId, empId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_EMPLOYEE_REPORTING_MANAGER_LOADING,
  });
  axios.get(`${CUST_MGMT}/org/${orgId}/employee/${empId}`)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_EMPLOYEE_REPORTING_MANAGER_SUCCESS,
          empReportingManager: response.data,
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
        type: actionTypes.GET_EMPLOYEE_REPORTING_MANAGER_ERROR,
        error: errMsg,
      });
    });
};

// Get Emp Data Action Dispatch
export const getEmpBgvDetails = (orgId, empId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_EMPLOYEE_BGV_DATA_LOADING,
  });
  axios.get(`${BGV_VERIFICATION}/org/${orgId}/employee/${empId}/report`)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch(getEmpMissingInfo(orgId, empId));
        dispatch({
          type: actionTypes.GET_EMPLOYEE_BGV_DATA_SUCCESS,
          bgvData: response.data.verifications,
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.GET_EMPLOYEE_BGV_DATA_ERROR,
        error,
      });
    });
};

export const getEmpMissingInfo = (orgId, empId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_EMP_MISSING_INFO_LOADING,
  });
  axios.get(`${BGV_VERIFICATION}/missing-info/${orgId}/${empId}`)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_EMP_MISSING_INFO_SUCCESS,
          empMissingInfo: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_EMP_MISSING_INFO_ERROR,
        error: errMsg,
      });
    });
};

// Get Static Data
export const getStaticDataList = () => {
  const staticData = _.cloneDeep(initData.staticData);
  return (dispatch) => {
    dispatch({
      type: actionTypes.GET_STATIC_DATA_LOADING,
    });
    axios.post(`${PLATFORM_SERVICES}/staticdata`, initData.data)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          _.forEach(response.data, (object) => {
            _.forEach(object, (value, key) => {
              staticData[key] = value;
            });
          });
          dispatch({
            type: actionTypes.GET_STATIC_DATA_SUCCESS,
            staticData,
          });
        }
      })
      .catch((error) => {
        let errMsg = error;
        if (error.response && error.response.data && error.response.data.errorMessage) {
          errMsg = error.response.data.errorMessage;
        }
        dispatch({
          type: actionTypes.GET_STATIC_DATA_ERROR,
          error: errMsg,
        });
      });
  };
};

// Generate Employee Documents
export const generateDocument = (orgId, empId, category, docType, data) => (dispatch) => {
  dispatch({
    type: actionTypes.GENERATE_DOCUMENT_LOADING,
  });
  const url = `${CUST_MGMT}/org/${orgId}/employee/${empId}/doc-generation?category=${category}&documentType=${docType}`;
  axios.post(url, data)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch(updateSectionStatus(response.data));
        dispatch({
          type: actionTypes.GENERATE_DOCUMENT_SUCCESS,
          data: response.data,
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
        type: actionTypes.GENERATE_DOCUMENT_ERROR,
        error: errMsg,
      });
    });
};

//  Save Employee Documents
export const saveDocument = (orgId, empId, category, docType, data) => (dispatch) => {
  dispatch({
    type: actionTypes.SAVE_DOCUMENT_LOADING,
  });
  const url = `${CUST_MGMT}/org/${orgId}/employee/${empId}/onboard-doc-save?category=${category}&documentType=${docType}`;
  axios.post(url, data)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        // dispatch(updateSectionStatus(response.data));
        dispatch(getEmpData(orgId, empId));
        dispatch({
          type: actionTypes.SAVE_DOCUMENT_SUCCESS,
          data: response.data,
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
        type: actionTypes.SAVE_DOCUMENT_ERROR,
        error: errMsg,
      });
    });
};

// Update Section Status Action Dispatch
export const updateSectionStatus = (empData) => (dispatch, getState) => {
  let updatedSectionStatus = {};
  if (_.isEmpty(empData)) {
    updatedSectionStatus = getSectionStatus(getState().empMgmt.empOnboard.onboard.empData);
  } else {
    updatedSectionStatus = getSectionStatus(empData);
  }
  dispatch({
    type: actionTypes.UPDATE_SECTION_STATUS,
    sectionStatus: updatedSectionStatus,
  });
};

// Update Sub-Section Progress Action Dispatch
export const updateSubSectionProgress = (sectionName, subSectionStatus) => (dispatch, getState) => {
  const updatedSectionStatus = _.cloneDeep(getState().empMgmt.empOnboard.onboard.sectionStatus);
  updatedSectionStatus[sectionName].subSectionStatus = subSectionStatus;
  dispatch({
    type: actionTypes.UPDATE_SECTION_STATUS,
    sectionStatus: updatedSectionStatus,
  });
};

// Update Sub-Section Error Action Dispatch
export const updateErrorInSubSection = (subSectionType) => {
  let subSectionName = null;
  switch (subSectionType) {
    case 'contacts': subSectionName = 'contactDetails'; break;
    case 'addresses': subSectionName = 'addresses'; break;
    case 'documents': subSectionName = 'governmentIds'; break;
    case 'familyRefs': subSectionName = 'familyRefs'; break;
    case 'educationDetails': subSectionName = 'educationDetails'; break;
    case 'workDetails': subSectionName = 'empHistory'; break;
    case 'healthDetails': subSectionName = 'healthDetails'; break;
    case 'skills': subSectionName = 'skillPref'; break;
    case 'preferences': subSectionName = 'skillPref'; break;
    case 'languages': subSectionName = 'skillPref'; break;
    case 'socialNetworks': subSectionName = 'socialNetworks'; break;
    case 'bankDetails': subSectionName = 'bankDetails'; break;
    default:
      break;
  }
  return (dispatch, getState) => {
    const updatedSectionStatus = _.cloneDeep(getState().empMgmt.empOnboard.onboard.sectionStatus);
    updatedSectionStatus.additionalDetails.subSectionStatus[subSectionName] = {
      ...updatedSectionStatus.additionalDetails.subSectionStatus[subSectionName],
      status: 'error',
    };
    dispatch({
      type: actionTypes.UPDATE_SECTION_STATUS,
      sectionStatus: updatedSectionStatus,
    });
  };
};

export const documentUpload = (folder, imageData) => (dispatch) => {
  dispatch({
    type: actionTypes.UPLOAD_DOCUMENT_LOADING,
    percentCompleted: 0,
  });

  const config = {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress(progressEvent) {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);

      dispatch({
        type: actionTypes.UPLOAD_DOCUMENT_LOADING,
        percentCompleted,
      });
    },
  };

  let url = `${CUST_MGMT}/file/upload`;
  if (folder) {
    url += `?folder=${folder}`;
  }
  axios.post(url, imageData, config)
    .then((response) => {
      dispatch({
        type: actionTypes.UPLOAD_DOCUMENT_SUCCESS,
        downloadURL: response.data.downloadURL,
      });
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.UPLOAD_DOCUMENT_ERROR,
        error: errMsg,
      });
    });
};

export const documentDownload = (fileURL) => (dispatch) => {
  dispatch({
    type: actionTypes.DOWNLOAD_DOCUMENT_LOADING,
  });

  const url = `${CUST_MGMT}/${fileURL}`;

  axios.get((url), { responseType: 'blob' })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data], {
        type: response.data.type,
      }));
      const link = document.createElement('a');

      let fileName = response.headers['content-disposition'].split(/foo/);
      fileName = fileName[0].split(' ');
      fileName = fileName[1].split('=');
      // fileName = fileName[1].split('.');

      link.href = url;
      link.setAttribute('download', fileName[1]);
      document.body.appendChild(link);
      link.click();

      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.DOWNLOAD_DOCUMENT_SUCCESS,
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
        type: actionTypes.DOWNLOAD_DOCUMENT_ERROR,
        error: errMsg,
      });
    });
};
