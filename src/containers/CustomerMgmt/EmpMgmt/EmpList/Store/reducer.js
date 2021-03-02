import * as actionTypes from './actionTypes';
import { updateObject } from '../../EmpMgmtStore/utility';

const initialState = {
  getEmployeeListState: 'INIT',
  getCountState: 'INIT',
  employeeList: [],
  filterPayload: {},
  getFilterPayloadState: 'INIT',
  dataCount: 0,
  isListEmpty: false,
  error: null,
  getTagInfoState: 'INIT',
  tagList: [],
  TagInfoData: [],
  getFilterTagState: 'INIT',
  postBulkActionState: 'INIT',
  actionName: null,
  clientSearchResult: [],
  clientSearchResultState: 'INIT',
  bgvInitiateDataState: 'INIT',
  bgvInitiateData: [],
  deployedEmpCount: 0,
  deployedEmpCountState: 'INIT',
};

// INIT STATE REDUCER
const initState = () => initialState;

// FILTER PAYLOAD REDUCER
const getFilterPayload = (state, action) => updateObject(state, {
  filterPayload: action.filterPayload,
  getFilterPayloadState: 'SUCCESS',
});

// GET COUNT REDUCERS
const getListCountLoading = (state) => updateObject(state, {
  getCountState: 'LOADING',
});

const getListCountSuccess = (state, action) => updateObject(state, {
  getCountState: 'SUCCESS',
  dataCount: action.dataCount,
  isListEmpty: action.isListEmpty,
});

const getListCountError = (state, action) => updateObject(state, {
  getCountState: 'ERROR',
  error: action.error,
});

// GET DATA REDUCERS
const getEmployeeListLoading = (state) => updateObject(state, {
  getEmployeeListState: 'LOADING',
  // dataList: []
});

const getEmployeeListSuccess = (state, action) => updateObject(state, {
  getEmployeeListState: 'SUCCESS',
  employeeList: action.employeeList,
  error: null,
});

const getEmployeeListError = (state, action) => updateObject(state, {
  getEmployeeListState: 'ERROR',
  error: action.error,
});

// SEARCH COUNT REDUCERS
const searchCountLoading = (state) => updateObject(state, {
  getCountState: 'LOADING',
});

const searchCountSuccess = (state, action) => updateObject(state, {
  getCountState: 'SUCCESS',
  dataCount: action.dataCount,
});

const searchCountError = (state, action) => updateObject(state, {
  getCountState: 'ERROR',
  error: action.error,
});

// SEARCH EMPLOYEE REDUCERS
const searchEmployeeLoading = (state) => updateObject(state, {
  getEmployeeListState: 'LOADING',
});

const searchEmployeeSuccess = (state, action) => updateObject(state, {
  getEmployeeListState: 'SUCCESS',
  employeeList: action.employeeList,
  error: null,
});

const searchEmployeeError = (state, action) => updateObject(state, {
  getEmployeeListState: 'ERROR',
  error: action.error,
});

// BULK ACTION REDUCERS
const postBulkEmployeesLoading = (state, action) => updateObject(state, {
  postBulkActionState: 'LOADING',
  actionName: action.actionName,
});

const postBulkEmployeesSuccess = (state) => updateObject(state, {
  postBulkActionState: 'SUCCESS',
  error: null,
});

