import * as actionTypes from './actionTypes';
import { updateObject } from '../../../EmpMgmtStore/utility';

const initialState = {
  getDataState: 'INIT',
  putDataState: 'INIT',
  getTagInfoState: 'INIT',
  data: {},
  error: null,
  entityType: null,
  tagList: [],
  reportsToData: [],
  reportsToDataState: 'INIT',
  reportsToTagInfoState: 'INIT',
  reportsToTagInfo: [],
  orgData: [],
  orgDataState: 'INIT',

  sharedTagsInfo: {},
  sharedTagInfoState: 'INIT',
  deploymentHistoryState: 'INIT',
  deploymentHistory: {},
  orgNamemapping: {},

  getContractorData: {},
  getContractorDataState: 'INIT',
  putContractorData: {},
  putContractorDataState: 'INIT',
};

const initState = () => initialState;

// GET SHARED TAG INFO
const getSharedTagInfoLoading = (state) => updateObject(state, {
  sharedTagInfoState: 'LOADING',
});

const getSharedTagInfoSuccess = (state, action) => updateObject(state, {
  sharedTagInfoState: 'SUCCESS',
  sharedTagsInfo: action.sharedTagsInfo,
  error: null,
});

const getSharedTagInfoError = (state, action) => updateObject(state, {
  sharedTagInfoState: 'ERROR',
  error: action.error,
});

// GET ORG DATA
const getOrgDataLoading = (state) => updateObject(state, {
  orgDataState: 'LOADING',
});

const getOrgDataSuccess = (state, action) => updateObject(state, {
  orgDataState: 'SUCCESS',
  orgData: action.orgData,
  error: null,
});

const getOrgDataError = (state, action) => updateObject(state, {
  orgDataState: 'ERROR',
  error: action.error,
});

// GET REPORTS TO TAG INFO
const getReportsToTagInfoLoading = (state) => updateObject(state, {
  reportsToTagInfoState: 'LOADING',
});

const getReportsToTagInfoSuccess = (state, action) => updateObject(state, {
  reportsToTagInfoState: 'SUCCESS',
  reportsToTagInfo: action.reportsToTagInfo,
  error: null,
});

const getReportsToTagInfoError = (state, action) => updateObject(state, {
  reportsToTagInfoState: 'ERROR',
  error: action.error,
});

// GET REPORTS TO DATA
const getReportsToLoading = (state) => updateObject(state, {
  reportsToDataState: 'LOADING',
});

const getReportsToSuccess = (state, action) => updateObject(state, {
  reportsToDataState: 'SUCCESS',
  reportsToData: action.reportsToData,
  error: null,
});

const getReportsToError = (state, action) => updateObject(state, {
  reportsToDataState: 'ERROR',
  error: action.error,
});

// GET DATA REDUCERS
const getDataLoading = (state) => updateObject(state, {
  getDataState: 'LOADING',
});

const getDataSuccess = (state, action) => updateObject(state, {
  getDataState: 'SUCCESS',
  data: action.data,
  error: null,
});

const getDataError = (state, action) => updateObject(state, {
  getDataState: 'ERROR',
  error: action.error,
});

// PUT DATA REDUCERS
const putDataLoading = (state) => updateObject(state, {
  putDataState: 'LOADING',
});

const putDataSuccess = (state, action) => updateObject(state, {
  putDataState: 'SUCCESS',
  data: action.data,
  error: null,
});

const putDataError = (state, action) => updateObject(state, {
  putDataState: 'ERROR',
  putDataError: action.error,
});

// GET ENTITY DATA
const getEntityType = (state, action) => updateObject(state, {
  entityType: action.entityType,
});

/// SET REPORTS TO DATA
const handleSetReportsToData = (state, action) => updateObject(state, {
  reportsToData: action.reportsToData,
});

// RESET ERROR
const resetError = (state) => updateObject(state, {
  error: null,
  putDataError: null,
});

// GET TAGINFODATA REDUCERS
const getTagInfoDataLoading = (state) => updateObject(state, {
  getTagInfoState: 'LOADING',
});

const getTagInfoDataSuccess = (state, action) => updateObject(state, {
  getTagInfoState: 'SUCCESS',
  tagList: action.tagList,
  error: null,
});

const getTagInfoDataError = (state, action) => updateObject(state, {
  getTagInfoState: 'ERROR',
  error: action.error,
});

const deploymentHistoryLoading = (state) => updateObject(state, {
  deploymentHistoryState: 'LOADING',
});

const deploymentHistorySuccess = (state, action) => updateObject(state, {
  deploymentHistoryState: 'SUCCESS',
  deploymentHistory: action.deploymentHistory,
  error: null,
});

const deploymentHistoryError = (state, action) => updateObject(state, {
  deploymentHistoryState: 'ERROR',
  error: action.error,
});

// contractor details reducer
const getContractorDataLoading = (state) => updateObject(state, {
  getContractorDataState: 'LOADING',
});

