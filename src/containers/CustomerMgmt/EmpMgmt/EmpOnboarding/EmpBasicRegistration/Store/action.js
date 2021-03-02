import axios from "axios";
import _ from 'lodash';

import * as actionTypes from './actionTypes';
import * as onboardActionTypes from '../../Store/actionTypes';
import * as onboardActions from '../../Store/action';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

//Init State Action Dispatch
export const initState = () => {
  return dispatch => {
    dispatch({
      type: actionTypes.INIT_STATE
    });
  };
};

//Post Data Action Dispatch
export const postEmpData = (data, orgId) => {
  return (dispatch) => {
    dispatch({
      type: actionTypes.POST_DATA_LOADING
    })
    axios.post(CUST_MGMT + `/org/${orgId}/employee`, data)
      .then(response => {
        if (response.status === 200 || response.status === 201) {
          dispatch({
            type: actionTypes.POST_DATA_SUCCESS,
            empId: response.data.uuid
          });
          dispatch(onboardActions.updateSectionStatus(response.data));
          if(!_.isEmpty(response.data['profilePicUrl'])){
            dispatch(onboardActions.getEmpProfilePic(response.data['profilePicUrl']));
          }
          dispatch({
            type: onboardActionTypes.GET_EMPLOYEE_DATA_SUCCESS,
            data: response.data
          });
        }
      })
      .catch(error => {
        let errMsg = error;
        if (error.response.data && error.response.data.errorMessage) {
          errMsg = error.response.data.errorMessage;
        }
        dispatch({
          type: actionTypes.POST_DATA_ERROR,
          error: errMsg
        });
      });
  };
};

// Profile Pic upload Action Dispatch
export const profilePicUpload = (folder, imageData) => {
  let config = {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  };
  return dispatch => {
    dispatch({
      type: actionTypes.GET_PROFILEPIC_LOADING
    });

    let url = CUST_MGMT + "/file/upload";
    if (folder) {
      url += "?folder=" + folder;
    }
    axios
      .post(url, imageData, config)
      .then(response => {
        dispatch({
          type: actionTypes.GET_PROFILEPIC_SUCCESS,
          profilePicUrl: response.data.downloadURL[0]
        });
      })
      .catch(error => {
        dispatch({
          type: actionTypes.GET_PROFILEPIC_ERROR,
          error: error
        });
      });
  };
};

export const profilePicDelete = (folder, fileName) => {
  return dispatch => {
    dispatch({
      type: actionTypes.DELETE_PROFILEPIC_LOADING
    });

    let url = CUST_MGMT + "/file/remove";
    if (folder) {
      url += "?folder=" + folder;
    }
    if (fileName) {
      url += "&fileName=" + fileName;
    }
    axios
      .delete(url)
      .then(response => {
        dispatch({
          type: actionTypes.DELETE_PROFILEPIC_SUCCESS,
          profilePicUrl: null
        });
      })
      .catch(error => {
        dispatch({
          type: actionTypes.DELETE_PROFILEPIC_ERROR,
          error: error
        });
      });
  };
};

export const FileUpload = (folder, imageData) => {
  let config = {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  };
  return dispatch => {
    dispatch({
      type: actionTypes.GET_CONSENT_LOADING
    });

    let url = CUST_MGMT + "/file/upload";
    if (folder) {
      url += "?folder=" + folder;
    }
    axios
      .post(url, imageData, config)
      .then(response => {
        dispatch({
          type: actionTypes.GET_CONSENT_SUCCESS,
          consentUrl: response.data.downloadURL[0]
        });
      })
      .catch(error => {
        dispatch({
          type: actionTypes.GET_CONSENT_ERROR,
          error: error
        });
      });
  };
};

export const FileDelete = (folder, fileName, files) => {
  return dispatch => {
    dispatch({
      type: actionTypes.DELETE_CONSENT_LOADING
    });

    let url = CUST_MGMT + "/file/remove";
    if (folder) {
      url += "?folder=" + folder;
    }
    if (fileName) {
      url += "&fileName=" + fileName;
    }
    axios
      .delete(url)
      .then(response => {
        dispatch({
          type: actionTypes.DELETE_CONSENT_SUCCESS,
          consentUrl: files
        });
      })
      .catch(error => {
        dispatch({
          type: actionTypes.DELETE_CONSENT_ERROR,
          error: error
        });
      });
  };
};

export const downloadFile = (folder, fileId) => {
  let fileName = fileId.split('/');
  fileName = fileName[fileName.length - 1];

  return dispatch => {
    dispatch({
      type: actionTypes.DOWNLOAD_FILE_LOADING
    })

    let url = CUST_MGMT + `/file/download/${folder}/${fileName}`;

    axios.get((url), {
      responseType: 'blob'
    })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: response.data.type }));
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
          })
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
          type: actionTypes.DOWNLOAD_FILE_ERROR,
          error: errMsg
        });
      });
  };
}

export const downloadConsentPolicy = () => {
  return dispatch => {
    dispatch({
      type: actionTypes.DOWNLOAD_CONSENT_POLICY_LOADING
    })

    let url = CUST_MGMT + `/employee/consent/download`;
    axios.get((url), {
      responseType: 'blob'
    })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: response.data.type }));
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
            type: actionTypes.DOWNLOAD_CONSENT_POLICY_SUCCESS,
          })
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
          type: actionTypes.DOWNLOAD_CONSENT_POLICY_ERROR,
          error: errMsg
        });
      });
  };
}

//GET Emp Profile Pic Action Dispatch
export const getEmpProfilePic = (filePath) => {
  return (dispatch) => {
    dispatch({
      type: actionTypes.GET_EMPLOYEE_PROFILE_PIC_LOADING,
    })
    let apiUrl = CUST_MGMT + '/' + filePath;
    axios.get(apiUrl, { responseType: 'arraybuffer' })
      .then(response => {
        if (response.status === 200 || response.status === 201) {
          let blob = new Blob([response.data], { type: response.headers['content-type'] });
          let image = URL.createObjectURL(blob);
          dispatch({
            type: actionTypes.GET_EMPLOYEE_PROFILE_PIC_SUCCESS,
            empProfilePic: image,
          });
        }
      })
      .catch(error => {
        let errMsg = error;
        if (error.response && error.response.data.errorMessage) {
          errMsg = error.response.data.errorMessage;
        }
        dispatch({
          type: actionTypes.GET_EMPLOYEE_PROFILE_PIC_ERROR,
          error: errMsg
        });
      });
  }
}