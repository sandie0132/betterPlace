import { combineReducers } from 'redux';
import * as actionTypes from './actionTypes';
import { updateObject } from './utility';

import * as initData from './StaticDataInitData';

import empListReducer from '../EmpList/Store/reducer';
import empAddNewReducer from '../EmpAddNewModal/Store/reducer';
import profileReducer from '../EmpProfile/Store/reducer';
import empOnboardReducer from '../EmpOnboarding/Store/reducer';
import empTermiantionReducer from '../EmpTermination/Store/reducer';
import deployReducer from '../EmpList/EmpListFooter/Deploy/Store/reducer';
import tagTypeFilterReducer from '../EmpList/EmpFilters/TagTypeFilter/Store/reducer';
import vendorTypeFilterReducer from '../EmpList/EmpFilters/VendorTypeFilters/Store/reducer';
import empSearchReducer from '../EmpOnboarding/EmpDetails/EmpSearch/Store/reducer';
import empReportReducer from '../EmpBgvReport/Store/reducer';
import excelOnboardReducer from '../ExcelOnboarding/Store/reducer';
import excelTimeLineReducer from '../ExcelOnboarding/ExcelOnboardingRightNav/Store/reducer';

const initialState = {
  getDataState: 'INIT',
  empMgmtStaticData: { ...initData.empMgmtStaticData },
  orgData: null,
  getOrgDataState: 'INIT',
  servicesEnabled: null,
  getServicesEnabledState: 'INIT',
  getOrgOnboardConfigState: 'INIT',
  orgOnboardConfig: null,
  error: null,
  bgvConfigData: null,
  getBgvConfigDataState: 'INIT',
};

// INIT STATE REDUCERS
const initState = () => initialState;

// GET STATIC DATA REDUCERS
const getDataListLoading = (state) => updateObject(state, {
  getDataState: 'LOADING',
});

const getDataListSuccess = (state, action) => updateObject(state, {
  getDataState: 'SUCCESS',
  empMgmtStaticData: action.staticData,
  error: null,
});

const getDataListError = (state, action) => updateObject(state, {
  getEmpDataState: 'ERROR',
  error: action.error,
});

// GET ORG DATA REDUCERS
const getOrgDataLoading = (state) => updateObject(state, {
  getOrgDataState: 'LOADING',
});

const getOrgDataSuccess = (state, action) => updateObject(state, {
  getOrgDataState: 'SUCCESS',
  orgData: action.orgData,
  error: null,
});

const getOrgDataError = (state, action) => updateObject(state, {
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

// GET ORG ONBOARD CONFIG REDUCERS
const getOnboardConfigLoading = (state) => updateObject(state, {
  getOrgOnboardConfigState: 'LOADING',
});

const getOnboardConfigSuccess = (state, action) => updateObject(state, {
  getOrgOnboardConfigState: 'SUCCESS',
  orgOnboardConfig: action.orgOnboardConfig,
  error: null,
});

const getOnboardConfigError = (state, action) => updateObject(state, {
  getOrgOnboardConfigState: 'ERROR',
  error: action.error,
});

// GET ORG BGV CONFIG REDUCERS
const getBGVConfigLoading = (state) => updateObject(state, {
  getBgvConfigDataState: 'LOADING',
});

const getBGVConfigSuccess = (state, action) => updateObject(state, {
  getBgvConfigDataState: 'SUCCESS',
  bgvConfigData: action.bgvConfigData,
  error: null,
});

const getBGVConfigError = (state, action) => updateObject(state, {
  getBgvConfigDataState: 'ERROR',
  error: action.error,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INIT_STATE: return initState();

    case actionTypes.GET_DATA_LIST_LOADING: return getDataListLoading(state, action);
    case actionTypes.GET_DATA_LIST_SUCCESS: return getDataListSuccess(state, action);
    case actionTypes.GET_DATA_LIST_ERROR: return getDataListError(state, action);

    case actionTypes.GET_ORG_DATA_LOADING: return getOrgDataLoading(state, action);
    case actionTypes.GET_ORG_DATA_SUCCESS: return getOrgDataSuccess(state, action);
    case actionTypes.GET_ORG_DATA_ERROR: return getOrgDataError(state, action);

    case actionTypes.GET_SERVICES_ENABLED_LOADING: return getServicesEnabledLoading(state, action);
    case actionTypes.GET_SERVICES_ENABLED_SUCCESS: return getServicesEnabledSuccess(state, action);
    case actionTypes.GET_SERVICES_ENABLED_ERROR: return getServicesEnabledError(state, action);

    case actionTypes.GET_ORG_ONBOARD_CONFIG_LOADING: return getOnboardConfigLoading(state, action);
    case actionTypes.GET_ORG_ONBOARD_CONFIG_SUCCESS: return getOnboardConfigSuccess(state, action);
    case actionTypes.GET_ORG_ONBOARD_CONFIG_ERROR: return getOnboardConfigError(state, action);

    case actionTypes.GET_ORG_BGV_CONFIG_LOADING: return getBGVConfigLoading(state, action);
    case actionTypes.GET_ORG_BGV_CONFIG_SUCCESS: return getBGVConfigSuccess(state, action);
    case actionTypes.GET_ORG_BGV_CONFIG_ERROR: return getBGVConfigError(state, action);

    default: return state;
  }
};

// EMP MGMT REDUCERS
const empReducer = combineReducers({
  staticData: reducer,
  empList: empListReducer,
  empAddNew: empAddNewReducer,
  empProfile: profileReducer,
  empOnboard: empOnboardReducer,
  empTermination: empTermiantionReducer,
  empDeploy: deployReducer,
  empSearch: empSearchReducer,
  empTagFilter: tagTypeFilterReducer,
  empVendorFilter: vendorTypeFilterReducer,
  empReport: empReportReducer,
  excelOnboard: excelOnboardReducer,
  excelTimeline: excelTimeLineReducer,

});

export default empReducer;
