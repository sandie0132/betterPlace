import axios from 'axios';
import _ from 'lodash';

import * as actionTypes from './actionTypes';
import { getSectionStatus } from './utility';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

//Init State Action Dispatch
export const initState = () => {
  return dispatch => {
    dispatch({
      type: actionTypes.INIT_STATE
    })
  };
};

export const getOnboardConfig = (orgId) => {
  return dispatch => {
    dispatch({
      type: actionTypes.GET_ORG_ONBOARD_CONFIG_LOADING
    })
    axios.get(CUST_MGMT + `/onboard/config/${orgId}`)
      .then(response => {
        if (response.status === 200 || response.status === 201) {
          dispatch(updateSectionStatus(response.data));
          dispatch({
            type: actionTypes.GET_ORG_ONBOARD_CONFIG_SUCCESS,
            data: response.data
          });
        }
      })
      .catch(error => {
        dispatch({
          type: actionTypes.GET_ORG_ONBOARD_CONFIG_ERROR,
          error: error
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
        }
      })
      .catch(error => {
        dispatch({
          type: actionTypes.POST_ORG_ONBOARD_CONFIG_ERROR,
          error: error
        });
      });
  };
}

//Update Section Status Action Dispatch
export const updateSectionStatus = (data) => {
  return (dispatch) => {
    let updatedSectionStatus = _.cloneDeep(getSectionStatus(data));
    dispatch({
      type: actionTypes.UPDATE_SECTION_STATUS,
      sectionStatus: updatedSectionStatus
    });
  };
};


//Get Document static data
export const getDocumentList = () => {
  return dispatch => {
    dispatch({
      type: actionTypes.GET_DOCUMENT_LIST_LOADING
    })
    axios.get(CUST_MGMT + `/onboard/config/options`)
      .then(response => {
        if (response.status === 200 || response.status === 201) {
          dispatch({
            type: actionTypes.GET_DOCUMENT_LIST_SUCCESS,
            data: response.data
          });
        }
      })
      .catch(error => {
        dispatch({
          type: actionTypes.GET_DOCUMENT_LIST_ERROR,
          error: error
        });
      });
  };
};


