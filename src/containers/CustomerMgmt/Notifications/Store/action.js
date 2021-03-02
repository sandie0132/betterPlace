import axios from 'axios';
import _ from 'lodash';
import * as actionTypes from './actionTypes';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;
const PLATFORM_URL = process.env.REACT_APP_PLATFORM_API_URL;
const BGV_VERIFICATION_URL = process.env.REACT_APP_BGV_VERIFICATION_URL;
const EXCEL_UPLOAD_URL = process.env.REACT_APP_EXCEL_UPLOAD;
const BGV_VERIFY_REPORT = process.env.REACT_APP_BGV_VERIFY_REPORT;

// get notification
export const getNotificationList = (orgId, query) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_NOTIFICATION_LIST_LOADING,
  });
  let apiUrl = `${PLATFORM_URL}/notifications/${orgId}`;

  if (!_.isEmpty(query)) {
    const urlSearchParams = new URLSearchParams();
    _.forEach(query, (val, param) => {
      if (!_.isEmpty(val)) {
        urlSearchParams.set(param, val);
      }
    });
    if (!_.isEmpty(urlSearchParams.toString())) {
      apiUrl = `${apiUrl}?${urlSearchParams}`;
    }
  }

  axios.get(apiUrl)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_NOTIFICATION_LIST_SUCCESS,
          notificationList: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_NOTIFICATION_LIST_ERROR,
        error: errMsg,
      });
    });
};

// close notifications
export const closeNotification = (orgId, notificationId, name) => (dispatch) => {
  dispatch({
    type: actionTypes.NOTIFICATION_CLOSE_LOADING,
  });
  let url = `${PLATFORM_URL}/notifications/${orgId}/close`;
  if (!_.isEmpty(notificationId)) url += `?id=${notificationId}`;
  else if (!_.isEmpty(name)) url += `?name=${name}`;
  axios.put(url)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.NOTIFICATION_CLOSE_SUCCESS,
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
        type: actionTypes.NOTIFICATION_CLOSE_ERROR,
        error: errMsg,
      });
    });
};

// download cust-mgmt files
export const downloadCustMgmtFile = (orgId, notificationId,
  downloadUrl, empCount) => (dispatch) => {
  dispatch({
    type: actionTypes.NOTIFICATION_DOWNLOAD_CUST_MGMT_FILE_LOADING,
  });

  const axiosUrl = `${CUST_MGMT}/${downloadUrl}`;

  axios.get((axiosUrl), {
    responseType: 'blob',
  })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data],
        { type: response.data.type }));
      const link = document.createElement('a');

      // let fileName = response.headers['content-disposition'].split(/foo/);
      // fileName = fileName[0].split(' ');
      // fileName = fileName[1].split('=');
      // fileName = fileName[1].split('.');
      link.href = url;
      link.setAttribute('download', `employees_list_${empCount}.xlsx`);
      // link.setAttribute('download', `${fileName[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();

      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.NOTIFICATION_DOWNLOAD_CUST_MGMT_FILE_SUCCESS,
        });
        // dispatch(closeNotification(orgId, notificationId));
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
        type: actionTypes.NOTIFICATION_DOWNLOAD_CUST_MGMT_FILE_ERROR,
        error: errMsg,
      });
    });
  // dispatch(closeNotification(orgId, notificationId));
};

// download bgv-report files
export const downloadBgvReportFile = (orgId, notificationId,
  downloadUrl, fileName) => (dispatch) => {
  dispatch({
    type: actionTypes.NOTIFICATION_DOWNLOAD_BGV_REPORT_FILE_LOADING,
  });

  const axiosUrl = `${BGV_VERIFY_REPORT}/${downloadUrl}`;

  axios.get((axiosUrl), {
    responseType: 'blob',
  })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data],
        { type: response.data.type }));
      const link = document.createElement('a');

      // let fileName = response.headers['content-disposition'].split(/foo/);
      // fileName = fileName[0].split(' ');
      // fileName = fileName[1].split('=');
      // fileName = fileName[1].split('.');

      link.href = url;
      if (downloadUrl.includes('xlsx')) {
        link.setAttribute('download', `${fileName}.xlsx`);
      } else if (downloadUrl.includes('zip')) {
        link.setAttribute('download', `${fileName}.zip`);
      }
      document.body.appendChild(link);
      link.click();

      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.NOTIFICATION_DOWNLOAD_BGV_REPORT_FILE_SUCCESS,
        });
        // dispatch(closeNotification(orgId, notificationId));
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
        type: actionTypes.NOTIFICATION_DOWNLOAD_BGV_REPORT_FILE_ERROR,
        error: errMsg,
      });
    });
  // dispatch(closeNotification(orgId, notificationId));
};

// re-Initiate for employees whose verification is expired or verification details updated
export const reInitiateAll = (orgId, actionType, name) => (dispatch) => {
  dispatch({
    type: actionTypes.POST_REINITIATE_ALL_LOADING,
  });
  axios.post(`${BGV_VERIFICATION_URL}/reinitiateAll/${orgId}/${actionType}?notificationType=${name}`)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.POST_REINITIATE_ALL_SUCCESS,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.POST_REINITIATE_ALL_ERROR,
        error: errMsg,
      });
    });
};

export const downloadReinitiateList = (orgId, name) => (dispatch) => {
  dispatch({
    type: actionTypes.DOWNLOAD_REINITIATE_LIST_LOADING,
  });
  axios.get((`${EXCEL_UPLOAD_URL}/download/reinitiate/${orgId}/${name}`), {
    responseType: 'blob',
  })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data],
        { type: response.data.type }));
      const link = document.createElement('a');

      let fileName = response.headers['content-disposition'].split(/foo/);

      fileName = fileName[0].split(' ');
      fileName = fileName[1].split('=');

      link.href = url;
      link.setAttribute('download', `${fileName[1]}.xlsx`);
      document.body.appendChild(link);
      link.click();

      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.DOWNLOAD_REINITIATE_LIST_SUCCESS,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.DOWNLOAD_REINITIATE_LIST_ERROR,
        error: errMsg,
      });
    });
};

export const updateVendorApprovalReq = (payload, orgId, clientId) => (dispatch) => {
  dispatch({
    type: actionTypes.UPDATE_VENDOR_APPROVAL_REQ_LOADING,
    orgId,
  });
  axios.put(`${CUST_MGMT}/org/${orgId}/client/${clientId}`, payload)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.UPDATE_VENDOR_APPROVAL_REQ_SUCCESS,
        });
        const query = {
          platformService: 'VENDOR',
        };
        dispatch(getNotificationList(orgId, query));
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.UPDATE_VENDOR_APPROVAL_REQ_ERROR,
        error: errMsg,
      });
    });
};
