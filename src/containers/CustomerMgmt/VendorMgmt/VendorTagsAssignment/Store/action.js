import axios from 'axios';
import * as actionTypes from './actionTypes';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

export const initState = () => (dispatch) => {
  dispatch({
    type: actionTypes.INIT_VENDOR_TAGS_STATE,
  });
};

// eslint-disable-next-line max-len
export const postAssignedTags = (orgId, vendorId, selectedTags, orgName) => (dispatch) => {
  dispatch({
    type: actionTypes.POST_ASSIGN_VENDOR_TAGS_LOADING,
  });
  axios.post(`${CUST_MGMT}/org/${orgId}/vendor/${vendorId}/share_tags`, selectedTags)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.POST_ASSIGN_VENDOR_TAGS_SUCCESS,
          selectedClient: { orgId: selectedTags.clientId, name: orgName },
          assignedTags: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.POST_ASSIGN_VENDOR_TAGS_ERROR,
        error: errMsg,
      });
    });
};
