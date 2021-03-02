import _ from 'lodash';
import axios from 'axios';
import * as actionTypes from './actionTypes';

const CUSTOMER_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

// eslint-disable-next-line import/prefer-default-export
export const getTagName = (tagIdList) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_FILTER_TAG_MAP_LIST_LOADING,
  });
  let url = `${CUSTOMER_MGMT}/tag?`;
  _.forEach(tagIdList, (tagId, index) => {
    if (index === tagIdList.length - 1) url += `tagId=${tagId}`;
    else url = `${url}tagId=${tagId}&`;
  });
  axios.get(url)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_FILTER_TAG_MAP_LIST_SUCCESS,
          TagInfoData: response.data,
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
        type: actionTypes.GET_FILTER_TAG_MAP_LIST_ERROR,
        error: errMsg,
      });
    });
};
