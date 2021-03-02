/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import _ from 'lodash';
import * as actionTypes from './actionTypes';

const CUST_MGMT = process.env.REACT_APP_CUSTOMER_MGMT_API_URL;

export const initState = () => (dispatch) => {
  dispatch({
    type: actionTypes.INIT_VENDOR_PROFILE_STATE,
  });
};

export const getOverallInsights = (orgId, vendorId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_VENDOR_OVERALL_INSIGHTS_LOADING,
  });
  axios.get(`${CUST_MGMT}/from/${orgId}/to/${vendorId}/insight/count`)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_VENDOR_OVERALL_INSIGHTS_SUCCESS,
          insightsData: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_VENDOR_OVERALL_INSIGHTS_ERROR,
        error: errMsg,
      });
    });
};

export const getAssignedClientsCount = (orgId, vendorId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_VENDOR_ASSIGNED_CLIENTS_COUNT_LOADING,
    orgId,
  });
  axios.get(`${CUST_MGMT}/from/${orgId}/to/${vendorId}/insight/clients?isCount=true`)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_VENDOR_ASSIGNED_CLIENTS_COUNT_SUCCESS,
          assignedClientsCount: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_VENDOR_ASSIGNED_CLIENTS_COUNT_ERROR,
        error: errMsg,
      });
    });
};

export const getAssignedClients = (orgId, vendorId, orgDetails) => (dispatch) => {
  let updatedOrgDetails = {}; // to get same client name in client tags dropdown as well
  if (!_.isEmpty(orgDetails)) {
    updatedOrgDetails = {
      brandColor: orgDetails.brandColor,
      legalName: orgDetails.legalName,
      name: orgDetails.orgName,
      orgId: orgDetails.orgId,
      roles: 0,
      sites: 0,
      status: orgDetails.status,
      vendorId: orgDetails.vendorId,
      _id: orgDetails._id,
    };
  }
  dispatch({
    type: actionTypes.GET_VENDOR_ASSIGNED_CLIENTS_LOADING,
    orgId,
  });
  axios.get(`${CUST_MGMT}/from/${orgId}/to/${vendorId}/insight/clients`)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_VENDOR_ASSIGNED_CLIENTS_SUCCESS,
          assignedClients: !_.isEmpty(updatedOrgDetails) ? [updatedOrgDetails, ...response.data]
            : response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_VENDOR_ASSIGNED_CLIENTS_ERROR,
        error: errMsg,
      });
    });
};

export const getAssociatedVendorsCount = (orgId, vendorId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_ASSOCIATED_VENDORS_COUNT_LOADING,
    orgId,
  });
  axios.get(`${CUST_MGMT}/from/${vendorId}/orgId/${orgId}/insight/vendors?isCount=true`)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_ASSOCIATED_VENDORS_COUNT_SUCCESS,
          associatedVendorsCount: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_ASSOCIATED_VENDORS_COUNT_ERROR,
        error: errMsg,
      });
    });
};

export const getAssociatedVendors = (orgId, vendorId) => (dispatch) => {
  dispatch({
    type: actionTypes.GET_ASSOCIATED_VENDORS_LOADING,
    orgId,
  });
  axios.get(`${CUST_MGMT}/from/${vendorId}/orgId/${orgId}/insight/vendors`)
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        dispatch({
          type: actionTypes.GET_ASSOCIATED_VENDORS_SUCCESS,
          associatedVendors: response.data,
        });
      }
    })
    .catch((error) => {
      let errMsg = error;
      if (error.response && error.response.data && error.response.data.errorMessage) {
        errMsg = error.response.data.errorMessage;
      }
      dispatch({
        type: actionTypes.GET_ASSOCIATED_VENDORS_ERROR,
        error: errMsg,
      });
    });
};

// export const getVendorOrgDataById = (orgId) => (dispatch) => {
//   dispatch({
//     type: actionTypes.GET_VENDOR_DATA_BY_ID_LOADING,
//     orgId,
//   });
//   axios.get(`${CUST_MGMT}/org/${orgId}`)
//     .then((response) => {
//       if (response.status === 200 || response.status === 201) {
//         dispatch({
//           type: actionTypes.GET_VENDOR_DATA_BY_ID_SUCCESS,
//           data: response.data,
//         });
//       }
//     })
//     .catch((error) => {
//       let errMsg = error;
//       if (error.response && error.response.data && error.response.data.errorMessage) {
//         errMsg = error.response.data.errorMessage;
//       }
//       dispatch({
//         type: actionTypes.GET_VENDOR_DATA_BY_ID_ERROR,
//         error: errMsg,
//       });
//     });
// };
