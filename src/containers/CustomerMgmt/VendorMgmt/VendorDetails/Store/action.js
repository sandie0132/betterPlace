/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-shadow */
import axios from 'axios';
import * as actionTypes from './actionTypes';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

export const initState = () => (dispatch) => {
  dispatch({
    type: actionTypes.GET_INIT_STATE,
  });
};

export const getVendorData = (clientId, vendorId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_DATA_LOADING,
  });
  const url = `${CUST_MGMT}/org/${clientId}/vendor/${vendorId}`;

  axios.get(url)
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
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_DATA_ERROR,
        error: errMsg,
      });
    });
};

export const postVendorData = (orgId, data, updateData) => (dispatch) => {
  dispatch({
    type: actionTypes.POST_DATA_LOADING,
  });
  axios.post(`${CUST_MGMT}/org/${orgId}/vendor`, data)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.POST_DATA_SUCCESS,
          data: { ...updateData, _id: response.data._id, status: 'pendingapproval' },
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.POST_DATA_ERROR,
        error: errMsg,
      });
    });
};

export const fileUpload = (type, file) => {
  const config = { headers: { 'Content-Type': 'multipart/form-data' } };
  return (dispatch) => {
    dispatch({
      type: actionTypes.GET_AGREEMENT_LOADING,
    });

    let url = `${CUST_MGMT}/file/upload`;
    if (type) {
      url += `?folder=${type}`;
    }
    axios.post(url, file, config)
      .then((response) => {
        dispatch({
          type: actionTypes.GET_AGREEMENT_SUCCESS,
          agreementUrl: response.data.downloadURL,
        });
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.GET_AGREEMENT_ERROR,
          error,
        });
      });
  };
};

export const deleteFile = (type, file) => (dispatch, getState) => {
  dispatch({
    type: actionTypes.DELETE_AGREEMENT_LOADING,
  });

  let url = `${CUST_MGMT}/file/remove?`;
  if (type) {
    url += `folder=${type}`;
  }
  if (file) {
    url += `&fileName=${file}`;
  }
  axios.delete(url)
    .then((response) => {
      dispatch({
        type: actionTypes.DELETE_AGREEMENT_SUCCESS,
      });
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.DELETE_AGREEMENT_ERROR,
        error,
      });
    });
};

export const getOrgName = (orgId) => (dispatch) => {
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

export const putVendorData = (clientId, vendorId, data, updateData) => (dispatch) => {
  dispatch({
    type: actionTypes.PUT_VENDOR_DATA_LOADING,
  });
  const url = `${CUST_MGMT}/org/${clientId}/vendor/${vendorId}`;

  axios.put(url, data)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.PUT_VENDOR_DATA_SUCCESS,
          data: updateData,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.PUT_VENDOR_DATA_ERROR,
        error: errMsg,
      });
    });
};

export const getVendorContacts = (orgId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_VENDOR_CONTACTS_LOADING,
  });
  axios.get(`${CUST_MGMT}/org/${orgId}/contactperson`)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_VENDOR_CONTACTS_SUCCESS,
          vendorContactsList: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_VENDOR_CONTACTS_ERROR,
        error: errMsg,
      });
    });
};
