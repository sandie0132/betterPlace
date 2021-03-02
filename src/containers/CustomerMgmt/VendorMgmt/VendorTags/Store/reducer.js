/* eslint-disable max-len */
import * as actionTypes from './actionTypes';
import updateObject from '../../VendorMgmtStore/utility';

const initialState = {
  error: null,
  getVendorTagsCount: 0,
  getVendorTagsCountState: 'INIT',
  vendorTagsState: 'INIT',
  vendorTags: [],
  getOrgName: '',
  getOrgNameState: 'INIT',
  getVendorDataState: 'INIT',
  getVendorData: '',
  clientList: [],
  clientListState: 'INIT',
  getSelectedClientState: 'INIT',
  getSelectedClient: null,
  unassignData: null,
  unassignState: 'INIT',
  selectedFilterTagData: [],
  selectedFilterTagState: 'INIT',
  selectedFilterTagCount: 0,
  selectedFilterTagCountState: 'INIT',
};

const initState = () => initialState;

const getVendorTagsLoading = (state) => updateObject(state, {
  vendorTagsState: 'LOADING',
});

const getVendorTagsSuccess = (state, action) => updateObject(state, {
  vendorTagsState: 'SUCCESS',
  vendorTags: action.vendorTags,
});

const getVendorTagsError = (state, action) => updateObject(state, {
  vendorTagsState: 'ERROR',
  error: action.error,
});

const getOrgNameLoading = (state) => updateObject(state, {
  getOrgNameState: 'LOADING',
  error: null,
});

const getOrgNameSuccess = (state, action) => updateObject(state, {
  getOrgNameState: 'SUCCESS',
  getOrgName: action.orgName,
  error: null,
});

const getOrgNameError = (state, action) => updateObject(state, {
  getOrgNameState: 'ERROR',
  error: action.error,
});

const getSelectedClientLoading = (state) => updateObject(state, {
  getSelectedClientState: 'LOADING',
  error: null,
});

const getSelectedClientSuccess = (state, action) => updateObject(state, {
  getSelectedClientState: 'SUCCESS',
  getSelectedClient: action.selectedClient,
  error: null,
});

const getSelectedClientError = (state, action) => updateObject(state, {
  getSelectedClientState: 'ERROR',
  error: action.error,
});

const getVendorDataLoading = (state) => updateObject(state, {
  getVendorDataState: 'LOADING',
  error: null,
});

const getVendorDataSuccess = (state, action) => updateObject(state, {
  getVendorDataState: 'SUCCESS',
  getVendorData: action.vendorData,
  error: null,
});

const getVendorDataError = (state, action) => updateObject(state, {
  getVendorDataState: 'ERROR',
  error: action.error,
});

const getVendorTagsCountLoading = (state) => updateObject(state, {
  getVendorTagsCountState: 'LOADING',
  error: null,
});

const getVendorTagsCountSuccess = (state, action) => updateObject(state, {
  getVendorTagsCountState: 'SUCCESS',
  getVendorTagsCount: action.vendorTagsCount,
  error: null,
});

const getVendorTagsCountError = (state, action) => updateObject(state, {
  getVendorTagsCountState: 'ERROR',
  error: action.error,
});

const getClientListLoading = (state) => updateObject(state, {
  clientListState: 'LOADING',
  error: null,
});

const getClientListSuccess = (state, action) => updateObject(state, {
  clientListState: 'SUCCESS',
  clientList: action.clientList.filter((item) => item.status === 'active'),
  error: null,
});

const getClientListError = (state, action) => updateObject(state, {
  clientListState: 'ERROR',
  error: action.error,
});

const postUnassignTagsLoading = (state) => updateObject(state, {
  unassignState: 'LOADING',
  error: null,
});

const postUnassignTagsSuccess = (state, action) => updateObject(state, {
  unassignState: 'SUCCESS',
  unassignData: action.unassignData,
  error: null,
});

const postUnassignTagsError = (state, action) => updateObject(state, {
  unassignState: 'ERROR',
  error: action.error,
});

const getSelectedFilterTagDetailsLoading = (state) => updateObject(state, {
  selectedFilterTagState: 'LOADING',
  error: null,
});

