import axios from 'axios';
import * as actionTypes from './actionTypes';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

// get org data
// eslint-disable-next-line import/prefer-default-export
export const getOrgProfile = (orgId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_ORG_DATA_LOADING,
  });
  axios.get(`${CUST_MGMT}/org/${orgId}`)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_ORG_DATA_SUCCESS,
          data: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_ORG_DATA_ERROR,
        error: errMsg,
      });
    });
};
