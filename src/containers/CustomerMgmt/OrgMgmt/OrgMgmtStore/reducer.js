import { combineReducers } from 'redux';
import * as actionTypes from './actionTypes';
import { updateObject } from './utility';
import orgAddressReducer from '../OrgAddress/Store/reducer';
import orgContactReducer from '../OrgContact/Store/reducer';
import orgDetailsReducer from '../OrgDetails/Store/reducer';
import orgListReducer from '../OrgList/Store/reducer';
import orgProfileReducer from '../OrgProfile/Store/reducer';
import orgAccessReducer from '../OrgAccessManagement/Store/reducer';
import * as initData from './StaticDataInitData';
import orgDocumentsReducer from '../OrgDocuments/Store/reducer';
import orgBgvConfigReducer from '../OrgBgvConfig/Store/reducer';
import orgOpsConfigReducer from '../OrgOpsConfig/Store/reducer';
import orgOnboardReducer from '../OrgOnboarding/Store/reducer';
import orgClientListReducer from '../OrgClient/OrgClientList/Store/reducer';
import orgClientDetailsReducer from '../OrgClient/OrgClientDetails/Store/reducer';
import orgBgvDashboardReducer from '../OrgBgvDashboard/Store/reducer';
import orgOnboardConfigReducer from '../OrgOnboardConfig/Store/reducer';
import orgOnboardDashboardReducer from '../OrgOnboardDashboard/Store/reducer';
import orgAttendConfigReducer from '../OrgAttendConfig/Store/reducer';
import orgAttendDashboardReducer from '../OrgAttendDashboard/Store/reducer';

const initialState = {
  getDataState: 'INIT',
  getServicesEnabledState: 'INIT',
  servicesEnabled: null,
  orgMgmtStaticData: { ...initData.orgMgmtStaticData },
  error: null,
  getOrgDataState: 'INIT',
  rightnavOrgId: null,
  orgData: null,
};

// INIT STATE REDUCERS
const initState = () => initialState;

// GET STATIC DATA REDUCERS
const getDataListLoading = (state) => updateObject(state, {
  getDataState: 'LOADING',
});
const getDataListSuccess = (state, action) => updateObject(state, {
  getDataState: 'SUCCESS',
  orgMgmtStaticData: action.staticData,
  error: null,
});

const getDataListError = (state, action) => updateObject(state, {
  getDataState: 'ERROR',
  error: action.error,
});

// GET ORG DETAILS REDUCERS
const getDataLoading = (state, action) => updateObject(state, {
  getOrgDataState: 'LOADING',
  rightnavOrgId: action.orgId,
});

const getDataSuccess = (state, action) => updateObject(state, {
  getOrgDataState: 'SUCCESS',
  orgData: action.data,
  error: null,
});

const getDataError = (state, action) => updateObject(state, {
  getOrgDataState: 'ERROR',
  error: action.error,
});

// GET ORG PLATFORM SERVICES REDUCERS
const getServicesEnabledLoading = (state) => updateObject(state, {
  getServicesEnabledState: 'LOADING',
});

const getServicesEnabledSuccess = (state, action) => updateObject(state, {
  getServicesEnabledState: 'SUCCESS',
  servicesEnabled: action.servicesEnabled,
  error: null,
});

const getServicesEnabledError = (state, action) => updateObject(state, {
  getServicesEnabledState: 'ERROR',
  error: action.error,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INIT_STATE: return initState();
    case actionTypes.GET_DATA_LIST_LOADING: return getDataListLoading(state, action);
    case actionTypes.GET_DATA_LIST_SUCCESS: return getDataListSuccess(state, action);
    case actionTypes.GET_DATA_LIST_ERROR: return getDataListError(state, action);

    case actionTypes.GET_DATA_LOADING: return getDataLoading(state, action);
    case actionTypes.GET_DATA_SUCCESS: return getDataSuccess(state, action);
    case actionTypes.GET_DATA_ERROR: return getDataError(state, action);

    case actionTypes.GET_SERVICES_ENABLED_LOADING: return getServicesEnabledLoading(state, action);
    case actionTypes.GET_SERVICES_ENABLED_SUCCESS: return getServicesEnabledSuccess(state, action);
    case actionTypes.GET_SERVICES_ENABLED_ERROR: return getServicesEnabledError(state, action);

    default: return state;
  }
};

const orgReducer = combineReducers({
  staticData: reducer,
  orgAddress: orgAddressReducer,
  orgContact: orgContactReducer,
  orgDetails: orgDetailsReducer,
  orgList: orgListReducer,
  orgProfile: orgProfileReducer,
  orgAccessData: orgAccessReducer,
  orgDocuments: orgDocumentsReducer,
  orgBgvConfig: orgBgvConfigReducer,
  orgOpsConfigReducer,
  orgOnboard: orgOnboardReducer,
  orgClientList: orgClientListReducer,
  orgClientDetails: orgClientDetailsReducer,
  orgBgvDashboard: orgBgvDashboardReducer,
  orgOnboardConfig: orgOnboardConfigReducer,
  orgOnboardDashboard: orgOnboardDashboardReducer,
  orgAttendConfig: orgAttendConfigReducer,
  orgAttendDashboard: orgAttendDashboardReducer,
});

export default orgReducer;