const postBulkEmployeesError = (state, action) => updateObject(state, {
  postBulkActionState: 'ERROR',
  error: action.error,
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

const getFilterTagLoading = (state) => updateObject(state, {
  getFilterTagState: 'LOADING',
});

const getFilterTagSuccess = (state, action) => updateObject(state, {
  getFilterTagState: 'SUCCESS',
  TagInfoData: action.TagInfoData,
  error: null,
});

const getFilterTagError = (state, action) => updateObject(state, {
  getFilterTagState: 'ERROR',
  error: action.error,
});

// DEPLOYMENT CLIENT SEARCH
const getClientSearchLoading = (state) => updateObject(state, {
  clientSearchResultState: 'LOADING',
});

const getClientSearchSuccess = (state, action) => updateObject(state, {
  clientSearchResultState: 'SUCCESS',
  clientSearchResult: action.clientSearchResult,
  error: null,
});

const getClientSearchError = (state, action) => updateObject(state, {
  clientSearchResultState: 'ERROR',
  error: action.error,
});

// GET INITIATE BGV MODAL DATA
const getInitiateDataLoading = (state) => updateObject(state, {
  bgvInitiateDataState: 'LOADING',
});

const getInitiateDataSuccess = (state, action) => updateObject(state, {
  bgvInitiateDataState: 'SUCCESS',
  bgvInitiateData: action.bgvInitiateData,
  error: null,
});

const getInitiateDataError = (state, action) => updateObject(state, {
  bgvInitiateDataState: 'ERROR',
  error: action.error,
});

// DEPLOYED EMPLOYEE COUNT
const getDeployedEmpCountLoading = (state) => updateObject(state, {
  deployedEmpCountState: 'LOADING',
});

const getDeployedEmpCountSuccess = (state, action) => updateObject(state, {
  deployedEmpCountState: 'SUCCESS',
  deployedEmpCount: action.deployedEmpCount,
  error: null,
});

const getDeployedEmpCountError = (state, action) => updateObject(state, {
  deployedEmpCountState: 'ERROR',
  error: action.error,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INIT_STATE: return initState();

    case actionTypes.GET_FILTER_PAYLOAD_STATE: return getFilterPayload(state, action);

    case actionTypes.GET_LIST_COUNT_LOADING: return getListCountLoading(state, action);
    case actionTypes.GET_LIST_COUNT_SUCCESS: return getListCountSuccess(state, action);
    case actionTypes.GET_LIST_COUNT_ERROR: return getListCountError(state, action);

    case actionTypes.GET_EMPLOYEE_LIST_LOADING: return getEmployeeListLoading(state, action);
    case actionTypes.GET_EMPLOYEE_LIST_SUCCESS: return getEmployeeListSuccess(state, action);
    case actionTypes.GET_EMPLOYEE_LIST_ERROR: return getEmployeeListError(state, action);

    case actionTypes.SEARCH_EMP_COUNT_LOADING: return searchCountLoading(state, action);
    case actionTypes.SEARCH_EMP_COUNT_SUCCESS: return searchCountSuccess(state, action);
    case actionTypes.SEARCH_EMP_COUNT_ERROR: return searchCountError(state, action);

    case actionTypes.SEARCH_EMPLOYEE_LOADING: return searchEmployeeLoading(state, action);
    case actionTypes.SEARCH_EMPLOYEE_SUCCESS: return searchEmployeeSuccess(state, action);
    case actionTypes.SEARCH_EMPLOYEE_ERROR: return searchEmployeeError(state, action);

    case actionTypes.POST_BULK_ACTION_EMPLOYEES_LOADING:
      return postBulkEmployeesLoading(state, action);
    case actionTypes.POST_BULK_ACTION_EMPLOYEES_SUCCESS:
      return postBulkEmployeesSuccess(state, action);
    case actionTypes.POST_BULK_ACTION_EMPLOYEES_ERROR: return postBulkEmployeesError(state, action);

    case actionTypes.GET_TAG_INFO_LOADING: return getTagInfoDataLoading(state, action);
    case actionTypes.GET_TAG_INFO_SUCCESS: return getTagInfoDataSuccess(state, action);
    case actionTypes.GET_TAG_INFO_ERROR: return getTagInfoDataError(state, action);

    case actionTypes.GET_FILTER_TAG_MAP_LIST_LOADING: return getFilterTagLoading(state, action);
    case actionTypes.GET_FILTER_TAG_MAP_LIST_SUCCESS: return getFilterTagSuccess(state, action);
    case actionTypes.GET_FILTER_TAG_MAP_LIST_ERROR: return getFilterTagError(state, action);

    case actionTypes.GET_CLIENT_SEARCH_LOADING: return getClientSearchLoading(state, action);
    case actionTypes.GET_CLIENT_SEARCH_SUCCESS: return getClientSearchSuccess(state, action);
    case actionTypes.GET_CLIENT_SEARCH_ERROR: return getClientSearchError(state, action);

    case actionTypes.GET_INITIATE_DATA_LOADING: return getInitiateDataLoading(state, action);
    case actionTypes.GET_INITIATE_DATA_SUCCESS: return getInitiateDataSuccess(state, action);
    case actionTypes.GET_INITIATE_DATA_ERROR: return getInitiateDataError(state, action);

    case actionTypes.GET_DEPLOYED_EMPCOUNT_LOADING:
      return getDeployedEmpCountLoading(state, action);
    case actionTypes.GET_DEPLOYED_EMPCOUNT_SUCCESS:
      return getDeployedEmpCountSuccess(state, action);
    case actionTypes.GET_DEPLOYED_EMPCOUNT_ERROR:
      return getDeployedEmpCountError(state, action);

    default: return state;
  }
};

export default reducer;
