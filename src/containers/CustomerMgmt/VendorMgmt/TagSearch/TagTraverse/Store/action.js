/* eslint-disable max-len */
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

// Get TagList Action Dispatch
export const getTagTraverse = (orgId, category, clientId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_TAG_TRAVERSE_LOADING,
  });
  axios.get(`${CUST_MGMT}/org/${orgId}/client/${clientId}/tag?category=${category}`)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        const updatedTagData = _.cloneDeep(response.data);
        const updatedTagArray = [{
          selectedId: null,
          selectedTag: null,
          tagId: null,
          tagType: !_.isEmpty(updatedTagData[0]) ? updatedTagData[0].tagType : '',
          tagList: !_.isEmpty(updatedTagData[0]) ? _.cloneDeep(updatedTagData[0].tagList) : '',
        }];
        dispatch({
          type: actionTypes.GET_TAG_TRAVERSE_SUCCESS,
          tagsArray: updatedTagArray,
          tagData: updatedTagData,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_TAG_TRAVERSE_ERROR,
        error: errMsg,
      });
    });
};
