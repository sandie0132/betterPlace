import axios from "axios";
// import _ from 'lodash';

import * as actionTypes from './actionTypes';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

//Init State Action Dispatch
export const initState = () => {
  return dispatch => {
    dispatch({
      type: actionTypes.INIT_STATE
    });
  };
};

export const signatureUpload = (folder, imageData, signatureType) => {
  return dispatch => {
    dispatch({
      type: actionTypes.UPLOAD_SIGNATURE_LOADING,
      percentCompleted: 0,
      signatureType: signatureType
    });

    let config = {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: function (progressEvent) {
        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);

        dispatch({
          type: actionTypes.UPLOAD_SIGNATURE_LOADING,
          percentCompleted: percentCompleted,
          signatureType: signatureType
        })
      }
    };

    let url = CUST_MGMT + "/file/upload";
    if (folder) {
      url += "?folder=" + folder;
    }
    axios
      .post(url, imageData, config)
      .then(response => {
        dispatch({
          type: actionTypes.UPLOAD_SIGNATURE_SUCCESS,
          signatureURL: response.data.downloadURL[0],
          signatureType: signatureType
        });

        if (signatureType === "preview") {
          dispatch(getSignature(response.data.downloadURL[0]))
        }

      })
      .catch(error => {
        let errMsg = error;
        if (error.response.data && error.response.data.errorMessage) {
          errMsg = error.response.data.errorMessage;
        } else {
          errMsg = error.message
        }
        dispatch({
          type: actionTypes.UPLOAD_SIGNATURE_ERROR,
          error: errMsg,
          signatureType: signatureType
        });
      });
  }
}

export const getSignature = (filePath) => {
  return (dispatch) => {
    dispatch({
      type: actionTypes.DOWNLOAD_SIGNATURE_LOADING,
    })
    let apiUrl = CUST_MGMT + '/' + filePath;
    axios.get(apiUrl, { responseType: 'arraybuffer' })
      .then(response => {
        if (response.status === 200 || response.status === 201) {
          let blob = new Blob([response.data], { type: response.headers['content-type'] });
          let image = URL.createObjectURL(blob);
          dispatch({
            type: actionTypes.DOWNLOAD_SIGNATURE_SUCCESS,
            empSignature: image,
          });
        }
      })
      .catch(error => {
        let errMsg = error;
        if (error.response && error.response.data.errorMessage) {
          errMsg = error.response.data.errorMessage;
        }
        dispatch({
          type: actionTypes.DOWNLOAD_SIGNATURE_ERROR,
          error: errMsg
        });
      });
  }
}

