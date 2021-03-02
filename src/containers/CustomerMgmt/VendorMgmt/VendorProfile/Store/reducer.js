import * as actionTypes from './actionTypes';
import updateObject from '../../VendorMgmtStore/utility';

const initialState = {
//   getVendorOrgDataState: 'INIT',
//   vendorOrgData: {},
  insightsData: null,
  insightsDataState: 'INIT',
  assignedClientsCount: 0,
  assignedClientsCountState: 'INIT',
  assignedClients: null,
  assignedClientsState: 'INIT',
  associatedVendorsCount: 0,
  associatedVendorsCountState: 'INIT',
  associatedVendors: null,
  associatedVendorsState: 'INIT',
};

const initState = () => initialState;

const getVendorOverallInsightsLoading = (state) => updateObject(state, {
  insightsDataState: 'LOADING',
});

const getVendorOverallInsightsSuccess = (state, action) => updateObject(state, {
  insightsDataState: 'SUCCESS',
  insightsData: action.insightsData,
  error: null,
});

const getVendorOverallInsightsError = (state, action) => updateObject(state, {
  insightsDataState: 'ERROR',
  error: action.error,
});

const getVendorAssignedClientsCountLoading = (state) => updateObject(state, {
  assignedClientsCountState: 'LOADING',
});

const getVendorAssignedClientsCountSuccess = (state, action) => updateObject(state, {
  assignedClientsCountState: 'SUCCESS',
  assignedClientsCount: action.assignedClientsCount,
  error: null,
});

const getVendorAssignedClientsCountError = (state, action) => updateObject(state, {
  assignedClientsCountState: 'ERROR',
  error: action.error,
});

const getVendorAssignedClientsLoading = (state) => updateObject(state, {
  assignedClientsState: 'LOADING',
});

const getVendorAssignedClientsSuccess = (state, action) => updateObject(state, {
  assignedClientsState: 'SUCCESS',
  assignedClients: action.assignedClients,
  error: null,
});

const getVendorAssignedClientsError = (state, action) => updateObject(state, {
  assignedClientsState: 'ERROR',
  error: action.error,
});

const getAssociatedVendorsCountLoading = (state) => updateObject(state, {
  associatedVendorsCountState: 'LOADING',
});

const getAssociatedVendorsCountSuccess = (state, action) => updateObject(state, {
  associatedVendorsCountState: 'SUCCESS',
  associatedVendorsCount: action.associatedVendorsCount,
  error: null,
});

const getAssociatedVendorsCountError = (state, action) => updateObject(state, {
  associatedVendorsCountState: 'ERROR',
  error: action.error,
});

const getAssociatedVendorsLoading = (state) => updateObject(state, {
  associatedVendorsState: 'LOADING',
});

const getAssociatedVendorsSuccess = (state, action) => updateObject(state, {
  associatedVendorsState: 'SUCCESS',
  associatedVendors: action.associatedVendors,
  error: null,
});

const getAssociatedVendorsError = (state, action) => updateObject(state, {
  associatedVendorsState: 'ERROR',
  error: action.error,
});

// const getVendorOrgDataByIdLoading = (state) => updateObject(state, {
//   getVendorDataState: 'LOADING',
// });

// const getVendorOrgDataByIdSuccess = (state, action) => updateObject(state, {
//   getVendorDataState: 'SUCCESS',
//   vendorOrgData: action.data,
//   error: null,
// });

// const getVendorOrgDataByIdError = (state, action) => updateObject(state, {
//   getVendorDataState: 'ERROR',
//   error: action.error,
// });

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INIT_VENDOR_PROFILE_STATE: return initState();

    case actionTypes.GET_VENDOR_OVERALL_INSIGHTS_LOADING:
      return getVendorOverallInsightsLoading(state, action);
    case actionTypes.GET_VENDOR_OVERALL_INSIGHTS_SUCCESS:
      return getVendorOverallInsightsSuccess(state, action);
    case actionTypes.GET_VENDOR_OVERALL_INSIGHTS_ERROR:
      return getVendorOverallInsightsError(state, action);

    case actionTypes.GET_VENDOR_ASSIGNED_CLIENTS_COUNT_LOADING:
      return getVendorAssignedClientsCountLoading(state, action);
    case actionTypes.GET_VENDOR_ASSIGNED_CLIENTS_COUNT_SUCCESS:
      return getVendorAssignedClientsCountSuccess(state, action);
    case actionTypes.GET_VENDOR_ASSIGNED_CLIENTS_COUNT_ERROR:
      return getVendorAssignedClientsCountError(state, action);

    case actionTypes.GET_VENDOR_ASSIGNED_CLIENTS_LOADING:
      return getVendorAssignedClientsLoading(state, action);
    case actionTypes.GET_VENDOR_ASSIGNED_CLIENTS_SUCCESS:
      return getVendorAssignedClientsSuccess(state, action);
    case actionTypes.GET_VENDOR_ASSIGNED_CLIENTS_ERROR:
      return getVendorAssignedClientsError(state, action);

    case actionTypes.GET_ASSOCIATED_VENDORS_COUNT_LOADING:
      return getAssociatedVendorsCountLoading(state, action);
    case actionTypes.GET_ASSOCIATED_VENDORS_COUNT_SUCCESS:
      return getAssociatedVendorsCountSuccess(state, action);
    case actionTypes.GET_ASSOCIATED_VENDORS_COUNT_ERROR:
      return getAssociatedVendorsCountError(state, action);

    case actionTypes.GET_ASSOCIATED_VENDORS_LOADING:
      return getAssociatedVendorsLoading(state, action);
    case actionTypes.GET_ASSOCIATED_VENDORS_SUCCESS:
      return getAssociatedVendorsSuccess(state, action);
    case actionTypes.GET_ASSOCIATED_VENDORS_ERROR:
      return getAssociatedVendorsError(state, action);

      // case actionTypes.GET_VENDOR_DATA_BY_ID_LOADING:
      //   return getVendorOrgDataByIdLoading(state, action);
      // case actionTypes.GET_VENDOR_DATA_BY_ID_SUCCESS:
      //   return getVendorOrgDataByIdSuccess(state, action);
      // case actionTypes.GET_VENDOR_DATA_BY_ID_ERROR:
      //   return getVendorOrgDataByIdError(state, action);

    default: return state;
  }
};

export default reducer;