const getSelectedFilterTagDetailsSuccess = (state, action) => updateObject(state, {
  selectedFilterTagState: 'SUCCESS',
  selectedFilterTagData: action.selectedFilterTagDetails,
  error: null,
});

const getSelectedFilterTagDetailsError = (state, action) => updateObject(state, {
  selectedFilterTagState: 'ERROR',
  error: action.error,
});

const getSelectedFilterTagCountLoading = (state) => updateObject(state, {
  selectedFilterTagCountState: 'LOADING',
  error: null,
});

const getSelectedFilterTagCountSuccess = (state, action) => updateObject(state, {
  selectedFilterTagCountState: 'SUCCESS',
  selectedFilterTagCount: action.selectedFilterTagCount,
  error: null,
});

const getSelectedFilterTagCountError = (state, action) => updateObject(state, {
  selectedFilterTagCountState: 'ERROR',
  error: action.error,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INIT_VENDOR_TAGS_STATE: return initState();

    case actionTypes.GET_VENDOR_TAGS_COUNT_LOADING: return getVendorTagsCountLoading(state, action);
    case actionTypes.GET_VENDOR_TAGS_COUNT_SUCCESS: return getVendorTagsCountSuccess(state, action);
    case actionTypes.GET_VENDOR_TAGS_COUNT_ERROR: return getVendorTagsCountError(state, action);

    case actionTypes.GET_VENDOR_TAGS_LOADING: return getVendorTagsLoading(state);
    case actionTypes.GET_VENDOR_TAGS_SUCCESS: return getVendorTagsSuccess(state, action);
    case actionTypes.GET_VENDOR_TAGS_ERROR: return getVendorTagsError(state, action);

    case actionTypes.GET_ORG_NAME_LOADING: return getOrgNameLoading(state);
    case actionTypes.GET_ORG_NAME_SUCCESS: return getOrgNameSuccess(state, action);
    case actionTypes.GET_ORG_NAME_ERROR: return getOrgNameError(state, action);

    case actionTypes.GET_SELECTED_CLIENT_LOADING: return getSelectedClientLoading(state);
    case actionTypes.GET_SELECTED_CLIENT_SUCCESS: return getSelectedClientSuccess(state, action);
    case actionTypes.GET_SELECTED_CLIENT_ERROR: return getSelectedClientError(state, action);

    case actionTypes.GET_VENDOR_DATA_LOADING: return getVendorDataLoading(state, action);
    case actionTypes.GET_VENDOR_DATA_SUCCESS: return getVendorDataSuccess(state, action);
    case actionTypes.GET_VENDOR_DATA_ERROR: return getVendorDataError(state, action);

    case actionTypes.GET_CLIENT_LIST_LOADING: return getClientListLoading(state, action);
    case actionTypes.GET_CLIENT_LIST_SUCCESS: return getClientListSuccess(state, action);
    case actionTypes.GET_CLIENT_LIST_ERROR: return getClientListError(state, action);

    case actionTypes.POST_UNASSIGN_VENDOR_TAGS_LOADING: return postUnassignTagsLoading(state, action);
    case actionTypes.POST_UNASSIGN_VENDOR_TAGS_SUCCESS: return postUnassignTagsSuccess(state, action);
    case actionTypes.POST_UNASSIGN_VENDOR_TAGS_ERROR: return postUnassignTagsError(state, action);

    case actionTypes.POST_SELECTED_FILTERS_TAG_DETAILS_LOADING: return getSelectedFilterTagDetailsLoading(state, action);
    case actionTypes.POST_SELECTED_FILTERS_TAG_DETAILS_SUCCESS: return getSelectedFilterTagDetailsSuccess(state, action);
    case actionTypes.POST_SELECTED_FILTERS_TAG_DETAILS_ERROR: return getSelectedFilterTagDetailsError(state, action);

    case actionTypes.POST_SELECTED_FILTERS_TAG_COUNT_LOADING: return getSelectedFilterTagCountLoading(state, action);
    case actionTypes.POST_SELECTED_FILTERS_TAG_COUNT_SUCCESS: return getSelectedFilterTagCountSuccess(state, action);
    case actionTypes.POST_SELECTED_FILTERS_TAG_COUNT_ERROR: return getSelectedFilterTagCountError(state, action);

    default: return state;
  }
};

export default reducer;
