import axios from 'axios';
// import _ from 'lodash';

import * as actionTypes from './actionTypes';
import * as actionTypesOnboard from '../../Store/actionTypes';

import { updateSectionStatus } from '../../Store/action'; 

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;


//Init State Action Dispatch
export const initState = () => {
    return dispatch => {
      dispatch({
        type: actionTypes.INIT_STATE
      })
    };
  };

  ///set current document type
export const setCurrentDocument = (documentType, documentLabel) =>{

  return dispatch => {
    dispatch({
      type: actionTypes.SET_CURRENT_DOCUMENT,
      currentDocument: documentType,
      documentLabel: documentLabel
    })
  };
}

///reset current document type 
export const resetCurrentDocument = () =>{

  return dispatch => {
    dispatch({
      type: actionTypes.RESET_CURRENT_DOCUMENT,
    })
  };
}

  


export const FileUpload = (folder, imageData) => {
    return dispatch => {
      dispatch({
        type: actionTypes.UPLOAD_ORG_ONBOARD_DOCUMENT_LOADING,
        percentCompleted: 0
      });
  
      let config = {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: function (progressEvent) {
          let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
  
          dispatch({
            type: actionTypes.UPLOAD_ORG_ONBOARD_DOCUMENT_LOADING,
            percentCompleted: percentCompleted
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
            type: actionTypes.UPLOAD_ORG_ONBOARD_DOCUMENT_SUCCESS,
            downloadURL: response.data.downloadURL
          });
        })
        .catch(error => {
          let errMsg = error;
          if (error.response.data && error.response.data.errorMessage) {
            errMsg = error.response.data.errorMessage;
          } else {
            errMsg = error.message
          }
          dispatch({
            type: actionTypes.UPLOAD_ORG_ONBOARD_DOCUMENT_ERROR,
            error: errMsg
          });
        });
    }
  }

  
  export const fileProcess = (orgId, url, documentType) => {
    return dispatch => {
  
      dispatch({
        type: actionTypes.FILE_PROCESS_LOADING,
      
      });
  
      let payload = {
        downloadURL: url
      }
  
      axios.post(CUST_MGMT + "/onboard/config/" + orgId + "/process/" + documentType, payload)
        .then(response => {
          if (response.status === 200 || response.status === 201) {
            dispatch({
              type: actionTypes.FILE_PROCESS_SUCCESS,
              data: response.data
            });

            dispatch({
              type: actionTypesOnboard.POST_ORG_ONBOARD_CONFIG_SUCCESS,
              data: response.data
            });
  
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
            type: actionTypes.FILE_PROCESS_ERROR,
            error: errMsg
          });
        });
  
    }
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
         // fileName = fileName[1].split('.');
  
          link.href = url;
          link.setAttribute('download', fileName[1]);
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


export const postOnboardConfig = (orgId, config) => {
  return dispatch => {
    dispatch({
      type: actionTypes.POST_ORG_ONBOARD_CONFIG_LOADING
    })
    axios.post(CUST_MGMT + `/onboard/config/${orgId}`, config)
      .then(response => {
        if (response.status === 200 || response.status === 201) {
           dispatch(updateSectionStatus(response.data));

          dispatch({
            type: actionTypes.POST_ORG_ONBOARD_CONFIG_SUCCESS,
            data: response.data
          });

          dispatch({
            type: actionTypesOnboard.POST_ORG_ONBOARD_CONFIG_SUCCESS,
            data: response.data
          });
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
          type: actionTypes.POST_ORG_ONBOARD_CONFIG_ERROR,
          error: errMsg
        });
      });
  };
}

export const downloadTemplate = (type) => {
  
  return dispatch => {
    dispatch({
      type: actionTypes.DOWNLOAD_TEMPLATE_FILE_LOADING
    })

    let url = CUST_MGMT + `/onboard/config/download?documentType=${type}`

    axios.get((url), {
      responseType: 'blob'
    })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: response.data.type }));
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
            type: actionTypes.DOWNLOAD_TEMPLATE_FILE_SUCCESS,
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
          type: actionTypes.DOWNLOAD_TEMPLATE_FILE_ERROR,
          error: errMsg
        });
      });
  };
}


// //Update Section Status Action Dispatch
// export const updateSectionStatus = (data) => {
//   return (dispatch, getState) => {
//     let updatedSectionStatus = getState().orgMgmt.orgOnboardConfig.onboardConfig.sectionStatus;
//     if (!_.isEmpty(data)) {
//       updatedSectionStatus.selectDocuments.status = 'done';
//     }
//     dispatch({
//       type: actionTypes.UPDATE_SECTION_STATUS,
//       sectionStatus: updatedSectionStatus
//     });
//   };
// };

  