const getContractorDataSuccess = (state, action) => updateObject(state, {
  getContractorDataState: 'SUCCESS',
  getContractorData: action.getContractorData,
  error: null,
});

const getContractorDataError = (state, action) => updateObject(state, {
  getContractorDataState: 'ERROR',
  error: action.error,
});

const putContractorDataLoading = (state) => updateObject(state, {
  putContractorDataState: 'LOADING',
});

const putContractorDataSuccess = (state, action) => updateObject(state, {
  putContractorDataState: 'SUCCESS',
  putContractorData: action.putContractorData,
  error: null,
});

const putContractorDataError = (state, action) => updateObject(state, {
  putContractorDataState: 'ERROR',
  error: action.error,
});

const getOrgListLoading = (state) => updateObject(state, {
  getOrgListState: 'LOADING',
});

const getOrgListSuccess = (state, action) => updateObject(state, {
  getOrgListState: 'SUCCESS',
  orgNamemapping: action.orgNameMapping,
  error: null,
});

const getOrgListError = (state, action) => updateObject(state, {
  getOrgListState: 'ERROR',
  error: action.error,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INIT_STATE: return initState();
    case actionTypes.RESET_ERROR: return resetError(state, action);

    case actionTypes.GET_DATA_LOADING: return getDataLoading(state, action);
    case actionTypes.GET_DATA_SUCCESS: return getDataSuccess(state, action);
    case actionTypes.GET_DATA_ERROR: return getDataError(state, action);

    case actionTypes.PUT_DATA_LOADING: return putDataLoading(state, action);
    case actionTypes.PUT_DATA_SUCCESS: return putDataSuccess(state, action);
    case actionTypes.PUT_DATA_ERROR: return putDataError(state, action);

    case actionTypes.GET_ENTITY_TYPE: return getEntityType(state, action);
    case actionTypes.SET_REPORTS_TO_DATA: return handleSetReportsToData(state, action);

    case actionTypes.GET_TAG_INFO_LOADING: return getTagInfoDataLoading(state, action);
    case actionTypes.GET_TAG_INFO_SUCCESS: return getTagInfoDataSuccess(state, action);
    case actionTypes.GET_TAG_INFO_ERROR: return getTagInfoDataError(state, action);

    case actionTypes.GET_SHARED_TAG_INFO_LOADING: return getSharedTagInfoLoading(state, action);
    case actionTypes.GET_SHARED_TAG_INFO_SUCCESS: return getSharedTagInfoSuccess(state, action);
    case actionTypes.GET_SHARED_TAG_INFO_ERROR: return getSharedTagInfoError(state, action);

    case actionTypes.GET_REPORTS_TO_DATA_LOADING: return getReportsToLoading(state, action);
    case actionTypes.GET_REPORTS_TO_DATA_SUCCESS: return getReportsToSuccess(state, action);
    case actionTypes.GET_REPORTS_TO_DATA_ERROR: return getReportsToError(state, action);

    case actionTypes.GET_REPORTS_TO_TAG_INFO_LOADING:
      return getReportsToTagInfoLoading(state, action);
    case actionTypes.GET_REPORTS_TO_TAG_INFO_SUCCESS:
      return getReportsToTagInfoSuccess(state, action);
    case actionTypes.GET_REPORTS_TO_TAG_INFO_ERROR: return getReportsToTagInfoError(state, action);

    case actionTypes.GET_ORG_DATA_LOADING: return getOrgDataLoading(state, action);
    case actionTypes.GET_ORG_DATA_SUCCESS: return getOrgDataSuccess(state, action);
    case actionTypes.GET_ORG_DATA_ERROR: return getOrgDataError(state, action);

    case actionTypes.GET_DEPLOYMENT_HISTORY_LOADING: return deploymentHistoryLoading(state);
    case actionTypes.GET_DEPLOYMENT_HISTORY_SUCCESS: return deploymentHistorySuccess(state, action);
    case actionTypes.GET_DEPLOYMENT_HISTORY_ERROR: return deploymentHistoryError(state, action);

    case actionTypes.GET_CONTRACTOR_DETAILS_LOADING: return getContractorDataLoading(state);
    case actionTypes.GET_CONTRACTOR_DETAILS_SUCCESS: return getContractorDataSuccess(state, action);
    case actionTypes.GET_CONTRACTOR_DETAILS_ERROR: return getContractorDataError(state, action);

    case actionTypes.PUT_CONTRACTOR_DETAILS_LOADING: return putContractorDataLoading(state);
    case actionTypes.PUT_CONTRACTOR_DETAILS_SUCCESS: return putContractorDataSuccess(state, action);
    case actionTypes.PUT_CONTRACTOR_DETAILS_ERROR: return putContractorDataError(state, action);

    case actionTypes.GET_ORG_LIST_INFO_LOADING: return getOrgListLoading(state);
    case actionTypes.GET_ORG_LIST_INFO_SUCCESS: return getOrgListSuccess(state, action);
    case actionTypes.GET_ORG_LIST_INFO_ERROR: return getOrgListError(state, action);

    default: return state;
  }
};

export default reducer;
